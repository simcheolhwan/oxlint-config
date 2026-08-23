import { defineConfig } from "vite-plus"

import { lintConfig } from "./src/index.ts"

export default defineConfig({
  fmt: {
    semi: false,
    sortImports: true,
  },
  lint: {
    ...lintConfig,
    ignorePatterns: ["fixtures/**"],
  },
  staged: {
    "!fixtures/**": "vp check --fix",
  },
  pack: {
    dts: { tsgo: true },
    exports: true,
  },
  test: {
    globals: true,
    include: ["scripts/**/*.test.ts"],
  },
})
