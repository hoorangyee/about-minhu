# 프로젝트 상세 모달과 시스템 다이어그램 설계

작성일: 2026-08-13

## 배경

지금 프로젝트 섹션은 카드 한 장에 설명 한 문단이 전부입니다. 재직 중 수행한 프로젝트는 코드를 공개할 수 없어서, 카드 문단만으로는 실제로 무엇을 어떻게 만들었는지 전달되지 않습니다. 읽는 사람이 기술적 깊이를 판단할 근거가 부족합니다.

재직 중 카드를 클릭하면 상세 내용과 시스템 구조 다이어그램을 보여주는 기능을 추가합니다. 코드를 보여줄 수 없는 프로젝트에서 구조도는 설명을 대신할 수 있는 몇 안 되는 수단입니다.

## 목표

- 재직 중 프로젝트 8건 각각에 상세 본문과 시스템 다이어그램을 제공합니다
- 한국어와 영어 두 벌을 유지하되, 다이어그램 기하는 한 번만 정의합니다
- 지금 사이트의 성격(런타임 의존성 3개, 서버 렌더링, 디자인 토큰 기반 테마)을 깨지 않습니다

## 하지 않는 것

- 상세 화면의 딥링크와 검색 노출. 모달을 선택한 결과로 포기합니다
- 다이어그램 확대·이동·클릭 같은 상호작용
- 애니메이션 라이브러리 도입
- 테스트 러너 도입. `layout.ts`는 순수 함수라 테스트에 적합하지만, 이 저장소에는 테스트 인프라가 없고 이 기능 하나를 위해 도입하는 것은 과합니다. 나중에 vitest를 들이면 `layout.ts`가 첫 대상이 됩니다
- 개인·오픈소스 프로젝트 카드의 변경. 이미 코드·데모·논문 링크가 있어 상세가 필요 없습니다

## 데이터 모델

### 배치

```
src/data/project-details.ts      ko 상세 본문   Record<Slug, ProjectDetail>
src/data/en/project-details.ts   en 상세 본문   Record<Slug, ProjectDetail>
src/data/diagrams.ts             다이어그램     Record<Slug, Diagram>   (로케일 공용)
```

본문은 로케일별로 나누고 다이어그램은 한 벌만 둡니다. 다이어그램의 좌표·연결·그룹은 언어와 무관하고, 언어에 따라 달라지는 것은 라벨 문자열뿐이기 때문입니다. 그림 8개를 두 번 그리지 않기 위한 구조입니다.

`content.ts`의 로케일별 집계에 `projectDetails`를 추가합니다. `diagrams`는 로케일 공용이므로 집계에 넣지 않고 필요한 곳에서 직접 조회합니다.

### 타입

`src/types/portfolio.ts`에 추가합니다.

```ts
/** 로케일 공용 데이터에서 쓰는 이중어 문자열 */
export interface LocalizedText {
  ko: string;
  en: string;
}

/** 상세 본문의 한 절. 절 제목을 데이터가 갖는 이유는 프로젝트마다 절 구성이 다르기 때문 */
export interface DetailSection {
  heading: string;
  /** 문단 배열. 각 항목이 <p> 하나 */
  body: string[];
}

export interface ProjectDetail {
  /** 모달 상단 한 줄 요약 */
  lead: string;
  sections: DetailSection[];
}
```

`Project`에 `slug?: string`를 추가합니다. `slug`가 있고 해당 상세가 존재하는 카드만 클릭 대상이 됩니다.

### 다이어그램 모델

```ts
export interface DiagramNode {
  id: string;
  /** 0부터 시작하는 격자 열 */
  col: number;
  /** 0부터 시작하는 격자 행 */
  row: number;
  label: LocalizedText;
  /** 상자 안 둘째 줄 (선택) */
  sublabel?: LocalizedText;
  /** accent는 본인이 만들거나 바꾼 부분을 가리키는 데 사용 */
  tone?: "default" | "accent" | "muted";
  /** 여러 열을 차지하는 넓은 상자 (기본 1) */
  colSpan?: number;
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: LocalizedText;
  style?: "solid" | "dashed";
  /** both는 양쪽 화살촉 (기본 forward) */
  dir?: "forward" | "both";
}

export interface DiagramGroup {
  /** 격자에서 연속된 사각형을 이루어야 함 */
  members: string[];
  label: LocalizedText;
  tone?: "default" | "accent";
}

export interface Diagram {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  groups?: DiagramGroup[];
  /** 그림 아래 설명이자 스크린리더용 desc */
  caption: LocalizedText;
}
```

