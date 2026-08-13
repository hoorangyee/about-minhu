# 프로젝트 상세 모달과 시스템 다이어그램 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 재직 중 프로젝트 카드를 클릭하면 상세 본문과 시스템 구조 다이어그램을 모달로 보여줍니다.

**Architecture:** 상세 내용과 SVG는 서버에서 렌더링해 HTML에 담고, 클라이언트 코드는 네이티브 `<dialog>`를 여닫는 일만 합니다. 다이어그램은 노드에 열·행을 주면 순수 함수가 좌표를 계산하는 데이터 주도 격자 배치이며, 기하는 로케일 공용이고 라벨만 이중어를 갖습니다.

**Tech Stack:** Next.js 16.2.10 (App Router), React 19.2.4, Tailwind CSS 4, TypeScript

**Spec:** `docs/superpowers/specs/2026-08-13-project-detail-modal-design.md`

## Global Constraints

- **런타임 의존성을 추가하지 않습니다.** 현재 `next`, `react`, `react-dom`, `pretendard`가 전부입니다
- **테스트 러너가 없습니다.** 이 저장소에는 테스트 인프라가 없고, 스펙에서 도입하지 않기로 결정했습니다. 각 태스크의 검증은 `npm run lint`, `npm run build`, 개발 서버 육안 확인으로 합니다. 이는 의도된 선택이며 태스크에서 테스트 파일을 만들지 마십시오
- **색은 반드시 CSS 변수로 씁니다.** `var(--surface)`, `var(--line)`, `var(--ink)`, `var(--muted)`, `var(--accent)`, `var(--accent-soft)`. 하드코딩한 색은 다크모드에서 깨집니다
- **한국어 문체**: 종결은 `-ㅂ니다/-습니다`입니다. 줄표(—)를 쓰지 않습니다. 명사형 종결(`-함`, `-됨`)을 쓰지 않습니다
- **고객 병원 이름을 쓰지 않습니다.** "대형 성형외과 고객사"처럼 익명으로 씁니다. 서비스·제휴사 브랜드(토스, 캐시닥, 심평원)는 실명으로 씁니다
- **티켓 번호, PR 번호, 커밋 해시를 넣지 않습니다**
- **폐기된 릴리즈 진척 대시보드는 어디에도 넣지 않습니다**
- 상세 본문의 원천은 `~/career-archive/drafts/`의 분기별 초안입니다
- 커밋 메시지는 `<type>: <message>` 형식이며 type은 `feat | fix | chore`입니다
- 작업 브랜치는 `feat/project-detail-modal`입니다

---

## File Structure

**신규**

| 파일 | 책임 |
| --- | --- |
| `src/components/diagram/layout.ts` | 순수 계산. `Diagram` → 좌표가 박힌 도형 목록. React·DOM을 모릅니다 |
| `src/components/diagram/diagram.tsx` | 서버 컴포넌트. 좌표 → SVG 요소 |
| `src/components/project-dialog.tsx` | `"use client"`. 트리거 버튼과 `<dialog>`의 여닫기만 담당. 내용을 모릅니다 |
| `src/components/project-detail.tsx` | 서버 컴포넌트. 모달 본문(요약·다이어그램·절) |
| `src/data/diagrams.ts` | 다이어그램 정의. 로케일 공용 |
| `src/data/project-details.ts` | ko 상세 본문 |
| `src/data/en/project-details.ts` | en 상세 본문 |

**수정**

| 파일 | 변경 |
| --- | --- |
| `src/types/portfolio.ts` | `LocalizedText`, `DetailSection`, `ProjectDetail`, `Diagram*` 타입 추가. `Project.slug` 추가 |
| `src/i18n/ui.ts` | `projects.detail`, `projects.close` 추가 |
| `src/data/content.ts` | `projectDetails` 집계 추가 |
| `src/data/projects.ts` / `src/data/en/projects.ts` | slug 부여, 카드 2건 추가, 실명 표기 |
| `src/data/experience.ts` / `src/data/en/experience.ts` | 누적 수치 갱신 |
| `src/components/sections/projects.tsx` | 카드 본문과 클릭 분기 분리 |
| `src/app/globals.css` | `dialog::backdrop` 스타일 |

---

### Task 1: 타입·i18n·데이터 골격과 카드 데이터 갱신

카드 8장이 화면에 뜨는 것까지가 이 태스크의 결과물입니다. 상세와 다이어그램은 아직 없습니다.

**Files:**
- Modify: `src/types/portfolio.ts`
- Modify: `src/i18n/ui.ts`
- Modify: `src/data/projects.ts`
- Modify: `src/data/en/projects.ts`
- Modify: `src/data/experience.ts`
- Modify: `src/data/en/experience.ts`
- Modify: `src/data/content.ts`
- Create: `src/data/project-details.ts`
- Create: `src/data/en/project-details.ts`
- Create: `src/data/diagrams.ts`

**Interfaces:**
- Produces: `LocalizedText`, `DetailSection`, `ProjectDetail`, `DiagramNode`, `DiagramEdge`, `DiagramGroup`, `Diagram` 타입. `projectDetails: Record<string, ProjectDetail>` (로케일별), `diagrams: Record<string, Diagram>` (공용). `Project.slug?: string`. `getContent(locale).projectDetails`

- [ ] **Step 1: 타입 추가**

`src/types/portfolio.ts` 끝에 붙입니다.

```ts
/** 로케일 공용 데이터에서 쓰는 이중어 문자열 */
export interface LocalizedText {
  ko: string;
  en: string;
}

/** 상세 본문의 한 절. 절 제목이 데이터에 있는 이유는 프로젝트마다 절 구성이 다르기 때문 */
export interface DetailSection {
  heading: string;
  /** 각 항목이 문단 하나 */
  body: string[];
}

export interface ProjectDetail {
  /** 모달 상단 한 줄 요약 */
  lead: string;
  sections: DetailSection[];
}

export interface DiagramNode {
  id: string;
  /** 0부터 시작하는 격자 열 */
  col: number;
  /** 0부터 시작하는 격자 행 */
  row: number;
  label: LocalizedText;
  /** 상자 안 둘째 줄 */
  sublabel?: LocalizedText;
  /** accent는 본인이 만들거나 바꾼 부분을 가리킬 때 씁니다 */
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
  /** 격자에서 연속된 사각형을 이루어야 합니다 */
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

`Project` 인터페이스에 필드를 하나 추가합니다.

```ts
export interface Project {
  title: string;
  /** 상세·다이어그램 조회 키. 값이 있고 상세가 존재하면 카드가 클릭 대상이 됩니다 */
  slug?: string;
  description: string;
  // ... 나머지는 그대로
}
```

- [ ] **Step 2: 빈 데이터 파일 3개 생성**

`src/data/project-details.ts`

```ts
import type { ProjectDetail } from "@/types/portfolio";

export const projectDetails: Record<string, ProjectDetail> = {};
```

`src/data/en/project-details.ts`

```ts
import type { ProjectDetail } from "@/types/portfolio";

export const projectDetails: Record<string, ProjectDetail> = {};
```

`src/data/diagrams.ts`

```ts
import type { Diagram } from "@/types/portfolio";

/** 로케일 공용. 기하는 한 벌만 두고 라벨만 이중어를 갖습니다 */
export const diagrams: Record<string, Diagram> = {};
```

- [ ] **Step 3: content.ts에 집계 추가**

`src/data/content.ts`에 import 두 줄과 로케일별 항목을 넣습니다. `diagrams`는 로케일 공용이므로 여기에 넣지 않고 쓰는 쪽에서 직접 import 합니다.

```ts
import { projectDetails as projectDetailsKo } from "@/data/project-details";
import { projectDetails as projectDetailsEn } from "@/data/en/project-details";
```

`content` 객체의 `ko`와 `en` 각각에 `projectDetails: projectDetailsKo` / `projectDetails: projectDetailsEn`을 추가합니다.

- [ ] **Step 4: i18n 문자열 추가**

`src/i18n/ui.ts`의 `ko.projects`에 추가합니다.

```ts
      detail: "자세히 보기",
      close: "닫기",
