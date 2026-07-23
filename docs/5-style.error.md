---
title: "Style 채택 규칙"
---

## [eslint/init-declarations](https://oxc.rs/docs/guide/usage/linter/rules/eslint/init-declarations)

`let`/`var` 선언 시 초기값을 함께 부여하도록 강제한다. 선언과 초기화가 분리되면 첫 할당 위치를 따라가야 해 흐름 추적이 늘어난다.

**베스트 프랙티스.** 기본 모드 `"always"`로 적용해 변수가 어떤 값으로 시작하는지 한눈에 드러나게 하고, 분기마다 다른 값을 할당해야 하는 경우는 삼항이나 `const x = isReady ? a : b` 패턴으로 흡수한다.

**Configuration**

- `mode` (`"always" | "never"`, default: `"always"`): 선언 시 초기화 강제(`"always"`) 또는 금지(`"never"`)
- `ignoreForLoopInit` (bool, default: `false`): `mode: "never"`일 때 for 루프 초기화는 허용

**❌ incorrect**

```ts
let name
if (user) name = user.name
else name = "guest"
```

**✅ correct**

```ts
const name = user ? user.name : "guest"
```

## [eslint/max-params](https://oxc.rs/docs/guide/usage/linter/rules/eslint/max-params)

함수의 매개변수 개수를 제한해 매개변수가 많으면 객체 인자로 묶거나 책임을 분리하도록 유도한다.

**취향.** 기본값 `max: 3`은 강해 정상적인 헬퍼/이벤트 핸들러까지 잡으므로 `max: 4`로 한 칸만 늘려 단순 헬퍼는 통과시키되 인자 5개부터는 객체 인자 도입을 강하게 유도한다.

**Configuration**

- `max` (int, default: `3`): 함수 매개변수 최대 개수
- `countThis` (`"always" | "never" | "except-void"`, default: 없음): `this` 파라미터 카운트 여부
- `countVoidThis` (bool, default: `false`): [deprecated] `this: void` 파라미터 카운트 여부

**⚙️ 설정**

```json
{
  "eslint/max-params": ["error", { "max": 4 }]
}
```

**❌ incorrect**

```ts
function init(a, b, c, d, e) {}
```

**✅ correct**

```ts
function init(options: { a: number; b: number; c: number; d: number; e: number }) {}
```

## [eslint/max-statements](https://oxc.rs/docs/guide/usage/linter/rules/eslint/max-statements)

함수 내 statement 개수의 상한을 강제한다.

**취향.** 기본값 `max: 10`은 일반 헬퍼와 React 컴포넌트에서 자주 초과돼 노이즈가 크므로 `.ts`/`.tsx` 구분 없이 `max: 20`으로 완화하고, 테스트 파일은 시나리오 누적으로 자연스럽게 statement가 많아져 `**/*.test.ts`에서 끈다.

**Configuration**

- `max` (int, default: `10`): 함수당 최대 statement 수
- `ignoreTopLevelFunctions` (bool, default: `false`): 최상위 함수 무시 여부

**⚙️ 설정**

```json
{
  "rules": {
    "eslint/max-statements": ["error", { "max": 20 }]
  },
  "overrides": [{ "files": ["**/*.test.ts"], "rules": { "eslint/max-statements": "off" } }]
}
```

**❌ incorrect**

```ts
function process(input) {
  const a = parse(input)
  const b = validate(a)
  const c = transform(b)
  const d = enrich(c)
  // ... 더 많은 단계
  return persist(d)
}
```

**✅ correct**

```ts
function process(input) {
  const validated = validate(parse(input))
  return persist(enrich(transform(validated)))
}
```

## [eslint/no-duplicate-imports](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-duplicate-imports)

같은 모듈에서 여러 번 import하는 것을 금지한다. 한 번에 모아서 import한다.

**베스트 프랙티스.** `allowSeparateTypeImports: true`로 type/value import 분리를 허용해 `import/consistent-type-specifier-style: prefer-top-level`(inline type specifier 금지, type-only import 강제)과의 충돌을 피한다.

**Configuration**

- `allowSeparateTypeImports` (bool, default: `false`): type-only import를 별도 문장으로 분리 허용
- `includeExports` (bool, default: `false`): re-export 문도 중복 검사 포함

