#!/usr/bin/env node

import { rmdir } from "fs/promises";
import fs from "fs";
import path from "path";
import copy from "recursive-copy";
import { JSDOM } from "jsdom";
import kebabCase from "kebab-case";
import yaml from "yaml";
import { reduce, join, has, append, keys, pipe, map } from "ramda";

rmdir("./src/docs", { recursive: true, force: true })
  // Remove old artifacts
  .then(() => rmdir("./src/articles", { recursive: true, force: true }))
  /*
  .then(() => rm("./src/_includes/_doc-sidebar-content.njk"))
  // -- Docs ------------------------------------------------------------------
  // * Copy build/docs/_sidebar.html to src/_includes/_doc-sidebar-content.njk
  // * Copy files from build/docs to src/docs and cleanup html
  // * Create frontmatter for each doc: tags + layout
  .then(() =>
    copy(
      "./build/docs/_sidebar.html",
      "./src/_includes/_doc-sidebar-content.njk"
    )
  )
  .then(() =>
    copy("./build/docs", "./src/docs", { transform: transformFile("doc") })
  )
  */
  // -- Articles --------------------------------------------------------------
  // * Copy files from build/articles to src/articles and cleanup html
  // * Create layout data file in src/articles
  // * Create frontmatter for each article:
  //     tags + layout + title (title from a _title.html file)
  .then(() =>
    copy("./build/articles", "./src/articles", {
      rename: kebabCase,
    }).on(copy.events.COPY_FILE_COMPLETE, ({ src, dest }) => {
      const fileName = path.basename(dest);
      if (!fileName.startsWith("_")) {
        transformFile("article", src, dest);
      }
    })
  )
  .catch((ex) => console.error(ex));

// -- Helpers -----------------------------------------------------------------

let articles = {};

const iconCaretRight = fs.readFileSync("./src/img/icon-caret-right.svg", {
  encoding: "utf-8",
});

function transformFile(type, src, dest) {
  const srcParts = src.split("/");

  let frontmatter = {
    tags: type,
    layout: type + ".njk",
  };

  let prefix = "/docs";

  let articleKey;
  if (type === "article") {
    articleKey = srcParts[2];

    prefix = `/articles/${articleKey}`;

    if (!has(articleKey, articles)) {
      let article = {};
      const titleFile = `build/articles/${articleKey}/_title.html`;
      const summaryFile = `build/articles/${articleKey}/_summary.html`;
      const authorsFile = `build/articles/${articleKey}/_authors.html`;
      const sidebarFile = `build/articles/${articleKey}/_sidebar.html`;

      try {
        const titleFileContent = fs.readFileSync(titleFile, {
          encoding: "utf-8",
        });

        article.overallTitle = new JSDOM(
          titleFileContent
        ).window.document.querySelector("article").textContent;

        try {
          const summaryFileContent = fs.readFileSync(summaryFile, {
            encoding: "utf-8",
          });

          article.summary = new JSDOM(
            summaryFileContent
          ).window.document.querySelector("article").textContent;
        } catch (_ex) {
          // Not all articles have summaries
        }

        try {
          const authors = new JSDOM(
            fs.readFileSync(authorsFile, { encoding: "utf-8" })
          ).window.document.querySelectorAll("li");

          article.authors = [...authors].map((a) => ({ name: a.textContent }));
        } catch (_ex) {
          // Not all articles have authors
          article.authors = [];
        }

        // Convert _sidebar.html to <artickeKey>.json with a sidebar key
        try {
          const links = new JSDOM(
            fs.readFileSync(sidebarFile, { encoding: "utf-8" })
          ).window.document.querySelectorAll("a");

          article.sidebar = {
            sidebar: map(
              (a) => ({
                href: kebabCase(fixInternalLinks_(prefix, a.href)),
                label: a.textContent,
              }),
              [...links]
            ),
          };

          fs.writeFileSync(
            `src/articles/${kebabCase(articleKey)}/${kebabCase(
              articleKey
            )}.json`,
            JSON.stringify(article.sidebar)
          );
        } catch (_ex) {
          // Not all articles have sidebars
        }

        articles[articleKey] = article;
      } catch (ex) {
        console.error(`Error getting title for article ${articleKey}`, ex);
      }
    }

    const article = articles[articleKey];

    frontmatter.overallTitle = article.overallTitle;
    frontmatter.summary = article.summary;
    frontmatter.authors = article.authors;
  }

  const content = updateContent(
    frontmatter,
    prefix,
    fs.readFileSync(dest, { encoding: "utf-8" })
  );
  fs.writeFileSync(dest, content);
}

