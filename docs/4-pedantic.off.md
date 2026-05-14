# Pedantic 제외 규칙

## [eslint/no-inline-comments](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-inline-comments)

### 설명

- 코드와 같은 줄에 붙는 인라인 주석을 금지하는 룰.
- 모든 주석을 별도 줄로 분리하도록 강제한다.

### 근거

- **취향.** 한 줄 메모는 코드 옆에 붙어 있을 때 의미가 가장 분명하다.
- 별도 줄로 분리하면 시각적 흐름이 끊긴다.

### 설정

- `ignorePattern` (regex string, default: 없음): 무시할 인라인 주석 패턴

### 예시

**🆗 rule: incorrect (허용)**

```ts
const count = 0 // initial value
```

**⚠️ rule: correct (노이즈)**

```ts
// initial value
const count = 0
```

## [eslint/no-negated-condition](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-negated-condition) + [unicorn/no-negated-condition](https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-negated-condition)

### 설명

- `if (!x) A else B`나 `!x ? a : b`처럼 부정 조건을 우선 분기에 두면 흐름이 거꾸로 읽힌다는 룰.
- 긍정 조건을 먼저 두도록 강제한다.
- oxlint에서 두 룰은 `if`와 삼항을 모두 잡는 동치 룰이다.

### 근거

- **취향.** `if`와 삼항 모두 부정 조건이 자연스러운 경우가 많아 일률 금지는 노이즈가 크다.
- 양쪽을 모두 끈다.
- 코드 예시는 룰이 잡는 부정 조건 사용 두 형태(`if`와 삼항)를 보여준다.

### 설정

없음

### 예시

**🆗 rule: incorrect (허용)**

`if` 문에서 부정 조건을 우선 분기에 두는 형태.

```ts
if (!isReady) {
  wait()
} else {
  start()
}
```

**🆗 rule: incorrect (허용)**

삼항식에서 부정 조건을 우선 분기에 두는 형태.

```ts
const label = !isReady ? "wait" : "go"
```

**⚠️ rule: correct (노이즈)**

`if` 문을 긍정 조건으로 재정렬한 형태.

```ts
if (isReady) {
  start()
} else {
  wait()
}
```

**⚠️ rule: correct (노이즈)**

삼항식을 긍정 조건으로 재정렬한 형태.

```ts
const label = isReady ? "go" : "wait"
```

## [eslint/no-warning-comments](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-warning-comments)

### 설명

- `// TODO`, `// FIXME`, `// XXX` 같은 작업 표시 주석을 금지하는 룰.
- 미완성 작업 흔적을 코드에 남기지 못하게 한다.

### 근거

- **취향.** TODO와 FIXME는 진행 중 작업을 표시하는 의도된 마커.
- lint 에러로 잡으면 매번 disable 주석으로 우회하거나 메모를 강제로 지우게 된다.
- 인라인 메모와 이슈 트래커는 역할이 다르므로 룰 자체를 끈다.

### 설정

- `terms` (array, default: `["todo", "fixme", "xxx"]`): 매칭할 용어 목록
- `location` (string, default: `"start"`): 검사 위치 (`start` 주석 시작 / `anywhere` 전체)
- `decoration` (array, default: `[]`): 무시할 시작 문자 (예: JSDoc의 `*`)

### 예시

**🆗 rule: incorrect (허용)**

```ts
// TODO: 검색 결과 페이지네이션 추가
function loadResults(query: string) {
  return fetchSearch(query)
}
```

## [typescript/only-throw-error](https://oxc.rs/docs/guide/usage/linter/rules/typescript/only-throw-error)

### 설명

- `throw` 문에 `Error` 인스턴스가 아닌 값(문자열, 객체 리터럴, 함수 호출 결과 등)을 던지는 패턴을 금지하는 룰.
- 스택 트레이스가 사라지거나 도구가 인식하지 못하는 위험을 막는다.

### 근거

