import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

async function proxyRequest(request: NextRequest, path: string[]): Promise<NextResponse> {
  const token = request.cookies.get("medicare_auth")?.value
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const backendPath = `/api/v1/${path.join("/")}`
  const url = new URL(backendPath, BACKEND_URL)
  // 쿼리 파라미터 전달
  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value)
  })

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }

  const init: RequestInit = {
    method: request.method,
    headers,
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    const body = await request.text()
    if (body) {
      init.body = body
    }
  }

  const res = await fetch(url.toString(), init)

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText })) as { message?: string }
    if (res.status === 401) {
      const response = NextResponse.json(error, { status: 401 })
      response.cookies.delete("medicare_auth")
      return response
    }
    return NextResponse.json(error, { status: res.status })
  }

  return NextResponse.json(await res.json())
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  return proxyRequest(request, path)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  return proxyRequest(request, path)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  return proxyRequest(request, path)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  return proxyRequest(request, path)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  return proxyRequest(request, path)
}
