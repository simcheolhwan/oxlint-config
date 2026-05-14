---
title: "TanStack 규칙 비교 (draft)"
---

## 1. 이미 설정함

- `eslint/no-shadow` (warn) → `docs/2-suspicious.error.md` (TanStack은 warn, 본 저장소는 error로 승격)
- `import/consistent-type-specifier-style` → `docs/5-style.error.md`
- `typescript/array-type` → `docs/5-style.error.md`
- `typescript/require-await` (warn) → `docs/4-pedantic.error.md` (eslint/require-await와 묶어 error 승격)

## 2. 이미 설정함(draft)

- `import/no-commonjs` → `docs/6-restriction.error.draft.md` (error 채택 후보)
- `typescript/no-inferrable-types` → `docs/5-style.off.draft.md` (off 후보, TanStack은 error)
- `typescript/prefer-for-of` (warn) → `docs/5-style.error.draft.md` (error 후보)

## 새로운 발견: 추천

명백한 버그 패턴을 잡고 false positive가 거의 없어 즉시 채택할 가치가 큰 규칙.

### [eslint/no-invalid-regexp](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-invalid-regexp)

`RegExp` 생성자에 잘못된 패턴이 들어가는 것을 잡는다.

**베스트 프랙티스.** 런타임 에러로 직결되는 명백한 버그라 false positive가 거의 없다.

**Configuration**

- `allowConstructorFlags` (`string[]`, default: `[]`): 허용할 플래그를 케이스 민감 배열로 지정.

**❌ incorrect**

```ts
new RegExp("[")
```

**✅ correct**

```ts
new RegExp("\\[")
```

### [eslint/no-unsafe-optional-chaining](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-unsafe-optional-chaining)

`(obj?.foo)()`처럼 optional chain 결과를 즉시 호출/연산해 런타임 에러로 이어지는 패턴을 잡는다.

**베스트 프랙티스.** optional chain의 안전성을 우회하는 명백한 안티패턴이라 즉시 채택할 가치가 큰 추천 규칙이다.

**Configuration**

- `disallowArithmeticOperators` (`boolean`, default: `false`): optional chain 결과에 대한 산술 연산(`?.x + 1` 등) 추가 검사 여부.

**❌ incorrect**

```ts
const result = (obj?.foo)()
const length = (arr?.[0]).length
```

**✅ correct**

```ts
const result = obj?.foo?.()
const length = arr?.[0]?.length
```

### [eslint/no-unsafe-finally](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-unsafe-finally)

`finally` 블록 안에서 `return`/`throw`/`break`로 흐름을 가로채는 패턴을 잡는다.

**베스트 프랙티스.** 원본 예외/반환값을 삼키는 미묘한 버그를 막는 추천 규칙이다.

**❌ incorrect**

```ts
function load() {
  try {
    return 1
  } finally {
    return 2
  }
}
```

**✅ correct**

```ts
function load() {
  try {
    return 1
  } finally {
    cleanup()
  }
}
```

### [eslint/no-async-promise-executor](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-async-promise-executor)

`new Promise(async (resolve) => ...)`처럼 async executor를 금지한다.

**베스트 프랙티스.** async executor 안의 에러가 삼켜져 unhandled rejection이 발생하지 않는 함정이라 명백한 안티패턴이다.

**❌ incorrect**

```ts
new Promise(async (resolve, reject) => {
  const value = await fetchValue()
  resolve(value)
})
```

**✅ correct**

```ts
new Promise((resolve, reject) => {
  fetchValue().then(resolve, reject)
})
```

### [eslint/for-direction](https://oxc.rs/docs/guide/usage/linter/rules/eslint/for-direction)

for문 카운터가 종료 조건과 반대 방향으로 진행하는 무한 루프를 잡는다.

**베스트 프랙티스.** 명백한 무한 루프 버그를 컴파일 타임에 차단하고 false positive가 거의 없다.

**❌ incorrect**

```ts
for (let i = 0; i < 10; i--) {
  doWork(i)
}
```

**✅ correct**

```ts
for (let i = 0; i < 10; i++) {
  doWork(i)
}
```

### [eslint/no-cond-assign](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-cond-assign)

`if (x = 1)` 같은 조건문 안 할당 (`==` 오타) 버그를 잡는다.

**베스트 프랙티스.** `vp fmt`가 조건문 안 할당을 자동으로 `((...))`로 감싸기 때문에 default `"except-parens"`로는 발화하지 않으므로 본 저장소에서는 `"always"` 설정으로 채택해야 의미가 있다.

**Configuration**

- `"except-parens" | "always"` (string, default: `"except-parens"`): `"except-parens"`는 괄호로 감싼 할당만 허용, `"always"`는 모든 조건문 안 할당을 금지. 본 저장소 채택 시 `"always"` 권장.

**❌ incorrect**