function updateContent(frontmatter, prefix, content) {
  let dom = new JSDOM(content);
  dom = convertRefsToUnisonShareLinks(dom);
  dom = fixFolded(dom);
  dom = fixInternalLinks(prefix, dom);

  let title = "";
  const h1 = dom.window.document.querySelector("h1");

  if (h1) {
    title = h1.textContent;
    h1.remove();
  }

  const pageFrontmatter = { ...frontmatter, title };

  const page = dom.window.document.querySelector("body").innerHTML;

  return frontMatterToString(pageFrontmatter) + page;
}

function frontMatterToString(frontmatter) {
  return `---
${yaml.stringify(frontmatter)}---`;
}

function convertRefsToUnisonShareLinks(dom) {
  dom.window.document
    .querySelectorAll(".unison-doc span[data-ref]")
    .forEach((span) => {
      // Don't link refs if they are within an <a> element
      if (!span.closest("a")) {
        const ref = span.dataset.ref.replace(/#/g, "@");
        const refType = span.dataset.refType;

        if (ref && refType) {
          let link = dom.window.document.createElement("a");

          link.href = `https://share.unison-lang.org/latest/namespaces/unison/website/;/${refType}s/${ref}`;
          link.target = "_blank";
          link.innerHTML = span.innerHTML;
          link.classList = span.classList;

          span.replaceWith(link);
        }
      }
    });

  return dom;
}

function fixFolded(dom) {
  let document = dom.window.document;

  function go() {
    document.querySelectorAll("details.folded").forEach((oldDetails) => {
      const folded = document.createElement("div");
      folded.classList = oldDetails.classList;

      if (!oldDetails.open) {
        folded.classList.add("is-folded");
      }

      const summary = document.createElement("div");
      summary.classList.add("folded-summary");
      summary.innerHTML = oldDetails.querySelector(".folded-summary").innerHTML;

      const details = document.createElement("div");
      details.classList.add("folded-details");

      details.innerHTML = oldDetails.querySelector(".folded-details").innerHTML;

      const foldedContent = document.createElement("div");
      foldedContent.classList.add("folded-content");
      foldedContent.appendChild(summary);
      foldedContent.appendChild(details);

      let foldToggle = document.createElement("div");
      foldToggle.classList = ["fold-toggle"];
      foldToggle.innerHTML = `<div class="icon icon-caret-right">${iconCaretRight}</div>`;

      folded.appendChild(foldToggle);
      folded.appendChild(foldedContent);

      oldDetails.replaceWith(folded);
    });

    // Keep replacing details until there are no more left.
    if (document.querySelectorAll("details.folded").length) {
      go();
    }
  }

  go();

  return dom;
}

function fixInternalLinks_(prefix, href) {
  let href_ = href;

  // JSDOM randonly adds about:blank to fragment links...
  if (href_.startsWith("about:blank#")) {
    return href_.replace("about:blank", "");
  }

  if (href_.endsWith(".html")) {
    href_ = href_.replace(/\.html$/, "");
  }

  if (href_.endsWith("/index")) {
    href_ = href_.replace("/index", "");
  }

  if (!href_.startsWith(prefix) && !href_.startsWith("http")) {
    href_ = prefix + href_;
  }

  return href_;
}

function fixInternalLinks(prefix, dom) {
  dom.window.document.querySelectorAll(".unison-doc a").forEach((anchor) => {
    anchor.href = kebabCase(fixInternalLinks_(prefix, anchor.href));
  });

  return dom;
}

function trace(key) {
  return (x) => {
    console.log(key, x);
    return x;
  };
}
