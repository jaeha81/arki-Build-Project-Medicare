import { type NextRequest, NextResponse } from "next/server"

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

// LINE redirects here after OAuth: /api/auth/line/callback?code=...&state=<locale>
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const state = searchParams.get("state") ?? "en"

  if (!code) {
    return NextResponse.redirect(`${APP_URL}/${state}/auth/login?error=line_no_code`)
  }

  // Forward to the main line route handler with code
  const handlerUrl = new URL(`${APP_URL}/api/auth/line`)
  handlerUrl.searchParams.set("code", code)
  handlerUrl.searchParams.set("state", state)
  return NextResponse.redirect(handlerUrl.toString())
}
