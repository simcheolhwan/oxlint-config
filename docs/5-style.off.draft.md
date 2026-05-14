# Style 제외 규칙 (draft)

## [eslint/prefer-exponentiation-operator](https://oxc.rs/docs/guide/usage/linter/rules/eslint/prefer-exponentiation-operator)

### 설명

- `Math.pow()` 대신 `**` 거듭제곱 연산자 사용을 강제하는 룰.

### 근거

- **취향.** `Math.pow`도 명시적이고 검색에 유리해 표기 강제로 얻는 이점이 작다.

### 설정

없음

### 예시

**🆗 rule: incorrect (허용)**

```ts
const square = Math.pow(2, 10)
```

**⚠️ rule: correct (노이즈)**

```ts
const square = 2 ** 10
```

## [typescript/dot-notation](https://oxc.rs/docs/guide/usage/linter/rules/typescript/dot-notation)

### 설명

- 가능한 경우 `obj["prop"]` 대신 `obj.prop` dot notation을 사용하도록 강제하는 룰.

### 근거

- **베스트 프랙티스.** 표기 차이가 가독성에 큰 영향을 주지 않고, 환경 변수, 설정 키처럼 문자열로 다루는 게 자연스러운 접근에서는 bracket 표기가 의도를 더 잘 드러낸다.

### 설정

- `allowIndexSignaturePropertyAccess` (boolean, default: `false`): 인덱스 시그니처 속성 접근에 bracket 표기 허용 여부.
- `allowKeywords` (boolean, default: `true`): ES3 예약어를 키로 사용할 때 dot 표기 허용 여부.
- `allowPattern` (string, default: `""`): 정규식 패턴과 일치하는 키에 bracket 표기 허용.
- `allowPrivateClassPropertyAccess` (boolean, default: `false`): private 클래스 속성 접근에 bracket 표기 허용 여부.
- `allowProtectedClassPropertyAccess` (boolean, default: `false`): protected 클래스 속성 접근에 bracket 표기 허용 여부.

### 예시

**🆗 rule: incorrect (허용)**

```ts
const name = user["name"]
```

**⚠️ rule: correct (노이즈)**

```ts
const name = user.name
```

## [typescript/no-inferrable-types](https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-inferrable-types)

### 설명

- 추론 가능한 원시 타입의 명시적 표기를 금지하는 룰.
- 타입 추론에 맡기고 표기를 생략하도록 요구한다.

### 근거

- **취향.** 추론에 맡기는 편이 깔끔하지만 호출자에 타입을 시각적으로 보여주려는 의도와 충돌한다.

### 설정

- `ignoreParameters` (boolean, default: `false`): 함수 매개변수의 타입 표기를 검사에서 제외할지 여부.
- `ignoreProperties` (boolean, default: `false`): 클래스 속성의 타입 표기를 검사에서 제외할지 여부.

### 예시

**🆗 rule: incorrect (허용)**

```ts
const count: number = 0
```

**⚠️ rule: correct (노이즈)**

```ts
const count = 0
```

## [typescript/parameter-properties](https://oxc.rs/docs/guide/usage/linter/rules/typescript/parameter-properties)

### 설명

- TypeScript 클래스의 parameter property(`constructor(private x: number)`) 사용을 금지하는 룰.

### 근거

- **베스트 프랙티스.** parameter property는 TypeScript 표준 단축 표기로 보일러플레이트를 줄여준다.
- React 코드베이스에서 클래스 사용 자체가 드물어 강제 금지의 실익이 작다.

### 설정

- `allow` (array, default: `[]`): 예외로 허용할 modifier 조합 목록. `"private"`, `"private readonly"`, `"protected"`, `"protected readonly"`, `"public"`, `"public readonly"`, `"readonly"` 중 선택.
- `prefer` (`"class-property" | "parameter-property"`, default: `"class-property"`): 선호 표기 방식.

### 예시

**🆗 rule: incorrect (허용)**

```ts
class User {
  constructor(private name: string) {}
}
```

**⚠️ rule: correct (노이즈)**

```ts
class User {
  private name: string
  constructor(name: string) {
    this.name = name
  }
}
```
