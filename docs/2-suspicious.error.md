---
title: "Suspicious 채택 규칙"
---

## [eslint/no-shadow](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-shadow)

내부 스코프에서 외부 스코프와 같은 이름을 다시 선언해 식별자를 가리는 섀도잉을 금지한다. 내부 변수에 다른 이름을 부여해 충돌을 없앤다.

**베스트 프랙티스.** 같은 이름이 깊은 트리에서 어느 스코프를 참조하는지 컴파일러가 알려주지 않아 리팩터링 중 의도치 않은 결합이나 분리가 자주 생기므로 정적 분석으로 미리 차단한다.

**Configuration**

- `allow` (string[], default: `[]`): 섀도잉을 허용할 변수명 목록
- `builtinGlobals` (bool, default: `false`): 내장 전역 변수 섀도잉 보고 여부
- `hoist` (`"all" | "functions" | "functions-and-types" | "never" | "types"`, default: `"functions-and-types"`): 호이스팅 처리 방식
- `ignoreFunctionTypeParameterNameValueShadow` (bool, default: `true`): 함수 타입 매개변수가 값을 섀도잉할 때 무시
- `ignoreOnInitialization` (bool, default: `false`): 초기화 시점 전 섀도잉 무시
- `ignoreTypeValueShadow` (bool, default: `true`): 타입과 값이 동일 이름일 때 무시

**❌ incorrect**

```ts
const value = compute()
function transform() {
  const value = format(compute())
  return value
}
```

**✅ correct**

```ts
const rawValue = compute()
function transform() {
  const formatted = format(rawValue)
  return formatted
}
```

## [eslint/preserve-caught-error](https://oxc.rs/docs/guide/usage/linter/rules/eslint/preserve-caught-error)

`catch` 블록에서 새 `Error`를 던질 때 원본 오류를 잃으면 원인 추적이 어려워진다. `throw new Error("...", { cause: caughtError })`처럼 `cause`로 원본을 보존한다.

**베스트 프랙티스.** `cause` 한 줄로 디버깅 시간이 크게 줄고 추가 비용이 거의 없으며, `requireCatchParameter: true`로 선택적 catch 바인딩(`catch {}`)까지 차단해 무시 의도와 빠뜨린 처리를 코드로 구분한다.

**Configuration**

- `requireCatchParameter` (bool, default: `false`): catch 절에 항상 매개변수 선언을 요구

**⚙️ 설정**

```json
{
  "eslint/preserve-caught-error": ["error", { "requireCatchParameter": true }]
}
```

**❌ incorrect**

원인 오류를 `cause`로 보존하지 않은 형태.

```ts
try {
  doWork()
} catch (caughtError) {
  throw new Error("rewrapped failure")
}
```

**❌ incorrect**

`requireCatchParameter`로 catch 매개변수 생략도 차단된다.

```ts
try {
  doWork()
} catch {
  throw new Error("rewrapped failure")
}
```

**✅ correct**

```ts
try {
  doWork()
} catch (caughtError) {
  throw new Error("rewrapped failure", { cause: caughtError })
}
```

## [import/no-named-as-default](https://oxc.rs/docs/guide/usage/linter/rules/import/no-named-as-default)

같은 모듈에 동일 이름의 named export가 있는데 default import 식별자를 그 이름으로 받는 패턴을 검출한다. default import 이름을 다른 식별자로 바꾸거나 named import로 명시해 분리한다.

**베스트 프랙티스.** `default` + 동명 named export가 공존하는 라이브러리(React, lodash, 일부 UI 킷 등)에서 잘못된 import가 컴파일을 통과한 채 다른 값을 참조하는 결함을 만들어, 추적 비용이 높아 즉시 차단한다.

**❌ incorrect**

전제 모듈은 `export default function foo()` + `export const bar = 1`.

```ts
import bar from "./foo"
```

**✅ correct**

```ts
import foo from "./foo"
import { bar } from "./foo"
```

## [import/no-unassigned-import](https://oxc.rs/docs/guide/usage/linter/rules/import/no-unassigned-import)

바인딩 없이 부수 효과만을 위해 import하는 패턴(`import "x"`)을 금지한다. 부수 효과의 발생 지점을 명시적인 호출로 드러내도록 강제한다.

**베스트 프랙티스.** CSS는 빌드 도구가 자산으로 처리하는 표준 패턴이라 `allow` 옵션으로 허용하고, 차트 라이브러리 등 부수 효과 진입점을 권장하는 경우도 라이브러리 특성에 따라 추가할 수 있다.

**Configuration**

- `allow` (string[], default: `[]`): 미할당 import를 허용할 모듈의 glob 패턴 목록

**⚙️ 설정**

```json
{
  "import/no-unassigned-import": ["error", { "allow": ["**/*.css"] }]
}
```

**❌ incorrect**

```ts
import "./bootstrap"
```

**✅ correct**

일반 모듈은 명시적 호출로 풀어낸다.

```ts
import { bootstrap } from "./bootstrap"
bootstrap()
```

**✅ correct**

CSS는 `allow` 목록으로 허용된다.

```ts
import "./styles.css"
```

## [typescript/no-unnecessary-boolean-literal-compare](https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-unnecessary-boolean-literal-compare)

