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
