import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import pluginImport from "eslint-plugin-import";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      import: pluginImport,
    },
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // Wymuś zgłaszanie nieużywanych zmiennych/parametrów w TypeScript
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      // Wykryj nieużywane eksporty i brakujące eksporty
      "import/no-unused-modules": [
        "warn",
        {
          unusedExports: true,
          missingExports: true,
        },
      ],
    },
  },
  {
    files: ["**/*.js"],
    rules: {
      // Delikatniej dla JS – ostrzeżenia zamiast błędów
      "no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    // Raportuj nieużyte dyrektywy // eslint-disable
    linterOptions: { reportUnusedDisableDirectives: true },
  },
];

export default eslintConfig;