## 다이어그램 렌더러

### 파일

```
src/components/diagram/layout.ts    순수 함수. 노드·간선·그룹 → 좌표
src/components/diagram/diagram.tsx  서버 컴포넌트. 좌표 → SVG
```

`layout.ts`는 React도 DOM도 참조하지 않습니다. 입력은 `Diagram`, 출력은 좌표가 계산된 도형 목록입니다.

### 배치 규칙

고정 격자입니다.

| 상수 | 값 | 뜻 |
| --- | --- | --- |
| `NODE_W` | 132 | 상자 너비 |
| `NODE_H` | 56 | 상자 높이 |
| `COL_GAP` | 64 | 열 간격 |
| `ROW_GAP` | 40 | 행 간격 |
| `GROUP_PAD` | 14 | 그룹 경계와 멤버 사이 여백 |
| `MARGIN` | 24 | 그림 바깥 여백. 그룹 라벨이 위로 벗어나는 것을 흡수 |

노드 좌상단 좌표는 `x = MARGIN + col * (NODE_W + COL_GAP)`, `y = MARGIN + row * (NODE_H + ROW_GAP)`입니다. `colSpan`이 있으면 너비는 `colSpan * NODE_W + (colSpan - 1) * COL_GAP`입니다.

전체 크기는 마지막 노드와 그룹 경계를 모두 감싸도록 계산합니다.

### 간선 라우팅

- 같은 행이면 직선. 왼쪽 노드의 오른쪽 변에서 오른쪽 노드의 왼쪽 변으로 잇습니다
- 같은 열이면 수직선. 위 노드의 아래 변에서 아래 노드의 위 변으로 잇습니다
- 그 외에는 3구간 직각 꺾임입니다. 출발 노드의 좌우 변에서 나와 두 노드 사이 중간 x까지 수평, 목표 행까지 수직, 다시 목표 노드 변까지 수평입니다

간선 라벨은 가장 긴 구간의 중점에 놓고, 선이 글자를 지나가지 않도록 라벨 뒤에 배경색 사각형을 깝니다.

화살촉은 `<marker>` 하나를 정의해 `currentColor`로 칠합니다. 정의 id는 다이어그램마다 달라야 하므로 slug를 접미사로 붙입니다. 한 페이지에 8개 다이어그램이 모두 들어가기 때문입니다.

### 그룹

멤버 노드들의 경계 상자를 `GROUP_PAD`만큼 넓힌 사각형을 노드보다 먼저(뒤에) 그립니다. 파선 테두리에 라벨은 좌상단 위쪽에 둡니다.

**제약**: 그룹 멤버는 격자에서 연속된 사각형을 이루어야 합니다. 떨어진 노드를 묶으면 무관한 노드까지 경계 안에 들어갑니다. `layout.ts`가 이를 검사해 어긋나면 개발 환경에서 예외를 던집니다. 조용히 이상한 그림을 그리는 것보다 낫습니다.

### 색과 테마

전부 기존 CSS 변수로 칠합니다. 다크모드 대응을 따로 하지 않습니다.

| 요소 | 색 |
| --- | --- |
| 상자 배경 | `var(--surface)` |
| 상자 테두리 (default) | `var(--line)` |
| 상자 테두리 (accent) | `var(--accent)` |
| 상자 글자 | `var(--ink)`, muted면 `var(--muted)` |
| 간선·화살촉 | `var(--muted)` |
| 간선 라벨 | `var(--muted)` |
| 그룹 테두리 | `var(--line)` 파선 |

