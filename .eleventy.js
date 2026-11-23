const R = require("ramda");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItTOC = require("markdown-it-table-of-contents");
const fs = require("fs");
const { parse } = require("date-fns");
const { format, utcToZonedTime } = require("date-fns-tz");
const authors = require("./src/authors.json");
const leftArrow = fs.readFileSync("./src/assets/icon-arrow-left.svg");
const rightArrow = fs.readFileSync("./src/assets/icon-arrow-right.svg");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginWebc = require("@11ty/eleventy-plugin-webc");
const hljs = require("highlight.js");

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

module.exports = async function (config) {
  // Syntax highlighting for markdown code blocks. Uses the same languages and
  // markup as build.mjs does for Unison Docs, so the existing CSS applies.
  const { default: hljsUnison } = await import("./hljs-unison.mjs");
  const { default: hljsUcm } = await import("./hljs-ucm.mjs");
  hljs.registerLanguage("unison", hljsUnison);
  hljs.registerLanguage("ucm", hljsUcm);

  // Exclusively use .eleventyignore, to make sure src/docs are used as source
  config.setUseGitIgnore(false);

  config.addPlugin(pluginWebc, {
    components: "src/_components/**/*.webc",
  });

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

  // Search index entries for a docs page: one entry per page, and one per
  // heading (h2/h3) with a short snippet of the first paragraph after it.
  // The client-side search (see src/js/site.js) searches over /search.json,
  // which is built from these entries.
  config.addFilter("searchEntries", (html, url, title) => {
    const clean = (text) =>
      text
        .replaceAll(/<code>.*?<\/code>/gs, " ")
        .replace(/<.*?>/g, " ")
        .replace(/\\/g, "")
        .replace(/\t/g, " ")
        .replace(/\n/g, " ")
        .replace(/[ ]{2,}/g, " ")
        .replace(/"/g, "")
        .replaceAll("-&gt;", "->")
        .replaceAll("&lt;-", "<-")
        .trim();

    const firstParagraph = (html) => {
      const m = html.match(/<p>(.*?)<\/p>/s);
      return m ? clean(m[1]).substring(0, 200) : "";
    };

    const entries = [
      { title, heading: "", url, snippet: firstParagraph(html) },
    ];

    const headingRe = /<h([23]) id="([^"]+)">(.*?)<\/h\1>/gs;
    let m;
    while ((m = headingRe.exec(html)) !== null) {
      entries.push({
        title,
        heading: clean(m[3]),
        url: url + "#" + m[2],
        snippet: firstParagraph(html.slice(m.index + m[0].length)),
      });
    }
    return entries;
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
    highlight: (code, lang) => {
      lang = (lang || "").trim().split(/\s+/)[0];
      const known = lang && hljs.getLanguage(lang);
      const html = hljs.highlight(code, {
        language: known ? lang : "plaintext",
      }).value;
      if (!known) lang = "";
      return `<pre class="rich source code ${lang}"><code><span class="word">${html}</span></code></pre>`;
    },
  })
    .use(markdownItAnchor, {
      permalink: markdownItAnchor.permalink.headerLink(),
      level: [1, 2, 3, 4],
      slugify: config.getFilter("slug"),
    })
    .use(markdownItTOC, {
      includeLevel: [1, 2, 3],
      containerClass: "toc",
      markerPattern: /^\[\[toc\]\]/im,
    });

  config.setLibrary("md", markdown);

  config.addFilter("markdown", (raw) => {
    if (raw && raw.length) {
      return markdown.renderInline(raw);
    } else {
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
