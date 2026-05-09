(function () {
  function fillFontSelect(simulator) {
    const select = document.getElementById("neworder-font-select");
    if (!select) {
      return;
    }

    select.innerHTML = "";
    (simulator.data.fonts || []).forEach((font) => {
      const option = document.createElement("option");
      option.value = font.id;
      option.textContent = font.displayName;
      select.appendChild(option);
    });
    select.value = simulator.state.layers[0].fontId;

    select.addEventListener("change", () => {
      const font = simulator.getFontById(select.value);
      simulator.state.layers[0].fontId = select.value;
      simulator.textLayer.set("fontFamily", font?.fontFamily || "sans-serif");
      simulator.canvas.requestRenderAll();
      document.dispatchEvent(new CustomEvent("neworder:settings-changed"));
    });
  }

  document.addEventListener("neworder:simulator-ready", () => {
    if (!window.NewOrderSimulator) {
      return;
    }
    fillFontSelect(window.NewOrderSimulator);
  });
})();
