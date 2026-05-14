# TanStack 룰 비교 (draft)

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

명백한 버그 패턴을 잡고 false positive가 거의 없어 즉시 채택할 가치가 큰 룰.

### [eslint/no-invalid-regexp](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-invalid-regexp)

#### 설명

- `RegExp` 생성자에 잘못된 패턴이 들어가는 것을 잡는다.

#### 근거

- 런타임 에러로 직결되는 명백한 버그.
- false positive 거의 없음.

#### 설정

- `allowConstructorFlags` (`string[]`, default: `[]`): 허용할 플래그를 케이스 민감 배열로 지정.

#### 예시

**❌ incorrect**

```ts
new RegExp("[")
```

**✅ correct**

```ts
new RegExp("\\[")
```

### [eslint/no-unsafe-optional-chaining](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-unsafe-optional-chaining)

#### 설명

- `(obj?.foo)()`처럼 optional chain 결과를 즉시 호출/연산해 런타임 에러로 이어지는 패턴을 잡는다.

#### 근거

- optional chain의 안전성을 우회하는 명백한 안티패턴.
- 즉시 채택할 가치가 큰 추천 룰.

#### 설정

- `disallowArithmeticOperators` (`boolean`, default: `false`): optional chain 결과에 대한 산술 연산(`?.x + 1` 등) 추가 검사 여부.

#### 예시

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

#### 설명

- `finally` 블록 안에서 `return`/`throw`/`break`로 흐름을 가로채는 패턴을 잡는다.

#### 근거

- 원본 예외/반환값을 삼키는 미묘한 버그를 막는다.
- 즉시 채택할 가치가 큰 추천 룰.

#### 설정

없음

#### 예시

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

#### 설명

- `new Promise(async (resolve) => ...)`처럼 async executor를 금지한다.

#### 근거

- async executor 안의 에러가 삼켜져 unhandled rejection이 발생하지 않는 함정.
- 명백한 안티패턴.

#### 설정

없음

#### 예시

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

#### 설명

- for문 카운터가 종료 조건과 반대 방향으로 진행하는 무한 루프를 잡는다.

#### 근거

- 명백한 무한 루프 버그를 컴파일 타임에 차단.
- false positive 거의 없음.

#### 설정

없음

#### 예시

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

#### 설명

- `if (x = 1)` 같은 조건문 안 할당 (`==` 오타) 버그를 잡는다.

#### 근거

- 가독성을 해치고 비교 연산자 오타를 가린다.
- 의도적 할당은 별도 라인으로 분리하는 편이 명확.
- `vp fmt`가 조건문 안 할당을 자동으로 `((...))`로 감싸기 때문에 default `"except-parens"`로는 룰이 발화하지 않음. 본 저장소에서는 `"always"` 설정으로 채택해야 의미가 있다.

#### 설정

- `"except-parens" | "always"` (string, default: `"except-parens"`): `"except-parens"`는 괄호로 감싼 할당만 허용, `"always"`는 모든 조건문 안 할당을 금지. 본 저장소 채택 시 `"always"` 권장.

#### 예시

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

#### 설명

- 항상 같은 결과를 내는 이항 표현식(`a || true`)을 잡는다.

#### 근거

- 연산자 우선순위 실수나 리팩토링 잔여물을 노출.
- 의도된 코드일 확률이 거의 0.

#### 설정

없음

#### 예시

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

#### 설명

- `if (true)`, `while (1)` 같은 상수 조건문을 잡는다.

#### 근거

- 디버깅 코드나 리팩토링 잔여물을 검출.
- 기본값(`allExceptWhileTrue`)이 의도적 무한 루프는 허용해 noise가 적다.

#### 설정

- `checkLoops` (`"all" | "allExceptWhileTrue" | "none"`, default: `"allExceptWhileTrue"`): 루프 안 상수 조건 검사 범위. `"allExceptWhileTrue"`는 `while (true)`만 허용, `"all"`은 전부 금지, `"none"`은 검사 안 함.

#### 예시

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

#### 설명

