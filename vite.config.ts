import { defineConfig } from "vite-plus"

import { lintConfig } from "./src/index.ts"

export default defineConfig({
  fmt: {
    semi: false,
    sortImports: true,
  },
  lint: {
    ...lintConfig,
    // fixtures 검증용
    jsPlugins: ["@tanstack/eslint-plugin-query"],
    rules: {
      ...lintConfig.rules,
      "@tanstack/query/exhaustive-deps": "error",
    },
  },
  staged: {
    "!fixtures/**": "vp check --fix",
  },
  pack: {
    dts: { tsgo: true },
    exports: true,
  },
})
