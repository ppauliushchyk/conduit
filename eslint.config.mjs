import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";
import stylistic from "@stylistic/eslint-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const config = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "plugin:prettier/recommended",
    "plugin:import/recommended",
    "plugin:storybook/recommended",
  ),
  stylistic.configs["disable-legacy"],
  ...compat.config({
    rules: {
      "import/extensions": "off",
      "import/no-unresolved": "off",
      "import/order": [
        "error",
        {
          alphabetize: {
            caseInsensitive: true,
            order: "asc",
          },
          groups: [
            "builtin",
            "external",
            "index",
            "internal",
            "parent",
            "sibling",
          ],
          "newlines-between": "always",
        },
      ],
      "import/prefer-default-export": "off",
    },
  }),
  ...compat.config({
    rules: {
      curly: ["error", "all"],
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "sort-keys": ["error", "asc"],
    },
  }),
  {
    plugins: {
      "@stylistic": stylistic,
    },
    rules: {
      "@stylistic/comma-dangle": ["error", "always-multiline"],
      "@stylistic/implicit-arrow-linebreak": ["error", "beside"],
      "@stylistic/indent": ["error", 2, { SwitchCase: 1 }],
      "@stylistic/jsx-curly-brace-presence": [
        "error",
        {
          children: "always",
          propElementValues: "never",
          props: "never",
        },
      ],
      "@stylistic/jsx-newline": [
        "error",
        {
          allowMultilines: true,
          prevent: true,
        },
      ],
      "@stylistic/jsx-props-no-multi-spaces": "error",
      "@stylistic/jsx-sort-props": "error",
      "@stylistic/line-comment-position": ["error", { position: "above" }],
      "@stylistic/lines-around-comment": [
        "error",
        { beforeBlockComment: true },
      ],
      "@stylistic/no-multiple-empty-lines": ["error", { max: 1 }],
      "@stylistic/object-curly-newline": "error",
      "@stylistic/object-property-newline": "error",
      "@stylistic/padded-blocks": ["error", "never"],
      "@stylistic/padding-line-between-statements": [
        "error",
        {
          blankLine: "always",
          next: "*",
          prev: ["const", "let", "var"],
        },
        {
          blankLine: "any",
          next: ["const", "let", "var"],
          prev: ["const", "let", "var"],
        },
        {
          blankLine: "always",
          next: "*",
          prev: ["block", "block-like"],
        },
        {
          blankLine: "always",
          next: ["block", "block-like"],
          prev: "*",
        },
      ],
    },
  },
];

export default config;
