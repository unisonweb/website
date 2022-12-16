#!/usr/bin/env node

import { mkdir, rm } from "fs/promises";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import copy from "recursive-copy";
import { isFuture } from "date-fns";
import { JSDOM } from "jsdom";
import kebabCase from "kebab-case";
import yaml from "yaml";
import { has, map } from "ramda";
import matter from "gray-matter";

const UCM_EXEC = "unison";

const UNISON_SHARE_BASE_URL = "https://share.unison-lang.org";

// Run the build process!
build();
// ----------------------

function build() {
  console.log("");
  console.log("BUILDING HTML FROM CODEBASE");
  console.log("===========================");
  console.log(" * Removing old artifacts");

  rm("./build", { recursive: true, force: true })
    .then(() => rm("./src/learn", { recursive: true, force: true }))
    .then(() => rm("./src/articles", { recursive: true, force: true }))
    .then(() => rm("./src/whats-new/posts", { recursive: true, force: true }))
    .then(() => rm("./src/community", { recursive: true, force: true }))
    .then(() => rm("./src/jobs", { recursive: true, force: true }))
    .then(() => rm("./src/talks", { recursive: true, force: true }))
    .then(() => rm("./src/unison-computing", { recursive: true, force: true }))
    .then(() => rm("./src/home/examples", { recursive: true, force: true }))
    .then(() => rm("./src/home/_examples.html", { force: true }))
    .then(() => rm("./src/_includes/_home-examples.njk", { force: true }))
    .then(() =>
      rm("./src/_includes/_learn-sidebar-content.njk", { force: true })
    )
    .then(() => console.log(" * Running transcript"))
    .then(() => mkdir("./build"))
    .then(() =>
      run(
        ` TMPDIR=build ${UCM_EXEC} transcript.fork docs-to-html.md --codebase .`
      )
    )
    // -- Pages ----------------------------------------------------------
    .then(() => console.log(" * Building /pages"))
    .then(() =>
      copy(
        "./build/pages/home/_examples.html",
        "./src/_includes/_home-examples.njk"
      ).on(copy.events.COPY_FILE_COMPLETE, ({ src, dest }) => {
        transformHomeExamples(src, dest, false);
      })
    )
    .then(() =>
      copy("./build/pages", "./src", {
        rename: kebabCase,
      }).on(copy.events.COPY_FILE_COMPLETE, ({ src, dest }) => {
        const fileName = path.basename(dest);
        if (
          !fileName.startsWith("_") &&
          !dest.startsWith("src/home/examples/lib")
        ) {
          transformPageFile(src, dest);
        }
      })
    )
    // -- Learn ----------------------------------------------------------------
    .then(() => console.log(" * Building /learn"))
    .then(() => mkdir("./src/learn"))
    .then(() =>
      copy(
        "./build/learn/_sidebar.html",
        "./src/_includes/_learn-sidebar-content.njk"
      ).on(copy.events.COPY_FILE_COMPLETE, ({ src, dest }) => {
        transformLearnSidebar(src, dest, false);
      })
    )
    .then(() =>
      copy("./build/learn", "./src/learn", {
        rename: kebabCase,
      }).on(copy.events.COPY_FILE_COMPLETE, ({ src, dest }) => {
        if (!isFragment(dest) && !isGlossary(dest)) {
          transformLearnFile(src, dest);
        }
      })
    )
    // -- Articles ------------------------------------------------------------
    .then(() => console.log(" * Building /articles"))
    .then(() => mkdir("./src/articles"))
    .then(() =>
      copy("./build/articles", "./src/articles", {
        rename: kebabCase,
      }).on(copy.events.COPY_FILE_COMPLETE, ({ src, dest }) => {
        const fileName = path.basename(dest);
        if (!fileName.startsWith("_")) {
          transformArticleFile(src, dest);
        }
      })
    )
    // -- Whats New? ----------------------------------------------------------------
    .then(() => console.log(" * Building /whats-new/posts"))
    .then(() => mkdir("./src/whats-new/posts"))
    .then(() =>
      copy("./build/whats-new", "./src/whats-new/posts", {
        rename: kebabCase,
      }).on(copy.events.COPY_FILE_COMPLETE, ({ src, dest }) => {
        const fileName = path.basename(dest);
        if (!fileName.startsWith("_")) {
          transformWhatsNewFile(src, dest);
        }
      })
    )
    .catch((ex) => console.error(ex));
}

// -- Helpers -----------------------------------------------------------------

let articles = {};

const iconArrowRight = fs.readFileSync("./src/assets/icon-arrow-right.svg", {
  encoding: "utf-8",
});

const iconCaretRight = fs.readFileSync("./src/assets/icon-caret-right.svg", {
  encoding: "utf-8",
});

// -- Pages

