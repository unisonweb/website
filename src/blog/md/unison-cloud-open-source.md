---
tags: blog
layout: blog-post-md.njk
permalink: blog/unison-cloud-open-source/
title: Unison Cloud is now open source
summary: Unison Cloud is open source, MIT licensed. 
date: 2026-10-08
featuredImage: /assets/unison-services-preview.svg
authors:
  - paul-chiusano
categories:
  - announcements
  - cloud
# Draft: unlisted from the blog index and feeds, but reachable at the permalink.
# Delete the next line (or set it to false) when the post is ready to publish.
eleventyExcludeFromCollections: true
---


[Unison Cloud](https://unison.cloud) is now open source, MIT licensed. There are four projects:

<details class="callout"><summary>What is Unison Cloud?</summary>

[Unison Cloud](https://unison.cloud) turns any pool of nodes into a distributed computer, programmable with the Unison language. [See a series of demos](https://www.youtube.com/watch?v=0q6jY58xsKA). Some features:

* Service deploys in seconds. Services are lightweight, < 200kb. No more building and shipping around multi-GB containers.
* Fast, typed, inter-service communication using [adaptive service graph compression](https://www.youtube.com/watch?v=347IbLJ6cfM).
* Distributed batch jobs, using a high-level fork/join style distributed computing model.
* Transactional storage (backed by DynamoDB) and object storage (backed by S3).
* Secrets management, long-running background jobs, and more.

</details>


* The [Unison Cloud client](https://share.unison-lang.org/@unison/cloud) defines the programming model for a Unison Cloud cluster. It includes both a local interpreter (for testing and local development) and the real interpeter that talks to a distributed Unison cluster. This has been open source for a long time.
* [Nimbus](https://share.unison-lang.org/@unison/nimbus) is the worker node for a Unison Cloud cluster. It is written in Unison. The system supports any number of workers, and can be scaled dynamically up or down. This is newly open sourced.
* The [Unison Cloud API Server](https://github.com/unisonweb/cloud-api) is a Haskell service that the Unison Cloud client talks to when interacting with a remote Unison Cloud cluster. It also acts as a control plane for tracking cluster membership, handling authentication, and so on. This is newly open sourced.
* The [Unison Cloud UI](https://github.com/unisonweb/unison-cloud-ui) is the code behind `app.unison.cloud` (for viewing deployed services, logs, and so on). This is newly open sourced.

We think this tech will be more useful to the world as an open source technology and hope that people build great things with it.

If you're interested in professional support for a Unison Cloud cluster, get in touch at [hello@unison.cloud](mailto:hello@unison.cloud).