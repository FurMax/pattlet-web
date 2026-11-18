(function () {
  "use strict";

  const key = "printy.draft";
  const favoritesKey = "printy.favorites";
  const maxDraftBytes = 64 * 1024;
  const bridgeChunkBytes = 256 * 1024;
  const patterns = window.PrintyPatterns;

  async function boundedRead(promise) {
    let timer;
    const timeout = new Promise(function (resolve, reject) {
      timer = setTimeout(function () { reject(new Error("本地读取超时。")); }, 3500);
    });
    try {
      return await Promise.race([promise, timeout]);
    } finally {
      clearTimeout(timer);
    }
  }

  function supports(api, methods) {
    return Boolean(api) && methods.every(function (method) { return typeof api[method] === "function"; });
  }

  function version(env) {
    return Math.floor((Number(env.buildVersion) || 0) / 1000);
  }

  async function connect() {
    const xhs = window.xhs;
    const api = xhs && xhs.miniTool;
    let env = (xhs && xhs.launchOptions && xhs.launchOptions.miniToolEnv) || {};
    if ((!version(env) || (version(env) >= 9490 && !env.userDataPath)) && supports(api, ["getLaunchOptions"])) {
      try {
        const options = await boundedRead(api.getLaunchOptions());
        env = Object.assign({}, env, options && options.miniToolEnv);
      } catch (error) {
        // A synchronous client version can still enable draft configuration.
      }
    }
    const drafts = version(env) >= 9460 && supports(api, ["getStorage", "setStorage"]);
    const root = typeof env.userDataPath === "string" ? env.userDataPath : "";
    const images = drafts && version(env) >= 9490 && Boolean(root) && supports(api, [
      "getFileStorageInfo", "writeFile", "appendFile", "statFile", "readFile", "unlink"
    ]);
    let readQuota;

    function filePath(id) {
      if (!patterns.validId(id)) throw new Error("无效的纹样编号。");
      return root + (root.endsWith("/") ? "" : "/") + "printy-" + id + ".png";
    }

    async function readConfig(storageKey) {
      const result = await boundedRead(api.getStorage({ key: storageKey }));
      if (result && result.data === null) return undefined;
      if (!result || typeof result.data !== "string" || new Blob([result.data]).size > maxDraftBytes) {
        throw new Error("草稿数据不可读。");
      }
      return JSON.parse(result.data);
    }

    async function readDraft() {
      const draft = await readConfig(key);
      if (draft === undefined) return null;
      if (!draft || draft.version !== 1 || typeof draft.text !== "string" || !Array.isArray(draft.styles)) {
        throw new Error("草稿版本不可读。");
      }
      return draft;
    }

    async function writeConfig(storageKey, value) {
      const data = JSON.stringify(value);
      if (new Blob([data]).size > maxDraftBytes) throw new Error("草稿超出容量。");
      await api.setStorage({ key: storageKey, data });
    }

    async function readFavorites() {
      const saved = await readConfig(favoritesKey);
      if (saved === undefined) return [];
      if (!saved || saved.version !== 1 || !Array.isArray(saved.ids)) throw new Error("无法读取收藏。");
      return saved.ids;
    }

    async function removeImage(id) {
      if (!images) return false;
      try {
        await api.unlink({ filePath: filePath(id) });
        return true;
      } catch (error) {
        return /not found|no such file|不存在|ENOENT/i.test(String(error && (error.errMsg || error.message)));
      }
    }

    async function writeImage(id, blob) {
      const info = await api.getFileStorageInfo();
      const limit = Math.min(bridgeChunkBytes, Number(info.writeChunkMaxBytes));
      const chunkLength = Math.floor(limit / 4) * 4;
      if (!(chunkLength >= 4) || !Number.isFinite(info.limitBytes) || !Number.isFinite(info.usedBytes) ||
          info.usedBytes + blob.size > info.limitBytes) throw new Error("本地图片空间不足。");
      const path = filePath(id);
      const url = await patterns.dataUrl(blob);
      const data = url.slice(url.indexOf(",") + 1);
      try {
        let written = 0;
        for (let offset = 0; offset < data.length; offset += chunkLength) {
          const chunk = data.slice(offset, offset + chunkLength);
          const options = { filePath: path, data: chunk, encoding: "base64" };
          const result = offset === 0 ? await api.writeFile(options) : await api.appendFile(options);
          const padding = chunk.endsWith("==") ? 2 : chunk.endsWith("=") ? 1 : 0;
          const expected = chunk.length / 4 * 3 - padding;
          if (!result || result.writtenBytes !== expected) throw new Error("纹样文件写入不完整。");
          written += result.writtenBytes;
        }
        if (written !== blob.size) throw new Error("纹样文件写入不完整。");
      } catch (error) {
        await removeImage(id);
        throw error;
      }
    }

    async function readImage(meta) {
      const path = filePath(meta.id);
      if (!readQuota) readQuota = boundedRead(api.getFileStorageInfo());
      const info = await readQuota;
      const chunkSize = Math.floor(Math.min(bridgeChunkBytes, Number(info.readChunkMaxBytes)));
      if (!(chunkSize > 0)) throw new Error("无法读取本地纹样。");
      const stat = await boundedRead(api.statFile({ filePath: path }));
      if (!stat || stat.isDir || stat.size !== meta.bytes || !stat.size || stat.size > patterns.maxImageBytes) {
        throw new Error("纹样文件大小异常。");
      }
      const parts = [];
      for (let position = 0; position < stat.size;) {
        const length = Math.min(chunkSize, stat.size - position);
        const result = await boundedRead(api.readFile({ filePath: path, position, length, encoding: "base64" }));
        if (!result || typeof result.data !== "string" || result.data.length > Math.ceil(length / 3) * 4) {
          throw new Error("纹样文件读取不完整。");
        }
        const decoded = atob(result.data);
        if (!decoded.length || decoded.length !== result.bytesRead || decoded.length > length ||
            (result.eof && position + decoded.length !== stat.size)) throw new Error("纹样文件读取不完整。");
        const part = new Uint8Array(decoded.length);
        for (let index = 0; index < decoded.length; index++) part[index] = decoded.charCodeAt(index);
        parts.push(part);
        position += decoded.length;
      }
      return patterns.loadAsset(meta, new Blob(parts, { type: "image/png" }));
    }

    return {
      clientVersion: version(env), drafts, images, readDraft, readFavorites, writeImage, readImage, removeImage,
      writeDraft: function (draft) { return writeConfig(key, draft); },
      writeFavorites: function (ids) { return writeConfig(favoritesKey, { version: 1, ids }); }
    };
  }

  window.PrintyDraftStore = { connect };
}());
