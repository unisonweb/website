(() => {
  const all = document.querySelectorAll.bind(document);
  const one = document.querySelector.bind(document);

  [...all(".fold-toggle")].forEach((toggle) => {
    toggle.addEventListener("click", (ev) => {
      const folded = ev.currentTarget.parentNode;
      folded.classList.toggle("is-folded");
    });
  });

  [...all(".folded-summary"), ...all(".folded-details > div .word")].forEach(
    (summary) => {
      summary.addEventListener("click", (ev) => {
        const folded = ev.currentTarget.closest(".folded");
        if (!folded) {
          return;
        }
        folded.classList.toggle("is-folded");
      });
    }
  );

  [...all(".tooltip-trigger")].forEach((trigger) => {
    trigger.addEventListener("mouseenter", (_ev) => {
      showTooltip(trigger);
    });

    trigger.addEventListener("mouseleave", (_ev) => {
      trigger.querySelector(".tooltip")?.remove();
    });

    trigger.addEventListener("touchstart", (_ev) => {
      showTooltip(trigger);
    });
  });

  one("body").addEventListener("touchstart", (_ev) => {
    [...all(".tooltip")].forEach((t) => t.remove());
  });

  function showTooltip(trigger) {
    const tooltipContent = one(`#${trigger.dataset.tooltipContentId}`);

    if (tooltipContent) {
      const tooltip = document.createElement("div");

      if (trigger.closest(".unison-doc")) {
        tooltip.classList.add("tooltip", "below", "arrow-start");
      } else {
        tooltip.classList.add("tooltip", "below", "arrow-middle");
      }

      const bubble = document.createElement("div");
      bubble.classList.add("tooltip-bubble");
      bubble.innerHTML = tooltipContent.innerHTML;

      tooltip.appendChild(bubble);
      trigger.appendChild(tooltip);
    }
  }

  [...all("#main-content .unison-doc :is(h1, h2, h3, h4, h5, h6)")].forEach(
    (heading) => {
      if (heading.id) {
        heading.addEventListener("click", (_ev) => {
          window.location.hash = heading.id;
        });
      }
    }
  );

  // -- Search ----------------------------------------------------------------
  // Client-side search over the page headings in /search.json, generated at
  // build time. (Replaces the previous Algolia-powered search.)

  const $autocomplete = one("#autocomplete");
  const $searchButton = one("#search-button");
  const $body = one("body");

  if ($autocomplete && $searchButton) {
    let searchIndex = null;
    let searchIndexPromise = null;

    function loadSearchIndex() {
      if (!searchIndexPromise) {
        searchIndexPromise = fetch("/search.json")
          .then((res) => res.json())
          .then((entries) => {
            searchIndex = entries;
          });
      }
      return searchIndexPromise;
    }

    function escapeHtml(text) {
      return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
    }

    function highlight(text, words) {
      const pattern = words
        .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|");
      if (!pattern) return escapeHtml(text);
      const re = new RegExp(`(${pattern})`, "gi");
      return escapeHtml(text).replace(re, "<mark>$1</mark>");
    }

    function search(query) {
      const words = query.toLowerCase().split(/\s+/).filter(Boolean);
      if (!searchIndex || words.length === 0) return [];
      const results = [];
      for (const entry of searchIndex) {
        const title = entry.title.toLowerCase();
        const heading = (entry.heading || "").toLowerCase();
        const snippet = (entry.snippet || "").toLowerCase();
        let score = 0;
        let matches = true;
        for (const word of words) {
          const inTitle = title.includes(word);
          const inHeading = heading.includes(word);
          const inSnippet = snippet.includes(word);
          if (!inTitle && !inHeading && !inSnippet) {
            matches = false;
            break;
          }
          score += (inTitle ? 3 : 0) + (inHeading ? 2 : 0) + (inSnippet ? 1 : 0);
        }
        if (matches) results.push({ score, entry });
      }
      results.sort((a, b) => b.score - a.score);
      return results.slice(0, 9).map((r) => r.entry);
    }

    const $inputWrap = one("#autocomplete-input");
    const $panel = one("#autocomplete-panel");

    const $form = document.createElement("div");
    $form.className = "search-form";

    const $icon = document.createElement("div");
    $icon.className = "search-icon";
    $icon.innerHTML = $searchButton.querySelector(".icon").outerHTML;

    const $input = document.createElement("input");
    $input.type = "search";
    $input.placeholder = "Search";
    $input.setAttribute("autocomplete", "off");
    $input.setAttribute("spellcheck", "false");

    $form.appendChild($icon);
    $form.appendChild($input);
    $inputWrap.appendChild($form);

    const $results = document.createElement("div");
    $results.className = "search-results";
    $panel.appendChild($results);

    let currentResults = [];
    let selectedIndex = -1;

    function renderResults(query) {
      currentResults = query.trim() ? search(query) : [];
      selectedIndex = -1;
      $results.innerHTML = "";
      const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
      if (currentResults.length === 0) {
        if (query.trim()) {
          const empty = document.createElement("div");
          empty.className = "search-empty";
          empty.textContent = "No results.";
          $results.appendChild(empty);
        }
        return;
      }
      for (const entry of currentResults) {
        const link = document.createElement("a");
        link.className = "match";
        link.href = entry.url;
        const label = entry.heading
          ? `${entry.title} › ${entry.heading}`
          : entry.title;
        const title = document.createElement("div");
        title.className = "match-title";
        title.innerHTML = highlight(label, words);
        link.appendChild(title);
        if (entry.snippet) {
          const content = document.createElement("div");
          content.className = "match-content";
          content.innerHTML = highlight(entry.snippet, words);
          link.appendChild(content);
        }
        link.addEventListener("click", hideSearch);
        $results.appendChild(link);
      }
    }

    function setSelected(index) {
      selectedIndex = index;
      [...$results.querySelectorAll(".match")].forEach((el, i) => {
        if (i === index) el.setAttribute("aria-selected", "true");
        else el.removeAttribute("aria-selected");
      });
    }

    $input.addEventListener("input", () => renderResults($input.value));

    $input.addEventListener("keydown", (ev) => {
      if (ev.key === "ArrowDown") {
        ev.preventDefault();
        setSelected(Math.min(selectedIndex + 1, currentResults.length - 1));
      } else if (ev.key === "ArrowUp") {
        ev.preventDefault();
        setSelected(Math.max(selectedIndex - 1, 0));
      } else if (ev.key === "Enter") {
        if (selectedIndex >= 0 && currentResults[selectedIndex]) {
          window.location.href = currentResults[selectedIndex].url;
          hideSearch();
        }
      } else if (ev.key === "Escape") {
        hideSearch();
      }
    });

    $searchButton.addEventListener("click", () => {
      if ($autocomplete.classList.contains("show-search")) {
        hideSearch();
      } else {
        showSearch();
      }
    });

    function showSearch() {
      $autocomplete.classList.add("show-search");
      loadSearchIndex();
      $input.focus();
      const overlay = document.createElement("div");
      overlay.classList.add("modal-overlay", "soft-overlay");
      overlay.addEventListener("click", hideSearch);
      $body.appendChild(overlay);
      $body.classList.add("modal-open");
    }

    function hideSearch() {
      $autocomplete.classList.remove("show-search");
      $input.blur();
      $input.value = "";
      renderResults("");
      const overlay = one(".modal-overlay");
      if (overlay) overlay.remove();
      $body.classList.remove("modal-open");
    }
  }


  // API
  window.U = {
    renderModal(content) {
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
      control.addEventListener("click", U.closeModal);

      const modalContent = document.createElement("div");
      modalContent.classList.add("modal-content");
      modalContent.appendChild(content);

      modal.appendChild(control);
      modal.appendChild(modalContent);
      overlay.appendChild(modal);

      overlay.addEventListener("click", (evt) => {
        if (evt.target == overlay) {
          U.closeModal();
        }
      });

      $body.prepend(overlay);
      $body.classList.add("modal-open");
    },

    closeModal() {
      one(".modal-overlay")?.remove();
      $body.classList.remove("modal-open");
    },

    node(nodeName, attrs, children) {
      let n = document.createElement(nodeName);

      for (c of children) {
        if (typeof c == "string") {
          n.textContent = c;
        } else {
          n.appendChild(c);
        }
      }

      for (a in attrs) {
        if (a === "class_") {
          n.setAttribute("class", attrs[a]);
        } else {
          n.setAttribute(a, attrs[a]);
        }
      }

      return n;
    },

    p(attrs, children) {
      return U.node("p", attrs, children);
    },

    h1(attrs, children) {
      return U.node("h1", attrs, children);
    },

    div(attrs, children) {
      return U.node("div", attrs, children);
    },

    a(attrs, children) {
      return U.node("a", attrs, children);
    },

    input(attrs) {
      return U.node("input", attrs, []);
    },

    svg(attrs, children) {
      return U.node(
        "svg",
        { ...attrs, xmlns: "http://www.w3.org/2000/svg" },
        children
      );
    },

    path(attrs) {
      return U.node("path", attrs, []);
    },

    button(attrs, children) {
      return U.node("button", attrs, children);
    },
  };
})();
