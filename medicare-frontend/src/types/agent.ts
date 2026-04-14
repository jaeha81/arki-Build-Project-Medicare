export type AgentType =
  | "intake"
  | "compliance_gate"
  | "review_cs"
  | "retention"
  | "offer"
  | "cross_sell"
  | "ops_dashboard";

export interface AgentConfiguration {
  id: string;
  agent_type: AgentType;
  name_en: string;
  model: string;
  is_enabled: boolean;
  config: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
}

/** Alias used by hooks and API responses */
export type AgentConfig = AgentConfiguration;

export interface AgentActionLog {
  id: number;
  agent_id: string;
  action: string;
  status: "pending" | "executing" | "completed" | "failed";
  result: Record<string, unknown> | null;
  error: string | null;
  created_at: string;
}
