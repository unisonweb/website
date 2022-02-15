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
    });

    trigger.addEventListener("mouseleave", (_ev) => {
      trigger.querySelector(".tooltip")?.remove();
    });
  });

  [...all("#main-content .unison-doc :is(h1, h2, h3, h4, h5, h6)")].forEach(
    (heading) => {
      if (heading.id) {
        heading.addEventListener("click", (_ev) => {
          window.location.hash = heading.id;
        });
      }
    }
  );
})();
