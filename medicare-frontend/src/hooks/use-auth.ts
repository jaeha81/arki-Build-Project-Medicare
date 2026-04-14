"use client"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth-store"
import type { LoginRequest, RegisterRequest, AuthUser } from "@/types/auth"

interface LoginApiResponse {
  user_id: string
  email: string
  full_name: string | null
}

export function useLogin(locale: string = "en") {
  const router = useRouter()
  const { setAuth, setLoading } = useAuthStore()

  return useMutation({
    mutationFn: async (data: LoginRequest): Promise<LoginApiResponse> => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Login failed" })) as { message?: string }
        throw new Error(err.message ?? "Login failed")
      }
      return res.json() as Promise<LoginApiResponse>
    },
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      const user: AuthUser = {
        id: data.user_id,
        email: data.email,
        fullName: data.full_name,
        role: "customer",
        createdAt: new Date().toISOString(),
      }
      // 토큰은 HttpOnly 쿠키에 저장되므로 클라이언트에 저장하지 않음
      setAuth(user, "")
      router.push(`/${locale}/dashboard`)
    },
    onSettled: () => setLoading(false),
  })
}

export function useRegister(locale: string = "en") {
  const router = useRouter()
  const { setAuth, setLoading } = useAuthStore()

  return useMutation({
    mutationFn: async (data: RegisterRequest): Promise<LoginApiResponse> => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          full_name: data.fullName,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Registration failed" })) as { message?: string }
        throw new Error(err.message ?? "Registration failed")
      }
      return res.json() as Promise<LoginApiResponse>
    },
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      const user: AuthUser = {
        id: data.user_id,
        email: data.email,
        fullName: data.full_name,
        role: "customer",
        createdAt: new Date().toISOString(),
      }
      // 토큰은 HttpOnly 쿠키에 저장되므로 클라이언트에 저장하지 않음
      setAuth(user, "")
      router.push(`/${locale}/dashboard`)
    },
    onSettled: () => setLoading(false),
  })
}

export function useLogout(locale: string = "en") {
  const router = useRouter()
  const { clearAuth } = useAuthStore()

  return async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    clearAuth()
    router.push(`/${locale}/auth/login`)
  }
}

export function useMe() {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: ["me"],
    queryFn: async (): Promise<AuthUser> => {
      const res = await fetch("/api/auth/me")
      if (!res.ok) {
        throw new Error("Session invalid")
      }
      return res.json() as Promise<AuthUser>
    },
    // 토큰 대신 user 여부로 활성화 여부 판단
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  })
}