**⚙️ 설정**

```json
{
  "eslint/no-duplicate-imports": ["error", { "allowSeparateTypeImports": true }]
}
```

**❌ incorrect**

```ts
import { a } from "lib"
import { b } from "lib"
```

**✅ correct**

일반 모듈 import는 통합한다.

```ts
import { a, b } from "lib"
```

**✅ correct**

같은 모듈의 type/value는 별도 문장으로 분리할 수 있다.

```ts
import type { Foo } from "lib"
import { bar } from "lib"
```

## [eslint/prefer-destructuring](https://oxc.rs/docs/guide/usage/linter/rules/eslint/prefer-destructuring)

배열, 객체 접근에 destructuring 사용을 강제한다.

**베스트 프랙티스.** `const a = obj.a; const b = obj.b` 같은 반복 대신 `const { a, b } = obj`로 묶는다.

**Configuration**

- `VariableDeclarator` (object, default: `{ array: true, object: true }`): 변수 선언에서 배열/객체 비구조화 강제
- `AssignmentExpression` (object, default: `{ array: true, object: true }`): 할당식에서 배열/객체 비구조화 강제
- `enforceForRenamedProperties` (bool, default: `false`): 이름 변경 시에도 객체 비구조화 강제. 켜지 않는다 — computed 접근(`arr[i]`, `obj[key]`)까지 `const { [i]: item } = arr` 표기를 강제해 오히려 가독성을 해친다. (과거 `["error", { enforceForRenamedProperties: true }]`로 설정했으나 첫 번째 옵션 자리에 두어 무시되고 있었고, oxlint 1.73의 엄격한 스키마 검증에서 파싱 오류가 드러나 기본값 채택으로 정리)

**⚙️ 설정**

```json
{
  "eslint/prefer-destructuring": "error"
}
```

**❌ incorrect**

여러 프로퍼티를 단순 할당하는 형태.

```ts
const name = user.name
const email = user.email
```

**✅ correct**

객체 destructuring으로 묶는 형태.

```ts
const { name, email } = user
```

**✅ correct**

이름을 바꿔 받는 단순 할당은 허용한다 (`enforceForRenamedProperties` 미사용).

```ts
const userName = user.name
```

## [eslint/prefer-template](https://oxc.rs/docs/guide/usage/linter/rules/eslint/prefer-template)

문자열 연결(`+`) 대신 template literal 사용을 강제한다.

**베스트 프랙티스.** template literal이 보간과 다중 줄을 더 명확하게 표현한다.

**❌ incorrect**

```ts
const greeting = "Hello, " + name + "!"
```

**✅ correct**

```ts
const greeting = `Hello, ${name}!`
```

## [eslint/sort-imports](https://oxc.rs/docs/guide/usage/linter/rules/eslint/sort-imports)

named import specifier를 알파벳 순으로 정렬해 가독성을 높인다.

**취향.** `ignoreDeclarationSort: true`로 import 문 자체의 정렬은 `vp fmt`에 위임하고 이 규칙은 named import specifier 정렬만 담당해, 두 도구를 번갈아 실행해도 수렴하도록 만든다.

**Configuration**

- `ignoreCase` (bool, default: `false`): 정렬 시 대소문자 무시
- `ignoreDeclarationSort` (bool, default: `false`): import 문 자체의 순서 정렬 무시
- `ignoreMemberSort` (bool, default: `false`): import 멤버 내부 정렬 무시
- `memberSyntaxSortOrder` (array, default: `["none", "all", "multiple", "single"]`): import 구문 종류별 정렬 순서
- `allowSeparatedGroups` (bool, default: `false`): 빈 줄로 구분된 그룹을 독립적으로 처리

**⚙️ 설정**

```json
{
  "eslint/sort-imports": ["error", { "ignoreDeclarationSort": true }]
}
```

**❌ incorrect**

```ts
import { z, a, b } from "lib"
```

**✅ correct**

```ts
import { a, b, z } from "lib"
```

## [import/consistent-type-specifier-style](https://oxc.rs/docs/guide/usage/linter/rules/import/consistent-type-specifier-style)

inline type specifier 대신 top-level `import type`을 요구한다. type 식별자와 value 식별자를 같은 모듈에서 가져올 경우 두 개의 별도 import 문으로 분리한다.

