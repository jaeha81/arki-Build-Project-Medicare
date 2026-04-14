import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AgentConfiguration, AgentActionLog } from "@/types/agent";
import { apiClient } from "@/lib/api-client";

export function useAgents() {
  return useQuery({
    queryKey: ["agents"],
    queryFn: () => apiClient.get<AgentConfiguration[]>("/api/v1/agents"),
  });
}

export function useAgentLogs(agentId?: string) {
  return useQuery({
    queryKey: ["agent-logs", agentId ?? "all"],
    queryFn: () =>
      apiClient.get<AgentActionLog[]>(
        agentId ? `/api/v1/agents/${agentId}/logs` : "/api/v1/agents/logs"
      ),
  });
}

interface ToggleAgentPayload {
  agentId: string;
  isEnabled: boolean;
}

export function useToggleAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ agentId, isEnabled }: ToggleAgentPayload) =>
      apiClient.post<AgentConfiguration>(`/api/v1/agents/${agentId}/toggle`, {
        is_enabled: isEnabled,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["agents"] });
    },
  });
}
