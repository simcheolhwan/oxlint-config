---
title: "Style 제외 규칙"
---

## [eslint/arrow-body-style](https://oxc.rs/docs/guide/usage/linter/rules/eslint/arrow-body-style)

화살표 함수 본문 표기를 expression(`() => x`) 또는 block(`() => { return x }`) 중 하나로 통일하도록 강제한다.

**취향.** 미래에 본문에 hooks나 부수 효과를 추가할 때 다시 블록으로 펼치게 되는 잦은 변경이 부담스럽고, 단순 반환은 expression, 다단계 동작은 block이 자연스러우므로 양 형태를 자유롭게 혼용한다.

**Configuration**

- `style` (`"as-needed" | "never" | "always"`, default: `"as-needed"`): 화살표 함수 본문 중괄호 요구 방식
- `requireReturnForObjectLiteral` (bool, default: `false`): 객체 리터럴 반환 시 중괄호+`return` 강제 (`as-needed` 모드 전용)

**🆗 rule: incorrect (허용)**

```ts
const helper = () => 1
```

**⚠️ rule: correct (노이즈)**

```ts
const helper = () => {
  return 1
}
```

## [eslint/capitalized-comments](https://oxc.rs/docs/guide/usage/linter/rules/eslint/capitalized-comments)

주석이 항상 대문자로 시작해야 한다고 강제한다.

**취향.** 주석 톤은 사람마다 다르고 맥락마다 달라 대소문자를 강제할 가치가 거의 없다.

**Configuration**

- `mode` (`"always" | "never"`, default: `"always"`): 주석 첫 글자 대문자 여부
- `ignorePattern` (regex string, default: 없음): 제외할 주석 패턴
- `ignoreInlineComments` (bool, default: 없음): 인라인 주석 무시
- `ignoreConsecutiveComments` (bool, default: 없음): 연속 주석 중 첫 번째 이후 무시
- `line` / `block` (object, default: 없음): 줄/블록 주석에 위 옵션을 개별 적용

**🆗 rule: incorrect (허용)**

```ts
// lowercase memo
```

**⚠️ rule: correct (노이즈)**

```ts
// Capitalized memo
```

## [eslint/curly](https://oxc.rs/docs/guide/usage/linter/rules/eslint/curly)

단일 문장 분기에도 항상 중괄호를 강제한다.

**취향.** 한 줄 분기 압축이 가독성에 더 좋은 경우가 많아 일률 강제는 노이즈다.

**Configuration**

- `type` (`"all" | "multi" | "multi-line" | "multi-or-nest"`, default: `"all"`): 중괄호 요구 시점
- `consistent` (`"consistent"`, default: 없음): if-else 전체 브랜치에 중괄호 통일 강제 (위치 인자)

**🆗 rule: incorrect (허용)**

```ts
if (isReady) start()
```

**⚠️ rule: correct (노이즈)**

```ts
if (isReady) {
  start()
}
```

## [eslint/func-style](https://oxc.rs/docs/guide/usage/linter/rules/eslint/func-style)

함수 정의 표기를 `function` declaration 또는 화살표 expression 중 하나로 통일하도록 강제한다.

**베스트 프랙티스.** 선언과 표현식은 호이스팅과 `this` 동작이 달라 의도적으로 혼용한다.

**Configuration**

- `style` (`"expression" | "declaration"`, default: `"expression"`): 함수 선언 방식
- `allowArrowFunctions` (bool, default: `false`): 화살표 함수 허용
- `allowTypeAnnotation` (bool, default: `false`): 타입 어노테이션 있는 함수 허용
- `overrides.namedExports` (`"ignore" | "expression" | "declaration"`, default: `null`): named export에 별도 스타일 적용

**🆗 rule: incorrect (허용)**

```ts
function helperA() {}
const helperB = () => {}
```

**⚠️ rule: correct (노이즈)**