- **취향.** TanStack Router는 인증/리디렉션을 `beforeLoad`에서 [`throw redirect({...})`](https://tanstack.com/router/latest/docs/guide/authenticated-routes)로 처리하도록 권장한다.
- `redirect()`는 `Error` 서브클래스가 아닌 라우터 컨트롤 플로우 객체라 룰이 false positive로 모두 잡는다.
- 라우팅 전반에서 빈번한 패턴이라 단위별 disable로는 노이즈가 커서 카테고리째 끈다.

### 설정

- `allow` (array, default: `[]`): 허용할 비-Error 타입/값 지정자 목록 (string, file, lib, package 형식)
- `allowRethrowing` (bool, default: `true`): `catch`에서 잡힌 비-Error 값의 재throw 허용
- `allowThrowingAny` (bool, default: `true`): `any` 타입 값 throw 허용
- `allowThrowingUnknown` (bool, default: `true`): `unknown` 타입 값 throw 허용

### 예시

**🆗 rule: incorrect (허용)**

```tsx
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_authed")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: "/login", search: { redirect: location.href } })
    }
  },
})
```

## [typescript/prefer-readonly-parameter-types](https://oxc.rs/docs/guide/usage/linter/rules/typescript/prefer-readonly-parameter-types)

### 설명

- 변경 가능한 객체 파라미터에 `readonly` 속성 사용을 강제하는 룰.
- 함수가 입력을 변경하지 않는다는 계약을 타입으로 표현한다.

### 근거

- **취향.** 모든 객체 파라미터마다 `readonly` 키워드가 늘어나 시그니처 가독성이 크게 떨어진다.
- 외부 라이브러리 타입이 readonly가 아닐 때 가짜 위반도 폭증한다.

### 설정

- `allow` (array, default: `[]`): 검사에서 제외할 타입/값 지정자 목록
- `checkParameterProperties` (bool, default: `true`): 생성자 파라미터 프로퍼티 검사
- `ignoreInferredTypes` (bool, default: `false`): 명시적 타입 annotation 없는 파라미터 제외
- `treatMethodsAsReadonly` (bool, default: `false`): 변경 가능 메서드를 readonly로 간주

### 예시

**🆗 rule: incorrect (허용)**

```ts
function mutate(options: { count: number }) {
  options.count += 1
}
```

**⚠️ rule: correct (노이즈)**

```ts
function read(options: { readonly count: number }) {
  return options.count + 1
}
```

## [typescript/strict-boolean-expressions](https://oxc.rs/docs/guide/usage/linter/rules/typescript/strict-boolean-expressions)

### 설명

- `if (value)`처럼 truthy/falsy에 의존하는 분기는 `0`, `""`, `null` 등에서 의도치 않은 동작을 만든다는 룰.
- `value !== null` 등 명시적 비교로 교체를 요구한다.

### 근거

- **취향.** 안전성은 향상되지만 코드가 매우 장황해져 가독성과 트레이드오프가 크다.

### 설정

- `allowAny` (bool, default: `false`): boolean 컨텍스트에서 `any` 허용
- `allowNullableBoolean` (bool, default: `false`): `boolean | null | undefined` 허용
- `allowNullableEnum` (bool, default: `false`): nullable enum 허용
- `allowNullableNumber` (bool, default: `false`): `number | null | undefined` 허용
- `allowNullableObject` (bool, default: `true`): nullable object 허용
- `allowNullableString` (bool, default: `false`): `string | null | undefined` 허용
- `allowNumber` (bool, default: `true`): `number`를 boolean 컨텍스트에서 허용
- `allowString` (bool, default: `true`): `string`을 boolean 컨텍스트에서 허용

### 예시

**🆗 rule: incorrect (허용)**

```ts
if (text) {
  render(text)
}
```

**⚠️ rule: correct (노이즈)**

```ts
if (text !== null && text !== undefined && text.length > 0) {
  render(text)
}
```

## [typescript/strict-void-return](https://oxc.rs/docs/guide/usage/linter/rules/typescript/strict-void-return)

### 설명

- `void` 반환 타입의 콜백에서 값을 반환하지 못하게 하는 룰.
- 호출자가 반환값을 무시한다는 계약을 보호한다.

### 근거

- **취향.** `void` 콜백에 한 줄 함수를 쓰는 흔한 패턴까지 잡아 코드만 부풀린다.

### 설정

- `allowReturnAny` (bool, default: `false`): void 콜백 위치에서 `any` 반환 허용

### 예시

**🆗 rule: incorrect (허용)**

```ts
const handlers: Array<() => void> = [() => fetchValue()]
```

**⚠️ rule: correct (노이즈)**

```ts
const handlers: Array<() => void> = [
  () => {
    fetchValue()
  },
]
```
