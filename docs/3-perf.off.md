---
title: "Perf 제외 규칙"
---

## [oxc/no-map-spread](https://oxc.rs/docs/guide/usage/linter/rules/oxc/no-map-spread)

`Array.prototype.map` 콜백 안에서 객체/배열 spread(`{ ...item }`, `[...arr]`)로 새 값을 만들면 매 항목마다 얕은 복사가 발생한다고 보고, `Object.assign(item, ...)`로 원본을 제자리에서 변경하는 패턴을 권한다.

**베스트 프랙티스.** `map`은 본래 매 항목에 새로운 값을 만드는 순수 변환이라 spread가 가장 자연스러운 표현이고, 규칙이 권하는 제자리 변경은 불변성을 훼손해 얕은 복사 비용보다 더 큰 부수 효과를 만드는 과최적화다.

**Configuration**

- `ignoreArgs` (bool, default: `true`): 배열을 함수 인수로 전달하는 경우 보고 제외
- `ignoreRereads` (bool, default: `true`): map 결과 배열을 다시 읽는 경우 보고 제외

**🆗 rule: incorrect (허용)**

```ts
const updated = items.map((item) => ({ ...item, active: true }))
```

**⚠️ rule: correct (노이즈)**

```ts
const updated = items.map((item) => Object.assign(item, { active: true }))
```
