/*
Language: UCM
Author: Simon Højberg
Description: UCM CLI syntax for the Unison programming language
Website: https://unison-lang.org
Category: functional
*/

export default function (hljs) {
  const COMMENT = {
    variants: [hljs.COMMENT("--", "$"), hljs.COMMENT("^\\s---", "(?!)")],
  };

  const KEYWORDS = [
    "ability",
    "cases",
    "do",
    "else",
    "forall",
    "handle",
    "if",
    "let",
    "match",
    "structural",
    "then",
    "type",
    "unique",
    "where",
    "with",
  ];

  const KEYWORDSR = KEYWORDS.join("|");

  const LOWERNAME = `\\b(?!(${KEYWORDSR})\\b)[a-z_][0-9A-Za-z_'!]*`;

  const UPPERNAME = `\\b(?!(${KEYWORDSR})\\b)[A-Z_][0-9A-Za-z_'!]*`;

  const ANYNAME = `\\b(?!(${KEYWORDSR})\\b)[A-Za-z_][0-9A-Za-z_'!]*`;

  const CONSTRUCTOR = {
    scope: "title.function",
    begin: `(${ANYNAME}\\.)*${UPPERNAME}`,
    relevance: 0,
  };

  const CONSTRUCTORCALL = {
    scope: "title.function.invoke",
    begin: `(${ANYNAME}\\.)*${UPPERNAME}`,
    relevance: 0,
    keywords: KEYWORDS,
  };

  const FUNCTIONCALL = {
    scope: "title.function.invoke",
    begin: `(${ANYNAME}\\.)*${LOWERNAME}`,
    relevance: 0,
    keywords: KEYWORDS,
  };

  const TYPENAME = {
    scope: "title.class",
    begin: CONSTRUCTOR.begin,
    relevance: 0,
  };

  const LIST = {
    scope: "list",
    begin: "\\(",
    end: "\\)",
    illegal: '"',
    keywords: KEYWORDS,
    contains: [
      TYPENAME,
      hljs.inherit(hljs.TITLE_MODE, { begin: "[_a-z][\\w']*" }),
      COMMENT,
    ],
  };

  const VAR = {
    scope: "variable",
    begin: LOWERNAME,
    relevance: 0,
  };

  const PARAM = {
    scope: "params",
    begin: LOWERNAME,
    relevance: 0,
  };

  const TERMNAME = {
    scope: "title",
    begin: `(${ANYNAME}\\.)*${LOWERNAME}`,
    relevance: 0,
  };

  const RECORD = {
    scope: "record",
    begin: /\{/,
    end: /\}/,
    contains: LIST.contains,
    endsParent: true,
  };

  const decimalDigits = "([0-9]_*)+";
  const hexDigits = "([0-9a-fA-F]_*)+";
  const octalDigits = "([0-7]_*)+";

  const OPERATOR = {
    scope: "operator",
    begin: "((=[-!#$%&\\*\\+/<=>\\?@\\^|~]+)|[-!#$%&\\*\\+/<>\\?@\\^|~]+)",
    relevance: 0,
  };

  const USE = {
    scope: "import",
    beginKeywords: "use",
    contains: [TYPENAME, TERMNAME, CONSTRUCTOR, OPERATOR],
    end: "$",
    relevance: 10,
  };

  const ARROW = {
    scope: "punctuation",
    begin: "->",
    relevance: 0,
  };

  const COLON = {
    scope: "punctuation",
    begin: ":",
    relevance: 0,
  };

  const EFFECTLIST = {
    scope: "effectList",
    begin: "\\{",
    beginScope: "punctuation",
    end: "\\}",
    endScope: "punctuation",
    contains: [
      TYPENAME,
      VAR,
      ARROW,
      {
        scope: "punctuation",
        begin: "'|,|\\(|\\)|\\[\\]",
      },
    ],
  };

  const TYPESIG = {
    scope: "sig",
    begin: [TERMNAME.begin, "\\s*:\\s*"],
    beginScope: {
      1: TERMNAME.scope,
      2: COLON.scope,
    },
    end: "$",
    contains: [
      TYPENAME,
      VAR,
      ARROW,
      EFFECTLIST,
      {
        scope: "punctuation",
        begin: `'|\\(|\\)|\\[|\\]|,`,
      },
    ],
  };

  const BOLD = {
    className: "strong",
    contains: [], // defined later
    variants: [
      {
        begin: /_{2}(?!\s)/,
        end: /_{2}/,
      },
      {
        begin: /\*{2}(?!\s)/,
        end: /\*{2}/,
      },
    ],
  };

  const ITALIC = {
    className: "emphasis",
    contains: [], // defined later
    variants: [
      {
        begin: /\*(?![*\s])/,
        end: /\*/,
      },
      {
        begin: /_(?![_\s])/,
        end: /_/,
        relevance: 0,
      },
    ],
  };

  // 3 level deep nesting is not allowed because it would create confusion
  // in cases like `***testing***` because where we don't know if the last
  // `***` is starting a new bold/italic or finishing the last one
  const BOLD_WITHOUT_ITALIC = hljs.inherit(BOLD, { contains: [] });
  const ITALIC_WITHOUT_BOLD = hljs.inherit(ITALIC, { contains: [] });
  BOLD.contains.push(ITALIC_WITHOUT_BOLD);
  ITALIC.contains.push(BOLD_WITHOUT_ITALIC);

  const LINK = {
    begin: "\\{",
    end: "\\}",
    beginScope: "doctag",
    endScope: "doctag",
    subLanguage: "unison",
    relevance: 5,
  };

  let CONTAINABLE = [LINK];

  [BOLD, ITALIC, BOLD_WITHOUT_ITALIC, ITALIC_WITHOUT_BOLD].forEach((m) => {
    m.contains = m.contains.concat(CONTAINABLE);
  });

  CONTAINABLE = CONTAINABLE.concat(BOLD, ITALIC);

  const HEADER = {
    className: "section",
    variants: [
      {
        begin: "^\\s*#{1,6}",
        end: "$",
        contains: CONTAINABLE,
      },
      {
        begin: "(?=^.+?\\n[=-]{2,}$)",
        contains: [
          { begin: "^[=-]*$" },
          {
            begin: "^",
            end: "\\n",
            contains: CONTAINABLE,
          },
        ],
      },
    ],
  };

  const DOCBLOCK = {
    scope: "comment",
    begin: "\\{\\{",
    end: "\\}\\}",
    contains: [
      BOLD,
      ITALIC,
      BOLD_WITHOUT_ITALIC,
      ITALIC_WITHOUT_BOLD,
      LINK,
      HEADER,
      {
        begin: "^\\s*@typecheck\\s*```",
        end: "^\\s*```\\s*$",
        subLanguage: "unison",
        relevance: 10,
      },
      {
        begin: "``(?!`)",
        end: "(?<!`)``",
        subLanguage: "unison",
        relevance: 8,
      },
      {
        scope: "code",
        begin: `''(?!')`,
        end: `(?<!')''`,
        relevance: 8,
      },
      {
        begin: "\\{\\{",
        end: "\\}\\}",
        subLanguage: "unison",
        relevance: 10,
      },
      {
        scope: "doctag",
        begin: "\\b@[a-z]+\\s*{",
        end: "}",
        relevance: 5,
      },
      {
        begin: "^\\s*```+\\s*$",
        end: "^\\s*```+\\s*$",
        subLanguage: "unison",
        relevance: 0,
      },
      {
        scope: "code",
        begin: "^\\s*```+\\s*raw\\s*$",
        end: "^\\s*```+\\s*$",
        relevance: 0,
      },
    ],
  };

  const NUMBER = {
    scope: "number",
    relevance: 0,
    variants: [
      // decimal floating-point-literal (subsumes decimal-literal)
      {
        match:
          `\\b[+-]?(${decimalDigits})(\\.(${decimalDigits}))?` +
          `([eE][+-]?(${decimalDigits}))?\\b`,
      },
      // hexadecimal literal
      {
        match:
          `\\b[+-]?0[xX]_*(${hexDigits})(\\.(${hexDigits}))?` +
          `([pP][+-]?(${decimalDigits}))?\\b`,
      },
      // octal-literal
      { match: `\\b[+-]?0[oO](${octalDigits})\\b` },
    ],
  };

  const EXPRESSION = {
    end: "$",
    keywords: KEYWORDS,
    contains: [
      COMMENT,
      FUNCTIONCALL,
      TYPESIG,
      USE,
      NUMBER,
      CONSTRUCTORCALL,
      {
        scope: "string",
        begin: '"',
        end: '"',
        contains: [hljs.BACKSLASH_ESCAPE],
        relevance: 0,
      },
      {
        scope: "character",
        begin: "\\?",
        end: "\\b",
        contains: [hljs.BACKSLASH_ESCAPE, "."],
        relevance: 5,
      },
      {
        scope: "number",
        begin:
          "(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",
        relevance: 0,
      },
      OPERATOR,
      {
        scope: "punctuation",
        begin: "[\\[\\](){},.]=",
        relevance: 0,
      },
      {
        scope: "built_in",
        begin: "(true|false|&&|\\|\\|)",
      },
      DOCBLOCK,
    ],
  };

  const TERMLHS = {
    scope: "def",
    begin: `${TERMNAME.begin}\\s*(?=(${PARAM.begin}\\s*)*\\=\\b)`,
    beginScope: "title.function",
    end: "=",
    endScope: "punctuation",
    contains: [PARAM],
    starts: EXPRESSION,
  };

  const WATCH = {
    begin: /^\w*>/,
    beginScope: "meta.prompt",
    end: /^$/,
    keywords: KEYWORDS,
    contains: [TYPESIG, TERMLHS, ...EXPRESSION.contains],
    relevance: 5,
  };

  return {
    name: "Unison",
    case_insensitive: false,
    aliases: ["u"],
    keywords: KEYWORDS,
    contains: [
      USE,
      {
        scope: "typedef",
        begin: ["\\b(unique|structural)\\s+type\\b", "\\s+", TYPENAME.begin],
        contains: [PARAM],
        beginScope: {
          1: "keyword",
          3: "title.class",
        },
        end: "=",
        endScope: "punctuation",
        keywords: "unique structural type",
        starts: {
          end: "^$",
          contains: [
            ...TYPESIG.contains,
            {
              scope: "punctuation",
              begin: "\\|",
            },
            VAR,
            CONSTRUCTOR,
            RECORD,
            COMMENT,
            LIST,
          ],
        },
        relevance: 10,
      },
      {
        scope: "abilitydef",
        begin: "\\b(unique|structural)\\s+ability\\b",
        end: "where",
        keywords: "unique structural ability where",
        contains: [PARAM, TYPENAME],
        starts: {
          end: "^$",
          contains: [TYPESIG, COMMENT],
        },
        relevance: 10,
      },
      TYPESIG,
      TERMLHS,
      WATCH,
      ...EXPRESSION.contains,
    ],
  };
}
