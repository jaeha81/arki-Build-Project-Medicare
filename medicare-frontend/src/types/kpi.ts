export interface KpiSnapshotOut {
  total_consultations: number;
  pending_consultations: number;
  active_subscriptions: number;
  pending_approvals: number;
  total_reviews: number;
  avg_compliance_score: number;
  conversion_rate: number;
  churn_risk_count: number;
  generated_at: string;
}

export interface TrendPoint {
  date: string;
  count: number;
}

export interface VerticalDistribution {
  vertical: string;
  count: number;
  percentage: number;
}

export interface AgentActivitySummary {
  agent_id: string;
  runs_today: number;
  success_rate: number;
}
