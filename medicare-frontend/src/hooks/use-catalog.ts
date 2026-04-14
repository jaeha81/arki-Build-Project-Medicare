import { useQuery } from "@tanstack/react-query";
import type { Vertical, Product, FAQ } from "@/types";
import { apiClient } from "@/lib/api-client";

export function useVerticals() {
  return useQuery({
    queryKey: ["verticals"],
    queryFn: () => apiClient.get<Vertical[]>("/api/v1/verticals"),
  });
}

export function useVertical(slug: string) {
  return useQuery({
    queryKey: ["verticals", slug],
    queryFn: () => apiClient.get<Vertical>(`/api/v1/verticals/${slug}`),
    enabled: !!slug,
  });
}

export function useVerticalProducts(verticalSlug: string) {
  return useQuery({
    queryKey: ["verticals", verticalSlug, "products"],
    queryFn: () => apiClient.get<Product[]>(`/api/v1/verticals/${verticalSlug}/products`),
    enabled: !!verticalSlug,
  });
}

export function useFaqs(verticalSlug?: string) {
  return useQuery({
    queryKey: ["faqs", verticalSlug ?? "all"],
    queryFn: () =>
      apiClient.get<FAQ[]>(verticalSlug ? `/api/v1/faq?vertical=${verticalSlug}` : "/api/v1/faq"),
  });
}