이미 `boolean` 타입인 식별자를 `=== true`/`!== false`로 비교하는 불필요한 코드를 검출한다. 변수를 그대로 사용하고 부정이 필요하면 `!`만 붙인다.

**베스트 프랙티스.** 이름(`isOpen`, `hasError` 등)이 이미 불리언임을 시사하므로 명시 비교는 가독성을 해치고, 자동 수정으로 일괄 정리되어 도입 비용이 거의 없다.

**Configuration**

- `allowComparingNullableBooleansToFalse` (bool, default: `true`): nullable boolean과 `false` 비교 허용
- `allowComparingNullableBooleansToTrue` (bool, default: `true`): nullable boolean과 `true` 비교 허용

**❌ incorrect**

```ts
if (isOpen === true) {
  open()
}
if (hasError !== false) {
  report()
}
```

**✅ correct**

```ts
if (isOpen) {
  open()
}
if (hasError) {
  report()
}
```

## [typescript/no-unnecessary-type-arguments](https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-unnecessary-type-arguments)

제네릭 정의의 기본값과 동일한 타입 인자를 호출부에 명시한 패턴을 검출한다. 정의부 기본값이 호출 의도와 일치하면 호출부에서도 기본값을 따라야 일관성이 유지되고, 기본값 변경 시 한 곳만 수정하면 된다.

**베스트 프랙티스.** `no-unnecessary-type-parameters`가 정의부에서 실제 타입 관계가 없는 제네릭을 검출하는 반면 이 규칙은 호출부에서 기본값과 같은 타입 인자를 검출해 같은 의도의 짝을 이루며, 자동 수정이 제공되어 일괄 정리 비용도 거의 없다.

**❌ incorrect**

전제 정의는 `fetchJson<T = unknown>(url: string): Promise<T>`.

```ts
const data = await fetchJson<unknown>("/api/users")
```

**✅ correct**

기본값과 동일하면 생략한다.

```ts
const data = await fetchJson("/api/users")
```

**✅ correct**

기본값과 다른 타입은 그대로 유지한다.

```ts
const users = await fetchJson<User[]>("/api/users")
```

## [typescript/no-unnecessary-type-parameters](https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-unnecessary-type-parameters)

함수에 선언한 타입 매개변수가 입력, 반환 타입을 실제로 연결하지 못하고 본문에서 단순 타입 단언으로만 사용되면 검출한다. 제네릭을 제거하고 반환 타입을 `unknown`으로 두거나, 입출력을 실제로 묶는 형태로 다시 설계한다.

**베스트 프랙티스.** `parseYAML<T>(...)`처럼 실제 타입 관계가 없는 제네릭은 호출 측에 잘못된 타입 안전성을 암시하지만 런타임 검증은 없어, 잘못된 시그니처가 코드베이스에 정착하기 전에 정적으로 차단한다.

**❌ incorrect**

```ts
function parseYAML<T>(input: string): T {
  return input as unknown as T
}
```

**✅ correct**

```ts
function parseYAML(input: string): unknown {
  return input
}

function identity<T>(value: T): T {
  return value
}
```

## [unicorn/consistent-function-scoping](https://oxc.rs/docs/guide/usage/linter/rules/unicorn/consistent-function-scoping)

외부 스코프 변수를 참조하지 않는 내부 함수가 보이면 상위(주로 모듈) 스코프로 끌어올리도록 권한다. 호출마다 함수를 재생성하는 비용이 사라지고, 단위 테스트 대상으로도 노출된다.

**베스트 프랙티스.** 클로저 의존이 없는 헬퍼는 모듈 함수가 더 자연스러워 `.ts`에서는 켜되, `.tsx`는 컴포넌트 전용 이벤트 핸들러와 렌더 헬퍼가 클로저 의존이 없어도 컴포넌트에 응집시키는 편이 자연스럽고 곧 props/state를 참조하게 되어 모듈로 옮겼다가 되돌리는 일이 잦아, 오탐이 과하므로 `**/*.tsx` 재정의로 끈다.

**Configuration**

- `checkArrowFunctions` (bool, default: `true`): 화살표 함수 스코프 검사 여부

**❌ incorrect**

```ts
function process(items: Item[]) {
  function format(item: Item) {
    return item.name.toUpperCase()
  }
  return items.map(format)
}
```

**✅ correct**

```ts
function format(item: Item) {
  return item.name.toUpperCase()
}

function process(items: Item[]) {
  return items.map(format)
}
```

## [unicorn/no-array-sort](https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-array-sort)

`Array#sort()`는 원본 배열을 제자리에서 변경해 호출자가 예측하기 어렵다. 새 배열을 반환하는 `Array#toSorted()`(ES2023)를 사용한다.

**베스트 프랙티스.** 인-플레이스 변경은 함수형 흐름에서 미묘한 버그를 만들기 쉬워 `toSorted`가 의도를 더 잘 드러낸다.

**Configuration**

- `allowExpressionStatement` (bool, default: `true`): 단독 문 위치의 `arr.sort()` 호출은 허용

**❌ incorrect**

```ts
const sorted = [...array].sort()
```

**✅ correct**

```ts
const sorted = array.toSorted()
```
