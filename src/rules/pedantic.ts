import type { DummyRuleMap } from "vite-plus/lint"

export const pedantic: DummyRuleMap = {
  // error
  "eslint/array-callback-return": "error",
  "eslint/eqeqeq": "error",
  "eslint/max-lines": ["error", { skipBlankLines: true, skipComments: true }],
  "eslint/max-lines-per-function": ["error", { max: 80, skipBlankLines: true, skipComments: true }],
  "eslint/require-await": "error",
  "import/max-dependencies": ["error", { max: 12, ignoreTypeImports: true }],
  "typescript/no-confusing-void-expression": [
    "error",
    { ignoreArrowShorthand: true, ignoreVoidReturningFunctions: true },
  ],
  "typescript/no-deprecated": "error",
  "typescript/no-misused-promises": ["error", { checksVoidReturn: { attributes: false } }],
  "typescript/no-unsafe-argument": "error",
  "typescript/no-unsafe-assignment": "error",
  "typescript/no-unsafe-return": "error",
  "typescript/prefer-nullish-coalescing": "error",
  "typescript/require-await": "error",
  "typescript/switch-exhaustiveness-check": "error",
  "unicorn/escape-case": "error",
  "unicorn/new-for-builtins": "error",
  "unicorn/no-array-callback-reference": "error",
  "unicorn/no-useless-undefined": "error",
  "unicorn/prefer-query-selector": "error",
  "unicorn/prefer-string-replace-all": "error",
  "unicorn/prefer-top-level-await": "error",

  // off
  "eslint/no-inline-comments": "off",
  "eslint/no-negated-condition": "off",
  "eslint/no-warning-comments": "off",
  "typescript/only-throw-error": "off",
  "typescript/prefer-readonly-parameter-types": "off",
  "typescript/strict-boolean-expressions": "off",
  "typescript/strict-void-return": "off",
  "unicorn/no-negated-condition": "off",
}
