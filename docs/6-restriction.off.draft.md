# Restriction 제외 규칙 (draft)

## [typescript/non-nullable-type-assertion-style](https://oxc.rs/docs/guide/usage/linter/rules/typescript/non-nullable-type-assertion-style)

`null`/`undefined` 제거 시 `value as Type` 캐스트가 아닌 `value!` non-null assertion을 쓰도록 강제한다.

**베스트 프랙티스.** 권장 형태인 `!`이 이 프로젝트의 `typescript/no-non-null-assertion`(`!` 금지)과 충돌해 끄고, nullable 제거는 가드(`if (value !== null)`)로 처리한다.

**🆗 rule: incorrect (허용)**

```ts
if (value !== null) {
  const length = value.length
}
```

**⚠️ rule: correct (노이즈)**

```ts
const length = value!.length
```
