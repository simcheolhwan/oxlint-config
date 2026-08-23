---
title: "Perf 채택 규칙"
---

## [eslint/no-await-in-loop](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-await-in-loop)

루프 본문에 `await`을 두면 매 반복이 이전 Promise를 기다리며 직렬화돼, 의도한 직렬 처리인지 의도하지 않은 성능 문제인지 코드만 봐서는 구분되지 않는다.

**베스트 프랙티스.** 병렬이 가능하면 `Promise.all`로, 직렬이 필수면 재귀로 의도를 드러내도록 강제해 우연한 직렬화를 차단한다.

**❌ incorrect**

```ts
for (const id of ids) {
  await fetchUser(id)
}
```

**✅ correct**

병렬이 가능하면 `Promise.all`로 한 번에 처리한다.

```ts
await Promise.all(ids.map((id) => fetchUser(id)))
```

**✅ correct**

직렬이 필수면 재귀로 의도를 드러낸다.

```ts
async function fetchSequential(remaining: string[]): Promise<void> {
  if (remaining.length === 0) return
  const [head, ...tail] = remaining
  await fetchUser(head)
  await fetchSequential(tail)
}
await fetchSequential(ids)
```

## [oxc/no-accumulating-spread](https://oxc.rs/docs/guide/usage/linter/rules/oxc/no-accumulating-spread)

`reduce` 누산기에서 spread를 반복하면 매 단계마다 배열을 복사해 O(n²)가 된다. `push`, `concat`, `for-of`처럼 선형 비용 패턴을 사용한다.

**베스트 프랙티스.** O(n²) 누적 패턴은 데이터가 커지면 즉시 성능 문제로 드러나므로 정적으로 막을 가치가 크다.

**❌ incorrect**

```ts
const merged = numbers.reduce((accumulated, value) => [...accumulated, value], [] as number[])
```

**✅ correct**

```ts
const merged: number[] = []
for (const value of numbers) {
  merged.push(value)
}
```

## [react/jsx-no-constructed-context-values](https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-no-constructed-context-values)

`<Context.Provider value={...}>`에 인라인 객체나 함수 표현식을 넘기면 렌더마다 새 참조가 생겨 Context 하위 구독자 전체가 불필요하게 리렌더된다. `useMemo`로 값을, `useCallback`으로 함수를 감싸 참조를 안정화한다.

**베스트 프랙티스.** Context를 도입한 본래 목적(전역 상태 공유)이 자식 트리 전체 리렌더로 무효화되는 흔한 문제라 `error`로 둔다.

**❌ incorrect**

```tsx
return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
```

**✅ correct**

```tsx
const value = useMemo(() => ({ user, setUser }), [user])
return <UserContext.Provider value={value}>{children}</UserContext.Provider>
```

## [react/no-array-index-key](https://oxc.rs/docs/guide/usage/linter/rules/react/no-array-index-key)

리스트 항목의 `key`를 배열 인덱스로 지정하면 항목의 추가, 삭제, 정렬에 따라 같은 인덱스가 다른 항목을 가리켜 React가 컴포넌트 상태를 잘못된 항목에 매핑한다.

**베스트 프랙티스.** `id`처럼 항목 자체에 안정적인 식별자가 있을 때 인덱스 key는 불필요한 재렌더와 상태 누수를 만들고, 값으로 식별 가능한 키가 없을 때만 인덱스를 마지막 수단으로 사용한다.

**❌ incorrect**

```tsx
items.map((item, index) => <Row key={index} item={item} />)
```

**✅ correct**

```tsx
items.map((item) => <Row key={item.id} item={item} />)
```
