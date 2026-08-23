import type { DummyRuleMap } from "vite-plus/lint"

export const perf: DummyRuleMap = {
  // error
  "eslint/no-await-in-loop": "error",
  "oxc/no-accumulating-spread": "error",
  "react/jsx-no-constructed-context-values": "error",
  "react/no-array-index-key": "error",

  // off
  "oxc/no-map-spread": "off",
}
