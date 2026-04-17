import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ConsultationListItem {
  id: string;
  name: string;
  email: string;
  status: string;
  preferred_language: string;
  created_at: string;
}

export interface ApprovalListItem {
  id: string;
  agent_id: string;
  action: string;
  details: Record<string, unknown>;
  status: string;
  created_at: string;
}

export interface ProhibitedPhraseRead {
  id: string;
  phrase: string;
  pattern: string | null;
  severity: "critical" | "warning" | "info";
  category: string;
  suggestion: string | null;
  created_at: string;
}

export interface SubscriptionRecord {
  id: string;
  customer_id: string;
  vertical: string;
  plan: string;
  status: string;
  renewal_date: string | null;
}

export interface SubscriptionPage {
  items: SubscriptionRecord[];
  total: number;
  page: number;
  page_size: number;
}

export interface ProductRecord {
  id: string;
  vertical_id: string;
  slug: string;
  name_en: string;
  name_ja: string;
  base_price: number;
  currency: string;
  is_active: boolean;
  created_at: string;
}

export interface ProductPage {
  items: ProductRecord[];
  total: number;
  page: number;
  page_size: number;
}

export interface ProductPatch {
  name_en?: string;
  name_ja?: string;
  base_price?: number;
  is_active?: boolean;
}

export interface ReviewRecord {
  id: string;
  product_id: string;
  customer_name: string;
  rating: number;
  body: string | null;
  status: string;
  is_approved: boolean;
  is_flagged: boolean;
  created_at: string;
}

export interface ReviewPage {
  items: ReviewRecord[];
  total: number;
  page: number;
  page_size: number;
}

// ─── Consultations ─────────────────────────────────────────────────────────────

const CONSULTATION_PAGE_SIZE = 100;

export function useAdminConsultations(status?: string) {
  const params = new URLSearchParams({ skip: "0", limit: String(CONSULTATION_PAGE_SIZE) });
  if (status) params.set("status", status);

  return useQuery({
    queryKey: ["admin", "consultations", status ?? "all"],
    queryFn: () =>
      apiClient.get<ConsultationListItem[]>(
        `/api/v1/admin/consultations?${params.toString()}`
      ),
  });
}

export function useUpdateConsultationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiClient.patch<ConsultationListItem>(
        `/api/v1/admin/consultations/${id}/status`,
        { status }
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "consultations"] });
    },
    onError: (err) => {
      console.error("updateConsultationStatus error:", err);
    },
  });
}

// ─── Approvals ────────────────────────────────────────────────────────────────

export function useAdminApprovals(status?: string) {
  const params = new URLSearchParams({ skip: "0", limit: "50" });
  if (status) params.set("status", status);

  return useQuery({
    queryKey: ["admin", "approvals", status ?? "all"],
    queryFn: () =>
      apiClient.get<ApprovalListItem[]>(
        `/api/v1/admin/approvals?${params.toString()}`
      ),
  });
}

export function useProcessApproval() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      action,
      note,
    }: {
      id: string;
      action: "approve" | "reject";
      note?: string;
    }) =>
      apiClient.post<ApprovalListItem>(
        `/api/v1/admin/approvals/${id}/action`,
        { action, ...(note !== undefined ? { note } : {}) }
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "approvals"] });
    },
    onError: (err) => {
      console.error("processApproval error:", err);
    },
  });
}

// ─── Compliance ───────────────────────────────────────────────────────────────

export function useCompliancePhrases() {
  return useQuery({
    queryKey: ["admin", "compliance", "phrases"],
    queryFn: () =>
      apiClient.get<ProhibitedPhraseRead[]>("/api/v1/admin/compliance/phrases"),
  });
}

export function useDeleteCompliancePhrase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete<void>(`/api/v1/admin/compliance/phrases/${id}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["admin", "compliance", "phrases"],
      });
    },
    onError: (err) => {
      console.error("deleteCompliancePhrase error:", err);
    },
  });
}

// ─── Subscriptions ────────────────────────────────────────────────────────────

export function useAdminSubscriptions(page = 1) {
  return useQuery({
    queryKey: ["admin", "subscriptions", page],
    queryFn: () =>
      apiClient.get<SubscriptionPage>(
        `/api/v1/admin/subscriptions?page=${page}&page_size=20`
      ),
  });
}

export function usePatchSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiClient.patch<SubscriptionRecord>(
        `/api/v1/admin/subscriptions/${id}`,
        { status }
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "subscriptions"] });
    },
    onError: (err) => {
      console.error("patchSubscription error:", err);
    },
  });
}

// ─── Products ─────────────────────────────────────────────────────────────────

export function useAdminProducts(page = 1) {
  return useQuery({
    queryKey: ["admin", "products", page],
    queryFn: () =>
      apiClient.get<ProductPage>(
        `/api/v1/admin/products?page=${page}&page_size=20`
      ),
  });
}

export function usePatchProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: ProductPatch }) =>
      apiClient.patch<ProductRecord>(`/api/v1/admin/products/${id}`, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
    onError: (err) => {
      console.error("patchProduct error:", err);
    },
  });
}

export function useSoftDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete<ProductRecord>(`/api/v1/admin/products/${id}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
    onError: (err) => {
      console.error("softDeleteProduct error:", err);
    },
  });
}

// ─── Reviews ─────────────────────────────────────────────────────────────────

export function useAdminReviews(page = 1, status?: string) {
  const params = new URLSearchParams({ page: String(page), page_size: "20" });
  if (status) params.set("status", status);

  return useQuery({
    queryKey: ["admin", "reviews", page, status ?? "all"],
    queryFn: () =>
      apiClient.get<ReviewPage>(
        `/api/v1/admin/reviews?${params.toString()}`
      ),
  });
}

export function usePatchReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "pending" | "approved" | "rejected";
    }) =>
      apiClient.patch<ReviewRecord>(`/api/v1/admin/reviews/${id}`, { status }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
    },
    onError: (err) => {
      console.error("patchReview error:", err);
    },
  });
}
