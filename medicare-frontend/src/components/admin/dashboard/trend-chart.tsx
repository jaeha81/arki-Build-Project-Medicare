"use client";

import type { TrendPoint } from "@/types/kpi";

interface TrendChartProps {
  data: TrendPoint[];
  label: string;
}

const CHART_HEIGHT = 120;
const CHART_WIDTH = 600;
const PADDING = { top: 12, right: 16, bottom: 28, left: 40 };

export function TrendChart({ data, label }: TrendChartProps) {
  const recent = data.slice(-7);

  if (recent.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-sm">
        <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-3">{label}</p>
        <div className="flex items-center justify-center h-32 text-[#94a3b8] text-sm">
          데이터 없음
        </div>
      </div>
    );
  }

  const counts = recent.map((d) => d.count);
  const maxCount = Math.max(...counts, 1);
  const innerW = CHART_WIDTH - PADDING.left - PADDING.right;
  const innerH = CHART_HEIGHT - PADDING.top - PADDING.bottom;

  const xStep = innerW / Math.max(recent.length - 1, 1);

  const points = recent.map((d, i) => ({
    x: PADDING.left + i * xStep,
    y: PADDING.top + innerH - (d.count / maxCount) * innerH,
    count: d.count,
    date: d.date,
  }));

  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");

  // 아래 채움 경로
  const fillPath = [
    `M ${points[0].x},${PADDING.top + innerH}`,
    ...points.map((p) => `L ${p.x},${p.y}`),
    `L ${points[points.length - 1].x},${PADDING.top + innerH}`,
    "Z",
  ].join(" ");

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-sm">
      <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-3">{label}</p>
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        className="w-full"
        aria-label={label}
        role="img"
      >
        <defs>
          <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Y축 격자선 (3개) */}
        {[0, 0.5, 1].map((ratio) => {
          const y = PADDING.top + innerH * (1 - ratio);
          const val = Math.round(maxCount * ratio);
          return (
            <g key={ratio}>
              <line
                x1={PADDING.left}
                y1={y}
                x2={PADDING.left + innerW}
                y2={y}
                stroke="#e2e8f0"
                strokeWidth={1}
              />
              <text
                x={PADDING.left - 6}
                y={y + 4}
                textAnchor="end"
                fontSize={10}
                fill="#94a3b8"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* 채움 영역 */}
        <path d={fillPath} fill="url(#trend-fill)" />

        {/* 라인 */}
        <polyline
          points={polyline}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* 데이터 포인트 */}
        {points.map((p) => (
          <circle key={p.date} cx={p.x} cy={p.y} r={3.5} fill="#3b82f6" />
        ))}

        {/* X축 레이블 (MM/DD) */}
        {points.map((p) => {
          const mmdd = p.date.slice(5); // "YYYY-MM-DD" → "MM-DD"
          return (
            <text
              key={p.date}
              x={p.x}
              y={PADDING.top + innerH + 18}
              textAnchor="middle"
              fontSize={10}
              fill="#94a3b8"
            >
              {mmdd}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
