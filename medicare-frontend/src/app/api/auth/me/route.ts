import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

export async function GET(request: NextRequest) {
  const token = request.cookies.get("medicare_auth")?.value
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const res = await fetch(`${BACKEND_URL}/api/v1/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) {
    const response = NextResponse.json({ error: "Invalid session" }, { status: 401 })
    response.cookies.delete("medicare_auth")
    return response
  }

  return NextResponse.json(await res.json())
}
