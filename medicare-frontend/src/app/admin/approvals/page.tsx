"use client";

import { useState } from "react";
import { ShieldCheck, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Priority = "critical" | "high" | "medium" | "low";
type ApprovalStatus = "pending" | "approved" | "rejected";

interface ApprovalItem {
  id: string;
  agent: string;
  action: string;
  details: Record<string, string>;
  created: string;
  status: ApprovalStatus;
  priority: Priority;
}

const PRIORITY_BADGE: Record<Priority, string> = {
  critical: "bg-[#fee2e2] text-[#b91c1c]",
  high: "bg-[#fef3c7] text-[#b45309]",
  medium: "bg-[#dbeafe] text-[#1d4ed8]",
  low: "bg-[#f1f5f9] text-[#475569]",
};

const MOCK_APPROVALS: ApprovalItem[] = [
  {
    id: "a-001",
    agent: "Intake Agent",
    action: "Send consultation summary email to tanaka@example.com",
    details: { consultation_id: "c-001", template: "intake_summary" },
    created: "5m ago",
    status: "pending",
    priority: "high",
  },
  {
    id: "a-002",
    agent: "Compliance Gate Agent",
    action: "Flag review r-003 for manual compliance check",
    details: { review_id: "r-003", reason: "Potential efficacy claim detected" },
    created: "22m ago",
    status: "pending",
    priority: "critical",
  },
  {
    id: "a-003",
    agent: "Retention Agent",
    action: "Send retention offer to sato@example.com",
    details: { customer_id: "c-002", offer: "10% discount next month" },
    created: "1h ago",
    status: "pending",
    priority: "medium",
  },
  {
    id: "a-004",
    agent: "Offer Agent",
    action: "Send product recommendation to yamada@example.com",
    details: { customer_id: "c-005", product_id: "p-012", discount: "none" },
    created: "2h ago",
    status: "pending",
    priority: "low",
  },
];

const ALL_AGENTS = ["All", ...Array.from(new Set(MOCK_APPROVALS.map((a) => a.agent)))];

function ApprovalCard({ item }: { item: ApprovalItem }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-[#fcd34d] p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <ShieldCheck className="h-5 w-5 text-[#f59e0b] shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            {/* Badges row */}
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-semibold text-[#92400e] bg-[#fef3c7] px-2 py-0.5 rounded-full">
                {item.agent}
              </span>
              <span
                className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full capitalize",
                  PRIORITY_BADGE[item.priority]
                )}
              >
                {item.priority}
              </span>
              <span className="flex items-center gap-1 text-xs text-[#94a3b8]">
                <Clock className="h-3 w-3" />
                {item.created}
              </span>
            </div>

            <p className="text-sm font-medium text-[#1e293b] mb-2">{item.action}</p>

            {/* Accordion JSON */}
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1 text-xs text-[#64748b] hover:text-[#1e293b] transition-colors"
            >
              {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              {expanded ? "Hide details" : "Show details"}
            </button>

            {expanded && (
              <pre className="mt-2 text-xs text-[#64748b] bg-[#f8fafc] rounded-lg p-2 overflow-x-auto">
                {JSON.stringify(item.details, null, 2)}
              </pre>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 shrink-0">
          <button className="bg-[#22c55e] hover:bg-[#16a34a] text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors">
            Approve
          </button>
          <button className="bg-[#fee2e2] hover:bg-[#fecaca] text-[#b91c1c] text-sm font-medium px-4 py-1.5 rounded-lg transition-colors">
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ApprovalsPage() {
  const [activeAgent, setActiveAgent] = useState("All");

  const filtered =
    activeAgent === "All"
      ? MOCK_APPROVALS
      : MOCK_APPROVALS.filter((a) => a.agent === activeAgent);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1e293b]">Approval Queue</h1>
        <p className="text-sm text-[#64748b] mt-1">
          Review and approve agent-initiated actions
        </p>
      </div>

      {/* Agent filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {ALL_AGENTS.map((agent) => (
          <button
            key={agent}
            onClick={() => setActiveAgent(agent)}
            className={cn(
              "text-xs font-medium px-3 py-1.5 rounded-lg transition-colors border",
              activeAgent === agent
                ? "bg-[#1e293b] text-white border-[#1e293b]"
                : "bg-white text-[#64748b] border-[#e2e8f0] hover:border-[#1e293b] hover:text-[#1e293b]"
            )}
          >
            {agent}
            {agent !== "All" && (
              <span className="ml-1.5 text-[10px] opacity-60">
                ({MOCK_APPROVALS.filter((a) => a.agent === agent).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <ApprovalCard key={item.id} item={item} />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-[#94a3b8] text-center py-8">
            No pending approvals for this agent.
          </p>
        )}
      </div>
    </div>
  );
}