```ts
const helperA = () => {}
const helperB = () => {}
```

## [eslint/id-length](https://oxc.rs/docs/guide/usage/linter/rules/eslint/id-length)

한 글자 식별자 사용을 금지한다. `exceptionPatterns`(허용 패턴), `properties: "never"`(객체 속성 제외) 옵션으로 일부 케이스를 풀 수 있다.

**베스트 프랙티스.** `exceptionPatterns: ["^[A-Z]$"]`로 제너릭을, `properties: "never"`로 외부 API 키를 풀어도 `Array#toSorted`, `reduce` 콜백의 `(a, b)` 같은 표준 라이브러리 컨벤션이 계속 노이즈로 잡혀 규칙 자체를 끈다.

**Configuration**

- `min` (int, default: `2`): 식별자 최소 길이
- `max` (int, default: `Infinity`): 식별자 최대 길이
- `exceptions` (string[], default: `[]`): 허용할 식별자 목록
- `exceptionPatterns` (regex string[], default: 없음): 허용할 식별자 패턴 목록
- `properties` (`"always" | "never"`, default: `"always"`): 프로퍼티명 검사 여부
- `checkGeneric` (bool, default: `true`): TypeScript 제네릭 파라미터명 검사 여부

**🆗 rule: incorrect (허용)**

```ts
items.toSorted((a, b) => a.weight - b.weight)
sum = numbers.reduce((a, b) => a + b, 0)
```

**⚠️ rule: correct (노이즈)**

```ts
items.toSorted((first, second) => first.weight - second.weight)
sum = numbers.reduce((accumulator, value) => accumulator + value, 0)
```

## [eslint/no-continue](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-continue)

`continue` 문 사용을 금지한다.

**베스트 프랙티스.** 가드 패턴은 `continue`가 가장 읽기 쉽고, 중첩 `if`로 풀면 들여쓰기만 늘어난다.

**🆗 rule: incorrect (허용)**

```ts
for (const item of items) {
  if (!item.enabled) continue
  process(item)
}
```

**⚠️ rule: correct (노이즈)**

```ts
for (const item of items) {
  if (item.enabled) {
    process(item)
  }
}
```

## [eslint/no-implicit-coercion](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-implicit-coercion)

`!!x`, `+x`, `"" + x`, `` `${x}` `` 같은 implicit coercion 패턴을 명시적 변환 함수(`Boolean()`, `Number()`, `String()`)로 바꾸도록 강제한다.

**취향.** `!!value`, `+input`, `"" + x` 같은 관용구는 JS 코드베이스에서 충분히 짧고 의도가 명확해, 명시적 함수 호출로 바꾸면 글자 수만 늘 뿐 가독성 이득이 작다.

**Configuration**

- `boolean` (bool, default: `true`): `!!foo` 검사
- `number` (bool, default: `true`): `+foo` 검사
- `string` (bool, default: `true`): `"" + foo` 검사
- `disallowTemplateShorthand` (bool, default: `false`): `` `${foo}` `` 단독 사용 검사
- `allow` (string[], default: `[]`): 허용할 연산자 목록 (`"!!"`, `"~"`, `"+"`, `"-"`, `"- -"`, `"*"`)

**🆗 rule: incorrect (허용)**

```ts
const flag = !!value
const num = +input
```

**⚠️ rule: correct (노이즈)**

```ts
const flag = Boolean(value)
const num = Number(input)
```

## [eslint/no-magic-numbers](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-magic-numbers)

이름 없는 숫자 리터럴(매직 넘버) 사용을 금지하고 의미를 드러내는 상수로 추출하도록 요구한다.

**취향.** 숫자를 다루는 프로젝트에서 자명한 값(`0`, `1`)까지 모두 잡아 노이즈가 폭증하므로 규칙을 끄고, 의미가 강한 큰 숫자는 상수로 추출하는 관용을 본문 정책으로 유지한다.

**Configuration**

