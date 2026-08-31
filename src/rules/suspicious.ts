import type { DummyRuleMap } from "vite-plus/lint"

export const suspicious: DummyRuleMap = {
  // error
  "eslint/no-shadow": "error",
  "eslint/no-underscore-dangle": "error",
  "eslint/preserve-caught-error": ["error", { requireCatchParameter: true }],
  "import/no-named-as-default": "error",
  "import/no-unassigned-import": ["error", { allow: ["**/*.css"] }],
  "promise/no-multiple-resolved": "error",
  "react/exhaustive-effect-dependencies": "error",
  "typescript/no-unnecessary-boolean-literal-compare": "error",
  "typescript/no-unnecessary-type-arguments": "error",
  "typescript/no-unnecessary-type-parameters": "error",
  "unicorn/consistent-function-scoping": "error",
  "unicorn/no-array-sort": "error",
  "unicorn/no-hex-escape": "error",

  // off
  "react/react-in-jsx-scope": "off",
  "typescript/consistent-return": "off",
  "typescript/no-unsafe-type-assertion": "off",
}
