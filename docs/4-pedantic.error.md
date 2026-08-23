---
title: "Pedantic 채택 규칙"
---

## [eslint/array-callback-return](https://oxc.rs/docs/guide/usage/linter/rules/eslint/array-callback-return)

`Array.prototype.map`/`filter`/`reduce` 같은 콜백에서 `return`을 빠뜨리면 결과가 `undefined`로 채워져 의도와 다른 배열이 만들어진다. 반환값이 필요하면 명시적 `return`을 두고, 부수 효과만 필요하면 `forEach`로 분리한다.

**베스트 프랙티스.** `undefined`로 채워진 배열은 다음 단계에서야 드러나는 까다로운 버그라 정적 검사 가치가 크고, `forEach` 분리를 자연스럽게 유도하는 부수 효과도 있다.

**Configuration**

- `allowImplicit` (bool, default: `false`): `return` 문 없이 암묵적으로 `undefined` 반환 허용
- `allowVoid` (bool, default: `false`): `void` 연산자로 반환값 처리 허용 (`checkForEach`와 함께 사용)
- `checkForEach` (bool, default: `false`): `forEach` 콜백에도 적용

**❌ incorrect**

```ts
const labels = items.map((item) => {
  console.log(item)
})
```

**✅ correct**

```ts
const labels = items.map((item) => {
  console.log(item)
  return item.label
})
```

## [eslint/eqeqeq](https://oxc.rs/docs/guide/usage/linter/rules/eslint/eqeqeq)

`==`는 암묵적 타입 변환으로 비교 결과가 달라질 수 있다. `===`로 엄격 동등 비교를 사용한다.

**베스트 프랙티스.** `==`의 암묵적 변환 규칙은 외우기 어렵고 버그를 만들기 쉬워 항상 `===`이 안전하다.

**Configuration**

- 1번 옵션 (`"always" | "smart"`, default: `"always"`): `"smart"`는 `typeof`/리터럴/nullish 비교에만 `==` 허용
- 2번 옵션 `{ null: "always" | "never" | "ignore" }` (default: `"always"`): `null` 비교 시 `===` 강제 여부

**❌ incorrect**

```ts
if (value == "1") {
  return "loose equality"
}
```

**✅ correct**

```ts
if (value === "1") {
  return "strict equality"
}
```

## [eslint/max-lines](https://oxc.rs/docs/guide/usage/linter/rules/eslint/max-lines)

파일이 길어질수록 책임이 한 모듈에 누적되어 탐색, 리뷰가 어려워진다. 줄 수 상한을 넘으면 책임 단위로 모듈을 분리한다.

**취향.** 기본 상한(`max: 300`)을 유지하되 빈 줄과 주석은 의미 있는 신호가 아니라 두 옵션을 켜 실제 코드 줄 수만 세고, 테스트 파일은 시나리오 누적으로 자연스럽게 길어져 `**/*.test.{ts,tsx}`에서 끈다.

**Configuration**

- `max` (int, default: `300`): 파일 최대 줄 수
- `skipBlankLines` (bool, default: `false`): 빈 줄 계산에서 제외
- `skipComments` (bool, default: `false`): 주석 줄 계산에서 제외

**⚙️ 설정**

```json
{
  "rules": {
    "eslint/max-lines": ["error", { "skipBlankLines": true, "skipComments": true }]
  },
  "overrides": [{ "files": ["**/*.test.{ts,tsx}"], "rules": { "eslint/max-lines": "off" } }]
}
```

**❌ incorrect**

```ts
// foo.ts: 헬퍼, 상수, 컴포넌트가 한 파일에 모임 (수백 줄)
```

**✅ correct**

```ts
// helpers.ts, constants.ts, foo.tsx로 책임 분리
```

## [eslint/max-lines-per-function](https://oxc.rs/docs/guide/usage/linter/rules/eslint/max-lines-per-function)

함수가 길어질수록 책임이 모호해지고 테스트하기 어려워진다. 줄 수 상한을 넘으면 더 작은 함수로 분리한다.