- `else if` 체인에서 중복된 조건을 잡는다 (절대 진입 불가).

#### 근거

- 복붙, 리팩토링 실수로 생기는 죽은 코드를 즉시 노출.
- 의도적인 경우 없음.

#### 설정

없음

#### 예시

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

#### 설명

- `switch`에서 중복된 `case`를 잡는다 (절대 진입 불가).

#### 근거

- `no-dupe-else-if`의 switch판.
- 죽은 분기를 즉시 노출.

#### 설정

없음

#### 예시

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

#### 설명

- `break`/`return` 없이 다음 `case`로 흘러가는 실수를 잡는다.

#### 근거

- 명백한 버그 패턴.
- 의도된 fallthrough는 주석으로 표시해 풀 수 있다.

#### 설정

- `allowEmptyCase` (`boolean`, default: `false`): 비어 있는 case가 다음 case로 흐르는 것을 허용.
- `commentPattern` (`string`, default: 없음): 의도된 fallthrough를 표시하는 주석의 정규식 패턴. 미지정 시 빌트인 `/falls?\s?through/i`로 매칭하며, 지정 시 그 값으로 override한다.
- `reportUnusedFallthroughComment` (`boolean`, default: `false`): 실제 fallthrough가 없는데 주석만 있는 경우 보고.

#### 예시

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

#### 설명

- `[1, , 3]`처럼 빈 슬롯 있는 배열 리터럴을 잡는다.

#### 근거

- 거의 항상 콤마 오타.
- 의도적이라면 `undefined`를 명시하는 편이 명확.

#### 설정

없음

#### 예시

**❌ incorrect**

```ts
const items = [1, , 3]
```

**✅ correct**

```ts
const items = [1, undefined, 3]
```

### [eslint/no-ex-assign](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-ex-assign)

#### 설명

- `catch (e) { e = ... }`처럼 catch 변수 재할당을 금지한다.

#### 근거

- 원본 에러 정보를 잃는 안티패턴.
- `Error.cause`로 컨텍스트를 보존하는 편이 안전.

#### 설정

없음

#### 예시

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

#### 설명

- `x = x` 같은 자기 자신 할당 (무의미한 코드)을 잡는다.

#### 근거

- 리팩토링 잔여물, 복붙 실수 검출.
- 의도된 경우 거의 없음.

#### 설정

- `props` (`boolean`, default: `true`): 프로퍼티 자가 할당(`obj.a = obj.a`)도 검사할지 여부. `false`면 객체 프로퍼티 자가 할당은 통과.

#### 예시

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

#### 설명

- `class Foo {}` 선언 후 `Foo = ...`로 덮어쓰는 패턴을 금지한다.

#### 근거

- 클래스 선언을 우연히 덮어써 런타임에 깨지는 함정.
- 의도된 경우 없음.

#### 설정

없음

#### 예시

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

#### 설명

- `window`, `Object` 같은 전역 식별자 재할당을 금지한다.

#### 근거

- 전역을 망가뜨려 추적이 어려운 버그를 만든다.
- 폴리필 등 특수 케이스만 `exceptions`로 풀면 충분.

#### 설정

- `exceptions` (`string[]`, default: `[]`): 룰에서 제외할 전역 변수 이름 목록.

#### 예시

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

#### 설명

- `undefined`, `NaN`, `Infinity` 같은 예약 식별자 섀도잉을 금지한다.

#### 근거

- 언어 차원의 함정을 만드는 안티패턴.
- 명확한 이름으로 대체.

#### 설정

- `reportGlobalThis` (`boolean`, default: `true`): `globalThis` 재정의를 보고할지 여부.

#### 예시

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

#### 설명

- 변수에 `delete`를 적용하는 패턴(`delete x`)을 금지한다.

#### 근거

- strict mode 위반, `delete`는 객체 프로퍼티 전용.
- 변수 해제는 의미 없음.

#### 설정

없음

#### 예시

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

#### 설명

- `with` 문 사용을 금지한다.

#### 근거

