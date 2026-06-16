import type { OxlintConfig } from "vite-plus/lint"

import { correctness } from "./rules/correctness.ts"
import { pedantic } from "./rules/pedantic.ts"
import { perf } from "./rules/perf.ts"
import { restriction } from "./rules/restriction.ts"
import { style } from "./rules/style.ts"
import { suspicious } from "./rules/suspicious.ts"

export const lintConfig: OxlintConfig = {
  options: { typeAware: true, typeCheck: true },
  env: { browser: true },
  plugins: [
    "typescript",
    "eslint",
    "oxc",
    "import",
    "react",
    "promise",
    "vitest",
    "unicorn",
    "jsx-a11y",
  ],
  categories: {
    correctness: "error",
    suspicious: "error",
    perf: "warn",
    pedantic: "warn",
  },
  rules: {
    ...correctness,
    ...suspicious,
    ...perf,
    ...pedantic,
    ...style,
    ...restriction,
  },
  overrides: [
    {
      files: ["**/*.tsx"],
      rules: {
        "eslint/max-lines-per-function": [
          "error",
          { max: 160, skipBlankLines: true, skipComments: true },
        ],
        "import/max-dependencies": ["error", { max: 16, ignoreTypeImports: true }],
        "import/no-named-export": "error",
        "import/prefer-default-export": ["error", { target: "any" }],
        "typescript/explicit-function-return-type": "off",
        "typescript/explicit-module-boundary-types": "off",
      },
    },
    {
      files: ["**/use*.tsx", "**/*Context.tsx", "**/routes/**/[!-]*.tsx"],
      rules: {
        "import/no-named-export": "off",
        "import/prefer-default-export": "off",
      },
    },
    {
      files: ["**/*Context.tsx"],
      rules: {
        "react/only-export-components": "off",
      },
    },
    {
      files: ["**/*.test.ts"],
      rules: {
        "eslint/max-lines": "off",
        "eslint/max-lines-per-function": "off",
        "eslint/max-statements": "off",
        "import/max-dependencies": "off",
        "jest/require-hook": "error",
        "vitest/require-hook": "error",
      },
    },
    {
      files: ["**/{functions,scripts}/**/*.ts"],
      rules: {
        "import/no-nodejs-modules": "off",
        "unicorn/no-process-exit": "off",
      },
    },
    {
      files: ["**/*.d.ts"],
      rules: {
        "import/unambiguous": "off",
      },
    },
  ],
}
