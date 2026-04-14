export interface AuthUser {
  id: string
  email: string
  fullName: string | null
  role: "customer" | "admin"
  createdAt: string
}

export interface AuthState {
  user: AuthUser | null
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
