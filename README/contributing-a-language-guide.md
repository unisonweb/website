# 📚 Contributing a "Unison for XYZ language" Guide

# Welcome!

We’d love your help in growing a library of **comparison guides** between Unison and other programming languages. These documents are designed to help experienced developers in other programming languages quickly get oriented in Unison by showing side-by-side examples.

These documents are not exhaustive language manuals — they focus on the **core syntax, types, idioms, and issues** a new Unison user is most likely to run into, given the conventions of the compared language.

They should focus primarily on the **syntax** of writing Unison, not the intricacies of Unison Share, the Unison `edit/update` workflow, etc.

## What languages are we hoping to see?

We're looking for guides for languages that represent a range of paradigms and ecosystems, such as:

* Python
* JavaScript
* Java
* Typescript
* C++

If it has a large community, a well-known syntax, and is not Unison, we want to see it!
We're hoping to start with languages that are different enough from Unison that folks have some hurdles to clear.

If you have any questions, feel free to reach out to us on the [Unison Discord](https://www.unison-lang.org/discord).

## Style and Structure Guidelines

### Organizing a guide:

- Where possible, use the **non-Unison language’s term** in section and subsection headings, for example:
    - `### Case Classes` (Scala’s analogous concept) - not `### Record Types`
    - This makes the doc easy to navigate for learners searching for familiar terminology.
- Feel free to riff on this basic structure:

```
* Variables
	* Basic types
* Functions
	* Function application
* Namespaces and imports
* Comments and Docs
* Type definitions
* Pattern matching or conditionals
* Running programs
	* `main` functions
	* the REPL/watch expressions
```

### Style Conventions

- Brevity is the soul of wit.
- Bold-face terms are used for the name of a **core concept** in each section, when the concept could be considered analogous across languages.
    - For example: **call-by-name** parameters (Scala) and **delayed computations** (Unison)
- Italicized terms are used simply for *emphasis*.

### Side-by-Side Layout

- Present examples in a **two-column** format:
    - **Left column:** Unison
    - **Right column:** Language XYZ
- Align equivalent code examples line-by-line as much as possible

## HTML template conventions

Your language guides should be located/named like this:

`src/compare-lang/unison-for-<language>-devs.md`

The file should start with this block:

```
---
layout: "compare-lang"
title: "Unison for Scala devs"
description: "Comparing structures and patterns between Unison and Scala"
---
```

Side-by-side examples can be made like this:

```
<div class="side-by-side">
	<div>
		Unison example here
	</div>
	<div>
		Other language example here
	</div
</div>
```

Documenting fenced codeblocks:

`````
<div class="side-by-side"><div>

{% raw %}

````unison
{{I am a doc which involves a fenced codeblock:

```
1 + 2
```

}}
````
{% endraw %}
</div>
`````

## Running the project locally

- Clone the website `git` repo: https://github.com/unisonweb/website Then inside the website repo,  follow the install instructions here: [https://github.com/unisonweb/website?tab=readme-ov-file#setup-for-running-locally-and-deployment](https://github.com/unisonweb/website?tab=readme-ov-file#setup-for-running-locally-and-deployment)
    - The Unison Share `clone` step may take a while. The `website` project is one of our oldest projects!
- Run `npm start` in your terminal.
- Your service will run at [`http://localhost:2345`](http://localhost:2345)
- The language guide page name will look like:[`http://localhost:2345/compare-lang/unison-for-scala-devs/`](http://localhost:2345/compare-lang/unison-for-scala-devs/)