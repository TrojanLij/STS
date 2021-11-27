module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 12
    },
    plugins: [
        "@typescript-eslint"
    ],
    rules: {
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/triple-slash-reference": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/ban-types" : "off",
        "no-mixed-spaces-and-tabs" : "off",
        "no-constant-condition": "off",
        "no-case-declarations": "off",
        "no-underscore-dangle": "off",
        "no-trailing-spaces": "error",
        "no-unused-labels": "error",
        "no-new-wrappers": "error",
        "no-sparse-arrays": "off",
        "no-empty-pattern": "off",
        "no-unused-vars": "off",
        "no-cond-assign": "off",
        "guard-for-in": "error",
        "no-debugger": "error",
        "no-redeclare": "off",
        "prefer-const": "off",
        "id-denylist": "off",
        "no-caller": "error",
        "no-eval": "error",
        "id-match": "off",
        "no-empty": "off",
        "no-multiple-empty-lines": [
            "error",
            {
                "max": 2
            }
        ],
        "no-console": [
            "error",
            {
                "allow": [
                    "log",
                    "warn",
                    "info",
                    "debug",
                    "dir",
                    "timeLog",
                    "assert",
                    "clear",
                    "count",
                    "countReset",
                    "group",
                    "groupEnd",
                    "table",
                    "dirxml",
                    "error",
                    "groupCollapsed",
                    "Console",
                    "profile",
                    "profileEnd",
                    "timeStamp",
                    "context"
                ]
            }
        ],
        "eol-last": "error",
        "eqeqeq": [
            "error",
            "smart"
        ],
        "@typescript-eslint/no-unused-vars": [
            "error",
            { argsIgnorePattern: "^_" }
        ],
        indent: [
            "error",
            4,
            {
                SwitchCase: 1,
                ignoredNodes: ["ConditionalExpression"],
            },
        ],
        "linebreak-style": "off",
        quotes: [
            "error",
            "double",
            { allowTemplateLiterals: true }
        ],
        semi: [
            "error",
            "always"
        ],
        radix: [
            "error",
        ],
    },
    ignorePatterns: [
        "config.ts",
        "config-template.ts",
        "build",
        "tools",
        "src/scripts",
        "node_modules"
    ],
};