```ts
let user
if ((user = getUser())) {
  render(user)
}
```

**✅ correct**

```ts
const user = getUser()
if (user) {
  render(user)
}
```

### [eslint/no-constant-binary-expression](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-constant-binary-expression)

항상 같은 결과를 내는 이항 표현식(`a || true`)을 잡는다.

**베스트 프랙티스.** 연산자 우선순위 실수나 리팩토링 잔여물을 노출하고 의도된 코드일 확률이 거의 0이다.

**❌ incorrect**

```ts
const result = a || true
const x = !object ?? defaultValue
```

**✅ correct**

```ts
const result = a || defaultValue
const x = object ?? defaultValue
```

### [eslint/no-constant-condition](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-constant-condition)

`if (true)`, `while (1)` 같은 상수 조건문을 잡는다.

**베스트 프랙티스.** 디버깅 코드나 리팩토링 잔여물을 검출하고, 기본값(`allExceptWhileTrue`)이 의도적 무한 루프는 허용해 noise가 적다.

**Configuration**

- `checkLoops` (`"all" | "allExceptWhileTrue" | "none"`, default: `"allExceptWhileTrue"`): 루프 안 상수 조건 검사 범위. `"allExceptWhileTrue"`는 `while (true)`만 허용, `"all"`은 전부 금지, `"none"`은 검사 안 함.

**❌ incorrect**

```ts
if (true) {
  doThing()
}
while (1) {
  poll()
}
```

**✅ correct**

```ts
if (condition) {
  doThing()
}
while (running) {
  poll()
}
```

### [eslint/no-dupe-else-if](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-dupe-else-if)

`else if` 체인에서 중복된 조건을 잡는다 (절대 진입 불가).

**베스트 프랙티스.** 복붙, 리팩토링 실수로 생기는 죽은 코드를 즉시 노출하고 의도적인 경우가 없다.

**❌ incorrect**

```ts
if (status === "ready") {
  start()
} else if (status === "ready") {
  warn()
}
```

**✅ correct**

```ts
if (status === "ready") {
  start()
} else if (status === "idle") {
  warn()
}
```

### [eslint/no-duplicate-case](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-duplicate-case)

`switch`에서 중복된 `case`를 잡는다 (절대 진입 불가).

**베스트 프랙티스.** `no-dupe-else-if`의 switch판이라 죽은 분기를 즉시 노출한다.

**❌ incorrect**

```ts
switch (status) {
  case "ready":
    return start()
  case "ready":
    return warn()
}
```

**✅ correct**

```ts
switch (status) {
  case "ready":
    return start()
  case "idle":
    return warn()
}
```

### [eslint/no-fallthrough](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-fallthrough)

`break`/`return` 없이 다음 `case`로 흘러가는 실수를 잡는다.

**베스트 프랙티스.** 명백한 버그 패턴이고 의도된 fallthrough는 주석으로 표시해 풀 수 있다.

**Configuration**

- `allowEmptyCase` (`boolean`, default: `false`): 비어 있는 case가 다음 case로 흐르는 것을 허용.
- `commentPattern` (`string`, default: 없음): 의도된 fallthrough를 표시하는 주석의 정규식 패턴. 미지정 시 빌트인 `/falls?\s?through/i`로 매칭하며, 지정 시 그 값으로 override한다.
- `reportUnusedFallthroughComment` (`boolean`, default: `false`): 실제 fallthrough가 없는데 주석만 있는 경우 보고.

**❌ incorrect**

```ts
switch (status) {
  case "ready":
    doReady()
  case "idle":
    doIdle()
    break
}
```

**✅ correct**

```ts
switch (status) {
  case "ready":
    doReady()
    break
  case "idle":
    doIdle()
    break
}
```

### [eslint/no-sparse-arrays](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-sparse-arrays)

`[1, , 3]`처럼 빈 슬롯 있는 배열 리터럴을 잡는다.

**베스트 프랙티스.** 거의 항상 콤마 오타이고, 의도적이라면 `undefined`를 명시하는 편이 명확하다.

**❌ incorrect**

```ts
const items = [1, , 3]
```

**✅ correct**

```ts
const items = [1, undefined, 3]
```

### [eslint/no-ex-assign](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-ex-assign)

`catch (e) { e = ... }`처럼 catch 변수 재할당을 금지한다.

**베스트 프랙티스.** 원본 에러 정보를 잃는 안티패턴이고 `Error.cause`로 컨텍스트를 보존하는 편이 안전하다.

**❌ incorrect**

```ts
try {
  doWork()
} catch (caughtError) {
  caughtError = new Error("oops")
}
```

**✅ correct**

```ts
try {
  doWork()
} catch (caughtError) {
  throw new Error("oops", { cause: caughtError })
}
```

### [eslint/no-self-assign](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-self-assign)

`x = x` 같은 자기 자신 할당 (무의미한 코드)을 잡는다.

