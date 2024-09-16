const R = require("ramda");
const fs = require("fs");
const { parse } = require("date-fns");
const { format, utcToZonedTime } = require("date-fns-tz");
const authors = require("./src/authors.json");
const leftArrow = fs.readFileSync("./src/assets/icon-arrow-left.svg");
const rightArrow = fs.readFileSync("./src/assets/icon-arrow-right.svg");
const pluginRss = require("@11ty/eleventy-plugin-rss");

function titleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

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

module.exports = function(config) {
  // Exclusively use .eleventyignore, to make sure src/docs are used as source
  config.setUseGitIgnore(false);

  // Layouts
  config.addLayoutAlias("base", "base.njk");

  // Static files passthrough
  config.addPassthroughCopy("src/css");
  config.addPassthroughCopy("src/js");
  config.addPassthroughCopy("src/assets");
  config.addPassthroughCopy("src/video");
  config.addPassthroughCopy("src/fonts");
  config.addPassthroughCopy("src/favicon.svg");
  config.addPassthroughCopy("src/favicon.ico");
  config.addPassthroughCopy("src/robots.txt");
  config.addPassthroughCopy("src/_redirects");

  config.addShortcode("isFutureDate", (date) => {
    return true;
  });

  // Shortcodes
  config.addShortcode("currentYear", () => `${new Date().getFullYear()}`);

  config.addShortcode("articlePagination", (sidebar, current) => {
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

  config.addFilter("algoliafy", (text) => {
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

  config.addFilter("jsonify", (text) => {
    return JSON.stringify(text);
  });

  // Parsing and formatting in UTC basically means we retain the date of a non
  // timezoned date.
  config.addFilter("formatDate", (date) =>
    format(utcToZonedTime(date, "UTC"), "MMM dd, yyyy", "UTC")
  );
  config.addFilter("isoDate", (date) => formatISO(date));
  config.addFilter("month", (month) =>
    format(parse(month, "M", new Date()), "MMM")
  );

  config.addFilter("author", (authorTag) => {
    const author = authors[authorTag];
    if (author) {
      return author.name;
    } else {
      return titleCase(authorTag.replaceAll("-", " "));
    }
  });

  const markdown = require("markdown-it")({
    html: true,
    breaks: true,
    linkify: true,
  });

  config.addFilter("markdown", (raw) => {
    if (raw && raw.length) {
      return markdown.renderInline(raw);
    }
    else {
      return raw;
    }
  });

  config.addPlugin(pluginRss);

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
