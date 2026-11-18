(function () {
  "use strict";

  const maxCount = 12;
  const maxLibraryBytes = 16 * 1024 * 1024;
  const maxInputBytes = 12 * 1024 * 1024;
  const maxImageBytes = 3 * 1024 * 1024;
  const outputSide = 768;

  function read(blob, method) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onload = function () { resolve(reader.result); };
      reader.onerror = reader.onabort = function () { reject(new Error("读不到这张图片，重新选一次试试。")); };
      reader[method](blob);
    });
  }

  function jpegDimensions(view) {
    for (let cursor = 2; cursor + 4 <= view.byteLength;) {
      if (view.getUint8(cursor++) !== 0xff) break;
      while (cursor < view.byteLength && view.getUint8(cursor) === 0xff) cursor += 1;
      if (cursor + 3 > view.byteLength) break;
      const marker = view.getUint8(cursor++);
      if (marker === 0xda || marker === 0xd9) break;
      const length = view.getUint16(cursor);
      if (length < 2 || cursor + length > view.byteLength) break;
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker) && length >= 8) {
        return { type: "image/jpeg", width: view.getUint16(cursor + 5), height: view.getUint16(cursor + 3) };
      }
      cursor += length;
    }
    return null;
  }

  function webpDimensions(view) {
    const end = view.getUint32(4, true) + 8;
    if (end > view.byteLength) return null;
    for (let cursor = 12; cursor + 8 <= end;) {
      const kind = view.getUint32(cursor);
      const length = view.getUint32(cursor + 4, true);
      const start = cursor + 8;
      if (start + length > end) break;
      if (kind === 0x56503858 && length >= 10) {
        const width = view.getUint32(start + 3, true) >>> 8;
        const height = view.getUint32(start + 6, true) >>> 8;
        return { type: "image/webp", width: width + 1, height: height + 1 };
      }
      if (kind === 0x5650384c && length >= 5 && view.getUint8(start) === 0x2f) {
        const packed = view.getUint32(start + 1, true);
        return { type: "image/webp", width: (packed & 0x3fff) + 1, height: ((packed >>> 14) & 0x3fff) + 1 };
      }
      if (kind === 0x56503820 && length >= 10 && view.getUint16(start + 3) === 0x9d01 && view.getUint8(start + 5) === 0x2a) {
        return {
          type: "image/webp",
          width: view.getUint16(start + 6, true) & 0x3fff,
          height: view.getUint16(start + 8, true) & 0x3fff
        };
      }
      cursor = start + length + (length % 2);
    }
    return null;
  }

  function imageDimensions(buffer) {
    const view = new DataView(buffer);
    if (view.byteLength >= 24 && view.getUint32(0) === 0x89504e47 &&
        view.getUint32(4) === 0x0d0a1a0a && view.getUint32(8) === 13 && view.getUint32(12) === 0x49484452) {
      return { type: "image/png", width: view.getUint32(16), height: view.getUint32(20) };
    }
    if (view.byteLength >= 4 && view.getUint16(0) === 0xffd8) return jpegDimensions(view);
    if (view.byteLength >= 20 && view.getUint32(0) === 0x52494646 &&
        view.getUint32(8) === 0x57454250) return webpDimensions(view);
    return null;
  }

  function validSize(width, height) {
    return width > 0 && height > 0 && Math.max(width, height) <= 8192 && width * height <= 24000000;
  }

  function decode(url) {
    return new Promise(function (resolve, reject) {
      const image = new Image();
      image.onload = function () { resolve(image); };
      image.onerror = function () { reject(new Error("打不开这张图片，换一张试试。")); };
      image.src = url;
    });
  }

  function pngBlob(canvas) {
    return new Promise(function (resolve, reject) {
      canvas.toBlob(function (blob) {
        if (blob && blob.size && blob.size <= maxImageBytes) resolve(blob);
        else reject(new Error("图片处理失败，请换一张。"));
      }, "image/png");
    });
  }

  async function normalize(file) {
    if (!file.size || file.size > maxInputBytes) throw new Error("请选择 12 MB 以内的图片。");
    const dimensions = imageDimensions(await read(file, "readAsArrayBuffer"));
    if (!dimensions) throw new Error("请选择 PNG、JPG 或 WebP 图片。");
    if (!validSize(dimensions.width, dimensions.height)) throw new Error("图片尺寸过大，请缩小后重试。");
    const url = URL.createObjectURL(file.slice(0, file.size, dimensions.type));
    try {
      const image = await decode(url);
      const width = image.naturalWidth;
      const height = image.naturalHeight;
      if (!validSize(width, height)) throw new Error("图片尺寸过大，请缩小后重试。");
      const ratio = Math.min(1, outputSide / Math.max(width, height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
      return await pngBlob(canvas);
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  async function loadAsset(meta, blob) {
    if (!blob.size || blob.size > maxImageBytes) throw new Error("纹样文件超出大小限制。");
    const dimensions = imageDimensions(await read(blob.slice(0, 24), "readAsArrayBuffer"));
    if (!dimensions || dimensions.type !== "image/png" || !validSize(dimensions.width, dimensions.height) ||
        Math.max(dimensions.width, dimensions.height) > outputSide) {
      throw new Error("纹样文件损坏。");
    }
    const src = URL.createObjectURL(blob);
    try {
      const image = await decode(src);
      return Object.assign({}, meta, { src, image, bytes: blob.size, composition: "custom" });
    } catch (error) {
      URL.revokeObjectURL(src);
      throw error;
    }
  }

  window.PrintyPatterns = {
    maxCount, maxLibraryBytes, maxImageBytes, normalize, loadAsset,
    dataUrl: function (blob) { return read(blob, "readAsDataURL"); },
    validId: function (id) { return typeof id === "string" && /^custom-[a-z0-9]{1,16}-[a-z0-9]{1,20}$/.test(id); }
  };
}());