**베스트 프랙티스.** 리팩토링 잔여물, 복붙 실수를 검출하고 의도된 경우가 거의 없다.

**Configuration**

- `props` (`boolean`, default: `true`): 프로퍼티 자가 할당(`obj.a = obj.a`)도 검사할지 여부. `false`면 객체 프로퍼티 자가 할당은 통과.

**❌ incorrect**

```ts
foo = foo
state.value = state.value
```

**✅ correct**

```ts
foo = bar
state.value = nextValue
```

### [eslint/no-class-assign](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-class-assign)

`class Foo {}` 선언 후 `Foo = ...`로 덮어쓰는 패턴을 금지한다.

**베스트 프랙티스.** 클래스 선언을 우연히 덮어써 런타임에 깨지는 함정이고 의도된 경우가 없다.

**❌ incorrect**

```ts
class Foo {}
Foo = "bar"
```

**✅ correct**

```ts
class Foo {}
const FooAlias = Foo
```

### [eslint/no-global-assign](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-global-assign)

`window`, `Object` 같은 전역 식별자 재할당을 금지한다.

**베스트 프랙티스.** 전역을 망가뜨려 추적이 어려운 버그를 만들고, 폴리필 등 특수 케이스만 `exceptions`로 풀면 충분하다.

**Configuration**

- `exceptions` (`string[]`, default: `[]`): 규칙에서 제외할 전역 변수 이름 목록.

**❌ incorrect**

```ts
window = {}
Object = null
```

**✅ correct**

```ts
const myWindow = {}
```

### [eslint/no-shadow-restricted-names](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-shadow-restricted-names)

`undefined`, `NaN`, `Infinity` 같은 예약 식별자 섀도잉을 금지한다.

**베스트 프랙티스.** 언어 차원의 함정을 만드는 안티패턴이라 명확한 이름으로 대체한다.

**Configuration**

- `reportGlobalThis` (`boolean`, default: `true`): `globalThis` 재정의를 보고할지 여부.

**❌ incorrect**

```ts
function undefined() {}
const NaN = 1
```

**✅ correct**

```ts
function noOp() {}
const notANumber = 1
```

### [eslint/no-delete-var](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-delete-var)

변수에 `delete`를 적용하는 패턴(`delete x`)을 금지한다.

**베스트 프랙티스.** strict mode 위반이고 `delete`는 객체 프로퍼티 전용이라 변수 해제는 의미가 없다.

**❌ incorrect**

```ts
let value = 1
delete value
```

**✅ correct**

```ts
let value: number | undefined = 1
value = undefined
```

### [eslint/no-with](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-with)

`with` 문 사용을 금지한다.

**베스트 프랙티스.** strict mode 위반이고 스코프 모호성으로 유지보수가 악화되며 모던 코드에선 쓸 일이 없다.

**❌ incorrect**

```ts
with (Math) {
  console.log(PI)
}
```

**✅ correct**

```ts
console.log(Math.PI)
```

### [eslint/no-compare-neg-zero](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-compare-neg-zero)

`x === -0` 같은 음의 0과의 비교를 금지한다.

**베스트 프랙티스.** `+0 === -0`이라 항상 true이고, 의도된 비교는 `Object.is`로 명시한다.

**❌ incorrect**

```ts
if (value === -0) {
  handleNegativeZero()
}
```

**✅ correct**

```ts
if (Object.is(value, -0)) {
  handleNegativeZero()
}
```

### [eslint/use-isnan](https://oxc.rs/docs/guide/usage/linter/rules/eslint/use-isnan)

`x === NaN`(항상 false) 대신 `Number.isNaN(x)`를 강제한다.

**베스트 프랙티스.** 명백한 비교 함정이라 의도된 코드일 확률이 없다.

**Configuration**

- `enforceForIndexOf` (`boolean`, default: `false`): `indexOf`/`lastIndexOf` 인수로 `NaN`을 금지할지 여부.
- `enforceForSwitchCase` (`boolean`, default: `true`): `switch` 분기 식, `case`로 `NaN`을 금지할지 여부.

**❌ incorrect**

```ts
if (value === NaN) {
  reject()
}
```

**✅ correct**

```ts
if (Number.isNaN(value)) {
  reject()
}
```

### [eslint/valid-typeof](https://oxc.rs/docs/guide/usage/linter/rules/eslint/valid-typeof)

`typeof x === "strnig"` 같은 오타 비교를 잡는다.

**베스트 프랙티스.** `typeof`는 결과 문자열이 제한적이라 오타가 곧 죽은 코드라 즉시 채택 가치가 크다.

**Configuration**

- `requireStringLiterals` (`boolean`, default: `false`): `typeof` 비교 대상으로 문자열 리터럴이나 다른 `typeof` 표현식만 허용.

**❌ incorrect**

```ts
if (typeof value === "strnig") {
  doWork()
}
```

