(function () {
  function getSettings(simulator) {
    return {
      product: simulator.state.productId,
      bodyColor: simulator.state.productColor,
      layers: simulator.state.layers.map((layer) => ({
        type: layer.type,
        text: layer.text,
        fontId: layer.fontId,
        colorId: layer.colorId,
        fontSize: layer.fontSize,
        letterSpacing: layer.letterSpacing,
        x: layer.x,
        y: layer.y,
      })),
    };
  }

  function bindExport(simulator) {
    const exportButton = document.getElementById("neworder-export-button");
    const exportLink = document.getElementById("neworder-export-download");
    const settingsBox = document.getElementById("neworder-settings-json");

    function refreshSettingsView() {
      if (!settingsBox) {
        return;
      }
      settingsBox.value = JSON.stringify(getSettings(simulator), null, 2);
    }

    document.addEventListener("neworder:settings-changed", refreshSettingsView);
    refreshSettingsView();

    if (!exportButton || !exportLink) {
      return;
    }

    exportButton.addEventListener("click", () => {
      const dataUrl = simulator.canvas.toDataURL({
        format: "png",
        quality: 1,
        multiplier: 2,
      });

      exportLink.href = dataUrl;
      exportLink.hidden = false;
      exportLink.textContent = "画像をダウンロード";
    });
  }

  document.addEventListener("neworder:simulator-ready", () => {
    if (!window.NewOrderSimulator) {
      return;
    }
    bindExport(window.NewOrderSimulator);
  });
})();