- strict mode 위반.
- 스코프 모호성으로 유지보수 악화.
- 모던 코드에선 쓸 일 없음.

#### 설정

없음

#### 예시

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

#### 설명

- `x === -0` 같은 음의 0과의 비교를 금지한다.

#### 근거

- `+0 === -0`이라 항상 true.
- 의도된 비교는 `Object.is`로 명시.

#### 설정

없음

#### 예시

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

#### 설명

- `x === NaN`(항상 false) 대신 `Number.isNaN(x)`를 강제한다.

#### 근거

- 명백한 비교 함정.
- 의도된 코드일 확률 없음.

#### 설정

- `enforceForIndexOf` (`boolean`, default: `false`): `indexOf`/`lastIndexOf` 인수로 `NaN`을 금지할지 여부.
- `enforceForSwitchCase` (`boolean`, default: `true`): `switch` 분기 식, `case`로 `NaN`을 금지할지 여부.

#### 예시

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

#### 설명

- `typeof x === "strnig"` 같은 오타 비교를 잡는다.

#### 근거

- `typeof`는 결과 문자열이 제한적이라 오타가 곧 죽은 코드.
- 즉시 채택 가치 큼.

#### 설정

- `requireStringLiterals` (`boolean`, default: `false`): `typeof` 비교 대상으로 문자열 리터럴이나 다른 `typeof` 표현식만 허용.

#### 예시

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

#### 설명

- JavaScript number가 정밀하게 표현하지 못하는 큰 숫자 리터럴을 잡는다.

#### 근거

- 은밀한 데이터 손실을 컴파일 타임에 노출.
- 큰 숫자는 `BigInt`로 명시.

#### 설정

없음

#### 예시

**❌ incorrect**

```ts
const big = 9007199254740993
```

**✅ correct**

```ts
const big = 9007199254740992n
```

### [eslint/no-empty-character-class](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-empty-character-class)

#### 설명

- 정규식의 빈 문자 클래스 `[]`를 잡는다.

#### 근거

- 빈 클래스는 아무것도 매칭하지 않아 패턴 전체를 망가뜨림.
- 명백한 실수.

#### 설정

없음

#### 예시

**❌ incorrect**

```ts
const pattern = /^abc[]/
```

**✅ correct**

```ts
const pattern = /^abc/
```

### [eslint/no-misleading-character-class](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-misleading-character-class)

#### 설명

- 서로게이트 페어 등 단일 문자처럼 보이는 다중 코드포인트를 문자 클래스에 넣는 실수를 잡는다.

#### 근거

- 이모지, 결합 문자 처리에서 미묘한 매칭 버그를 막는다.
- `u` 플래그 사용을 유도.

#### 설정

- `allowEscape` (`boolean`, default: `false`): 이스케이프 시퀀스로 작성된 다중 코드포인트는 문자 클래스에서 허용.

#### 예시

**❌ incorrect**

```ts
const pattern = /^[🎉]$/
```

**✅ correct**

```ts
const pattern = /^🎉$/u
```

### [eslint/no-useless-backreference](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-useless-backreference)

#### 설명

- 절대 일치할 수 없는 정규식 backreference를 잡는다.

#### 근거

- 복잡한 정규식의 설계 실수를 컴파일 타임에 노출.

#### 설정

없음

#### 예시

**❌ incorrect**

```ts
const pattern = /^(?:(a)|\1b)$/
```

**✅ correct**

```ts
const pattern = /^(?:(a)\1|b)$/
```

### [eslint/no-nonoctal-decimal-escape](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-nonoctal-decimal-escape)

#### 설명

- 문자열 리터럴에서 `\8`, `\9` 같은 비-팔진 십진 이스케이프를 금지한다.

#### 근거

- 런타임 의미가 모호한 레거시 패턴.
- 일반 문자나 명시적 이스케이프로 대체.

#### 설정

없음

#### 예시

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

#### 설명

- 빈 destructuring 패턴(`const {} = obj`)을 잡는다.

#### 근거