```

`en.projects`에 추가합니다.

```ts
      detail: "View details",
      close: "Close",
```

- [ ] **Step 5: 기존 재직 중 카드 6건에 slug 부여, 실명 표기로 변경**

`src/data/projects.ts`와 `src/data/en/projects.ts` 양쪽에 같은 slug를 넣습니다.

| 기존 제목 | slug |
| --- | --- |
| 데스크톱 → 웹 CRM 전환 | `crm-web-migration` |
| 진료 기록 화면 신규 구축 | `clinical-record-screen` |
| 콜센터 상담 관리 시스템 | `call-center-crm` |
| 결제 단말 연동 | `payment-terminal` |
| 데스크톱 CRM 64비트 전환 | `desktop-x64` |
| DUR(의약품 안전 점검) 연동과 검증 도구 | `dur-integration` |

실명 표기로 바꿉니다.

- `payment-terminal`의 제목을 "결제 단말 연동"에서 "토스 결제 단말 연동"으로 (영문은 "Toss payment terminal integration")
- 같은 카드 `description`의 "외부 결제 단말"을 "토스 결제 단말"로
- 고객 병원 이름은 넣지 않습니다. `call-center-crm`의 "대형 성형외과 고객사"는 그대로 둡니다

- [ ] **Step 6: 재직 중 카드 2건 추가**

`src/data/projects.ts`의 `dur-integration` 항목 뒤, 개인 프로젝트 앞에 넣습니다.

```ts
  {
    title: "배포 알림 릴레이",
    slug: "deploy-notifier",
    group: "work",
    context: "스마트닥터 · 필요를 느껴 직접 만들고 운영",
    period: "2026",
    description:
      "상용 핫픽스가 실제로 나갔는지를 각자 확인해야 하던 상황을 없앤 사내 도구. 배포 웹훅을 받아 직전 배포와의 커밋 범위를 비교하고, 거기 담긴 이슈 키로 Jira에 연결된 Slack 스레드를 찾아 배포 완료를 답글로 남깁니다. 정기 릴리즈까지 알리면 소음이 되므로 핫픽스성 배포만 골라내며, 판별에 필요한 정보가 없으면 잘못 알리는 대신 침묵하고 경고 로그만 남깁니다.",
    impact: "요청받지 않고 만들어 팀 운영에 자리잡음",
    techStack: ["TypeScript", "Vercel Functions", "Slack API", "Jira API"],
  },
  {
    title: "캐시닥 병원 CMS 모바일 화면",
    slug: "cashdoc-mobile",
    group: "work",
    context: "스마트닥터 · 사내 별도 서비스",
    period: "2026",
    description:
      "병원 관리자가 PC 앞에 없어도 예약 확정, 상담 응대, 후기 답변 같은 일상 운영을 처리할 수 있도록 모바일 화면 전체를 새로 만들었습니다. 홈·예약·상담·후기·알림함·설정을 공용 UI 킷 위에 올렸고, 신규 상담이 들어오면 알림함에 쌓이도록 스키마·API·프런트·적재를 네 개 저장소에 걸쳐 연결했습니다.",
    impact: "제품군을 넘나드는 개발까지 담당 범위 확장",
    techStack: ["Next.js", "TypeScript", "GraphQL", "Prisma"],
  },
```

`src/data/en/projects.ts`에도 같은 위치에 영문판을 넣습니다. `slug`, `group`, `period`, `techStack`은 동일하게 두고 `title`, `context`, `description`, `impact`만 영어로 씁니다.

- [ ] **Step 7: 경력 누적 수치 갱신**

`src/data/experience.ts`의 첫 highlight에서 "Jira 티켓 735건, 머지 PR 772건"을 "Jira 티켓 849건, 머지 PR 941건"으로 바꿉니다. `src/data/en/experience.ts`에서도 대응하는 숫자를 같은 값으로 바꿉니다.

- [ ] **Step 8: 검증**

```bash
npm run lint && npm run build
```

기대: 둘 다 통과합니다. 그다음 `npm run dev`로 `/`와 `/en`을 열어 재직 중 카드가 8장 보이고 카드 높이 정렬이 깨지지 않았는지 확인합니다.

- [ ] **Step 9: 커밋**

```bash
git add src/types/portfolio.ts src/i18n/ui.ts src/data/
git commit -m "feat: 프로젝트 상세 데이터 골격과 카드 2건 추가"
```

---

### Task 2: 다이어그램 레이아웃과 렌더러

**Files:**
- Create: `src/components/diagram/layout.ts`
- Create: `src/components/diagram/diagram.tsx`
- Modify: `src/data/diagrams.ts` (첫 다이어그램 1개)

**Interfaces:**
- Consumes: Task 1의 `Diagram`, `DiagramNode`, `DiagramEdge`, `DiagramGroup`, `LocalizedText`
- Produces: `layoutDiagram(diagram: Diagram): DiagramLayout`, `DiagramView({ diagram, locale, idPrefix, title })`, `diagrams["crm-web-migration"]`

- [ ] **Step 1: layout.ts 작성**

```ts
import type {
  Diagram,
  DiagramGroup,
  DiagramNode,
  LocalizedText,
} from "@/types/portfolio";

export const NODE_W = 132;
export const NODE_H = 56;
export const COL_GAP = 64;
export const ROW_GAP = 40;
export const GROUP_PAD = 14;
export const MARGIN = 24;

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface PlacedNode extends Box {
  id: string;
  label: LocalizedText;
  sublabel?: LocalizedText;
  tone: "default" | "accent" | "muted";
}

export interface PlacedGroup extends Box {
  label: LocalizedText;
  tone: "default" | "accent";
}

export interface PlacedEdge {
  d: string;
  label?: LocalizedText;
  labelX: number;
  labelY: number;
  labelAnchor: "middle" | "start";
  dashed: boolean;
  both: boolean;
}

export interface DiagramLayout {
  width: number;
  height: number;
  nodes: PlacedNode[];
  groups: PlacedGroup[];
  edges: PlacedEdge[];
}

function spanOf(node: DiagramNode) {
  return node.colSpan ?? 1;
}

function boxOf(node: DiagramNode): Box {
  const s = spanOf(node);
  return {
    x: MARGIN + node.col * (NODE_W + COL_GAP),
    y: MARGIN + node.row * (NODE_H + ROW_GAP),
    w: s * NODE_W + (s - 1) * COL_GAP,
    h: NODE_H,
  };
}

function cellsOf(node: DiagramNode): string[] {
  const out: string[] = [];
  for (let c = node.col; c < node.col + spanOf(node); c += 1) {
    out.push(`${c},${node.row}`);
  }
  return out;
}

/** 두 노드가 같은 칸을 차지하면 그림이 겹칩니다. 조용히 그리는 것보다 멈추는 편이 낫습니다 */
function assertNoOverlap(nodes: DiagramNode[]) {
  const seen = new Map<string, string>();
  for (const node of nodes) {
    for (const cell of cellsOf(node)) {
      const owner = seen.get(cell);
      if (owner) {
        throw new Error(
          `[diagram] 노드 "${owner}"와 "${node.id}"가 같은 칸(${cell})에 있습니다`,
        );
      }
      seen.set(cell, node.id);
    }
  }
}

/** 그룹 멤버가 연속된 사각형이 아니면 무관한 노드가 경계 안에 들어갑니다 */
function assertRectangular(group: DiagramGroup, nodes: DiagramNode[]) {
  const members = nodes.filter((n) => group.members.includes(n.id));
  if (members.length !== group.members.length) {
    throw new Error(
      `[diagram] 그룹 "${group.label.ko}"에 존재하지 않는 노드 id가 있습니다`,
    );
  }
  const memberCells = new Set(members.flatMap(cellsOf));
  const cols = members.flatMap((n) => [n.col, n.col + spanOf(n) - 1]);
  const rows = members.map((n) => n.row);
  const minCol = Math.min(...cols);
  const maxCol = Math.max(...cols);
  const minRow = Math.min(...rows);
  const maxRow = Math.max(...rows);

  for (let c = minCol; c <= maxCol; c += 1) {
    for (let r = minRow; r <= maxRow; r += 1) {
      if (!memberCells.has(`${c},${r}`)) {
        throw new Error(
          `[diagram] 그룹 "${group.label.ko}"의 멤버가 연속된 사각형이 아닙니다 (${c},${r}이 빕니다)`,
        );
      }
    }
  }
}