- `ignore` (array, default: `[]`): 허용할 숫자 목록
- `ignoreArrayIndexes` (bool, default: `false`): 배열 인덱스 무시
- `ignoreDefaultValues` (bool, default: `false`): 함수 파라미터/구조분해 기본값 무시
- `ignoreClassFieldInitialValues` (bool, default: `false`): 클래스 필드 초기값 무시
- `ignoreReadonlyClassProperties` (bool, default: `false`): readonly 클래스 프로퍼티 무시
- `ignoreEnums` (bool, default: `false`): TypeScript enum 무시
- `ignoreNumericLiteralTypes` (bool, default: `false`): TypeScript 숫자 리터럴 타입 무시
- `ignoreTypeIndexes` (bool, default: `false`): TypeScript 타입 인덱스 무시
- `enforceConst` (bool, default: `false`): const 선언 강제
- `detectObjects` (bool, default: `false`): 객체 프로퍼티 숫자도 검사

**🆗 rule: incorrect (허용)**

```ts
setTimeout(refresh, 86400000)
```

**⚠️ rule: correct (노이즈)**

```ts
const ONE_DAY_MS = 86400000
setTimeout(refresh, ONE_DAY_MS)
```

## [eslint/no-nested-ternary](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-nested-ternary) + [unicorn/no-nested-ternary](https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-nested-ternary)

3항 연산자의 중첩을 금지한다. oxlint에서 두 규칙은 동일 의도다.

**취향.** 중첩 깊이에 따라 가독성 영향이 일정하지 않아 일률 금지가 과도하고, 단순 분기 매핑은 손실이 작고 과도한 중첩은 코드 리뷰에서 판단한다.

**🆗 rule: incorrect (허용)**

```ts
const status = isReady ? "ready" : isLoading ? "loading" : "idle"
```

**⚠️ rule: correct (노이즈)**

```ts
let status
if (isReady) status = "ready"
else if (isLoading) status = "loading"
else status = "idle"
```

## [eslint/no-ternary](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-ternary)

3항 연산자(`a ? b : c`) 사용을 금지한다.

**베스트 프랙티스.** `if/else`로 풀면 더 장황해지고 React JSX 조건부 렌더링에서 3항은 표준 관용구라 이 규칙을 켜는 사례가 거의 없다.

**🆗 rule: incorrect (허용)**

```tsx
const label = isReady ? "Ready" : "Loading"
```

**⚠️ rule: correct (노이즈)**

```tsx
let label
if (isReady) label = "Ready"
else label = "Loading"
```

## [eslint/sort-keys](https://oxc.rs/docs/guide/usage/linter/rules/eslint/sort-keys)

객체 리터럴의 키를 알파벳 순으로 정렬하도록 강제한다.

**취향.** 의미 그룹핑이 알파벳 순보다 가독성이 좋은 경우가 많고 diff 충돌만 늘린다.

**Configuration**

- `order` (`"asc" | "desc"`, default: 없음): 정렬 방향 (위치 인자)
- `caseSensitive` (bool, default: `true`): 대소문자 구분 정렬
- `natural` (bool, default: `false`): 자연어 순서 정렬 (`a2` < `a10`)
- `minKeys` (int, default: `2`): 정렬 강제 최소 프로퍼티 수
- `allowLineSeparatedGroups` (bool, default: `false`): 빈 줄로 구분된 그룹은 독립 정렬

**🆗 rule: incorrect (허용)**

```ts
const config = {
  port: 3000,
  host: "localhost",
}
```

**⚠️ rule: correct (노이즈)**

```ts
const config = {
  host: "localhost",
  port: 3000,
}
```

## [import/exports-last](https://oxc.rs/docs/guide/usage/linter/rules/import/exports-last) + [import/group-exports](https://oxc.rs/docs/guide/usage/linter/rules/import/group-exports)