- 의도 없는 코드 혹은 작성 미완성 검출.
- 함수 파라미터에서 빈 객체 기본값 패턴은 옵션으로 풀 수 있음.

#### 설정

- `allowObjectPatternsAsParameters` (`boolean`, default: `false`): 함수 파라미터에서 빈 객체 패턴(`function fn({})`, 기본값 `{} = {}` 포함)을 허용.

#### 예시

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

#### 설명

- 같은 enum 안에서 중복된 값을 가진 멤버를 잡는다.

#### 근거

- reverse mapping 깨짐, 논리 충돌을 미연에 방지.
- 의도된 경우 거의 없음.

#### 설정

없음

#### 예시

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

#### 설명

- interface/class에서 잘못 사용된 `new` 시그니처/`constructor` 정의를 잡는다.

#### 근거

- constructor 의도를 모호하게 만드는 안티패턴.
- constructor 시그니처와 인스턴스 타입을 명확히 분리.

#### 설정

없음

#### 예시

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

#### 설명

- `x?.y!`처럼 optional chain 결과에 non-null assertion을 붙이는 모순 패턴을 잡는다.

#### 근거

- optional chain의 안전성을 무력화.
- 한 표현식 안에서 안전한 접근과 강제 단언이 충돌.

#### 설정

없음

#### 예시

**❌ incorrect**

```ts
const id = user?.profile!.id
```

**✅ correct**

```ts
const id = user?.profile?.id
```

### [typescript/no-for-in-array](https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-for-in-array)

#### 설명

- 배열에 `for...in`을 사용하는 패턴을 잡는다.

#### 근거

- 인덱스가 문자열로 순회되고 프로토타입 체인 프로퍼티가 포함될 위험.
- 배열은 `for...of`가 정답.

#### 설정

없음

#### 예시

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

#### 설명

- `x!!`처럼 중복된 `!` non-null assertion을 잡는다.

#### 근거

- 명백한 잉여 코드.
- 의도된 경우 없음.

#### 설정

없음

#### 예시

**❌ incorrect**

```ts
const id = user!!.id
```

**✅ correct**

```ts
const id = user!.id
```

### [typescript/no-unsafe-function-type](https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-unsafe-function-type)

#### 설명

- 광범위한 `Function` 타입 사용을 금지한다.

#### 근거

- `Function`은 호출 시그니처를 검사하지 않아 `any` 수준의 안전성.
- 명시적 시그니처로 대체.

#### 설정

없음

#### 예시

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

#### 설명

- `BigInt`, `Boolean`, `Number`, `String`, `Symbol`, `Object` 6종 wrapper 객체 타입 사용을 금지한다.

#### 근거

- 원시 타입과 비호환, 혼동을 야기.
- 소문자 원시 타입(`string`, `number`)이 정답.

#### 설정

없음

#### 예시

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

베스트 프랙티스로 채택할 가치가 크지만 옵션 검토나 일부 트레이드오프 확인이 필요한 룰.

### [eslint/no-var](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-var)

#### 설명

- `var` 선언을 금지하고 `let`/`const` 사용을 강제한다.

#### 근거

- 모던 JS의 사실상 표준.
- 함수 스코프, 호이스팅 함정 제거.

#### 설정

없음

#### 예시

**❌ incorrect**

```ts
var value = 1
```

**✅ correct**

```ts
const value = 1
```

### [eslint/prefer-const](https://oxc.rs/docs/guide/usage/linter/rules/eslint/prefer-const)

#### 설명

- 재할당이 없는 `let`을 `const`로 바꾸도록 강제한다.

#### 근거

- 불변 의도를 변수 선언으로 표현.
- 가독성 향상, 재할당 실수 방지.

#### 설정

- `destructuring` (`"any" | "all"`, default: `"any"`): 분해 할당 처리 방식. `"any"`는 일부 변수만 `const`여도 보고, `"all"`은 모두 `const`여야 할 때만 보고.
- `ignoreReadBeforeAssign` (`boolean`, default: `false`): 초기 할당 전에 읽힌 변수는 무시.