function edgeGeometry(a: Box, b: Box) {
  const acx = a.x + a.w / 2;
  const acy = a.y + a.h / 2;
  const bcx = b.x + b.w / 2;
  const bcy = b.y + b.h / 2;

  // 같은 행이면 직선
  if (a.y === b.y) {
    const right = a.x < b.x;
    const sx = right ? a.x + a.w : a.x;
    const ex = right ? b.x : b.x + b.w;
    return {
      d: `M ${sx} ${acy} H ${ex}`,
      labelX: (sx + ex) / 2,
      labelY: acy - 10,
      labelAnchor: "middle" as const,
    };
  }

  // 같은 열이면 수직선
  if (a.x === b.x && a.w === b.w) {
    const down = a.y < b.y;
    const sy = down ? a.y + a.h : a.y;
    const ey = down ? b.y : b.y + b.h;
    return {
      d: `M ${acx} ${sy} V ${ey}`,
      labelX: acx + 8,
      labelY: (sy + ey) / 2,
      labelAnchor: "start" as const,
    };
  }

  // 그 외에는 3구간 직각 꺾임
  const right = bcx > acx;
  const sx = right ? a.x + a.w : a.x;
  const ex = right ? b.x : b.x + b.w;
  const midX = (sx + ex) / 2;
  return {
    d: `M ${sx} ${acy} H ${midX} V ${bcy} H ${ex}`,
    labelX: midX + 8,
    labelY: (acy + bcy) / 2,
    labelAnchor: "start" as const,
  };
}

export function layoutDiagram(diagram: Diagram): DiagramLayout {
  assertNoOverlap(diagram.nodes);

  const boxes = new Map<string, Box>();
  const nodes: PlacedNode[] = diagram.nodes.map((node) => {
    const box = boxOf(node);
    boxes.set(node.id, box);
    return {
      ...box,
      id: node.id,
      label: node.label,
      sublabel: node.sublabel,
      tone: node.tone ?? "default",
    };
  });

  const groups: PlacedGroup[] = (diagram.groups ?? []).map((group) => {
    assertRectangular(group, diagram.nodes);
    const member = group.members.map((id) => boxes.get(id)!);
    const x = Math.min(...member.map((b) => b.x)) - GROUP_PAD;
    const y = Math.min(...member.map((b) => b.y)) - GROUP_PAD;
    const right = Math.max(...member.map((b) => b.x + b.w)) + GROUP_PAD;
    const bottom = Math.max(...member.map((b) => b.y + b.h)) + GROUP_PAD;
    return {
      x,
      y,
      w: right - x,
      h: bottom - y,
      label: group.label,
      tone: group.tone ?? "default",
    };
  });

  const edges: PlacedEdge[] = diagram.edges.map((edge) => {
    const a = boxes.get(edge.from);
    const b = boxes.get(edge.to);
    if (!a || !b) {
      throw new Error(`[diagram] 간선이 없는 노드를 가리킵니다: ${edge.from} → ${edge.to}`);
    }
    return {
      ...edgeGeometry(a, b),
      label: edge.label,
      dashed: edge.style === "dashed",
      both: edge.dir === "both",
    };
  });

  const all: Box[] = [...nodes, ...groups];
  const width = Math.max(...all.map((b) => b.x + b.w)) + MARGIN;
  const height = Math.max(...all.map((b) => b.y + b.h)) + MARGIN;

  return { width, height, nodes, groups, edges };
}
```

- [ ] **Step 2: diagram.tsx 작성**

```tsx
import type { Diagram } from "@/types/portfolio";
import type { Locale } from "@/i18n/config";
import { layoutDiagram } from "@/components/diagram/layout";

const STROKE = {
  default: "var(--line)",
  accent: "var(--accent)",
  muted: "var(--line)",
} as const;

const TEXT = {
  default: "var(--ink)",
  accent: "var(--accent)",
  muted: "var(--muted)",
} as const;

