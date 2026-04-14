import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AuthUser, AuthState } from "@/types/auth"

interface AuthActions {
  setAuth: (user: AuthUser, token: string) => void
  clearAuth: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      // 토큰은 HttpOnly 쿠키에서 관리. 이 필드는 하위 호환성을 위해 유지하되 항상 null
      accessToken: null,
      isLoading: false,
      setAuth: (user) => set({ user, accessToken: null }),
      clearAuth: () => set({ user: null, accessToken: null }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "medicare-auth",
      // accessToken은 localStorage에 저장하지 않음 (HttpOnly 쿠키로 이동)
      partialize: (state) => ({ user: state.user }),
    }
  )
)
