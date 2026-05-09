(function () {
  function bindInputEvents(simulator) {
    const textInput = document.getElementById("neworder-text-input");
    const sizeInput = document.getElementById("neworder-font-size");
    const spacingInput = document.getElementById("neworder-letter-spacing");
    const xInput = document.getElementById("neworder-position-x");
    const yInput = document.getElementById("neworder-position-y");
    const productSelect = document.getElementById("neworder-product-select");
    const productColorSelect = document.getElementById("neworder-product-color-select");

    if (textInput) {
      textInput.value = simulator.state.layers[0].text;
      textInput.addEventListener("input", () => {
        simulator.state.layers[0].text = textInput.value;
        simulator.textLayer.set("text", textInput.value || " ");
        simulator.canvas.requestRenderAll();
        document.dispatchEvent(new CustomEvent("neworder:settings-changed"));
      });
    }

    if (sizeInput) {
      sizeInput.value = simulator.state.layers[0].fontSize;
      sizeInput.addEventListener("input", () => {
        simulator.state.layers[0].fontSize = Number(sizeInput.value);
        simulator.textLayer.set("fontSize", simulator.state.layers[0].fontSize);
        simulator.canvas.requestRenderAll();
        document.dispatchEvent(new CustomEvent("neworder:settings-changed"));
      });
    }

    if (spacingInput) {
      spacingInput.value = simulator.state.layers[0].letterSpacing;
      spacingInput.addEventListener("input", () => {
        simulator.state.layers[0].letterSpacing = Number(spacingInput.value);
        simulator.textLayer.set("charSpacing", simulator.state.layers[0].letterSpacing * 10);
        simulator.canvas.requestRenderAll();
        document.dispatchEvent(new CustomEvent("neworder:settings-changed"));
      });
    }

    if (xInput) {
      xInput.value = simulator.state.layers[0].x;
      xInput.addEventListener("input", () => {
        simulator.state.layers[0].x = Number(xInput.value);
        simulator.textLayer.set("left", simulator.canvas.getCenter().left + simulator.state.layers[0].x);
        simulator.canvas.requestRenderAll();
        document.dispatchEvent(new CustomEvent("neworder:settings-changed"));
      });
    }

    if (yInput) {
      yInput.value = simulator.state.layers[0].y;
      yInput.addEventListener("input", () => {
        simulator.state.layers[0].y = Number(yInput.value);
        simulator.textLayer.set("top", simulator.canvas.getCenter().top + simulator.state.layers[0].y);
        simulator.canvas.requestRenderAll();
        document.dispatchEvent(new CustomEvent("neworder:settings-changed"));
      });
    }

    function fillProductColorOptions(productId) {
      const product = (simulator.data.products || []).find((item) => item.id === productId);
      if (!productColorSelect || !product) {
        return;
      }
      productColorSelect.innerHTML = "";
      product.colors.forEach((color) => {
        const option = document.createElement("option");
        option.value = color;
        option.textContent = color;
        productColorSelect.appendChild(option);
      });
      productColorSelect.value = product.colors[0];
      simulator.state.productColor = product.colors[0];
    }

    if (productSelect) {
      productSelect.innerHTML = "";
      (simulator.data.products || []).forEach((product) => {
        const option = document.createElement("option");
        option.value = product.id;
        option.textContent = product.name;
        productSelect.appendChild(option);
      });
      productSelect.value = simulator.state.productId;
      fillProductColorOptions(simulator.state.productId);
      productSelect.addEventListener("change", () => {
        simulator.state.productId = productSelect.value;
        fillProductColorOptions(productSelect.value);
        document.dispatchEvent(new CustomEvent("neworder:settings-changed"));
      });
    }

    if (productColorSelect) {
      productColorSelect.addEventListener("change", () => {
        simulator.state.productColor = productColorSelect.value;
        document.dispatchEvent(new CustomEvent("neworder:settings-changed"));
      });
    }

    const colorList = document.getElementById("neworder-color-list");
    if (colorList) {
      colorList.innerHTML = "";
      (simulator.data.threadColors || []).forEach((color) => {
        const swatch = document.createElement("button");
        swatch.type = "button";
        swatch.className = "neworder-color-swatch";
        swatch.style.backgroundColor = color.hex;
        swatch.title = color.name;
        swatch.dataset.colorId = color.id;
        swatch.addEventListener("click", () => {
          simulator.state.layers[0].colorId = color.id;
          simulator.textLayer.set("fill", color.hex);
          simulator.canvas.requestRenderAll();
          document.dispatchEvent(new CustomEvent("neworder:settings-changed"));
        });
        colorList.appendChild(swatch);
      });
    }

    simulator.textLayer.on("moving", () => {
      const center = simulator.canvas.getCenter();
      simulator.state.layers[0].x = Math.round(simulator.textLayer.left - center.left);
      simulator.state.layers[0].y = Math.round(simulator.textLayer.top - center.top);
      if (xInput) xInput.value = simulator.state.layers[0].x;
      if (yInput) yInput.value = simulator.state.layers[0].y;
      document.dispatchEvent(new CustomEvent("neworder:settings-changed"));
    });
  }

  document.addEventListener("neworder:simulator-ready", () => {
    if (!window.NewOrderSimulator) {
      return;
    }
    bindInputEvents(window.NewOrderSimulator);
    document.dispatchEvent(new CustomEvent("neworder:settings-changed"));
  });
})();
