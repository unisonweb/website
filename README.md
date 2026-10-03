# Unison Website

Main Unison website

## Where is all the content?

The Unison website is primarily constructed via Unison `Doc`, and the content
lives in the associated Unison codebase. Through a build process and the ucm
`docs.to-html` command, this content is transformed to HTML pages, post
processed for better fit for the website and finally built by eleventy (static
site generator). This includes both collections like docs, articles, and posts,
as well as individual pages.

Some collections have "partials" that make up their pages. Articles for
instance has a `_title` Unison `Doc` term that is transformed into the page as
frontmatter for eleventy, where Docs has `_sidebar` term that makes up the
index of the language documentation.

Browse the Unison Docs that power the website here: https://share.unison-lang.org/@unison/website/code/main/latest

The GADT and indexed-ability content lives in `docs/*.u` as Unison `Doc`
definitions. The tutorials belong to Language fundamentals, under Data types
and Abilities, with summaries in the existing language reference pages.
`docs-to-html.md` loads these definitions into the temporary codebase used by
`transcript.fork`, before exporting HTML. `build.mjs` appends the reference
summaries to their existing pages and adds tutorial links to the existing
sidebar groups.
Edit these source files rather than the generated files in `src/docs`.
The examples require a UCM build with GADT support; the prose and code blocks
can be rendered by the website's usual UCM version.

## Filing tickets and contributing to the Docs

Tickets about the website content should be filed [using the Unison Share ticketing feature](https://share.unison-lang.org/@unison/website/tickets).
PR's are gratefully accepted through the regular [Unison code contribution workflow](https://share.unison-lang.org/@unison/website/code/main/latest/terms/docs/contributeDocs).

## Setup for running locally and deployment

Ensure all dependencies are installed by running `npm install` (node v17+
recommended).

Run `ucm --codebase-create .` and then `clone @unison/website` inside `ucm` to
initialize the required Unison `Doc`.

## Running the website locally

Once you've followed the steps from the previous section,
`npm start` will both build and start a local version of the website.

## Build process

1. Convert Docs in a Unison Namespace to HTML files in the build/articles and build/docs
2. Pre-process HTML with proper links and parse article sidebars
3. Copy from build to src/articles and src/docs
4. Render via eleventy to build/site

## Deployment process

Note that this requires being setup in Netlify with the correct access.

- `npm run deploy:prod` will deploy the website to production on https://unison-lang.org.

After the deploy to Netlify has succeeded, update the algolia search index by
going to https://unison-lang.org/algolia.json and saving the json file.

Then go to the "docs" index in Algolia, clear it (removing all records), and
upload the downloaded json file.
