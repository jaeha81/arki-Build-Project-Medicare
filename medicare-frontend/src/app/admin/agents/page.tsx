"use client";

import { useState } from "react";
import { Bot, Activity, PlayCircle } from "lucide-react";
import { AgentCard } from "@/components/admin/agents/agent-card";
import type { AgentConfiguration } from "@/types/agent";

const MOCK_AGENTS: (AgentConfiguration & { description: string; lastRun: string | null })[] = [
  {
    id: "intake",
    agent_type: "intake",
    name_en: "Intake Agent",
    model: "claude-3-haiku",
    is_enabled: true,
    config: null,
    description: "Handles new consultation intake and sends summary emails to customers.",
    lastRun: "3m ago",
  },
  {
    id: "compliance_gate",
    agent_type: "compliance_gate",
    name_en: "Compliance Gate Agent",
    model: "claude-sonnet-4-6",
    is_enabled: true,
    config: null,
    description: "Scans reviews and content for regulatory compliance violations.",
    lastRun: "15m ago",
  },
  {
    id: "review_cs",
    agent_type: "review_cs",
    name_en: "Review CS Agent",
    model: "claude-sonnet-4-6",
    is_enabled: true,
    config: null,
    description: "Generates customer service responses for incoming reviews.",
    lastRun: "1h ago",
  },
  {
    id: "retention",
    agent_type: "retention",
    name_en: "Retention Agent",
    model: "claude-sonnet-4-6",
    is_enabled: false,
    config: null,
    description: "Identifies at-risk subscribers and triggers retention offers.",
    lastRun: "2h ago",
  },
  {
    id: "offer",
    agent_type: "offer",
    name_en: "Offer Agent",
    model: "claude-sonnet-4-6",
    is_enabled: true,
    config: null,
    description: "Generates personalized product offers based on customer profile.",
    lastRun: "45m ago",
  },
  {
    id: "cross_sell",
    agent_type: "cross_sell",
    name_en: "Cross-Sell Agent",
    model: "claude-3-haiku",
    is_enabled: false,
    config: null,
    description: "Recommends complementary products during consultation sessions.",
    lastRun: null,
  },
  {
    id: "ops_dashboard",
    agent_type: "ops_dashboard",
    name_en: "Ops Dashboard Agent",
    model: "claude-opus-4-6",
    is_enabled: true,
    config: null,
    description: "Aggregates operational metrics and generates daily reports.",
    lastRun: "6h ago",
  },
];

export default function AgentsPage() {
  const [agents, setAgents] = useState(MOCK_AGENTS);

  const handleToggle = (agentId: string, enabled: boolean) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === agentId ? { ...a, is_enabled: enabled } : a))
    );
  };

  const totalAgents = agents.length;
  const activeAgents = agents.filter((a) => a.is_enabled).length;
  const todayRuns = agents.filter((a) => a.lastRun !== null).length;

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
              <p className="text-2xl font-bold text-[#3b82f6]">{todayRuns}</p>
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
            description={agent.description}
            model={agent.model}
            isEnabled={agent.is_enabled}
            lastRun={agent.lastRun}
            onToggle={(enabled) => handleToggle(agent.id, enabled)}
          />
        ))}
      </div>
    </div>
  );
}