**취향.** 기본값을 `max: 80`으로 완화하고 `**/*.tsx`는 props/hooks/핸들러/JSX 트리 누적을 반영해 `max: 160`으로 더 완화하며, 빈 줄과 주석은 계산에서 제외하고 `**/*.test.{ts,tsx}`는 시나리오 누적으로 끈다.

**Configuration**

- `max` (int, default: `50`): 함수 최대 줄 수
- `skipBlankLines` (bool, default: `false`): 빈 줄 계산에서 제외
- `skipComments` (bool, default: `false`): 주석 줄 계산에서 제외
- `IIFEs` (bool, default: `false`): IIFE도 계산에 포함

**⚙️ 설정**

```json
{
  "rules": {
    "eslint/max-lines-per-function": [
      "error",
      { "max": 80, "skipBlankLines": true, "skipComments": true }
    ]
  },
  "overrides": [
    {
      "files": ["**/*.tsx"],
      "rules": {
        "eslint/max-lines-per-function": [
          "error",
          { "max": 160, "skipBlankLines": true, "skipComments": true }
        ]
      }
    },
    { "files": ["**/*.test.{ts,tsx}"], "rules": { "eslint/max-lines-per-function": "off" } }
  ]
}
```

**❌ incorrect**

```ts
function doEverything() {
  // ...수백 줄...
}
```

**✅ correct**

```ts
function loadData() {
  // ...작은 단위...
}
function transformData() {
  // ...작은 단위...
}
function renderData() {
  // ...작은 단위...
}
```

## [eslint/require-await](https://oxc.rs/docs/guide/usage/linter/rules/eslint/require-await) + [typescript/require-await](https://oxc.rs/docs/guide/usage/linter/rules/typescript/require-await)

`async` 함수 안에 `await`이 없으면 비동기 표시가 의미를 잃고 호출자에 불필요한 Promise를 반환한다. typescript 버전은 타입 정보를 사용해 thenable이 아닌 값에 대한 `await`까지 더 정확히 검사한다.

**베스트 프랙티스.** Oxlint 내장 검사와 TypeScript 플러그인의 타입 인식 검사가 검출하는 경우가 조금 달라 양쪽을 함께 켜 함수 시그니처와 구현을 일치시킨다.

**❌ incorrect**

```ts
async function load() {
  return "value"
}
```

**✅ correct**

```ts
function load() {
  return "value"
}
```

## [import/max-dependencies](https://oxc.rs/docs/guide/usage/linter/rules/import/max-dependencies)

한 모듈이 너무 많은 의존성을 가져오면 응집도가 낮고 변경 영향이 커진다. 의존성 수 상한을 둬 책임 분리나 import 통합을 유도한다.

**취향.** 기본값을 `max: 12`로 조금 완화해 일반 모듈에 적용하고 `**/*.tsx`는 hooks/아이콘/UI primitives/자식 컴포넌트 누적을 반영해 `max: 16`으로 더 완화하며, type import는 빌드 후 사라져 응집도 신호가 아니므로 `ignoreTypeImports: true`로 제외하고 테스트 파일과 TanStack Router의 `__root.tsx`는 끈다.

**Configuration**

- `max` (int, default: `10`): 파일 최대 import 수
- `ignoreTypeImports` (bool, default: `false`): type import 계산에서 제외

**⚙️ 설정**

```json
{
  "rules": {
    "import/max-dependencies": ["error", { "max": 12, "ignoreTypeImports": true }]
  },
  "overrides": [
    {
      "files": ["**/*.tsx"],
      "rules": {
        "import/max-dependencies": ["error", { "max": 16, "ignoreTypeImports": true }]
      }
    },
    { "files": ["**/*.test.{ts,tsx}"], "rules": { "import/max-dependencies": "off" } },
    { "files": ["**/__root.tsx"], "rules": { "import/max-dependencies": "off" } }
  ]
}
```

**❌ incorrect**

```ts
import { a } from "a"
import { b } from "b"
// ...16개 초과의 모듈 import
```

**✅ correct**

```ts
import { core } from "./core"
import { ui } from "./ui"
// 책임 단위로 통합한 import
```

## [typescript/no-confusing-void-expression](https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-confusing-void-expression)

