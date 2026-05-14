# Restriction 채택 규칙

## [eslint/default-case](https://oxc.rs/docs/guide/usage/linter/rules/eslint/default-case)

### 설명

- 모든 `switch` 문에 `default` 절을 강제한다.
- 누락된 분기에 대한 런타임 안전망을 만들어 fall-through로 인한 무음 버그를 차단한다.
- 의도적으로 default를 비울 때는 `// no default` 코멘트로 명시한다.

### 근거

- **베스트 프랙티스.** `typescript/switch-exhaustiveness-check`(pedantic)는 컴파일 타임에 알려진 union/enum의 분기를 강제하지만, 외부 입력이나 임의 문자열 같은 런타임 값에는 효과가 없다.
- `eslint/default-case`는 분기 종류와 무관하게 명시적 `default`를 요구해 두 룰이 보호 범위를 보완한다.
- 의도적 누락은 `// no default` 코멘트로 신호를 남겨 PR 리뷰에서 의도와 실수가 구분된다.

### 설정

- `commentPattern` (regex, default: `"no default"`): default 생략을 허용으로 인식할 코멘트 패턴

### 예시

**❌ incorrect**

```ts
switch (status) {
  case "ok":
    return "ok"
  case "fail":
    return "fail"
}
```

**✅ correct**

`default` 절을 명시한 형태.

```ts
switch (status) {
  case "ok":
    return "ok"
  case "fail":
    return "fail"
  default:
    return "unknown"
}
```

**✅ correct**

의도적 누락은 `// no default` 코멘트로 표시한다.

```ts
switch (status) {
  case "ok":
    return "ok"
  case "fail":
    return "fail"
  // no default
}
```

## [eslint/no-alert](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-alert)

### 설명

- `alert`/`confirm`/`prompt` 같은 차단성 브라우저 다이얼로그 호출을 금지한다.
- 운영 코드에 남으면 UX를 끊고 임시 디버그 코드가 그대로 머지되는 흔적이 된다.

### 근거

- **베스트 프랙티스.** SPA 환경에서 네이티브 다이얼로그는 디자인 시스템과 일관성이 깨지고, 모바일에서는 더 어색하다.
- 운영 알림은 토스트, 모달 컴포넌트로, 확인은 커스텀 컨펌 다이얼로그로 처리한다.
- 디버깅 중 임시 흔적이 필요하다면 `console.warn`/`console.error`(`no-console`의 `allow`로 허용 중)가 추적성도 좋고 흔적이 의도된 채널에 모인다.

### 설정

없음

### 예시

**❌ incorrect**

```ts
alert("저장되었습니다")
if (confirm("삭제하시겠습니까?")) {
  remove()
}
```

**✅ correct**

```ts
showToast("저장되었습니다")
if (await openConfirmDialog("삭제하시겠습니까?")) {
  remove()
}
```

## [eslint/no-console](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-console)

### 설명

- `console.*` 호출을 차단해 디버그 흔적이 운영 코드에 남지 않도록 한다.
- `allow` 옵션으로 의도된 로깅 메서드만 허용한다.

### 근거

- **베스트 프랙티스.** `console.log`는 디버깅 임시 코드의 대표 흔적이라 PR에 섞여 머지되기 쉽다.
- `warn`/`error`/`info`는 의도된 사용자 메시지이거나 비정상 흐름 알림이라 차단할 필요가 없으므로 `allow`로 풀고, `log`만 막아 임시 코드만 정조준한다.

### 설정

- `allow` (string[], default: `[]`): 허용할 console 메서드 이름 목록

### 예시

```json
{
  "eslint/no-console": ["error", { "allow": ["warn", "error", "info"] }]
}
```

**❌ incorrect**

```ts
console.log("debug payload", payload)
```

**✅ correct**

```ts
console.warn("deprecated API used")
console.error(error)
console.info("retrying request")
```

## [eslint/no-empty-function](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-empty-function)

### 설명

- 빈 본문을 가진 함수, 메서드를 금지한다.
- 의도된 noop인지 미완성 코드인지 구분되지 않아 PR 리뷰에서 무음 버그로 흘러가기 쉽다.

### 근거

