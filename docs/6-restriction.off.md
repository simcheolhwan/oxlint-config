# Restriction 제외 규칙

## [eslint/no-plusplus](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-plusplus)

### 설명

- `++`/`--` 단항 연산자 사용을 금지하고 `x += 1`/`x -= 1` 표기로 통일하도록 강제하는 룰.

### 근거

- **취향.** 자동 세미콜론 삽입(ASI) 위험은 이론적으로 존재하지만 `vp fmt`가 세미콜론을 일관되게 처리하므로 실제로 발생할 여지가 없다.
- `for (let i = 0; i < n; i++)` 같은 카운터 패턴이 압도적 관용이라 일률 금지가 노이즈로만 작동한다.

### 설정

- `allowForLoopAfterthoughts` (bool, default: `false`): `for`문 afterthought(세 번째 절)에서만 `++`/`--` 허용

### 예시

**🆗 rule: incorrect (허용)**

```ts
for (let i = 0; i < n; i++) {
  total++
}
```

**⚠️ rule: correct (노이즈)**

```ts
for (let i = 0; i < n; i += 1) {
  total += 1
}
```

## [eslint/no-undefined](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-undefined)

### 설명

- `undefined` 식별자 사용을 금지하고 빈 선언(`let x`)이나 `void 0`로 대체하도록 강제하는 룰.
- ES5에서 `undefined`가 재정의 가능했던 역사적 이유에서 출발한다.

### 근거

- **베스트 프랙티스.** React/Mantine 환경 부적합.
- props에 조건부 undefined(`<Text c={hasError ? "red" : undefined}>`)로 옵션 자리를 비우는 패턴이 자연스럽고, 함수 default 매개변수의 명시적 `undefined` 비교도 흔하다.
- ES2015 이후 `undefined`는 전역 immutable이라 안전성 이유가 사라졌고 가독성만 손해 본다.

### 설정

없음

### 예시

**🆗 rule: incorrect (허용)**

```ts
let value = undefined
```

**⚠️ rule: correct (노이즈)**

```ts
let value
```

## [import/no-default-export](https://oxc.rs/docs/guide/usage/linter/rules/import/no-default-export)

### 설명

- 모듈의 default export 사용을 금지하고 named export로 통일하도록 강제하는 룰.

### 근거

- **취향.** named export 일관성에 가치는 있지만 React 컴포넌트(`.tsx`)뿐 아니라 일반 `.ts` 파일에서도 라우트 모듈, 환경별 진입점, 단일 책임 모듈 등 default export가 자연스러운 경우가 분명히 있어 일률 금지는 부담스럽다.
- 일반 `.ts`에서 named export가 표준인 점은 본문 정책으로 유지하면서, default가 어울리는 자리는 자유롭게 둔다.

### 설정

없음

### 예시

**🆗 rule: incorrect (허용)**

```ts
export default function entry(): string {
  return "default export is forbidden by the rule"
}
```

**⚠️ rule: correct (노이즈)**

```ts
export function entry(): string {
  return "named export is preferred"
}
```

## [oxc/no-async-await](https://oxc.rs/docs/guide/usage/linter/rules/oxc/no-async-await)

### 설명

- `async`/`await` 문법 사용을 금지하는 룰.

### 근거

- **베스트 프랙티스.** 프로젝트 표준 비동기 문법을 금지할 이유가 없다.

### 설정

없음

### 예시

**🆗 rule: incorrect (허용)**

```ts
async function load() {
  return await fetchValue()
}
```

**⚠️ rule: correct (노이즈)**

```ts
function load() {
  return fetchValue().then((value) => value)
}
```

## [oxc/no-optional-chaining](https://oxc.rs/docs/guide/usage/linter/rules/oxc/no-optional-chaining)

### 설명

- optional chaining 문법(`?.`) 사용을 금지하는 룰.

### 근거

- **베스트 프랙티스.** optional chaining은 TypeScript의 권장 패턴이자 안전한 접근의 표준 문법이라 막을 이유가 없다.
- `&&` 단축 평가는 falsy 값(`0`, `""`)까지 분기시켜 의도와 다른 결과를 만들기 쉬운데 `?.`은 nullish만 좁혀 의도가 분명하다.

### 설정

- `message` (string, default: `""`): optional chaining 감지 시 표시할 커스텀 안내 메시지

### 예시

**🆗 rule: incorrect (허용)**

```ts
const displayName = user?.name
```

**⚠️ rule: correct (노이즈)**

