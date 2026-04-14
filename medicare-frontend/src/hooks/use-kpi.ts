import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type {
  AgentActivitySummary,
  KpiSnapshotOut,
  TrendPoint,
  VerticalDistribution,
} from "@/types/kpi";

export function useKpiSnapshot() {
  return useQuery({
    queryKey: ["kpi", "snapshot"],
    queryFn: () =>
      apiClient.get<KpiSnapshotOut>("/api/v1/admin/kpi/snapshot"),
    refetchInterval: 30_000,
  });
}

export function useConsultationTrend(days = 30) {
  return useQuery({
    queryKey: ["kpi", "trend", days],
    queryFn: () =>
      apiClient.get<TrendPoint[]>(`/api/v1/admin/kpi/trend?days=${days}`),
    refetchInterval: 60_000,
  });
}

export function useVerticalDistribution() {
  return useQuery({
    queryKey: ["kpi", "verticals"],
    queryFn: () =>
      apiClient.get<VerticalDistribution[]>("/api/v1/admin/kpi/verticals"),
    refetchInterval: 60_000,
  });
}

export function useAgentActivity() {
  return useQuery({
    queryKey: ["kpi", "agents"],
    queryFn: () =>
      apiClient.get<AgentActivitySummary[]>("/api/v1/admin/kpi/agents"),
    refetchInterval: 30_000,
  });
}
