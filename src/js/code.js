import hljsUnison from "/js/hljs-unison.js";
import hljsUcm from "/js/hljs-ucm.js";
import hljsScala from "/js/hljs-scala.js";

hljs.registerLanguage("unison", hljsUnison);
hljs.registerLanguage("unison-raw", hljsUnison);
hljs.registerLanguage("ucm", hljsUcm);
hljs.registerLanguage("scala", hljsScala);

hljs.highlightAll();
