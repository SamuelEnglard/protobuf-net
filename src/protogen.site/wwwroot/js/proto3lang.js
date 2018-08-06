define(function () {
    // Create your own language definition here
    // You can safely look at other samples without losing modifications.
    // Modifications are not saved on browser refresh/close though -- copy often!
    return {
        // Set defaultToken to invalid to see what you do not tokenize yet
        //defaultToken: 'invalid',

        typeKeywords: [
            "double", "float", "int32", "int64", "uint32", "uint64",
            "sint32", "sint64", "fixed32", "fixed64", "sfixed32", "sfixed64",
            "bool", "string", "bytes"
        ],

        ident: /[A-Za-z][A-Za-z0-9_]*/,

        field: /(@ident)(\s+)(@ident)(\s*\=\s*)([1-9][0-9]*)(;)/,

        // The main tokenizer for our languages
        tokenizer: {
            root: [
                { include: "whitespace" },
                {
                    regex: /(syntax)(\s*\=\s*)((?:"proto3")|(?:'proto3'))(;)/,
                    action: [
                        { token: "keyword" },
                        { token: "" },
                        { token: "string" },
                        { token: "", next: "root3" }
                    ]
                },
                {
                    regex: /(syntax)(\s*\=\s*)((?:"proto2")|(?:'proto2'))(;)/,
                    action: [
                        { token: "keyword" },
                        { token: "" },
                        { token: "string" },
                        { token: "", next: "root2" }
                    ]
                }
            ],
            root3: [
                { include: "whitespace" },
                { include: "general3" },
                { include: "sharedroot" }
            ],
            root2: [
                { include: "whitespace" },
                { include: "sharedroot" }
            ],
            sharedroot: [
                {
                    regex: /(import)(\s+)(".+")(;)/,
                    action: [
                        { token: "keyword" },
                        { token: "" },
                        { token: "string" },
                        { token: "" }
                    ]
                },
                {
                    regex: /(package)(\s+)([A-Za-z\.]+)(;)/,
                    action: [
                        { token: "keyword" },
                        { token: "" },
                        { token: "namespace" },
                        { token: "" }
                    ]
                },
                {
                    regex: /(option)(\s+)(@ident)(\s*\=\s*)(.+)(;)/,
                    action: [
                        { token: "keyword" },
                        { token: "" },
                        { token: "identifier" },
                        { token: "" },
                        {
                            cases: {
                                "'.+'": "string",
                                "\".+.\"": "string",
                                "true|false": "keyword",
                                "[+-]?[0-9]+(\.[0-9]+)?": "number",
                                "[A-Za-z][A-Za-z0-9_]*": "identifier"
                            }
                        },
                        { token: "" },
                    ]
                }
            ],
            whitespace: [
                {
                    regex: /\/\/.*$/,
                    action: { token: "comment" }
                }
            ],
            general3: [
                {
                    regex: /(message)(\s+)(@ident)([\s\n]*)(\{)/m,
                    action: [
                        { token: "keyword" },
                        { token: "" },
                        { token: "type.identifier" },
                        { token: "" },
                        { token: "delimiter.curly", next: "message3" }
                    ]
                },
                {
                    regex: /(enum)(\s+)(@ident)([\s\n]*)(\{)/m,
                    action: [
                        { token: "keyword" },
                        { token: "" },
                        { token: "type.identifier" },
                        { token: "" },
                        { token: "delimiter.curly", next: "enum3" }
                    ]
                }
            ],
            message3: [
                { include: "whitespace" },
                { include: "general3" },
                {
                    regex: /(})/,
                    action: [
                        { token: "delimiter.curly", next: "@pop" }
                    ]
                },
                {
                    regex: /(oneof)(\s+)(@ident)([\s\n]*)(\{)/m,
                    action: [
                        { token: "keyword" },
                        { token: "" },
                        { token: "variable.name" },
                        { token: "" },
                        { token: "delimiter.curly", next: "oneof3" }
                    ]
                },
                {
                    regex: /((?:repeated\s+)?)@field/,
                    action: [
                        { token: "keyword" },
                        {
                            cases: {
                                "@typeKeywords": "keyword",
                                "@default": "type.identifier"
                            }
                        },
                        { token: "" },
                        { token: "variable.name" },
                        { token: "" },
                        { token: "number" },
                        { token: "" }
                    ]
                }
            ],
            oneof3: [
                { include: "whitespace" },
                {
                    regex: /(})/,
                    action: [
                        { token: "delimiter.curly", next: "@pop" }
                    ]
                },
                {
                    regex: /@field/,
                    action: [
                        {
                            cases: {
                                "@typeKeywords": "keyword",
                                "@default": "type.identifier"
                            }
                        },
                        { token: "" },
                        { token: "variable.name" },
                        { token: "" },
                        { token: "number" },
                        { token: "" }
                    ]
                }
            ],
            enum3: [
                { include: "whitespace" },
                {
                    regex: /(})/,
                    action: [
                        { token: "delimiter.curly", next: "@pop" }
                    ]
                },
                {
                    regex: /(@ident)(\s*\=\s*)([0-9]+)(;)/,
                    action: [
                        { token: "variable.name" },
                        { token: "" },
                        { token: "number" },
                        { token: "" }
                    ]
                }
            ]
        },
    };
});