`void` 반환 함수를 값으로 다루는 패턴(`return f()`에서 `f`가 void 반환, 변수 할당 등)은 결과를 쓸 수 없는데 마치 의미 있는 값처럼 보여 혼동을 만든다. 호출과 반환을 분리해 의미를 분명히 한다.

**베스트 프랙티스.** `ignoreArrowShorthand: true`로 단축 화살표를 허용해 React 이벤트 핸들러(`onClick={() => mutate()}`)와 HMR dispose 콜백을 검사에서 제외하고, `ignoreVoidReturningFunctions: true`로 void 반환 핸들러를 다른 핸들러에 위임하는 패턴(`<form onSubmit={(event) => onSubmit(event)}>`)도 허용한다.

**Configuration**

- `ignoreArrowShorthand` (bool, default: `false`): `() => voidFn()` 형태의 화살표 단축 허용
- `ignoreVoidOperator` (bool, default: `false`): `void` 연산자를 두른 표현식 허용
- `ignoreVoidReturningFunctions` (bool, default: `false`): void 반환으로 선언된 함수 호출은 허용

**⚙️ 설정**

```json
{
  "typescript/no-confusing-void-expression": [
    "error",
    { "ignoreArrowShorthand": true, "ignoreVoidReturningFunctions": true }
  ]
}
```

**❌ incorrect**

```ts
function run(action: () => void) {
  return action()
}
```

**✅ correct**

호출과 반환을 분리한 형태.

```ts
function run(action: () => void) {
  action()
}
```

**✅ correct**

`ignoreArrowShorthand`로 단축 화살표는 허용된다.

```ts
const handler = () => mutate()
```

**✅ correct**

`ignoreVoidReturningFunctions`로 void 반환 콜백 호출은 허용된다.

```tsx
function Form({ onSubmit }: { onSubmit: (event: FormEvent) => void }) {
  return <form onSubmit={(event) => onSubmit(event)} />
}
```

## [typescript/no-deprecated](https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-deprecated)

JSDoc `@deprecated`가 붙은 API 참조를 정적으로 검출한다. 에디터의 시각적 표시(취소선)는 무시하기 쉬우므로 규칙으로 강제한다.

**베스트 프랙티스.** 의존성 업그레이드 시 곧 사라질 API를 빠르게 발견해 마이그레이션 누락을 막고, 외부 라이브러리와 자체 코드에서 deprecated로 표시한 API에 동일하게 작용한다.

**Configuration**

- `allow` (array, default: `[]`): 허용할 deprecated 타입/값 지정자 목록 (string, file, lib, package 형식)

**❌ incorrect**

```ts
import { parse } from "node:url"
const parsed = parse("/foo")
```

**✅ correct**

```ts
const parsed = new URL("/foo", "http://example.com")
```

## [typescript/no-misused-promises](https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-misused-promises)

조건문, spread, `void` 반환 컨텍스트(인자, 객체 프로퍼티, 반환, 변수 할당, 상속 메서드 재정의)에 Promise 반환 함수를 넘기는 패턴을 금지한다. JSX 속성 위치는 옵션으로 검사를 끄고 나머지 위치만 검출한다.

**베스트 프랙티스.** `typescript/no-floating-promises`는 직접 호출만 검출하는 반면 이 규칙은 void 컨텍스트의 Promise 전달을 검출해 서로 보완하고, `checksVoidReturn.attributes: false`로 `<form onSubmit={submit}>` 같은 JSX 속성 오탐만 제외하며 나머지 위치(setTimeout 인자, void 변수 할당, 조건문, spread)는 그대로 검출한다.

**Configuration**

