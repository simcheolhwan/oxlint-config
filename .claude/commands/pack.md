---
description: 이 패키지를 로컬 tarball로 패키징해 대상 프로젝트에 설치하고 검증한다
argument-hint: <대상 폴더...>
---

# 로컬 tarball 설치 워크플로우

$ARGUMENTS

이 명령어는 oxlint-config 저장소 루트에서 실행된다. 패키지 이름은 `@simcheolhwan/oxlint-config`다.

## Context

- working tree 상태: !`git status --porcelain`
- 현재 브랜치: !`git branch --show-current`
- 패키지 버전: !`node -p "require('./package.json').version"`

## 인자 처리

- 대상 폴더 인자는 필수다. 인자가 없으면 사용법을 안내하고 즉시 종료하라
- 각 토큰을 대상 프로젝트 폴더 경로로 해석하라 (절대 경로 또는 `~` 경로, 상대 경로는 현재 폴더 기준)
- 존재하지 않는 폴더가 있으면 진행하지 말고 오류를 보고하라

## 사전 확인

- 위 Context의 working tree 상태에 변경이 있으면, 변경된 파일 목록과 함께 오류를 보고하고 즉시 종료하라 (단, untracked `*.tgz`는 이전 패키징 잔여물이므로 무시하라)

## 패키징

1. 현재 브랜치가 main이면 `git pull --ff-only`를 실행하라. fast-forward가 불가하면 오류를 보고하고 종료하라. main이 아니면 pull을 생략하고 보고서에 브랜치명을 명시하라 (브랜치 상태를 그대로 검증하려는 의도로 간주)
2. pull로 커밋이 새로 반영됐으면 `vp install --frozen-lockfile`로 의존성을 동기화하라
3. `vp pack`으로 `dist/`를 빌드하라
4. 임시 디렉토리를 만들어 `pnpm pack --pack-destination <임시 디렉토리>`로 tarball을 만들어라 (저장소 루트에 tarball을 남기지 않기 위함). 산출물은 `simcheolhwan-oxlint-config-<version>.tgz`다

## 복사 및 설치

각 대상 폴더에 대해 순서대로:

1. 대상 폴더의 기존 `simcheolhwan-oxlint-config-*.tgz`를 모두 삭제하라 (stale tarball 설치 방지)
2. 새 tarball을 대상 폴더로 복사하라
3. 설치 위치: `@simcheolhwan/oxlint-config`가 이미 선언된 package.json이 있으면 그 위치에 설치하라 (workspace 하위 패키지에 선언돼 있으면 거기에 설치). 신규 설치면 대상 폴더에 설치하되, `pnpm-workspace.yaml`이 있는 workspace 루트면 `-w` 플래그를 붙여라
4. 의존성 필드: 선언된 필드를 유지하라 (`devDependencies` → `-D`, `dependencies` → 플래그 없음). 신규 설치면 `devDependencies`로 설치하라
   - 예: `pnpm -C <설치 위치> add -D <tarball 경로>` (workspace 루트면 `-Dw`). tarball 경로는 `-C` 기준 상대 경로로 맞춰라
5. 설치 후 대상의 `node_modules/@simcheolhwan/oxlint-config/dist`가 tarball의 내용과 일치하는지 확인하라. pnpm store 캐시로 stale 버전이 설치됐으면 `pnpm -C <대상 폴더> install --force`로 재설치하라

## 검증

각 대상 폴더에서 package.json scripts에 존재하는 항목만 다음 순서로 실행하라: typecheck (또는 check), lint, test

- `check` 스크립트가 lint를 포함하면 (예: `vp check` = 포맷 + lint + 타입 체크) lint를 별도로 실행하지 마라
- 워크스페이스면 `pnpm -C <대상 폴더> -r run --if-present <script>`, 단일 패키지면 `pnpm -C <대상 폴더> run --if-present <script>`

### 실패 시 판단

- 미미한 수준(새 린트 규칙 위반, 국소적 타입 오류 등 파일 단위 수정으로 해소 가능): 대상 프로젝트의 코드를 직접 수정하고 재검증하라. 수정 내역은 보고서에 포함하라
- 심각한 수준(광범위한 리팩토링 필요, 빌드/테스트가 구조적으로 깨짐): 수정하지 말고 오류 전문과 함께 사용자에게 회부하라
- 설정 파일 완화나 인라인 규칙 무시로 우회하지 마라
- 판단이 모호하면 임의로 결정하지 말고 두 선택지를 정리해 사용자에게 회부하라

## 보고

커밋하지 마라. 대상 프로젝트의 package.json, lockfile, tarball 변경사항을 working tree에 남기고 다음 형식으로 보고하라:

```markdown
## 요약

- 패키지: @simcheolhwan/oxlint-config@<version> (<pull로 반영된 커밋 수>개 커밋 반영, pull 생략 시 브랜치명)
- 대상 폴더: N개
- 검증: 통과 N / 수정 N / 회부 N

## 폴더별 결과

| 폴더 | 설치 | typecheck | lint | test |
| ---- | ---- | --------- | ---- | ---- |

## 코드 수정

폴더별로 수정 사유와 수정한 파일을 서술하라. 없으면 섹션을 생략하라.

## 회부 (사용자 결정 필요)

폴더별로 실패 증상과 오류 요약을 서술하라. 없으면 섹션을 생략하라.
```
