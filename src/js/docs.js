(() => {
  const all = document.querySelectorAll.bind(document);

  const currentUrl = window.location.href;

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
})();