**베스트 프랙티스.** `eslint/no-duplicate-imports`의 `allowSeparateTypeImports`와 짝을 이뤄 분리된 type/value import 패턴을 강제하면 인라인 `type` 마커가 사라져 type-only 식별자가 한눈에 드러나고 빌드 도구가 type import를 안전하게 제거할 수 있다.

**Configuration**

- `style` (`"prefer-top-level" | "prefer-inline"`, default: `"prefer-top-level"`): type import 위치 스타일

**⚙️ 설정**

```json
{
  "import/consistent-type-specifier-style": ["error", "prefer-top-level"]
}
```

**❌ incorrect**

```ts
import { type Foo, bar } from "m"
```

**✅ correct**

```ts
import type { Foo } from "m"
import { bar } from "m"
```

## [import/no-mutable-exports](https://oxc.rs/docs/guide/usage/linter/rules/import/no-mutable-exports)

`export let`, `export var`로 변경 가능한 바인딩을 노출하는 패턴을 금지한다. `export const`나 함수, 클래스 선언으로 불변 바인딩만 내보낸다.

**베스트 프랙티스.** mutable export는 모듈 경계의 명시적 계약을 흐리고 consumer 입장에서 값이 언제 바뀌는지 추적이 어려우므로, 상태를 외부에 공유해야 하면 getter 함수나 명시적인 store API를 통해 표현한다.

**❌ incorrect**

```ts
export let count = 0
export function increment() {
  count += 1
}
```

**✅ correct**

```ts
let count = 0
export const getCount = () => count
export function increment() {
  count += 1
}
```

## [import/no-named-export](https://oxc.rs/docs/guide/usage/linter/rules/import/no-named-export) + [import/prefer-default-export](https://oxc.rs/docs/guide/usage/linter/rules/import/prefer-default-export)

`prefer-default-export`는 단일 export 모듈에서 default 사용을 권장하고, `no-named-export`는 named export를 전면 금지한다. 두 규칙을 짝지어 컴포넌트 파일에 default export를 강제한다.

**취향.** `.ts`는 named export가 자동 import/트리 셰이킹에 유리하므로 메인 rules에서 두 규칙을 `"off"`로 명시 선언해 정책을 코드로 드러내고, `**/*.tsx`에서만 켜되 hooks(`**/use*.tsx`)/Context 모듈(`**/*Context.tsx`)/TanStack Router 라우트(`**/routes/**/[!-]*.tsx`)는 named export가 컨벤션이라 override로 끈다.

**Configuration**

- `import/no-named-export`: 없음
- `import/prefer-default-export.target` (`"single" | "any"`, default: `"single"`): `"single"`은 단일 export 시만 강제, `"any"`는 export가 있으면 항상 강제

**⚙️ 설정**

```json
{
  "rules": {
    "import/no-named-export": "off",
    "import/prefer-default-export": "off"
  },
  "overrides": [
    {
      "files": ["**/*.tsx"],
      "rules": {
        "import/no-named-export": "error",
        "import/prefer-default-export": ["error", { "target": "any" }]
      }
    },
    {
      "files": ["**/use*.tsx", "**/*Context.tsx", "**/routes/**/[!-]*.tsx"],
      "rules": {
        "import/no-named-export": "off",
        "import/prefer-default-export": "off"
      }
    }
  ]
}
```

**❌ incorrect**

```tsx
export const Button = () => <button />
```

**✅ correct**

tsx 컴포넌트는 default export로 작성한다.

```tsx
const Button = () => <button />
export default Button
```

**✅ correct**

ts 파일은 named export를 유지한다.

```ts
export const formatDate = (d: Date) => d.toISOString()
export const parseDate = (s: string) => new Date(s)
```

## [import/no-namespace](https://oxc.rs/docs/guide/usage/linter/rules/import/no-namespace)

`import * as foo from "lib"` 형태의 namespace(와일드카드) import를 금지하고 named import만 허용한다. import 줄에서 실제 사용 식별자가 즉시 드러나고 번들러가 미사용 export를 안전하게 제거(tree-shaking)할 수 있다.