- `checksConditionals` (bool, default: `true`): 조건문에서 Promise 사용 검사
- `checksSpreads` (bool, default: `true`): spread 구문에서 Promise 사용 검사
- `checksVoidReturn` (bool | object, default: `true`): void 반환 컨텍스트 검사
- `checksVoidReturn.arguments` (bool, default: `true`): 인자로 전달되는 Promise 반환 함수
- `checksVoidReturn.attributes` (bool, default: `true`): JSX 속성의 Promise 반환 함수
- `checksVoidReturn.inheritedMethods` (bool, default: `true`): void 반환 상속 메서드 재정의
- `checksVoidReturn.properties` (bool, default: `true`): 객체 프로퍼티에 할당된 Promise 반환 함수
- `checksVoidReturn.returns` (bool, default: `true`): void 반환 함수에서 Promise 반환
- `checksVoidReturn.variables` (bool, default: `true`): void 반환 타입 변수 할당

**⚙️ 설정**

```json
{
  "typescript/no-misused-promises": ["error", { "checksVoidReturn": { "attributes": false } }]
}
```

**❌ incorrect**

```ts
async function load() {
  await fetch("/api")
}
setTimeout(load, 100)
```

**✅ correct**

async 함수를 래퍼에서 호출해 fire-and-forget을 명시한다.

```ts
setTimeout(() => {
  void load()
}, 100)
```

**✅ correct**

`checksVoidReturn.attributes: false`로 JSX 속성 위치는 허용된다.

```tsx
async function submit(event: FormEvent) {}
;<form onSubmit={submit}>...</form>
```

## [typescript/no-unsafe-argument](https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-unsafe-argument)

`any` 타입 값을 함수 인자로 전달하면 호출 측의 타입 안전성이 사라진다. 인자를 정확한 타입으로 좁힌 뒤 전달한다.

**베스트 프랙티스.** `any` 값이 호출 경계를 통해 전달되지 않게 해 `no-unsafe-assignment`/`no-unsafe-return`과 함께 타입 안전성 검사 체계를 구성한다.

**❌ incorrect**

```ts
declare const value: any
takeNumber(value)
```

**✅ correct**

```ts
declare const value: number
takeNumber(value)
```

## [typescript/no-unsafe-assignment](https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-unsafe-assignment)

`any` 값을 다른 변수에 할당하면 타입 안전성이 전파되며 사라진다. `unknown`으로 받아 좁히거나 정확한 타입을 사용한다.

**베스트 프랙티스.** `any` 전파의 또 다른 경로를 차단해 `no-explicit-any`/`no-unsafe-argument`/`no-unsafe-member-access`/`no-unsafe-return`과 함께 타입 안전성 검사 체계를 구성한다.

**❌ incorrect**

```ts
declare const value: any
const count: number = value
```

**✅ correct**

```ts
declare const value: unknown
const count: number = typeof value === "number" ? value : 0
```

## [typescript/no-unsafe-return](https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-unsafe-return)

`any` 타입 값을 함수에서 반환하면 호출자가 타입 검증 없이 그 결과를 사용하게 된다. 정확한 타입으로 좁힌 뒤 반환하거나 `unknown`으로 명시한다.

**베스트 프랙티스.** `any` 전파를 반환 경계에서도 차단해 `no-unsafe-argument`/`no-unsafe-assignment`/`no-unsafe-member-access`와 한 묶음으로 작동한다.

**❌ incorrect**

```ts
declare const value: any
function read(): number {
  return value
}
```

**✅ correct**

```ts
declare const value: unknown
function read(): number {
  return typeof value === "number" ? value : 0
}
```

## [typescript/prefer-nullish-coalescing](https://oxc.rs/docs/guide/usage/linter/rules/typescript/prefer-nullish-coalescing)

`||`는 falsy 값(`0`, `""`, `false`)도 기본값으로 대체해 의도와 다른 결과를 낸다. `??`로 nullish(`null`, `undefined`)인 경우에만 기본값을 적용한다.

**베스트 프랙티스.** 개수의 `0`, 입력값의 `""`처럼 falsy지만 유효한 값을 다룰 때 `||`의 단축 평가가 만드는 미묘한 버그를 막는다.

**Configuration**

