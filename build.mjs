// 1. Copy build/docs/_sidebar.html to src/_includes/_doc-sidebar-content.njk
// 2. Copy files from build/docs to src/docs
// 3. Create layout data file in src/docs

import fs from "fs";
import ncp from "ncp";

ncp(
  "./build/docs/_sidebar.html",
  "./src/_includes/_doc-sidebar-content.njk",
  (err) => {
    if (err) return console.error(err);

    ncp("./build/docs", "./src/docs", (err) => {
      if (err) return console.error(err);

      fs.writeFile("./src/docs/docs.json", '{ layout: "doc.njk" }', () => {
        if (err) return console.error(err);

        console.log("Pre-build done");
      });
    });
  }
);
