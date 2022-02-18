(() => {
  const all = document.querySelectorAll.bind(document);
  const one = document.querySelector.bind(document);

  [...all(".fold-toggle")].forEach((toggle) => {
    toggle.addEventListener("click", (ev) => {
      const folded = ev.currentTarget.parentNode;
      folded.classList.toggle("is-folded");
    });
  });

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
      tooltip.classList.add("tooltip", "below", "arrow-middle");

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

  const { autocomplete, getAlgoliaResults } = window[
    "@algolia/autocomplete-js"
  ];

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
  const $searchButton = one("#autocomplete .toggle");

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
    one("body").appendChild(overlay);
  }

  function hideSearch() {
    $autocomplete.classList.remove("show-search");
    $autocomplete.querySelector("input").blur();
    one(".modal-overlay").remove();
  }
})();
