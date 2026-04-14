"use client";

import { useState } from "react";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComplianceItem {
  id: string;
  content_type: string;
  content_id: string;
  compliance_score: number;
  is_compliant: boolean;
  flagged_reason: string | null;
  created_at: string;
}

const MOCK_COMPLIANCE: ComplianceItem[] = [
  { id: "cq-001", content_type: "review", content_id: "r-003", compliance_score: 42, is_compliant: false, flagged_reason: "Potential efficacy claim: 'cures hypertension'", created_at: "2026-04-14T10:02:00Z" },
  { id: "cq-002", content_type: "product_description", content_id: "p-007", compliance_score: 58, is_compliant: false, flagged_reason: "Unverified health claim detected", created_at: "2026-04-14T09:45:00Z" },
  { id: "cq-003", content_type: "review", content_id: "r-010", compliance_score: 88, is_compliant: true, flagged_reason: null, created_at: "2026-04-14T09:20:00Z" },
  { id: "cq-004", content_type: "faq", content_id: "faq-002", compliance_score: 71, is_compliant: true, flagged_reason: null, created_at: "2026-04-14T08:55:00Z" },
  { id: "cq-005", content_type: "review", content_id: "r-015", compliance_score: 35, is_compliant: false, flagged_reason: "References specific disease treatment", created_at: "2026-04-14T08:30:00Z" },
];

function ScoreGauge({ score }: { score: number }) {
  const color =
    score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-semibold w-8 text-right" style={{ color }}>
        {score}%
      </span>
    </div>
  );
}

export default function CompliancePage() {
  const [items, setItems] = useState(MOCK_COMPLIANCE);

  const handleAction = (id: string, action: "approve" | "review") => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, is_compliant: action === "approve" }
          : item
      )
    );
  };

  const pending = items.filter((i) => !i.is_compliant).length;
  const compliant = items.filter((i) => i.is_compliant).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1e293b]">Compliance Queue</h1>
        <p className="text-sm text-[#64748b] mt-1">
          Review content flagged by the Compliance Gate Agent
        </p>
      </div>

      {/* Summary */}
      <div className="flex gap-4">
        <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl px-5 py-3 flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-[#ef4444]" />
          <span className="text-sm font-semibold text-[#b91c1c]">{pending} Flagged</span>
        </div>
        <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl px-5 py-3 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#22c55e]" />
          <span className="text-sm font-semibold text-[#15803d]">{compliant} Compliant</span>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "bg-white rounded-xl border p-5",
              item.is_compliant ? "border-[#e2e8f0]" : "border-[#fecaca]"
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0 space-y-3">
                {/* Header row */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#f1f5f9] text-[#475569] capitalize">
                    {item.content_type.replace("_", " ")}
                  </span>
                  <span className="text-xs text-[#94a3b8] font-mono">{item.content_id}</span>
                  <span
                    className={cn(
                      "text-xs font-medium px-2 py-0.5 rounded-full",
                      item.is_compliant
                        ? "bg-[#dcfce7] text-[#15803d]"
                        : "bg-[#fee2e2] text-[#b91c1c]"
                    )}
                  >
                    {item.is_compliant ? "Compliant" : "Non-compliant"}
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

                {/* Score gauge */}
                <div>
                  <p className="text-xs text-[#64748b] mb-1">Compliance Score</p>
                  <ScoreGauge score={item.compliance_score} />
                </div>

                {/* Flagged reason */}
                {item.flagged_reason && (
                  <p className="text-xs text-[#b91c1c] bg-[#fef2f2] rounded-lg px-3 py-2">
                    {item.flagged_reason}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={() => handleAction(item.id, "approve")}
                  className="bg-[#22c55e] hover:bg-[#16a34a] text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction(item.id, "review")}
                  className="bg-[#fef3c7] hover:bg-[#fde68a] text-[#92400e] text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
                >
                  Review
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
