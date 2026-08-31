import { spawnSync } from "node:child_process"

interface Diagnostic {
  code: string
  severity: string
}

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function parseDiagnostics(output: string): Diagnostic[] {
  const report: unknown = JSON.parse(output)
  if (!isRecord(report) || !Array.isArray(report.diagnostics)) {
    throw new TypeError("Oxlint JSON output does not contain diagnostics")
  }

  return report.diagnostics.map((diagnostic: unknown) => {
    if (
      !isRecord(diagnostic) ||
      typeof diagnostic.code !== "string" ||
      typeof diagnostic.severity !== "string"
    ) {
      throw new TypeError("Oxlint diagnostic has an unexpected shape")
    }

    return { code: diagnostic.code, severity: diagnostic.severity }
  })
}

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
  expect(parseDiagnostics(result.stdout).toSorted(compareDiagnostics)).toStrictEqual(
    expectedDiagnostics.toSorted(compareDiagnostics),
  )
})
