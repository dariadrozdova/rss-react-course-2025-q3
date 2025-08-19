/** @type {import("eslint").Linter.RulesRecord} */

const sortingRules = {
  "import/order": [
    "error",
    {
      "newlines-between": "always-and-inside-groups",
      groups: [
        "builtin",
        "external",
        "internal",
        ["parent", "sibling"],
        "object",
        "type",
        "index",
      ],
      alphabetize: {
        order: "asc",
        caseInsensitive: true,
      },
    },
  ],
  "unused-imports/no-unused-imports": "error",
  "no-relative-import-paths/no-relative-import-paths": [
    "error",
    { allowSameFolder: false, rootDir: "src", prefix: "@" },
  ],
  "import/first": "error",
  "import/newline-after-import": "error",
};

export const myEslintRules = {
  "@typescript-eslint/consistent-type-assertions": [
    "error",
    { assertionStyle: "never" },
  ],
  "@typescript-eslint/explicit-function-return-type": "error",
  "@typescript-eslint/explicit-member-accessibility": [
    "error",
    { accessibility: "explicit", overrides: { constructors: "off" } },
  ],
  "@typescript-eslint/explicit-module-boundary-types": "error",
  "@typescript-eslint/method-signature-style": "error",
  "@typescript-eslint/no-explicit-any": "error",
  "@typescript-eslint/no-floating-promises": "off",
  "@typescript-eslint/no-inferrable-types": "error",
  "@typescript-eslint/no-magic-numbers": [
    "error",
    {
      ignore: [0, 1, -1, 2],
      ignoreArrayIndexes: true,
      ignoreClassFieldInitialValues: true,
      ignoreReadonlyClassProperties: true,
      enforceConst: true,
      ignoreDefaultValues: true,
    },
  ],
  "@typescript-eslint/no-unnecessary-type-parameters": "off",
  "@typescript-eslint/no-unsafe-return": "off",
  "@typescript-eslint/no-unused-vars": [
    "error",
    {
      args: "all",
      argsIgnorePattern: "^_",
      caughtErrors: "all",
      caughtErrorsIgnorePattern: "^_",
      destructuredArrayIgnorePattern: "^_",
      vars: "all",
      varsIgnorePattern: "^_",
      ignoreRestSiblings: true,
    },
  ],
  "@typescript-eslint/no-use-before-define": "error",
  "@typescript-eslint/no-useless-empty-export": "error",
  "@typescript-eslint/require-array-sort-compare": "error",
  "@typescript-eslint/restrict-template-expressions": "off",
  "@typescript-eslint/unbound-method": ["error", { ignoreStatic: true }],
  "react/prop-types": "off",
  "react/display-name": "error",
  "react/jsx-uses-react": "off",
  "react/react-in-jsx-scope": "off",
  "react/jsx-key": "error",
  "react/no-array-index-key": "off",
  "react/self-closing-comp": "error",
  "react/jsx-boolean-value": ["error", "never"],
  "react-hooks/rules-of-hooks": "error",
  "react-hooks/exhaustive-deps": "warn",
  "import/no-cycle": "error",
  "import/extensions": [
    "error",
    "ignorePackages",
    { js: "never", jsx: "never", ts: "never", tsx: "never" },
  ],
  settings: {
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  "import/prefer-default-export": "off",
  "import/no-unresolved": "off",
  "import/no-duplicates": "off",
  "class-methods-use-this": "off",
  curly: ["error", "all"],
  "dot-notation": "off",
  "implicit-arrow-linebreak": "off",
  "function-paren-newline": "off",
  "operator-linebreak": "off",
  "object-curly-newline": "off",
  "max-len": [
    "error",
    {
      code: 120,
      ignoreComments: true,
      ignoreTemplateLiterals: true,
      ignoreStrings: true,
    },
  ],
  "max-lines-per-function": [
    "error",
    { max: 80, skipBlankLines: true, skipComments: true },
  ],
  "no-console": ["error", { allow: ["warn"] }],
  "no-empty-function": "error",
  "prefer-const": "error",
  "no-var": "error",
  eqeqeq: ["error", "always"],
  "unicorn/no-null": "off",
  "unicorn/prefer-global-this": "off",
  "unicorn/prefer-query-selector": "off",
  "unicorn/prevent-abbreviations": [
    "error",
    { allowList: { props: true, Props: true } },
  ],
  "unicorn/explicit-length-check": "off",
  "unicorn/filename-case": [
    "error",
    {
      cases: {
        kebabCase: true,
        camelCase: false,
        pascalCase: false,
      },
    },
  ],
  "lines-between-class-members": [
    "error",
    {
      enforce: [
        { blankLine: "always", next: "method", prev: "*" },
        { blankLine: "always", next: "*", prev: "method" },
      ],
    },
  ],
  "object-curly-spacing": ["error", "always"],
  "comma-dangle": ["error", "only-multiline"],
};
