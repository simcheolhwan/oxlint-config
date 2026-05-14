# Restriction 채택 규칙 (draft)

## [import/no-commonjs](https://oxc.rs/docs/guide/usage/linter/rules/import/no-commonjs)

### 설명

- `require()`, `module.exports` 같은 CommonJS 문법 사용을 금지하는 룰.
- 프로젝트를 ES modules로 통일한다.

### 근거

- **베스트 프랙티스.** ESM 통일은 트리 셰이킹, 동적 import, 번들러 호환성에 직접 기여한다.

### 설정

- `allowConditionalRequire` (boolean, default: `true`): `if`/`try-catch` 등 조건부 `require()` 호출 허용 여부.
- `allowPrimitiveModules` (boolean, default: `false`): 원시 값 export는 허용하되 객체/속성 export는 제한.
- `allowRequire` (boolean, default: `false`): `require` 호출은 허용하지만 `module.exports`는 여전히 제한.

### 예시

**❌ incorrect**

```ts
const fs = require("fs")
module.exports = { value }
```

**✅ correct**

```ts
import fs from "node:fs"
export { value }
```

## [oxc/no-barrel-file](https://oxc.rs/docs/guide/usage/linter/rules/oxc/no-barrel-file)

### 설명

- `index.ts`로 모은 barrel re-export는 트리 셰이킹과 빌드 성능을 저해한다.
- 사용하는 모듈을 직접 import한다.

### 근거

- **베스트 프랙티스.** barrel은 빌드 시간과 트리 셰이킹을 악화시키며 직접 import가 추적성에도 좋다.

### 설정

- `threshold` (integer, default: `100`): `export *`로 재내보내기되는 모듈 수가 이 값을 초과하면 룰이 발동.

### 예시

**❌ incorrect**

```ts
// index.ts
export * from "./a"
export * from "./b"
export * from "./c"
```

**✅ correct**

```ts
import { something } from "./a"
import { another } from "./b"
```

## [typescript/explicit-member-accessibility](https://oxc.rs/docs/guide/usage/linter/rules/typescript/explicit-member-accessibility)

### 설명

- 클래스 멤버의 가시성(`public`/`private`/`protected`)이 명시되지 않으면 의도가 모호해진다.
- 모든 멤버에 명시적 accessibility 키워드를 붙인다.

### 근거

- **베스트 프랙티스.** 추론으로 채울 수 없는 클래스 API 의도라 명시 비용이 충분히 정당하다.

### 설정

- `accessibility` (`"explicit" | "no-public" | "off"`, default: `"explicit"`): 접근성 수정자 필수 여부. `explicit`은 항상 필수, `no-public`은 public 제외 필수, `off`는 검사 안 함.
- `ignoredMethodNames` (string[], default: `[]`): 검사 대상에서 제외할 메서드 이름 목록.
- `overrides` (object, default: 없음): 멤버 유형별(`accessors`/`constructors`/`methods`/`parameterProperties`/`properties`)로 `accessibility` 규칙을 개별 지정.

### 예시

**❌ incorrect**

```ts
class Counter {
  count = 0
  increment() {
    this.count += 1
  }
}
```

**✅ correct**

```ts
class Counter {
  public count = 0
  public increment() {
    this.count += 1
  }
}
```

## [typescript/no-explicit-any](https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-explicit-any)

### 설명

- `any`는 타입 검사를 우회해 안전하지 않은 값 전파를 허용한다.
- `unknown`, 제네릭, 정확한 도메인 타입 중 하나를 사용한다.

### 근거

- **베스트 프랙티스.** `any` 한 번이 타입 안전성을 광범위하게 무너뜨려 글로벌 가드라인 가치가 크다.

### 설정

- `fixToUnknown` (boolean, default: `false`): auto-fix 시 `any`를 `unknown`으로 치환.
- `ignoreRestArgs` (boolean, default: `false`): rest parameter 배열에 대한 검사를 건너뜀.

### 예시

**❌ incorrect**

```ts
function parse(value: any): any {
  return value
}
```

**✅ correct**

```ts
function parse<T>(value: T): T {
  return value
}
```
