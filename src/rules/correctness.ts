import type { DummyRuleMap } from "vite-plus/lint"

export const correctness: DummyRuleMap = {
  // error
  "eslint/no-dupe-keys": "error",
  "eslint/no-unused-vars": ["error", { ignoreRestSiblings: true }],
  "jest/require-to-throw-message": "error",
  "jsx-a11y/alt-text": "error",
  "jsx-a11y/anchor-is-valid": "error",
  "jsx-a11y/click-events-have-key-events": "error",
  "jsx-a11y/control-has-associated-label": "error",
  "jsx-a11y/label-has-associated-control": "error",
  "jsx-a11y/no-noninteractive-tabindex": "error",
  "jsx-a11y/no-static-element-interactions": "error",
  "jsx-a11y/prefer-tag-over-role": "error",
  "react/exhaustive-deps": "error",
  "typescript/no-floating-promises": "error",
  "unicorn/no-new-array": "error",
  "vitest/require-to-throw-message": "error",

  // off
  "jsx-a11y/no-autofocus": "off",
}
