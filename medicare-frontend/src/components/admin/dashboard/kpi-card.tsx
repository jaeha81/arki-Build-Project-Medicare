import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: "up" | "down" | "flat";
  trendValue?: string;
  description?: string;
  accent?: "green" | "blue" | "amber" | "rose";
  /** 전날 대비 변화량 (양수=증가, 음수=감소) */
  delta?: number;
  deltaLabel?: string;
  icon?: React.ReactNode;
}

const ACCENT_STYLES = {
  green: "border-l-[#22c55e] bg-[#f0fdf4]",
  blue: "border-l-[#3b82f6] bg-[#eff6ff]",
  amber: "border-l-[#f59e0b] bg-[#fffbeb]",
  rose: "border-l-[#f43f5e] bg-[#fff1f2]",
} as const;

const ACCENT_VALUE = {
  green: "text-[#15803d]",
  blue: "text-[#1d4ed8]",
  amber: "text-[#b45309]",
  rose: "text-[#be123c]",
} as const;

export function KpiCard({
  title,
  value,
  unit,
  trend,
  trendValue,
  description,
  accent = "green",
  delta,
  deltaLabel,
  icon,
}: KpiCardProps) {
  // delta가 제공된 경우 trend/trendValue를 자동 도출
  const resolvedTrend =
    trend ?? (delta !== undefined ? (delta > 0 ? "up" : delta < 0 ? "down" : "flat") : undefined);
  const resolvedTrendValue =
    trendValue ?? (delta !== undefined ? `${delta > 0 ? "+" : ""}${delta}` : undefined);
  const resolvedDescription = description ?? deltaLabel;

  return (
    <div className={cn("bg-white rounded-xl border-l-4 border border-[#e2e8f0] p-5 shadow-sm", ACCENT_STYLES[accent])}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide">{title}</p>
        {icon && <span className="text-[#94a3b8]">{icon}</span>}
      </div>
      <div className="flex items-end gap-2 mb-1">
        <span className={cn("text-3xl font-bold", ACCENT_VALUE[accent])}>{value}</span>
        {unit && <span className="text-sm text-[#94a3b8] mb-1">{unit}</span>}
      </div>
      {(resolvedTrend || resolvedTrendValue) && (
        <div className="flex items-center gap-1 text-xs">
          {resolvedTrend === "up" && <TrendingUp className="h-3 w-3 text-[#22c55e]" />}
          {resolvedTrend === "down" && <TrendingDown className="h-3 w-3 text-[#ef4444]" />}
          {resolvedTrend === "flat" && <Minus className="h-3 w-3 text-[#94a3b8]" />}
          <span className={cn(
            "font-medium",
            resolvedTrend === "up" ? "text-[#22c55e]" : resolvedTrend === "down" ? "text-[#ef4444]" : "text-[#94a3b8]"
          )}>
            {resolvedTrendValue}
          </span>
          {resolvedDescription && <span className="text-[#94a3b8] ml-1">{resolvedDescription}</span>}
        </div>
      )}
    </div>
  );
}
