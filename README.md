Unison Website
==============

Main Unison website

Architecture Where is all the content?
--------------------------------------

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

Build process
-------------

1. Convert Docs in a Unison Namespace to HTML files in the build/articles and build/docs
2. Pre-process HTML with proper links and parse article sidebars
3. Copy from build to src/articles and src/docs
3. Render via eleventy to build/site


Deployment process
-------------

* `npm run build` will build a local copy of the website using the steps above. 
* `npm start` will both build and start a local version of the website. 
* `netlify deploy --prod` will deploy the website to production 

After the deploy to Netlify has succeeded, update the algolia search index by
going to https://unison-lang.org/algolia.json, saving the json file and
uploading to the algolia index.
