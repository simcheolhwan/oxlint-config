# Perf 제외 규칙

## [oxc/no-map-spread](https://oxc.rs/docs/guide/usage/linter/rules/oxc/no-map-spread)

### 설명

- `Array.prototype.map` 콜백 안에서 객체/배열 spread(`{ ...item }`, `[...arr]`)로 새 값을 만들면 매 항목마다 얕은 복사가 발생한다는 룰.
- 권장 대안은 `Object.assign(item, ...)`로 원본을 in-place 변이시키는 패턴이다.

### 근거

- **베스트 프랙티스.** `map`은 본래 매 항목에 새로운 값을 만들어내는 순수 변환이라 spread가 가장 자연스러운 표현이다.
- 룰이 권하는 in-place 변이는 원본 배열을 망가뜨려 immutability를 깨뜨리므로, 얕은 복사 비용을 아끼려다 더 큰 부작용을 떠안는 과최적화로 본다.

### 설정

- `ignoreArgs` (bool, default: `true`): 배열을 함수 인수로 전달하는 경우 리포트 제외
- `ignoreRereads` (bool, default: `true`): map 결과 배열을 다시 읽는 경우 리포트 제외

### 예시

**🆗 rule: incorrect (허용)**

```ts
const updated = items.map((item) => ({ ...item, active: true }))
```

**⚠️ rule: correct (노이즈)**

```ts
const updated = items.map((item) => Object.assign(item, { active: true }))
```
