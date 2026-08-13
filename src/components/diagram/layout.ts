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
/**
 * 상단 여백은 diagram.tsx가 그룹 박스 위에 그리는 그룹 라벨을 가릴 만큼 커야 합니다.
 * 라벨은 `group.y - 6`을 베이스라인으로 그려지고, 그룹 박스 상단은 노드 y에서 GROUP_PAD만큼
 * 뺀 값입니다. 한글 10.5px 텍스트의 어센트가 대략 8~9px이므로 MARGIN이 GROUP_PAD와
 * 라벨 어센트를 합친 값보다 작으면 행 0에 있는 그룹의 라벨 위쪽이 SVG viewBox 밖으로
 * 잘립니다. 이 값을 줄이기 전에 위 계산을 다시 확인해 주세요.
 */
export const MARGIN = 36;

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
