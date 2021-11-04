// Pre-build steps
// 1. Copy build/docs/_sidebar.html to src/_includes/_doc-sidebar-content.njk
// 2. Copy files from build/docs to src/docs
// 3. Create layout data file in src/docs
// 4. Copy files from build/articles to src/articles
// 5. Create layout data file in src/articles

import fs from "fs/promises";
import copy from "recursive-copy";

function addLayout(name) {
  return fs.writeFile(
    `./src/${name}s/${name}s.json`,
    `{ "layout": "${name}.njk" }`
  );
}

fs.rmdir("./src/docs", { recursive: true, force: true })
  .then(() => fs.rmdir("./src/articles", { recursive: true, force: true }))
  .then(() => fs.rm("./src/_includes/_doc-sidebar-content.njk"))
  .then(() =>
    copy(
      "./build/docs/_sidebar.html",
      "./src/_includes/_doc-sidebar-content.njk"
    )
  )
  .then(() => copy("./build/docs", "./src/docs"))
  .then(() => addLayout("doc"))
  .then(() => copy("./build/articles", "./src/articles"))
  .then(() => addLayout("article"))
  .catch((ex) => console.error(ex));
