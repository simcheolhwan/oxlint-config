import { defineConfig } from "vite-plus"

import { lintConfig } from "./src/index.ts"

export default defineConfig({
  fmt: {
    semi: false,
    sortImports: true,
  },
  lint: lintConfig,
  staged: {
    "*": "vp check --fix",
  },
  pack: {
    dts: { tsgo: true },
    exports: true,
  },
})
