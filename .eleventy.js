const transformDomPlugin = require("eleventy-plugin-transformdom");

module.exports = function (config) {
  // Exclusively use .eleventyignore, to make sure src/docs are used as source
  config.setUseGitIgnore(false);

  // Layouts
  config.addLayoutAlias("base", "base.njk");

  // Static files passthrough
  config.addPassthroughCopy("src/css");
  config.addPassthroughCopy("src/js");
  config.addPassthroughCopy("src/img");
  config.addPassthroughCopy("src/video");
  config.addPassthroughCopy("src/fonts");
  config.addPassthroughCopy("src/favicon.svg");
  config.addPassthroughCopy("src/favicon.ico");
  config.addPassthroughCopy("src/robots.txt");

  // Shortcodes
  config.addShortcode("currentYear", () => `${new Date().getFullYear()}`);

  // Replace references to Unison Share link
  config.addPlugin(transformDomPlugin, [
    {
      selector: "span[data-ref]",
      transform: ({ document, elements }) => {
        elements.forEach((span) => {
          const ref = span.dataset.ref;
          const refType = span.dataset.refType;

          if (ref && refType) {
            let link = document.createElement("a");
            link.classNames = span.classNames;

            link.href = `https://share.unison-lang.org/latest/namespaces/unison/website/${refType}s/${ref}`;
            link.target = "_blank";
            link.innerHTML = span.innerHTML;

            span.replaceWith(link);
          }
        });
      },
    },
  ]);

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "includes",
      layouts: "layouts",
      data: "data",
    },
    passthroughFileCopy: true,
  };
};
