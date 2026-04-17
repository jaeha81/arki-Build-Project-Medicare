"use client";

import { useState } from "react";
import { ShieldCheck, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useAdminApprovals,
  useProcessApproval,
  type ApprovalListItem,
} from "@/hooks/use-admin";

function ApprovalCard({ item }: { item: ApprovalListItem }) {
  const [expanded, setExpanded] = useState(false);
  const processApproval = useProcessApproval();

  const handleAction = (action: "approve" | "reject") => {
    processApproval.mutate({ id: item.id, action });
  };

  return (
    <div className="bg-white rounded-xl border border-[#fcd34d] p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <ShieldCheck className="h-5 w-5 text-[#f59e0b] shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            {/* Badges row */}
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-semibold text-[#92400e] bg-[#fef3c7] px-2 py-0.5 rounded-full">
                {item.agent_id}
              </span>
              <span className="flex items-center gap-1 text-xs text-[#94a3b8]">
                <Clock className="h-3 w-3" />
                {new Date(item.created_at).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
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
          <button
            onClick={() => handleAction("approve")}
            disabled={processApproval.isPending}
            className="bg-[#22c55e] hover:bg-[#16a34a] text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            Approve
          </button>
          <button
            onClick={() => handleAction("reject")}
            disabled={processApproval.isPending}
            className="bg-[#fee2e2] hover:bg-[#fecaca] text-[#b91c1c] text-sm font-medium px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ApprovalsPage() {
  const [activeAgent, setActiveAgent] = useState("All");
  const { data: approvals = [], isLoading, isError } = useAdminApprovals("pending");

  if (isLoading) {
    return <div className="py-8 text-center text-[#64748b]">Loading...</div>;
  }

  if (isError) {
    return <div className="py-8 text-center text-[#ef4444]">Failed to load data.</div>;
  }

  const agentIds = Array.from(new Set(approvals.map((a) => a.agent_id)));
  const allAgents = ["All", ...agentIds];

  const filtered =
    activeAgent === "All"
      ? approvals
      : approvals.filter((a) => a.agent_id === activeAgent);

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
        {allAgents.map((agent) => (
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
                ({approvals.filter((a) => a.agent_id === agent).length})
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
