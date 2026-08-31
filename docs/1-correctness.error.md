---
title: "Correctness 채택 규칙"
---

## [eslint/no-dupe-keys](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-dupe-keys)

같은 객체 키가 중복되어 앞 값이 뒤 값으로 덮인다. 키를 하나만 남기거나 서로 다른 이름을 사용한다.

**베스트 프랙티스.** 키 중복은 의도된 사용이 거의 없는 명백한 버그라 오탐 없이 검출할 수 있다.

**❌ incorrect**

```ts
const duplicated = {
  state: "first state",
  state: "second state",
}
```

**✅ correct**

```ts
const settings = {
  state: "second state",
}
```

## [eslint/no-unused-vars](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-unused-vars)

선언한 값을 읽지 않아 사용되지 않는 코드가 된다. 값을 사용하거나 선언을 삭제한다.

**베스트 프랙티스.** 사용되지 않는 코드는 가독성과 번들 크기를 동시에 악화시키므로 즉시 제거하는 편이 낫고, `ignoreRestSiblings: true`로 한 프로퍼티를 의도적으로 제거하는 구조 분해(`const { password, ...safeUser } = user`)는 허용한다.

**Configuration**

- `vars` (`"all" | "local"`, default: `"all"`): 변수 검사 범위 (전체 vs 로컬)
- `varsIgnorePattern` (regex string, default: `"^_"`): 무시할 변수 이름 패턴
- `args` (`"after-used" | "all" | "none"`, default: `"after-used"`): 함수 인자 미사용 검사 방식
- `argsIgnorePattern` (regex string, default: `"^_"`): 무시할 인자 이름 패턴
- `caughtErrors` (`"all" | "none"`, default: 없음): catch 블록 오류 변수 검사 여부
- `caughtErrorsIgnorePattern` (regex string, default: 없음): 무시할 catch 변수 패턴
- `destructuredArrayIgnorePattern` (regex string, default: 없음): 무시할 배열 구조분해 패턴
- `ignoreRestSiblings` (bool, default: `false`): rest로 빠지는 형제 프로퍼티 무시
- `ignoreClassWithStaticInitBlock` (bool, default: `false`): static 초기화 블록 있는 클래스 무시
- `ignoreUsingDeclarations` (bool, default: `false`): `using`/`await using` 선언 무시
- `reportUsedIgnorePattern` (bool, default: `false`): 무시 패턴에 매칭되지만 실제 사용된 변수 보고
- `reportVarsOnlyUsedAsTypes` (bool, default: `false`): 타입으로만 사용된 변수 보고
- `fix` (object, default: `{ imports: "suggestion", variables: "suggestion" }`): 자동 수정 세부 제어

**⚙️ 설정**

```json
{
  "eslint/no-unused-vars": ["error", { "ignoreRestSiblings": true }]
}
```

**❌ incorrect**

```ts
const unusedMessage = "intentionally unused local value"
```

**✅ correct**

export로 다른 모듈이 소비하는 값.

```ts
export const message = "consumed by another module"
```

**✅ correct**

`ignoreRestSiblings`로 rest로 빠지는 형제는 허용된다.

```ts
const { password, ...safeUser } = user
return safeUser
```

## [jsx-a11y/alt-text](https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/alt-text)

이미지에 `alt`가 없어 보조 기술이 내용을 알 수 없다. 의미 있는 `alt`를 쓰거나 장식 이미지에는 `alt=""`를 사용한다.

**베스트 프랙티스.** 접근성 기본 요건이고, 이미지가 의미인지 장식(`alt=""`)인지 의도 표명을 강제한다.

**Configuration**

- `img` (string[], default: `[]`): `img`로 취급할 사용자 지정 컴포넌트 이름
- `object` (string[], default: `[]`): `object`로 취급할 사용자 지정 컴포넌트 이름
- `area` (string[], default: `[]`): `area`로 취급할 사용자 지정 컴포넌트 이름
- `input[type="image"]` (string[], default: `[]`): `input[type="image"]`로 취급할 사용자 지정 컴포넌트 이름

**❌ incorrect**

```tsx
<img src="/image.png" />
```

**✅ correct**

```tsx
<img src="/image.png" alt="Company logo" />
```

## [jsx-a11y/anchor-is-valid](https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/anchor-is-valid)

`href` 없는 anchor는 키보드와 보조 기술에서 링크 의미가 깨진다. 이동이면 `href`를 넣고, 동작이면 `button`을 사용한다.

**베스트 프랙티스.** anchor와 button 혼용은 키보드, 스크린리더 사용자에게 즉시 영향을 주는 흔한 실수다.