`export` 문을 파일 끝에 모으거나(`exports-last`) 여러 named export를 한 개의 `export { ... }` 문으로 묶도록(`group-exports`) 강제한다.

**취향.** 선언 위치와 export 위치가 분리되어 가독성이 떨어진다.

**🆗 rule: incorrect (허용)**

```ts
export const a = 1
export const b = 2
```

**⚠️ rule: correct (노이즈)**

```ts
const a = 1
const b = 2
export { a, b }
```

## [jest/prefer-lowercase-title](https://oxc.rs/docs/guide/usage/linter/rules/jest/prefer-lowercase-title) + [vitest/prefer-lowercase-title](https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-lowercase-title)

`describe`/`it`/`test` 제목 첫 글자를 항상 소문자로 강제한다. jest와 vitest 두 규칙은 동일 의도다.

**취향.** 테스트 제목은 한국어 혼용, 고유명사 대문자(`API`, `HTTP`, `GET`), 문장형 표현이 자주 등장해 일률 소문자 강제가 부자연스러우므로 jest 플러그인을 도입했으니 두 규칙 모두 명시적으로 끈다.

**Configuration**

- `ignore` (string[], default: `[]`): 검사 제외 함수 (`describe`, `test`, `it`, `bench`) (jest와 vitest 동일)
- `allowedPrefixes` (string[], default: `[]`): 대문자 시작을 허용할 접두사 목록 (jest와 vitest 동일)
- `ignoreTopLevelDescribe` (bool, default: `false`): 최상위 `describe`는 대문자 허용 (jest와 vitest 동일)
- `lowercaseFirstCharacterOnly` (bool, default: `true`): 첫 글자만 소문자 검사 (jest와 vitest 동일)

**🆗 rule: incorrect (허용)**

```ts
describe("Parses ISO date", () => {})
describe("GET /users", () => {})
```

## [promise/prefer-await-to-callbacks](https://oxc.rs/docs/guide/usage/linter/rules/promise/prefer-await-to-callbacks)

`callback(err, data)` 같은 Node-style 콜백 사용을 금지하고 `async`/`await`을 강제한다.

**베스트 프랙티스.** Firebase SDK, 이벤트 리스너 등 콜백 시그니처가 강제되는 라이브러리에서 false positive가 폭증하고, `promise/prefer-await-to-then`이 이미 Promise 체이닝을 차단해 새 코드는 자연스럽게 `async`/`await`이 되므로 이 규칙까지 강제할 가치가 낮다.

**🆗 rule: incorrect (허용)**

```ts
onAuthStateChanged(auth, (user) => {
  setUser(user)
})
```

## [react/jsx-handler-names](https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-handler-names)

JSX 이벤트 핸들러 prop 이름과 함수 이름이 prefix 컨벤션(`on*` props, `handle*` 함수)을 따르도록 강제한다.

**베스트 프랙티스.** TanStack Query의 `mutate`, store의 `setOpen`, props로 받은 `onChange` 같은 외부 콜백을 그대로 JSX prop에 꽂는 패턴이 흔해, 일률 강제하면 단순 위임 wrapper 함수(`const handleChange = (v) => onChange(v)`)를 의무화해 노이즈가 커진다.

**Configuration**

- `eventHandlerPrefixes` (string, default: `"handle"`): 핸들러 함수 이름 prefix
- `eventHandlerPropPrefixes` (string, default: `"on"`): 핸들러 prop 이름 prefix
- `eventHandlerRegex` (regex string, default: 없음): 핸들러 함수 이름 정규식 (prefix 대신 사용)
- `eventHandlerPropRegex` (regex string, default: 없음): 핸들러 prop 이름 정규식 (prefix 대신 사용)
- `checkLocalVariables` (bool, default: `false`): 지역 변수 핸들러 검사 여부
- `checkInlineFunctions` (bool, default: `false`): 인라인 함수 검사 여부
- `ignoreComponentNames` (string[], default: `[]`): 검사 제외 컴포넌트 목록