### 반응형과 접근성

`overflow-x-auto` 컨테이너 안에 두고, SVG는 `viewBox`와 함께 `h-auto w-full min-w-[560px]`을 줍니다. 넓은 화면에서는 폭에 맞춰 줄어들고, 좁은 화면에서는 최소 너비를 유지한 채 그림만 가로로 스크롤합니다. 본문이 가로로 밀리지 않습니다.

`role="img"`와 `aria-labelledby`로 `<title>`(프로젝트 제목)과 `<desc>`(caption)를 가리킵니다. id는 slug로 유일하게 만듭니다.

## 모달

### 방식

네이티브 `<dialog>`와 `showModal()`을 씁니다. 포커스 트랩, Esc 닫기, 배경 비활성화를 브라우저가 처리합니다. 직접 구현하면 접근성 결함이 생기기 쉬운 부분입니다.

**상세 내용은 서버에서 렌더링합니다.** 본문과 SVG가 이미 HTML로 들어가 있고, 클라이언트 코드는 여닫는 일만 합니다. 서버 렌더링 컴포넌트를 클라이언트 컴포넌트의 `children`으로 넘기는 표준 패턴을 씁니다.

### 컴포넌트

```
src/components/project-dialog.tsx   "use client". 트리거 버튼 + <dialog>
src/components/project-detail.tsx   서버 컴포넌트. 모달 본문(절 + 다이어그램)
```

`project-dialog.tsx`는 여닫는 기계 장치만 갖고 내용을 모릅니다. 내용은 `project-detail.tsx`가 서버에서 그려 `children`으로 들어갑니다. 이 경계 덕분에 클라이언트 번들에는 본문도 SVG도 포함되지 않습니다.

인터페이스는 이렇습니다.

```tsx
<ProjectDialog
  trigger={/* 서버 렌더링된 카드 내용 */}
  labelledById={`project-${slug}-title`}
  closeLabel={dict.close}
>
  {/* 서버 렌더링된 상세 본문 + 다이어그램 */}
</ProjectDialog>
```

동작은 다음과 같습니다.

- 트리거는 `<button type="button">`이며 카드 전체를 감쌉니다
- 열기는 `showModal()`, 닫기는 `close()`입니다
- 배경 클릭으로 닫습니다. `<dialog>`에서 배경을 클릭하면 이벤트 대상이 dialog 요소 자신이므로 이를 비교해 판별합니다
- 본문 스크롤 잠금은 열릴 때 `document.body.style.overflow`를 저장·변경하고 `close` 이벤트에서 복원합니다. `showModal()`이 배경 상호작용은 막지만 일부 브라우저에서 본문 스크롤은 남습니다
- `prefers-reduced-motion`을 존중합니다. 전환 효과를 넣더라도 이 설정에서는 제거합니다

### 카드 상호작용

카드 종류에 따라 나뉩니다.

- **재직 중 카드**: 카드 전체가 버튼입니다. 지금 하단의 "사내 프로젝트 · 코드 비공개" 자리에 "자세히 보기"가 들어갑니다
- **개인·오픈소스 카드**: 지금 그대로입니다. 코드·데모·논문 링크가 카드 안에 있어서, 카드를 통째로 버튼으로 만들면 대화형 요소가 중첩됩니다

재직 중 카드에는 원래 외부 링크가 없으므로 중첩 문제가 생기지 않습니다.

`projects.tsx`의 `ProjectCard`는 카드 시각 요소만 그리도록 남기고, 클릭 여부 분기는 `Projects`가 맡습니다.

## i18n

`src/i18n/ui.ts`의 `projects`에 추가합니다.

| 키 | ko | en |
| --- | --- | --- |
| `detail` | 자세히 보기 | View details |
| `close` | 닫기 | Close |

상세 본문의 절 제목은 사전이 아니라 데이터에 둡니다. 프로젝트마다 절 구성이 다르기 때문입니다.

## 콘텐츠 변경

### 수치 갱신

`src/data/experience.ts`와 영문판의 누적 수치를 갱신합니다.