**Configuration**

- `validHrefs` (string[], default: `[]`): 유효한 href 값으로 추가 허용할 문자열 목록

**❌ incorrect**

```tsx
<a onClick={open}>Open</a>
```

**✅ correct**

```tsx
<button type="button" onClick={open}>
  Open
</button>
```

## [jsx-a11y/click-events-have-key-events](https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/click-events-have-key-events)

클릭 가능한 비대화형 요소에 키보드 이벤트가 없어 키보드 조작이 막힌다. `button`을 사용하거나 `role`, `tabIndex`, key handler를 함께 제공한다.

**베스트 프랙티스.** 키보드 사용자 차단은 자주 놓치는 결함이라 정적으로 잡을 가치가 크다.

**❌ incorrect**

```tsx
<div onClick={open}>Open</div>
```

**✅ correct**

```tsx
<button type="button" onClick={open}>
  Open
</button>
```

## [jsx-a11y/control-has-associated-label](https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/control-has-associated-label)

버튼, 입력, 링크 같은 상호작용 요소에 접근 가능한 텍스트 레이블이 없어 보조 기술 사용자가 컨트롤의 용도를 알 수 없다. 텍스트 콘텐츠나 `aria-label`/`aria-labelledby`를 넣거나 `<label>`로 감싼다.

**베스트 프랙티스.** `label-has-associated-control`이 `<label>`과 컨트롤의 연결을 보는 반면 이 규칙은 컨트롤 쪽에 접근 가능한 이름이 존재하는지를 보장해, 아이콘 전용 버튼처럼 레이블 텍스트가 비는 흔한 누락을 검출한다.

**Configuration**

- `controlComponents` (string[], default: `[]`): 상호작용 컨트롤로 취급할 사용자 지정 컴포넌트
- `depth` (integer, default: `2`): 요소 내부에서 접근 가능한 레이블을 탐색할 최대 깊이
- `ignoreElements` (string[], default: `[]`): 검사에서 제외할 요소
- `ignoreRoles` (string[], default: `[]`): 검사에서 제외할 상호작용 role
- `labelAttributes` (string[], default: `[]`): 접근 가능한 레이블 텍스트로 인정할 추가 속성

**❌ incorrect**

```tsx
<button type="button" />
<a href="/path" />
```

**✅ correct**

```tsx
<button type="button" aria-label="Save" />
<a href="/path">Learn more</a>
```

## [jsx-a11y/label-has-associated-control](https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/label-has-associated-control)

`<label>`이 폼 컨트롤과 연결되지 않으면 스크린리더가 레이블과 입력의 짝을 알 수 없고 레이블 클릭으로 컨트롤에 포커스할 수도 없다. `htmlFor`로 컨트롤 `id`를 가리키거나 컨트롤을 레이블 안에 중첩한다.

**베스트 프랙티스.** 폼 접근성의 기본 요건이고, 레이블과 컨트롤 연결 누락은 정적으로 거의 확실히 검출된다.

**Configuration**

- `assert` (`"htmlFor" | "nesting" | "both" | "either"`, default: `"either"`): 허용할 연결 방식
- `controlComponents` (string[], default: `[]`): 폼 컨트롤로 취급할 사용자 지정 컴포넌트
- `depth` (number, default: `2`): 중첩 컨트롤 탐색 깊이
- `labelAttributes` (string[], default: `["alt", "aria-label", "aria-labelledby"]`): 레이블 텍스트로 인정할 속성
- `labelComponents` (string[], default: `["label"]`): 레이블로 취급할 사용자 지정 컴포넌트

**❌ incorrect**

```tsx
<label>Surname</label>
<input id="surname" type="text" />
```

**✅ correct**

`htmlFor`로 컨트롤 `id`를 가리키는 방식.

```tsx
<label htmlFor="surname">Surname</label>
<input id="surname" type="text" />
```

**✅ correct**

컨트롤을 레이블 안에 중첩하는 방식.

```tsx
<label>
  Surname
  <input type="text" />
</label>
```

## [jsx-a11y/no-noninteractive-tabindex](https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/no-noninteractive-tabindex)

비대화형 요소가 `tabIndex`로 포커스 대상이 되어 탐색 흐름이 어색해진다. 포커스가 필요한 동작은 `button`, `a` 같은 네이티브 요소로 표현한다.

**베스트 프랙티스.** 잘못된 접근성 시도가 오히려 탐색 흐름을 망가뜨리는 패턴을 차단한다.

**Configuration**

