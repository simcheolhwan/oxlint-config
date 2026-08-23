## 프로젝트 정체성

이 저장소는 React + TypeScript 앱을 위한 Oxlint config 패키지(`@simcheolhwan/oxlint-config`)를 운영하면서 규칙 결정 근거를 문서화한다. 산출물은 세 곳뿐이다.

- `src/rules/<카테고리>.ts`: 카테고리별 규칙 정의. 파일 안에서 `// error` / `// off` 코멘트로 결정 등급 그룹을 구분한다.
- `src/index.ts`: 위 카테고리 모음을 합성한 `lintConfig: OxlintConfig` 단일 export. `options`, `env`, `plugins`, `categories`, `rules`, `overrides`를 모두 담는 단일 진실 원천.
- `docs/`: 카테고리별 규칙 결정 근거. 채택과 제외를 같은 깊이로 기록한다.

빌드, lint, 포맷은 [Vite+](https://viteplus.dev/guide/)의 `vp` CLI로 통합되어 있다. 로컬 문서는 `node_modules/vite-plus/docs`에 있고, `vp help` 또는 `vp <command> --help`로 명령과 옵션을 조회한다.

저장소 루트의 `CLAUDE.md`는 `AGENTS.md` 심볼릭 링크다. 두 파일은 같은 내용을 가리키므로 `AGENTS.md`만 수정한다.

## 검증 명령

- `vp install`: 원격 변경을 받은 뒤 가장 먼저 실행해 의존성을 동기화한다.
- `vp check`: 포맷, lint, 타입 체크.
- `vp test`: `fixtures/`의 고의 오류가 예상한 규칙과 심각도로 검출되는지 확인.
- `vp pack`: `dist/` 빌드. 배포 직전 dts 포함 산출물이 정상인지 확인.
- `vp run <script>`: `package.json` 스크립트 실행 (예: `vp run build`).

## 린트 규칙 검증

`fixtures/`는 `lintConfig`가 규칙을 실제로 검출하는지 확인하는 검증 자산이다. 패키지 산출물이 아니다 (`dist`에 포함되지 않음).

- 고의로 린트 오류를 담는다. **수정하거나 오류를 고치지 마라.** 일반 `vp check`에서는 제외하고 `vp test`가 규칙 검출 결과를 검증한다.
- 각 오류 옆 인라인 코멘트가 `<plugin>/<rule> (<category>)`를 명시한다.
- `vite.config.ts`의 `staged`는 `fixtures/`를 제외하므로 커밋 시 자동 fix되지 않는다.
- 루트 `vite.config.ts`의 `lint.ignorePatterns`는 일반 린트에서 `fixtures/`를 제외하고, `fixtures/vite.config.ts`는 fixture 검증 시 이 디렉터리를 별도 Vite+ 프로젝트로 실행한다.

## 문서 구조

각 `docs/*.md`는 frontmatter `title: "..."`를 두며, 본문은 `## …`부터 시작한다. `title`은 [Mintlify](https://mintlify.com) 사이드바 라벨, 페이지 헤더 H1, 브라우저 탭 제목에 모두 사용된다.

`docs/`는 두 종류의 파일을 둔다.

- **카테고리별 결정**: `<우선순위>-<카테고리>.<결정>.md` 패턴.
  - `1-correctness.error.md` ~ `6-restriction.error.md`: 카테고리 우선순위 + 채택 규칙 모음.
  - 같은 카테고리의 등급 변형은 별도 파일로 분리 (`2-suspicious.off.md`, `3-perf.off.md` 등).
  - `.off.md`는 의도적으로 끈 규칙의 근거. 채택만큼 중요하므로 빠짐없이 기록한다.
- **메타 결정**: `0-overview.md` 등 카테고리 우선순위와 운영 정책의 결정 근거.

파일 안의 규칙 항목과 `src/rules/<카테고리>.ts`의 같은 코멘트 그룹(예: `// error`) 안의 규칙은 `<plugin>/<rule>` 전체 경로 기준 알파벳순으로 정렬한다. 추가와 승격 시에도 정렬을 유지한다.

`src/rules/<카테고리>.ts`의 `// error` / `// off` 그룹은 `.error.md` / `.off.md` 분류와 1:1 매칭이 기본이다. **예외**: `src/index.ts`의 `overrides`에서 `error`로 켜는 규칙은 메인 그룹이 `// off`여도 `.error.md`에 둔다. 규칙을 실제로 사용하는지가 분류 기준이고, 메인 off + override error 패턴은 항목 본문에서 설명한다. 예: `import/no-named-export`, `import/prefer-default-export` (`**/*.tsx` override), `vitest/require-hook` (`**/*.test.{ts,tsx}` override).

## 규칙 항목 작성 형식

각 규칙 항목은 하나의 `##` 헤딩 아래 본문 블록들을 순서대로 둔다. 하위 헤딩은 두지 않고 본문 흐름에 두며, 블록 간은 빈 줄로 구분한다.

### 규칙 헤딩

`## [rule](공식 문서 URL)` 형식. URL은 [Oxlint 규칙 인덱스](https://oxc.rs/docs/guide/usage/linter/rules)에서 찾는다. 개별 규칙 URL 끝에 `.md`를 붙이면 HTML 대신 raw Markdown 본문이 응답되어 LLM 컨텍스트에 그대로 주입할 수 있다 (예: `https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-dupe-keys.md`).

### 본문 블록 (순서 고정)

1. **설명**: 규칙 헤딩 바로 다음에 한 줄로 적는다. 규칙이 잡는 문제와 해결 방법을 적는다.
2. **근거**: 빈 줄로 구분하고, `**베스트 프랙티스.**`(업계 합의에 가까운 일반적 결정) 또는 `**취향.**`(이 저장소의 스타일과 맥락에 따른 결정) 라벨로 한 줄로 적는다. 라벨에는 마침표를 포함하고, 라벨 뒤에 한 칸 띄고 같은 줄에 근거를 이어 쓴다.
3. **설정**: `**Configuration**` 줄을 굵게 두고 빈 줄 후 본문에 옵션 목록을 적는다. 옵션이 있으면 `옵션명 (타입, default: 기본값): 역할` 형식의 목록으로 적고, 옵션이 없으면 블록 자체를 생략한다. 설정 적용 JSON 블록을 보일 때는 본문 끝에서 빈 줄을 두고 `**⚙️ 설정**` 라벨을 붙인 뒤 ` ```json ` 코드 블록을 이어 붙인다.
4. **예시**: 헤딩 없이 정책 분류 라벨을 코드 블록 밖에서 굵은 텍스트로 표기하고, 빈 줄을 한 줄 두고 ` ```ts ` (또는 `tsx`) 코드 블록을 이어 붙인다.

### 예시 라벨 규칙

- error 규칙: `**❌ incorrect**` / `**✅ correct**`. 규칙이 차단할 패턴과 우리가 권장할 패턴을 대비시킨다.
- off 규칙: `**🆗 rule: incorrect (허용)**` / `**⚠️ rule: correct (노이즈)**`. 규칙이 false positive로 잡는 의도 코드와, 규칙이 통과시키지만 우리가 막고 싶은 비의도 코드를 라벨에 직접 명시한다.
- off 규칙의 코드 블록 순서는 🆗 → ⚠️ 순으로 둔다. 항목에 따라 한쪽만 의미 있으면 그 블록만 둔다.
- 부가설명은 라벨 다음 줄에 한 문장으로 두며, **한 `##` 안에서 같은 라벨(이모지+텍스트)이 2회 이상 등장할 때만** 그 라벨 그룹의 모든 블록에 단다. 단독 라벨에는 두지 않는다. 옵션 적용이나 override 같은 규칙 자체의 맥락은 근거/설정 블록에 적는다.

### 묶음 항목

설명이 같거나 거의 같은 규칙들은 `+`로 묶어 하나의 항목으로 작성한다.

- 헤딩 형식: `## [plugin1/rule1](url1) + [plugin2/rule2](url2)`. 첫 규칙의 `<plugin>/<rule>` 경로로 알파벳 위치를 결정한다.
- 4개 본문 블록 구조는 그대로 유지한다. 설명과 근거 블록에서 두 규칙의 차이를 명시하고, 코드 예시가 동일하면 한 블록으로 통합한다.
- 묶는 기준은 명시적 동치 관계(`동치 규칙`, `동일 의도`, `같은 이유로 끈다`) 또는 거의 동일한 문제, 근거, 코드. 다른 패턴을 잡는 규칙(예: `no-unsafe-assignment` vs `no-unsafe-return`)은 각자 항목으로 둔다.

## 규칙 변경 시 동기화 체크리스트

코드(`src/`)와 문서(`docs/`)는 항상 같은 turn에 동기화한다.

- `src/rules/<카테고리>.ts` 또는 `src/index.ts`의 `rules`/`overrides`/`categories`를 바꾸면 해당 카테고리의 `docs/N-*.md`를 같은 turn에 업데이트한다.
- 새 oxlint 빌트인 플러그인을 활성화할 때는 `src/index.ts`의 `plugins` 배열에 등록하고, 채택 규칙을 `src/rules/<카테고리>.ts`에, 결정 근거를 `docs/N-*.md`에 같은 turn에 추가한다.
- `categories`를 새로 켤 때는 빌트인이 자동 활성화하는 규칙 중 끄고 싶은 항목을 `src/rules/*.ts`의 `// off` 그룹에 명시적으로 등록한다 (예: `react/react-in-jsx-scope`).
- 변경 후 `vp check`로 noise를 확인하고, 새 false positive가 나오면 `.off.md`에 근거를 남긴 뒤 끈다.

## 작성 언어

문서와 주석은 한국어. 규칙 이름, JSON 키, URL, 코드 식별자는 원문 그대로 둔다.
