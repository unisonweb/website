#!/usr/bin/env node

import fs from "fs/promises";
import copy from "recursive-copy";
import { JSDOM } from "jsdom";

// Pre-build steps
// 0. Remove any previous artifacts
// 1. Copy build/docs/_sidebar.html to src/_includes/_doc-sidebar-content.njk
// 2. Copy files from build/docs to src/docs and cleanup html
// 3. Create layout data file in src/docs
// 4. Copy files from build/articles to src/articles and cleanup html
// 5. Create layout data file in src/articles
fs.rmdir("./src/docs", { recursive: true, force: true })
  // Remove old artifacts
  .then(() => fs.rmdir("./src/articles", { recursive: true, force: true }))
  .then(() => fs.rm("./src/_includes/_doc-sidebar-content.njk"))
  // -- Docs --
  .then(() =>
    copy(
      "./build/docs/_sidebar.html",
      "./src/_includes/_doc-sidebar-content.njk"
    )
  )
  .then(() =>
    copy("./build/docs", "./src/docs", {
      transform: cleanHtml("/docs"),
    })
  )
  .then(() => addLayout("doc"))
  // -- Articles --
  .then(() =>
    copy("./build/articles", "./src/articles", {
      transform: cleanHtml("/articles"),
    })
  )
  .then(() => addLayout("article"))
  .catch((ex) => console.error(ex));

// -- Helpers -----------------------------------------------------------------

function addLayout(name) {
  return fs.writeFile(
    `./src/${name}s/${name}s.json`,
    `{ "layout": "${name}.njk" }`
  );
}

function cleanHtml(linkPrefix) {
  return function (fileContents) {
    console.log("cleaning html");
    let dom = new JSDOM(fileContents);
    dom = convertRefsToUnisonShareLinks(dom);
    dom = fixInternalLinks(linkPrefix, dom);
    return dom.toString();
  };
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