- **베스트 프랙티스.** `allow: ["arrowFunctions"]`로 빈 화살표 함수만 풀어준다.
- props 기본값(`onChange = () => {}`)이나 Context 초기값(`createContext({ open: () => {}, close: () => {} })`)에서 빈 화살표 함수는 의도된 noop 관용구라 막을 이유가 없다.
- 함수 선언, 메서드, 생성자에서 빈 본문은 미완성 신호가 더 강하므로 그대로 잡는다.

### 설정

- `allow` (string[], default: `[]`): 비어 있어도 허용할 함수 종류. 가능한 값은 `"functions"`, `"arrowFunctions"`, `"generatorFunctions"`, `"methods"`, `"generatorMethods"`, `"getters"`, `"setters"`, `"constructors"`, `"asyncFunctions"`, `"asyncMethods"`, `"privateConstructors"`, `"protectedConstructors"`, `"decoratedFunctions"`, `"overrideMethods"`

### 예시

```json
{
  "eslint/no-empty-function": ["error", { "allow": ["arrowFunctions"] }]
}
```

**❌ incorrect**

```ts
function pending() {}
class Service {
  doWork() {}
}
```

**✅ correct**

```ts
const noop = () => {}
const ModalContext = createContext({ open: () => {}, close: () => {} })
```

## [eslint/no-use-before-define](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-use-before-define)

### 설명

- 식별자를 정의 전에 사용하면 호이스팅에 의존한 사용 흐름이 만들어진다.
- 변수, 클래스는 TDZ 또는 런타임 에러로 이어지므로 잡고, 함수는 호이스팅이 안전해 풀어준다.

### 근거

- **베스트 프랙티스.** `functions: false`로 함수 호이스팅만 허용해 "메인 컴포넌트(`function Page`)는 파일 상단, 보조 함수는 그 아래" 같은 코드 정렬 패턴을 유지한다.
- TanStack Router의 `createFileRoute(...)({ component: Page })` 패턴이 라우트 export를 상단에, 컴포넌트 정의를 하단에 두기 때문에 함수 호이스팅 허용이 라우트 모듈의 자연스러운 가독성과 직결된다.
- 변수, 클래스 호이스팅은 여전히 위험 신호라 그대로 잡는다.

### 설정

- `functions` (bool, default: `true`): 함수 선언 검사
- `classes` (bool, default: `true`): 클래스 선언 검사
- `variables` (bool, default: `true`): 변수 선언 검사
- `enums` (bool, default: `true`): enum 선언 검사
- `typedefs` (bool, default: `true`): 타입 별칭, 인터페이스, 타입 파라미터 검사
- `ignoreTypeReferences` (bool, default: `true`): 타입 전용 참조 무시
- `allowNamedExports` (bool, default: `false`): 선언 전 named export 허용

### 예시

```json
{
  "eslint/no-use-before-define": ["error", { "functions": false }]
}
```

**❌ incorrect**

```ts
register(value)
const value = 1
```

**✅ correct**

```ts
export const Route = createFileRoute("/")({
  component: HomePage,
})
function HomePage() {
  return <div>Home</div>
}
```

## [eslint/no-void](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-void)

### 설명

- `void` 연산자는 표현식 결과를 undefined로 만드는 역사적 문법이라 일반 표현식 안에 섞이면 의도가 모호해진다.
- statement 형태(`void promise`)만 풀어두면 fire-and-forget Promise 관용구를 유지하면서도 식 안의 `void` 사용은 차단할 수 있다.

### 근거

- **베스트 프랙티스.** `allowAsStatement: true`로 단독 statement 자리의 `void`만 허용한다.
- floating promise를 의도적으로 무시한다는 신호로 `void doAsyncWork()` 패턴이 자주 쓰이는 반면, `const x = void 0` 같은 표현식 안 사용은 `undefined`로 직접 쓰면 충분해 차단해도 노이즈가 없다.

### 설정

- `allowAsStatement` (bool, default: `false`): 단독 문 위치의 `void` 허용

### 예시

```json
{
  "eslint/no-void": ["error", { "allowAsStatement": true }]
}
```

**❌ incorrect**

```ts
const ignored = void someExpression
return void cleanup()
```

**✅ correct**

```ts
void doAsyncWork()
```

## [import/no-relative-parent-imports](https://oxc.rs/docs/guide/usage/linter/rules/import/no-relative-parent-imports)

### 설명

- `../`로 부모 디렉터리를 거슬러 올라가는 import를 금지한다.
- 같은 디렉터리, 하위 디렉터리 import(`./`)와 외부 패키지, alias import는 그대로 허용한다.

