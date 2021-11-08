#!/usr/bin/env node

import { rm, rmdir } from "fs/promises";
import fs from "fs";
import copy from "recursive-copy";
import { JSDOM } from "jsdom";
import through from "through2";
import { reduce, join, has, append, keys, pipe, map, last } from "ramda";

rmdir("./src/docs", { recursive: true, force: true })
  // Remove old artifacts
  .then(() => rmdir("./src/articles", { recursive: true, force: true }))
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
  // -- Articles --------------------------------------------------------------
  // * Copy files from build/articles to src/articles and cleanup html
  // * Create layout data file in src/articles
  // * Create frontmatter for each article:
  //     tags + layout + title (title from a _title.html file)
  .then(() =>
    copy("./build/articles", "./src/articles", {
      transform: transformFile("article"),
    })
  )
  .catch((ex) => console.error(ex));

// -- Helpers -----------------------------------------------------------------

let articles = {};

function transformFile(type) {
  return function (src, _dest, _stats) {
    const srcParts = src.split("/");
    const fileName = last(srcParts);

    let frontmatter = {
      tags: type,
      layout: type + ".njk",
    };

    let articleKey;
    if (type === "article") {
      articleKey = srcParts[2];

      if (!has(articleKey, articles)) {
        let article = {};
        const titleFile = `build/articles/${articleKey}/_title.html`;
        const sidebarFile = `build/articles/${articleKey}/_sidebar.html`;

        try {
          article.title = new JSDOM(
            fs.readFileSync(titleFile, { encoding: "utf-8" })
          ).window.document.querySelector("h1").textContent;

          // Convert _sidebar.html to <artickeKey>.json with a sidebar key
          try {
            const links = new JSDOM(
              fs.readFileSync(sidebarFile, { encoding: "utf-8" })
            ).window.document.querySelectorAll("a");

            article.sidebar = {
              sidebar: map((a) => ({ href: a.href, label: a.textContent }), [
                ...links,
              ]),
            };

            fs.writeFileSync(
              `src/articles/${articleKey}/${articleKey}.json`,
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

      frontmatter.title = article.title;
    }

    return through(function (chunk, _enc, done) {
      const content = chunk.toString();

      let dom = new JSDOM(content);
      dom = convertRefsToUnisonShareLinks(dom);
      dom = fixInternalLinks("/" + type + "s", dom);

      // don't add front matter to partials
      if (!fileName.startsWith("_")) {
        done(null, frontMatterToString(frontmatter) + dom.serialize());
      } else {
        done(null, dom.serialize());
      }
    });
  };
}

function frontMatterToString(frontmatter) {
  return pipe(
    keys,
    reduce((acc, k) => append(`${k}: ${frontmatter[k]}`, acc), []),
    join("\n"),
    (f) => `---\n${f}\n---\n`
  )(frontmatter);
}

function convertRefsToUnisonShareLinks(dom) {
  dom.window.document
    .querySelectorAll(".unison-doc span[data-refs]")
    .forEach((span) => {
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

  return dom;
}

function fixInternalLinks(prefix, dom) {
  dom.window.document.querySelectorAll(".unison-doc a").forEach((anchor) => {
    if (anchor.href.endsWith(".html")) {
      anchor.href = anchor.href.replace(/\.html$/, "");
    }

    if (!anchor.href.startsWith(prefix) && !anchor.href.startsWith("http")) {
      anchor.href = prefix + anchor.href;
    }
  });

  return dom;
}

function trace(key) {
  return (x) => {
    console.log(key, x);
    return x;
  };
}
