# Pedantic 채택 규칙 (draft)

## [eslint/max-classes-per-file](https://oxc.rs/docs/guide/usage/linter/rules/eslint/max-classes-per-file)

한 파일에 여러 클래스를 두면 책임이 분산되고 import 시 불필요한 부분까지 함께 로드된다. 파일당 클래스 1개를 유지한다.

**베스트 프랙티스.** 책임 분리와 import 단위 정합성에 도움이 된다.

**Configuration**

- `max` (integer, default: `1`): 파일당 허용되는 최대 클래스 수.
- `ignoreExpressions` (boolean, default: `false`): 클래스 표현식(class expression)을 카운트에서 제외할지 여부.

**❌ incorrect**

```ts
class Foo {}
class Bar {}
```

**✅ correct**

```ts
class Foo {}
```

## [eslint/no-useless-return](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-useless-return)

함수 끝이나 분기 마지막의 불필요한 `return;` 문을 금지하고 자동 제거를 권한다.

**베스트 프랙티스.** 명시적 `return;`이 의미를 더하지 못하는 경우(함수의 마지막 statement, else 없는 if 블록의 끝 등)를 잡고, early return 분기의 `return`은 다음 코드 실행을 막는 의미가 있어 잡지 않는다.

**❌ incorrect**

```ts
function process(value: string) {
  doWork(value)
  return
}
```

**✅ correct**

```ts
function process(value: string) {
  if (value.length === 0) {
    handleEmpty()
    return
  }
  doWork(value)
}
```

## [react/rules-of-hooks](https://oxc.rs/docs/guide/usage/linter/rules/react/rules-of-hooks)

Hook을 조건문 안에서 호출하면 렌더마다 호출 순서가 달라져 React가 상태를 잘못 매핑할 수 있다. Hook은 컴포넌트 최상위에서 항상 같은 순서로 호출한다.

**베스트 프랙티스.** 위반 시 상태가 잘못 매핑되는 치명적 런타임 버그라 정적 검사 없이는 매우 위험하다.

**❌ incorrect**

```tsx
if (props.title.length > 0) {
  useState(false)
}
```

**✅ correct**

```tsx
const [open, setOpen] = useState(false)
if (props.title.length > 0) {
  setOpen(true)
}
```

## [typescript/no-unsafe-member-access](https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-unsafe-member-access)

`any` 객체의 멤버에 접근하면 존재하지 않는 속성도 통과한다. 객체에 정확한 타입을 부여한 뒤 접근한다.

**베스트 프랙티스.** 존재하지 않는 멤버 접근을 정적으로 막아 런타임 오류를 줄인다.

**Configuration**

- `allowOptionalChaining` (boolean, default: `false`): `any` 값에 대한 optional chaining(`?.`) 멤버 접근을 허용할지 여부.

**❌ incorrect**

```ts
declare const value: any
const id = value.id
```

**✅ correct**

```ts
declare const value: { id: string }
const id = value.id
```

## [unicorn/prefer-at](https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-at)

`arr[arr.length - 1]` 같은 인덱스 계산은 가독성이 떨어진다. `Array.prototype.at()`을 사용해 음수 인덱스로 끝에서부터 접근한다.

**취향.** `at(-1)`이 인덱스 산식보다 한눈에 의미를 드러내 가독성에 도움이 된다.

**Configuration**

- `checkAllIndexAccess` (boolean, default: `false`): 활성화 시 `array[length - 1]` 같은 특수 패턴뿐 아니라 모든 bracket 인덱스 접근(`array[0]` 등)을 검사한다.
- `getLastElementFunctions` (string[], default: `[]`): 마지막 요소를 반환하는 함수 이름 목록. 이 함수 호출도 `.at(-1)` 사용을 유도하도록 검사한다.

**❌ incorrect**

```ts
const last = items[items.length - 1]
```

**✅ correct**

```ts
const last = items.at(-1)
```

## [unicorn/prefer-native-coercion-functions](https://oxc.rs/docs/guide/usage/linter/rules/unicorn/prefer-native-coercion-functions)

`x => Boolean(x)`, `x => String(x)` 같은 래퍼 함수는 네이티브 변환 함수로 대체하면 더 명확하다.

**취향.** `filter(Boolean)`처럼 더 간결한 표현으로 유도한다.

**❌ incorrect**

```ts
const truthy = values.filter((value) => Boolean(value))
```

**✅ correct**

```ts
const truthy = values.filter(Boolean)
```