export function DiagramView({
  diagram,
  locale,
  idPrefix,
  title,
}: {
  diagram: Diagram;
  locale: Locale;
  idPrefix: string;
  title: string;
}) {
  const layout = layoutDiagram(diagram);
  const titleId = `${idPrefix}-diagram-title`;
  const descId = `${idPrefix}-diagram-desc`;
  const arrowId = `${idPrefix}-arrow`;

  return (
    <div className="overflow-x-auto">
      <svg
        role="img"
        aria-labelledby={`${titleId} ${descId}`}
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        className="h-auto w-full min-w-[560px]"
      >
        <title id={titleId}>{title}</title>
        <desc id={descId}>{diagram.caption[locale]}</desc>
        <defs>
          {/* auto-start-reverse 덕분에 마커 하나로 양쪽 화살촉을 다 그립니다 */}
          <marker
            id={arrowId}
            viewBox="0 0 8 8"
            refX="7"
            refY="4"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 7 4 L 0 7 z" fill="var(--muted)" />
          </marker>
        </defs>

        {layout.groups.map((group) => (
          <g key={`${group.x}-${group.y}-${group.label.ko}`}>
            <rect
              x={group.x}
              y={group.y}
              width={group.w}
              height={group.h}
              rx="8"
              fill="none"
              stroke={group.tone === "accent" ? "var(--accent)" : "var(--line)"}
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.75"
            />
            <text x={group.x + 10} y={group.y - 6} fontSize="10.5" fill="var(--muted)">
              {group.label[locale]}
            </text>
          </g>
        ))}

        {layout.edges.map((edge) => (
          <g key={edge.d + (edge.label?.ko ?? "")}>
            <path
              d={edge.d}
              fill="none"
              stroke="var(--muted)"
              strokeWidth="1.25"
              strokeDasharray={edge.dashed ? "4 3" : undefined}
              markerEnd={`url(#${arrowId})`}
              markerStart={edge.both ? `url(#${arrowId})` : undefined}
            />
            {edge.label && (
              // paint-order로 글자 뒤에 배경색 테두리를 둘러 선이 글자를 지나가지 않게 합니다
              <text
                x={edge.labelX}
                y={edge.labelY}
                textAnchor={edge.labelAnchor}
                dominantBaseline="middle"
                fontSize="10.5"
                fill="var(--muted)"
                stroke="var(--surface)"
                strokeWidth="4"
                paintOrder="stroke"
              >
                {edge.label[locale]}
              </text>
            )}
          </g>
        ))}

        {layout.nodes.map((node) => (
          <g key={node.id}>
            <rect
              x={node.x}
              y={node.y}
              width={node.w}
              height={node.h}
              rx="6"
              fill="var(--surface)"
              stroke={STROKE[node.tone]}
              strokeWidth={node.tone === "accent" ? 1.75 : 1}
            />
            <text
              x={node.x + node.w / 2}
              y={node.sublabel ? node.y + node.h / 2 - 8 : node.y + node.h / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="13"
              fontWeight="600"
              fill={TEXT[node.tone]}
            >
              {node.label[locale]}
            </text>
            {node.sublabel && (
              <text
                x={node.x + node.w / 2}
                y={node.y + node.h / 2 + 11}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="10.5"
                fill="var(--muted)"
              >
                {node.sublabel[locale]}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
```

- [ ] **Step 3: 첫 다이어그램 정의**

`src/data/diagrams.ts`의 `diagrams` 객체에 넣습니다.

```ts
  "crm-web-migration": {
    nodes: [
      { id: "native", col: 0, row: 0, label: { ko: "데스크톱 CRM", en: "Desktop CRM" }, sublabel: { ko: "C# · WPF", en: "C# · WPF" } },
      { id: "host", col: 1, row: 0, label: { ko: "WebView2 호스트", en: "WebView2 host" } },
      { id: "web", col: 2, row: 0, tone: "accent", label: { ko: "웹 앱", en: "Web app" }, sublabel: { ko: "React", en: "React" } },
      { id: "api", col: 3, row: 0, tone: "accent", label: { ko: "API", en: "API" }, sublabel: { ko: "Kotlin · Spring", en: "Kotlin · Spring" } },
      { id: "db", col: 3, row: 1, label: { ko: "MSSQL", en: "MSSQL" } },
    ],
    edges: [
      { from: "native", to: "host", label: { ko: "임베드", en: "embeds" } },
      { from: "host", to: "web", label: { ko: "브릿지", en: "bridge" } },
      { from: "web", to: "api", label: { ko: "REST", en: "REST" } },
      { from: "api", to: "db" },
    ],
    groups: [
      { members: ["web", "api"], tone: "accent", label: { ko: "담당 범위", en: "My scope" } },
    ],
    caption: {
      ko: "데스크톱 CRM 안의 WebView2 호스트가 웹 앱을 띄우고, 웹 앱은 신설한 API를 거쳐 데이터베이스에 닿습니다. 웹 앱과 API가 담당 범위입니다.",
      en: "A WebView2 host inside the desktop CRM serves the web app, which reaches the database through a newly built API. The web app and the API are my scope.",
    },
  },
```

- [ ] **Step 4: 임시로 화면에 띄워 육안 확인**

`src/components/sections/projects.tsx`의 `Projects` 함수 안, `<SectionShell>` 바로 다음에 임시로 넣습니다.

```tsx
<DiagramView
  diagram={diagrams["crm-web-migration"]}
  locale={locale}
  idPrefix="tmp"
  title="임시 확인"
/>
```

`npm run dev`로 `/`를 열어 확인합니다.

- 상자 5개와 화살표 4개가 겹치지 않고 그려집니다
- 간선 라벨의 글자를 선이 지나가지 않습니다
- "담당 범위" 파선 상자가 웹 앱과 API 두 개만 감쌉니다
- 다크모드로 토글해도 글자와 선이 모두 읽힙니다
- 브라우저 폭을 375px로 줄이면 그림만 가로로 스크롤되고 페이지 본문은 밀리지 않습니다

확인이 끝나면 **임시 코드와 import를 지웁니다.**

- [ ] **Step 5: 검증**

```bash
npm run lint && npm run build
```

- [ ] **Step 6: 커밋**

```bash
git add src/components/diagram/ src/data/diagrams.ts
git commit -m "feat: 데이터 주도 격자 다이어그램 렌더러 추가"
```

---

### Task 3: 모달과 카드 클릭 분기

첫 프로젝트의 상세가 실제로 열리는 것까지가 결과물입니다.

**Files:**
- Create: `src/components/project-dialog.tsx`
- Create: `src/components/project-detail.tsx`
- Modify: `src/components/sections/projects.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/data/project-details.ts`
- Modify: `src/data/en/project-details.ts`

**Interfaces:**
- Consumes: Task 1의 `ProjectDetail`·`getContent(locale).projectDetails`, Task 2의 `DiagramView`·`diagrams`
- Produces: `ProjectDialog({ trigger, triggerClassName, labelledById, closeLabel, children })`, `ProjectDetailView({ project, detail, diagram, locale, titleId })`

- [ ] **Step 1: dialog 배경 스타일 추가**

`src/app/globals.css`의 `::selection` 규칙 다음에 넣습니다.

```css
dialog::backdrop {
  background: rgb(0 0 0 / 0.5);
}
```

- [ ] **Step 2: project-dialog.tsx 작성**

```tsx
"use client";

import { useRef, type ReactNode } from "react";

/**
 * 여닫는 기계 장치만 담당한다. 내용은 서버에서 렌더링해 children으로 들어오므로
 * 클라이언트 번들에는 본문도 SVG도 포함되지 않는다.
 */
export function ProjectDialog({
  trigger,
  triggerClassName,
  labelledById,
  closeLabel,
  children,
}: {
  trigger: ReactNode;
  triggerClassName: string;
  labelledById: string;
  closeLabel: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  function open() {
    ref.current?.showModal();
    // showModal()이 배경 상호작용은 막지만 일부 브라우저에서 본문 스크롤은 남는다
    document.body.style.overflow = "hidden";
  }

  return (
    <>
      <button type="button" onClick={open} className={triggerClassName}>
        {trigger}
      </button>
      <dialog
        ref={ref}
        aria-labelledby={labelledById}
        onClose={() => {
          document.body.style.overflow = "";
        }}
        onClick={(event) => {
          // 배경을 클릭하면 이벤트 대상이 dialog 자신이다
          if (event.target === ref.current) ref.current?.close();
        }}
        className="m-auto w-[min(46rem,calc(100vw-2rem))] max-h-[85vh] overflow-y-auto rounded-lg border border-line bg-surface p-0 text-ink"
      >
        <div className="relative p-6 sm:p-8">
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label={closeLabel}
            className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-accent-soft hover:text-accent"
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          {children}
        </div>
      </dialog>
    </>
  );
}
```

- [ ] **Step 3: project-detail.tsx 작성**

```tsx
import type { Diagram, Project, ProjectDetail } from "@/types/portfolio";
import type { Locale } from "@/i18n/config";
import { DiagramView } from "@/components/diagram/diagram";

export function ProjectDetailView({
  project,
  detail,
  diagram,
  locale,
  titleId,
}: {
  project: Project;
  detail: ProjectDetail;
  diagram?: Diagram;
  locale: Locale;
  titleId: string;
}) {
  return (
    <div>
      <div className="pr-10">
        <h3 id={titleId} className="text-xl font-bold tracking-tight">
          {project.title}
        </h3>
        <p className="mt-1 text-xs font-medium text-accent">
          {project.context}
          {project.period ? ` · ${project.period}` : ""}
        </p>
      </div>

      <p className="mt-4 text-sm leading-relaxed">{detail.lead}</p>

      {diagram && (
        <figure className="my-7">
          <DiagramView
            diagram={diagram}
            locale={locale}
            idPrefix={project.slug ?? "project"}
            title={project.title}
          />
          <figcaption className="mt-3 text-xs leading-relaxed text-muted">
            {diagram.caption[locale]}
          </figcaption>
        </figure>
      )}

      {detail.sections.map((section) => (
        <section key={section.heading} className="mt-6">
          <h4 className="text-sm font-bold">{section.heading}</h4>
          {section.body.map((paragraph) => (
            <p key={paragraph} className="mt-2 text-sm leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
        </section>
      ))}

      <p className="mt-7 border-t border-line pt-4 font-mono text-xs text-muted">
        {project.techStack.join(" / ")}
      </p>
    </div>
  );
}
```

- [ ] **Step 4: projects.tsx 개편**

카드 시각 요소를 `CardBody`로 떼어냅니다. **`CardBody`는 반드시 fragment를 반환해야 합니다.** 부모가 `grid-rows-subgrid`를 쓰고 있어서 6개 구획이 카드 요소의 직계 자식이어야 하기 때문입니다.

`src/components/sections/projects.tsx` 전체를 다음으로 바꿉니다.

```tsx
import type { Locale } from "@/i18n/config";
import type { Project } from "@/types/portfolio";
import { ui, type UiDict } from "@/i18n/ui";
import { getContent } from "@/data/content";
import { diagrams } from "@/data/diagrams";
import { SectionShell } from "@/components/section-shell";
import { ProjectDialog } from "@/components/project-dialog";
import { ProjectDetailView } from "@/components/project-detail";

const CARD_CLASS =
  "mb-5 grid row-span-6 grid-rows-subgrid rounded-lg border border-line bg-surface p-6 text-left transition-colors hover:border-accent";

// subgrid로 6개 구획(제목/맥락/설명/성과/기술/링크)의 행 트랙을 옆 카드와 공유해
// 같은 행의 카드끼리 높이와 각 구획의 세로 위치가 정확히 정렬된다.
// 따라서 이 컴포넌트는 감싸는 요소 없이 6개 구획만 내보낸다.
function CardBody({
  project,
  dict,
  hasDetail = false,
}: {
  project: Project;
  dict: UiDict["projects"];
  hasDetail?: boolean;
}) {
  const links = [
    { url: project.githubUrl, label: dict.code },
    { url: project.demoUrl, label: dict.demo },
    { url: project.paperUrl, label: dict.paper },
  ].filter((l): l is { url: string; label: string } => Boolean(l.url));

  return (
    <>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-lg font-bold">{project.title}</h3>
        {project.period && (
          <span className="shrink-0 font-mono text-xs text-muted">{project.period}</span>
        )}
      </div>
      {project.context && (
        <p className="row-start-2 mt-1 text-xs font-medium text-accent">{project.context}</p>
      )}
      <p className="row-start-3 mt-3 text-sm leading-relaxed text-muted">{project.description}</p>
      {project.impact && <p className="row-start-4 mt-3 text-sm font-medium">{project.impact}</p>}
      <p className="row-start-5 mt-4 self-end font-mono text-xs text-muted">
        {project.techStack.join(" / ")}
      </p>
      <div className="row-start-6 mt-5 flex gap-4 self-end border-t border-line pt-4 text-sm">
        {hasDetail ? (
          <span className="font-semibold text-accent">{dict.detail} →</span>
        ) : links.length > 0 ? (
          links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="font-semibold transition-colors hover:text-accent"
            >
              {link.label}
            </a>
          ))
        ) : (
          <span className="text-muted">{dict.privateNote}</span>
        )}
      </div>
    </>
  );
}

export function Projects({ locale }: { locale: Locale }) {
  const { projects, projectDetails } = getContent(locale);
  const dict = ui[locale].projects;
  const groups = [
    { key: "work", label: dict.workGroup },
    { key: "personal", label: dict.personalGroup },
  ] as const;

  return (
    <SectionShell id="projects" locale={locale}>
      <div className="space-y-12">
        {groups.map((group) => {
          const items = projects.filter((p) => p.group === group.key);
          if (items.length === 0) return null;
          return (
            <div key={group.key}>
              <h3 className="mb-4 text-sm font-medium tracking-wide text-muted">{group.label}</h3>
              <div className="-mb-5 grid gap-x-5 sm:grid-cols-2">
                {items.map((project) => {
                  const detail = project.slug ? projectDetails[project.slug] : undefined;
                  if (!detail || !project.slug) {
                    return (
                      <article key={project.title} className={CARD_CLASS}>
                        <CardBody project={project} dict={dict} />
                      </article>
                    );
                  }
                  // 모달 안 제목이 dialog의 이름이 된다. 카드 제목에는 id를 두지 않는다
                  const titleId = `project-${project.slug}-title`;
                  return (
                    <ProjectDialog
                      key={project.title}
                      triggerClassName={`${CARD_CLASS} cursor-pointer`}
                      labelledById={titleId}
                      closeLabel={dict.close}
                      trigger={<CardBody project={project} dict={dict} hasDetail />}
                    >
                      <ProjectDetailView
                        project={project}
                        detail={detail}
                        diagram={diagrams[project.slug]}
                        locale={locale}
                        titleId={titleId}
                      />
                    </ProjectDialog>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}
```

`ProjectDialog`의 `labelledById`는 **모달 안 제목**을 가리킵니다. 스크린리더가 대화상자 이름을 읽을 때 대화상자 안의 제목을 쓰는 것이 표준이고, 카드 제목에 id를 두면 같은 id가 두 곳에 생깁니다.

- [ ] **Step 5: 첫 상세 본문 작성**

`src/data/project-details.ts`에 `crm-web-migration` 항목을 넣습니다. 원천은 `~/career-archive/drafts/2025-Q3.md`, `2025-Q4.md`, `2026-Q1.md`, `2026-Q2.md`의 웹 전환 관련 절입니다.

구성은 다음과 같이 합니다.

- `lead`: 한 문장. 무엇을 어디까지 옮겼는지
- `sections[0].heading`: "배경" / 왜 이 전환이 필요했는지, 데스크톱 CRM의 제약
- `sections[1].heading`: "한 일" / 담당 모듈, 주 단위 분할 캐싱으로 조회 성능을 개선한 것, 인증·브릿지·런타임 배포 같은 실행 기반
- `sections[2].heading`: "패턴 확립" / "API 신설 → 독립 웹 앱 → 웹뷰 임베드"를 만들어 화면 3종에 반복 적용한 것

각 절은 문단 1개에서 3개 사이로 합니다. Global Constraints의 문체와 제거 목록을 따릅니다.

`src/data/en/project-details.ts`에 같은 구조의 영문판을 넣습니다. 번역이 아니라 영어로 읽히는 글로 씁니다.

- [ ] **Step 6: 육안 확인**

`npm run dev`로 다음을 확인합니다.

1. `/`에서 "데스크톱 → 웹 CRM 전환" 카드 하단에 "자세히 보기 →"가 보입니다
2. 카드를 클릭하면 모달이 열리고 제목·요약·다이어그램·절이 순서대로 나옵니다
3. 나머지 재직 중 카드 7장은 아직 "사내 프로젝트 · 코드 비공개"가 보이고 클릭해도 반응이 없습니다
4. **카드 높이 정렬이 깨지지 않았습니다.** 버튼이 grid 항목이 되고 닫힌 `<dialog>`는 `display:none`이라 grid 항목을 만들지 않습니다. 이 점을 눈으로 확인합니다
5. Esc로 닫힙니다. 배경을 클릭해도 닫힙니다. 모달 안 여백을 클릭하면 닫히지 않습니다
6. 닫은 뒤 포커스가 원래 카드로 돌아옵니다
7. 모달이 열린 동안 뒤 본문이 스크롤되지 않고, 닫으면 다시 스크롤됩니다
8. 키보드 Tab만으로 카드에 도달해 Enter로 열 수 있습니다
9. `/en`에서도 같습니다

- [ ] **Step 7: 검증**

```bash
npm run lint && npm run build
```

- [ ] **Step 8: 커밋**

```bash
git add src/components/ src/data/ src/app/globals.css
git commit -m "feat: 프로젝트 상세 모달 추가"
```

---

### Task 4: 상세와 다이어그램 (진료 기록 화면, 콜센터 상담 관리)

**Files:**
- Modify: `src/data/diagrams.ts`
- Modify: `src/data/project-details.ts`
- Modify: `src/data/en/project-details.ts`

**Interfaces:**
- Consumes: Task 1~3의 전부
- Produces: `diagrams["clinical-record-screen"]`, `diagrams["call-center-crm"]`과 각 상세 (ko/en)

- [ ] **Step 1: 다이어그램 2개 정의**

```ts
  "clinical-record-screen": {
    nodes: [
      { id: "code", col: 0, row: 0, label: { ko: "처방코드 자동완성", en: "Code autocomplete" }, sublabel: { ko: "입력 디바운싱", en: "debounced input" } },
      { id: "form", col: 1, row: 0, tone: "accent", label: { ko: "폼 상태", en: "Form state" }, sublabel: { ko: "단일 진실 원천", en: "single source" } },
      { id: "gate", col: 2, row: 0, tone: "accent", label: { ko: "저장 게이트", en: "Save gate" }, sublabel: { ko: "중복 저장 방지", en: "dedupe guard" } },
      { id: "api", col: 3, row: 0, label: { ko: "진료 저장 API", en: "Record API" } },
      { id: "fee", col: 0, row: 1, label: { ko: "진찰료 자동 산정", en: "Fee calculation" } },
      { id: "dur", col: 2, row: 1, label: { ko: "DUR 점검", en: "DUR check" } },
    ],
    edges: [
      { from: "code", to: "form" },
      { from: "fee", to: "form" },
      { from: "form", to: "gate", label: { ko: "검증", en: "validate" } },
      { from: "gate", to: "dur", label: { ko: "이상 시", en: "if flagged" } },
      { from: "gate", to: "api", label: { ko: "저장", en: "save" } },
    ],
    groups: [
      { members: ["form", "gate"], tone: "accent", label: { ko: "신규 구축", en: "Newly built" } },
    ],
    caption: {
      ko: "입력 보조 기능들이 폼 상태 하나로 모이고, 저장 게이트가 검증과 중복 방지를 거쳐 API로 보냅니다. 처방에 이상이 있으면 DUR 점검 결과를 먼저 띄웁니다.",
      en: "Input helpers converge on a single form state, and a save gate runs validation and dedupe before calling the API. Flagged prescriptions surface a DUR check first.",
    },
  },

  "call-center-crm": {
    nodes: [
      { id: "cti", col: 0, row: 0, label: { ko: "CTI 미들웨어", en: "CTI middleware" }, sublabel: { ko: "전화 연동", en: "telephony" } },
      { id: "ws", col: 1, row: 0, label: { ko: "WebSocket", en: "WebSocket" }, sublabel: { ko: "지수 백오프 재연결", en: "backoff reconnect" } },
      { id: "web", col: 2, row: 0, tone: "accent", label: { ko: "상담 화면", en: "Console UI" }, sublabel: { ko: "React", en: "React" } },
      { id: "api", col: 3, row: 0, tone: "accent", label: { ko: "상담 API", en: "Console API" }, sublabel: { ko: "Kotlin", en: "Kotlin" } },
      { id: "excel", col: 0, row: 1, label: { ko: "엑셀 대량 업로드", en: "Bulk upload" } },
      { id: "manual", col: 1, row: 1, label: { ko: "단일 등록", en: "Manual entry" } },
      { id: "db", col: 3, row: 1, label: { ko: "MSSQL", en: "MSSQL" } },
    ],
    edges: [
      { from: "cti", to: "ws", label: { ko: "수신 이벤트", en: "inbound call" } },
      { from: "ws", to: "web" },
      { from: "web", to: "api" },
      { from: "api", to: "db" },
      { from: "excel", to: "web" },
      { from: "manual", to: "web" },
    ],
    groups: [
      { members: ["web", "api"], tone: "accent", label: { ko: "담당 범위", en: "My scope" } },
    ],
    caption: {
      ko: "수신 전화, 엑셀 대량 업로드, 단일 등록 세 갈래로 상담 건이 들어옵니다. 전화 연동은 CTI 미들웨어와 WebSocket으로 통신하며, 화면과 API를 함께 담당했습니다.",
      en: "Leads arrive through three channels: inbound calls, bulk spreadsheet upload, and manual entry. Telephony runs over a WebSocket link to CTI middleware; I built both the console UI and its API.",
    },
  },
```

- [ ] **Step 2: 상세 본문 2건 작성 (ko/en)**

`clinical-record-screen` 원천은 `~/career-archive/drafts/2026-Q1.md`의 통합정보창 진료탭 절과 `2026-Q2.md`의 진료·수납탭 QA 절입니다. 절 구성은 "배경" / "한 일" / "까다로웠던 것"으로 합니다. 세 번째 절에는 저장 버튼 연타로 진료가 중복 생성되던 문제와 폼을 단일 진실 원천으로 만든 리팩터링을 씁니다.

`call-center-crm` 원천은 `~/career-archive/drafts/2026-Q2.md`의 CCMS 절과 `2026-Q3.md`의 CCMS 후속 절입니다. 절 구성은 "배경" / "수집 채널 3종" / "현장에서 드러난 문제"로 합니다. 세 번째 절에는 수신 1건에 상담 건이 2개 생기던 경쟁 조건, 통화 중 끊길 때 작성 중이던 내용이 사라지던 문제, 유입경로 옵션을 행마다 조회하던 N+1 호출을 배치 조회로 바꾼 것을 씁니다. 고객 병원 이름은 쓰지 않습니다.

- [ ] **Step 3: 육안 확인**

`npm run dev`로 두 카드를 열어 다이어그램이 겹치지 않는지, 라이트·다크 모드에서 모두 읽히는지, `/en`에서 영문 라벨이 나오는지 확인합니다.

- [ ] **Step 4: 검증과 커밋**

```bash
npm run lint && npm run build
git add src/data/
git commit -m "feat: 진료 기록 화면·콜센터 상담 관리 상세와 다이어그램"
```

---

### Task 5: 상세와 다이어그램 (토스 결제 단말, 64비트 전환)

**Files:**
- Modify: `src/data/diagrams.ts`
- Modify: `src/data/project-details.ts`
- Modify: `src/data/en/project-details.ts`

**Interfaces:**
- Produces: `diagrams["payment-terminal"]`, `diagrams["desktop-x64"]`와 각 상세 (ko/en)

- [ ] **Step 1: 다이어그램 2개 정의**

```ts
  "payment-terminal": {
    nodes: [
      { id: "crm", col: 0, row: 0, label: { ko: "CRM 수납 화면", en: "CRM checkout" } },
      { id: "plugin", col: 0, row: 1, label: { ko: "토스 결제 플러그인", en: "Toss plugin" }, sublabel: { ko: "결제 단말", en: "terminal" } },
      { id: "podA", col: 1, row: 0, label: { ko: "API 파드 A", en: "API pod A" } },
      { id: "podB", col: 1, row: 1, label: { ko: "API 파드 B", en: "API pod B" } },
      { id: "kafka", col: 2, row: 0, tone: "accent", label: { ko: "Kafka", en: "Kafka" }, sublabel: { ko: "세션 릴레이", en: "session relay" } },
    ],
    edges: [
      { from: "crm", to: "podA", label: { ko: "WS 세션", en: "WS session" } },
      { from: "plugin", to: "podB", label: { ko: "WS 세션", en: "WS session" } },
      { from: "podA", to: "kafka", dir: "both" },
      { from: "podB", to: "kafka", dir: "both" },
    ],
    groups: [
      { members: ["podA", "podB"], label: { ko: "멀티 파드", en: "Multiple pods" } },
    ],
    caption: {
      ko: "CRM과 결제 플러그인의 WebSocket 세션이 서로 다른 파드에 붙으면 인메모리 레지스트리로는 단말을 찾지 못합니다. 파드 사이를 Kafka로 중계해 어느 조합이든 세션이 이어지게 했습니다.",
      en: "When the CRM and the payment plugin land on different pods, an in-memory registry cannot find the terminal. Relaying sessions across pods through Kafka keeps any pairing connected.",
    },
  },

  "desktop-x64": {
    nodes: [
      { id: "crm", col: 0, row: 0, tone: "accent", label: { ko: "CRM 본체", en: "CRM host" }, sublabel: { ko: "64비트", en: "64-bit" } },
      { id: "ipc", col: 1, row: 0, tone: "accent", label: { ko: "IPC", en: "IPC" }, sublabel: { ko: "프로세스 간 통신", en: "cross-process" } },
      { id: "srv", col: 2, row: 0, tone: "accent", label: { ko: "브릿지 프로세스", en: "Bridge process" }, sublabel: { ko: "32비트", en: "32-bit" } },
      { id: "tel", col: 3, row: 0, label: { ko: "전화 연동 DLL", en: "Telephony DLL" } },
      { id: "pay", col: 3, row: 1, label: { ko: "결제 단말 DLL", en: "Terminal DLL" } },
    ],
    edges: [
      { from: "crm", to: "ipc", dir: "both" },
      { from: "ipc", to: "srv", dir: "both" },
      { from: "srv", to: "tel" },
      { from: "srv", to: "pay" },
    ],
    groups: [
      { members: ["tel", "pay"], label: { ko: "32비트 전용 벤더 DLL", en: "32-bit-only vendor DLLs" } },
    ],
    caption: {
      ko: "64비트 전환을 막던 것은 32비트로만 제공되는 벤더 DLL이었습니다. 이들을 별도 32비트 프로세스에 가두고 본체와 IPC로 통신하게 해서, 본체만 64비트로 올렸습니다.",
      en: "Vendor DLLs shipped only as 32-bit blocked the migration. Confining them to a separate 32-bit process that talks to the host over IPC let the host itself move to 64-bit.",
    },
  },
```

- [ ] **Step 2: 상세 본문 2건 작성 (ko/en)**

`payment-terminal` 원천은 `~/career-archive/drafts/2026-Q2.md`의 토스 결제 단말 연동 절과 `2026-Q3.md`의 토스 후속 절입니다. 절 구성은 "배경" / "한 일" / "멀티 파드 문제"로 합니다. 세 번째 절이 이 카드의 핵심이며, 인메모리 레지스트리의 한계를 Kafka fan-out으로 푼 과정을 구체적으로 씁니다. **본인이 제안하고 주도한 구조라는 점을 밝힙니다.**

`desktop-x64` 원천은 `~/career-archive/drafts/2025-Q3.md`입니다. 절 구성은 "배경" / "한 일" / "판단 근거"로 합니다. 세 번째 절에는 사용 환경의 OS 비트 분포를 Sentry로 모아 전환 판단의 근거를 만든 것을 씁니다. **본인이 제안하고 주도한 과제라는 점을 밝힙니다.**

- [ ] **Step 3: 육안 확인**

두 카드를 열어 확인합니다. `payment-terminal`은 그룹 경계 안에 파드 2개만 들어가고 Kafka는 밖에 있어야 합니다. `desktop-x64`는 양방향 화살표가 양쪽 끝에 모두 그려져야 합니다.

- [ ] **Step 4: 검증과 커밋**

```bash
npm run lint && npm run build
git add src/data/
git commit -m "feat: 토스 결제 단말·64비트 전환 상세와 다이어그램"
```

---

### Task 6: 상세와 다이어그램 (DUR 연동, 배포 알림 릴레이)

**Files:**
- Modify: `src/data/diagrams.ts`
- Modify: `src/data/project-details.ts`
- Modify: `src/data/en/project-details.ts`

**Interfaces:**
- Produces: `diagrams["dur-integration"]`, `diagrams["deploy-notifier"]`와 각 상세 (ko/en)

- [ ] **Step 1: 다이어그램 2개 정의**

```ts
  "dur-integration": {
    nodes: [
      { id: "web", col: 0, row: 0, label: { ko: "진료 화면", en: "Clinical screen" }, sublabel: { ko: "처방·상병", en: "Rx · diagnosis" } },
      { id: "api", col: 1, row: 0, tone: "accent", label: { ko: "DUR API", en: "DUR API" }, sublabel: { ko: "Kotlin", en: "Kotlin" } },
      { id: "broker", col: 2, row: 0, tone: "accent", label: { ko: "연동 브로커", en: "Broker" } },
      { id: "hira", col: 3, row: 0, label: { ko: "심평원", en: "HIRA" }, sublabel: { ko: "국가 점검 체계", en: "national registry" } },
      { id: "cli", col: 0, row: 1, tone: "accent", label: { ko: "검증 CLI", en: "Verification CLI" }, sublabel: { ko: "케이스 기반", en: "case-driven" } },
      { id: "master", col: 1, row: 1, label: { ko: "기준 DB", en: "Reference DB" }, sublabel: { ko: "병용금기 목록", en: "interaction data" } },
    ],
    edges: [
      { from: "web", to: "api", label: { ko: "점검 요청", en: "check" } },
      { from: "api", to: "broker" },
      { from: "broker", to: "hira", dir: "both" },
      { from: "master", to: "api", label: { ko: "적재", en: "loads" } },
      { from: "cli", to: "api", style: "dashed", label: { ko: "회귀 검증", en: "regression" } },
    ],
    groups: [
      { members: ["api", "broker"], tone: "accent", label: { ko: "직접 구축", en: "Built by me" } },
    ],
    caption: {
      ko: "처방과 상병을 심평원 점검 체계에 보내 병용금기 등을 확인합니다. 외부 연동은 눈으로 확인하기 어려워, 같은 호출 경로를 재현해 기대값과 대조하는 검증 도구를 따로 만들었습니다.",
      en: "Prescriptions and diagnoses are checked against the national drug-safety registry. Since external integrations are hard to eyeball, I built a separate tool that replays the same call path and compares against expected results.",
    },
  },

  "deploy-notifier": {
    nodes: [
      { id: "deploy", col: 0, row: 0, label: { ko: "배포 플랫폼", en: "Deploy platform" }, sublabel: { ko: "웹훅", en: "webhook" } },
      { id: "relay", col: 1, row: 0, tone: "accent", label: { ko: "알림 릴레이", en: "Notifier" }, sublabel: { ko: "핫픽스 판별", en: "hotfix filter" } },
      { id: "git", col: 2, row: 0, label: { ko: "커밋 범위 조회", en: "Commit range" } },
      { id: "jira", col: 2, row: 1, label: { ko: "이슈 스레드 링크", en: "Issue thread link" } },
      { id: "slack", col: 2, row: 2, label: { ko: "Slack 스레드", en: "Slack thread" }, sublabel: { ko: "완료 답글", en: "reply" } },
    ],
    edges: [
      { from: "deploy", to: "relay", label: { ko: "배포 이벤트", en: "deploy event" } },
      { from: "relay", to: "git", dir: "both" },
      { from: "relay", to: "jira", dir: "both" },
      { from: "relay", to: "slack" },
    ],
    groups: [
      { members: ["git", "jira", "slack"], label: { ko: "조회·전달 대상", en: "Lookups and delivery" } },
    ],
    caption: {
      ko: "배포 웹훅을 받으면 직전 배포와의 커밋 범위에서 이슈 키를 뽑고, 그 이슈에 연결된 Slack 스레드를 찾아 배포 완료를 답글로 남깁니다. 판별에 필요한 정보가 없으면 잘못 알리는 대신 침묵합니다.",
      en: "On a deploy webhook it extracts issue keys from the commit range since the previous deploy, finds the Slack thread linked to each issue, and replies there. When the inputs needed to decide are missing, it stays silent rather than notify wrongly.",
    },
  },
```

- [ ] **Step 2: 상세 본문 2건 작성 (ko/en)**

`dur-integration` 원천은 `~/career-archive/drafts/2026-Q2.md`의 DUR 절과 `2026-Q3.md`의 DUR 후속 절입니다. 절 구성은 "배경" / "한 일" / "검증 도구를 따로 만든 이유"로 합니다. 세 번째 절에는 외부 연동이라 눈으로 확인하기 어려웠다는 점과, 케이스를 선언해 두고 응답을 자동 대조하게 만든 판단을 씁니다.

`deploy-notifier` 원천은 `~/career-archive/drafts/2026-Q3.md`의 배포 알림 릴레이 절입니다. 절 구성은 "배경" / "한 일" / "알림을 좁힌 판단"으로 합니다. 세 번째 절에는 정기 릴리즈까지 알리면 소음이 되어 핫픽스만 남긴 것과, 판별 정보가 없을 때 오알림 대신 침묵을 택한 설계를 씁니다. **요청받지 않고 스스로 만들어 운영에 자리잡았다는 점을 밝힙니다.**

- [ ] **Step 3: 육안 확인**

`deploy-notifier`는 릴레이에서 오른쪽으로 세 갈래가 퍼지는 모양이며 간선이 상자를 통과하지 않아야 합니다. `dur-integration`은 검증 CLI로 가는 간선만 파선이어야 합니다.

- [ ] **Step 4: 검증과 커밋**

```bash
npm run lint && npm run build
git add src/data/
git commit -m "feat: DUR 연동·배포 알림 릴레이 상세와 다이어그램"
```

---

### Task 7: 상세와 다이어그램 (캐시닥 병원 CMS 모바일)

**Files:**
- Modify: `src/data/diagrams.ts`
- Modify: `src/data/project-details.ts`
- Modify: `src/data/en/project-details.ts`

**Interfaces:**
- Produces: `diagrams["cashdoc-mobile"]`와 상세 (ko/en). 이 태스크 이후 재직 중 8건 전부가 상세를 갖습니다

- [ ] **Step 1: 다이어그램 정의**

```ts
  "cashdoc-mobile": {
    nodes: [
      { id: "user", col: 0, row: 0, label: { ko: "이용자", en: "Consumer" }, sublabel: { ko: "상담 신청", en: "applies" } },
      { id: "platform", col: 1, row: 0, label: { ko: "예약 플랫폼", en: "Booking platform" }, sublabel: { ko: "도메인 이벤트", en: "domain event" } },
      { id: "inbox", col: 2, row: 0, tone: "accent", label: { ko: "알림함", en: "Notification inbox" }, sublabel: { ko: "예약+상담 통합", en: "unified" } },
      { id: "mobile", col: 3, row: 0, tone: "accent", label: { ko: "모바일 CMS", en: "Mobile CMS" }, sublabel: { ko: "관리자 화면", en: "admin UI" } },
      { id: "schema", col: 2, row: 1, label: { ko: "알림 스키마", en: "Inbox schema" }, sublabel: { ko: "마이그레이션", en: "migration" } },
    ],
    edges: [
      { from: "user", to: "platform", label: { ko: "신청", en: "submit" } },
      { from: "platform", to: "inbox", label: { ko: "적재", en: "records" } },
      { from: "inbox", to: "mobile", label: { ko: "조회", en: "reads" } },
      { from: "schema", to: "inbox", style: "dashed" },
    ],
    groups: [
      { members: ["inbox", "mobile"], tone: "accent", label: { ko: "이번 작업 범위", en: "This work" } },
    ],
    caption: {
      ko: "상담 신청이 들어오면 기존 도메인 이벤트에 한 갈래를 더해 알림함에 쌓습니다. 새 이벤트나 전달 경로를 만들지 않았고, 예약 알림만 담던 테이블을 확장해 두 종류를 한곳에서 다룹니다.",
      en: "A new consultation adds one more branch to an existing domain event so it lands in the inbox. No new event or delivery path was introduced; the table that held only booking alerts was extended to carry both kinds.",
    },
  },
```

- [ ] **Step 2: 상세 본문 작성 (ko/en)**

원천은 `~/career-archive/drafts/2026-Q3.md`의 캐시닥 병원 CMS 모바일 운영 MVP 절입니다. 절 구성은 "배경" / "만든 화면" / "알림함을 넓힌 방법"으로 합니다.

세 번째 절이 이 카드의 핵심입니다. 다음을 씁니다.

- 화면이 아니라 데이터가 막혀 있었다는 진단. 알림 종류가 예약 상태 네 가지뿐이었습니다
- 새 이벤트를 만들지 않고 기존 도메인 이벤트에 갈래를 더한 선택
- 두 외래 키 중 정확히 하나만 채우도록 제약으로 강제한 것
- 배포 순서를 스키마 → API → 프런트 → 적재로 두어, 중간 어느 단계에서 멈춰도 화면이 그대로 동작하고 되돌릴 때는 마지막 단계만 끄면 되게 한 것

네 번째 항목이 특히 값어치가 있으니 분명하게 씁니다.

- [ ] **Step 3: 육안 확인과 커밋**

```bash
npm run lint && npm run build
git add src/data/
git commit -m "feat: 캐시닥 병원 CMS 모바일 상세와 다이어그램"
```

---

### Task 8: 전수 점검과 마무리

**Files:**
- Modify: 점검 중 발견한 파일

- [ ] **Step 1: 재직 중 8건 전수 확인**

`npm run dev`로 `/`와 `/en` 양쪽에서 카드 8장을 모두 열어 확인합니다.

- 다이어그램에서 상자와 간선이 겹치지 않습니다
- 간선이 다른 상자를 통과하지 않습니다
- 그룹 경계가 의도한 노드만 감쌉니다
- 간선 라벨을 선이 지나가지 않습니다
- 영문 라벨이 상자 밖으로 넘치지 않습니다. 넘치면 라벨을 줄이거나 `sublabel`로 내립니다

- [ ] **Step 2: 테마·반응형 확인**

라이트와 다크 모드 각각에서 8건을 확인합니다. 브라우저 폭 375px에서 모달이 화면을 벗어나지 않고, 다이어그램만 가로로 스크롤되며, 페이지 본문이 가로로 밀리지 않는지 봅니다.

- [ ] **Step 3: 접근성 확인**

- Tab만으로 카드 8장에 모두 도달합니다
- Enter로 열리고 Esc로 닫힙니다
- 닫은 뒤 포커스가 열었던 카드로 돌아옵니다
- 모달이 열린 동안 Tab이 모달 밖으로 나가지 않습니다

- [ ] **Step 4: 내용 점검**

작성한 상세 본문 16건(8건 × 2개 언어)을 처음부터 끝까지 읽으며 Global Constraints를 위반한 곳이 없는지 봅니다.

- 티켓 번호, PR 번호, 커밋 해시가 없습니다
- 고객 병원 이름이 없습니다
- 폐기된 릴리즈 진척 대시보드 언급이 없습니다
- 한국어 본문에 줄표(—)와 명사형 종결이 없습니다

다음 명령으로 기계적으로 확인할 수 있는 것부터 확인합니다.

```bash
grep -nE '—|WSD-|CRM-[0-9]|CSD-|PR #|[가-힣]+(함|됨)\.' src/data/project-details.ts src/data/projects.ts
```

기대: 아무것도 나오지 않습니다.

- [ ] **Step 5: 빌드 산출물 크기 확인**

```bash
npm run build
```

빌드 출력에서 첫 페이지의 크기를 봅니다. SVG 8개가 HTML에 들어가므로 이전보다 커집니다. 페이지 First Load JS가 크게 늘었다면 서버 컴포넌트 경계가 잘못돼 상세 내용이 클라이언트 번들에 들어간 것이므로 원인을 찾습니다.

- [ ] **Step 6: 최종 커밋**

```bash
git add -A
git commit -m "fix: 프로젝트 상세 전수 점검 반영"
```

---

## Self-Review

**Spec coverage:** 스펙의 각 절을 태스크에 대응시켜 확인했습니다.

| 스펙 절 | 태스크 |
| --- | --- |
| 데이터 모델 (배치·타입·다이어그램 모델) | Task 1 |
| 다이어그램 렌더러 (파일·배치 규칙·간선 라우팅·그룹·색·반응형·접근성) | Task 2 |
| 모달 (방식·컴포넌트·카드 상호작용) | Task 3 |
| i18n | Task 1 Step 4 |
| 콘텐츠 변경 (수치·카드 추가·실명 기준·본문 원천) | Task 1 Step 5~7, Task 3~7 |
| 검증 6항목 | Task 8 Step 1~3, 각 태스크의 육안 확인 |
| 위험과 대응 | Task 2의 검사 함수, Task 8 Step 1·4 |

**Placeholder scan:** "TBD", "적절히", "필요시 처리" 같은 표현이 없는지 확인했습니다. 상세 본문의 산문은 태스크에서 원천 파일 경로와 절 구성, 반드시 담을 내용을 지정했습니다. 코드가 필요한 단계에는 전부 실제 코드를 넣었습니다.

**Type consistency:** 이름을 태스크 간에 대조했습니다.

- `layoutDiagram`, `DiagramLayout`, `PlacedNode`, `PlacedGroup`, `PlacedEdge` (Task 2에서 정의, Task 2 diagram.tsx에서 사용)
- `DiagramView({ diagram, locale, idPrefix, title })` (Task 2에서 정의, Task 3 project-detail.tsx에서 사용)
- `ProjectDialog({ trigger, triggerClassName, labelledById, closeLabel, children })` (Task 3에서 정의·사용)
- `ProjectDetailView({ project, detail, diagram, locale, titleId })` (Task 3에서 정의·사용)
- `projectDetails` (Task 1에서 정의, Task 3에서 `getContent(locale).projectDetails`로 사용)
- `diagrams` (Task 1에서 정의, Task 3에서 직접 import)
- slug 8개가 Task 1의 표, Task 2~7의 다이어그램 키, 카드 데이터에서 모두 일치합니다