**✅ correct**

```ts
if (typeof value === "string") {
  doWork()
}
```

### [eslint/no-loss-of-precision](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-loss-of-precision)

JavaScript number가 정밀하게 표현하지 못하는 큰 숫자 리터럴을 잡는다.

**베스트 프랙티스.** 은밀한 데이터 손실을 컴파일 타임에 노출하고 큰 숫자는 `BigInt`로 명시한다.

**❌ incorrect**

```ts
const big = 9007199254740993
```

**✅ correct**

```ts
const big = 9007199254740992n
```

### [eslint/no-empty-character-class](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-empty-character-class)

정규식의 빈 문자 클래스 `[]`를 잡는다.

**베스트 프랙티스.** 빈 클래스는 아무것도 매칭하지 않아 패턴 전체를 망가뜨리므로 명백한 실수다.

**❌ incorrect**

```ts
const pattern = /^abc[]/
```

**✅ correct**

```ts
const pattern = /^abc/
```

### [eslint/no-misleading-character-class](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-misleading-character-class)

서로게이트 페어 등 단일 문자처럼 보이는 다중 코드포인트를 문자 클래스에 넣는 실수를 잡는다.

**베스트 프랙티스.** 이모지, 결합 문자 처리에서 미묘한 매칭 버그를 막고 `u` 플래그 사용을 유도한다.

**Configuration**

- `allowEscape` (`boolean`, default: `false`): 이스케이프 시퀀스로 작성된 다중 코드포인트는 문자 클래스에서 허용.

**❌ incorrect**

```ts
const pattern = /^[🎉]$/
```

**✅ correct**

```ts
const pattern = /^🎉$/u
```

### [eslint/no-useless-backreference](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-useless-backreference)

절대 일치할 수 없는 정규식 backreference를 잡는다.

**베스트 프랙티스.** 복잡한 정규식의 설계 실수를 컴파일 타임에 노출한다.

**❌ incorrect**

```ts
const pattern = /^(?:(a)|\1b)$/
```

**✅ correct**

```ts
const pattern = /^(?:(a)\1|b)$/
```

### [eslint/no-nonoctal-decimal-escape](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-nonoctal-decimal-escape)

문자열 리터럴에서 `\8`, `\9` 같은 비-팔진 십진 이스케이프를 금지한다.

**베스트 프랙티스.** 런타임 의미가 모호한 레거시 패턴이라 일반 문자나 명시적 이스케이프로 대체한다.

**❌ incorrect**

```ts
const value = "\8"
```

**✅ correct**

```ts
const value = "8"
const escaped = "\\8"
```

### [eslint/no-empty-pattern](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-empty-pattern)

빈 destructuring 패턴(`const {} = obj`)을 잡는다.

**베스트 프랙티스.** 의도 없는 코드 혹은 작성 미완성을 검출하고, 함수 파라미터의 빈 객체 기본값 패턴은 옵션으로 풀 수 있다.

**Configuration**

- `allowObjectPatternsAsParameters` (`boolean`, default: `false`): 함수 파라미터에서 빈 객체 패턴(`function fn({})`, 기본값 `{} = {}` 포함)을 허용.

**❌ incorrect**

```ts
const {} = obj
function fn({}: Options) {}
```

**✅ correct**

```ts
const { value } = obj
function fn({ value }: Options) {}
```

### [typescript/no-duplicate-enum-values](https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-duplicate-enum-values)

같은 enum 안에서 중복된 값을 가진 멤버를 잡는다.

**베스트 프랙티스.** reverse mapping 깨짐과 논리 충돌을 미연에 방지하고 의도된 경우가 거의 없다.

**❌ incorrect**

```ts
enum Status {
  Ready = 1,
  Idle = 1,
}
```

**✅ correct**

```ts
enum Status {
  Ready = 1,
  Idle = 2,
}
```

### [typescript/no-misused-new](https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-misused-new)

interface/class에서 잘못 사용된 `new` 시그니처/`constructor` 정의를 잡는다.

**베스트 프랙티스.** constructor 의도를 모호하게 만드는 안티패턴이라 constructor 시그니처와 인스턴스 타입을 명확히 분리한다.

**❌ incorrect**

```ts
interface User {
  new (): User
}
class Counter {
  new(): Counter
}
```

**✅ correct**

```ts
interface UserConstructor {
  new (): User
}
class Counter {
  constructor() {}
}
```

### [typescript/no-non-null-asserted-optional-chain](https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-non-null-asserted-optional-chain)

`x?.y!`처럼 optional chain 결과에 non-null assertion을 붙이는 모순 패턴을 잡는다.

**베스트 프랙티스.** optional chain의 안전성을 무력화하는 안전한 접근과 강제 단언의 충돌이다.

**❌ incorrect**

```ts
const id = user?.profile!.id
```

**✅ correct**

