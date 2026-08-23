---
title: "카테고리와 플러그인 활성화 정책"
---

## 전제

- **App**: TypeScript + React + Vitest
- **Library**: TypeScript + Node.js + Vitest
- **제외**: Next.js, Vue, Jest

Oxlint는 correctness 중심의 고신호 rule을 기본 활성화한다. 우선순위는 버그 예방성, 타입 안정성, false positive 위험, 도입 비용을 기준으로 정한다.

## 카테고리

| 카테고리      | App      | Library  | 비고                  |
| ------------- | -------- | -------- | --------------------- |
| `correctness` | 🔴 error | 🔴 error | CI gate               |
| `suspicious`  | 🔴 error | 🔴 error | CI gate               |
| `perf`        | 🟡 warn  | 🟡 warn  |                       |
| `pedantic`    | 🟡 warn  | 🟡 warn  |                       |
| `style`       | ⚪ off   | ⚪ off   | formatter와 충돌 가능 |
| `restriction` | ⚪ off   | ⚪ off   | 개별 rule만 선택      |
| `nursery`     | ⚪ off   | ⚪ off   | 개발 중 rule          |

## 플러그인

| 플러그인                | App     | Library               |
| ----------------------- | ------- | --------------------- |
| `typescript`            | 🟢 필수 | 🟢 필수               |
| `eslint`                | 🟢 필수 | 🟢 필수               |
| `oxc`                   | 🟢 필수 | 🟢 필수               |
| `import`                | 🟢 필수 | 🟢 필수               |
| `react`                 | 🟢 필수 | 🟢 React library만    |
| `promise`               | 🟡 권장 | 🟡 권장               |
| `vitest`                | 🟡 권장 | 🟡 권장               |
| `unicorn`               | 🟡 권장 | 🟡 권장               |
| `jsx-a11y`              | 🟡 권장 | 🟡 React library만    |
| `react-perf`            | 🔵 선택 | 🟡 React library만    |
| `jsdoc`                 | 🔵 선택 | 🟡 권장 (public API)  |
| `node`                  | 🔵 선택 | 🔵 Node 타깃이면 채택 |
| `nextjs`, `vue`, `jest` | ⚫ 제외 | ⚫ 제외               |

Type-aware rule (unhandled promise, unsafe assignment 등)은 `oxlint-tsgolint` 의존성을 추가하고 `options.typeAware`를 켠다.