**베스트 프랙티스.** 일부 모놀리식 SDK는 namespace import가 권장 형태라 named로 풀 수 없는데, 현재 정책은 `ignore: []`로 모든 namespace import를 차단하고 우회 불가능한 라이브러리가 등장하면 그때 glob을 ignore에 추가한다.

**Configuration**

- `ignore` (glob string[], default: `[]`): namespace import를 허용할 모듈 이름 glob 목록

**⚙️ 설정**

```json
{
  "import/no-namespace": ["error", { "ignore": [] }]
}
```

**❌ incorrect**

```ts
import * as utils from "./utils"
```

**✅ correct**

named import로 풀어 쓴다.

```ts
import { formatDate, parseDate } from "./utils"
```

**✅ correct**

`ignore`에 `"legacy-lib"` 추가 시 namespace import를 허용한다.

```ts
import * as Lib from "legacy-lib"
```

## [import/no-nodejs-modules](https://oxc.rs/docs/guide/usage/linter/rules/import/no-nodejs-modules)

`fs`, `path`, `crypto` 같은 Node.js 빌트인 모듈 import를 금지한다. 브라우저 번들에 섞이면 런타임 에러가 나거나 번들러가 무거운 폴리필을 끌어와 번들 크기, 환경 일관성이 모두 망가진다.

**베스트 프랙티스.** 기본 앱 코드(`src/**/*.ts`)는 브라우저 타깃이라 Node API가 들어올 자리가 없어 정적으로 차단하고, 빌드 스크립트나 codemod 등 Node에서만 동작하는 `scripts/**/*.ts`는 override로 끈다.

**Configuration**

- `allow` (string[], default: `[]`): 허용할 Node.js 내장 모듈 이름 목록

**⚙️ 설정**

```json
{
  "rules": {
    "import/no-nodejs-modules": "error"
  },
  "overrides": [{ "files": ["scripts/**/*.ts"], "rules": { "import/no-nodejs-modules": "off" } }]
}
```

**❌ incorrect**

```ts
import fs from "node:fs"
const data = fs.readFileSync("./data.json", "utf8")
```

**✅ correct**

`src/**/*.ts`에서는 브라우저 API로 대체한다.

```ts
const response = await fetch("/data.json")
const data = await response.json()
```

**✅ correct**

`scripts/**/*.ts`는 오버라이드로 규칙이 꺼져 있어 Node 빌트인 사용이 허용된다.

```ts
import fs from "node:fs"
const config = fs.readFileSync("./config.json", "utf8")
```

## [jest/prefer-ending-with-an-expect](https://oxc.rs/docs/guide/usage/linter/rules/jest/prefer-ending-with-an-expect)

테스트 본문 마지막 statement가 assertion(`expect(...)` 등)이 아니면 잡는다. setup이나 side-effect로 끝나면 검증이 누락된 채 silent하게 통과될 수 있다.

**베스트 프랙티스.** vitest는 jest API와 호환되므로 jest 플러그인 규칙이 그대로 작동하고, `vitest/*`에는 동치 규칙이 없어 jest 플러그인을 도입해 보강한다.

**Configuration**

- `assertFunctionNames` (string[], default: `["expect"]`): assertion 함수로 취급할 함수 이름 목록
- `additionalTestBlockFunctions` (string[], default: `[]`): test 블록으로 취급할 추가 함수 이름 목록

**❌ incorrect**

```ts
it("changes selection", () => {
  const select = render(MySelect)
  expect(select).toBeDefined()
  select.setProp("value", 2)
})
```

**✅ correct**

```ts
it("changes selection", () => {
  const select = render(MySelect)
  expect(select).toBeDefined()
  select.setProp("value", 2)
  expect(select.toHTML()).toContain('value="2"')
})
```

## [jest/prefer-strict-equal](https://oxc.rs/docs/guide/usage/linter/rules/jest/prefer-strict-equal)

`expect(...).toEqual(...)`는 객체, 배열의 `undefined` 값을 비교에서 무시해 `{ a: 1, b: undefined }`와 `{ a: 1 }`을 같다고 통과시킨다. `toStrictEqual`은 키 존재 여부와 prototype까지 검사하므로 모양 차이를 누락 없이 잡는다.

**베스트 프랙티스.** vitest는 jest matcher API와 호환되어 jest 플러그인 규칙이 그대로 작동하고, `jest/prefer-ending-with-an-expect`/`jest/require-hook`/`vitest/require-to-throw-message`와 짝을 이뤄 테스트 엄격도를 일관되게 끌어올린다.

