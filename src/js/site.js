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

  const searchClient = algoliasearch(
    "ITKVRJJI7M",
    "8a59b2585e45a15548391e3f2a8ab05b"
  );

  const { autocomplete, getAlgoliaResults } =
    window["@algolia/autocomplete-js"];

  autocomplete({
    debug: true,
    container: "#autocomplete-input",
    panelContainer: "#autocomplete-panel",
    placeholder: "Search",
    detachedMediaQuery: "none",
    getSources({ query }) {
      return [
        {
          sourceId: "docs",
          getItems() {
            return getAlgoliaResults({
              searchClient,
              queries: [
                {
                  indexName: "docs",
                  query,
                  params: {
                    hitsPerPage: 9,
                    attributesToSnippet: ["title:15", "content:14"],
                    snippetEllipsisText: "…",
                  },
                },
              ],
            });
          },
          templates: {
            item({ item, components, createElement }) {
              return createElement(
                "a",
                { className: "match", href: item.url },
                createElement(
                  "div",
                  { className: "match-title" },
                  components.Snippet({ hit: item, attribute: "title" })
                ),
                createElement(
                  "div",
                  { className: "match-content" },
                  components.Snippet({ hit: item, attribute: "content" })
                )
              );
            },
          },
          getItemUrl({ item }) {
            return item.url;
          },
        },
      ];
    },
  });

  const $autocomplete = one("#autocomplete");
  const $searchButton = one("#search-button");
  const $body = one("body");

  one(".aa-InputWrapperPrefix").innerHTML =
    $searchButton.querySelector(".icon").outerHTML;

  $searchButton.addEventListener("click", () => {
    if ($autocomplete.classList.contains("show-search")) {
      hideSearch();
    } else {
      showSearch();
    }
  });

  function showSearch() {
    $autocomplete.classList.add("show-search");
    $autocomplete.querySelector("input").focus();
    const overlay = document.createElement("div");
    overlay.classList.add("modal-overlay", "soft-overlay");
    overlay.addEventListener("click", hideSearch);
    $body.appendChild(overlay);
    $body.classList.add("modal-open");
  }

  function hideSearch() {
    $autocomplete.classList.remove("show-search");
    $autocomplete.querySelector("input").blur();
    one(".modal-overlay").remove();
    $body.classList.remove("modal-open");
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
