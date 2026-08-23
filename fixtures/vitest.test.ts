// Oxlint 규칙 검출용 검증 파일 (Vitest 규칙). 고의로 린트 오류를 포함한다.
// 수정하거나 오류를 고치지 마라. 코멘트 형식: <plugin>/<rule> (<category>).

import { expect, test } from "vite-plus/test"

function initializeDatabase(): void {
  console.info("initialized")
}

// vitest/require-hook (style): 테스트 파일 최상위에서 설정 코드 실행.
initializeDatabase()

test("throws an error", () => {
  // vitest/require-to-throw-message (correctness): 예상 오류 메시지 누락.
  expect(() => {
    throw new Error("boom")
  }).toThrow()
})
