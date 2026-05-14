## 프로젝트 정체성

이 저장소는 React + TypeScript 앱을 위한 Oxlint config 패키지(`@simcheolhwan/oxlint-config`)를 운영하면서 룰 결정 근거를 문서화한다. 산출물은 세 곳뿐이다.

- `src/rules/<카테고리>.ts`: 카테고리별 룰 정의. 파일 안에서 `// error` / `// off` 코멘트로 결정 등급 그룹을 구분한다.
- `src/index.ts`: 위 카테고리 모음을 합성한 `lintConfig: OxlintConfig` 단일 export. `options`, `env`, `plugins`, `categories`, `rules`, `overrides`를 모두 담는 단일 진실 원천.
- `docs/`: 카테고리별 룰 결정 근거. 채택과 제외를 같은 깊이로 기록한다.

빌드, lint, 포맷은 [Vite+](https://viteplus.dev/guide/)의 `vp` CLI로 통합되어 있다. 로컬 문서는 `node_modules/vite-plus/docs`에 있고, `vp help` 또는 `vp <command> --help`로 명령과 옵션을 조회한다.

## 검증 명령

- `vp install`: 원격 변경을 받은 뒤 가장 먼저 실행해 의존성을 동기화한다.
- `vp check`: 포맷, lint, 타입 체크.
- `vp pack`: `dist/` 빌드. 배포 직전 dts 포함 산출물이 정상인지 확인.
- `vp run <script>`: `package.json` 스크립트 실행 (예: `vp run build`).

## 문서 구조

`docs/`는 두 종류의 파일을 둔다.

- **카테고리별 결정**: `<우선순위>-<카테고리>.<결정>.md` 패턴.
  - `1-correctness.error.md` ~ `6-restriction.error.md`: 카테고리 우선순위 + 채택 룰 모음.
  - 같은 카테고리의 등급 변형은 별도 파일로 분리 (`2-suspicious.off.md`, `3-perf.off.md` 등).
  - `.off.md`는 의도적으로 끈 룰의 근거. 채택만큼 중요하므로 빠짐없이 기록한다.
- **메타 결정**: `0-overview.md` 등 카테고리 우선순위와 운영 정책의 결정 근거.

파일 안의 룰 항목과 `src/rules/<카테고리>.ts`의 같은 코멘트 그룹(예: `// error`) 안의 룰은 `<plugin>/<rule>` 전체 경로 기준 알파벳순으로 정렬한다. 추가와 승격 시에도 정렬을 유지한다.

`src/rules/<카테고리>.ts`의 `// error` / `// off` 그룹은 `.error.md` / `.off.md` 분류와 1:1 매칭이 기본이다. **예외**: `src/index.ts`의 `overrides`에서 `error`로 켜는 룰은 메인 그룹이 `// off`여도 `.error.md`에 둔다. 룰을 실제로 사용하는지가 분류 기준이고, 메인 off + override error 패턴은 항목 본문에서 설명한다. 예: `import/no-named-export`, `import/prefer-default-export` (`**/*.tsx` override), `jest/require-hook`, `vitest/require-hook` (`**/*.test.ts` override).

## 룰 항목 작성 형식

각 룰 항목은 하나의 `##` 헤딩 아래 네 개의 `###` 하위 섹션을 둔다.

### 룰 헤딩

`## [rule](공식 문서 URL)` 형식. URL은 [Oxlint 룰 인덱스](https://oxc.rs/docs/guide/usage/linter/rules)에서 찾는다. 개별 룰 URL 끝에 `.md`를 붙이면 HTML 대신 raw Markdown 본문이 응답되어 LLM 컨텍스트에 그대로 주입할 수 있다 (예: `https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-dupe-keys.md`).

### 하위 섹션 (순서 고정)

1. `### 설명`: 룰이 잡는 문제와 해결 방법을 적는다.
2. `### 근거`: 채택 또는 제외 결정의 근거를 적는다. 이 저장소만의 판단 가치를 담는다. 첫머리에 판단 성격을 드러내는 라벨을 붙인다: `**베스트 프랙티스.**`(업계 합의에 가까운 일반적 결정) 또는 `**취향.**`(이 저장소의 스타일과 맥락에 따른 결정).
3. `### 설정`: 룰의 설정 옵션을 적는다. 옵션이 있으면 `옵션명 (타입, default: 기본값): 역할` 형식의 목록으로 적고, 옵션이 없으면 `없음`이라고만 적는다.
4. `### 예시`: 정책 분류 라벨을 단 코드 예시를 둔다. 라벨은 코드 블록 밖에서 굵은 텍스트로 표기하고, 빈 줄을 한 줄 두고 ` ```ts ` (또는 `tsx`/`json`) 코드 블록을 이어 붙인다. 코드 블록 내부에 `// ❌ incorrect` 같은 라벨 주석은 넣지 않는다.

### 예시 라벨 규칙

- error 룰: `**❌ incorrect**` / `**✅ correct**`. 룰이 차단할 패턴과 우리가 권장할 패턴을 대비시킨다.
- off 룰: `**🆗 rule: incorrect (허용)**` / `**⚠️ rule: correct (노이즈)**`. 룰이 false positive로 잡는 의도 코드와, 룰이 통과시키지만 우리가 막고 싶은 비의도 코드를 라벨에 직접 명시한다.
- off 룰의 코드 블록 순서는 🆗 → ⚠️ 순으로 둔다. 항목에 따라 한쪽만 의미 있으면 그 블록만 둔다.
- 부가설명은 라벨 다음 줄에 한 문장으로 두며, **한 `##` 안에서 같은 라벨(이모지+텍스트)이 2회 이상 등장할 때만** 그 라벨 그룹의 모든 블록에 단다. 단독 라벨에는 두지 않는다. 옵션 적용이나 override 같은 룰 자체의 맥락은 `### 근거`/`### 설정`에 적는다.

### 묶음 항목

설명이 같거나 거의 같은 룰들은 `+`로 묶어 하나의 항목으로 작성한다.

- 헤딩 형식: `## [plugin1/rule1](url1) + [plugin2/rule2](url2)`. 첫 룰의 `<plugin>/<rule>` 경로로 알파벳 위치를 결정한다.
- 4개 하위 섹션 구조는 그대로 유지한다. `### 설명`과 `### 근거`에서 두 룰의 차이를 명시하고, 코드 예시가 동일하면 한 블록으로 통합한다.
- 묶는 기준은 명시적 동치 관계(`동치 룰`, `동일 의도`, `같은 이유로 끈다`) 또는 거의 동일한 문제, 근거, 코드. 다른 패턴을 잡는 룰(예: `no-unsafe-assignment` vs `no-unsafe-return`)은 각자 항목으로 둔다.

## 룰 변경 시 동기화 체크리스트

코드(`src/`)와 문서(`docs/`)는 항상 같은 turn에 동기화한다.

- `src/rules/<카테고리>.ts` 또는 `src/index.ts`의 `rules`/`overrides`/`categories`를 바꾸면 해당 카테고리의 `docs/N-*.md`를 같은 turn에 업데이트한다.
- 새 oxlint 빌트인 플러그인을 활성화할 때는 `src/index.ts`의 `plugins` 배열에 등록하고, 채택 룰을 `src/rules/<카테고리>.ts`에, 결정 근거를 `docs/N-*.md`에 같은 turn에 추가한다.
- `categories`를 새로 켤 때는 빌트인이 자동 활성화하는 룰 중 끄고 싶은 항목을 `src/rules/*.ts`의 `// off` 그룹에 명시적으로 등록한다 (예: `react/react-in-jsx-scope`).
- 변경 후 `vp check`로 noise를 확인하고, 새 false positive가 나오면 `.off.md`에 근거를 남긴 뒤 끈다.

## (임시) draft 파일 운영

`pedantic`/`style`/`restriction` 카테고리는 현재 재작성 중이다. 각 카테고리마다 두 종류의 파일이 공존한다.

- `<카테고리>.draft.md`: 검토 중인 후보 룰 모음.
- `<카테고리>.md`: 큐레이션 결과물.

두 파일 모두 위에 정의한 4개 하위 섹션 구조(`### 설명` → `### 근거` → `### 설정` → `### 예시`)와 예시 라벨 규칙을 동일하게 준수한다. 옵션이 없는 룰에 `없음`을 명시하는 정책도 양쪽에 똑같이 적용된다. **유일한 차이는 정식 파일만 `src/rules/<카테고리>.ts`에 반영된다는 점이다.**

룰을 draft에서 정식 파일로 승격할 때:

1. draft에 작성해 둔 항목을 정식 `.md`로 옮기고 `src/rules/<카테고리>.ts`를 같은 turn에 갱신한다.
2. **draft에서 해당 항목을 즉시 제거한다.** 두 곳에 같은 룰이 남으면 어느 쪽이 정책인지 모호해진다.

재작성이 끝나 draft가 비면 draft 파일 자체와 이 섹션을 함께 삭제한다.

## 작성 언어

문서와 주석은 한국어. 룰 이름, JSON 키, URL, 코드 식별자는 원문 그대로 둔다.
