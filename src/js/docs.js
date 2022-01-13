(() => {
  const all = document.querySelectorAll.bind(document);
  const one = document.querySelector.bind(document);

  const currentUrl = window.location.href;

  const section = one("section > section");

  if (section) {
    section.classList.add("welcome");
  }

  [...all("main#doc #main-sidebar a")].forEach((a) => {
    if (a.href + "/" === currentUrl) {
      a.setAttribute("aria-current", true);
      a.closest("section").classList.toggle("is-expanded");
    }
  });

  [...all("main#doc #main-sidebar h1")].forEach((h1) => {
    h1.addEventListener("click", () => {
      [...all("main#doc #main-sidebar .is-expanded")].forEach((n) => {
        if (n !== h1.parentNode) {
          n.classList.remove("is-expanded");
        }
      });

      h1.parentNode.classList.toggle("is-expanded");
    });
  });
})();
