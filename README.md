Unison Website
==============

Main Unison website

Build process
-------------

1. Convert Docs in a Unison Namespace to HTML files in the build/articles and build/docs
2. Pre-process HTML with proper links and parse article sidebars
3. Copy from build to src/articles and src/docs
3. Render via eleventy to build/site


Deployment process
-------------

* `npm build` will build a local copy of the website using the steps above. 
* `npm start` will both build and start a local version of the website. 
* `npm deploy --prod` will deploy the website to production 