#### 예시

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

#### 설명

- 운영 코드에 남은 `debugger` 문을 잡는다.

#### 근거

- PR 머지 사고 방지.
- 의도된 디버깅은 PR 전에 제거해야 함.

#### 설정

없음

#### 예시

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

#### 설명

- `switch case`에서 중괄호 없이 `let`/`const`/`function`/`class` 선언을 금지한다.

#### 근거

- case 사이 스코프 누수와 호이스팅 함정 방지.
- 중괄호로 명시적 블록 강제.

#### 설정

없음

#### 예시

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

#### 설명

- `function*` 안에 `yield`가 없는 잉여 generator를 잡는다.

#### 근거

- 잘못된 `*` 표시로 generator 의도가 모호.
- yield가 없다면 일반 함수가 옳다.

#### 설정

없음

#### 예시

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

#### 설명

- `catch (e) { throw e }`처럼 단순 재던지기만 하는 try-catch를 잡는다.

#### 근거

- 이미 채택한 `eslint/preserve-caught-error`와 보완.
- try-catch가 실제로 무엇을 하는지 강제로 명시.

#### 설정

없음

#### 예시

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

#### 설명

- 이미 boolean 컨텍스트인 곳의 `!!`, `Boolean()` 중복 변환을 잡는다.

#### 근거

- 가독성을 해치는 잉여 코드 제거.

#### 설정

- `enforceForInnerExpressions` (`boolean`, default: `false`): 불리언 컨텍스트로 사용되는 내부 표현식까지 검사 확장.

#### 예시

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

#### 설명

- 의미 없는 이스케이프(`"\a"`, `/\h/`)를 잡는다.

#### 근거

- 가독성, 자동 수정으로 정리 가능.
- 의도된 이스케이프가 아니면 잉여.

#### 설정

- `allowRegexCharacters` (`string[]`, default: `[]`): 정규식 안에서 불필요한 이스케이프를 허용할 단일 문자 목록.

#### 예시

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

#### 설명

- 정규식의 연속된 공백(`/foo   bar/`)을 `{n}` 양화사로 표기하도록 유도한다.

#### 근거

- 공백 갯수가 시각적으로 안 보여 실수 유발.
- 명시적 양화사가 명확.

#### 설정

없음

#### 예시

**❌ incorrect**

```ts
const pattern = /foo   bar/
```

**✅ correct**

```ts
const pattern = /foo {3}bar/
```

### [eslint/no-control-regex](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-control-regex)

#### 설명

- 정규식에서 제어 문자(`\x00`–`\x1F`)를 잡는다.

#### 근거

- 대부분 오타거나 의도치 않은 매칭.
- 보안 검사, 바이너리 파싱 등 의도된 사용은 disable 코멘트로 풀 수 있다.

#### 설정

없음

#### 예시

**❌ incorrect**

```ts
const pattern = /\x1f/
```

**✅ correct**

```ts
const pattern = /[a-zA-Z]/
```

### [eslint/no-unused-labels](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-unused-labels)

#### 설명

- 선언만 되고 `break`/`continue`로 참조되지 않는 label을 잡는다.

#### 근거

- 죽은 코드 제거.
- label은 본디 가독성을 위해 명시했으나 사용되지 않으면 노이즈.

#### 설정

없음

#### 예시

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

#### 설명

- 참조되지 않는 `#priv` 클래스 필드/메서드를 잡는다.

#### 근거

- `no-unused-vars`의 클래스 멤버판.
- private이라 외부 사용을 따질 필요 없어 false positive 거의 없음.

#### 설정

없음

#### 예시

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

#### 설명

- 클래스의 빈 `static {}` 블록을 잡는다.

#### 근거

- 자리만 차지하는 코드.
- 의도된 case는 거의 없음.

#### 설정

없음

#### 예시

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

#### 설명

- 모든 `import` 문이 파일 상단의 비-import 문보다 앞서도록 강제한다.

#### 근거

