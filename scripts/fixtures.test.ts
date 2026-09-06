import { spawnSync } from "node:child_process"

import { z } from "zod"

const diagnosticSchema = z.object({ code: z.string(), severity: z.string() })
const reportSchema = z.object({ diagnostics: z.array(diagnosticSchema) })

type Diagnostic = z.infer<typeof diagnosticSchema>

const expectedDiagnostics: Diagnostic[] = [
  { code: "@tanstack/query(exhaustive-deps)", severity: "error" },
  { code: "eslint(eqeqeq)", severity: "error" },
  { code: "eslint(no-underscore-dangle)", severity: "error" },
  { code: "eslint(no-unused-vars)", severity: "error" },
  { code: "promise(no-multiple-resolved)", severity: "error" },
  { code: "react-hooks(exhaustive-deps)", severity: "error" },
  { code: "react(exhaustive-effect-dependencies)", severity: "error" },
  { code: "react(exhaustive-effect-dependencies)", severity: "error" },
  { code: "react(hooks)", severity: "error" },
  { code: "react(refs)", severity: "error" },
  { code: "react-hooks(rules-of-hooks)", severity: "warning" },
  { code: "react(set-state-in-effect)", severity: "error" },
  { code: "typescript(array-type)", severity: "error" },
  { code: "typescript(consistent-type-definitions)", severity: "error" },
  { code: "typescript(no-base-to-string)", severity: "error" },
  { code: "typescript(no-non-null-assertion)", severity: "error" },
  { code: "unicorn(no-array-for-each)", severity: "error" },
  { code: "unicorn(no-array-sort)", severity: "error" },
  { code: "unicorn(no-hex-escape)", severity: "error" },
  { code: "vitest(require-hook)", severity: "error" },
  { code: "vitest(require-to-throw-message)", severity: "error" },
]

function compareDiagnostics(left: Diagnostic, right: Diagnostic): number {
  return left.code.localeCompare(right.code)
}

test("fixtures report the expected lint diagnostics", () => {
  const result = spawnSync(
    "vp",
    [
      "-C",
      "fixtures",
      "lint",
      "basic.ts",
      "compiler.ts",
      "hook.ts",
      "vitest.test.ts",
      "--format=json",
    ],
    { encoding: "utf8" },
  )

  expect(result.error).toBeUndefined()
  expect(result.status).toBe(1)
  const { diagnostics } = reportSchema.parse(JSON.parse(result.stdout))
  expect(diagnostics.toSorted(compareDiagnostics)).toStrictEqual(
    expectedDiagnostics.toSorted(compareDiagnostics),
  )
})
