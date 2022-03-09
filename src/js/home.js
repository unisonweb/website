(() => {
  // -- Helpers ---------------------------------------------------------------

  function getOS() {
    const userAgent = window.navigator.userAgent;
    const platform = window.navigator.platform;
    const macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"];
    const windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"];
    const iosPlatforms = ["iPhone", "iPad", "iPod"];
    const os = null;

    if (macosPlatforms.includes(platform)) {
      return "Mac OS";
    } else if (iosPlatforms.includes(platform)) {
      return "iOS";
    } else if (windowsPlatforms.includes(platform)) {
      return "Windows";
    } else if (/Android/.test(userAgent)) {
      return "Android";
    } else if (!os && /Linux/.test(platform)) {
      return "Linux";
    }

    return null;
  }

  const all = document.querySelectorAll.bind(document);
  const one = document.querySelector.bind(document);

  // -- Install ---------------------------------------------------------------
  //
  function setupInstall(media) {
    const installClass = (() => {
      switch (getOS()) {
        case "Mac OS":
          return "install-mac";
        /*
      case "Linux":
        return "install-linux";
      */
        default:
          return "install-other";
      }
    })();

    if (media.matches) {
      [...all(".install")].forEach((install) => {
        install.style.display = "none";
      });

      one(".install.install-other").style.display = "block";
    } else {
      [...all(".install")].forEach((install) => {
        if (install.classList.contains(installClass)) {
          install.style.display = "block";
        } else {
          install.style.display = "none";
        }
      });

      const $installInput = one(`.install.${installClass} input`);

      one(".copy-installation-command")?.addEventListener("click", () => {
        if ($installInput) {
          navigator.clipboard.writeText($installInput.value);
        }
      });
    }
  }

  const media = window.matchMedia("(max-width: 600px)");
  setupInstall(media);
  media.addListener(setupInstall);

  // -- Carousel --------------------------------------------------------------

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