### 근거

- **베스트 프랙티스.** 이 프로젝트는 `@` alias가 `src/`로 설정되어 있어 부모 경로 import는 모두 `@/...`로 대체할 수 있다.
- `../../`처럼 깊이 거슬러 올라가는 경로는 파일을 다른 디렉터리로 옮기는 순간 깨지고, 모듈이 자기 위치에 결합되어 리팩터링 비용을 키운다.
- alias를 강제해 import 경로를 파일 위치와 무관하게 안정화하고, 같은 디렉터리 안 협력자는 `./`로 가까운 결합을 유지한다.

### 설정

없음

### 예시

**❌ incorrect**

```ts
import { formatDate } from "../../utils/date"
import Button from "../components/Button"
```

**✅ correct**

alias로 부모 경로를 대체한다.

```ts
import { formatDate } from "@/utils/date"
import Button from "@/components/Button"
```

**✅ correct**

같은 디렉터리 안 협력자는 `./`로 가까운 결합을 유지한다.

```ts
import { helper } from "./helper"
```

## [import/unambiguous](https://oxc.rs/docs/guide/usage/linter/rules/import/unambiguous)

### 설명

- `import`/`export`가 하나도 없는 파일은 모듈인지 스크립트인지 모호하다.
- 최소 하나의 `import`/`export`로 모듈임을 명시한다.

### 근거

- **베스트 프랙티스.** 모듈/스크립트 모호성을 없애 도구 추론과 사용자 기대를 일치시킨다.
- ambient declaration 파일(`*.d.ts`)은 `declare module`, `interface` 선언만 두고 export를 비우는 정상 패턴이라 override로 끈다.

### 설정

없음

### 예시

```json
{
  "rules": {
    "import/unambiguous": "error"
  },
  "overrides": [{ "files": ["**/*.d.ts"], "rules": { "import/unambiguous": "off" } }]
}
```

**❌ incorrect**

```ts
const value = 1
```

**✅ correct**

최소 하나의 `export`로 모듈임을 명시한다.

```ts
export const value = 1
```

**✅ correct**

`**/*.d.ts`의 ambient declaration은 override로 허용된다.

```ts
declare module "some-pkg" {
  interface Options {
    flag: boolean
  }
}
```

## [react/button-has-type](https://oxc.rs/docs/guide/usage/linter/rules/react/button-has-type)

### 설명

- `<button>`의 `type` 속성이 누락되면 HTML 기본값이 `"submit"`이라 폼 내부에 놓인 버튼이 의도하지 않은 폼 제출을 일으킨다.
- `type="button"`을 명시해 클릭과 Enter 키가 폼 제출로 새지 않도록 한다.

### 근거

- **베스트 프랙티스.** 별도 핸들러를 의도한 버튼이라도 `<form>` 안에서 type을 적지 않으면 첫 번째 버튼이 Enter나 클릭으로 폼을 제출한다.
- 명시 비용이 거의 없고 무음 제출 버그를 정확히 차단하므로 채택한다.
- 세 가지 유효 type을 모두 허용하는 기본 옵션이면 충분하다.

### 설정

- `button` (bool, default: `true`): `type="button"` 허용
- `reset` (bool, default: `true`): `type="reset"` 허용
- `submit` (bool, default: `true`): `type="submit"` 허용

### 예시

**❌ incorrect**

```tsx
<button onClick={handleCancel}>Cancel</button>
```

**✅ correct**

```tsx
<button type="button" onClick={handleCancel}>Cancel</button>
<button type="submit">Save</button>
```

## [react/jsx-filename-extension](https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-filename-extension)

### 설명

- JSX 문법은 `.tsx` 확장자에서만 작성한다.
- 도구 추론과 에디터 설정이 명확해진다.

### 근거

- **베스트 프랙티스.** 룰의 기본 옵션은 `.jsx`만 허용하므로 TypeScript+React 환경에서는 `extensions: [".tsx"]` 옵션을 명시한다.
- 코드 예시는 동일한 컴포넌트를 `.ts` 확장자로 둔 형태와 `.tsx`로 정정한 형태를 대비시킨다.

### 설정

- `allow` (`"always" | "as-needed"`, default: `"always"`): `"as-needed"`는 실제 JSX 포함 파일만 검사
- `extensions` (string[], default: `[".jsx"]`): 유효한 파일 확장자 목록
- `ignoreFilesWithoutCode` (bool, default: `false`): 빈 파일, 주석만 있는 파일 무시

