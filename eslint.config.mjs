// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import reactCompiler from "eslint-plugin-react-compiler";

export default tseslint.config(
  {
    ignores: [
      "android/**",
      "ios/**",
      "babel.config.js",
      "index.js",
      "metro.config.js",
      "tailwind.config.js",
      "eslint.config.mjs",
      "drizzle/**",
      "db/queries/useRelationalLiveQuery.ts",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: {
      "react-compiler": reactCompiler,
    },
    rules: {
      "react-compiler/react-compiler": "error",
    },
  },
  {
    files: [
      "android/**",
      "ios/**",
      "drizzle/**",
      "db/queries/useRelationalLiveQuery.ts",
    ],
    rules: {
      "react-compiler/react-compiler": "off",
    },
  },

  prettier,
);
