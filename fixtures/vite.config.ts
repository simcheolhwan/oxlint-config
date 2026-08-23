import { defineConfig } from "vite-plus"

import { lintConfig } from "../src/index.ts"

export default defineConfig({
  lint: {
    ...lintConfig,
    jsPlugins: ["@tanstack/eslint-plugin-query"],
    rules: {
      ...lintConfig.rules,
      "@tanstack/query/exhaustive-deps": "error",
    },
  },
})