- `allowExpressionValues` (bool, default: `true`): `tabIndex` 값이 표현식(변수, 삼항)일 때 허용
- `roles` (string[], default: `["tabpanel"]`): 상호작용 요소로 허용할 ARIA role 목록
- `tags` (string[], default: `[]`): 상호작용 요소로 허용할 사용자 지정 HTML 요소 목록

**❌ incorrect**

```tsx
<ul tabIndex={0}>
  <li>Item</li>
</ul>
```

**✅ correct**

```tsx
<ul>
  <li>Item</li>
</ul>
```

## [jsx-a11y/no-static-element-interactions](https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/no-static-element-interactions)

`<div>`이나 `<span>` 같은 정적 요소에 클릭, 키 핸들러가 붙으면 보조 기술이 그 요소를 상호작용 요소로 인식하지 못한다. 시맨틱 요소(`<button>`, `<a>`)로 바꾸거나 적절한 `role`을 지정한다.

**베스트 프랙티스.** `click-events-have-key-events`가 키보드 이벤트 누락을 검출하는 반면 이 규칙은 시맨틱(role) 누락을 검출해, 둘이 함께 켜져야 `<div onClick>` 패턴의 양면을 모두 차단한다.

**Configuration**

- `allowExpressionValues` (bool, default: `false`): `role` 값이 표현식일 때 허용
- `handlers` (string[], default: `null`): 규칙 발동 대상 핸들러 이름 목록

**❌ incorrect**

```tsx
<div onClick={open}>Open</div>
```

**✅ correct**

시맨틱 요소(`<button>`)로 바꾸는 방식.

```tsx
<button type="button" onClick={open}>
  Open
</button>
```

**✅ correct**

`role`과 키보드 이벤트를 함께 지정하는 방식.

```tsx
<div role="button" tabIndex={0} onClick={open} onKeyDown={openOnEnter}>
  Open
</div>
```

## [jsx-a11y/prefer-tag-over-role](https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/prefer-tag-over-role)

`role="button"`처럼 제네릭 요소에 ARIA role을 붙이는 대신, 같은 역할을 기본 제공하는 시맨틱 HTML 태그를 사용하도록 강제한다. `<div role="button">`은 `<button>`으로 대체한다.

**베스트 프랙티스.** 시맨틱 태그는 role뿐 아니라 키보드 동작, 포커스 관리까지 네이티브로 제공하므로, role로 흉내 내는 것보다 접근성과 가독성이 모두 낫다.

**❌ incorrect**

```tsx
<div role="button" onClick={open}>
  Open
</div>
```

**✅ correct**

```tsx
<button type="button" onClick={open}>
  Open
</button>
```

## [react/exhaustive-deps](https://oxc.rs/docs/guide/usage/linter/rules/react/exhaustive-deps)

effect 안에서 읽는 값이 의존성 배열에 없어 오래된 값을 참조할 수 있다. 의존성 배열에 effect가 읽는 모든 값을 포함한다.

**베스트 프랙티스.** stale closure는 React에서 가장 흔한 버그 원천이고 자동 수정도 신뢰할 만하다.

**Configuration**

- `additionalHooks` (regex string, default: `null`): 의존성 검사를 확장 적용할 추가 사용자 지정 훅 패턴

**❌ incorrect**

```tsx
useEffect(() => {
  document.title = props.title
}, [])
```

**✅ correct**

```tsx
useEffect(() => {
  document.title = props.title
}, [props.title])
```

## [react/refs](https://oxc.rs/docs/guide/usage/linter/rules/react/refs)

렌더링 중 `ref.current`를 읽거나 쓰면 React가 값의 변경을 추적하지 못한다. `ref.current` 접근은 이벤트 핸들러나 effect 안에서만 수행한다.

**베스트 프랙티스.** 렌더링 중 `ref.current`를 읽으면 React가 값 변경을 구독하지 않아 화면에 오래된 값이 남을 수 있고, DOM 연결 전 값을 참조할 수도 있다.

**❌ incorrect**

```tsx
function SearchInput() {
  const inputRef = useRef<HTMLInputElement>(null)
  const value = inputRef.current?.value
  return <span>{value}</span>
}
```

**✅ correct**

```tsx
function SearchInput() {
  const inputRef = useRef<HTMLInputElement>(null)

  function readValue() {
    return inputRef.current?.value
  }

  return <input ref={inputRef} onChange={readValue} />
}
```

## [react/set-state-in-effect](https://oxc.rs/docs/guide/usage/linter/rules/react/set-state-in-effect)

effect 본문에서 상태를 동기적으로 변경하면 즉시 추가 렌더링이 발생한다. props와 상태에서 얻을 수 있는 값은 렌더링 중 계산한다.

