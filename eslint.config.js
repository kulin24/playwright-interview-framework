import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  // Base recommended rules
  js.configs.recommended,
  
  // TypeScript configuration
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        process: "readonly",
        __dirname: "readonly",
        "console": "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-console": ["warn", { allow: ["error", "warn", "info"] }],
      "no-undef": "off",
      "no-unused-vars": "off",
    },
  },
  
  // Ignore patterns
  {
    ignores: [
      "node_modules/",
      "playwright-report/",
      "test-results/",
      "debug-artifacts/",
      "dist/",
      "*.config.js",
    ],
  },
];
