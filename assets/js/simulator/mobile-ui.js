(function () {
  function bindMobileUi() {
    const controls = document.querySelector(".neworder-controls");
    if (!controls) {
      return;
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = "neworder-mobile-toggle";
    button.textContent = "操作パネル";
    button.addEventListener("click", () => {
      controls.classList.toggle("is-open");
    });

    const page = document.querySelector(".neworder-simulator-page");
    if (page) {
      page.insertBefore(button, page.firstChild);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindMobileUi);
  } else {
    bindMobileUi();
  }
})();