### 예시

```json
{
  "react/jsx-filename-extension": ["error", { "extensions": [".tsx"] }]
}
```

**❌ incorrect**

```ts
export function Hello() {
  return <h1>Hello</h1>
}
```

**✅ correct**

```ts
export function Hello() {
  return <h1>Hello</h1>
}
```

## [react/only-export-components](https://oxc.rs/docs/guide/usage/linter/rules/react/only-export-components)

### 설명

- 한 모듈이 React 컴포넌트만 export하도록 강제해 Fast Refresh(HMR)가 컴포넌트 상태를 안전하게 보존하도록 한다.
- 컴포넌트와 비컴포넌트(유틸 함수 등)를 같은 파일에서 함께 export하면 편집 시 컴포넌트가 리마운트되어 상태를 잃거나, 번들러별로 HMR 동작이 갈리는 깨짐이 발생한다.

### 근거

- **베스트 프랙티스.** vite + React 환경에서 컴포넌트 파일의 HMR 안정성을 코드 단계에서 보장한다.
- `allowConstantExport: true`로 primitive 상수의 동거를 허용해 vite 프리셋의 기본 동작과 정렬한다.
- Context 파일(`**/*Context.tsx`)은 Provider 컴포넌트와 Context 인스턴스, 커스텀 hook을 한 모듈에서 함께 export하는 정상 패턴이라 override로 끈다.

### 설정

- `allowConstantExport` (bool, default: `false`): primitive 상수(string, number, boolean, template literal) 동거 허용. vite 프리셋에서 기본 활성화
- `allowExportNames` (string[], default: `[]`): HMR-safe로 간주할 named export 목록 (예: Remix의 `loader`, `action`)
- `checkJS` (bool, default: `false`): JSX 포함 `.js` 파일 검사
- `customHOCs` (string[], default: `[]`): 컴포넌트로 인정할 커스텀 HOC 식별자 목록

### 예시

```json
{
  "rules": {
    "react/only-export-components": ["error", { "allowConstantExport": true }]
  },
  "overrides": [
    { "files": ["**/*Context.tsx"], "rules": { "react/only-export-components": "off" } }
  ]
}
```

**❌ incorrect**

```tsx
export function formatLabel(value: string) {
  return value.toUpperCase()
}
export function Header() {
  return <h1>{formatLabel("title")}</h1>
}
```

**✅ correct**

`allowConstantExport`로 허용된 primitive 상수 동거.

```tsx
export const VERSION = "3"
export function Header() {
  return <h1>v{VERSION}</h1>
}
```

**✅ correct**

`**/*Context.tsx`는 override로 허용된다.

```tsx
export const ThemeContext = createContext<Theme>("light")
export function ThemeProvider({ children }: { children: ReactNode }) {
  return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>
}
```

## [typescript/explicit-function-return-type](https://oxc.rs/docs/guide/usage/linter/rules/typescript/explicit-function-return-type) + [typescript/explicit-module-boundary-types](https://oxc.rs/docs/guide/usage/linter/rules/typescript/explicit-module-boundary-types)

### 설명

- 함수와 메서드의 반환 타입(`explicit-function-return-type`) 또는 export 함수의 매개변수와 반환 타입(`explicit-module-boundary-types`)을 명시하도록 요구한다.
- 모듈 경계 계약을 코드에 박아 두면 의도된 반환 타입과 실제 추론 결과가 어긋날 때 호출부가 아닌 정의부에서 즉시 노출된다.

### 근거

- **베스트 프랙티스.** `.ts` 파일에서는 두 룰을 켜서 함수 시그니처가 IDE hover 없이도 읽히도록 강제한다.
- `explicit-function-return-type`에는 `allowExpressions: true`를 함께 켜 `users.map((user) => user.id)` 같은 인라인 콜백 표현식 함수는 풀어 둔다.
- 모듈 경계 시그니처를 검사한다는 본래 의도를 유지하면서 단발성 람다의 노이즈를 줄인다.
- `explicit-module-boundary-types`에는 동일 옵션이 없지만, 검사 범위가 이미 export 함수로 제한되어 인라인 콜백을 잡지 않으므로 별도 완화가 필요 없다.
- `.tsx`에서는 React 컴포넌트가 `JSX.Element` 추론으로 충분하고 props 타입은 함수 파라미터에 이미 명시되므로 override로 끈다.
- 두 룰은 의도가 거의 같아 한 항목으로 묶고, 모듈 경계만 따지는 후자가 더 좁은 범위라 전자가 켜져 있으면 항상 함께 잡힌다.

