(function () {
  "use strict";

  const maxCharacters = 30;
  const maxLines = 3;
  const latinCharacter = /^[A-Za-z0-9&?, \n]$/;
  const hanCharacters = new Set(window.PattletHanCharacters);
  const inputHelp = "支持中英文、数字和部分符号 · 最多 3 行";
  const maxCanvasSide = 4096;
  const fontSize = 168;
  const wordSpace = Math.round(fontSize * .28);
  const defaultSize = 100;
  const pad = 13;
  const cropSize = 232;
  const stampDuration = 120;
  const edgingWidth = 8;
  const borderCacheLimit = 32;
  const defaultOutline = { enabled: true, color: "#876a83", width: 2 };
  const defaultPattern = { scale: 100, x: 0, y: 0 };
  const defaultProportion = { width: 100, height: 100 };
  const defaultPosition = { x: 0, y: 0, angle: 0 };
  const maxPositionX = 8192;
  const maxPositionY = 2048;
  const historyLimit = 40;
  const typefaces = {
    fraunces: { family: "Fraunces", weight: 900, bounds: [.06, .04, .78, .27] },
    mystery: { family: "Mystery Quest", weight: 400, bounds: [.17, .19, .85, .42] },
    germania: { family: "Germania One", weight: 400, bounds: [.16, .07, .77, .27] },
    sonsie: { family: "Sonsie One", weight: 400, bounds: [.17, .21, .87, .28] },
    kavoon: { family: "Kavoon", weight: 400, bounds: [.08, .06, .82, .24] },
    fugaz: { family: "Fugaz One", weight: 400, bounds: [.15, .09, .79, .37] },
    noto: { family: "Pattlet Noto SC", weight: 900, bounds: [.20, .20, 1.10, .32], han: true },
    maoken: { family: "Pattlet Zhuyuan", weight: 400, bounds: [.20, .20, 1.10, .32], han: true }
  };
  const themeFabrics = {
    fresh: [
      ["玫瑰波点", "seoul-dots"],
      ["雾蓝横条", "seoul-stripes"],
      ["杏粉格纹", "seoul-check"],
      ["鼠尾草波点", "tea-dots"],
      ["灰靛横条", "tea-stripes"],
      ["抹茶格纹", "tea-check"],
      ["覆盆子波点", "cream-raspberry-dots"],
      ["灰紫波点", "ivory-mauve-dots"],
      ["奶黄紫波点", "butter-lavender-dots"],
      ["杏底雾蓝波点", "peach-mist-blue-dots"],
      ["靛蓝奶油波点", "indigo-cream-dots"],
      ["婴儿蓝斜格", "baby-blue-plaid"],
      ["薄荷绿斜格", "mint-plaid"],
      ["浅草绿斜格", "light-green-plaid"],
      ["淡粉斜格", "blush-plaid"],
      ["淡紫斜格", "lilac-plaid"],
      ["薄荷底粉玫瑰蝴蝶结", "mint-rose-bows"],
      ["米白蓝玫瑰", "ivory-blue-roses"],
      ["黑底粉碎花", "black-pink-ditsy"],
      ["柔彩手工拼布", "pastel-quilt"],
      ["薰衣草星光刺绣", "lavender-embroidered-stars"],
      ["深蓝星空刺绣", "midnight-embroidered-stars"],
      ["复古紫蓝碎花", "vintage-lilac-blue-floral"],
      ["水蓝粉点", "aqua-pink-dots"],
      ["薄荷可可波点", "mint-cocoa-dots"],
      ["浅蓝深棕波点", "sky-espresso-dots"],
      ["淡紫白点", "lavender-white-dots"],
      ["丁香同色波点", "tone-on-tone-lilac-dots"],
      ["米白紫点", "ivory-purple-dots"],
      ["可可粉点", "cocoa-pink-dots"],
      ["奶粉深棕波点", "blush-espresso-dots"],
      ["米灰素布", "oat-plain-weave"],
      ["淡粉罗纹", "blush-ribbed-knit"],
      ["米白粗织布", "ivory-coarse-weave"],
      ["奶油蓝细条", "cream-blue-pinstripe"],
      ["粉彩蝴蝶结拼布", "pastel-bow-patchwork"],
      ["苹果绿小雏菊", "apple-green-daisies"],
      ["粉彩细竖条", "pastel-vertical-stripes"],
      ["米白复古提花", "ivory-damask"],
      ["奶油黄星", "butter-stars"],
      ["晴蓝奶黄星", "sky-yellow-stars"]
    ],
    candy: [
      ["糖果粉横条", "candy-pink-stripes"],
      ["奶黄紫横条", "candy-yellow-lavender-stripes"],
      ["蓝底粉横条", "candy-blue-pink-stripes"],
      ["粉底蓝横条", "candy-pink-blue-stripes"],
      ["浅蓝横条", "candy-soft-blue-stripes"],
      ["奶黄横条", "candy-soft-yellow-stripes"],
      ["淡紫横条", "candy-lilac-stripes"],
      ["紫底彩点", "candy-purple-dots"],
      ["杏底彩点", "candy-peach-dots"],
      ["奶油彩点", "candy-cream-dots"],
      ["薄荷彩点", "candy-mint-dots"],
      ["紫绿斜条", "candy-purple-green-diagonal"],
      ["橙蓝斜条", "candy-orange-blue-diagonal"],
      ["粉紫斜条", "candy-pink-purple-diagonal"],
      ["粉绿斜条", "candy-pink-green-diagonal"],
      ["蓝绿斜条", "candy-blue-green-diagonal"],
      ["粉底奶油绣点", "candy-pink-embroidered-dots"],
      ["奶黄蓝星藤蔓", "candy-yellow-blue-star-vines"],
      ["黄绿星纹绣格", "candy-lime-embroidered-star-grid"],
      ["柔黄奶油微点", "candy-yellow-cream-pin-dots"],
      ["蓝底黄竖波", "candy-blue-yellow-vertical-waves"],
      ["双色蓝横波", "candy-two-tone-blue-waves"],
      ["黄底紫圆环", "candy-yellow-purple-rings"],
      ["红黄斜波纹", "candy-red-yellow-diagonal-waves"],
      ["绿底黄花", "candy-green-yellow-flowers"],
      ["浅蓝黄圆环", "candy-sky-yellow-rings"],
      ["青绿粉横波", "candy-teal-pink-waves"],
      ["复古彩虹柔波", "candy-retro-rainbow-waves"],
      ["墨绿八角砖纹", "candy-green-octagon-tiles"],
      ["红底白点", "candy-red-white-dots"],
      ["白底红点", "candy-white-red-dots"],
      ["彩色积木", "candy-color-blocks"],
      ["粉绿晕染", "candy-pink-green-halos"],
      ["蓝米菱格红星", "candy-blue-red-star-diamonds"],
      ["黑白棋盘格", "candy-black-white-checker"],
      ["红白棋盘格", "candy-red-white-checker"]
    ],
    special: [
      ["花卉刺绣蕾丝", "special-floral-lace"],
      ["黑色繁花蕾丝", "special-black-floral-lace"],
      ["浅蓝豹纹丹宁", "special-blue-leopard-denim"],
      ["焦糖豹纹", "special-caramel-leopard"],
      ["奶油绒面豹纹", "special-cream-leopard"],
      ["灰白细豹纹", "special-grey-leopard"],
      ["黑白奶牛纹", "special-cow-print"],
      ["焦糖鹿斑绒", "special-caramel-fawn-spots"],
      ["金棕虎纹", "special-golden-tiger-stripes"],
      ["苔绿鳄鱼纹", "special-moss-croc-pattern"],
      ["米灰鳄鱼纹", "special-greige-croc-pattern"],
      ["黑白斑马纹", "special-zebra-stripes"],
      ["报纸拼贴", "special-newspaper-collage"],
      ["暖棕木纹", "special-warm-woodgrain"],
      ["褶皱牛皮纸", "special-crumpled-kraft-paper"],
      ["水洗浅蓝丹宁", "special-light-wash-denim"],
      ["浅蓝平针织", "special-blue-stockinette"],
      ["冰蓝麻花针织", "special-ice-blue-cable-knit"],
      ["冰蓝玻璃砖", "special-ice-blue-glass-mosaic"],
      ["粉色珠光马赛克", "special-pink-pearl-mosaic"],
      ["细沙波纹", "special-sand-ripples"],
      ["复古丹宁拼布", "special-denim-patchwork"],
      ["泳池蓝马赛克", "special-pool-blue-mosaic"],
      ["灰米拼石", "special-neutral-stone-mosaic"],
      ["青绿草坪", "special-green-lawn"],
      ["浅蓝水波", "special-light-blue-water"],
      ["焦糖华夫格", "special-waffle-grid"],
      ["浅绿豹纹", "special-pale-green-leopard"],
      ["黑色绒面豹纹", "special-black-leopard"],
      ["荧光绿闪粉", "special-green-glitter"],
      ["橄榄绿迷彩", "special-olive-camouflage"],
      ["沙色迷彩", "special-sand-camouflage"],
      ["银灰拉丝金属", "special-brushed-metal"],
      ["红砖墙", "special-red-brick"],
      ["蓝釉方砖", "special-blue-square-tiles"]
    ],
    holiday: [
      ["红绿织纹格", "holiday-tartan"],
      ["奶白斜织格", "holiday-twill-plaid"],
      ["金线红绿斜条", "holiday-gold-diagonal"],
      ["奶油圣诞小点", "holiday-micro-dots"],
      ["复古圣诞大波点", "holiday-retro-dots"],
      ["绿条圣诞彩灯", "holiday-string-lights"],
      ["菱格圣诞树", "holiday-diamond-trees"],
      ["橙底紫星", "holiday-purple-stars"],
      ["砖红百合窗花", "holiday-red-fleur-de-lis"],
      ["红绿针脚菱格", "holiday-argyle"]
    ],
    minnan: [
      ["红绿菱格花", "minnan-red-green-diamond-floral"],
      ["金底朱红花格", "minnan-gold-vermilion-floral-grid"],
      ["翠绿墨色花格", "minnan-green-ink-floral-grid"],
      ["青绿斜格白花", "minnan-green-white-diagonal-floral"],
      ["绿白细方格", "minnan-green-white-mini-check"],
      ["蓝底彩花白点", "minnan-blue-dotted-colorful-floral"],
      ["彩花邮票直格", "minnan-floral-stamps"],
      ["彩花邮票宽幅", "minnan-floral-stamps-wide"],
      ["亮蓝斜格白花", "minnan-blue-white-diagonal-floral"],
      ["绿白细碎花", "minnan-green-white-ditsy"],
      ["金黄朱芯连花", "minnan-gold-red-center-floral"],
      ["金黄绿芯连花", "minnan-gold-green-center-floral"],
      ["橙底彩花白点", "minnan-orange-dotted-colorful-floral"]
    ]
  };
  const fabricCatalog = new Map();
  const customPatterns = window.PrintyPatterns;
  const localPreview = window.PrintyLocalPreview;
  Object.values(themeFabrics).forEach(function (fabrics) {
    fabrics.forEach(function ([name, id]) {
      fabricCatalog.set(id, {
        id,
        name,
        src: "./assets/" + id + ".webp",
        composition: id === "special-newspaper-collage" ? "newspaper" : "single",
        image: null
      });
    });
  });

  const input = document.getElementById("letters");
  const inputNote = document.getElementById("input-note");
  const inputCount = document.getElementById("input-count");
  const newDraftButton = document.getElementById("new-draft");
  const retryDraft = document.getElementById("retry-draft");
  const draftNote = document.getElementById("draft-note");
  const draftStatus = document.getElementById("draft-status");
  const placeholder = document.getElementById("placeholder");
  const layoutNote = document.getElementById("layout-note");
  const previewViewport = document.getElementById("preview-viewport");
  const previewArt = document.getElementById("preview-art");
  const selectionFrame = document.getElementById("glyph-selection");
  const art = document.getElementById("art");
  const undoButton = document.getElementById("undo-edit");
  const redoButton = document.getElementById("redo-edit");
  const letterGap = document.getElementById("letter-gap");
  const letterGapValue = document.getElementById("letter-gap-value");
  const letterGapReset = document.getElementById("letter-gap-reset");
  const lineGap = document.getElementById("line-gap");
  const lineGapValue = document.getElementById("line-gap-value");
  const lineLayoutReset = document.getElementById("line-layout-reset");
  const alignmentButtons = Array.from(document.querySelectorAll("[data-align]"));
  const editorButtons = Array.from(document.querySelectorAll(".editor-controls button"));
  const editorPanel = document.getElementById("editor-panel");
  const workspace = editorPanel.parentNode;
  const narrowWorkspace = window.matchMedia("(max-width: 600px)");
  const visualViewport = window.visualViewport;
  const fabricTab = document.getElementById("fabric-tab");
  const typefaceTab = document.getElementById("typeface-tab");
  const typefacePanel = document.getElementById("typeface-panel");
  const glyphPicker = document.getElementById("glyph-picker");
  const mixedGlyphSlot = document.getElementById("mixed-glyph-slot");
  const fontModeButtons = Array.from(document.querySelectorAll("[data-font-mode]"));
  const fontButtons = Array.from(document.querySelectorAll(".font-choice"));
  const edgingButton = document.getElementById("fabric-edging");
  const edgingPalette = document.getElementById("edging-palette");
  const edgingColorButtons = Array.from(edgingPalette.querySelectorAll(".edging-color"));
  const themeButtons = Array.from(document.querySelectorAll(".theme"));
  const defaultTheme = themeButtons.find(function (button) { return button.getAttribute("aria-pressed") === "true"; }).dataset.theme;
  const randomButton = document.getElementById("random-fabrics");
  const fabricTheme = document.getElementById("fabric-theme");
  const fabricNote = document.getElementById("fabric-note");
  const patternLibrary = document.getElementById("pattern-library");
  const libraryButtons = Array.from(patternLibrary.querySelectorAll("[data-library]"));
  const builtinFilter = document.getElementById("builtin-filter");
  const customEmpty = document.getElementById("custom-empty");
  const favoritesEmpty = document.getElementById("favorites-empty");
  const favoritesNote = document.getElementById("favorites-note");
  const favoritesStatus = document.getElementById("favorites-status");
  const retryFavorites = document.getElementById("retry-favorites");
  const customFile = document.getElementById("custom-file");
  const customNote = document.getElementById("custom-note");
  const patternFillControl = document.getElementById("pattern-fill-control");
  const patternFill = document.getElementById("pattern-fill");
  const glyphs = document.getElementById("glyphs");
  const swatches = document.getElementById("swatches");
  const selectionNote = document.getElementById("selection-note");
  const singleLabel = document.getElementById("single-label");
  const glyphResetMenu = document.getElementById("glyph-reset-menu");
  const glyphSize = document.getElementById("glyph-size");
  const glyphSizeValue = document.getElementById("glyph-size-value");
  const glyphSizeReset = document.getElementById("glyph-size-reset");
  const naturalPosition = document.getElementById("natural-position");
  const positionReset = document.getElementById("glyph-position-reset");
  const allPositionReset = document.getElementById("all-position-reset");
  const angleControl = document.getElementById("glyph-angle");
  const maxRotationSine = Math.sin(Number(angleControl.max) * Math.PI / 180);
  const proportionReset = document.getElementById("proportion-reset");
  const proportionSliders = Array.from(document.querySelectorAll("[data-proportion]"), function (control) {
    return {
      control,
      property: control.dataset.proportion,
      output: document.querySelector('output[for="' + control.id + '"]')
    };
  });
  const positionSliders = Array.from(document.querySelectorAll("[data-position]"), function (control) {
    return {
      control,
      property: control.dataset.position,
      output: document.querySelector('output[for="' + control.id + '"]')
    };
  });
  const offsetControl = document.getElementById("glyph-offset");
  const defaultOffsetLimit = Number(offsetControl.max);
  const outlineButton = document.getElementById("glyph-outline");
  const outlineLockNote = document.getElementById("outline-lock-note");
  const outlineSettings = document.getElementById("outline-settings");
  const outlineColor = document.getElementById("outline-color");
  const outlineWidth = document.getElementById("outline-width");
  const outlineWidthValue = document.getElementById("outline-width-value");
  const patternReset = document.getElementById("pattern-reset");
  const patternSliders = Array.from(document.querySelectorAll("[data-pattern]"), function (control) {
    return {
      control,
      property: control.dataset.pattern,
      output: document.querySelector('output[for="' + control.id + '"]')
    };
  });
  const save = document.getElementById("save");
  const saveArea = save.parentNode;
  const saveNote = document.getElementById("save-note");
  const followPrompt = document.getElementById("author-follow");
  const followButton = document.getElementById("follow-author");
  const dismissFollow = document.getElementById("dismiss-follow");
  const followNote = document.getElementById("follow-note");
  const context = art.getContext("2d");
  const scratch = document.createElement("canvas");
  const mask = scratch.getContext("2d");
  const collage = document.createElement("canvas");
  const collageContext = collage.getContext("2d");
  const tile = document.createElement("canvas");
  const tileContext = tile.getContext("2d");
  const exteriorMask = document.createElement("canvas");
  const exterior = exteriorMask.getContext("2d");
  const borderLayers = new Map();
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let fontId = "fraunces";
  let defaultHanFont = "noto";
  let hanFontId = defaultHanFont;
  let fontMode = "uniform";
  let composing = false;
  let edgingEnabled = false;
  let edgingColor = edgingPalette.querySelector('[aria-pressed="true"]');
  let activeTheme = defaultTheme;
  let librarySource = "builtin";
  let lineAlignment = "center";
  let text = input.value;
  let letters = drawableLetters(text);
  const letterStyles = Array.from(letters, newLetterStyle);
  let selected = letters ? 0 : -1;
  let glyphLayout = [];
  let currentLayout = null;
  let renderScale = 1;
  let previewScale = 1;
  let drag = null;
  let ignoreDragClick = false;
  let ready = false;
  let saving = false;
  let followChecked = false;
  let revision = 0;
  let frame = 0;
  let pendingStamp = -1;
  let stamp = null;
  let customIdSequence = 0;
  let draftStore;
  let draftWritesAllowed = false;
  let draftDirty = false;
  let draftTimer = 0;
  let draftWrite = null;
  const retiredFiles = new Set();
  const undoSteps = [];
  const redoSteps = [];
  let historyState = "";
  let historyGroup;
  let loadedFonts = [];
  const favoriteIds = new Set();
  let favoritesWritable = false;
  let favoritesWrite = Promise.resolve();
  let favoritesMessage = "";
  let favoritesFailed = false;

  function loadFabric(fabric) {
    return new Promise(function (resolve, reject) {
      const image = new Image();
      image.onload = function () {
        fabric.image = image;
        resolve();
      };
      image.onerror = reject;
      image.src = (localPreview && localPreview.fabricSource(fabric.id)) || fabric.src;
    });
  }

  function randomFabric(excluded) {
    const fabrics = themeFabrics[activeTheme];
    const skip = fabrics.length > 1 ? fabrics.findIndex(function (fabric) { return fabric[1] === excluded; }) : -1;
    const index = Math.floor(Math.random() * (fabrics.length - (skip === -1 ? 0 : 1)));
    return fabrics[index + (skip !== -1 && index >= skip ? 1 : 0)][1];
  }

  function uniformFont(letter) {
    return hanCharacters.has(letter) ? hanFontId : fontId;
  }

  function newLetterStyle(letter) {
    return {
      fabric: randomFabric(),
      fill: "single",
      size: defaultSize,
      font: fontMode === "mixed" ? uniformFont(letter) : null,
      proportion: Object.assign({}, defaultProportion),
      position: Object.assign({}, defaultPosition),
      outline: Object.assign({}, defaultOutline),
      pattern: Object.assign({}, defaultPattern)
    };
  }

  function updateLetterStyles(next, caret) {
    let start = 0;
    let oldEnd = letters.length;
    let newEnd = next.length;
    let prefixLimit = Math.min(oldEnd, newEnd);
    if (caret !== undefined && oldEnd !== newEnd) {
      // Prefer the untouched suffix after the caret when adjacent glyphs match.
      const suffix = next.slice(caret);
      const editStart = Math.min(caret, caret + oldEnd - newEnd);
      if (editStart >= 0 && letters.endsWith(suffix)) prefixLimit = editStart;
    }
    while (start < prefixLimit && letters[start] === next[start]) {
      start += 1;
    }
    while (oldEnd > start && newEnd > start && letters[oldEnd - 1] === next[newEnd - 1]) {
      oldEnd -= 1;
      newEnd -= 1;
    }
    const changed = Array.from(next.slice(start, newEnd), newLetterStyle);
    letterStyles.splice(start, oldEnd - start, ...changed);
    return changed.length === 1 && oldEnd - start <= 1 ? start : -1;
  }

  function glyphFont(size, face) {
    return face.weight + " " + size + 'px "' + face.family + '"';
  }

  function measureGlyph(letter, index, percent) {
    const scale = percent / defaultSize;
    const size = fontSize * scale;
    const style = letterStyles[index];
    const face = typefaces[(fontMode === "mixed" && style.font) || uniformFont(letter)];
    const font = glyphFont(size, face);
    context.font = font;
    const metrics = context.measureText(letter);
    // Measured font bounds for older WebViews that only report the advance width.
    const [leftRatio, rightRatio, ascentRatio, descentRatio] = face.bounds;
    const left = Number.isFinite(metrics.actualBoundingBoxLeft) ? metrics.actualBoundingBoxLeft : size * leftRatio;
    const right = Number.isFinite(metrics.actualBoundingBoxRight) ? metrics.actualBoundingBoxRight : metrics.width + size * rightRatio;
    const ascent = Number.isFinite(metrics.actualBoundingBoxAscent) ? metrics.actualBoundingBoxAscent : size * ascentRatio;
    const descent = Number.isFinite(metrics.actualBoundingBoxDescent) ? metrics.actualBoundingBoxDescent : size * descentRatio;
    // Leave room on each edge for the scaled outline.
    const inset = Math.ceil(Math.max(0, left)) + 3;
    const glyph = {
      letter, index, face, font, scale, inset,
      advance: metrics.width,
      width: inset + Math.ceil(Math.max(metrics.width, right)) + 3,
      ascent: Math.ceil(Math.max(0, ascent)) + 3,
      descent: Math.ceil(Math.max(0, descent)) + 3
    };
    const { position, proportion } = style;
    glyph.stretchX = proportion.width / 100;
    glyph.stretchY = proportion.height / 100;
    glyph.boxWidth = glyph.width * glyph.stretchX;
    glyph.boxAscent = glyph.ascent * glyph.stretchY;
    glyph.boxDescent = glyph.descent * glyph.stretchY;
    glyph.angle = position.angle * Math.PI / 180;
    const halfWidth = glyph.boxWidth / 2;
    const halfHeight = (glyph.boxAscent + glyph.boxDescent) / 2;
    const insetBorder = borderPadding(glyph);
    const cosine = Math.abs(Math.cos(glyph.angle));
    const sine = Math.abs(Math.sin(glyph.angle));
    glyph.extentX = cosine * (halfWidth + insetBorder * glyph.stretchX) + sine * (halfHeight + insetBorder * glyph.stretchY);
    glyph.extentY = sine * (halfWidth + insetBorder * glyph.stretchX) + cosine * (halfHeight + insetBorder * glyph.stretchY);
    glyph.layoutInset = glyph.angle ? Math.ceil(Math.max(0, glyph.extentX - halfWidth)) : 0;
    glyph.layoutWidth = glyph.boxWidth + 2 * glyph.layoutInset;
    const extraY = glyph.angle ? Math.ceil(Math.max(0, glyph.extentY - halfHeight)) : 0;
    glyph.layoutAscent = glyph.boxAscent + extraY;
    glyph.layoutDescent = glyph.boxDescent + extraY;
    return glyph;
  }

  function layoutText() {
    const gap = Number(letterGap.value);
    const defaultGap = Number(letterGap.defaultValue);
    const maxGap = Number(letterGap.max);
    const maxSize = Number(glyphSize.max);
    const maxBorder = Math.ceil(Math.max(edgingWidth, Number(outlineWidth.max)) * maxSize / defaultSize);
    const rowGap = Number(lineGap.value);
    const defaultRowGap = Number(lineGap.defaultValue);
    let index = 0;
    const rows = text.split("\n").map(function (line) { return line.trim(); }).filter(Boolean).map(function (line) {
      let x = 0;
      let defaultWidth = 0;
      let maxWidth = 0;
      let ascent = 0;
      let descent = 0;
      let unshiftedAscent = 0;
      let unshiftedDescent = 0;
      let defaultAscent = 0;
      let defaultDescent = 0;
      let previousGlyph = null;
      const glyphs = [];
      for (const letter of line) {
        if (letter === " ") {
          x += wordSpace;
          defaultWidth += wordSpace;
          maxWidth += wordSpace;
          continue;
        }
        const size = letterStyles[index].size;
        const glyph = measureGlyph(letter, index, size);
        const normal = size === defaultSize ? glyph : measureGlyph(letter, index, defaultSize);
        const largest = size === maxSize ? glyph : measureGlyph(letter, index, maxSize);
        index += 1;
        if (previousGlyph) {
          const overlapLimit = Math.floor(Math.min(previousGlyph.layoutWidth, glyph.layoutWidth) / 3);
          x += Math.max(gap, -overlapLimit);
        }
        glyph.x = x + glyph.layoutInset;
        x += glyph.layoutWidth;
        defaultWidth += normal.width;
        // Reserve the maximum rotation and border budget before applying the canvas width limit.
        const largestHalfHeight = (largest.boxAscent + largest.boxDescent) / 2;
        maxWidth += largest.boxWidth + 2 * Math.ceil(
          maxBorder * largest.stretchX + maxRotationSine * (largestHalfHeight + maxBorder * largest.stretchY)
        );
        previousGlyph = glyph;
        ascent = Math.max(ascent, glyph.layoutAscent);
        descent = Math.max(descent, glyph.layoutDescent);
        unshiftedAscent = Math.max(unshiftedAscent, glyph.ascent);
        unshiftedDescent = Math.max(unshiftedDescent, glyph.descent);
        defaultAscent = Math.max(defaultAscent, normal.ascent);
        defaultDescent = Math.max(defaultDescent, normal.descent);
        glyphs.push(glyph);
      }
      const gaps = glyphs.length - 1;
      return {
        glyphs, width: x, ascent, descent,
        unshiftedHeight: unshiftedAscent + unshiftedDescent,
        defaultWidth: defaultWidth + gaps * defaultGap,
        defaultHeight: defaultAscent + defaultDescent,
        maxWidth: maxWidth + gaps * maxGap
      };
    });
    const width = Math.max(...rows.map(function (row) { return row.width; }));
    let left = 0;
    let top = 0;
    let right = width + 2 * pad;
    let bottom = 0;
    let y = pad;
    rows.forEach(function (row) {
      const extra = width - row.width;
      const offset = pad + (lineAlignment === "left" ? 0 : lineAlignment === "right" ? extra : Math.round(extra / 2));
      row.glyphs.forEach(function (glyph) {
        const position = letterStyles[glyph.index].position;
        glyph.x += offset + position.x;
        glyph.baseline = y + row.ascent + position.y;
        glyph.centerX = glyph.x + glyph.boxWidth / 2;
        glyph.centerY = glyph.baseline + (glyph.boxDescent - glyph.boxAscent) / 2;
        glyphLayout.push(glyph);
        if (position.x || position.y || glyph.stretchX !== 1 || glyph.stretchY !== 1) {
          left = Math.min(left, Math.floor(glyph.centerX - glyph.extentX) - 2);
          top = Math.min(top, Math.floor(glyph.centerY - glyph.extentY) - 2);
          right = Math.max(right, Math.ceil(glyph.centerX + glyph.extentX) + 2);
          bottom = Math.max(bottom, Math.ceil(glyph.centerY + glyph.extentY) + 2);
        }
      });
      y += row.ascent + row.descent + rowGap;
    });
    bottom = Math.max(y - rowGap + pad, bottom);
    if (drag && drag.frame) {
      ({ left, top, right, bottom } = drag.frame);
    }
    if (left || top) {
      glyphLayout.forEach(function (glyph) {
        glyph.x -= left;
        glyph.baseline -= top;
        glyph.centerX -= left;
        glyph.centerY -= top;
      });
    }
    return {
      left, top,
      width: right - left,
      height: bottom - top,
      unshiftedHeight: rows.reduce(function (total, row) { return total + row.unshiftedHeight; }, 2 * pad) + (rows.length - 1) * rowGap,
      defaultWidth: Math.max(...rows.map(function (row) { return row.defaultWidth; })) + 2 * pad,
      defaultHeight: rows.reduce(function (total, row) { return total + row.defaultHeight; }, 2 * pad) + (rows.length - 1) * defaultRowGap,
      maxWidth: Math.max(...rows.map(function (row) { return row.maxWidth; })) + 2 * pad
    };
  }

  function borderPadding(glyph) {
    const outline = letterStyles[glyph.index].outline;
    const width = edgingEnabled ? edgingWidth : outline.enabled ? outline.width : 0;
    return Math.ceil(width * glyph.scale);
  }

  function paintExteriorMask(glyph, inset, width, height) {
    exteriorMask.width = width;
    exteriorMask.height = height;
    exterior.font = glyph.font;
    exterior.fillText(glyph.letter, glyph.inset + inset, glyph.ascent + inset);
    const image = exterior.getImageData(0, 0, width, height);
    const { data } = image;
    const pixelCount = width * height;
    const outside = new Uint8Array(pixelCount);
    const queue = new Uint32Array(pixelCount);
    let tail = 0;

    function visit(pixel) {
      if (outside[pixel] || data[pixel * 4 + 3] >= 128) return;
      outside[pixel] = 1;
      queue[tail++] = pixel;
    }

    // Trace the space reachable from the canvas margin, leaving enclosed counters untouched.
    visit(0);
    for (let head = 0; head < tail; head += 1) {
      const pixel = queue[head];
      const column = pixel % width;
      if (column > 0) visit(pixel - 1);
      if (column < width - 1) visit(pixel + 1);
      if (pixel >= width) visit(pixel - width);
      if (pixel < pixelCount - width) visit(pixel + width);
    }
    for (let pixel = 0; pixel < pixelCount; pixel += 1) {
      const alpha = pixel * 4 + 3;
      data[alpha] = outside[pixel] ? 255 - data[alpha] : 0;
    }
    exterior.putImageData(image, 0, 0);
  }

  function getBorderLayer(glyph, inset, cache) {
    const outline = letterStyles[glyph.index].outline;
    const { color, rim } = edgingColor.dataset;
    const borderKey = edgingEnabled ? "edging:" + color : "outline:" + outline.color + ":" + outline.width;
    const key = glyph.font + ":" + glyph.letter + ":" + borderKey;
    const cached = cache.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = glyph.width + 2 * inset;
    canvas.height = glyph.ascent + glyph.descent + 2 * inset;
    const edge = canvas.getContext("2d");
    const x = glyph.inset + inset;
    const y = glyph.ascent + inset;
    edge.font = glyph.font;
    edge.lineJoin = "round";
    if (edgingEnabled) {
      edge.strokeStyle = rim;
      edge.lineWidth = 2 * edgingWidth * glyph.scale;
      edge.strokeText(glyph.letter, x, y);
      edge.strokeStyle = color;
      edge.lineWidth = 14.5 * glyph.scale;
      edge.strokeText(glyph.letter, x, y);
      edge.strokeStyle = "#fff4de";
      edge.lineWidth = 13 * glyph.scale;
      edge.setLineDash([4.8 * glyph.scale, 6.2 * glyph.scale]);
      edge.strokeText(glyph.letter, x, y);
      // Cover the inner portion of the dashed stroke so the stitches sit on the band.
      edge.setLineDash([]);
      edge.strokeStyle = color;
      edge.lineWidth = 7 * glyph.scale;
      edge.strokeText(glyph.letter, x, y);
    } else {
      edge.strokeStyle = outline.color;
      edge.lineWidth = 2 * outline.width * glyph.scale;
      edge.strokeText(glyph.letter, x, y);
    }
    paintExteriorMask(glyph, inset, canvas.width, canvas.height);
    edge.globalCompositeOperation = "destination-in";
    edge.drawImage(exteriorMask, 0, 0);

    if (cache.size >= borderCacheLimit) cache.delete(cache.keys().next().value);
    cache.set(key, canvas);
    return canvas;
  }

  function paintGlyph(glyph, target, detailScale = 1, cache = borderLayers) {
    const style = letterStyles[glyph.index];
    const chosen = fabricCatalog.get(style.fabric);
    const fabric = chosen && chosen.image ? chosen : fabricCatalog.get(themeFabrics[activeTheme][0][1]);
    const raster = detailScale === 1 ? glyph : {
      letter: glyph.letter,
      index: glyph.index,
      scale: glyph.scale * detailScale,
      font: glyphFont(fontSize * glyph.scale * detailScale, glyph.face),
      width: glyph.width * detailScale,
      ascent: glyph.ascent * detailScale,
      descent: glyph.descent * detailScale,
      inset: glyph.inset * detailScale,
      advance: glyph.advance * detailScale
    };
    scratch.width = raster.width;
    scratch.height = raster.ascent + raster.descent;
    paintFabric(raster, fabric, style.pattern, style.fill);
    mask.globalCompositeOperation = "destination-in";
    mask.font = raster.font;
    mask.fillText(raster.letter, raster.inset, raster.ascent);
    const topOfGlyph = glyph.baseline - glyph.boxAscent;
    const inset = borderPadding(glyph);
    if (glyph.angle) {
      target.save();
      target.translate(glyph.centerX, glyph.centerY);
      target.rotate(glyph.angle);
      target.translate(-glyph.centerX, -glyph.centerY);
    }
    if (inset) {
      const border = getBorderLayer(raster, inset * detailScale, cache);
      target.drawImage(border, glyph.x - inset * glyph.stretchX, topOfGlyph - inset * glyph.stretchY,
        (glyph.width + 2 * inset) * glyph.stretchX, (glyph.ascent + glyph.descent + 2 * inset) * glyph.stretchY);
    }
    target.drawImage(scratch, glyph.x, topOfGlyph, glyph.boxWidth, glyph.boxAscent + glyph.boxDescent);
    if (glyph.angle) target.restore();
  }

  function hasPatternTransform(pattern) {
    return pattern.scale !== defaultPattern.scale || pattern.x !== defaultPattern.x || pattern.y !== defaultPattern.y;
  }

  function paintFabric(glyph, fabric, pattern, fill) {
    const image = fabric.image;
    if (fabric.composition === "custom") {
      const width = image.naturalWidth;
      const height = image.naturalHeight;
      const factor = fill === "tile"
        ? 96 * glyph.scale / Math.max(width, height)
        : Math.max(scratch.width / width, scratch.height / height);
      const targetWidth = width * factor;
      const targetHeight = height * factor;
      drawFabric(image, (scratch.width - targetWidth) / 2, (scratch.height - targetHeight) / 2,
        targetWidth, targetHeight, pattern, fill);
      return;
    }
    const crop = Math.max(cropSize * glyph.scale, scratch.width, scratch.height);
    const preferredLeft = glyph.inset + (glyph.advance - crop) / 2 + (glyph.index % 3 - 1) * 5 * glyph.scale;
    const preferredTop = glyph.ascent - 178 * glyph.scale;
    const left = Math.max(scratch.width - crop, Math.min(0, preferredLeft));
    const top = Math.max(scratch.height - crop, Math.min(0, preferredTop));
    if (fabric.composition !== "newspaper") {
      drawFabric(image, left, top, crop, crop, pattern);
      return;
    }
    mask.drawImage(image, left, top, crop, crop);
    paintNewspaperClippings(image, glyph.scale, glyph.index);
    if (hasPatternTransform(pattern)) {
      collage.width = scratch.width;
      collage.height = scratch.height;
      collageContext.drawImage(scratch, 0, 0);
      mask.clearRect(0, 0, scratch.width, scratch.height);
      drawFabric(collage, 0, 0, collage.width, collage.height, pattern);
    }
  }

  function drawFabric(image, left, top, width, height, pattern, fill = "mirror") {
    if (fill === "mirror" && !hasPatternTransform(pattern)) {
      mask.drawImage(image, left, top, width, height);
      return;
    }
    const zoom = pattern.scale / 100;
    const tileWidth = Math.max(1, Math.round(width * zoom));
    const tileHeight = Math.max(1, Math.round(height * zoom));
    const centerX = scratch.width / 2;
    const centerY = scratch.height / 2;
    const originX = Math.round(centerX + (left - centerX) * zoom + scratch.width * pattern.x / 100);
    const originY = Math.round(centerY + (top - centerY) * zoom + scratch.height * pattern.y / 100);
    if (fill === "single") {
      mask.drawImage(image, originX, originY, tileWidth, tileHeight);
      return;
    }
    if (fill === "tile") {
      tile.width = tileWidth;
      tile.height = tileHeight;
      tileContext.drawImage(image, 0, 0, tileWidth, tileHeight);
      const repeat = mask.createPattern(tile, "repeat");
      if (repeat) {
        mask.save();
        mask.translate(originX, originY);
        mask.fillStyle = repeat;
        mask.fillRect(-originX, -originY, scratch.width, scratch.height);
        mask.restore();
      }
      return;
    }
    // Reflect neighbors to cover the glyph without gaps at the image edges.
    for (let row = Math.floor(-originY / tileHeight); originY + row * tileHeight < scratch.height; row += 1) {
      const flipY = row % 2 !== 0;
      const y = originY + row * tileHeight;
      for (let column = Math.floor(-originX / tileWidth); originX + column * tileWidth < scratch.width; column += 1) {
        const flipX = column % 2 !== 0;
        const x = originX + column * tileWidth;
        mask.save();
        mask.translate(x + (flipX ? tileWidth : 0), y + (flipY ? tileHeight : 0));
        mask.scale(flipX ? -1 : 1, flipY ? -1 : 1);
        mask.drawImage(image, 0, 0, tileWidth, tileHeight);
        mask.restore();
      }
    }
  }

  function paintNewspaperClippings(image, scale, index) {
    const { width, height } = scratch;
    const size = Math.hypot(width, height);
    const pieces = [
      { seam: .33, tilt: -.10, rotation: -.16, x: .42, y: .04 },
      { seam: .68, tilt: .08, rotation: .13, x: .07, y: .45 }
    ];
    const edge = [[0, 0], [.22, .02], [.42, -.01], [.58, .02], [.81, -.015], [1, 0]];
    pieces.forEach(function (piece) {
      const seam = new Path2D();
      edge.forEach(function ([x, offset], point) {
        const y = (piece.seam + piece.tilt * (x - .5) + offset) * height;
        if (point === 0) seam.moveTo(0, y);
        else seam.lineTo(x * width, y);
      });
      const clipping = new Path2D(seam);
      clipping.lineTo(width, height);
      clipping.lineTo(0, height);
      clipping.closePath();
      mask.save();
      mask.clip(clipping);
      mask.translate(width / 2, height / 2);
      mask.rotate(piece.rotation);
      const sourceX = (piece.x + (index % 3) * .025) * image.width;
      mask.drawImage(image, sourceX, piece.y * image.height, image.width / 2, image.height / 2,
        -size / 2, -size / 2, size, size);
      mask.restore();
      mask.strokeStyle = "rgba(92, 73, 56, .55)";
      mask.lineWidth = 1.5 * scale;
      mask.stroke(seam);
    });
  }

  function stampLayer(bounds) {
    const canvas = document.createElement("canvas");
    canvas.width = bounds.width;
    canvas.height = bounds.height;
    return canvas;
  }

  function paintStampLayer(bounds, layerGlyphs) {
    if (!layerGlyphs.length) return null;
    const canvas = stampLayer(bounds);
    const layer = canvas.getContext("2d");
    layer.setTransform(renderScale, 0, 0, renderScale, -bounds.x, -bounds.y);
    layerGlyphs.forEach(function (glyph) { paintGlyph(glyph, layer); });
    return canvas;
  }

  function drawStamp(scale) {
    const { bounds, base, letter, front, final, baseline } = stamp;
    const { x, y, width, height } = bounds;
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(x, y, width, height);
    if (scale === 1) {
      context.drawImage(final, x, y);
    } else {
      if (base) context.drawImage(base, x, y);
      context.drawImage(letter, x, y + baseline * (1 - scale), width, height * scale);
      if (front) context.drawImage(front, x, y);
    }
    context.restore();
  }

  function finishStamp() {
    if (!stamp) return;
    cancelAnimationFrame(stamp.frame);
    drawStamp(1);
    stamp = null;
  }

  function startStamp(glyph) {
    const x = Math.max(0, Math.floor((glyph.centerX - glyph.extentX) * renderScale));
    const y = Math.max(0, Math.floor((glyph.centerY - glyph.extentY) * renderScale));
    const right = Math.min(art.width, Math.ceil((glyph.centerX + glyph.extentX) * renderScale));
    const bottom = Math.min(art.height, Math.ceil((glyph.centerY + glyph.extentY) * renderScale));
    const bounds = { x, y, width: right - x, height: bottom - y };
    const neighbors = glyphLayout.filter(function (item) {
      return item.index !== glyph.index &&
        (item.centerX - item.extentX) * renderScale < right && (item.centerX + item.extentX) * renderScale > x &&
        (item.centerY - item.extentY) * renderScale < bottom &&
        (item.centerY + item.extentY) * renderScale > y;
    });
    const final = stampLayer(bounds);
    final.getContext("2d").drawImage(art, x, y, bounds.width, bounds.height, 0, 0, bounds.width, bounds.height);
    stamp = {
      bounds, final,
      baseline: glyph.baseline * renderScale - y,
      base: paintStampLayer(bounds, neighbors.filter(function (item) { return item.index < glyph.index; })),
      letter: paintStampLayer(bounds, [glyph]),
      front: paintStampLayer(bounds, neighbors.filter(function (item) { return item.index > glyph.index; })),
      frame: 0
    };
    const start = performance.now();
    drawStamp(.96);
    function tick(now) {
      const progress = Math.max(0, (now - start) / stampDuration);
      if (progress >= 1 || reducedMotion.matches) {
        finishStamp();
        return;
      }
      // Press down quickly, then ease back to the full-height glyph.
      const release = Math.max(0, (progress - .24) / .76);
      const scale = progress < .24 ? .96 - .06 * progress / .24 : 1 - .10 * (1 - release) ** 2;
      drawStamp(scale);
      stamp.frame = requestAnimationFrame(tick);
    }
    stamp.frame = requestAnimationFrame(tick);
  }

  function updatePreviewOverflow(overflow) {
    previewViewport.classList.toggle("is-wide", overflow);
    previewViewport.tabIndex = overflow ? 0 : -1;
    if (!overflow && previewViewport.scrollLeft) previewViewport.scrollLeft = 0;
  }

  function updatePreview() {
    const compact = narrowWorkspace.matches && viewportHeight() < 760 && !workspace.classList.contains("input-active");
    workspace.classList.toggle("compact-preview", compact);
    if (!currentLayout) {
      previewViewport.classList.remove("moving");
      previewArt.style.width = "";
      selectionFrame.hidden = true;
      updatePreviewOverflow(false);
      layoutNote.hidden = true;
      updateScrollMode();
      return;
    }
    const available = previewViewport.clientWidth;
    // Let the transformed canvas grow at the scale of the untransformed layout.
    const height = Math.max(currentLayout.defaultHeight, currentLayout.unshiftedHeight);
    const rows = text.split("\n").filter(function (line) { return line.trim(); }).length;
    const displayHeight = compact ? 80 + (rows - 1) * 8 : 112 + (rows - 1) * 16;
    const dragging = drag && drag.frame;
    previewViewport.classList.toggle("moving", Boolean(dragging));
    previewScale = dragging ? drag.frame.scale : Math.min(available / currentLayout.defaultWidth, displayHeight / height, 1);
    const width = currentLayout.width * previewScale;
    art.style.width = width + "px";
    art.style.height = currentLayout.height * previewScale + "px";
    previewArt.style.width = art.style.width;
    updateSelectionFrame();
    const overflow = Math.round(width) > available;
    updatePreviewOverflow(overflow);
    if (dragging) return;
    layoutNote.hidden = !overflow && (fontSize * previewScale >= 34 || rows > 1);
    layoutNote.textContent = overflow
      ? "左右滑动看完整作品。"
      : "字太小？分成几行试试。";
    updateScrollMode();
  }

  function paint() {
    frame = 0;
    finishStamp();
    const stampIndex = pendingStamp;
    pendingStamp = -1;
    if (ready) {
      glyphLayout = [];
      art.hidden = !letters;
      placeholder.hidden = Boolean(letters);
      placeholder.textContent = "输入文字，看看花纹效果。";
      if (letters) {
        currentLayout = layoutText();
        renderScale = Math.min(1, maxCanvasSide / Math.max(currentLayout.maxWidth, currentLayout.width, currentLayout.height));
        art.width = Math.min(maxCanvasSide, Math.ceil(currentLayout.width * renderScale));
        art.height = Math.min(maxCanvasSide, Math.ceil(currentLayout.height * renderScale));
        context.setTransform(renderScale, 0, 0, renderScale, 0, 0);
        glyphLayout.forEach(function (glyph) { paintGlyph(glyph, context); });
        art.setAttribute("aria-label", "实时预览 " + text.split("\n").filter(Boolean).join(" / "));
        if (stampIndex >= 0 && !reducedMotion.matches && !document.hidden) {
          startStamp(glyphLayout[stampIndex]);
        }
      } else {
        currentLayout = null;
        art.width = 1;
      }
      updatePreview();
    }
    letterGap.disabled = !ready || !letters;
    letterGapReset.disabled = letterGap.disabled || letterGap.value === letterGap.defaultValue;
    updateLineLayoutControls();
    edgingButton.disabled = !ready;
    randomButton.disabled = !ready || !letters;
    save.disabled = !ready || !letters || saving;
  }

  function requestPaint(stampIndex = -1) {
    pendingStamp = stampIndex;
    if (!frame) frame = requestAnimationFrame(paint);
  }

  function schedulePaint(stampIndex = -1, group) {
    revision += 1;
    if (!saving) saveNote.textContent = "";
    requestPaint(stampIndex);
    if (group !== false) recordHistory(group);
    queueDraft();
  }

  function updateHistoryButtons() {
    undoButton.disabled = !undoSteps.length;
    redoButton.disabled = !redoSteps.length;
  }

  function finishHistoryGroup() {
    if (historyGroup && undoSteps[undoSteps.length - 1] === historyState) undoSteps.pop();
    historyGroup = undefined;
    updateHistoryButtons();
  }

  function recordHistory(group) {
    if (!ready) return;
    const next = JSON.stringify(editorSnapshot());
    if (next === historyState) return;
    if (!group || group !== historyGroup) {
      finishHistoryGroup();
      undoSteps.push(historyState);
      if (undoSteps.length > historyLimit) undoSteps.shift();
    }
    historyState = next;
    historyGroup = group;
    redoSteps.length = 0;
    updateHistoryButtons();
  }

  function resetHistory() {
    undoSteps.length = 0;
    redoSteps.length = 0;
    historyState = JSON.stringify(editorSnapshot());
    finishHistoryGroup();
  }

  function replayHistory(from, to) {
    finishDrag(true);
    finishHistoryGroup();
    if (!from.length) return;
    const previousTheme = activeTheme;
    const previousSelection = selected;
    const entry = JSON.parse(from.pop());
    to.push(historyState);
    restoreEditor(entry, loadedFonts);
    if (letters) selected = Math.min(letters.length - 1, previousSelection);
    if (activeTheme !== previousTheme) {
      fabricTheme.value = activeTheme;
      librarySource = "builtin";
    }
    if (!customFile.disabled) customNote.textContent = "";
    updateGlyphButtons();
    updateSelections();
    historyState = JSON.stringify(editorSnapshot());
    updateHistoryButtons();
    schedulePaint(-1, false);
  }

  undoButton.addEventListener("click", function () { replayHistory(undoSteps, redoSteps); });
  redoButton.addEventListener("click", function () { replayHistory(redoSteps, undoSteps); });
  Array.from(document.querySelectorAll('input[type="range"], input[type="color"]')).forEach(function (control) {
    control.addEventListener("change", finishHistoryGroup);
    control.addEventListener("blur", finishHistoryGroup);
  });

  function showGlyphSize() {
    glyphSizeValue.textContent = glyphSize.value + "%";
    glyphSizeReset.disabled = glyphSize.disabled || Number(glyphSize.value) === defaultSize;
  }

  function updateOutlineControls(style) {
    const outline = style ? style.outline : defaultOutline;
    outlineButton.disabled = !style || edgingEnabled;
    outlineButton.setAttribute("aria-checked", String(Boolean(style) && outline.enabled));
    outlineLockNote.hidden = !style || !edgingEnabled;
    outlineSettings.hidden = outlineButton.disabled || !outline.enabled;
    outlineColor.disabled = outlineSettings.hidden;
    outlineColor.value = outline.color;
    outlineWidth.disabled = outlineSettings.hidden;
    outlineWidth.value = outline.width;
    outlineWidthValue.textContent = outline.width + " px";
  }

  function updatePatternControls(style) {
    const pattern = style ? style.pattern : defaultPattern;
    patternSliders.forEach(function ({ control, property, output }) {
      control.disabled = !style;
      control.value = pattern[property];
      output.textContent = pattern[property] + "%";
    });
    patternReset.disabled = !style || !hasPatternTransform(pattern);
  }

  function showPositionValue(slider, value) {
    slider.output.textContent = value + (slider.property === "angle" ? "°" : " px");
  }

  function updateProportionControls(style) {
    const proportion = style ? style.proportion : defaultProportion;
    proportionSliders.forEach(function ({ control, property, output }) {
      control.disabled = !style;
      control.value = proportion[property];
      output.textContent = proportion[property] + "%";
    });
    proportionReset.disabled = !style || (proportion.width === 100 && proportion.height === 100);
  }

  function hasPosition(style) {
    return Boolean(style.position.x || style.position.y || style.position.angle);
  }

  function updatePositionResetButtons(style) {
    positionReset.disabled = !style || !hasPosition(style);
    allPositionReset.disabled = !letterStyles.some(hasPosition);
  }

  function updatePositionControls(style) {
    const position = style ? style.position : defaultPosition;
    const limit = Math.max(defaultOffsetLimit, Math.ceil(Math.abs(position.y) / defaultOffsetLimit) * defaultOffsetLimit);
    offsetControl.min = -Math.min(maxPositionY, limit);
    offsetControl.max = Math.min(maxPositionY, limit);
    positionSliders.forEach(function (slider) {
      const value = position[slider.property];
      slider.control.disabled = !style;
      slider.control.value = value;
      showPositionValue(slider, value);
    });
    naturalPosition.disabled = !letters;
    updatePositionResetButtons(style);
  }

  function placeGlyphPicker(panel) {
    const slot = panel === typefacePanel && fontMode === "mixed" ? mixedGlyphSlot : panel.querySelector("[data-glyph-slot]");
    if (glyphPicker.parentNode !== slot) slot.appendChild(glyphPicker);
  }

  function updateFontControls(style) {
    const mixed = fontMode === "mixed";
    mixedGlyphSlot.hidden = !mixed;
    fontModeButtons.forEach(function (button) {
      button.disabled = !ready;
      button.setAttribute("aria-pressed", String(button.dataset.fontMode === fontMode));
    });
    const letter = letters[selected];
    const activeFont = style && (style.font || uniformFont(letter));
    fontButtons.forEach(function (button, index) {
      const id = button.dataset.font;
      const han = !!typefaces[id].han;
      button.disabled = !loadedFonts[index] || (mixed && (!style || han !== hanCharacters.has(letter)));
      button.setAttribute("aria-pressed", String(id === (mixed ? activeFont : (han ? hanFontId : fontId))));
    });
    if (!typefacePanel.hidden) placeGlyphPicker(typefacePanel);
  }

  function showEditor(activeButton) {
    if (activeButton.getAttribute("aria-pressed") === "true") return false;
    const panel = document.getElementById(activeButton.getAttribute("aria-controls"));
    placeGlyphPicker(panel);
    editorButtons.forEach(function (button) {
      const active = button === activeButton;
      button.setAttribute("aria-pressed", String(active));
      document.getElementById(button.getAttribute("aria-controls")).hidden = !active;
    });
    updateSelectionNote(selectedCharacterLabel());
    editorPanel.scrollTop = 0;
    return true;
  }

  function viewportHeight() {
    return visualViewport && visualViewport.scale === 1
      ? Math.min(window.innerHeight, visualViewport.height) : window.innerHeight;
  }

  function updateScrollMode() {
    const height = Math.floor(viewportHeight());
    const panelScroll = workspace.classList.contains("panel-scroll");
    const footerSpace = saveArea.offsetHeight + parseFloat(getComputedStyle(editorPanel).marginBottom);
    const room = height - editorPanel.getBoundingClientRect().top - window.pageYOffset - footerSpace;
    const usePanel = !workspace.classList.contains("input-active") && (narrowWorkspace.matches || height >= 760) && room >= 120 &&
      (panelScroll || window.pageYOffset < 1);
    if (usePanel) workspace.style.setProperty("--panel-viewport-height", height + "px");
    if (panelScroll === usePanel) return;
    const offset = editorPanel.scrollTop;
    workspace.classList.toggle("panel-scroll", usePanel);
    if (!usePanel && offset && !workspace.classList.contains("input-active")) window.scrollBy(0, offset);
  }

  function revealEditorItem(item) {
    const bounds = item.getBoundingClientRect();
    const panelScrolls = getComputedStyle(editorPanel).overflowY === "auto" &&
      editorPanel.scrollHeight > editorPanel.clientHeight;
    const panel = editorPanel.getBoundingClientRect();
    const footer = saveArea.getBoundingClientRect();
    const top = (panelScrolls ? panel.top : 0) + 6;
    const bottom = (panelScrolls ? panel.bottom : Math.min(viewportHeight(), footer.top)) - 6;
    if (bottom <= top) return;
    const offset = bounds.top < top ? bounds.top - top
      : Math.max(0, Math.min(bounds.top - top, bounds.bottom - bottom));
    if (offset === 0) return;
    if (panelScrolls) editorPanel.scrollTop += offset;
    else window.scrollBy(0, offset);
  }

  editorButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      if (!showEditor(button)) return;
      const selectedButton = glyphs.children[selected];
      const pickerNeedsScrolling = workspace.classList.contains("panel-scroll") &&
        glyphPicker.offsetHeight > editorPanel.clientHeight - 12;
      revealEditorItem(button === typefaceTab ? fontModeButtons[0]
        : pickerNeedsScrolling && selectedButton ? selectedButton : glyphPicker);
    });
  });

  function selectedCharacterLabel() {
    const character = letters[selected];
    if (!character) return "";
    const repeated = letters.indexOf(character) !== letters.lastIndexOf(character);
    return character + (repeated ? "（第 " + (selected + 1) + " 个）" : "");
  }

  function updateSelectionNote(character) {
    let message = letters ? "请选择一个字符。" : "输入文字后可逐字编辑。";
    if (character) {
      message = glyphPicker.parentNode.id === "fabric-glyph-slot"
        ? "给 " + character + " 换花纹" : "正在编辑 · " + character;
    }
    if (selectionNote.textContent !== message) selectionNote.textContent = message;
  }

  function updateSelections() {
    const style = letterStyles[selected];
    Array.from(glyphs.children).forEach(function (button, index) {
      button.setAttribute("aria-pressed", String(index === selected));
    });
    glyphSize.disabled = !style;
    glyphSize.value = style ? style.size : defaultSize;
    showGlyphSize();
    updateProportionControls(style);
    updateFontControls(style);
    updateOutlineControls(style);
    updatePatternControls(style);
    updatePositionControls(style);
    const character = selectedCharacterLabel();
    singleLabel.textContent = character ? "单字调整 · " + character : "单字调整";
    updateSelectionNote(character);
    selectionNote.classList.toggle("has-selection", Boolean(style));
    glyphResetMenu.hidden = !style;
    if (!style) glyphResetMenu.open = false;
    updateSwatchButtons();
    const fabric = style && fabricCatalog.get(style.fabric);
    patternFillControl.hidden = !fabric || fabric.composition !== "custom" || !fabric.image;
    patternFill.value = style ? style.fill : "single";
    let showsCurrentFabric = false;
    Array.from(swatches.querySelectorAll(".swatch")).forEach(function (button) {
      const applied = Boolean(style) && button.dataset.fabric === style.fabric;
      button.disabled = !style || !fabricCatalog.get(button.dataset.fabric).image;
      button.setAttribute("aria-pressed", String(applied));
      showsCurrentFabric = showsCurrentFabric || applied;
    });
    fabricNote.hidden = !fabric || (showsCurrentFabric && Boolean(fabric.image));
    fabricNote.textContent = fabricNote.hidden ? "" : "当前花纹：" + fabric.name + (fabric.image ? "" : "（暂不可用）");
  }

  function selectGlyph(index) {
    finishDrag(true);
    finishHistoryGroup();
    selected = index;
    updateSelections();
    updateSelectionFrame();
  }

  function updateGlyphButtons() {
    glyphs.textContent = "";
    glyphs.classList.toggle("short-glyph-list", letters.length > 0 && letters.length <= 10);
    Array.from(letters).forEach(function (letter, index) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = letter;
      button.setAttribute("aria-label", "第 " + (index + 1) + " 个字符 " + letter);
      button.addEventListener("click", function () {
        selectGlyph(index);
      });
      glyphs.appendChild(button);
    });
  }

  function updateSwatchButtons() {
    const custom = librarySource === "custom";
    const favorites = librarySource === "favorites";
    const theme = librarySource === "builtin" ? fabricTheme.value : librarySource;
    if (swatches.dataset.theme === theme) return;
    swatches.dataset.theme = theme;
    swatches.textContent = "";
    libraryButtons.forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.dataset.library === librarySource));
    });
    builtinFilter.hidden = librarySource !== "builtin";
    const ids = custom ? customAssets().reverse().map(function (asset) { return asset.id; })
      : favorites ? Array.from(favoriteIds) : themeFabrics[theme].map(function ([, id]) { return id; });
    customEmpty.hidden = !custom || Boolean(ids.length);
    favoritesEmpty.hidden = !favorites || Boolean(ids.length);
    updateFavoritesNote();
    ids.forEach(function (id) {
      const fabric = fabricCatalog.get(id);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "swatch";
      button.dataset.fabric = fabric.id;
      if (fabric.image) {
        const thumbnail = document.createElement("img");
        thumbnail.src = fabric.src;
        thumbnail.alt = "";
        button.appendChild(thumbnail);
      }
      button.appendChild(document.createTextNode(fabric.name + (fabric.image ? "" : "（暂不可用）")));
      button.addEventListener("click", function () {
        const style = letterStyles[selected];
        if (!style || !fabric.image || style.fabric === fabric.id) return;
        style.fabric = fabric.id;
        if (!customFile.disabled) customNote.textContent = "";
        updateSelections();
        schedulePaint();
      });
      const item = document.createElement("div");
      item.className = custom ? "custom-swatch-item" : "builtin-swatch-item";
      item.appendChild(button);
      swatches.appendChild(item);
      if (!custom) {
        const favorite = document.createElement("button");
        favorite.type = "button";
        favorite.className = "favorite-pattern";
        favorite.dataset.favorite = id;
        showFavorite(favorite, fabric);
        favorite.addEventListener("click", function () { toggleFavorite(favorite, fabric); });
        item.appendChild(favorite);
        return;
      }
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "remove-pattern";
      remove.textContent = "删除";
      remove.setAttribute("aria-label", "删除 " + fabric.name);
      remove.addEventListener("click", function () { removeCustomPattern(fabric); });
      item.appendChild(remove);
    });
  }

  fabricTheme.addEventListener("change", updateSelections);
  libraryButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      librarySource = button.dataset.library;
      updateSelections();
    });
  });

  patternFill.addEventListener("change", function () {
    const style = letterStyles[selected];
    if (!style) return;
    style.fill = patternFill.value === "tile" ? "tile" : "single";
    schedulePaint();
  });

  function customAssets() {
    return Array.from(fabricCatalog.values()).filter(function (asset) { return asset.composition === "custom"; });
  }

  function refreshLibrary() {
    delete swatches.dataset.theme;
    updateSelections();
  }

  function showFavorite(button, fabric) {
    const saved = favoriteIds.has(fabric.id);
    button.textContent = saved ? "★" : "☆";
    button.setAttribute("aria-pressed", String(saved));
    button.setAttribute("aria-label", (saved ? "取消收藏 " : "收藏 ") + fabric.name);
  }

  function updateFavoritesNote() {
    favoritesStatus.hidden = !favoritesMessage || (librarySource !== "favorites" && !favoritesFailed);
    if (favoritesNote.textContent !== favoritesMessage) favoritesNote.textContent = favoritesMessage;
    retryFavorites.hidden = !favoritesFailed;
  }

  function toggleFavorite(button, fabric) {
    if (favoriteIds.has(fabric.id)) favoriteIds.delete(fabric.id);
    else favoriteIds.add(fabric.id);
    if (librarySource === "favorites") refreshLibrary();
    else showFavorite(button, fabric);
    saveFavorites();
  }

  function saveFavorites() {
    if (!favoritesWritable) return;
    const ids = Array.from(favoriteIds);
    favoritesWrite = favoritesWrite.then(async function () {
      try {
        await draftStore.writeFavorites(ids);
        favoritesMessage = "";
        favoritesFailed = false;
      } catch (error) {
        favoritesMessage = "收藏未保存，请重试。";
        favoritesFailed = true;
      }
      updateFavoritesNote();
    });
  }

  retryFavorites.addEventListener("click", saveFavorites);

  async function restoreFavorites() {
    if (!draftStore.drafts) {
      favoritesMessage = "当前版本的收藏只保留到关闭小工具。";
      return;
    }
    try {
      const ids = await draftStore.readFavorites();
      ids.forEach(function (id) {
        const asset = fabricCatalog.get(id);
        if (asset && asset.composition !== "custom") favoriteIds.add(id);
      });
      favoritesWritable = true;
    } catch (error) {
      favoritesMessage = "读不到收藏，重新打开试试。";
    }
  }

  function revealUploadedPattern() {
    const swatch = swatches.querySelector(".swatch");
    if (swatch) revealEditorItem(swatch);
  }

  function removeCustomPattern(fabric) {
    const used = letterStyles.some(function (style) { return style.fabric === fabric.id; });
    if (!window.confirm("删除「" + fabric.name + "」？" + (used ? "用到它的字会换回主题花纹。" : ""))) return;
    fabricCatalog.delete(fabric.id);
    if (fabric.persisted) retiredFiles.add(fabric.id);
    if (fabric.src) URL.revokeObjectURL(fabric.src);
    const fallback = themeFabrics[activeTheme][0][1];
    letterStyles.forEach(function (style) {
      if (style.fabric === fabric.id) style.fabric = fallback;
    });
    customNote.textContent = "已删除纹样";
    refreshLibrary();
    finishHistoryGroup();
    historyState = JSON.stringify(editorSnapshot());
    schedulePaint(-1, false);
    flushDraft();
  }

  customFile.addEventListener("change", async function () {
    const file = customFile.files[0];
    customFile.value = "";
    if (!file || customFile.disabled) return;
    const assets = customAssets();
    if (assets.length >= customPatterns.maxCount) {
      customNote.textContent = "已满 12 张，请先删除一张。";
      return;
    }
    customFile.disabled = true;
    customNote.textContent = "正在处理图片…";
    try {
      const blob = await customPatterns.normalize(file);
      const used = customAssets().reduce(function (sum, asset) { return sum + asset.bytes; }, 0);
      if (used + blob.size > customPatterns.maxLibraryBytes) throw new Error("纹样库空间不足，请删掉几张后再试。");
      let id;
      do {
        const random = Math.floor(Math.random() * 0x100000000).toString(36);
        id = "custom-" + Date.now().toString(36) + "-" + random + (++customIdSequence).toString(36);
      } while (fabricCatalog.has(id));
      const name = file.name.replace(/\.[^.]+$/, "").trim().slice(0, 24) || "自定义纹样";
      const fabric = await customPatterns.loadAsset({ id, name, persisted: false }, blob);
      if (draftStore.images && draftWritesAllowed) {
        try {
          await draftStore.writeImage(id, blob);
          fabric.persisted = true;
        } catch (error) {
          // Keep the decoded image usable for this session if the file write fails.
        }
      }
      fabricCatalog.set(id, fabric);
      customNote.textContent = fabric.persisted ? "已上传，点新图应用。" : "已上传，仅本次可用。";
      showEditor(fabricTab);
      librarySource = "custom";
      refreshLibrary();
      revealUploadedPattern();
      schedulePaint();
      if (fabric.persisted) flushDraft();
    } catch (error) {
      customNote.textContent = error.message || "上传失败，请重试。";
    } finally {
      customFile.disabled = false;
    }
  });

  function limitCharacters(value) {
    let count = 0;
    return value.replace(/[^\n]/g, function (character) {
      count += 1;
      return count <= maxCharacters ? character : "";
    });
  }

  function acceptedCharacter(character) {
    return latinCharacter.test(character) || hanCharacters.has(character);
  }

  function supportedText(value) {
    return Array.from(value).filter(acceptedCharacter).join("");
  }

  function drawableLetters(value) {
    return value.replace(/[ \n]/g, "");
  }

  function updateInputCount() {
    inputCount.textContent = text.replace(/\n/g, "").length + " / " + maxCharacters;
  }

  function readInput(event) {
    if (composing || (event && event.isComposing)) return;
    finishDrag(true);
    const raw = input.value;
    // Match the punctuation supported by all bundled typefaces.
    const normalized = raw.replace(/？/g, "?").replace(/，/g, ",");
    const allowed = supportedText(normalized);
    if (allowed.split("\n").length > maxLines) {
      const caret = Math.min(input.selectionStart, text.length);
      input.value = text;
      input.setSelectionRange(caret, caret);
      inputNote.textContent = "最多 3 行，请删掉多余的换行。";
      return;
    }
    const next = limitCharacters(allowed);
    if (raw !== next) {
      const prefix = supportedText(normalized.slice(0, input.selectionStart));
      const caret = limitCharacters(prefix).length;
      input.value = next;
      input.setSelectionRange(caret, caret);
    }
    const skipped = Array.from(new Set(Array.from(normalized).filter(function (char) {
      return !acceptedCharacter(char);
    })));
    const skippedLabel = skipped.slice(0, 4).join("、");
    inputNote.textContent = skipped.length ? "已跳过暂不支持的字符「" + skippedLabel + (skipped.length > 4 ? "…" : "") + "」。" : inputHelp;
    if (allowed !== next) inputNote.textContent = `最多 ${maxCharacters} 个字符，已保留前 ${maxCharacters} 个。`;
    if (next === text) return;
    const sameLineCount = text.split("\n").length === next.split("\n").length;
    text = next;
    const nextLetters = drawableLetters(next);
    const previousStyle = letterStyles[selected];
    const inputType = event && event.inputType;
    const caret = /^(insert|delete)/.test(inputType || "")
      ? drawableLetters(next.slice(0, input.selectionStart)).length
      : undefined;
    const stampIndex = updateLetterStyles(nextLetters, caret);
    letters = nextLetters;
    updateInputCount();
    input.rows = Math.max(2, next.split("\n").length);
    selected = letters ? Math.max(0, letterStyles.indexOf(previousStyle)) : -1;
    if (ready) {
      updateGlyphButtons();
      updateSelections();
      const typing = !inputType || inputType === "insertText" || inputType === "insertReplacementText";
      schedulePaint(sameLineCount && typing ? stampIndex : -1);
    }
  }

  input.addEventListener("input", readInput);
  input.addEventListener("compositionstart", function () { composing = true; });
  input.addEventListener("compositionend", function () {
    composing = false;
    readInput();
  });
  input.addEventListener("focus", function () {
    workspace.classList.add("input-active");
    updatePreview();
  });
  input.addEventListener("blur", function () {
    workspace.classList.remove("input-active");
    updatePreview();
  });
  function resizePreview() {
    finishDrag(true);
    updatePreview();
  }
  window.addEventListener("resize", resizePreview);
  if (visualViewport) visualViewport.addEventListener("resize", resizePreview);
  window.addEventListener("scroll", function () {
    if (window.pageYOffset < 1) updateScrollMode();
  }, { passive: true });
  window.addEventListener("blur", function () { finishDrag(true); });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      finishDrag(true);
      pendingStamp = -1;
      finishStamp();
      flushDraft();
    }
  });
  window.addEventListener("pagehide", function () {
    finishDrag(true);
    flushDraft();
  });

  function updateGap(event) {
    letterGapValue.textContent = letterGap.value + " px";
    schedulePaint(-1, event && letterGap.id);
  }

  letterGap.addEventListener("input", updateGap);
  letterGapReset.addEventListener("click", function () {
    letterGap.value = letterGap.defaultValue;
    updateGap();
  });

  function updateLineLayoutControls() {
    const disabled = !ready || !letters;
    alignmentButtons.forEach(function (button) {
      button.disabled = disabled;
      button.setAttribute("aria-pressed", String(button.dataset.align === lineAlignment));
    });
    lineGap.disabled = disabled;
    lineGapValue.textContent = lineGap.value + " px";
    lineLayoutReset.disabled = disabled || (lineAlignment === "center" && lineGap.value === lineGap.defaultValue);
  }

  alignmentButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      lineAlignment = button.dataset.align;
      updateLineLayoutControls();
      schedulePaint();
    });
  });

  lineGap.addEventListener("input", function () {
    updateLineLayoutControls();
    schedulePaint(-1, lineGap.id);
  });

  lineLayoutReset.addEventListener("click", function () {
    lineAlignment = "center";
    lineGap.value = lineGap.defaultValue;
    updateLineLayoutControls();
    schedulePaint();
  });

  function updateGlyphSize(event) {
    const style = letterStyles[selected];
    const size = Number(glyphSize.value);
    if (!style || style.size === size) return;
    style.size = size;
    showGlyphSize();
    schedulePaint(-1, event && glyphSize.id);
  }

  glyphSize.addEventListener("input", updateGlyphSize);
  glyphSizeReset.addEventListener("click", function () {
    glyphSize.value = defaultSize;
    updateGlyphSize();
  });

  proportionSliders.forEach(function ({ control, property, output }) {
    control.addEventListener("input", function () {
      const style = letterStyles[selected];
      if (!style) return;
      const value = Number(control.value);
      style.proportion[property] = value;
      output.textContent = value + "%";
      proportionReset.disabled = style.proportion.width === 100 && style.proportion.height === 100;
      schedulePaint(-1, control.id);
    });
  });

  proportionReset.addEventListener("click", function () {
    const style = letterStyles[selected];
    if (!style) return;
    Object.assign(style.proportion, defaultProportion);
    updateProportionControls(style);
    schedulePaint();
  });

  outlineButton.addEventListener("click", function () {
    const style = letterStyles[selected];
    if (!style || edgingEnabled) return;
    style.outline.enabled = !style.outline.enabled;
    updateOutlineControls(style);
    schedulePaint();
  });

  function readOutlineColor(event) {
    const style = letterStyles[selected];
    if (!style || outlineColor.disabled) return;
    const color = outlineColor.value.toLowerCase();
    if (!/^#[0-9a-f]{6}$/.test(color)) {
      if (event.type === "change") outlineColor.value = style.outline.color;
      return;
    }
    if (color === style.outline.color) return;
    style.outline.color = color;
    schedulePaint(-1, event.type === "input" ? outlineColor.id : undefined);
  }

  outlineColor.addEventListener("input", readOutlineColor);
  outlineColor.addEventListener("change", readOutlineColor);
  outlineWidth.addEventListener("input", function () {
    const style = letterStyles[selected];
    if (!style || outlineWidth.disabled) return;
    style.outline.width = Number(outlineWidth.value);
    outlineWidthValue.textContent = style.outline.width + " px";
    schedulePaint(-1, outlineWidth.id);
  });

  patternSliders.forEach(function ({ control, property, output }) {
    control.addEventListener("input", function () {
      const style = letterStyles[selected];
      if (!style) return;
      style.pattern[property] = Number(control.value);
      output.textContent = style.pattern[property] + "%";
      patternReset.disabled = !hasPatternTransform(style.pattern);
      schedulePaint(-1, control.id);
    });
  });

  patternReset.addEventListener("click", function () {
    const style = letterStyles[selected];
    if (!style) return;
    Object.assign(style.pattern, defaultPattern);
    updatePatternControls(style);
    schedulePaint();
  });

  positionSliders.forEach(function (slider) {
    slider.control.addEventListener("input", function () {
      const style = letterStyles[selected];
      if (!style) return;
      const value = Number(slider.control.value);
      style.position[slider.property] = value;
      showPositionValue(slider, value);
      updatePositionResetButtons(style);
      schedulePaint(-1, slider.control.id);
    });
  });

  positionReset.addEventListener("click", function () {
    const style = letterStyles[selected];
    if (!style) return;
    Object.assign(style.position, defaultPosition);
    updatePositionControls(style);
    schedulePaint();
  });

  allPositionReset.addEventListener("click", function () {
    letterStyles.forEach(function (style) { Object.assign(style.position, defaultPosition); });
    updatePositionControls(letterStyles[selected]);
    schedulePaint();
  });

  naturalPosition.addEventListener("click", function () {
    let previous = defaultPosition;
    letterStyles.forEach(function (style) {
      let y = Math.floor(Math.random() * 17) - 8;
      const angle = Math.floor(Math.random() * 9) - 4;
      if ((!y && !angle) || (y === previous.y && angle === previous.angle)) y += y === 8 ? -1 : 1;
      Object.assign(style.position, { y, angle });
      previous = style.position;
    });
    updatePositionControls(letterStyles[selected]);
    schedulePaint();
  });

  function hitsGlyph(glyph, x, y) {
    const dx = x - glyph.centerX;
    const dy = y - glyph.centerY;
    const cosine = Math.cos(glyph.angle);
    const sine = Math.sin(glyph.angle);
    const inset = borderPadding(glyph);
    return Math.abs(dx * cosine + dy * sine) <= glyph.boxWidth / 2 + inset * glyph.stretchX &&
      Math.abs(dy * cosine - dx * sine) <= (glyph.boxAscent + glyph.boxDescent) / 2 + inset * glyph.stretchY;
  }

  function updateSelectionFrame() {
    const glyph = glyphLayout[selected];
    selectionFrame.hidden = !glyph;
    if (!glyph) return;
    const inset = borderPadding(glyph);
    selectionFrame.style.left = glyph.centerX * previewScale + "px";
    selectionFrame.style.top = glyph.centerY * previewScale + "px";
    selectionFrame.style.width = (glyph.boxWidth + 2 * inset * glyph.stretchX) * previewScale + "px";
    selectionFrame.style.height = (glyph.boxAscent + glyph.boxDescent + 2 * inset * glyph.stretchY) * previewScale + "px";
    selectionFrame.style.transform = "translate(-50%, -50%) rotate(" + glyph.angle + "rad)";
  }

  function glyphAt(clientX, clientY) {
    if (!currentLayout) return null;
    const bounds = art.getBoundingClientRect();
    const x = (clientX - bounds.left) / previewScale;
    const y = (clientY - bounds.top) / previewScale;
    // The last painted letter is on top in an overlap.
    for (let i = glyphLayout.length - 1; i >= 0; i -= 1) {
      if (hitsGlyph(glyphLayout[i], x, y)) return glyphLayout[i];
    }
    return null;
  }

  function beginDrag(id, clientX, clientY, touch) {
    if (drag || frame) return false;
    const glyph = glyphAt(clientX, clientY);
    if (!glyph) return false;
    finishStamp();
    selectGlyph(glyph.index);
    const position = letterStyles[glyph.index].position;
    drag = { id, touch, clientX, clientY, glyph, position, x: position.x, y: position.y, frame: null };
    return true;
  }

  function startDragFrame() {
    const preview = previewViewport.parentNode;
    const style = getComputedStyle(preview);
    const contentHeight = preview.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
    const viewStyle = getComputedStyle(previewViewport);
    const verticalPadding = parseFloat(viewStyle.paddingTop) + parseFloat(viewStyle.paddingBottom);
    const horizontal = Math.max(0, (previewViewport.clientWidth / previewScale - currentLayout.width) / 2);
    const vertical = Math.max(0, (contentHeight - previewViewport.offsetHeight + verticalPadding) / (2 * previewScale));
    const { left, top, width, height } = currentLayout;
    const { glyph } = drag;
    const bounds = {
      left: left - horizontal, top: top - vertical,
      right: left + width + horizontal, bottom: top + height + vertical, scale: previewScale
    };
    const x = glyph.centerX + left;
    const y = glyph.centerY + top;
    drag.minX = -Math.max(0, Math.floor(x - glyph.extentX - bounds.left - 2));
    drag.maxX = Math.max(0, Math.floor(bounds.right - x - glyph.extentX - 2));
    drag.minY = -Math.max(0, Math.floor(y - glyph.extentY - bounds.top - 2));
    drag.maxY = Math.max(0, Math.floor(bounds.bottom - y - glyph.extentY - 2));
    drag.frame = bounds;
  }

  function moveDrag(clientX, clientY) {
    const dx = clientX - drag.clientX;
    const dy = clientY - drag.clientY;
    if (!drag.frame) {
      if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
      startDragFrame();
    }
    const x = boundedOffset(drag.x + Math.max(drag.minX, Math.min(drag.maxX, Math.round(dx / drag.frame.scale))), maxPositionX);
    const y = boundedOffset(drag.y + Math.max(drag.minY, Math.min(drag.maxY, Math.round(dy / drag.frame.scale))), maxPositionY);
    if (drag.position.x === x && drag.position.y === y) return;
    drag.position.x = x;
    drag.position.y = y;
    updatePositionControls(letterStyles[selected]);
    requestPaint();
  }

  function finishDrag(cancel) {
    if (!drag) return false;
    const { frame: bounds, position, x, y } = drag;
    drag = null;
    if (!bounds) return false;
    if (!cancel && (position.x !== x || position.y !== y)) {
      schedulePaint();
    } else {
      position.x = x;
      position.y = y;
      requestPaint();
      if (draftDirty) queueDraft();
    }
    updatePositionControls(letterStyles[selected]);
    return true;
  }

  // Touch starts over a letter are captured. Starting on blank canvas keeps native scrolling.
  art.addEventListener("touchstart", function (event) {
    if (event.touches.length !== 1) {
      finishDrag(true);
      return;
    }
    const touch = event.changedTouches[0];
    if (beginDrag(touch.identifier, touch.clientX, touch.clientY, true)) event.preventDefault();
  }, { passive: false });
  art.addEventListener("touchmove", function (event) {
    if (!drag || !drag.touch) return;
    const touch = Array.from(event.changedTouches).find(function (item) { return item.identifier === drag.id; });
    if (!touch) return;
    event.preventDefault();
    moveDrag(touch.clientX, touch.clientY);
  }, { passive: false });
  ["touchend", "touchcancel"].forEach(function (name) {
    art.addEventListener(name, function (event) {
      if (!drag || !drag.touch || !Array.from(event.changedTouches).some(function (item) { return item.identifier === drag.id; })) return;
      finishDrag(name === "touchcancel");
    });
  });

  let previewScrollTouch = null;
  previewViewport.addEventListener("touchstart", function (event) {
    previewScrollTouch = null;
    if (event.defaultPrevented || event.touches.length !== 1 ||
      !workspace.classList.contains("panel-scroll") || editorPanel.scrollHeight <= editorPanel.clientHeight) return;
    const touch = event.changedTouches[0];
    previewScrollTouch = { id: touch.identifier, x: touch.clientX, y: touch.clientY, vertical: false };
  }, { passive: true });
  previewViewport.addEventListener("touchmove", function (event) {
    const gesture = previewScrollTouch;
    if (!gesture || event.defaultPrevented || event.touches.length !== 1 || !event.cancelable) return;
    const touch = Array.from(event.changedTouches).find(function (item) { return item.identifier === gesture.id; });
    if (!touch) return;
    const dy = touch.clientY - gesture.y;
    if (!gesture.vertical) {
      const dx = touch.clientX - gesture.x;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 6) return;
      if (Math.abs(dx) >= Math.abs(dy)) {
        previewScrollTouch = null;
        return;
      }
      gesture.vertical = true;
    }
    event.preventDefault();
    editorPanel.scrollTop -= dy;
    gesture.y = touch.clientY;
  }, { passive: false });
  ["touchend", "touchcancel"].forEach(function (name) {
    previewViewport.addEventListener(name, function () { previewScrollTouch = null; });
  });

  art.addEventListener("pointerdown", function (event) {
    if (event.pointerType === "touch" || event.button !== 0 || event.isPrimary === false) return;
    ignoreDragClick = false;
    beginDrag(event.pointerId, event.clientX, event.clientY, false);
  });
  window.addEventListener("pointermove", function (event) {
    if (!drag || drag.touch || drag.id !== event.pointerId) return;
    if (event.buttons === 0) finishDrag(true);
    else moveDrag(event.clientX, event.clientY);
  });
  window.addEventListener("pointerup", function (event) {
    if (!drag || drag.touch || drag.id !== event.pointerId) return;
    ignoreDragClick = finishDrag(false);
    if (ignoreDragClick) setTimeout(function () { ignoreDragClick = false; }, 0);
  });
  window.addEventListener("pointercancel", function (event) {
    if (drag && !drag.touch && drag.id === event.pointerId) finishDrag(true);
  });

  art.addEventListener("click", function (event) {
    if (ignoreDragClick || frame) return;
    const glyph = glyphAt(event.clientX, event.clientY);
    selectGlyph(glyph ? glyph.index : -1);
  });
  previewViewport.addEventListener("click", function (event) {
    if (!ignoreDragClick && event.target !== art && currentLayout) selectGlyph(-1);
  });

  fontModeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const mode = button.dataset.fontMode;
      if (mode === fontMode) return;
      fontMode = mode;
      if (mode === "mixed") {
        letterStyles.forEach(function (style, index) {
          if (!style.font) style.font = uniformFont(letters[index]);
        });
      }
      updateFontControls(letterStyles[selected]);
      schedulePaint();
    });
  });

  fontButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const next = button.dataset.font;
      const style = letterStyles[selected];
      if (fontMode === "mixed") {
        if (button.disabled || next === (style.font || uniformFont(letters[selected]))) return;
        style.font = next;
      } else if (typefaces[next].han) {
        if (next === hanFontId) return;
        hanFontId = next;
      } else {
        if (next === fontId) return;
        fontId = next;
      }
      updateFontControls(style);
      schedulePaint();
    });
  });

  edgingButton.addEventListener("click", function () {
    edgingEnabled = !edgingEnabled;
    edgingButton.setAttribute("aria-checked", String(edgingEnabled));
    edgingPalette.hidden = !edgingEnabled;
    updateOutlineControls(letterStyles[selected]);
    schedulePaint();
  });

  edgingColorButtons.forEach(function (button) {
    button.firstElementChild.style.backgroundColor = button.dataset.color;
    button.addEventListener("click", function () {
      if (button === edgingColor) return;
      edgingColor.setAttribute("aria-pressed", "false");
      edgingColor = button;
      button.setAttribute("aria-pressed", "true");
      schedulePaint();
    });
  });

  function randomizeFabrics() {
    let previous = letterStyles.length ? letterStyles[0].fabric : undefined;
    letterStyles.forEach(function (style) {
      style.fabric = randomFabric(previous);
      previous = style.fabric;
    });
    updateSelections();
    schedulePaint();
  }

  randomButton.addEventListener("click", function () {
    randomizeFabrics();
    if (!customFile.disabled) customNote.textContent = "已按当前主题换了一组花纹。";
  });

  themeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      if (button.dataset.theme === activeTheme) return;
      activeTheme = button.dataset.theme;
      fabricTheme.value = activeTheme;
      librarySource = "builtin";
      if (!customFile.disabled) customNote.textContent = "";
      themeButtons.forEach(function (item) {
        item.setAttribute("aria-pressed", String(item === button));
      });
      randomizeFabrics();
    });
  });

  function showSaveStatus(message) {
    saveNote.textContent = message;
    updateScrollMode();
  }

  async function offerAuthorFollow(api) {
    if (followChecked || draftStore.clientVersion < 9510 ||
        typeof api.getFollowStatus !== "function" || typeof api.followAuthor !== "function") return;
    followChecked = true;
    try {
      const result = await api.getFollowStatus();
      if (result && result.follow_status === 0 && letters) {
        followPrompt.hidden = false;
        updateScrollMode();
      }
    } catch (error) {
      // The editor and album save are usable when the follow state is unavailable.
    }
  }

  function setFollowNote(message) {
    followNote.textContent = message;
    updateScrollMode();
  }

  function closeFollowPrompt(message = "") {
    if (followPrompt.contains(document.activeElement) && !save.disabled) save.focus();
    followPrompt.hidden = true;
    setFollowNote(message);
  }

  dismissFollow.addEventListener("click", function () { closeFollowPrompt(); });
  followButton.addEventListener("click", async function () {
    if (followPrompt.hidden || followButton.disabled) return;
    const api = window.xhs && window.xhs.miniTool;
    if (!api || typeof api.followAuthor !== "function") {
      closeFollowPrompt();
      return;
    }
    followButton.disabled = true;
    setFollowNote("");
    try {
      const result = await api.followAuthor();
      if (followPrompt.hidden) return;
      if (result && result.follow_status === 1) closeFollowPrompt("已关注作者。");
      else if (result && result.follow_status === 2) closeFollowPrompt();
      else setFollowNote("暂时无法关注，请稍后重试。");
    } catch (error) {
      if (followPrompt.hidden) return;
      const code = Number(error && error.errCode);
      if (code === 20002) closeFollowPrompt();
      else if (code === 15404) closeFollowPrompt("今天的关注提示次数已用完。");
      else if (code !== 10003) setFollowNote("暂时无法关注，请稍后重试。");
    } finally {
      followButton.disabled = false;
    }
  });

  function exportScale(maxSide) {
    const { width, height } = currentLayout;
    const maxPixels = 16 * 1024 * 1024;
    return Math.min(3, maxSide / Math.max(width, height), Math.sqrt(maxPixels / (width * height)));
  }

  function paintExport(canvas, scale) {
    const { width, height } = currentLayout;
    canvas.width = Math.max(1, Math.floor(width * scale));
    canvas.height = Math.max(1, Math.floor(height * scale));
    const target = canvas.getContext("2d");
    const cache = new Map();
    const detailScale = Math.ceil(scale);
    target.scale(scale, scale);
    glyphLayout.forEach(function (glyph) { paintGlyph(glyph, target, detailScale, cache); });
  }

  function encodeAlbumPng() {
    const byteBudget = 2000000;
    const prefix = "data:image/png;base64,";
    const canvas = document.createElement("canvas");
    let scale = exportScale(maxCanvasSide);
    try {
      while (true) {
        paintExport(canvas, scale);
        const png = canvas.toDataURL("image/png");
        if (!png.startsWith(prefix)) throw new Error("PNG encoding failed");
        const padding = png.endsWith("==") ? 2 : Number(png.endsWith("="));
        const bytes = (png.length - prefix.length) * 3 / 4 - padding;
        if (bytes <= byteBudget) return png;
        scale *= Math.min(.96, Math.sqrt(byteBudget / bytes) * .98);
      }
    } finally {
      canvas.width = 1;
      canvas.height = 1;
    }
  }

  save.addEventListener("click", async function () {
    if (!letters || saving) return;
    finishDrag(false);
    pendingStamp = -1;
    const api = window.xhs && window.xhs.miniTool;
    const download = localPreview && !window.xhs;
    if (!download && (!api || typeof api.saveImageToPhotosAlbum !== "function")) {
      finishStamp();
      showSaveStatus("请在小红书打开后保存图片。");
      return;
    }
    const savingRevision = revision;
    saving = true;
    save.disabled = true;
    if (frame) {
      cancelAnimationFrame(frame);
      paint();
    } else {
      finishStamp();
    }
    if (!download) showSaveStatus("正在保存到相册…");
    try {
      if (download) {
        const canvas = document.createElement("canvas");
        paintExport(canvas, exportScale(8192));
        await localPreview.downloadPNG(canvas);
        showSaveStatus("已发起下载，请查看浏览器的下载记录。");
        return;
      }
      let filePath = encodeAlbumPng();
      if (filePath.length > 700000 && typeof api.writeTempFile === "function") {
        const result = await api.writeTempFile({ data: filePath });
        filePath = result.filePath;
      }
      await api.saveImageToPhotosAlbum({ filePath });
      showSaveStatus(savingRevision === revision
        ? "图片已保存到相册" : "刚才的版本已保存到相册。");
      offerAuthorFollow(api);
    } catch (error) {
      showSaveStatus(download ? "PNG 下载失败，请刷新页面后重试。"
        : "图片保存失败，请检查相册权限后重试。");
    } finally {
      saving = false;
      save.disabled = !letters;
    }
  });

  async function loadTypeface(button) {
    const face = typefaces[button.dataset.font];
    try {
      const loaded = await document.fonts.load(glyphFont(fontSize, face), face.han ? "梦想家" : "AaOo");
      if (!loaded.length) throw new Error(face.family + " unavailable");
      return true;
    } catch (error) {
      if (face === typefaces.fraunces) throw error;
      const label = button.querySelector(".font-name");
      label.textContent += "（未加载）";
      return false;
    }
  }

  function boundedValue(value, control) {
    if (typeof value !== "number" || !Number.isFinite(value)) return Number(control.defaultValue);
    return Math.min(Number(control.max), Math.max(Number(control.min), Math.round(value)));
  }

  function boundedOffset(value, limit) {
    if (typeof value !== "number" || !Number.isFinite(value)) return 0;
    return Math.max(-limit, Math.min(limit, Math.round(value)));
  }

  function restoreFont(id, availableFonts) {
    const index = fontButtons.findIndex(function (button) { return button.dataset.font === id; });
    return index >= 0 && availableFonts && availableFonts[index] ? id : null;
  }

  function restoreGlyphFont(id, letter, availableFonts) {
    const font = restoreFont(id, availableFonts);
    return font && !!typefaces[font].han === hanCharacters.has(letter) ? font : null;
  }

  function restoreEditor(draft, availableFonts) {
    const validTheme = Object.prototype.hasOwnProperty.call(themeFabrics, draft.theme);
    activeTheme = validTheme ? draft.theme : defaultTheme;
    const latin = restoreFont(draft.font, availableFonts);
    const han = restoreFont(draft.hanFont, availableFonts);
    fontId = latin && !typefaces[latin].han ? latin : "fraunces";
    hanFontId = han && typefaces[han].han ? han : defaultHanFont;
    fontMode = draft.fontMode === "mixed" ? "mixed" : "uniform";
    edgingEnabled = draft.edging === true;
    edgingColor = edgingColorButtons.find(function (button) { return button.dataset.color === draft.edgeColor; }) ||
      edgingColorButtons[0];
    lineAlignment = alignmentButtons.some(function (button) { return button.dataset.align === draft.align; }) ?
      draft.align : "center";
    letterGap.value = boundedValue(draft.gap, letterGap);
    lineGap.value = boundedValue(draft.rowGap, lineGap);

    text = limitCharacters(supportedText(draft.text).split("\n").slice(0, maxLines).join("\n"));
    letters = drawableLetters(text);
    letterStyles.length = 0;
    for (let index = 0; index < letters.length; index++) {
      const saved = draft.styles[index] || {};
      const outline = saved.outline || {};
      const pattern = saved.pattern || {};
      const position = saved.position || defaultPosition;
      const proportion = saved.proportion || defaultProportion;
      const restoredPattern = {};
      const restoredPosition = {
        x: boundedOffset(position.x, maxPositionX),
        y: boundedOffset(position.y, maxPositionY),
        angle: boundedValue(position.angle, angleControl)
      };
      const restoredProportion = {};
      patternSliders.forEach(function ({ control, property }) {
        restoredPattern[property] = boundedValue(pattern[property], control);
      });
      proportionSliders.forEach(function ({ control, property }) {
        restoredProportion[property] = boundedValue(proportion[property], control);
      });
      const fabric = typeof saved.fabric === "string" && fabricCatalog.has(saved.fabric)
        ? saved.fabric : themeFabrics[activeTheme][0][1];
      letterStyles.push({
        fabric,
        fill: saved.fill === "tile" ? "tile" : "single",
        size: boundedValue(saved.size, glyphSize),
        font: restoreGlyphFont(saved.font, letters[index], availableFonts),
        proportion: restoredProportion,
        position: restoredPosition,
        outline: {
          enabled: outline.enabled !== false,
          color: typeof outline.color === "string" && /^#[0-9a-f]{6}$/i.test(outline.color) ? outline.color : defaultOutline.color,
          width: boundedValue(outline.width, outlineWidth)
        },
        pattern: restoredPattern
      });
    }
    selected = letters ? 0 : -1;
    input.value = text;
    input.rows = Math.max(2, text.split("\n").length);
    updateInputCount();
    inputNote.textContent = inputHelp;
    letterGapValue.textContent = letterGap.value + " px";
    themeButtons.forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.dataset.theme === activeTheme));
    });
    edgingButton.setAttribute("aria-checked", String(edgingEnabled));
    edgingPalette.hidden = !edgingEnabled;
    edgingColorButtons.forEach(function (button) {
      button.setAttribute("aria-pressed", String(button === edgingColor));
    });
  }

  async function restoreLibrary(draft) {
    const entries = Array.isArray(draft.library) ? draft.library.slice(0, customPatterns.maxCount) : [];
    const ids = new Set();
    let total = 0;
    const valid = entries.filter(function (meta) {
      if (!meta || !customPatterns.validId(meta.id) || ids.has(meta.id) ||
          typeof meta.name !== "string" || !Number.isInteger(meta.bytes) || meta.bytes < 1 ||
          meta.bytes > customPatterns.maxImageBytes || total + meta.bytes > customPatterns.maxLibraryBytes) return false;
      ids.add(meta.id);
      total += meta.bytes;
      return true;
    });
    const assets = await Promise.all(valid.map(async function (entry) {
      const meta = {
        id: entry.id,
        name: entry.name.trim().slice(0, 24) || "自定义纹样",
        bytes: entry.bytes,
        persisted: true
      };
      if (draftStore.images) {
        try {
          return await draftStore.readImage(meta);
        } catch (error) {
          // Keep the reference so a temporarily unavailable file can recover on a later launch.
        }
      }
      return Object.assign(meta, { composition: "custom", src: null, image: null });
    }));
    assets.forEach(function (asset) { fabricCatalog.set(asset.id, asset); });
    if (Array.isArray(draft.retired)) {
      draft.retired.forEach(function (id) {
        if (customPatterns.validId(id) && !ids.has(id)) retiredFiles.add(id);
      });
    }
  }

  function editorSnapshot() {
    return {
      text,
      font: fontId,
      hanFont: hanFontId,
      fontMode,
      edging: edgingEnabled,
      edgeColor: edgingColor.dataset.color,
      theme: activeTheme,
      align: lineAlignment,
      gap: Number(letterGap.value),
      rowGap: Number(lineGap.value),
      styles: letterStyles
    };
  }

  function draftSnapshot() {
    return Object.assign(editorSnapshot(), {
      version: 1,
      styles: letterStyles.map(function (style) {
        const fabric = fabricCatalog.get(style.fabric);
        const id = fabric && (fabric.composition !== "custom" || fabric.persisted) ? style.fabric : themeFabrics[activeTheme][0][1];
        return Object.assign({}, style, { fabric: id });
      }),
      library: customAssets().filter(function (asset) { return asset.persisted; }).map(function (asset) {
        return { id: asset.id, name: asset.name, bytes: asset.bytes };
      }),
      retired: Array.from(retiredFiles)
    });
  }

  function showDraftStatus(message, failed = false) {
    if (draftNote.textContent !== message) draftNote.textContent = message;
    retryDraft.hidden = !failed;
    draftStatus.hidden = !message;
    if (ready) updateScrollMode();
  }

  function draftAssetStatus() {
    const assets = customAssets();
    if (assets.some(function (asset) { return asset.persisted && !asset.image; })) {
      return "部分纹样暂不可用，可重新上传。";
    }
    return assets.some(function (asset) { return !asset.persisted; }) ? "部分纹样仅本次可用。" : "";
  }

  async function restoreDraft(availableFonts) {
    if (!draftStore.drafts) {
      showDraftStatus("当前版本不支持自动保存，请及时导出作品");
      return;
    }
    try {
      const draft = await draftStore.readDraft();
      if (draft) {
        await restoreLibrary(draft);
        restoreEditor(draft, availableFonts);
      }
      draftWritesAllowed = true;
      showDraftStatus(draftAssetStatus());
    } catch (error) {
      showDraftStatus("读不到上次草稿。新建后可重新保存。");
    }
  }

  function queueDraft() {
    if (!draftWritesAllowed) return;
    draftDirty = true;
    if (draftWrite) return;
    clearTimeout(draftTimer);
    draftTimer = setTimeout(flushDraft, 450);
  }

  async function commitDraft(snapshot) {
    let saved = false;
    try {
      await draftStore.writeDraft(snapshot);
      saved = true;
      if (draftStore.images) {
        for (const id of snapshot.retired) {
          if (await draftStore.removeImage(id)) retiredFiles.delete(id);
        }
      }
      if (!draftDirty) showDraftStatus(draftAssetStatus());
    } catch (error) {
      draftDirty = true;
      showDraftStatus("保存失败，请稍后重试。", true);
    } finally {
      draftWrite = null;
      if (saved && draftDirty) {
        if (document.hidden) flushDraft();
        else queueDraft();
      }
    }
  }

  function flushDraft() {
    clearTimeout(draftTimer);
    if (!draftWritesAllowed || !draftDirty || draftWrite || (drag && drag.frame)) return;
    draftDirty = false;
    draftWrite = commitDraft(draftSnapshot());
  }

  retryDraft.addEventListener("click", flushDraft);

  newDraftButton.addEventListener("click", function () {
    finishDrag(true);
    const message = draftStore.drafts ? "清空当前作品并新建草稿？" : "清空当前作品？";
    if (!window.confirm(message + "纹样和收藏会保留。")) return;
    restoreEditor({ text: "", styles: [] });
    fabricTheme.value = activeTheme;
    librarySource = "builtin";
    showEditor(fabricTab);
    editorPanel.scrollTop = 0;
    updateGlyphButtons();
    updateSelections();
    draftWritesAllowed = draftStore.drafts;
    resetHistory();
    schedulePaint(-1, false);
    flushDraft();
  });

  async function start() {
    try {
      const [availableFonts, , store] = await Promise.all([
        Promise.all(fontButtons.map(loadTypeface)),
        Promise.all(Array.from(fabricCatalog.values(), loadFabric)),
        window.PrintyDraftStore.connect()
      ]);
      draftStore = store;
      loadedFonts = availableFonts;
      defaultHanFont = restoreFont("noto", availableFonts) || restoreFont("maoken", availableFonts);
      if (!defaultHanFont) throw new Error("No Chinese font available");
      hanFontId = defaultHanFont;
      await Promise.all([restoreDraft(availableFonts), restoreFavorites()]);
      ready = true;
      themeButtons.forEach(function (button) {
        button.disabled = false;
        fabricTheme.add(new Option(button.textContent, button.dataset.theme));
      });
      fabricTheme.value = activeTheme;
      if (letterStyles[selected] && customPatterns.validId(letterStyles[selected].fabric)) librarySource = "custom";
      fabricTheme.disabled = false;
      libraryButtons.forEach(function (button) { button.disabled = false; });
      customFile.disabled = false;
      newDraftButton.textContent = store.drafts ? "新建草稿" : "清空作品";
      newDraftButton.disabled = false;
      input.disabled = false;
      updateGlyphButtons();
      updateSelections();
      resetHistory();
      paint();
      if (draftStore.images && retiredFiles.size) queueDraft();
    } catch (error) {
      placeholder.textContent = "花纹或字形没加载成功，重新打开试试。";
    }
  }

  start();
}());
