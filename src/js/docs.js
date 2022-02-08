(() => {
  const all = document.querySelectorAll.bind(document);
  const one = document.querySelector.bind(document);
  const $body = one("body");

  const currentUrl = window.location.href;

  // Event handler setup

  [...all("main#doc #main-sidebar a")].forEach((a) => {
    if (a.href + "/" === currentUrl) {
      a.setAttribute("aria-current", "page");
      const section = a.closest("section");

      if (section) {
        section.classList.add("is-expanded");
        section.querySelector("h1")?.classList.add("is-expanded");
      }
    }
  });

  [...all("main#doc #main-sidebar h1")].forEach((h1) => {
    h1.addEventListener("click", () => {
      [...all("main#doc #main-sidebar .is-expanded")].forEach((n) => {
        if (n !== h1.parentNode) {
          n.classList.remove("is-expanded");
        }
      });

      h1.classList.toggle("is-expanded");
      h1.parentNode.classList.toggle("is-expanded");
    });
  });

  [...all("a")].forEach((a) => {
    a.addEventListener("click", (evt) => {
      const url = a.pathname;
      const segments = url.split("/");
      const target = segments[segments.length - 1];

      // Are we linking to a fragment?
      if (target.startsWith("_")) {
        renderDocFragment(url);
        evt.preventDefault();
      }
    });
  });

  // Modal

  function renderDocFragment(url) {
    fetch(url).then((html) => renderModal(html));
  }

  function renderModal(content) {
    const overlay = document.createElement("div");
    overlay.classList.add("modal-overlay");

    const modal = document.createElement("dialog");
    modal.classList.add("modal-dialog");
    modal.setAttribute("open", true);

    const control = document.createElement("div");
    control.classList.add("control");

    const icon = document.createElement("div");
    icon.classList.add("icon");
    icon.classList.add("icon-x");
    icon.innerHTML = `
<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2 2L12 12M2 12L12 2" stroke="currentColor" stroke-width="1.5"/>
</svg>
    `;
    control.appendChild(icon);
    control.addEventListener("click", closeModal);

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");
    modalContent.innerHTML = content;

    modal.appendChild(control);
    modal.appendChild(modalContent);
    overlay.appendChild(modal);

    $body.prepend(overlay);
    $body.classList.add("modal-open");
  }

  function closeModal() {
    one(".modal-overlay")?.remove();
    $body.classList.remove("modal-open");
  }
})();
