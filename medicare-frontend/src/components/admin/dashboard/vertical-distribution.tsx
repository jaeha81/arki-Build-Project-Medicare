"use client";

import { cn } from "@/lib/utils";
import type { VerticalDistribution as VerticalDistributionData } from "@/types/kpi";

interface VerticalDistributionProps {
  data: VerticalDistributionData[];
}

type AccentKey = "green" | "blue" | "amber" | "rose";

const VERTICAL_ACCENTS: Record<string, AccentKey> = {
  "weight-loss": "green",
  "hair-loss": "blue",
  "aging": "amber",
  "sexual-health": "rose",
};

const DEFAULT_ACCENT_ORDER: AccentKey[] = ["green", "blue", "amber", "rose"];

const BAR_BG: Record<AccentKey, string> = {
  green: "bg-[#22c55e]",
  blue: "bg-[#3b82f6]",
  amber: "bg-[#f59e0b]",
  rose: "bg-[#f43f5e]",
};

const BADGE_BG: Record<AccentKey, string> = {
  green: "bg-[#f0fdf4] text-[#15803d]",
  blue: "bg-[#eff6ff] text-[#1d4ed8]",
  amber: "bg-[#fffbeb] text-[#b45309]",
  rose: "bg-[#fff1f2] text-[#be123c]",
};

export function VerticalDistribution({ data }: VerticalDistributionProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-sm">
        <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-4">
          Vertical Distribution
        </p>
        <p className="text-sm text-[#94a3b8]">데이터 없음</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-sm">
      <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-4">
        Vertical Distribution
      </p>
      <ul className="space-y-3">
        {data.map((item, idx) => {
          const accent: AccentKey =
            VERTICAL_ACCENTS[item.vertical] ??
            DEFAULT_ACCENT_ORDER[idx % DEFAULT_ACCENT_ORDER.length];

          return (
            <li key={item.vertical}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-[#1e293b] capitalize">
                  {item.vertical.replace(/-/g, " ")}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-xs font-semibold px-2 py-0.5 rounded-full",
                      BADGE_BG[accent]
                    )}
                  >
                    {item.count}건
                  </span>
                  <span className="text-xs text-[#94a3b8] w-10 text-right">
                    {item.percentage}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-[#f1f5f9] rounded-full h-2">
                <div
                  className={cn("h-2 rounded-full transition-all duration-500", BAR_BG[accent])}
                  style={{ width: `${Math.min(item.percentage, 100)}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
