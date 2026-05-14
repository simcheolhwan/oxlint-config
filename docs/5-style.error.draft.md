---
title: "Style 채택 규칙 (draft)"
---

## [eslint/default-param-last](https://oxc.rs/docs/guide/usage/linter/rules/eslint/default-param-last)

기본값 매개변수를 항상 마지막에 두도록 강제한다.

**베스트 프랙티스.** 기본값 매개변수가 필수 매개변수보다 앞에 오면 호출 시 명시적으로 `undefined`를 전달해야 해 혼란스럽다.

**❌ incorrect**

```ts
function fetchUsers(filter = "active", page: number) {}
```

**✅ correct**

```ts
function fetchUsers(page: number, filter = "active") {}
```

## [eslint/prefer-object-spread](https://oxc.rs/docs/guide/usage/linter/rules/eslint/prefer-object-spread)

`Object.assign({}, src)` 대신 `{ ...src }` spread 사용을 강제한다.

**베스트 프랙티스.** spread 표기가 더 짧고 의도가 명확하다.

**❌ incorrect**

```ts
const merged = Object.assign({}, base, override)
```

**✅ correct**

```ts
const merged = { ...base, ...override }
```

## [import/no-anonymous-default-export](https://oxc.rs/docs/guide/usage/linter/rules/import/no-anonymous-default-export)

익명 값의 기본 export를 금지하고 이름 있는 변수에 할당한 뒤 export하도록 강제한다.

**베스트 프랙티스.** 디버깅과 스택 트레이스에 이름이 보여 도움이 되지만 default export를 안 쓰는 정책과 효과가 겹친다.

**Configuration**

- `allowAnonymousClass` (boolean, default: `false`): 익명 클래스 export 허용 여부.
- `allowAnonymousFunction` (boolean, default: `false`): 익명 함수 export 허용 여부.
- `allowArray` (boolean, default: `false`): 배열 리터럴 export 허용 여부.
- `allowArrowFunction` (boolean, default: `false`): 화살표 함수 export 허용 여부.
- `allowCallExpression` (boolean, default: `true`): 함수 호출 결과 export 허용 여부.
- `allowLiteral` (boolean, default: `false`): 리터럴 값 export 허용 여부.
- `allowNew` (boolean, default: `false`): `new` 표현식 export 허용 여부.
- `allowObject` (boolean, default: `false`): 객체 리터럴 export 허용 여부.

**❌ incorrect**

```ts
export default () => {}
```

**✅ correct**

```ts
const noop = () => {}
export default noop
```

## [react/self-closing-comp](https://oxc.rs/docs/guide/usage/linter/rules/react/self-closing-comp)

자식이 없는 React 컴포넌트는 self-closing(`<Foo />`)으로 닫도록 강제한다.

**취향.** 표기가 짧고 자식 유무 의도가 명확해진다.

**Configuration**

- `component` (boolean, default: `true`): 사용자 정의 컴포넌트에 self-closing을 강제할지 여부.
- `html` (boolean, default: `true`): 네이티브 HTML 요소에 self-closing을 강제할지 여부.

**❌ incorrect**

```tsx
<Avatar size={32}></Avatar>
```

**✅ correct**

```tsx
<Avatar size={32} />
```

## [typescript/prefer-for-of](https://oxc.rs/docs/guide/usage/linter/rules/typescript/prefer-for-of)

`for (let i = 0; i < arr.length; i++)` 같은 인덱스 순회를 `for-of` 루프로 대체하도록 요구한다. 인덱스 변수와 수동 배열 접근이 사라져 가독성이 좋아지고 off-by-one 같은 실수도 줄어든다.

**베스트 프랙티스.** 인덱스가 실제로 필요한 경우는 `arr.entries()`로 표현해 의도를 분명히 한다.

**❌ incorrect**

```ts
for (let i = 0; i < items.length; i++) {
  console.log(items[i])
}
```

**✅ correct**

일반 순회는 `for-of`로 표현한다.

```ts
for (const item of items) {
  console.log(item)
}
```

**✅ correct**

인덱스가 필요하면 `entries()`로 의도를 드러낸다.

```ts
for (const [index, item] of items.entries()) {
  console.log(index, item)
}
```

## [typescript/prefer-readonly](https://oxc.rs/docs/guide/usage/linter/rules/typescript/prefer-readonly)

변경되지 않는 클래스 멤버에 `readonly` 표시를 강제한다.

**베스트 프랙티스.** 의도된 불변성을 타입에 드러내 의도치 않은 재할당을 컴파일러가 잡아낸다.

**Configuration**

- `onlyInlineLambdas` (boolean, default: `false`): 인라인 람다로 즉시 초기화된 멤버에만 검사 범위를 제한할지 여부.

**❌ incorrect**

```ts
class User {
  private name: string
  constructor(name: string) {
    this.name = name
  }
}
```

**✅ correct**

```ts
class User {
  private readonly name: string
  constructor(name: string) {
    this.name = name
  }
}
```

## [unicorn/no-await-expression-member](https://oxc.rs/docs/guide/usage/linter/rules/unicorn/no-await-expression-member)

`(await x).y` 같이 await 결과에서 직접 멤버 접근을 금지한다.

**베스트 프랙티스.** `await`의 우선순위가 헷갈려 버그를 유발하므로 변수에 분리하면 의도가 분명해진다.

**❌ incorrect**

```ts
const name = (await fetchUser()).name
```

**✅ correct**

```ts
const user = await fetchUser()
const name = user.name
```
