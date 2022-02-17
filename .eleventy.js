const R = require("ramda");
const fs = require("fs");

const leftArrow = fs.readFileSync("./src/img/icon-arrow-left.svg");
const rightArrow = fs.readFileSync("./src/img/icon-arrow-right.svg");

function paginationItem(direction, link) {
  let directionIndicator;
  if (direction === "prev") {
    directionIndicator = `
      <div class="direction">
        <div class="icon">${leftArrow}</div>Prev
      </div>
    `;
  } else {
    directionIndicator = `
      <div class="direction">
        Next<div class="icon">${rightArrow}</div>
      </div>
      `;
  }

  return `
    <a href="${link.href}" class="${direction}">
      ${directionIndicator}
      <div class="article-title">${link.label}</div>
    </a>
  `;
}

function prev(link) {
  return paginationItem("prev", link);
}

function next(link) {
  return paginationItem("next", link);
}

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

  config.addShortcode("articlePagination", function (sidebar, current) {
    const first = 0;
    const last = sidebar.length - 1;
    const c = R.findIndex((l) => l.href + "/" === current, sidebar);

    if (c === -1) return "";

    let links = [];

    if (c > first) {
      const p = sidebar[c - 1];
      links.push(prev(p));
    }

    if (c < last) {
      const n = sidebar[c + 1];
      links.push(next(n));
    }

    if (links.length > 0) {
      return `<footer class="article-pagination">${links.join("")}</footer>`;
    } else {
      return "";
    }
  });

  // Remove <code>.*</code>, remove HTML, then with plain text, limit to 5k chars
  config.addFilter("algExcerpt", function (text) {
    //first remove code
    text = text.replace(/<code class="language-.*?">.*?<\/code>/gs, "");
    //now remove html tags
    text = text.replace(/<.*?>/g, "");
    //now limit to 5k
    return text.substring(0, 5000);
  });

  config.addFilter("jsonify", function (text) {
    return JSON.stringify(text);
  });

  return {
    dir: {
      input: "src",
      output: "build/site",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
    },
    passthroughFileCopy: true,
  };
};