- `ignoreBooleanCoercion` (bool, default: `false`): `Boolean()` 인자 안의 `||` 허용
- `ignoreConditionalTests` (bool, default: `true`): 조건 테스트 위치의 `||` 허용
- `ignoreIfStatements` (bool, default: `false`): `??`로 단순화 가능한 `if` 문 허용
- `ignoreMixedLogicalExpressions` (bool, default: `false`): `&&`와 섞인 `||` 표현식 허용
- `ignorePrimitives` (object | bool, default: `false`): nullable과 결합한 특정 원시 타입 검사 제외 (`bigint`/`boolean`/`number`/`string`)
- `ignoreTernaryTests` (bool, default: `false`): `??`로 단순화 가능한 삼항식 허용

**❌ incorrect**

```ts
const display = value || "default"
```

**✅ correct**

```ts
const display = value ?? "default"
```

## [typescript/switch-exhaustiveness-check](https://oxc.rs/docs/guide/usage/linter/rules/typescript/switch-exhaustiveness-check)

union/enum을 분기하는 `switch`에서 일부 멤버를 빠뜨리면 누락된 값을 처리하지 않은 채 런타임까지 검출하지 못한다. 모든 멤버에 대한 `case`를 두거나 `default`에 `const _exhaustive: never = value` 패턴을 둬 컴파일 타임에 누락을 검출한다.

**베스트 프랙티스.** TypeScript는 union/enum 멤버가 추가될 때 기존 `switch`가 갱신됐는지 자체 검사하지 않는데, 이 규칙이 해당 검사를 보완해 멤버 확장 시 누락된 분기를 빌드 단계에서 검출한다.

**Configuration**

- `allowDefaultCaseForExhaustiveSwitch` (bool, default: `true`): 모든 멤버를 다룬 exhaustive `switch`에 `default`를 두는 것 허용
- `considerDefaultExhaustiveForUnions` (bool, default: `false`): union에서 `default` 케이스를 exhaustiveness 충족으로 간주
- `defaultCaseCommentPattern` (string, default: 없음): `default` 블록의 주석과 매치되면 검사 생략
- `requireDefaultForNonUnion` (bool, default: `false`): union이 아닌 `switch`에도 `default` 필수화

**❌ incorrect**

```ts
type Status = "pending" | "approved" | "rejected"

function label(status: Status) {
  switch (status) {
    case "pending":
      return "Pending"
    case "approved":
      return "Approved"
  }
}
```

**✅ correct**

```ts
function label(status: Status) {
  switch (status) {
    case "pending":
      return "Pending"
    case "approved":
      return "Approved"
    case "rejected":
      return "Rejected"
  }
}
```

## [unicorn/escape-case](https://oxc.rs/docs/guide/usage/linter/rules/unicorn/escape-case)

문자열의 hex(`\xa9`)와 unicode(`\ud834`) 이스케이프 시퀀스에서 hex 자릿수가 소문자면 식별자와 시각적으로 섞여 읽기 어렵다. hex 자릿수를 모두 대문자로 통일한다.

**취향.** 이스케이프 값이 주변 식별자/문자열과 분명히 구분되어 가독성이 올라가고 자동 수정으로 해결되는 가벼운 규칙이라 노이즈 부담이 거의 없다.

**❌ incorrect**

```ts
const copyright = "\xa9"
const registered = "\xae"
```

**✅ correct**

```ts
const copyright = "\xA9"
const registered = "\xAE"
```

## [unicorn/new-for-builtins](https://oxc.rs/docs/guide/usage/linter/rules/unicorn/new-for-builtins)

`Date`/`Map`/`Set` 같은 내장 생성자는 `new` 없이 호출하면 의도와 다른 값(예: `Date()`는 현재 시각 문자열)을 반환하고, 반대로 `String`/`Number`/`Boolean`에 `new`를 붙이면 원시 값이 아닌 래퍼 객체가 만들어져 `typeof`나 동등 비교 결과가 달라진다.

**베스트 프랙티스.** 호출 형태만 다른데 동작이 완전히 달라지는 패턴은 거의 의도된 사용이 없는 명백한 버그라 오탐 부담이 적어 pedantic 기본값인 `warn`에서 `error`로 승격한다.

**❌ incorrect**

```ts
const now = Date()
const wrapped = new String(value)
```

**✅ correct**

```ts
const now = new Date()
const text = String(value)
```

## [unicorn/no-array-callback-reference](https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-array-callback-reference)

