// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.stylistic,
  {
    ignores: [
      "android/**",
      "ios/**",
      "babel.config.js",
      "index.js",
      "metro.config.js",
      "tailwind.config.js",
    ],
  },
  prettier,
);
