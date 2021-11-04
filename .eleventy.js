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

  config.addPlugin(transformDomPlugin, [
    // Replace references to Unison Share link
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
    // Doc links by default link to .html files, but eleventy links worth
    // without the file extension
    {
      selector: "a",
      transform: ({ elements }) => {
        elements.forEach((anchor) => {
          if (anchor.href.endsWith(".html")) {
            anchor.href = anchor.href.replace(/\.html$/, "");
          }
        });
      },
    },
  ]);

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
    },
    passthroughFileCopy: true,
  };
};
