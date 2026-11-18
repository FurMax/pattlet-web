(function () {
  "use strict";

  const filePreview = location.protocol === "file:" && window.PrintyLocalTextures;
  const webPreview = document.currentScript.hasAttribute("data-web-preview") && /^https?:$/.test(location.protocol);
  if (window.xhs || (!filePreview && !webPreview)) return;

  window.PrintyLocalPreview = {
    fabricSource: function (id) {
      return filePreview && filePreview[id];
    },
    downloadPNG: async function (canvas) {
      const png = await new Promise(function (resolve) {
        canvas.toBlob(resolve, "image/png");
      });
      if (!png) throw new Error("PNG export failed");
      const url = URL.createObjectURL(png);
      const link = document.createElement("a");
      link.href = url;
      link.download = "PATTLET.png";
      document.body.appendChild(link);
      try {
        link.click();
      } finally {
        link.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 30000);
      }
    }
  };
}());