- 가독성, 실행 순서 일관성.
- `vp fmt` 정렬과 충돌 여부 확인 필요.

#### 설정

- `"absolute-first" | "disable-absolute-first"` (string, default: `"disable-absolute-first"`): `"absolute-first"`는 절대 경로 import를 상대 경로보다 앞에 두도록 강제, 기본값은 해당 검사를 끈다.

#### 예시

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

#### 설명

- 같은 모듈에서 여러 `import` 문을 합치도록 강제한다.

#### 근거

- 이미 채택한 `eslint/no-duplicate-imports`와 의도가 겹쳐, 둘 중 하나로 통일 검토 필요.

#### 설정

- `considerQueryString` (`boolean`, default: `false`): 쿼리스트링이 다른 import는 다른 모듈로 취급할지 여부.
- `preferInline` (`boolean`, default: `false`): TS에서 별도 `import type` 문 대신 인라인 type import(`import { type X }`)를 선호.

#### 예시

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

#### 설명

- type-only import를 `import type {...}`으로 표기하도록 강제한다.

#### 근거

- 이미 채택한 `import/consistent-type-specifier-style`(`prefer-top-level`)과 짝을 이뤄 정책을 완성.
- 번들러가 타입 import를 안전히 제거할 수 있게 함.

#### 설정

- `disallowTypeAnnotations` (`boolean`, default: `true`): 타입 어노테이션에서 `import()` 구문 사용 금지.
- `fixStyle` (`"separate-type-imports" | "inline-type-imports"`, default: `"separate-type-imports"`): 자동 수정 결과의 형태. `separate-type-imports`는 `import type { A }`, `inline-type-imports`는 `import { type A }`.
- `prefer` (`"type-imports" | "no-type-imports"`, default: `"type-imports"`): type-only import 강제 방향. `no-type-imports`는 일반 import 사용을 강제.

#### 예시

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

#### 설명

- `@ts-ignore`/`@ts-nocheck`/`@ts-expect-error` 등 ts 지시 주석 사용을 옵션별로 제한한다.

#### 근거

- 타입 검사를 건너뛰는 코드에 설명을 강제.
- 지시문별로 정책을 분리할 수 있어 정밀 통제 가능. typescript-eslint upstream default(`ts-expect-error: 'allow-with-description'`, `ts-ignore: true`, `ts-nocheck: true`, `ts-check: false`)를 출발점으로 검토.

#### 설정

- `minimumDescriptionLength` (`integer`, default: `3`): `allow-with-description` 사용 시 설명의 최소 길이.
- `ts-check` (`boolean | "allow-with-description" | object`, default: 없음): `@ts-check` 지시문 정책. `true` 금지, `false` 허용, `"allow-with-description"` 설명 필수, 객체로 `descriptionFormat` 정규식 지정 가능.
- `ts-expect-error` (`boolean | "allow-with-description" | object`, default: 없음): `@ts-expect-error` 지시문 정책. 옵션 형식은 `ts-check`와 동일.
- `ts-ignore` (`boolean | "allow-with-description" | object`, default: 없음): `@ts-ignore` 지시문 정책. 옵션 형식은 `ts-check`와 동일.
- `ts-nocheck` (`boolean | "allow-with-description" | object`, default: 없음): `@ts-nocheck` 지시문 정책. 옵션 형식은 `ts-check`와 동일.

#### 예시

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

#### 설명

- `/// <reference path="..." />` 지시문 사용을 제한한다.

#### 근거

- ES module `import`로 통일된 패턴 강제.
- `vite-env.d.ts` 같은 예외는 override 필요.

#### 설정

- `lib` (`"always" | "never"`, default: `"always"`): `/// <reference lib="..." />` 지시문 허용 여부.
- `path` (`"always" | "never"`, default: `"never"`): `/// <reference path="..." />` 지시문 허용 여부.
- `types` (`"always" | "never" | "prefer-import"`, default: `"prefer-import"`): `/// <reference types="..." />` 지시문 허용 여부. `prefer-import`는 같은 모듈에 대한 `import`가 있을 때만 보고.