**❌ incorrect**

```ts
expect(user).toEqual({ id: "u1", name: "Sim" })
```

**✅ correct**

```ts
expect(user).toStrictEqual({ id: "u1", name: "Sim" })
```

## [jest/require-hook](https://oxc.rs/docs/guide/usage/linter/rules/jest/require-hook) + [vitest/require-hook](https://oxc.rs/docs/guide/usage/linter/rules/vitest/require-hook)

테스트 파일 최상위나 `describe` 본문 직접 위치에 표현식 실행 코드를 두면 파일이 로드되는 시점에 부수효과가 일어나 테스트 격리와 실행 순서 의존성이 깨진다. 셋업 코드를 `beforeAll`, `beforeEach` 같은 hook 안으로 옮기게 강제한다. jest와 vitest 두 규칙은 동일 의도이며 vitest 플러그인이 jest API를 그대로 처리하므로 둘 다 켠다.

**베스트 프랙티스.** 테스트 파일이 아닌 일반 코드까지 잡으면 false positive가 폭증하므로 메인 rules에는 `"off"`로 두고 `**/*.test.ts` override에서만 `"error"`로 켠다.

**Configuration**

- `allowedFunctionCalls` (string[], default: `[]`): hook 밖에서 허용할 함수 이름 목록 (jest와 vitest 동일)

**⚙️ 설정**

```json
{
  "rules": {
    "jest/require-hook": "off",
    "vitest/require-hook": "off"
  },
  "overrides": [
    {
      "files": ["**/*.test.ts"],
      "rules": {
        "jest/require-hook": "error",
        "vitest/require-hook": "error"
      }
    }
  ]
}
```

**❌ incorrect**

```ts
initializeDatabase()
describe("user", () => {
  it("creates", () => expect(create()).toBe(true))
})
```

**✅ correct**

```ts
beforeEach(() => {
  initializeDatabase()
})
describe("user", () => {
  it("creates", () => expect(create()).toBe(true))
})
```

## [promise/prefer-await-to-then](https://oxc.rs/docs/guide/usage/linter/rules/promise/prefer-await-to-then)

`.then()`/`.catch()` 체이닝은 비동기 흐름을 표현하지만 분기, 에러 처리, 반환값을 합치면 들여쓰기가 깊어지고 흐름이 흩어진다. `async`/`await`로 동기적 외형의 코드 흐름을 유지한다.

**베스트 프랙티스.** `strict: true`로 `await` 이후의 `.then()` 체이닝까지 잡아 `const profile = await fetchUser(id).then((user) => user.profile)` 같은 혼합 표기를 차단하고, `promise` 플러그인은 default-off라 `lint.plugins`에 명시적으로 추가해야 활성화된다.

**Configuration**

- `strict` (bool, default: `false`): `await`/`yield` 이후 체이닝에도 규칙 적용

**⚙️ 설정**

```json
{
  "promise/prefer-await-to-then": ["error", { "strict": true }]
}
```

**❌ incorrect**

기본 `.then()` 체이닝.

```ts
function load() {
  return fetchUser().then((user) => user.name)
}
```

**❌ incorrect**

`strict: true`로 `await` 이후 `.then()` 체이닝도 잡힌다.

```ts
const profile = await fetchUser(id).then((user) => user.profile)
```

**✅ correct**

```ts
async function load() {
  const user = await fetchUser()
  return user.name
}
```

## [react/jsx-max-depth](https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-max-depth)

JSX 중첩 깊이가 일정 수준을 넘으면 한 컴포넌트가 너무 많은 책임을 진다는 신호다. 상한을 넘으면 자식 컴포넌트로 추출해 트리를 평탄화한다.

**취향.** 기본값 `max: 2`는 일상적인 레이아웃 마크업도 차단해 비현실적이라 `max: 5`로 완화하면 `<App><Layout><Main><Section><Card /></Section></Main></Layout></App>` 같은 표준 패턴은 통과하면서 그 이상 쌓이면 추출 유도 신호로 작동한다.

**Configuration**

- `max` (int, default: `2`): JSX 중첩 최대 깊이

**⚙️ 설정**

