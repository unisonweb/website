# Docs to HTML

```ucm
@unison/website/main> load docs/gadts.u
@unison/website/main> update
@unison/website/main> load docs/indexed-abilities.u
@unison/website/main> update
@unison/website/main> alias.term docs._sidebar docs._sidebarWithoutIndexedTypes
@unison/website/main> load docs/sidebar.u
@unison/website/main> update
@unison/website/main> docs.to-html . build
```
