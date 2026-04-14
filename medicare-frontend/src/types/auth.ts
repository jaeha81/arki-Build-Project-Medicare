export interface AuthUser {
  id: string
  email: string
  fullName: string | null
  role: "customer" | "admin"
  createdAt: string
}

export interface AuthState {
  user: AuthUser | null
  /** @deprecated 토큰은 HttpOnly 쿠키에서 관리됩니다. 이 필드는 하위 호환성을 위해 유지됩니다. */
  accessToken: string | null
  isLoading: boolean
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  fullName: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user_id: string
  email: string
  full_name: string | null
}
