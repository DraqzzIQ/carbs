// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

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
    plugins: ["react-compiler"],
    rules: {
      "react-compiler/react-compiler": "error",
    },
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
  prettier,
);
