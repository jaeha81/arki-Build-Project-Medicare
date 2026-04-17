"use client";

import { ShieldAlert, ShieldCheck, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useCompliancePhrases,
  useDeleteCompliancePhrase,
  type ProhibitedPhraseRead,
} from "@/hooks/use-admin";

const SEVERITY_BADGE: Record<ProhibitedPhraseRead["severity"], string> = {
  critical: "bg-[#fee2e2] text-[#b91c1c]",
  warning: "bg-[#fef3c7] text-[#b45309]",
  info: "bg-[#dbeafe] text-[#1d4ed8]",
};

export default function CompliancePage() {
  const { data: phrases = [], isLoading, isError } = useCompliancePhrases();
  const deletePhrase = useDeleteCompliancePhrase();

  if (isLoading) {
    return <div className="py-8 text-center text-[#64748b]">Loading...</div>;
  }

  if (isError) {
    return <div className="py-8 text-center text-[#ef4444]">Failed to load data.</div>;
  }

  const critical = phrases.filter((p) => p.severity === "critical").length;
  const warning = phrases.filter((p) => p.severity === "warning").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1e293b]">Compliance Phrases</h1>
        <p className="text-sm text-[#64748b] mt-1">
          Manage prohibited phrases and compliance rules
        </p>
      </div>

      {/* Summary */}
      <div className="flex gap-4">
        <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl px-5 py-3 flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-[#ef4444]" />
          <span className="text-sm font-semibold text-[#b91c1c]">{critical} Critical</span>
        </div>
        <div className="bg-[#fefce8] border border-[#fde68a] rounded-xl px-5 py-3 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#f59e0b]" />
          <span className="text-sm font-semibold text-[#92400e]">{warning} Warning</span>
        </div>
      </div>

      {/* Phrase list */}
      <div className="space-y-4">
        {phrases.map((item) => (
          <div
            key={item.id}
            className={cn(
              "bg-white rounded-xl border p-5",
              item.severity === "critical"
                ? "border-[#fecaca]"
                : item.severity === "warning"
                ? "border-[#fde68a]"
                : "border-[#e2e8f0]"
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0 space-y-2">
                {/* Header row */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={cn(
                      "text-xs font-medium px-2 py-0.5 rounded-full capitalize",
                      SEVERITY_BADGE[item.severity]
                    )}
                  >
                    {item.severity}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#f1f5f9] text-[#475569]">
                    {item.category}
                  </span>
                  <span className="text-xs text-[#94a3b8] ml-auto">
                    {new Date(item.created_at).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* Phrase */}
                <p className="text-sm font-semibold text-[#1e293b] font-mono bg-[#f8fafc] px-3 py-1.5 rounded-lg">
                  {item.phrase}
                </p>

                {/* Pattern */}
                {item.pattern && (
                  <p className="text-xs text-[#64748b]">
                    Pattern: <span className="font-mono">{item.pattern}</span>
                  </p>
                )}

                {/* Suggestion */}
                {item.suggestion && (
                  <p className="text-xs text-[#0ea5e9] bg-[#f0f9ff] rounded-lg px-3 py-2">
                    Suggestion: {item.suggestion}
                  </p>
                )}
              </div>

              {/* Delete */}
              <button
                onClick={() => deletePhrase.mutate(item.id)}
                disabled={deletePhrase.isPending}
                className="shrink-0 p-2 rounded-lg text-[#94a3b8] hover:text-[#ef4444] hover:bg-[#fef2f2] transition-colors disabled:opacity-50"
                title="Delete phrase"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {phrases.length === 0 && (
          <p className="text-sm text-[#94a3b8] text-center py-8">
            No prohibited phrases found.
          </p>
        )}
      </div>
    </div>
  );
}