#### 예시

**❌ incorrect**

```ts
/// <reference path="./types.d.ts" />
```

**✅ correct**

```ts
import "./types"
```

### [typescript/no-namespace](https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-namespace)

#### 설명

- TypeScript `namespace`/`module` 선언을 금지한다.

#### 근거

- ES modules로 통일.
- ambient declaration은 옵션으로 풀 수 있음.

#### 설정

- `allowDeclarations` (`boolean`, default: `false`): `declare namespace` 형태 ambient 네임스페이스 허용.
- `allowDefinitionFiles` (`boolean`, default: `true`): `.d.ts` 정의 파일에서는 네임스페이스 허용.

#### 예시

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

#### 설명

- 리터럴 타입 단언에 `as "foo"` 대신 `as const`를 사용하도록 권장한다.

#### 근거

- 오타 방지, 일관성.
- `as const`가 더 안전하고 의도 명확.

#### 설정

없음

#### 예시

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

#### 설명

- 타입을 좁히지 못하는 불필요한 `as`/`!` 단언을 잡는다.

#### 근거

- 이미 채택한 `typescript/no-non-null-assertion`과 보완.
- 잉여 단언이 코드 노이즈와 함정의 원인.

#### 설정

- `checkLiteralConstAssertions` (`boolean`, default: `false`): `'foo' as const` 같은 리터럴 const 단언도 불필요로 보고할지 여부.
- `typesToIgnore` (`string[]`, default: `[]`): 불필요 단언 검사에서 제외할 타입 이름 목록.

#### 예시

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

도입 효과는 있지만 취향 차이가 크거나 false positive 가능성이 있어 본격 채택 전 리얼월드 확인이 필요한 룰.

### [typescript/no-unnecessary-condition](https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-unnecessary-condition)

#### 설명

- 타입상 항상 truthy/falsy로 평가되는 불필요한 조건을 잡는다.

#### 근거

- 외부 API 응답, 방어적 코딩 패턴에서 false positive가 자주 발생할 수 있어 옵션, override 정책 검토 필요.
- 본격 채택 전 리얼월드 확인이 필요.

#### 설정

- `allowConstantLoopConditions` (`boolean | "never" | "always" | "only-allowed-literals"`, default: 없음): 루프의 상수 조건(`while (true)` 등) 허용 정책.
- `checkTypePredicates` (`boolean`, default: `false`): 사용자 정의 type predicate의 결과까지 불필요 조건으로 검사할지 여부.

#### 예시

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

#### 설명

- NBSP 같은 비정상 공백 문자를 잡는다.

#### 근거

- 한국어 문자열 리터럴, 번역 키 등에 의도된 NBSP가 들어갈 여지가 있어 옵션(`skipStrings`, `skipTemplates`) 확인 필요.
- `vp fmt`가 토큰 사이 NBSP를 정규화하여 코드 영역에서 raw NBSP 유지가 어렵고, 문자열 리터럴 NBSP는 default `skipStrings: true`로 무시되므로 실효 가치가 낮다.

#### 설정

- `skipComments` (`boolean`, default: `true`): 주석 안 비정상 공백 무시.
- `skipJSXText` (`boolean`, default: `true`): JSX 텍스트 안 비정상 공백 무시.
- `skipRegExps` (`boolean`, default: `true`): 정규식 안 비정상 공백 무시.
- `skipStrings` (`boolean`, default: `true`): 문자열 리터럴 안 비정상 공백 무시.
- `skipTemplates` (`boolean`, default: `true`): 템플릿 리터럴 안 비정상 공백 무시.

#### 예시

**❌ incorrect**

`value`와 `=` 사이 공백이 NBSP(U+00A0)인 형태 (raw 표시 생략, `vp fmt`가 정규화).

```ts
const value = 1
```

**✅ correct**

```ts
const value = 1
```

<!-- @stylistic/spaced-comment: oxlint 인덱스에 미존재 (eslint/stylistic 양쪽 URL 모두 404). 검토 대상에서 제외. -->