`arr.map(fn)`처럼 콜백을 직접 참조하면 함수의 추가 인자(`index`, `array`)까지 전달되어 버그를 만들 수 있다. `arr.map(value => fn(value))`로 호출 시점을 분리한다.

**베스트 프랙티스.** 추가 인자가 전달되는 문제를 막지만 정상 사용에서도 람다를 강제해 코드가 조금 길어진다.

**❌ incorrect**

```ts
const sanitized = inputs.map(sanitize)
```

**✅ correct**

```ts
const sanitized = inputs.map((value) => sanitize(value))
```

## [unicorn/no-useless-undefined](https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-useless-undefined)

함수 호출이나 `return`에서 명시적 `undefined`는 대부분 불필요하다. 인자나 반환값을 생략한다.

**취향.** 코드 노이즈를 줄여주지만 명시적 `undefined`가 의도 표현으로 필요한 경우도 있다.

**Configuration**

- `checkArguments` (bool, default: `true`): 함수 인자로 넘기는 불필요한 `undefined` 검사
- `checkArrowFunctionBody` (bool, default: `true`): 화살표 함수 본문의 불필요한 `undefined` 검사

**❌ incorrect**

```ts
return undefined
```

**✅ correct**

```ts
return
```

## [unicorn/prefer-number-coercion](https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-number-coercion)

`parseFloat()`와 기수 10의 `parseInt()`는 숫자 접두어만 파싱하고 뒤따르는 텍스트를 조용히 무시한다. 입력 전체를 파싱하는 `Number()`로 강제 변환 의도를 정확히 표현한다.

**베스트 프랙티스.** `Number.parseInt("12px", 10)`은 `12`를 반환해 비정상 입력을 조용히 통과시키지만 `Number("12px")`는 `NaN`으로 실패해 문제를 드러낸다. 접두어 파싱이 의도인 기수 10 이외의 `parseInt`는 검출하지 않는다.

**❌ incorrect**

```ts
const ratio = Number.parseFloat(input)
const count = Number.parseInt(input, 10)
```

**✅ correct**

```ts
const ratio = Number(input)
const count = Math.trunc(Number(input))
```

## [unicorn/prefer-query-selector](https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-query-selector)

`getElementById`, `getElementsByClassName`은 단편적이다. 통일된 셀렉터 표현인 `querySelector`/`querySelectorAll`을 사용한다.

**취향.** 셀렉터 표현이 일관되어 인지 비용이 줄어든다.

**❌ incorrect**

```ts
const node = document.getElementById("root")
```

**✅ correct**

```ts
const node = document.querySelector("#root")
```

## [unicorn/prefer-string-replace-all](https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-string-replace-all)

`String#replace`에 전역 정규식(`/g`)으로 일치하는 모든 부분을 바꾸는 패턴은 의도를 바로 파악하기 어렵다. ES2021의 `String#replaceAll`을 사용해 "전체 치환" 의도를 직접 표현한다.

**베스트 프랙티스.** `replaceAll`은 문자열 인자도 허용해 정규식 이스케이프가 필요하지 않고, 정규식 사용 시 전역 플래그가 없는 패턴은 런타임 오류로 명확하게 거부된다.

**❌ incorrect**

```ts
const cleaned = input.replace(/-/g, "_")
```

**✅ correct**

```ts
const cleaned = input.replaceAll("-", "_")
```

## [unicorn/prefer-top-level-await](https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-top-level-await)

모듈 최상위에서 즉시 실행 async IIFE나 `promise.catch()` 체인으로 비동기를 시작하는 패턴은 의도를 감추고 오류 처리를 우회한다. ES2022 top-level await으로 직접 실행하고 일반 `try/catch`로 오류를 다룬다.

**베스트 프랙티스.** Vite는 ESM 환경을 보장해 top-level await을 그대로 쓸 수 있고, IIFE 래퍼와 then/catch 체인이 사라져 모듈 초기화 코드의 흐름이 동기 코드처럼 읽힌다.

**❌ incorrect**

```ts
;(async () => {
  await run()
})()
```

**✅ correct**

```ts
await run()
```