- Jira 티켓 735건 → 849건
- 머지 PR 772건 → 941건

### 카드 추가

재직 중 프로젝트에 2건을 더해 8건이 됩니다.

| slug | 제목 |
| --- | --- |
| `crm-web-migration` | 데스크톱 → 웹 CRM 전환 |
| `clinical-record-screen` | 진료 기록 화면 신규 구축 |
| `call-center-crm` | 콜센터 상담 관리 시스템 |
| `payment-terminal` | 토스 결제 단말 연동 |
| `desktop-x64` | 데스크톱 CRM 64비트 전환 |
| `dur-integration` | DUR 연동과 검증 도구 |
| `deploy-notifier` | 배포 알림 릴레이 (신규) |
| `cashdoc-mobile` | 캐시닥 병원 CMS 모바일 화면 (신규) |

### 실명 표기 기준

서비스·제휴사 브랜드는 실명으로 씁니다. "외부 결제 단말"은 "토스 결제 단말"로 바꿉니다. 캐시닥도 실명으로 씁니다.

**고객 병원 이름은 계속 익명입니다.** 제휴사나 사내 서비스를 밝히는 것과 고객사 거래 관계를 공개하는 것은 성격이 다릅니다. 지금처럼 "대형 성형외과 고객사"로 둡니다.

### 상세 본문 원천

`~/career-archive`의 분기별 초안이 원천입니다. 옮길 때 다음을 지웁니다.

- Jira 티켓 번호, PR 번호, 커밋 해시
- 사내 시스템 고유명 중 외부에 뜻이 통하지 않는 것
- 고객 병원 이름
- 폐기된 산출물. 릴리즈 진척 대시보드는 효용이 없어 폐기했으므로 넣지 않습니다

## 파일 목록

**신규**

```
src/components/diagram/layout.ts
src/components/diagram/diagram.tsx
src/components/project-dialog.tsx
src/components/project-detail.tsx        모달 본문 (상세 절 + 다이어그램)
src/data/diagrams.ts
src/data/project-details.ts
src/data/en/project-details.ts
```

**수정**

```
src/types/portfolio.ts       타입 추가
src/components/sections/projects.tsx  카드 분기
src/i18n/ui.ts               문자열 2개
src/data/content.ts          projectDetails 집계
src/data/projects.ts         slug·카드 2건 추가·실명 표기
src/data/en/projects.ts      동일
src/data/experience.ts       수치 갱신
src/data/en/experience.ts    동일
```

## 검증

테스트 러너가 없으므로 다음으로 확인합니다.

1. `npm run lint`와 `npm run build`가 통과합니다
2. 개발 서버에서 재직 중 카드 8개를 모두 열어 상세와 다이어그램이 나오는지 봅니다
3. 한국어와 영어 두 경로에서 확인합니다
4. 라이트·다크 모드에서 다이어그램 색이 모두 읽히는지 봅니다
5. 좁은 화면(375px)에서 본문이 가로로 밀리지 않고 다이어그램만 스크롤되는지 봅니다
6. 키보드만으로 카드를 열고 Esc로 닫을 수 있는지, 닫은 뒤 포커스가 원래 카드로 돌아오는지 봅니다

## 위험과 대응

| 위험 | 대응 |
| --- | --- |
| 격자 배치로 표현하기 어려운 구조가 나옴 | `colSpan`과 그룹으로 대부분 해결됩니다. 그래도 안 되면 해당 그림의 구조를 단순화합니다. 그림은 정확한 설계도가 아니라 이해를 돕는 수단입니다 |
| 그룹 멤버가 연속 사각형이 아님 | `layout.ts`가 검사해 예외를 던집니다 |
| 한 페이지에 SVG 8개가 들어가 무거워짐 | 노드 수가 그림당 10개 안팎이라 크기가 작습니다. 빌드 후 페이지 크기를 확인합니다 |
| 상세 본문이 사내 정보를 노출함 | 위 "상세 본문 원천"의 제거 목록을 적용하고, 작성 후 전체를 한 번 훑습니다 |
