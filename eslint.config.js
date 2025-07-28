import js from "@eslint/js";
import shopifyEslintPlugin from "@shopify/eslint-plugin";
import importPlugin from "eslint-plugin-import";

const shopifyConfig = [
  ...shopifyEslintPlugin.configs.typescript,
  ...shopifyEslintPlugin.configs["typescript-type-checking"],
  ...shopifyEslintPlugin.configs.react,
  js.configs.recommended,
  importPlugin.flatConfigs.recommended, 
  importPlugin.flatConfigs.typescript,
  {
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
      "quotes": ["error", "double", { avoidEscape: true }],
      "import/order": [
        "error",
        {
          groups: [
            ["builtin", "external"],
            "internal",
            ["parent", "sibling", "index"],
            "object",
            "type"
          ],
          alphabetize: { order: "asc", caseInsensitive: true },
          "newlines-between": "always"
        }
      ],
      "import-x/order": "off",
      "@shopify/import-order": "off",
      "shopify/import-order": "off",
      "max-len": ["error", { code: 100 }],
    }
  }
];

export default shopifyConfig;
