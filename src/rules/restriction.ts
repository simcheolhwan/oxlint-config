import type { DummyRuleMap } from "vite-plus/lint"

export const restriction: DummyRuleMap = {
  // error
  "eslint/default-case": "error",
  "eslint/no-alert": "error",
  "eslint/no-console": ["error", { allow: ["warn", "error", "info"] }],
  "eslint/no-empty-function": ["error", { allow: ["arrowFunctions"] }],
  "eslint/no-use-before-define": ["error", { functions: false }],
  "eslint/no-void": ["error", { allowAsStatement: true }],
  "import/no-relative-parent-imports": "error",
  "import/unambiguous": "error",
  "react/button-has-type": "error",
  "react/jsx-filename-extension": ["error", { extensions: [".tsx"] }],
  "react/only-export-components": [
    "error",
    { allowConstantExport: true, allowExportNames: ["Route"] },
  ],
  "typescript/explicit-function-return-type": ["error", { allowExpressions: true }],
  "typescript/explicit-module-boundary-types": "error",
  "typescript/no-dynamic-delete": "error",
  "typescript/no-non-null-assertion": "error",
  "typescript/promise-function-async": ["error", { checkArrowFunctions: false }],
  "unicorn/no-abusive-eslint-disable": "error",
  "unicorn/no-array-for-each": "error",
  "unicorn/no-array-reduce": ["error", { allowSimpleOperations: true }],
  "unicorn/no-process-exit": "error",
  "unicorn/prefer-number-properties": "error",

  // off
  "eslint/no-plusplus": "off",
  "eslint/no-undefined": "off",
  "import/no-default-export": "off",
  "oxc/no-async-await": "off",
  "oxc/no-optional-chaining": "off",
  "oxc/no-rest-spread-properties": "off",
  "react/no-multi-comp": "off",
  "typescript/no-invalid-void-type": "off",
  "vitest/require-test-timeout": "off",
}
