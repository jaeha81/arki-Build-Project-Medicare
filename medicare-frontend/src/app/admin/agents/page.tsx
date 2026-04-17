"use client";

import { Bot, Activity, PlayCircle } from "lucide-react";
import { AgentCard } from "@/components/admin/agents/agent-card";
import { useAgents, useToggleAgent } from "@/hooks/use-agents";

export default function AgentsPage() {
  const { data: agents = [], isLoading, isError } = useAgents();
  const toggleAgent = useToggleAgent();

  const handleToggle = (agentId: string, enabled: boolean) => {
    toggleAgent.mutate({ agentId, isEnabled: enabled });
  };

  const totalAgents = agents.length;
  const activeAgents = agents.filter((a) => a.is_enabled).length;

  if (isLoading) {
    return <div className="py-8 text-center text-[#64748b]">Loading...</div>;
  }

  if (isError) {
    return <div className="py-8 text-center text-[#ef4444]">Failed to load data.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1e293b]">Agent Control Center</h1>
        <p className="text-sm text-[#64748b] mt-1">
          Manage and monitor all AI agents in the Medicare OS
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#f1f5f9] flex items-center justify-center">
              <Bot className="h-5 w-5 text-[#64748b]" />
            </div>
            <div>
              <p className="text-xs text-[#64748b]">Total Agents</p>
              <p className="text-2xl font-bold text-[#1e293b]">{totalAgents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#f0fdf4] flex items-center justify-center">
              <Activity className="h-5 w-5 text-[#22c55e]" />
            </div>
            <div>
              <p className="text-xs text-[#64748b]">Active</p>
              <p className="text-2xl font-bold text-[#22c55e]">{activeAgents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#eff6ff] flex items-center justify-center">
              <PlayCircle className="h-5 w-5 text-[#3b82f6]" />
            </div>
            <div>
              <p className="text-xs text-[#64748b]">Runs Today</p>
              <p className="text-2xl font-bold text-[#3b82f6]">{activeAgents}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <AgentCard
            key={agent.id}
            name={agent.name_en}
            description=""
            model={agent.model}
            isEnabled={agent.is_enabled}
            lastRun={null}
            onToggle={(enabled) => handleToggle(agent.id, enabled)}
          />
        ))}
      </div>
    </div>
  );
}