**🆗 rule: incorrect (허용)**

```tsx
<TextField onChange={updateName} />
<Modal onClose={refetch} />
```

**⚠️ rule: correct (노이즈)**

```tsx
<TextField onChange={handleNameChange} />
<Modal onClose={handleModalClose} />
```

## [react/jsx-props-no-spreading](https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-props-no-spreading)

JSX의 props spread(`{...props}`) 사용을 금지하고 필요한 props만 명시적으로 전달하도록 강제한다.

**베스트 프랙티스.** 추적성은 향상되지만 wrapper 컴포넌트, HOC, polymorphic 컴포넌트, shadcn/ui처럼 native element를 wrapping하는 디자인 시스템 컴포넌트 같은 정상 패턴까지 막아 장황해진다.

**Configuration**

- `html` (`"enforce" | "ignore"`, default: `"enforce"`): HTML 엘리먼트(`div`, `img` 등) 검사 여부
- `custom` (`"enforce" | "ignore"`, default: `"enforce"`): 커스텀 컴포넌트 검사 여부
- `explicitSpread` (`"enforce" | "ignore"`, default: `"enforce"`): spread 내부의 모든 키가 명시된 경우 검사 여부
- `exceptions` (string[], default: `[]`): 검사 동작을 반전시킬 컴포넌트 목록

**🆗 rule: incorrect (허용)**

```tsx
<Button {...props} />
```

**⚠️ rule: correct (노이즈)**

```tsx
<Button label={props.label} onClick={props.onClick} />
```

## [typescript/consistent-indexed-object-style](https://oxc.rs/docs/guide/usage/linter/rules/typescript/consistent-indexed-object-style)

동적 키 객체 타입을 `Record<K, V>` 또는 `{ [key: K]: V }` 인덱스 시그니처 중 하나로 통일하도록 강제한다. 기본 옵션 `"record"`는 `Record<K, V>`를, `"index-signature"`는 인덱스 시그니처를 강제한다.

**취향.** named 인덱스 시그니처(`{ [userId: string]: number }`)가 키의 도메인 의미를 드러내 원래 `"index-signature"` 강제를 선호했으나, autofix가 의미 있는 이름을 추론하지 못하고 모든 키를 `{ [key: string]: V }`로 변환해 그 이점이 사라지므로, 의미 있는 키 이름은 사람이 직접 붙이도록 규칙을 끈다.

**Configuration**

- `style` (`"record" | "index-signature"`, default: `"record"`): 동적 키 객체 타입 표기 스타일

**🆗 rule: incorrect (허용)**

```ts
type ScoreByUser = Record<string, number>
```

**⚠️ rule: correct (노이즈)**

```ts
type ScoreByUser = { [key: string]: number }
```

## [unicorn/filename-case](https://oxc.rs/docs/guide/usage/linter/rules/unicorn/filename-case)

파일명의 대소문자 규칙(`kebabCase`, `pascalCase` 등)을 일관되게 강제한다.

**베스트 프랙티스.** `main.tsx`, `routes.tsx`, `[id].tsx` 같은 프레임워크/라우팅 컨벤션 예외가 얼마든지 발생할 수 있어 일률 강제가 어렵고, 어떤 case 옵션을 켜도 다른 케이스가 false positive로 잡힌다.

**Configuration**

- `case` (`"kebabCase" | "camelCase" | "snakeCase" | "pascalCase"`, default: `"kebabCase"`): 단일 케이스 강제
- `cases` (object, default: 없음): 복수 케이스 허용 시 개별 boolean 지정 (예: `{ kebabCase: true, pascalCase: true }`)
- `ignore` (regex string, default: 없음): 제외할 파일명 패턴
- `multipleFileExtensions` (bool, default: `true`): 다중 확장자(`.test.ts` 등) 처리 방식

