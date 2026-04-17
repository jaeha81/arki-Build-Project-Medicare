"use client";

import { useState } from "react";
import { useAgents, useAgentLogs } from "@/hooks/use-agents";
import type { AgentActionLog } from "@/types/agent";

const STATUS_BADGE: Record<AgentActionLog["status"], string> = {
  completed: "bg-[#dcfce7] text-[#15803d]",
  failed: "bg-[#fee2e2] text-[#b91c1c]",
  executing: "bg-[#dbeafe] text-[#1d4ed8]",
  pending: "bg-[#f1f5f9] text-[#64748b]",
};

function LogRow({ log }: { log: AgentActionLog }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tr className="border-t border-[#e2e8f0] hover:bg-[#f8fafc]">
        <td className="px-4 py-3 text-sm text-[#64748b] whitespace-nowrap">
          {new Date(log.created_at).toLocaleString()}
        </td>
        <td className="px-4 py-3 text-sm text-[#1e293b] font-medium">{log.agent_id}</td>
        <td className="px-4 py-3 text-sm text-[#1e293b]">{log.action}</td>
        <td className="px-4 py-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[log.status]}`}
          >
            {log.status}
          </span>
        </td>
        <td className="px-4 py-3 text-sm text-[#ef4444]">{log.error ?? "—"}</td>
        <td className="px-4 py-3">
          {log.result !== null ? (
            <button
              onClick={() => setOpen((v) => !v)}
              className="text-xs text-[#3b82f6] hover:underline"
            >
              {open ? "Hide" : "Show details"}
            </button>
          ) : (
            <span className="text-xs text-[#94a3b8]">—</span>
          )}
        </td>
      </tr>
      {open && log.result !== null && (
        <tr className="border-t border-[#e2e8f0] bg-[#f8fafc]">
          <td colSpan={6} className="px-4 py-3">
            <pre className="text-xs text-[#334155] bg-white border border-[#e2e8f0] rounded p-3 overflow-auto max-h-48">
              {JSON.stringify(log.result, null, 2)}
            </pre>
          </td>
        </tr>
      )}
    </>
  );
}

export default function AgentLogsPage() {
  const [selectedAgent, setSelectedAgent] = useState<string | undefined>(undefined);

  const { data: agents = [], isLoading: agentsLoading } = useAgents();
  const { data: logs = [], isLoading: logsLoading, isError } = useAgentLogs(selectedAgent);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1e293b]">Agent Logs</h1>
        <p className="text-sm text-[#64748b] mt-1">View action logs for all AI agents</p>
      </div>

      {/* Agent filter buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedAgent(undefined)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            selectedAgent === undefined
              ? "bg-[#1e293b] text-white"
              : "bg-white border border-[#e2e8f0] text-[#64748b] hover:border-[#1e293b]"
          }`}
        >
          All
        </button>
        {!agentsLoading &&
          agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => setSelectedAgent(agent.agent_type)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedAgent === agent.agent_type
                  ? "bg-[#1e293b] text-white"
                  : "bg-white border border-[#e2e8f0] text-[#64748b] hover:border-[#1e293b]"
              }`}
            >
              {agent.name_en}
            </button>
          ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden">
        {logsLoading ? (
          <div className="py-8 text-center text-[#64748b] text-sm">Loading...</div>
        ) : isError ? (
          <div className="py-8 text-center text-[#ef4444] text-sm">Failed to load logs.</div>
        ) : logs.length === 0 ? (
          <div className="py-8 text-center text-[#64748b] text-sm">No logs found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                    Time
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                    Agent
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                    Action
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                    Error
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                    Result
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <LogRow key={log.id} log={log} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
