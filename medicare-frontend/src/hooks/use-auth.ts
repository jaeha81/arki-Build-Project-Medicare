"use client"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import { useAuthStore } from "@/stores/auth-store"
import type { LoginRequest, RegisterRequest, AuthResponse, AuthUser } from "@/types/auth"

export function useLogin(locale: string = "en") {
  const router = useRouter()
  const { setAuth, setLoading } = useAuthStore()

  return useMutation({
    mutationFn: (data: LoginRequest) =>
      apiClient.post<AuthResponse>("/api/v1/auth/login", data),
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      const user: AuthUser = {
        id: data.user_id,
        email: data.email,
        fullName: data.full_name,
        role: "customer",
        createdAt: new Date().toISOString(),
      }
      setAuth(user, data.access_token)
      // Sync token to cookie for middleware
      document.cookie = `medicare_auth=${data.access_token}; path=/; max-age=86400; samesite=strict`
      router.push(`/${locale}/dashboard`)
    },
    onSettled: () => setLoading(false),
  })
}

export function useRegister(locale: string = "en") {
  const router = useRouter()
  const { setAuth, setLoading } = useAuthStore()

  return useMutation({
    mutationFn: (data: RegisterRequest) =>
      apiClient.post<AuthResponse>("/api/v1/auth/register", {
        email: data.email,
        password: data.password,
        full_name: data.fullName,
      }),
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      const user: AuthUser = {
        id: data.user_id,
        email: data.email,
        fullName: data.full_name,
        role: "customer",
        createdAt: new Date().toISOString(),
      }
      setAuth(user, data.access_token)
      document.cookie = `medicare_auth=${data.access_token}; path=/; max-age=86400; samesite=strict`
      router.push(`/${locale}/dashboard`)
    },
    onSettled: () => setLoading(false),
  })
}

export function useLogout(locale: string = "en") {
  const router = useRouter()
  const { clearAuth } = useAuthStore()

  return () => {
    clearAuth()
    document.cookie = "medicare_auth=; path=/; max-age=0"
    router.push(`/${locale}/auth/login`)
  }
}

export function useMe() {
  const { accessToken } = useAuthStore()

  return useQuery({
    queryKey: ["me", accessToken],
    queryFn: () => apiClient.authGet<AuthUser>("/api/v1/auth/me", accessToken!),
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
  })
}