**🆗 rule: incorrect (허용)**

일반 모듈은 kebab-case 컨벤션.

```ts
import x from "./my-module"
```

**🆗 rule: incorrect (허용)**

React 컴포넌트는 PascalCase 컨벤션.

```ts
import Button from "./Button"
```

**🆗 rule: incorrect (허용)**

프레임워크, 라우팅 컨벤션 예외(`main`, `routes` 등).

```ts
import "./main"
import "./routes"
```

## [unicorn/no-null](https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-null)

`null` 사용을 금지하고 `undefined`로 통일하도록 강제한다.

**베스트 프랙티스.** React `return null`은 "렌더링 안 함"의 표준 관용구라 컴포넌트 코드 전반에서 등장하고, JSON/DOM/웹 표준 API의 응답 스펙이 `null`을 포함하므로 외부 경계가 `null`을 강제하는 한 내부만 `undefined`로 통일하려 해도 변환 코드만 늘어난다.

**Configuration**

- `checkStrictEquality` (bool, default: `false`): `===` / `!==` null 비교도 검사

**🆗 rule: incorrect (허용)**

React 컴포넌트의 "렌더링 안 함" 관용구.

```tsx
function Empty() {
  return null
}
```

**🆗 rule: incorrect (허용)**

웹 표준 API가 반환하는 `null`을 직접 비교.

```tsx
const stored = localStorage.getItem("session")
if (stored === null) return defaultSession
```

**⚠️ rule: correct (노이즈)**

```tsx
function Empty() {
  return undefined
}
```

## [unicorn/numeric-separators-style](https://oxc.rs/docs/guide/usage/linter/rules/unicorn/numeric-separators-style)

숫자 리터럴의 `_` 자릿수 separator 스타일(예: `1_000_000`)을 강제한다.

**취향.** `_` 분리는 도움이 되지만 스타일 강제 비중이 의미에 비해 크다.

**Configuration**

- `onlyIfContainsSeparator` (bool, default: `false`): 이미 구분자가 있는 숫자만 검사
- `number` / `binary` / `hexadecimal` / `octal` (object, default: 없음): 각 진수별 `groupLength`, `minimumDigits` 개별 설정

**🆗 rule: incorrect (허용)**

```ts
const big = 1000000
```

**⚠️ rule: correct (노이즈)**

```ts
const big = 1_000_000
```

## [unicorn/prefer-global-this](https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-global-this)

`window`, `self` 같은 환경별 전역 대신 `globalThis` 사용을 강제한다.

**베스트 프랙티스.** 브라우저 코드에서 `window.prompt`/`window.confirm`이 관용적이고 환경 의도를 명확히 표현하는 반면 `globalThis.prompt`는 비관용적이고, universal 모듈에서는 명시적 `typeof window !== "undefined"` 가드가 더 적절하다.

**🆗 rule: incorrect (허용)**

```ts
const name = window.prompt("Name?")
```

**⚠️ rule: correct (노이즈)**

```ts
const name = globalThis.prompt("Name?")
```

## [unicorn/prefer-ternary](https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-ternary)

같은 분기 결과를 변수에 할당하거나 반환하는 단순 `if/else`를 3항 연산자로 바꾸도록 강제한다.

**취향.** 분기 표현은 `if/else` 형태가 더 읽기 좋은 경우가 많고 3항 변환은 자동 수정이 잘못된 위치까지 들어가 의도된 흐름을 뭉개는 경우가 있어, 단순한 매핑은 개발자가 자율적으로 3항을 선택하면 충분하다.

**Configuration**

- `mode` (`"always" | "only-single-line"`, default: `"always"`): `only-single-line`이면 한 줄 분기만 3항 강제

**🆗 rule: incorrect (허용)**

```ts
let label
if (isReady) {
  label = "Ready"
} else {
  label = "Loading"
}
```