```ts
const id = user?.profile?.id
```

### [typescript/no-for-in-array](https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-for-in-array)

배열에 `for...in`을 사용하는 패턴을 잡는다.

**베스트 프랙티스.** 인덱스가 문자열로 순회되고 프로토타입 체인 프로퍼티가 포함될 위험이 있어 배열은 `for...of`가 정답이다.

**❌ incorrect**

```ts
const items = [1, 2, 3]
for (const index in items) {
  console.log(items[index])
}
```

**✅ correct**

```ts
const items = [1, 2, 3]
for (const item of items) {
  console.log(item)
}
```

### [typescript/no-extra-non-null-assertion](https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-extra-non-null-assertion)

`x!!`처럼 중복된 `!` non-null assertion을 잡는다.

**베스트 프랙티스.** 명백한 잉여 코드라 의도된 경우가 없다.

**❌ incorrect**

```ts
const id = user!!.id
```

**✅ correct**

```ts
const id = user!.id
```

### [typescript/no-unsafe-function-type](https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-unsafe-function-type)

광범위한 `Function` 타입 사용을 금지한다.

**베스트 프랙티스.** `Function`은 호출 시그니처를 검사하지 않아 `any` 수준의 안전성이라 명시적 시그니처로 대체한다.

**❌ incorrect**

```ts
function call(fn: Function) {
  fn()
}
```

**✅ correct**

```ts
function call(fn: () => void) {
  fn()
}
```

### [typescript/no-wrapper-object-types](https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-wrapper-object-types)

`BigInt`, `Boolean`, `Number`, `String`, `Symbol`, `Object` 6종 wrapper 객체 타입 사용을 금지한다.

**베스트 프랙티스.** 원시 타입과 비호환이고 혼동을 야기하므로 소문자 원시 타입(`string`, `number`)이 정답이다.

**❌ incorrect**

```ts
let name: String = "guest"
let count: Number = 0
```

**✅ correct**

```ts
let name: string = "guest"
let count: number = 0
```

## 새로운 발견: 권장

베스트 프랙티스로 채택할 가치가 크지만 옵션 검토나 일부 트레이드오프 확인이 필요한 규칙.

### [eslint/no-var](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-var)

`var` 선언을 금지하고 `let`/`const` 사용을 강제한다.

**베스트 프랙티스.** 모던 JS의 사실상 표준이고 함수 스코프, 호이스팅 함정을 제거한다.

**❌ incorrect**

```ts
var value = 1
```

**✅ correct**

```ts
const value = 1
```

### [eslint/prefer-const](https://oxc.rs/docs/guide/usage/linter/rules/eslint/prefer-const)

재할당이 없는 `let`을 `const`로 바꾸도록 강제한다.

**베스트 프랙티스.** 불변 의도를 변수 선언으로 표현해 가독성을 향상시키고 재할당 실수를 방지한다.

**Configuration**

- `destructuring` (`"any" | "all"`, default: `"any"`): 분해 할당 처리 방식. `"any"`는 일부 변수만 `const`여도 보고, `"all"`은 모두 `const`여야 할 때만 보고.
- `ignoreReadBeforeAssign` (`boolean`, default: `false`): 초기 할당 전에 읽힌 변수는 무시.

**❌ incorrect**

```ts
let value = 1
console.log(value)
```

**✅ correct**

```ts
const value = 1
console.log(value)
```

### [eslint/no-debugger](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-debugger)

운영 코드에 남은 `debugger` 문을 잡는다.

**베스트 프랙티스.** PR 머지 사고 방지를 위해 의도된 디버깅은 PR 전에 제거한다.

**❌ incorrect**

```ts
function process(input: string) {
  debugger
  return parse(input)
}
```

**✅ correct**

```ts
function process(input: string) {
  return parse(input)
}
```

### [eslint/no-case-declarations](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-case-declarations)

`switch case`에서 중괄호 없이 `let`/`const`/`function`/`class` 선언을 금지한다.

**베스트 프랙티스.** case 사이 스코프 누수와 호이스팅 함정을 방지하기 위해 중괄호로 명시적 블록을 강제한다.

**❌ incorrect**

```ts
switch (status) {
  case "ready":
    const message = "ready"
    return message
}
```

**✅ correct**

```ts
switch (status) {
  case "ready": {
    const message = "ready"
    return message
  }
}
```

### [eslint/require-yield](https://oxc.rs/docs/guide/usage/linter/rules/eslint/require-yield)

`function*` 안에 `yield`가 없는 잉여 generator를 잡는다.

**베스트 프랙티스.** 잘못된 `*` 표시로 generator 의도가 모호해지므로 yield가 없다면 일반 함수가 옳다.

**❌ incorrect**

```ts
function* generator() {
  return 1
}
```

**✅ correct**

```ts
function* generator() {
  yield 1
}
```

### [eslint/no-useless-catch](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-useless-catch)