```ts
const displayName = user && user.name
```

## [oxc/no-rest-spread-properties](https://oxc.rs/docs/guide/usage/linter/rules/oxc/no-rest-spread-properties)

### 설명

- 객체/배열의 rest와 spread 문법(`{ ...obj }`, `[...arr]`)을 금지하는 룰.

### 근거

- **베스트 프랙티스.** spread는 불변 패턴의 핵심 표현이라 금지하면 코드가 더 장황해진다.

### 설정

- `objectRestMessage` (string, default: `""`): object rest 감지 시 표시할 커스텀 메시지
- `objectSpreadMessage` (string, default: `""`): object spread 감지 시 표시할 커스텀 메시지

### 예시

**🆗 rule: incorrect (허용)**

```ts
const merged = { ...defaults, ...overrides }
const [first, ...rest] = items
```

**⚠️ rule: correct (노이즈)**

```ts
const merged = Object.assign({}, defaults, overrides)
const first = items[0]
const rest = items.slice(1)
```

## [react/no-multi-comp](https://oxc.rs/docs/guide/usage/linter/rules/react/no-multi-comp)

### 설명

- 한 파일에 여러 React 컴포넌트 정의를 금지하는 룰.
- 컴포넌트별 파일 분리를 요구한다.

### 근거

- **베스트 프랙티스.** Base UI 스타일 compound 컴포넌트(`SegmentControl.Item`, `Tabs.Trigger` 등)는 의도적으로 한 파일에 부모와 자식 컴포넌트를 함께 둔다.
- 이 패턴을 막아 끈다.

### 설정

- `ignoreStateless` (bool, default: `false`): 파일 내 stateless 컴포넌트 복수 허용 (`memo`/`forwardRef` 래핑 포함)

### 예시

**🆗 rule: incorrect (허용)**

```tsx
function SegmentControl({ children }: { children: ReactNode }) {
  return <div>{children}</div>
}
function Item({ children }: { children: ReactNode }) {
  return <button>{children}</button>
}
SegmentControl.Item = Item
```

**⚠️ rule: correct (노이즈)**

```tsx
// SegmentControl.tsx와 Item.tsx로 분리
```

## [typescript/no-invalid-void-type](https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-invalid-void-type)

### 설명

- return 타입과 일부 generic argument(`Promise<void>` 등) 외 위치에서 `void` 사용을 금지하는 룰.
- 파라미터, 프로퍼티, alias에 `void`가 등장하면 보통 타입 설계 실수의 신호로 보고 잡는다.

### 근거

- **베스트 프랙티스.** `Promise.withResolvers<void>()`는 ES2024 표준 API의 정당한 generic argument 사용이지만 oxc 구현이 이를 false positive로 잡는다.
- ESLint 본가에는 `allowInGenericTypeArguments` 옵션으로 generic argument 위치를 화이트리스트할 수 있는데, oxc는 옵션이 노출돼도 generic argument 위치 판정이 불완전해 우회가 안 된다.
- oxlint 한계가 해소될 때까지 끈다.

### 설정

- `allowAsThisParameter` (bool, default: `false`): `this` 파라미터에 `void` 허용
- `allowInGenericTypeArguments` (array | bool, default: 없음): generic argument 위치에서 `void` 허용. `true` 또는 화이트리스트 타입명 배열

### 예시

**🆗 rule: incorrect (허용)**

```ts
const { promise, resolve } = Promise.withResolvers<void>()
```

## [vitest/require-test-timeout](https://oxc.rs/docs/guide/usage/linter/rules/vitest/require-test-timeout)

### 설명

- 모든 `test`/`it` 호출에 명시적 timeout 인자(또는 `vi.setConfig({ testTimeout })` 글로벌 설정)를 강제하는 룰.

### 근거

- **취향.** 테스트별 timeout이 의미 있는 경우는 일부 느린 통합 테스트에 한정되고, 글로벌 timeout 설정으로 충분히 다뤄진다.
- 모든 테스트에 timeout 인자를 추가하면 시그너처가 노이즈로 가득 차고, 콜백 위치(2번째/3번째 인자)도 옵션 객체 사용 여부에 따라 흔들려 가독성이 떨어진다.

### 설정

없음

### 예시

**🆗 rule: incorrect (허용)**

```ts
it("slow test", async () => {
  await doSlowThing()
})
```

**⚠️ rule: correct (노이즈)**

```ts
it("slow test", async () => {
  await doSlowThing()
}, 1000)
```
