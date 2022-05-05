/**
 * @woltlabExcludeBundle tiny
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // prettier-ignore
    /*!START*/ const metadata = { "markup": { "title": "Markup", "file": "markup" }, "html": { "title": "HTML", "file": "markup" }, "xml": { "title": "XML", "file": "markup" }, "svg": { "title": "SVG", "file": "markup" }, "mathml": { "title": "MathML", "file": "markup" }, "ssml": { "title": "SSML", "file": "markup" }, "atom": { "title": "Atom", "file": "markup" }, "rss": { "title": "RSS", "file": "markup" }, "css": { "title": "CSS", "file": "css" }, "clike": { "title": "C-like", "file": "clike" }, "javascript": { "title": "JavaScript", "file": "javascript" }, "abap": { "title": "ABAP", "file": "abap" }, "abnf": { "title": "ABNF", "file": "abnf" }, "actionscript": { "title": "ActionScript", "file": "actionscript" }, "ada": { "title": "Ada", "file": "ada" }, "agda": { "title": "Agda", "file": "agda" }, "al": { "title": "AL", "file": "al" }, "antlr4": { "title": "ANTLR4", "file": "antlr4" }, "apacheconf": { "title": "Apache Configuration", "file": "apacheconf" }, "apex": { "title": "Apex", "file": "apex" }, "apl": { "title": "APL", "file": "apl" }, "applescript": { "title": "AppleScript", "file": "applescript" }, "aql": { "title": "AQL", "file": "aql" }, "arduino": { "title": "Arduino", "file": "arduino" }, "arff": { "title": "ARFF", "file": "arff" }, "armasm": { "title": "ARM Assembly", "file": "armasm" }, "arturo": { "title": "Arturo", "file": "arturo" }, "asciidoc": { "title": "AsciiDoc", "file": "asciidoc" }, "aspnet": { "title": "ASP.NET (C#)", "file": "aspnet" }, "asm6502": { "title": "6502 Assembly", "file": "asm6502" }, "asmatmel": { "title": "Atmel AVR Assembly", "file": "asmatmel" }, "autohotkey": { "title": "AutoHotkey", "file": "autohotkey" }, "autoit": { "title": "AutoIt", "file": "autoit" }, "avisynth": { "title": "AviSynth", "file": "avisynth" }, "avro-idl": { "title": "Avro IDL", "file": "avro-idl" }, "awk": { "title": "AWK", "file": "awk" }, "bash": { "title": "Bash", "file": "bash" }, "basic": { "title": "BASIC", "file": "basic" }, "batch": { "title": "Batch", "file": "batch" }, "bbcode": { "title": "BBcode", "file": "bbcode" }, "bicep": { "title": "Bicep", "file": "bicep" }, "birb": { "title": "Birb", "file": "birb" }, "bison": { "title": "Bison", "file": "bison" }, "bnf": { "title": "BNF", "file": "bnf" }, "brainfuck": { "title": "Brainfuck", "file": "brainfuck" }, "brightscript": { "title": "BrightScript", "file": "brightscript" }, "bro": { "title": "Bro", "file": "bro" }, "bsl": { "title": "BSL (1C:Enterprise)", "file": "bsl" }, "c": { "title": "C", "file": "c" }, "csharp": { "title": "C#", "file": "csharp" }, "cpp": { "title": "C++", "file": "cpp" }, "cfscript": { "title": "CFScript", "file": "cfscript" }, "chaiscript": { "title": "ChaiScript", "file": "chaiscript" }, "cil": { "title": "CIL", "file": "cil" }, "clojure": { "title": "Clojure", "file": "clojure" }, "cmake": { "title": "CMake", "file": "cmake" }, "cobol": { "title": "COBOL", "file": "cobol" }, "coffeescript": { "title": "CoffeeScript", "file": "coffeescript" }, "concurnas": { "title": "Concurnas", "file": "concurnas" }, "csp": { "title": "Content-Security-Policy", "file": "csp" }, "cooklang": { "title": "Cooklang", "file": "cooklang" }, "coq": { "title": "Coq", "file": "coq" }, "crystal": { "title": "Crystal", "file": "crystal" }, "css-extras": { "title": "CSS Extras", "file": "css-extras" }, "csv": { "title": "CSV", "file": "csv" }, "cue": { "title": "CUE", "file": "cue" }, "cypher": { "title": "Cypher", "file": "cypher" }, "d": { "title": "D", "file": "d" }, "dart": { "title": "Dart", "file": "dart" }, "dataweave": { "title": "DataWeave", "file": "dataweave" }, "dax": { "title": "DAX", "file": "dax" }, "dhall": { "title": "Dhall", "file": "dhall" }, "diff": { "title": "Diff", "file": "diff" }, "django": { "title": "Django/Jinja2", "file": "django" }, "dns-zone-file": { "title": "DNS zone file", "file": "dns-zone-file" }, "docker": { "title": "Docker", "file": "docker" }, "dot": { "title": "DOT (Graphviz)", "file": "dot" }, "ebnf": { "title": "EBNF", "file": "ebnf" }, "editorconfig": { "title": "EditorConfig", "file": "editorconfig" }, "eiffel": { "title": "Eiffel", "file": "eiffel" }, "ejs": { "title": "EJS", "file": "ejs" }, "elixir": { "title": "Elixir", "file": "elixir" }, "elm": { "title": "Elm", "file": "elm" }, "etlua": { "title": "Embedded Lua templating", "file": "etlua" }, "erb": { "title": "ERB", "file": "erb" }, "erlang": { "title": "Erlang", "file": "erlang" }, "excel-formula": { "title": "Excel Formula", "file": "excel-formula" }, "fsharp": { "title": "F#", "file": "fsharp" }, "factor": { "title": "Factor", "file": "factor" }, "false": { "title": "False", "file": "false" }, "firestore-security-rules": { "title": "Firestore security rules", "file": "firestore-security-rules" }, "flow": { "title": "Flow", "file": "flow" }, "fortran": { "title": "Fortran", "file": "fortran" }, "ftl": { "title": "FreeMarker Template Language", "file": "ftl" }, "gml": { "title": "GameMaker Language", "file": "gml" }, "gap": { "title": "GAP (CAS)", "file": "gap" }, "gcode": { "title": "G-code", "file": "gcode" }, "gdscript": { "title": "GDScript", "file": "gdscript" }, "gedcom": { "title": "GEDCOM", "file": "gedcom" }, "gettext": { "title": "gettext", "file": "gettext" }, "gherkin": { "title": "Gherkin", "file": "gherkin" }, "git": { "title": "Git", "file": "git" }, "glsl": { "title": "GLSL", "file": "glsl" }, "gn": { "title": "GN", "file": "gn" }, "linker-script": { "title": "GNU Linker Script", "file": "linker-script" }, "go": { "title": "Go", "file": "go" }, "go-module": { "title": "Go module", "file": "go-module" }, "graphql": { "title": "GraphQL", "file": "graphql" }, "groovy": { "title": "Groovy", "file": "groovy" }, "haml": { "title": "Haml", "file": "haml" }, "handlebars": { "title": "Handlebars", "file": "handlebars" }, "mustache": { "title": "Mustache", "file": "handlebars" }, "haskell": { "title": "Haskell", "file": "haskell" }, "haxe": { "title": "Haxe", "file": "haxe" }, "hcl": { "title": "HCL", "file": "hcl" }, "hlsl": { "title": "HLSL", "file": "hlsl" }, "hoon": { "title": "Hoon", "file": "hoon" }, "http": { "title": "HTTP", "file": "http" }, "hpkp": { "title": "HTTP Public-Key-Pins", "file": "hpkp" }, "hsts": { "title": "HTTP Strict-Transport-Security", "file": "hsts" }, "ichigojam": { "title": "IchigoJam", "file": "ichigojam" }, "icon": { "title": "Icon", "file": "icon" }, "icu-message-format": { "title": "ICU Message Format", "file": "icu-message-format" }, "idris": { "title": "Idris", "file": "idris" }, "ignore": { "title": ".ignore", "file": "ignore" }, "gitignore": { "title": ".gitignore", "file": "ignore" }, "hgignore": { "title": ".hgignore", "file": "ignore" }, "npmignore": { "title": ".npmignore", "file": "ignore" }, "inform7": { "title": "Inform 7", "file": "inform7" }, "ini": { "title": "Ini", "file": "ini" }, "io": { "title": "Io", "file": "io" }, "j": { "title": "J", "file": "j" }, "java": { "title": "Java", "file": "java" }, "javadoc": { "title": "JavaDoc", "file": "javadoc" }, "javadoclike": { "title": "JavaDoc-like", "file": "javadoclike" }, "javastacktrace": { "title": "Java stack trace", "file": "javastacktrace" }, "jexl": { "title": "Jexl", "file": "jexl" }, "jolie": { "title": "Jolie", "file": "jolie" }, "jq": { "title": "JQ", "file": "jq" }, "jsdoc": { "title": "JSDoc", "file": "jsdoc" }, "js-extras": { "title": "JS Extras", "file": "js-extras" }, "json": { "title": "JSON", "file": "json" }, "json5": { "title": "JSON5", "file": "json5" }, "jsonp": { "title": "JSONP", "file": "jsonp" }, "jsstacktrace": { "title": "JS stack trace", "file": "jsstacktrace" }, "js-templates": { "title": "JS Templates", "file": "js-templates" }, "julia": { "title": "Julia", "file": "julia" }, "keepalived": { "title": "Keepalived Configure", "file": "keepalived" }, "keyman": { "title": "Keyman", "file": "keyman" }, "kotlin": { "title": "Kotlin", "file": "kotlin" }, "kts": { "title": "Kotlin Script", "file": "kotlin" }, "kumir": { "title": "KuMir (КуМир)", "file": "kumir" }, "kusto": { "title": "Kusto", "file": "kusto" }, "latex": { "title": "LaTeX", "file": "latex" }, "tex": { "title": "TeX", "file": "latex" }, "context": { "title": "ConTeXt", "file": "latex" }, "latte": { "title": "Latte", "file": "latte" }, "less": { "title": "Less", "file": "less" }, "lilypond": { "title": "LilyPond", "file": "lilypond" }, "liquid": { "title": "Liquid", "file": "liquid" }, "lisp": { "title": "Lisp", "file": "lisp" }, "livescript": { "title": "LiveScript", "file": "livescript" }, "llvm": { "title": "LLVM IR", "file": "llvm" }, "log": { "title": "Log file", "file": "log" }, "lolcode": { "title": "LOLCODE", "file": "lolcode" }, "lua": { "title": "Lua", "file": "lua" }, "magma": { "title": "Magma (CAS)", "file": "magma" }, "makefile": { "title": "Makefile", "file": "makefile" }, "markdown": { "title": "Markdown", "file": "markdown" }, "markup-templating": { "title": "Markup templating", "file": "markup-templating" }, "mata": { "title": "Mata", "file": "mata" }, "matlab": { "title": "MATLAB", "file": "matlab" }, "maxscript": { "title": "MAXScript", "file": "maxscript" }, "mel": { "title": "MEL", "file": "mel" }, "mermaid": { "title": "Mermaid", "file": "mermaid" }, "mizar": { "title": "Mizar", "file": "mizar" }, "mongodb": { "title": "MongoDB", "file": "mongodb" }, "monkey": { "title": "Monkey", "file": "monkey" }, "moonscript": { "title": "MoonScript", "file": "moonscript" }, "n1ql": { "title": "N1QL", "file": "n1ql" }, "n4js": { "title": "N4JS", "file": "n4js" }, "nand2tetris-hdl": { "title": "Nand To Tetris HDL", "file": "nand2tetris-hdl" }, "naniscript": { "title": "Naninovel Script", "file": "naniscript" }, "nasm": { "title": "NASM", "file": "nasm" }, "neon": { "title": "NEON", "file": "neon" }, "nevod": { "title": "Nevod", "file": "nevod" }, "nginx": { "title": "nginx", "file": "nginx" }, "nim": { "title": "Nim", "file": "nim" }, "nix": { "title": "Nix", "file": "nix" }, "nsis": { "title": "NSIS", "file": "nsis" }, "objectivec": { "title": "Objective-C", "file": "objectivec" }, "ocaml": { "title": "OCaml", "file": "ocaml" }, "odin": { "title": "Odin", "file": "odin" }, "opencl": { "title": "OpenCL", "file": "opencl" }, "openqasm": { "title": "OpenQasm", "file": "openqasm" }, "oz": { "title": "Oz", "file": "oz" }, "parigp": { "title": "PARI/GP", "file": "parigp" }, "parser": { "title": "Parser", "file": "parser" }, "pascal": { "title": "Pascal", "file": "pascal" }, "pascaligo": { "title": "Pascaligo", "file": "pascaligo" }, "psl": { "title": "PATROL Scripting Language", "file": "psl" }, "pcaxis": { "title": "PC-Axis", "file": "pcaxis" }, "peoplecode": { "title": "PeopleCode", "file": "peoplecode" }, "perl": { "title": "Perl", "file": "perl" }, "php": { "title": "PHP", "file": "php" }, "phpdoc": { "title": "PHPDoc", "file": "phpdoc" }, "php-extras": { "title": "PHP Extras", "file": "php-extras" }, "plant-uml": { "title": "PlantUML", "file": "plant-uml" }, "plsql": { "title": "PL/SQL", "file": "plsql" }, "powerquery": { "title": "PowerQuery", "file": "powerquery" }, "powershell": { "title": "PowerShell", "file": "powershell" }, "processing": { "title": "Processing", "file": "processing" }, "prolog": { "title": "Prolog", "file": "prolog" }, "promql": { "title": "PromQL", "file": "promql" }, "properties": { "title": ".properties", "file": "properties" }, "protobuf": { "title": "Protocol Buffers", "file": "protobuf" }, "pug": { "title": "Pug", "file": "pug" }, "puppet": { "title": "Puppet", "file": "puppet" }, "pure": { "title": "Pure", "file": "pure" }, "purebasic": { "title": "PureBasic", "file": "purebasic" }, "purescript": { "title": "PureScript", "file": "purescript" }, "python": { "title": "Python", "file": "python" }, "qsharp": { "title": "Q#", "file": "qsharp" }, "q": { "title": "Q (kdb+ database)", "file": "q" }, "qml": { "title": "QML", "file": "qml" }, "qore": { "title": "Qore", "file": "qore" }, "r": { "title": "R", "file": "r" }, "racket": { "title": "Racket", "file": "racket" }, "cshtml": { "title": "Razor C#", "file": "cshtml" }, "jsx": { "title": "React JSX", "file": "jsx" }, "tsx": { "title": "React TSX", "file": "tsx" }, "reason": { "title": "Reason", "file": "reason" }, "regex": { "title": "Regex", "file": "regex" }, "rego": { "title": "Rego", "file": "rego" }, "renpy": { "title": "Ren'py", "file": "renpy" }, "rescript": { "title": "ReScript", "file": "rescript" }, "rest": { "title": "reST (reStructuredText)", "file": "rest" }, "rip": { "title": "Rip", "file": "rip" }, "roboconf": { "title": "Roboconf", "file": "roboconf" }, "robotframework": { "title": "Robot Framework", "file": "robotframework" }, "ruby": { "title": "Ruby", "file": "ruby" }, "rust": { "title": "Rust", "file": "rust" }, "sas": { "title": "SAS", "file": "sas" }, "sass": { "title": "Sass (Sass)", "file": "sass" }, "scss": { "title": "Sass (Scss)", "file": "scss" }, "scala": { "title": "Scala", "file": "scala" }, "scheme": { "title": "Scheme", "file": "scheme" }, "shell-session": { "title": "Shell session", "file": "shell-session" }, "smali": { "title": "Smali", "file": "smali" }, "smalltalk": { "title": "Smalltalk", "file": "smalltalk" }, "smarty": { "title": "Smarty", "file": "smarty" }, "sml": { "title": "SML", "file": "sml" }, "solidity": { "title": "Solidity (Ethereum)", "file": "solidity" }, "solution-file": { "title": "Solution file", "file": "solution-file" }, "soy": { "title": "Soy (Closure Template)", "file": "soy" }, "sparql": { "title": "SPARQL", "file": "sparql" }, "splunk-spl": { "title": "Splunk SPL", "file": "splunk-spl" }, "sqf": { "title": "SQF: Status Quo Function (Arma 3)", "file": "sqf" }, "sql": { "title": "SQL", "file": "sql" }, "squirrel": { "title": "Squirrel", "file": "squirrel" }, "stan": { "title": "Stan", "file": "stan" }, "stata": { "title": "Stata Ado", "file": "stata" }, "iecst": { "title": "Structured Text (IEC 61131-3)", "file": "iecst" }, "stylus": { "title": "Stylus", "file": "stylus" }, "supercollider": { "title": "SuperCollider", "file": "supercollider" }, "swift": { "title": "Swift", "file": "swift" }, "systemd": { "title": "Systemd configuration file", "file": "systemd" }, "t4-templating": { "title": "T4 templating", "file": "t4-templating" }, "t4-cs": { "title": "T4 Text Templates (C#)", "file": "t4-cs" }, "t4-vb": { "title": "T4 Text Templates (VB)", "file": "t4-vb" }, "tap": { "title": "TAP", "file": "tap" }, "tcl": { "title": "Tcl", "file": "tcl" }, "tt2": { "title": "Template Toolkit 2", "file": "tt2" }, "textile": { "title": "Textile", "file": "textile" }, "toml": { "title": "TOML", "file": "toml" }, "tremor": { "title": "Tremor", "file": "tremor" }, "trickle": { "title": "trickle", "file": "tremor" }, "troy": { "title": "troy", "file": "tremor" }, "turtle": { "title": "Turtle", "file": "turtle" }, "twig": { "title": "Twig", "file": "twig" }, "typescript": { "title": "TypeScript", "file": "typescript" }, "typoscript": { "title": "TypoScript", "file": "typoscript" }, "unrealscript": { "title": "UnrealScript", "file": "unrealscript" }, "uorazor": { "title": "UO Razor Script", "file": "uorazor" }, "uri": { "title": "URI", "file": "uri" }, "v": { "title": "V", "file": "v" }, "vala": { "title": "Vala", "file": "vala" }, "vbnet": { "title": "VB.Net", "file": "vbnet" }, "velocity": { "title": "Velocity", "file": "velocity" }, "verilog": { "title": "Verilog", "file": "verilog" }, "vhdl": { "title": "VHDL", "file": "vhdl" }, "vim": { "title": "vim", "file": "vim" }, "visual-basic": { "title": "Visual Basic", "file": "visual-basic" }, "vba": { "title": "VBA", "file": "visual-basic" }, "warpscript": { "title": "WarpScript", "file": "warpscript" }, "wasm": { "title": "WebAssembly", "file": "wasm" }, "web-idl": { "title": "Web IDL", "file": "web-idl" }, "wiki": { "title": "Wiki markup", "file": "wiki" }, "wolfram": { "title": "Wolfram language", "file": "wolfram" }, "mathematica": { "title": "Mathematica", "file": "wolfram" }, "nb": { "title": "Mathematica Notebook", "file": "wolfram" }, "wren": { "title": "Wren", "file": "wren" }, "xeora": { "title": "Xeora", "file": "xeora" }, "xml-doc": { "title": "XML doc (.net)", "file": "xml-doc" }, "xojo": { "title": "Xojo (REALbasic)", "file": "xojo" }, "xquery": { "title": "XQuery", "file": "xquery" }, "yaml": { "title": "YAML", "file": "yaml" }, "yang": { "title": "YANG", "file": "yang" }, "zig": { "title": "Zig", "file": "zig" } }; /*!END*/
    exports.default = metadata;
});