## [unicorn/switch-case-braces](https://oxc.rs/docs/guide/usage/linter/rules/unicorn/switch-case-braces)

`switch`의 각 case 절을 항상 중괄호로 감싸 블록 스코프를 명시하도록 강제한다. 기본 옵션 `"always"`는 모든 case에 중괄호를 요구하고, `"avoid"`는 필요할 때만 중괄호를 허용하는 반대 정책으로 동작한다.

**취향.** 단순 case는 중괄호 없는 한 줄 표기가 더 짧고 읽기 쉽고, 중괄호가 실제로 필요한 자리(`let`/`const`로 lexical scope를 새로 여는 패턴)는 `eslint/no-case-declarations`가 이미 차단하므로 이 규칙까지 켜면 의미 없는 중괄호만 늘어난다.

**Configuration**

- `style` (`"always" | "avoid"`, default: `"always"`): `"always"`는 모든 case에 중괄호 강제, `"avoid"`는 필요할 때만 허용

**🆗 rule: incorrect (허용)**

```ts
switch (status) {
  case "ready":
    return start()
  case "idle":
    return wait()
}
```

**⚠️ rule: correct (노이즈)**

```ts
switch (status) {
  case "ready": {
    return start()
  }
  case "idle": {
    return wait()
  }
}
```

## [vitest/prefer-describe-function-title](https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-describe-function-title)

`describe("functionName", ...)`처럼 문자열 제목 대신 함수 참조 `describe(functionName, ...)`를 사용하도록 강제한다.

**취향.** 함수 참조 방식은 리네임 시 자동 동기화 이점이 있지만 테스트 출력 가독성과 일반적인 컨벤션과 어긋나고, 같은 함수에 대해 여러 시나리오를 `describe`로 묶을 때 문자열이 더 자연스럽다.

**🆗 rule: incorrect (허용)**

```ts
import { parseDate } from "./parseDate"

describe("parseDate", () => {
  it("parses ISO", () => {})
})
```

**⚠️ rule: correct (노이즈)**

```ts
import { parseDate } from "./parseDate"

describe(parseDate, () => {
  it("parses ISO", () => {})
})
```

## [vitest/prefer-importing-vitest-globals](https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-importing-vitest-globals)

`describe`, `it`, `expect` 같은 vitest globals를 항상 명시적으로 import 하도록 강제한다.

**베스트 프랙티스.** 이 저장소는 vitest를 `vite-plus/test`에서 재노출해 사용하는데 규칙이 이를 인식하지 못하고 무조건 `from "vitest"`로 import 추가를 시도해 자동 수정이 잘못된 라인을 반복 삽입한다.

**🆗 rule: incorrect (허용)**

```ts
import { describe, expect, it } from "vite-plus/test"

describe("parse", () => {
  it("works", () => expect(true).toBe(true))
})
```

**⚠️ rule: correct (노이즈)**

```ts
import { describe, expect, it } from "vitest"
import { describe, expect, it } from "vite-plus/test"

describe("parse", () => {
  it("works", () => expect(true).toBe(true))
})
```

## [vitest/prefer-to-be-falsy](https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-to-be-falsy) + [vitest/prefer-to-be-truthy](https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-to-be-truthy)

`expect(x).toBe(true)`/`toBe(false)`를 `toBeTruthy()`/`toBeFalsy()`로 바꾸도록 강제하는 동치 규칙 쌍.

**베스트 프랙티스.** `vitest/prefer-strict-boolean-matchers`가 정반대 방향을 강제하므로 두 규칙을 동시에 켜면 자동 수정이 무한 루프에 빠지고, 엄격한 boolean 비교 쪽을 채택했으므로 함께 끈다.

**🆗 rule: incorrect (허용)**

```ts
expect(isReady).toBe(true)
expect(error).toBe(false)
```

**⚠️ rule: correct (노이즈)**

```ts
expect(isReady).toBeTruthy()
expect(error).toBeFalsy()
```
