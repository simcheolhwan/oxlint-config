---
title: "카테고리와 플러그인 활성화 정책"
---

## 전제

- **앱**: TypeScript + React + Vitest
- **라이브러리**: TypeScript + Node.js + Vitest
- **제외**: Next.js, Vue, Jest

Oxlint는 correctness 중심의 신뢰도 높은 규칙을 기본 활성화한다. 우선순위는 버그 예방성, 타입 안정성, 오탐 위험, 도입 비용을 기준으로 정한다.

## 카테고리

| 카테고리      | 앱       | 라이브러리 | 비고               |
| ------------- | -------- | ---------- | ------------------ |
| `correctness` | 🔴 error | 🔴 error   | CI 통과 조건       |
| `suspicious`  | 🔴 error | 🔴 error   | CI 통과 조건       |
| `perf`        | 🟡 warn  | 🟡 warn    |                    |
| `pedantic`    | 🟡 warn  | 🟡 warn    |                    |
| `style`       | ⚪ off   | ⚪ off     | 포매터와 충돌 가능 |
| `restriction` | ⚪ off   | ⚪ off     | 개별 규칙만 선택   |
| `nursery`     | ⚪ off   | ⚪ off     | 개발 중인 규칙     |

## 플러그인

| 플러그인                | 앱      | 라이브러리            |
| ----------------------- | ------- | --------------------- |
| `typescript`            | 🟢 필수 | 🟢 필수               |
| `eslint`                | 🟢 필수 | 🟢 필수               |
| `oxc`                   | 🟢 필수 | 🟢 필수               |
| `import`                | 🟢 필수 | 🟢 필수               |
| `react`                 | 🟢 필수 | 🟢 React 라이브러리만 |
| `promise`               | 🟡 권장 | 🟡 권장               |
| `vitest`                | 🟡 권장 | 🟡 권장               |
| `unicorn`               | 🟡 권장 | 🟡 권장               |
| `jsx-a11y`              | 🟡 권장 | 🟡 React 라이브러리만 |
| `react-perf`            | 🔵 선택 | 🟡 React 라이브러리만 |
| `jsdoc`                 | 🔵 선택 | 🟡 권장 (공개 API)    |
| `node`                  | 🔵 선택 | 🔵 Node 타깃이면 채택 |
| `nextjs`, `vue`, `jest` | ⚫ 제외 | ⚫ 제외               |

타입 인식 규칙(처리되지 않은 Promise, 안전하지 않은 할당 등)은 `oxlint-tsgolint` 의존성을 추가하고 `options.typeAware`를 켠다.
