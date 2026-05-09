(function () {
  const data = window.NEW_ORDER_SIMULATOR_DATA || {};
  const state = {
    layers: [
      {
        type: "text",
        text: data.defaults?.text || "NEW ORDER",
        fontId: data.defaults?.fontId || "noto-sans-jp",
        colorId: data.defaults?.colorId || "black",
        x: data.defaults?.x || 0,
        y: data.defaults?.y || 0,
        fontSize: data.defaults?.fontSize || 56,
        letterSpacing: data.defaults?.letterSpacing || 0,
      },
    ],
    productId: data.products?.[0]?.id || "",
    productColor: data.products?.[0]?.colors?.[0] || "",
  };

  function getFontById(fontId) {
    return (data.fonts || []).find((font) => font.id === fontId) || data.fonts?.[0];
  }

  function getColorById(colorId) {
    return (data.threadColors || []).find((color) => color.id === colorId) || data.threadColors?.[0];
  }

  function createHatPlaceholder(canvas) {
    const background = new fabric.Rect({
      left: 110,
      top: 70,
      rx: 26,
      ry: 26,
      width: 700,
      height: 360,
      fill: "#121212",
      selectable: false,
      evented: false,
      stroke: "#303030",
      strokeWidth: 2,
    });

    const brim = new fabric.Rect({
      left: 210,
      top: 365,
      width: 500,
      height: 70,
      fill: "#1f1f1f",
      selectable: false,
      evented: false,
      rx: 12,
      ry: 12,
    });

    canvas.add(background, brim);
  }

  function initCore() {
    const canvasEl = document.getElementById("neworder-simulator-canvas");
    if (!canvasEl || !window.fabric) {
      return;
    }

    const canvas = new fabric.Canvas(canvasEl, {
      selection: false,
      preserveObjectStacking: true,
    });

    createHatPlaceholder(canvas);

    const font = getFontById(state.layers[0].fontId);
    const color = getColorById(state.layers[0].colorId);
    const textLayer = new fabric.IText(state.layers[0].text, {
      left: canvas.getCenter().left,
      top: canvas.getCenter().top,
      originX: "center",
      originY: "center",
      fontFamily: font?.fontFamily || "sans-serif",
      fontSize: state.layers[0].fontSize,
      fill: color?.hex || "#000000",
      charSpacing: state.layers[0].letterSpacing * 10,
      editable: true,
      textAlign: "center",
    });

    canvas.add(textLayer);
    canvas.setActiveObject(textLayer);
    canvas.renderAll();

    window.NewOrderSimulator = {
      canvas,
      textLayer,
      state,
      data,
      getFontById,
      getColorById,
    };

    document.dispatchEvent(new CustomEvent("neworder:simulator-ready"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCore);
  } else {
    initCore();
  }
})();