**베스트 프랙티스.** effect에서 파생 상태를 즉시 변경하면 첫 렌더링 직후 같은 값을 다시 렌더링하므로, 파생 관계를 직접 계산해 불필요한 렌더링과 상태 동기화 오류를 함께 없앤다.

**❌ incorrect**

```tsx
const [isSelected, setIsSelected] = useState(false)

useEffect(() => {
  setIsSelected(selectedId === itemId)
}, [itemId, selectedId])
```

**✅ correct**

```tsx
const isSelected = selectedId === itemId
```

## [typescript/no-base-to-string](https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-base-to-string)

객체를 문자열로 변환했을 때 기본값인 `"[object Object]"`가 나올 수 있는 호출을 금지한다. 문자열로 표현할 필드를 직접 선택하거나 유용한 `toString` 구현을 제공한다.

**베스트 프랙티스.** 로그, UI, 식별자에 의미 없는 기본 문자열이 섞이는 결함을 타입 정보로 미리 차단하며, 문자열 변환 의도를 코드에 드러낸다.

**Configuration**

- `checkUnknown` (bool, default: `false`): `unknown` 타입 값의 문자열 변환도 검사
- `ignoredTypeNames` (string[], default: `["Error", "RegExp", "URL", "URLSearchParams"]`): 유용한 문자열을 반환한다고 간주해 검사에서 제외할 타입명 목록

**❌ incorrect**

```ts
const user = { id: 1, name: "Ada" }
const label = user.toString()
```

**✅ correct**

```ts
const user = { id: 1, name: "Ada" }
const label = `${user.id}:${user.name}`
```

## [typescript/no-floating-promises](https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-floating-promises)

처리되지 않은 Promise는 reject 시 `unhandledrejection`으로 보고되어 디버깅이 어려워진다. `await`을 붙이거나 `.catch()`를 연결하거나 `void` 연산자로 의도를 명시한다.

**베스트 프랙티스.** 처리하지 않은 reject는 환경마다 동작이 달라 추적이 어려우므로 반드시 처리하는 편이 안전하다.

**Configuration**

- `ignoreVoid` (bool, default: `true`): `void` 연산자로 처리된 Promise 무시
- `ignoreIIFE` (bool, default: `false`): Promise를 호출하는 IIFE 무시
- `checkThenables` (bool, default: `false`): Promise가 아닌 thenable 객체도 검사
- `allowForKnownSafePromises` (array, default: `[]`): 무시할 특정 Promise 타입 지정
- `allowForKnownSafeCalls` (array, default: `[]`): 무시할 특정 함수 호출 지정

**❌ incorrect**

```ts
Promise.resolve("forgotten")
```

**✅ correct**

```ts
await Promise.resolve("awaited")
```

## [unicorn/no-new-array](https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-new-array)

`new Array(n)` 생성자는 인자 하나가 길이인지 단일 요소인지 호출 형태만으로 알기 어렵다. 길이 기반 생성은 `Array.from({ length: n })`, 요소 리터럴은 `[value]`처럼 의도가 분명한 표기를 사용한다.

**베스트 프랙티스.** `Array.from({ length: n }, mapFn)` 형태는 빈 슬롯 없이 매핑까지 한 번에 끝낼 수 있어 `new Array(n).fill(...)` + `.map(...)` 체이닝의 가독성, 메모리 비효율도 함께 해결한다 (다만 규칙은 `new` 생성자 호출만 검출하므로 `Array(n).fill(...)`은 잡히지 않는다).

**❌ incorrect**

```ts
const slots = new Array(5)
const zeros = new Array(5).fill(0)
```

**✅ correct**

```ts
const slots = Array.from({ length: 5 })
const zeros = Array.from({ length: 5 }, () => 0)
```

## [vitest/require-to-throw-message](https://oxc.rs/docs/guide/usage/linter/rules/vitest/require-to-throw-message)

`.toThrow()` 또는 `.toThrowError()`를 인자 없이 호출하면 예외가 발생하기만 하면 어떤 오류든 통과한다. 기대 메시지나 오류 클래스를 인자로 명시해 발생한 오류까지 검증한다.

**베스트 프랙티스.** 인자가 없으면 회귀로 다른 원인의 오류가 발생해도 테스트가 그대로 통과해 결함을 감춘다.

**❌ incorrect**

```ts
expect(() => parse(input)).toThrow()
await expect(load()).rejects.toThrow()
```

**✅ correct**

```ts
expect(() => parse(input)).toThrow("Unexpected token")
await expect(load()).rejects.toThrow("not found")
```
