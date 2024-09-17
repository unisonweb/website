module.exports = {
  events: [
    {
      start: "10:00",
      end: "10:05am",
      title: "Opening remarks",
      speaker: "Rúnar Bjarnason",
      speakerPhotoUrl: "/assets/unison-forall-2024/runar.jpg"
    },
    {
      start: "10:05",
      end: "10:45am",
      title: "Full Stack Web Development with Unison, htmx, and Web Components",
      details: `Make modern web applications with Unison using the "WUH?" stack!`,
      speaker: "Tavish Pegram",
      speakerPhotoUrl: "/assets/unison-forall-2024/tavish.jpg"
    },
    {
      start: "10:45",
      end: "11:25am",
      title: "How to Learn a Language (without ever using it)",
      details: `Language parsing is indispensable for software development. It enables various functionalities like syntax checking, code navigation, refactoring, and static analysis. Tree Sitter is a parser generator and incremental parsing library. This talk will cover how parsing a language works and how the Tree Sitter grammar for Unison was written.`,
      speaker: "Kyle Goetz",
      speakerPhotoUrl: "/assets/unison-forall-2024/kyleg.jpg"
    },
    {
      start: "11:25",
      end: "12:05pm",
      title: "Toward a rich and graphical UCM",
      details: `A look to the future where we'll explore the next progression of the Unison Codebase Manager (UCM): a rich, graphical, and keyboard-driven modern UI. How common tasks like type-checking, project and branch navigation, definition management, and yes, editing, could work in a different setting than the terminal.`,
      speaker: "Simon Højberg",
      speakerPhotoUrl: "/assets/unison-forall-2024/hojberg.jpg"
    },
    {
      start: "12:05",
      end: "12:20 PM",
      title: "15 minute break",
    },
    {
      start: "12:20",
      end: "1:00pm",
      title: "UIs in Unison",
      details: `CLIs and cloud services are right in Unison’s wheelhouse, but often you want to put a GUI in front of the end user. What does that look like in the Unison ecosystem?

      This talk will survey approaches to building Unison UIs today, then speculate (wildly!) on what might be possible in the future 🔮`,
      speaker: "Dan Freeman",
      speakerPhotoUrl: "/assets/unison-forall-2024/dfreeman.jpg"
    },
    {
      start: "1:00",
      end: "1:40pm",
      title: "Boost your command-line applications with potions!",
      details: `This talk presents \`potions\`, a library for parsing command-line arguments: its features, how Unison is leveraged for its implementation (abilities anyone?) and some of the paper cuts that hurt during its development.`,
      speaker: "Eric Torreborre",
      speakerPhotoUrl: "/assets/unison-forall-2024/etorreborre.jpg"
    },
    {
      start: "12:05",
      end: "2:10 PM",
      title: "30 minute break",
    },
    {
      start: "2:10",
      end: "2:50pm",
      title: "Busy Beaver Problem",
      details: `Turing machines are a universal computing model that are very capable. But even they have their limitations. Some functions are uncomputable.

One class of functions is called the busy beaver problem; for a Turing machine of a number of states. How many steps can they take before they halt?`,
      speaker: "Daan van Berkel",
      speakerPhotoUrl: "/assets/unison-forall-2024/dvberkel.jpg"
    },
    {
      start: "2:50",
      end: "3:35pm",
      title: "Distributed streaming on Unison Cloud",
      details: `In this talk we’ll look at the implementation of KLogs, a distributed streaming library built entirely on Unison Cloud.

We’ll start our journey in the beautiful landscape of functional programming APIs, and then take an ability handler to the perilous world of distributed systems, a world where we need _fences_, _leases_, _shards_ and _view changes_ to make our system scalable and resilient. We will learn how to implement those standard techniques on Unison Cloud, and then discuss the unique optimisations enabled  by its innovative combination of features.`,
      speaker: "Fabio Labella",
      speakerPhotoUrl: "/assets/unison-forall-2024/fabio.jpg"
    },
    {
      start: "3:35",
      end: "3:50 PM",
      title: "15 minute break",
    },
    {
      start: "3:50",
      end: "4:30pm",
      title: "Backpropagation in Unison: A Friendly Introduction",
      details: `Backpropagation is the backbone of training neural networks, but how does it actually work? In this session, we’ll break down the essentials of backpropagation in a relaxed, approachable way, explaining the core concepts and the intuition behind the math. We’ll conclude with a dive into how to implement backpropagation in Unison.`,
      speaker: "Gerard Finol",
      speakerPhotoUrl: "/assets/unison-forall-2024/gerardf.jpg"
    },
    {
      start: "4:30",
      end: "5:10pm",
      title: "Fun with Actors in Unison",
      details: `Implementing akka/erlang-style actors/processes in unison. Unison’s “abilities” provide for a very natural and ergonomic experience for using actors. We’ll go through the implementation, live-code some demos, and explore some runtime visualizations.`,
      speaker: "Alvaro Carrasco",
      speakerPhotoUrl: "/assets/unison-forall-2024/alvaro.jpg"
    },
    {
      start: "5:10",
      end: "5:20pm",
      title: "Closing remarks",
      speaker: "Paul Chiusano",
      speakerPhotoUrl: "/assets/unison-forall-2024/pchiusano.jpg"
    },
  ]
};
