(() => {
  const all = document.querySelectorAll.bind(document);
  const one = document.querySelector.bind(document);

  const currentUrl = window.location.href;

  // Event handler setup

  [...all("main#docs #index a")].forEach((a) => {
    if (a.href + "/" === currentUrl) {
      a.setAttribute("aria-current", "page");
      const section = a.closest("section");

      if (section) {
        section.classList.add("is-expanded");
        section.querySelector("h1")?.classList.add("is-expanded");
      }
    }
  });

  [...all("main#docs #index h1")].forEach((h1) => {
    h1.addEventListener("click", () => {
      [...all("main#docs #index .is-expanded")].forEach((n) => {
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

  one("#toggle-index").addEventListener("click", () => {
    one("main#docs")?.classList.toggle("show-index");
  });

  function renderDocFragment(url) {
    fetch(url)
      .then((r) => r.text())
      .then((html) => {
        const h = U.div({}, []);
        h.innerHTML = html;
        U.renderModal(h);
      });
  }
})();