`catch (e) { throw e }`처럼 단순 재던지기만 하는 try-catch를 잡는다.

**베스트 프랙티스.** 이미 채택한 `eslint/preserve-caught-error`와 보완해 try-catch가 실제로 무엇을 하는지 강제로 명시한다.

**❌ incorrect**

```ts
try {
  doWork()
} catch (caughtError) {
  throw caughtError
}
```

**✅ correct**

```ts
try {
  doWork()
} catch (caughtError) {
  log(caughtError)
  throw caughtError
}
```

### [eslint/no-extra-boolean-cast](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-extra-boolean-cast)

이미 boolean 컨텍스트인 곳의 `!!`, `Boolean()` 중복 변환을 잡는다.

**베스트 프랙티스.** 가독성을 해치는 잉여 코드를 제거한다.

**Configuration**

- `enforceForInnerExpressions` (`boolean`, default: `false`): 불리언 컨텍스트로 사용되는 내부 표현식까지 검사 확장.

**❌ incorrect**

```ts
if (!!ready) {
  start()
}
const flag = Boolean(!!ready)
```

**✅ correct**

```ts
if (ready) {
  start()
}
const flag = Boolean(ready)
```

### [eslint/no-useless-escape](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-useless-escape)

의미 없는 이스케이프(`"\a"`, `/\h/`)를 잡는다.

**베스트 프랙티스.** 가독성을 위한 자동 수정 가능 규칙이고 의도된 이스케이프가 아니면 잉여다.

**Configuration**

- `allowRegexCharacters` (`string[]`, default: `[]`): 정규식 안에서 불필요한 이스케이프를 허용할 단일 문자 목록.

**❌ incorrect**

```ts
const text = "\a"
const pattern = /\h/
```

**✅ correct**

```ts
const text = "a"
const pattern = /h/
```

### [eslint/no-regex-spaces](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-regex-spaces)

정규식의 연속된 공백(`/foo   bar/`)을 `{n}` 양화사로 표기하도록 유도한다.

**베스트 프랙티스.** 공백 갯수가 시각적으로 안 보여 실수를 유발하므로 명시적 양화사가 명확하다.

**❌ incorrect**

```ts
const pattern = /foo   bar/
```

**✅ correct**

```ts
const pattern = /foo {3}bar/
```

### [eslint/no-control-regex](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-control-regex)

정규식에서 제어 문자(`\x00`–`\x1F`)를 잡는다.

**베스트 프랙티스.** 대부분 오타거나 의도치 않은 매칭이고, 보안 검사나 바이너리 파싱 등 의도된 사용은 disable 코멘트로 풀 수 있다.

**❌ incorrect**

```ts
const pattern = /\x1f/
```

**✅ correct**

```ts
const pattern = /[a-zA-Z]/
```

### [eslint/no-unused-labels](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-unused-labels)

선언만 되고 `break`/`continue`로 참조되지 않는 label을 잡는다.

**베스트 프랙티스.** label은 본디 가독성을 위해 명시했으나 사용되지 않으면 노이즈라 죽은 코드를 제거한다.

**❌ incorrect**

```ts
outer: for (const item of items) {
  process(item)
}
```

**✅ correct**

```ts
outer: for (const group of groups) {
  for (const item of group) {
    if (item.skip) continue outer
    process(item)
  }
}
```

### [eslint/no-unused-private-class-members](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-unused-private-class-members)

참조되지 않는 `#priv` 클래스 필드/메서드를 잡는다.

**베스트 프랙티스.** `no-unused-vars`의 클래스 멤버판이고 private이라 외부 사용을 따질 필요가 없어 false positive가 거의 없다.

**❌ incorrect**

```ts
class Counter {
  #count = 0
  increment() {
    return 1
  }
}
```

**✅ correct**

```ts
class Counter {
  #count = 0
  increment() {
    this.#count += 1
    return this.#count
  }
}
```

### [eslint/no-empty-static-block](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-empty-static-block)

클래스의 빈 `static {}` 블록을 잡는다.

**베스트 프랙티스.** 자리만 차지하는 코드라 의도된 case가 거의 없다.

**❌ incorrect**

```ts
class Config {
  static {}
}
```

**✅ correct**

```ts
class Config {
  static initialized = false
  static {
    Config.initialized = true
  }
}
```

### [import/first](https://oxc.rs/docs/guide/usage/linter/rules/import/first)

모든 `import` 문이 파일 상단의 비-import 문보다 앞서도록 강제한다.

**베스트 프랙티스.** 가독성과 실행 순서 일관성에 좋고 `vp fmt` 정렬과 충돌 여부 확인이 필요하다.

**Configuration**

- `"absolute-first" | "disable-absolute-first"` (string, default: `"disable-absolute-first"`): `"absolute-first"`는 절대 경로 import를 상대 경로보다 앞에 두도록 강제, 기본값은 해당 검사를 끈다.