```json
{
  "rules": {
    "react/jsx-max-depth": ["error", { "max": 5 }]
  }
}
```

**❌ incorrect**

```tsx
<Layout>
  <Sidebar>
    <Section>
      <Group>
        <List>
          <Item />
        </List>
      </Group>
    </Section>
  </Sidebar>
</Layout>
```

**✅ correct**

```tsx
<Layout>
  <Sidebar>
    <Section>
      <Group>
        <Item />
      </Group>
    </Section>
  </Sidebar>
</Layout>
```

## [typescript/array-type](https://oxc.rs/docs/guide/usage/linter/rules/typescript/array-type)

배열 타입 표기를 `T[]` 또는 `Array<T>` 중 하나로 통일하도록 강제한다. 기본 옵션 `"array"`로 `string[]` 형태를 표준으로 채택한다.

**취향.** 같은 turn에 도입한 `typescript/consistent-type-definitions`(`interface` 강제)와 짝을 이뤄 객체 모양과 배열 모양 표기를 한 가지로 고정하고, React/TS 코드베이스에서 `T[]`가 압도적 관용이라 grep/diff 가독성에 이점이 더 크다.

**Configuration**

- `default` (`"array" | "array-simple" | "generic"`, default: `"array"`): 일반 배열 타입 표기 스타일
- `readonly` (`"array" | "array-simple" | "generic"`, default: `null`): readonly 배열 타입 표기 (`null`이면 `default`를 따름)

**❌ incorrect**

```ts
type Names = Array<string>
```

**✅ correct**

```ts
type Names = string[]
```

## [typescript/consistent-type-definitions](https://oxc.rs/docs/guide/usage/linter/rules/typescript/consistent-type-definitions)

객체 형태의 타입 정의에 `interface`와 `type` 중 하나만 쓰도록 강제한다. 기본 옵션은 `"interface"`이며 그대로 채택한다.

**베스트 프랙티스.** `interface`는 선언 병합이 가능해 라이브러리 augmentation과 호환되고 IDE 표시(hover, error)도 더 짧고, 유니언/튜플 같이 객체로 표현 불가능한 형태는 `type`을 그대로 쓸 수 있어 규칙 충돌 없이 양립한다.

**Configuration**

- `style` (`"interface" | "type"`, default: `"interface"`): 객체 타입 정의 스타일

**❌ incorrect**

```ts
type User = {
  id: string
  name: string
}
```

**✅ correct**

객체 타입은 `interface`로 정의한다.

```ts
interface User {
  id: string
  name: string
}
```

**✅ correct**

객체 형태가 아니므로 규칙 대상이 아니다.

```ts
type Status = "ready" | "loading"
```

## [unicorn/catch-error-name](https://oxc.rs/docs/guide/usage/linter/rules/unicorn/catch-error-name)

`catch` 절의 변수명과 `Promise#catch`, `Promise#then`의 rejection 핸들러 파라미터 이름을 표준 이름(기본 `error`)으로 통일한다.

**취향.** 자동 수정으로 정리되는 가벼운 일관성 규칙이고, `_`(미사용)나 `_error`(사용하되 명명 숨김) 패턴은 규칙이 알아서 허용해 best-effort 실행을 표현하는 빈 catch 패턴을 방해하지 않는다.

**Configuration**

- `name` (string, default: `"error"`): 표준 에러 변수 이름
- `ignore` (regex string[], default: `[]`): 검사 제외 패턴

**❌ incorrect**

```ts
try {
  await load()
} catch (err) {
  logger.error(err)
}
```

**✅ correct**

```ts
try {
  await load()
} catch (error) {
  logger.error(error)
}
```

## [unicorn/consistent-existence-index-check](https://oxc.rs/docs/guide/usage/linter/rules/unicorn/consistent-existence-index-check)

`indexOf`, `lastIndexOf`, `findIndex`, `findLastIndex` 반환값으로 존재 여부를 검사할 때 `< 0`/`>= 0` 대신 `=== -1`/`!== -1`을 강제해 "찾지 못함"의 sentinel(`-1`)을 명시적으로 드러낸다.

**취향.** 자동 수정 가능한 가벼운 표기 일관성 규칙이라 도입 비용이 거의 없고, 부수적으로 `Array#includes`로 대체 가능한 자리를 grep으로 찾기 쉬워진다.

