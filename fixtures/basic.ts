// Oxlint 규칙 검출용 검증 파일 (일반 규칙). 고의로 린트 오류를 포함한다.
// 수정하거나 오류를 고치지 마라. 코멘트 형식: <plugin>/<rule> (<category>).

// eslint/eqeqeq (pedantic): === 대신 == 사용.
export function isSame(a: number, b: number): boolean {
  return a == b
}

// eslint/no-unused-vars (correctness): 'unusedParam'을 사용하지 않음.
export function greet(name: string, unusedParam: number): string {
  return `hi ${name}`
}

// typescript/array-type (style): Array<T> 대신 T[]를 써야 함.
export function firstName(names: Array<string>): string {
  return names[0]
}

// typescript/consistent-type-definitions (style): 객체 타입은 type 대신 interface로 정의.
export type Point = { x: number; y: number }

// typescript/no-non-null-assertion (restriction): ! non-null 단언 금지.
export function getLength(text: string | null): number {
  return text!.length
}

// unicorn/no-array-for-each (restriction): forEach 대신 for...of 사용.
export function logEach(items: number[]): void {
  items.forEach((item) => {
    console.info(item)
  })
}

// unicorn/no-array-sort (suspicious): sort() 대신 toSorted() 사용 (결과를 쓸 때 검출).
export function sortValues(values: number[]): number[] {
  return [...values].sort((a, b) => a - b)
}
