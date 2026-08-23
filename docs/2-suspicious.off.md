---
title: "Suspicious 제외 규칙"
---

## [react/react-in-jsx-scope](https://oxc.rs/docs/guide/usage/linter/rules/react/react-in-jsx-scope)

React 17+의 새 JSX Transform에서는 `import React from "react"`가 필요하지 않다. `@vitejs/plugin-react`가 자동 변환을 처리하므로 규칙을 끈다.

**베스트 프랙티스.** 새 JSX Transform에서는 불필요한 import를 강요해 모든 컴포넌트에서 오탐이 발생한다.

**🆗 rule: incorrect (허용)**

```tsx
export function Greeting() {
  return <h1>Hello</h1>
}
```

**⚠️ rule: correct (노이즈)**

```tsx
import React from "react"

export function Greeting() {
  return <h1>Hello</h1>
}
```

## [typescript/consistent-return](https://oxc.rs/docs/guide/usage/linter/rules/typescript/consistent-return)

함수의 일부 분기에서만 값을 반환하는 패턴을 금지하고 모든 경로에서 같은 형태로 반환하도록 강제한다.

**취향.** 가드에서 조기 반환하고 주 경로에서만 결과를 반환하는 흐름이 이 코드베이스의 기본 스타일이고, 반환 타입은 TypeScript 시그니처(`T | undefined` 등)로 충분히 표현되므로 규칙 차원의 강제는 과하다.

**Configuration**

- `treatUndefinedAsUnspecified` (bool, default: `false`): 명시적 `return undefined`를 미지정 반환과 동일하게 처리

**🆗 rule: incorrect (허용)**

```ts
function findLabel(value: string) {
  if (value.length > 0) {
    return value
  }
}
```

**⚠️ rule: correct (노이즈)**

```ts
function findLabel(value: string): string | undefined {
  if (value.length === 0) {
    return undefined
  }
  return value
}
```

## [typescript/no-unsafe-type-assertion](https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-unsafe-type-assertion)

`any`/`unknown` 등 더 넓은 타입에서 좁은 타입으로의 `as` 단언을 안전하지 않다고 보고 차단한다. 좁히려면 타입 가드를 거쳐야 한다.

**베스트 프랙티스.** 런타임 스키마 검증(zod 등)을 별도 도입하지 않은 프로젝트에서는 단언 차단만으로 안전성이 회복되지 않아 가드 강제 비용 대비 실효가 적고, 안전성이 중요한 경계에서는 규칙이 아닌 스키마 검증으로 처리한다.

**🆗 rule: incorrect (허용)**

```ts
const user = response as User
```

**⚠️ rule: correct (노이즈)**

```ts
function isUser(value: unknown): value is User {
  return typeof value === "object" && value !== null && "id" in value
}
if (isUser(response)) {
  const user = response
}
```