**❌ incorrect**

```ts
if (items.indexOf(target) >= 0) found()
if (items.findIndex(matcher) < 0) notFound()
```

**✅ correct**

```ts
if (items.indexOf(target) !== -1) found()
if (items.findIndex(matcher) === -1) notFound()
```

## [unicorn/no-useless-collection-argument](https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-useless-collection-argument)

`new Set([])`, `new Map(foo ?? [])`처럼 컬렉션 생성자에 의미 없는 빈 iterable 또는 nullish fallback을 넘기는 패턴을 금지한다. 컬렉션 생성자는 인자가 없거나 nullish일 때 빈 컬렉션을 만들어주므로 fallback이 군더더기가 된다.

**베스트 프랙티스.** 자동 수정으로 정리되는 가벼운 규칙이고 패턴이 거의 항상 잘못된 의도(필요 없는 방어 코드)에서 비롯되어 false positive 부담이 적다.

**❌ incorrect**

```ts
const tags = new Set([])
const cache = new Map(initial ?? [])
```

**✅ correct**

```ts
const tags = new Set()
const cache = new Map(initial)
```

## [unicorn/relative-url-style](https://oxc.rs/docs/guide/usage/linter/rules/unicorn/relative-url-style)

`new URL("foo", base)`처럼 `new URL` 생성자에 넘기는 상대 경로 표기를 한 가지 형태로 통일한다. 기본 옵션 `"never"`로 `./` 접두사를 붙이지 않는 형태를 강제한다.

**취향.** 두 표기가 동작은 같지만 코드베이스 내에서 섞이면 검색/정렬/diff에서 노이즈가 되고, 자동 수정 가능한 가벼운 일관성 규칙이라 도입 비용이 거의 없다.

**Configuration**

- `style` (`"never" | "always"`, default: `"never"`): 상대 URL의 `./` 접두사 사용 여부

**❌ incorrect**

```ts
const asset = new URL("./assets/logo.svg", import.meta.url)
```

**✅ correct**

```ts
const asset = new URL("assets/logo.svg", import.meta.url)
```

## [unicorn/text-encoding-identifier-case](https://oxc.rs/docs/guide/usage/linter/rules/unicorn/text-encoding-identifier-case)

`"UTF-8"`, `"utf-8"`, `"utf8"`처럼 텍스트 인코딩 식별자 표기가 흩어지면 grep, 정렬에서 같은 인코딩이 다르게 잡힌다. 기본 옵션으로 대시 없는 소문자 형태(`"utf8"`, `"ascii"`)로 통일한다.

**취향.** 자동 수정으로 정리되는 표기 일관성 규칙이라 false positive가 사실상 없고, 파일 I/O나 `Buffer.toString` 등에서 인코딩 인자가 한 가지 모양으로 등장해 가독성이 올라간다.

**Configuration**

- `withDash` (bool, default: `false`): `true`면 `"utf-8"`(대시 포함) 형식을 선호

**❌ incorrect**

```ts
const content = await fs.readFile(path, "UTF-8")
const ascii = buffer.toString("ASCII")
```

**✅ correct**

```ts
const content = await fs.readFile(path, "utf8")
const ascii = buffer.toString("ascii")
```

## [vitest/prefer-strict-boolean-matchers](https://oxc.rs/docs/guide/usage/linter/rules/vitest/prefer-strict-boolean-matchers)

`expect(x).toBeTruthy()`/`toBeFalsy()`는 `0`, `""`, `null`까지 한 묶음으로 통과/실패시켜 buggy한 값도 silent하게 넘어간다. `toBe(true)`/`toBe(false)`로 엄격한 boolean 비교를 강제해 의도된 값만 통과시킨다.

**베스트 프랙티스.** `vitest/prefer-to-be-truthy`/`vitest/prefer-to-be-falsy`와 정반대 방향이므로 두 규칙은 off로 두고 이 규칙만 켠다 (둘 다 켜면 자동 수정이 무한 루프).

**❌ incorrect**

```ts
expect(isReady).toBeTruthy()
expect(error).toBeFalsy()
```

**✅ correct**

```ts
expect(isReady).toBe(true)
expect(error).toBe(false)
```
