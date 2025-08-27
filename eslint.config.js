import js from "@eslint/js";
import shopifyEslintPlugin from "@shopify/eslint-plugin";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";

const shopifyConfig = [
  ...shopifyEslintPlugin.configs.typescript,
  ...shopifyEslintPlugin.configs["typescript-type-checking"],
  ...shopifyEslintPlugin.configs.react,
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.eslint.json",
      },
    },
    rules: {
      "@shopify/strict-component-boundaries": "off",
      "react-hooks/exhaustive-deps": "off",
      "no-process-env": "off",
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-confusing-void-expression": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@shopify/require-atomic-updates": "off",
      "@shopify/prefer-early-return": "off",
      "@shopify/binary-assignment-parens": "off",
      "func-style": "off",
      "@typescript-eslint/method-signature-style": "off",
      "import/order": [
        "error",
        {
          groups: [
            ["builtin", "external"],
            "internal",
            ["parent", "sibling", "index"],
            "object",
            "type",
          ],
          alphabetize: { order: "asc", caseInsensitive: true },
          "newlines-between": "always",
        },
      ],
      "import-x/order": "off",
      "@shopify/import-order": "off",
      "shopify/import-order": "off",
      // Prettier integration
      "prettier/prettier": "error",
    },
  },
  // Override for React components to force arrow functions
  {
    files: ["**/*.tsx"],
    rules: {
      "func-style": ["error", "expression"],
    },
  },
  // Disable ESLint rules that conflict with Prettier
  prettierConfig,
];

export default shopifyConfig;
