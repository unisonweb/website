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

  const escapeHtml = (text) =>
    text
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

  const highlight = (text, words) => {
    const pattern = words
      .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|");
    if (!pattern) return escapeHtml(text);
    const re = new RegExp(`(${pattern})`, "gi");
    return escapeHtml(text).replace(re, "<mark>$1</mark>");
  };

  const search = (entries, query) => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!entries || words.length === 0) return [];
    return entries
      .reduce((results, entry) => {
        const title = entry.title.toLowerCase();
        const heading = (entry.heading || "").toLowerCase();
        const snippet = (entry.snippet || "").toLowerCase();
        const score = words.reduce((total, word) => {
          if (total === null) return null;
          const inTitle = title.includes(word);
          const inHeading = heading.includes(word);
          const inSnippet = snippet.includes(word);
          if (!inTitle && !inHeading && !inSnippet) return null;
          return total + (inTitle ? 3 : 0) + (inHeading ? 2 : 0) + (inSnippet ? 1 : 0);
        }, 0);
        if (score !== null) results.push({ score, entry });
        return results;
      }, [])
      .sort((a, b) => b.score - a.score)
      .slice(0, 9)
      .map(({ entry }) => entry);
  };

  const renderResults = (container, entries, query, onSelect) => {
    container.innerHTML = "";
    const trimmed = query.trim();
    if (entries.length === 0) {
      container.hidden = !trimmed;
      if (trimmed) {
        const empty = document.createElement("div");
        empty.className = "search-empty";
        empty.textContent = "No results.";
        container.appendChild(empty);
      }
      return;
    }
    container.hidden = false;
    const words = trimmed.toLowerCase().split(/\s+/).filter(Boolean);
    entries.forEach((entry) => {
      const link = document.createElement("a");
      link.className = "match";
      link.href = entry.url;
      link.addEventListener("click", onSelect);
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
      container.appendChild(link);
    });
  };

  // Entry point for the search UI. No-ops on pages without the docs sidebar
  // markup (site.js is loaded on every page).
  const initSearch = () => {
    const $autocomplete = one("#autocomplete");
    const $searchButton = one("#search-button");
    if (!$autocomplete || !$searchButton) return;
    const $body = one("body");
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
    $results.hidden = true;
    $panel.appendChild($results);

    let entriesPromise;
    const loadEntries = () => {
      if (!entriesPromise) {
        entriesPromise = fetch("/search.json").then((res) => res.json());
      }
      return entriesPromise;
    };

    let currentResults = [];
    // Maybe<number> encoded as a list: [] means no selection, [i] is the
    // selected result index.
    let selectedIndex = [];

    const hideSearch = () => {
      $autocomplete.classList.remove("show-search");
      $input.blur();
      $input.value = "";
      currentResults = [];
      selectedIndex = [];
      renderResults($results, [], "", hideSearch);
      const overlay = one(".modal-overlay");
      if (overlay) overlay.remove();
      $body.classList.remove("modal-open");
    };

    const showSearch = () => {
      $autocomplete.classList.add("show-search");
      loadEntries();
      $input.focus();
      const overlay = document.createElement("div");
      overlay.classList.add("modal-overlay", "soft-overlay");
      overlay.addEventListener("click", hideSearch);
      $body.appendChild(overlay);
      $body.classList.add("modal-open");
    };

    const selectResult = (index) => {
      selectedIndex = [index];
      [...$results.querySelectorAll(".match")].forEach((el, i) => {
        if (i === index) el.setAttribute("aria-selected", "true");
        else el.removeAttribute("aria-selected");
      });
    };

    const updateResults = (query) => {
      loadEntries().then((entries) => {
        currentResults = search(entries, query);
        selectedIndex = [];
        renderResults($results, currentResults, query, hideSearch);
      });
    };

    $input.addEventListener("input", () => updateResults($input.value));

    $input.addEventListener("keydown", (ev) => {
      if (ev.key === "ArrowDown") {
        ev.preventDefault();
        if (selectedIndex.length === 0) {
          selectResult(0);
        } else {
          selectedIndex.forEach((selected) => {
            selectResult(Math.min(selected + 1, currentResults.length - 1));
          });
        }
      } else if (ev.key === "ArrowUp") {
        ev.preventDefault();
        if (selectedIndex.length === 0) {
          selectResult(0);
        } else {
          selectedIndex.forEach((selected) => {
            selectResult(Math.max(selected - 1, 0));
          });
        }
      } else if (ev.key === "Enter") {
        selectedIndex.forEach((selected) => {
          if (currentResults[selected]) {
            window.location.href = currentResults[selected].url;
            hideSearch();
          }
        });
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
  };

  initSearch();


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