### 설정

`typescript/explicit-function-return-type`

- `allowExpressions` (bool, default: `false`): 표현식 함수 반환 타입 생략 허용
- `allowTypedFunctionExpressions` (bool, default: `true`): 타입이 지정된 변수에 할당된 함수 표현식 허용
- `allowHigherOrderFunctions` (bool, default: `true`): 함수를 반환하는 고차 함수 허용
- `allowDirectConstAssertionInArrowFunctions` (bool, default: `true`): `as const` 반환 화살표 함수 허용
- `allowConciseArrowFunctionExpressionsStartingWithVoid` (bool, default: `false`): `void`로 시작하는 간결한 화살표 함수 허용
- `allowFunctionsWithoutTypeParameters` (bool, default: `false`): 제네릭 없는 함수 허용
- `allowIIFEs` (bool, default: `false`): IIFE 허용
- `allowedNames` (string[], default: `[]`): 반환 타입 어노테이션 면제 함수 이름 목록

`typescript/explicit-module-boundary-types`

- `allowArgumentsExplicitlyTypedAsAny` (bool, default: `false`): `any`로 명시된 인수 허용
- `allowDirectConstAssertionInArrowFunctions` (bool, default: `true`): `as const` 반환 화살표 함수 허용
- `allowHigherOrderFunctions` (bool, default: `true`): 고차 함수 허용
- `allowOverloadFunctions` (bool, default: `false`): 오버로드 함수 허용
- `allowTypedFunctionExpressions` (bool, default: `true`): 타입 지정 함수 표현식 허용
- `allowedNames` (string[], default: `[]`): 타입 검사 면제 함수 이름 목록

### 예시

```json
{
  "rules": {
    "typescript/explicit-function-return-type": ["error", { "allowExpressions": true }],
    "typescript/explicit-module-boundary-types": "error"
  },
  "overrides": [
    {
      "files": ["**/*.tsx"],
      "rules": {
        "typescript/explicit-function-return-type": "off",
        "typescript/explicit-module-boundary-types": "off"
      }
    }
  ]
}
```

**❌ incorrect**

```ts
export function add(a: number, b: number) {
  return a + b
}
```

**✅ correct**

`.ts`에서 반환 타입을 명시한다.

```ts
export function add(a: number, b: number): number {
  return a + b
}
```

**✅ correct**

`allowExpressions`로 expression 위치의 화살표는 허용된다.

```ts
const ids = users.map((user) => user.id)
```

**✅ correct**

`**/*.tsx`는 override로 허용된다.

```tsx
export function Button({ label }: { label: string }) {
  return <button>{label}</button>
}
```

## [typescript/no-dynamic-delete](https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-dynamic-delete)

### 설명

- `delete obj[expr]`처럼 computed key에 대한 `delete` 사용을 금지한다.
- 정적 접근(`delete obj.key`)만 허용한다.

### 근거

- **베스트 프랙티스.** 동적 키 삭제는 V8 hidden class 최적화를 깨 동일 모양이라고 인식하던 객체 그룹을 분기시킨다.
- 동적 키가 필요한 사용 사례는 객체가 아닌 `Map`/`Set`이 적합하다는 신호이기도 하다.
- 정적 delete만 허용해 객체 모양 안정성과 의도 표현을 동시에 챙긴다.

### 설정

없음

### 예시

**❌ incorrect**

```ts
const cache: { [key: string]: number } = {}
delete cache[`item-${id}`]
```

**✅ correct**

```ts
const cache = new Map<string, number>()
cache.delete(`item-${id}`)
```

## [typescript/no-non-null-assertion](https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-non-null-assertion)

### 설명

- `!` non-null assertion은 타입 시스템을 강제 우회한다.
- 타입 가드로 좁히거나 nullable을 처리한다.

### 근거

- **베스트 프랙티스.** `!`은 타입 시스템 우회라 사고를 가린다.
- 가드를 강제해 안전성을 회복한다.

### 설정

없음

### 예시

**❌ incorrect**

```ts
const id = user!.id
```