function transformHomeExamples(_src, dest) {
  let content = updateContent(
    null,
    "/",
    fs.readFileSync(dest, { encoding: "utf-8" })
  );

  let dom = new JSDOM(content);
  const document = dom.window.document;

  [...document.querySelectorAll("p")].forEach((p) => {
    if (p.innerHTML.trim() === "") {
      p.remove();
    }
  });

  [...document.querySelectorAll(".fqn")].forEach((fqn) => {
    const seg = fqn.querySelector(".segment");

    // Slim down `examples.http` to `http`
    if (seg.textContent.trim() === "examples") {
      seg.nextSibling.remove();
      seg.remove();
    }

    // Slim down `Nat.mod` to `mod`
    if (seg.textContent.trim() === "Nat") {
      seg.nextSibling.remove();
      seg.remove();
    }
  });

  // Remove lines with `use` statements
  [...document.querySelectorAll(".use-keyword")].forEach((u) => u.remove());
  [...document.querySelectorAll(".use-prefix")].forEach((use) => {
    const prev = use.previousSibling;
    if (prev?.className.trim() === "blank") prev.remove();

    const next = use.nextSibling;
    if (next?.className.trim() === "blank") next.remove();

    use.remove();
  });
  [...document.querySelectorAll(".use-suffix")].forEach((use) => {
    const next = use.nextSibling;

    if (next?.className.trim() === "blank") next.remove();

    use.remove();
  });

  [...document.querySelectorAll(".term-reference")].forEach((term) => {
    if (term.textContent === "Path.root") {
      const blank1 = term.previousSibling;
      const blank2 = blank1.previousSibling;
      const blank3 = blank2.previousSibling;
      const blank4 = blank3.previousSibling;

      if (blank1?.className.trim() === "blank") blank1.innerHTML = " ";
      if (blank2?.className.trim() === "blank") blank2.remove();
      if (blank3?.className.trim() === "blank") blank3.remove();
      if (blank4?.className.trim() === "blank") blank4.remove();
    }
  });

  const httpRequest = document.querySelector(".http-request > section");

  const newSection = document.createElement("section");

  const description = document.createElement("div");
  description.classList.add("description");
  description.append(httpRequest.querySelector("h1"));
  [...httpRequest.querySelectorAll("p")].forEach((p) => description.append(p));

  newSection.append(description);
  newSection.append(httpRequest.querySelector(".folded-sources"));

  httpRequest.replaceWith(newSection);

  content = document.querySelector("body").innerHTML;

  fs.writeFileSync(dest, content);
}

function transformPageFile(_src, dest) {
  const frontmatter = {
    tags: "page",
    layout: "page.njk",
  };

  const content = updateContent(
    frontmatter,
    "/",
    fs.readFileSync(dest, { encoding: "utf-8" })
  );

  fs.writeFileSync(dest, content);
}

// -- Learn

function transformLearnSidebar(_src, dest) {
  let content = updateContent(
    null,
    "/learn",
    fs.readFileSync(dest, { encoding: "utf-8" })
  );

  let dom = new JSDOM(content);

  const section = dom.window.document.querySelector("section > section");
  section?.classList.add("welcome");

  [...dom.window.document.querySelectorAll("h1")].forEach((h1) => {
    let arrow = dom.window.document.createElement("div");
    arrow.classList.add("icon");
    arrow.classList.add("icon-arrow-right");
    arrow.innerHTML = iconArrowRight;
    h1.appendChild(arrow);
  });

  content = dom.window.document.querySelector("body").innerHTML;

  fs.writeFileSync(dest, content);
}

function transformLearnFile(_src, dest, includeFrontMatter = true) {
  let frontmatter = null;

  if (includeFrontMatter) {
    frontmatter = {
      tags: "learn",
      overallTitle: "Learn Unison",
      layout: "learn.njk",
    };
  }

  const content = updateContent(
    frontmatter,
    "/learn",
    fs.readFileSync(dest, { encoding: "utf-8" })
  );

  fs.writeFileSync(dest, content);
}

// -- Articles

function transformArticleFile(src, dest) {
  const srcParts = src.split("/");

  let frontmatter = {
    tags: "article",
    layout: "article.njk",
  };

  let articleKey;
  articleKey = srcParts[2];

  const prefix = `/articles/${articleKey}`;

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
              href: a.href.startsWith("http")
                ? a.href
                : kebabCase(fixInternalLinks_(prefix, a.href)),
              label: a.textContent,
            }),
            [...links]
          ),
        };

        fs.writeFileSync(
          `src/articles/${kebabCase(articleKey)}/${kebabCase(articleKey)}.json`,
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

  frontmatter.articleIndex = `/articles/${kebabCase(articleKey)}`;
  frontmatter.overallTitle = article.overallTitle;
  frontmatter.summary = article.summary;
  frontmatter.authors = article.authors;

  const content = updateContent(
    frontmatter,
    prefix,
    fs.readFileSync(dest, { encoding: "utf-8" })
  );
  fs.writeFileSync(dest, content);
}

