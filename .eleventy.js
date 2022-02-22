const R = require("ramda");
const fs = require("fs");
const { convert } = require("html-to-text");
const { decode } = require("html-entities");

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

  config.addFilter("algoliafy", function (text) {
    // Remove code
    text = text.replaceAll(/<code>.*?<\/code>/gs, "");

    // Remove html tags
    text = text.replace(/<.*?>/g, " "); // Extra space for code blocks

    // Remove backslashes
    text = text.replace(/\\/g, "");

    // Remove tabs
    text = text.replace(/\t/g, "");

    // Remove big spaces and punctuation
    text = text.replace(/\n/g, " ");

    // Remove repeated spaces
    text = text.replace(/[ ]{2,}/g, " ");

    // Remove quotes
    text = text.replace(/"/g, "");

    // Support -> and <-
    text = text.replaceAll("-&gt;", "->");
    text = text.replaceAll("&lt;-", "<-");

    //now limit to 8k
    return text.substring(0, 8000);
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
