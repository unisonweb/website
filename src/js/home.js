(() => {
  const all = document.querySelectorAll.bind(document);
  const one = document.querySelector.bind(document);

  const $hero = one("#hero");
  const $slides = one(".slides");

  [...all(".slide-indicator")].forEach((indicator) => {
    indicator.addEventListener("click", (_evt) => {
      stopCarousel();
      const slideNo = parseInt(indicator.dataset.slideNo);
      moveToSlide(slideNo);
      startCarousel();
    });
  });

  function next() {
    const currentSlide = getCurrentSlide();
    if (currentSlide === 5) {
      moveToSlide(1);
    } else {
      moveToSlide(currentSlide + 1);
    }
  }

  function getCurrentSlide() {
    if ($hero.classList.contains("slide-1")) return 1;
    else if ($hero.classList.contains("slide-2")) return 2;
    else if ($hero.classList.contains("slide-3")) return 3;
    else if ($hero.classList.contains("slide-4")) return 4;
    else return 5;
  }

  function moveToSlide(slideNo) {
    $hero.classList.remove(
      "slide-1",
      "slide-2",
      "slide-3",
      "slide-4",
      "slide-5"
    );
    $hero.classList.add(`slide-${slideNo}`);
    $slides.style.transform = `translateX(-${slideNo - 1}00%)`;
  }

  let t;
  function startCarousel() {
    t = setInterval(next, 20000);
  }

  function stopCarousel() {
    if (t) clearTimeout(t);
  }

  startCarousel();
})();
