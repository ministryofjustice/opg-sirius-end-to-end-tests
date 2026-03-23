import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import globals from "globals";

export default defineConfig([
  {
    files: ["**/*.ts", "**/*.cts", "**/*.mts"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.strict,
]);
