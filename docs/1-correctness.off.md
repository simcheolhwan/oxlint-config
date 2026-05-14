# Correctness 제외 규칙

## [jsx-a11y/no-autofocus](https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/no-autofocus)

### 설명

- JSX 요소의 `autoFocus` 속성을 일률 금지하는 룰.
- 자동 포커스가 사용자 의도를 거슬러 보조 기술 흐름을 깨뜨릴 수 있다는 점을 근거로 한다.

### 근거

- **취향.** 우리 UX 가이드(VERCEL.md `Autofocus`)는 데스크톱에서 단일 주 입력 폼(로그인, 검색 모달)에 한해 자동 포커스를 권장한다.
- 룰은 그 정당한 사용까지 false positive로 잡고, 회피 패턴이 `useEffect`+`ref` 보일러플레이트로 늘어나 가독성이 떨어진다.
- 사용 시점은 케이스별 판단에 맡긴다.

### 설정

- `ignoreNonDOM` (bool, default: `false`): 사용자 정의 컴포넌트(non-DOM) 무시

### 예시

**🆗 rule: incorrect (허용)**

```tsx
function SignInForm() {
  return (
    <form>
      <input autoFocus type="email" />
    </form>
  )
}
```

**⚠️ rule: correct (노이즈)**

```tsx
function SignInForm() {
  const emailRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    emailRef.current?.focus()
  }, [])
  return (
    <form>
      <input ref={emailRef} type="email" />
    </form>
  )
}
```
