import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

interface BackendAuthResponse {
  access_token: string
  token_type: string
  user_id: string
  email: string
  full_name: string | null
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Record<string, unknown>

  const res = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Login failed" })) as { message?: string }
    return NextResponse.json(error, { status: res.status })
  }

  const data = (await res.json()) as BackendAuthResponse

  const response = NextResponse.json({
    user_id: data.user_id,
    email: data.email,
    full_name: data.full_name,
  })

  const isProduction = process.env.NODE_ENV === "production"
  response.cookies.set("medicare_auth", data.access_token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    path: "/",
    maxAge: 86400,
  })

  return response
}