**✅ correct**

```ts
if (user) {
  const id = user.id
}
```

## [typescript/promise-function-async](https://oxc.rs/docs/guide/usage/linter/rules/typescript/promise-function-async)

### 설명

- Promise를 반환하는 함수가 `async`로 표시되지 않으면 호출 계약이 덜 명확하다.
- `async function`으로 선언한다.

### 근거

- **베스트 프랙티스.** React 19에서 `ReactNode = ... | Promise<ReactNode>`로 정의가 확장되어 컴포넌트의 추론 반환 타입이 Promise를 포함하게 되고, `() => navigate(...)` 같은 화살표 핸들러도 트리거된다.
- `checkArrowFunctions: false`로 화살표 함수 전체를 검사 대상에서 제외해 React 관용을 유지하면서, 함수 선언의 Promise 반환에만 `async`를 강제한다.
- 코드 예시는 함수 선언이 룰에 잡히는 형태와 `async`를 붙인 권장 형태를 보여주고, 검사 제외되어 그대로 유지되는 화살표 함수도 함께 둔다.

### 설정

- `allowAny` (bool, default: `true`): `any` 반환 함수 허용
- `allowedPromiseNames` (string[], default: `[]`): 커스텀 Promise 유사 타입명 목록
- `checkArrowFunctions` (bool, default: `true`): 화살표 함수 검사
- `checkFunctionDeclarations` (bool, default: `true`): 함수 선언 검사
- `checkFunctionExpressions` (bool, default: `true`): 함수 표현식 검사
- `checkMethodDeclarations` (bool, default: `true`): 클래스 메서드 검사

### 예시

```json
{
  "typescript/promise-function-async": ["error", { "checkArrowFunctions": false }]
}
```

**❌ incorrect**

```ts
function load(): Promise<string> {
  return Promise.resolve("done")
}
```

**✅ correct**

함수 선언에 `async`를 붙인다.

```ts
async function load(): Promise<string> {
  return "done"
}
```

**✅ correct**

화살표 함수는 `checkArrowFunctions: false`로 검사 대상에서 제외된다.

```ts
const load = (): Promise<string> => Promise.resolve("done")
```

## [unicorn/no-abusive-eslint-disable](https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-abusive-eslint-disable)

### 설명

- 룰 이름을 명시하지 않은 `eslint-disable`/`oxlint-disable` 코멘트를 금지한다.
- 비워 두면 해당 위치의 모든 룰을 끄게 된다.

### 근거

- **베스트 프랙티스.** 이름 없는 disable은 의도한 한 룰뿐 아니라 같은 라인의 다른 진단까지 무음으로 만든다.
- PR 리뷰에서도 무엇을 끄는지 추적되지 않아 점진적으로 lint 신뢰가 무너진다.
- 항상 룰 이름을 명시하도록 강제한다.

### 설정

없음

### 예시

**❌ incorrect**

```ts
// eslint-disable-next-line
const id = user!.id
```

**✅ correct**

```ts
// eslint-disable-next-line typescript/no-non-null-assertion
const id = user!.id
```

## [unicorn/no-array-for-each](https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-array-for-each)

### 설명

- `Array#forEach` 대신 `for...of` 사용을 강제한다.
- 콜백이 새 함수 경계를 만들어 TypeScript의 타입 좁힘이 끊기고, `break`/`continue`/`return`으로 조기 종료가 불가능하며, 콜백 호출 오버헤드만큼 느리다.

### 근거

- **베스트 프랙티스.** `for...of`는 외부 스코프의 type narrowing을 유지하고, async 컨텍스트에서 `await`을 그대로 쓸 수 있으며, 조기 종료까지 지원한다.
- `forEach`의 유일한 이점인 "메서드 체이닝 일관성"도 side effect 루프가 어차피 체이닝의 종착점이라 의미가 약하다.
- 명시적 반복문으로 통일해 의도와 성능을 둘 다 챙긴다.

### 설정

없음

### 예시

**❌ incorrect**

```ts
items.forEach((item) => {
  process(item)
})
```

**✅ correct**

```ts
for (const item of items) {
  process(item)
}
```

## [unicorn/no-array-reduce](https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-array-reduce)

### 설명

