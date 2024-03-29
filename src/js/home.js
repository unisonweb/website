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

  one(".rosetta-help").addEventListener("click", () => {
    const { h1, p, div, a, input, path, svg, renderModal, button } = U;

    const title = h1({}, ["Installing Rosetta for Mac"]);

    const explainer = p({}, [
      "Unison for Apple Silicon Macs, such as the M1 and M2, currently requires Rosetta to run.",
    ]);
    const explainer2 = p({}, [
      "Rosetta (from Apple) enables a Mac with Apple Silicon to use applications built for a Mac with an Intel processor (which is the case with Unison).",
    ]);

    const preCommand = p({}, [
      "Rosetta can be installed with the following command:",
    ]);

    const actualCommand = "softwareupdate --install-rosetta";

    const copyIcon = div({ class_: "icon icon-clipboard" }, []);
    copyIcon.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M8 2.25C8 2.11193 7.88807 2 7.75 2H6.25C6.11193 2 6 2.11193 6 2.25V2.75C6 2.88807 6.11193 3 6.25 3H7.75C7.88807 3 8 2.88807 8 2.75V2.25ZM6 1C5.44772 1 5 1.44772 5 2V3C5 3.55228 5.44772 4 6 4H8C8.55228 4 9 3.55228 9 3V2C9 1.44772 8.55228 1 8 1H6Z" fill="currentColor"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M3 2.5C3 2.22386 3.22386 2 3.5 2C3.77614 2 4 2.22386 4 2.5V10.5C4 10.7761 4.22386 11 4.5 11H9.5C9.77614 11 10 10.7761 10 10.5V2.5C10 2.22386 10.2239 2 10.5 2C10.7761 2 11 2.22386 11 2.5V11C11 11.5523 10.5523 12 10 12H4C3.44772 12 3 11.5523 3 11V2.5Z" fill="currentColor"/>
    </svg>
    `;
    const copy = div({ class_: "copy-rosetta-command" }, [copyIcon]);
    copy.addEventListener("click", () => {
      navigator.clipboard.writeText(actualCommand);
    });

    const command = div({ class_: "rosetta-command copy-field" }, [
      div({ class_: "prompt" }, ["$"]),
      input({ readonly: "readonly", value: actualCommand }),
      copy,
    ]);

    const readMore = a(
      {
        class_: "learn-more",
        href: "https://developer.apple.com/documentation/apple-silicon/about-the-rosetta-translation-environment",
        target: "_blank",
      },
      ["Read more about what Rosetta is and what it does."]
    );

    const closeButton = button(
      {
        class_: "button primary-mono contained medium",
      },
      ["👍 Got it!"]
    );

    closeButton.addEventListener("click", U.closeModal);

    const rosettaHelp = div({ class_: "rosetta-help-modal" }, [
      title,
      explainer,
      explainer2,
      preCommand,
      command,
      readMore,
      closeButton,
    ]);

    renderModal(rosettaHelp);
  });

  // -- Dev Flow --------------------------------------------------------------

  function startDevFlow() {
    const editor = one(".unison-dev-flow_editor");
    const editorContent = editor.querySelector(".syntax");
    const ucm = one(".unison-dev-flow_ucm");
    const ucmContent = ucm.querySelector(".unison-dev-flow_ucm-body");
    const typing = { delay: 75 };
    const devFlow = one(".unison-dev-flow");

    let editorWriter;
    let ucmWriter;

    function setupWriter() {
      editorContent.innerHTML = "";
      ucmContent.innerHTML = "";
      editorWriter = new window.Typewriter(editorContent, typing);

      editorWriter
        .typeString(
          `<span class="hash-qualifier"><span class="fqn"><span class="segment">helloWorld</span></span></span><span class="type-ascription-colon"> :</span><span class="blank"> </span><span class="delay-force-char">'</span><span class="ability-braces">{</span><a href="https://share.unison-lang.org/@unison/code/latest/namespaces/public/;/types/@@IO" target="_blank" class="type-reference">IO</a><span class="blank">,</span><span class="blank"> </span><a href="https://share.unison-lang.org/@unison/code/latest/namespaces/public/;/types/@4n0fgs00hpsj3paqnm9bfm4nbt9cbrin3hl88i992m9tjiq1ik7eq72asu4hcg885uti36tbnj5rudt56eahhnut1nobofg86pk1bng" target="_blank" class="type-reference">Exception</a><span class="ability-braces">}</span><span class="blank"> </span><span class="unit">()</span><span class="blank">
</span><span class="hash-qualifier"><span class="fqn"><span class="segment">helloWorld</span></span></span><span class="blank"> </span><span class="var">_</span><span class="binding-equals"> =</span><span class="blank"> </span><a href="https://share.unison-lang.org/@unison/code/latest/namespaces/public/;/terms/@le5947v6dm1nqqjba9ipodo56uge7bu2d45lsmv6u7lgqqoas9k38bd4khu0iemok6u3iqcnai4asbnvl4ktc0r21liu7m45pc5j40g" target="_blank" class="term-reference">printLine</a><span class="blank"> </span><span class="text-literal">"Hello World!"</span>`
        )
        .pauseFor(1000)
        .callFunction(() => {
          editor.classList.remove("unison-dev-flow_window-focus");
          ucm.classList.add("unison-dev-flow_window-focus");

          ucmWriter = new window.Typewriter(ucmContent, typing);

          ucmWriter
            .pauseFor(1000)
            .pasteString(
              `
  I found and <strong>typechecked</strong> these definitions in
  <span class="ucm-file">~/scratch.u</span>. If you do an \`add\` or \`update\`, 
  here's how your codebase would change:

    <span class="ucm-add">⍟ These new definitions are ok to \`add\`:</span>

      <span class="ucm-emphasized">helloWorld</span> : <span class="ucm-delayed">'</span><span class="ucm-subdued">{</span>IO, Exception<span class="ucm-subdued">}</span> ()

.> `
            )
            .pauseFor(2500)
            .typeString("add")
            .pauseFor(1000)
            .pasteString(
              `

  <span class="ucm-add">⍟ I've added these definitions:</span>

    <span class="ucm-emphasized">helloWorld</span> : <span class="ucm-delayed">'</span><span class="ucm-subdued">{</span>IO, Exception<span class="ucm-subdued">}</span> ()

.> `
            )
            .pauseFor(2500)
            .typeString("run helloWorld")
            .pauseFor(1000)
            .pasteString(
              `
Hello World!

  ()`
            )
            .callFunction(() => {
              devFlow.dataset.playState = "stopped";
            })
            .start();
        });
      return editorWriter;
    }

    function isPlaying(devFlow) {
      return devFlow.dataset.playState == "playing";
    }

    all(".unison-dev-flow .media-button").forEach((b) => {
      b.addEventListener("click", (_) => {
        if (isPlaying(devFlow)) {
          editorWriter?.stop();
          ucmWriter?.stop();
          devFlow.dataset.playState = "stopped";
        } else {
          ucm.classList.remove("unison-dev-flow_window-focus");
          editor.classList.add("unison-dev-flow_window-focus");

          setupWriter();
          editorWriter?.start();
          devFlow.dataset.playState = "playing";
        }
      });
    });
  }

  startDevFlow();
})();