**❌ incorrect**

```ts
import { a } from "./a"
const value = 1
import { b } from "./b"
```

**✅ correct**

```ts
import { a } from "./a"
import { b } from "./b"
const value = 1
```

### [import/no-duplicates](https://oxc.rs/docs/guide/usage/linter/rules/import/no-duplicates)

같은 모듈에서 여러 `import` 문을 합치도록 강제한다.

**베스트 프랙티스.** 이미 채택한 `eslint/no-duplicate-imports`와 의도가 겹쳐 둘 중 하나로 통일 검토가 필요하다.

**Configuration**

- `considerQueryString` (`boolean`, default: `false`): 쿼리스트링이 다른 import는 다른 모듈로 취급할지 여부.
- `preferInline` (`boolean`, default: `false`): TS에서 별도 `import type` 문 대신 인라인 type import(`import { type X }`)를 선호.

**❌ incorrect**

```ts
import { a } from "./module"
import { b } from "./module"
```

**✅ correct**

```ts
import { a, b } from "./module"
```

### [typescript/consistent-type-imports](https://oxc.rs/docs/guide/usage/linter/rules/typescript/consistent-type-imports)

type-only import를 `import type {...}`으로 표기하도록 강제한다.

**베스트 프랙티스.** 이미 채택한 `import/consistent-type-specifier-style`(`prefer-top-level`)과 짝을 이뤄 정책을 완성하고 번들러가 타입 import를 안전히 제거할 수 있게 한다.

**Configuration**

- `disallowTypeAnnotations` (`boolean`, default: `true`): 타입 어노테이션에서 `import()` 구문 사용 금지.
- `fixStyle` (`"separate-type-imports" | "inline-type-imports"`, default: `"separate-type-imports"`): 자동 수정 결과의 형태. `separate-type-imports`는 `import type { A }`, `inline-type-imports`는 `import { type A }`.
- `prefer` (`"type-imports" | "no-type-imports"`, default: `"type-imports"`): type-only import 강제 방향. `no-type-imports`는 일반 import 사용을 강제.

**❌ incorrect**

```ts
import { User } from "./types"
const user: User = getUser()
```

**✅ correct**

```ts
import type { User } from "./types"
const user: User = getUser()
```

### [typescript/ban-ts-comment](https://oxc.rs/docs/guide/usage/linter/rules/typescript/ban-ts-comment)

`@ts-ignore`/`@ts-nocheck`/`@ts-expect-error` 등 ts 지시 주석 사용을 옵션별로 제한한다.

**베스트 프랙티스.** 타입 검사를 건너뛰는 코드에 설명을 강제하고 지시문별로 정책을 분리할 수 있어 typescript-eslint upstream default(`ts-expect-error: 'allow-with-description'`, `ts-ignore: true`, `ts-nocheck: true`, `ts-check: false`)를 출발점으로 검토한다.

**Configuration**

- `minimumDescriptionLength` (`integer`, default: `3`): `allow-with-description` 사용 시 설명의 최소 길이.
- `ts-check` (`boolean | "allow-with-description" | object`, default: 없음): `@ts-check` 지시문 정책. `true` 금지, `false` 허용, `"allow-with-description"` 설명 필수, 객체로 `descriptionFormat` 정규식 지정 가능.
- `ts-expect-error` (`boolean | "allow-with-description" | object`, default: 없음): `@ts-expect-error` 지시문 정책. 옵션 형식은 `ts-check`와 동일.
- `ts-ignore` (`boolean | "allow-with-description" | object`, default: 없음): `@ts-ignore` 지시문 정책. 옵션 형식은 `ts-check`와 동일.
- `ts-nocheck` (`boolean | "allow-with-description" | object`, default: 없음): `@ts-nocheck` 지시문 정책. 옵션 형식은 `ts-check`와 동일.

**❌ incorrect**

```ts
// @ts-ignore
const value = unsafeApi()
```

**✅ correct**

```ts
// @ts-ignore: legacy library has incorrect types, see issue #123
const value = unsafeApi()
```

### [typescript/triple-slash-reference](https://oxc.rs/docs/guide/usage/linter/rules/typescript/triple-slash-reference)

`/// <reference path="..." />` 지시문 사용을 제한한다.

**베스트 프랙티스.** ES module `import`로 통일된 패턴을 강제하고 `vite-env.d.ts` 같은 예외는 override가 필요하다.

**Configuration**

- `lib` (`"always" | "never"`, default: `"always"`): `/// <reference lib="..." />` 지시문 허용 여부.
- `path` (`"always" | "never"`, default: `"never"`): `/// <reference path="..." />` 지시문 허용 여부.
- `types` (`"always" | "never" | "prefer-import"`, default: `"prefer-import"`): `/// <reference types="..." />` 지시문 허용 여부. `prefer-import`는 같은 모듈에 대한 `import`가 있을 때만 보고.