- `Array#reduce`/`reduceRight`는 누산 로직을 한 줄 표현식에 압축해 가독성을 떨어뜨리고, spread 누적(`(acc, x) => [...acc, x]`)처럼 O(n²) 성능 함정으로 흐르기 쉽다.
- `map`/`filter`/`for...of`로 풀어 쓰면 의도와 비용이 모두 분명해진다.

### 근거

- **베스트 프랙티스.** `allowSimpleOperations: true`(기본값)로 숫자 합산, 곱셈 같은 단순 산술 reduce는 풀어주고, 복잡한 객체 누적이나 컬렉션 합치기만 잡는다.
- `sum = numbers.reduce((s, n) => s + n, 0)`은 `reduce`가 가장 자연스러운 표현이라 막을 이유가 없다.

### 설정

- `allowSimpleOperations` (bool, default: `true`): 단순 산술 operation(합산 등) 허용

### 예시

```json
{
  "unicorn/no-array-reduce": ["error", { "allowSimpleOperations": true }]
}
```

**❌ incorrect**

```ts
const grouped = items.reduce<Record<string, Item>>((acc, item) => ({ ...acc, [item.id]: item }), {})
```

**✅ correct**

복잡한 객체 누적은 `for...of`로 풀어 쓴다.

```ts
const grouped: Record<string, Item> = {}
for (const item of items) {
  grouped[item.id] = item
}
```

**✅ correct**

단순 산술은 `allowSimpleOperations`로 허용된다.

```ts
const total = numbers.reduce((sum, n) => sum + n, 0)
```

## [unicorn/no-process-exit](https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-process-exit)

### 설명

- `process.exit()`는 호출 즉시 프로세스를 종료시켜 finally 블록, 정리 로직을 건너뛴다.
- 에러 상황에서는 `throw`로 호출자에게 제어권을 넘겨 정상적인 에러 처리 흐름을 유지한다.

### 근거

- **베스트 프랙티스.** 라이브러리, 앱 코드에서는 `process.exit`이 정리 로직을 건너뛰고 호출 계약을 깨므로 throw로 통일한다.
- CLI 스크립트(`scripts/**/*.ts`)는 최상위 진입점이고 비정상 exit code 반환이 정상 동작이라 override로 끈다.

### 설정

없음

### 예시

```json
{
  "rules": {
    "unicorn/no-process-exit": "error"
  },
  "overrides": [{ "files": ["scripts/**/*.ts"], "rules": { "unicorn/no-process-exit": "off" } }]
}
```

**❌ incorrect**

```ts
if (!isValid(input)) {
  console.error("invalid input")
  process.exit(1)
}
```

**✅ correct**

`src/**/*.ts`에서는 `throw`로 제어권을 넘긴다.

```ts
if (!isValid(input)) {
  throw new Error("invalid input")
}
```

**✅ correct**

`scripts/**/*.ts`는 override로 허용된다.

```ts
if (!isValid(input)) {
  console.error("invalid input")
  process.exit(1)
}
```

## [unicorn/prefer-number-properties](https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-number-properties)

### 설명

- 전역 `parseInt`/`parseFloat`/`isNaN`/`isFinite`/`NaN` 대신 `Number.parseInt`/`Number.isNaN` 같은 `Number` 정적 멤버를 강제한다.
- ES2015에서 `Number`로 이동한 이후 글로벌 버전과 동작이 미묘하게 달라 출처를 명시해야 안전하다.

### 근거

- **베스트 프랙티스.** 글로벌 `isNaN("foo")`는 인자를 숫자로 강제 변환한 뒤 `NaN` 여부를 따지므로 `true`를 반환하지만, `Number.isNaN("foo")`는 강제 변환 없이 `false`를 반환한다.
- 의도가 다르게 흘러갈 여지를 모듈 경계가 분명한 `Number.*`로 차단한다.
- `NaN` 검사는 기본값(`checkNaN: true`)에서 잡히고, `Infinity`는 빈도가 낮아 기본값(`checkInfinity: false`)으로 비활성 상태를 유지한다.

### 설정

- `checkInfinity` (bool, default: `false`): `Infinity`/`-Infinity` 글로벌 사용 검사
- `checkNaN` (bool, default: `true`): `NaN` 글로벌 사용 검사

### 예시

**❌ incorrect**

```ts
const count = parseInt(input, 10)
if (isNaN(count)) {
  return 0
}
```

**✅ correct**

```ts
const count = Number.parseInt(input, 10)
if (Number.isNaN(count)) {
  return 0
}
```