// -- Whats New

function transformWhatsNewFile(_src, dest) {
  const frontmatter = {
    tags: "whats-new",
    layout: "whats-new-post.njk",
    permalink: dest.replace("src/", "").replace("/posts", ""),
  };

  const content = updateContent(
    frontmatter,
    "/",
    fs.readFileSync(dest, { encoding: "utf-8" })
  );

  fs.writeFileSync(dest, content);
}

// -- Helpers

function updateContent(frontmatter, prefix, rawContent) {
  let content = matter(rawContent);

  if (content.data.authors) {
    if (!Array.isArray(content.data.authors)) {
      content.data.authors = [content.data.authors];
    }
  }

  if (content.data.categories) {
    if (!Array.isArray(content.data.categories)) {
      content.data.categories = [content.data.categories];
    }
  }

  let dom = new JSDOM(content.content);
  dom = fixFolded(dom);
  dom = fixInternalLinks(prefix, dom);
  dom = convertRefsToUnisonShareLinks(dom);

  let title = "";
  const h1 = dom.window.document.querySelector("h1");

  if (frontmatter && h1) {
    title = h1.textContent;
    h1.remove();
  }

  [...dom.window.document.querySelectorAll("video")].forEach((video) => {
    const source = video.querySelector("source");
    if (source?.getAttribute("type") === "youtube") {
      const iframe = dom.window.document.createElement("iframe");
      iframe.src = source.getAttribute("src");
      iframe.setAttribute("width", "580");
      iframe.setAttribute("height", "436");
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute(
        "allow",
        "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      );
      iframe.setAttribute("allowfullscreen", "true");

      video.replaceWith(iframe);
    } else {
      video.setAttribute("controls", "true");
    }
  });

  const page = dom.window.document.querySelector("body").innerHTML;

  if (frontmatter) {
    let pageFrontmatter = title
      ? { ...frontmatter, ...content.data, title }
      : { ...frontmatter, ...content.data, tags: `_${frontmatter.tags}` };

    pageFrontmatter = {
      ...pageFrontmatter,
      status: pageFrontmatter.status || "published",
    };

    if (pageFrontmatter.date) {
      pageFrontmatter = {
        ...pageFrontmatter,
        eleventyExcludeFromCollections:
          isFuture(pageFrontmatter.date) ||
          pageFrontmatter.status !== "published",
      };
    }

    return `${frontMatterToString(pageFrontmatter)}
{% raw %}
${page}
{% endraw %}
`;
  } else {
    return page;
  }
}

function frontMatterToString(frontmatter) {
  return `---
${yaml.stringify(frontmatter)}---\n`;
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

          link.href = `${UNISON_SHARE_BASE_URL}/@unison/code/latest/namespaces/public/;/${refType}s/${ref}`;
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

  if (href_.startsWith(UNISON_SHARE_BASE_URL)) return href_;

  if (href_.startsWith("mailto:")) return href_;

  // JSDOM randonly adds about:blank to fragment links...
  if (href_.startsWith("about:blank#")) {
    return href_.replace("about:blank", "");
  }

  if (href_.endsWith(".html")) {
    href_ = href_.replace(/\.html$/, "");
  }

  if (href_.startsWith("../")) {
    href_ = href_.replace(/\.\.\//, "../../");
  }

  if (href_.startsWith("./")) {
    href_ = href_.replace(/\.\//, "../");
  }

  if (href_.endsWith("/index")) {
    href_ = href_.replace("/index", "");
  }

  if (
    !href_.startsWith(prefix) &&
    !href_.startsWith("http") &&
    !href_.startsWith("../") &&
    !href_.startsWith("./")
  ) {
    href_ = prefix + href_;
  }

  return href_;
}

function fixInternalLinks(prefix, dom) {
  dom.window.document.querySelectorAll(".unison-doc a").forEach((anchor) => {
    if (!anchor.href.startsWith("http")) {
      anchor.href = kebabCase(fixInternalLinks_(prefix, anchor.href));
      anchor.target = "_self";
    }
  });

  return dom;
}

function isFragment(p) {
  return path.basename(p).startsWith("_");
}

function isGlossary(p) {
  return p.includes("glossary");
}

function trace(key) {
  return (x) => {
    console.log(key, x);
    return x;
  };
}

function run(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { maxBuffer: 1024 * 500 }, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
      } else if (stdout) {
        console.log(stdout);
      } else {
        console.log(stderr);
      }
      resolve(stdout ? true : false);
    });
  });
}