**❌ incorrect**

```ts
/// <reference path="./types.d.ts" />
```

**✅ correct**

```ts
import "./types"
```

### [typescript/no-namespace](https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-namespace)

TypeScript `namespace`/`module` 선언을 금지한다.

**베스트 프랙티스.** ES modules로 통일하고 ambient declaration은 옵션으로 풀 수 있다.

**Configuration**

- `allowDeclarations` (`boolean`, default: `false`): `declare namespace` 형태 ambient 네임스페이스 허용.
- `allowDefinitionFiles` (`boolean`, default: `true`): `.d.ts` 정의 파일에서는 네임스페이스 허용.

**❌ incorrect**

```ts
namespace Utils {
  export function format(value: string) {
    return value.trim()
  }
}
```

**✅ correct**

```ts
export function format(value: string) {
  return value.trim()
}
```

### [typescript/prefer-as-const](https://oxc.rs/docs/guide/usage/linter/rules/typescript/prefer-as-const)

리터럴 타입 단언에 `as "foo"` 대신 `as const`를 사용하도록 권장한다.

**베스트 프랙티스.** 오타 방지와 일관성 측면에서 `as const`가 더 안전하고 의도가 명확하다.

**❌ incorrect**

```ts
const status = "ready" as "ready"
const point = { x: 0 as 0, y: 0 as 0 }
```

**✅ correct**

```ts
const status = "ready" as const
const point = { x: 0, y: 0 } as const
```

### [typescript/no-unnecessary-type-assertion](https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-unnecessary-type-assertion)

타입을 좁히지 못하는 불필요한 `as`/`!` 단언을 잡는다.

**베스트 프랙티스.** 이미 채택한 `typescript/no-non-null-assertion`과 보완해 잉여 단언이 코드 노이즈와 함정의 원인이 되는 것을 막는다.

**Configuration**

- `checkLiteralConstAssertions` (`boolean`, default: `false`): `'foo' as const` 같은 리터럴 const 단언도 불필요로 보고할지 여부.
- `typesToIgnore` (`string[]`, default: `[]`): 불필요 단언 검사에서 제외할 타입 이름 목록.

**❌ incorrect**

```ts
const value = 1 as number
declare function getUser(): User
const user = getUser()!
```

**✅ correct**

```ts
const value = 1
declare function getUser(): User
const user = getUser()
```

## 새로운 발견: 검토

도입 효과는 있지만 취향 차이가 크거나 false positive 가능성이 있어 본격 채택 전 리얼월드 확인이 필요한 규칙.

### [typescript/no-unnecessary-condition](https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-unnecessary-condition)

타입상 항상 truthy/falsy로 평가되는 불필요한 조건을 잡는다.

**베스트 프랙티스.** 외부 API 응답이나 방어적 코딩 패턴에서 false positive가 자주 발생할 수 있어 옵션, override 정책 검토와 리얼월드 확인이 필요하다.

**Configuration**

- `allowConstantLoopConditions` (`boolean | "never" | "always" | "only-allowed-literals"`, default: 없음): 루프의 상수 조건(`while (true)` 등) 허용 정책.
- `checkTypePredicates` (`boolean`, default: `false`): 사용자 정의 type predicate의 결과까지 불필요 조건으로 검사할지 여부.

**❌ incorrect**

```ts
declare const user: User
if (user) {
  render(user)
}
```

**✅ correct**

```ts
declare const user: User | null
if (user) {
  render(user)
}
```

### [eslint/no-irregular-whitespace](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-irregular-whitespace)

NBSP 같은 비정상 공백 문자를 잡는다.

**취향.** `vp fmt`가 토큰 사이 NBSP를 정규화하고 문자열 리터럴 NBSP는 default `skipStrings: true`로 무시되므로 실효 가치가 낮다.

**Configuration**

- `skipComments` (`boolean`, default: `true`): 주석 안 비정상 공백 무시.
- `skipJSXText` (`boolean`, default: `true`): JSX 텍스트 안 비정상 공백 무시.
- `skipRegExps` (`boolean`, default: `true`): 정규식 안 비정상 공백 무시.
- `skipStrings` (`boolean`, default: `true`): 문자열 리터럴 안 비정상 공백 무시.
- `skipTemplates` (`boolean`, default: `true`): 템플릿 리터럴 안 비정상 공백 무시.

**🆗 rule: incorrect (허용)**

`value`와 `=` 사이 공백이 NBSP(U+00A0)인 형태 (raw 표시 생략, `vp fmt`가 정규화).

```ts
const value = 1
```

**⚠️ rule: correct (노이즈)**

```ts
const value = 1
```

{/* @stylistic/spaced-comment: oxlint 인덱스에 미존재 (eslint/stylistic 양쪽 URL 모두 404). 검토 대상에서 제외. */}
