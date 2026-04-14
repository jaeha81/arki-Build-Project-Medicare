import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AgentCardProps {
  name: string;
  description: string;
  model: string;
  isEnabled: boolean;
  lastRun: string | null;
  onToggle: (enabled: boolean) => void;
}

const MODEL_BADGE: Record<string, { label: string; className: string }> = {
  haiku: { label: "Haiku", className: "bg-[#dbeafe] text-[#1d4ed8]" },
  sonnet: { label: "Sonnet", className: "bg-[#dcfce7] text-[#15803d]" },
  opus: { label: "Opus", className: "bg-[#ede9fe] text-[#6d28d9]" },
};

function getModelBadge(model: string): { label: string; className: string } {
  const lower = model.toLowerCase();
  if (lower.includes("haiku")) return MODEL_BADGE.haiku;
  if (lower.includes("opus")) return MODEL_BADGE.opus;
  return MODEL_BADGE.sonnet;
}

export function AgentCard({
  name,
  description,
  model,
  isEnabled,
  lastRun,
  onToggle,
}: AgentCardProps) {
  const badge = getModelBadge(model);

  return (
    <div
      className={cn(
        "bg-white rounded-xl border-2 p-5 transition-colors",
        isEnabled ? "border-[#22c55e]" : "border-[#e2e8f0]"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-[#1e293b] truncate">{name}</h3>
          <p className="text-xs text-[#64748b] mt-0.5 line-clamp-2">{description}</p>
        </div>

        {/* Toggle */}
        <label className="relative inline-flex items-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            className="sr-only"
            checked={isEnabled}
            onChange={(e) => onToggle(e.target.checked)}
            aria-label={`Toggle ${name}`}
          />
          <div
            className={cn(
              "w-10 h-5 rounded-full transition-colors",
              isEnabled ? "bg-[#22c55e]" : "bg-[#cbd5e1]"
            )}
          >
            <div
              className={cn(
                "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform",
                isEnabled ? "translate-x-5" : "translate-x-0"
              )}
            />
          </div>
        </label>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4">
        <span
          className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-full",
            badge.className
          )}
        >
          {badge.label}
        </span>
        <span className="flex items-center gap-1 text-xs text-[#94a3b8]">
          <Clock className="h-3 w-3" />
          {lastRun ?? "Never run"}
        </span>
      </div>
    </div>
  );
}
