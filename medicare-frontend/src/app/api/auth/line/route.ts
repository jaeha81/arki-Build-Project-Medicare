import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
const LINE_CHANNEL_ID = process.env.LINE_CHANNEL_ID ?? ""
const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET ?? ""
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

interface LineTokenResponse {
  access_token: string
  id_token?: string
  token_type: string
}

interface LineProfileResponse {
  userId: string
  displayName: string
  pictureUrl?: string
  email?: string
}

interface BackendAuthResponse {
  access_token: string
  user_id: string
  email: string
  full_name: string | null
}

// GET /api/auth/line?locale=en  — redirect to LINE OAuth
// GET /api/auth/line/callback?code=...&state=...  — handled via ?callback=1
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const locale = searchParams.get("locale") ?? "en"
  const code = searchParams.get("code")
  const state = searchParams.get("state")

  // Step 1: redirect to LINE login
  if (!code) {
    const redirectUri = `${APP_URL}/api/auth/line/callback`
    const lineAuthUrl = new URL("https://access.line.me/oauth2/v2.1/authorize")
    lineAuthUrl.searchParams.set("response_type", "code")
    lineAuthUrl.searchParams.set("client_id", LINE_CHANNEL_ID)
    lineAuthUrl.searchParams.set("redirect_uri", redirectUri)
    lineAuthUrl.searchParams.set("state", locale)
    lineAuthUrl.searchParams.set("scope", "profile openid email")
    return NextResponse.redirect(lineAuthUrl.toString())
  }

  // Step 2: exchange code for token (called from /callback route below)
  const callbackLocale = state ?? "en"
  return handleCallback(code, callbackLocale)
}

async function handleCallback(code: string, locale: string): Promise<NextResponse> {
  const redirectUri = `${APP_URL}/api/auth/line/callback`

  // Exchange code → LINE access token
  const tokenRes = await fetch("https://api.line.me/oauth2/v2.1/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: LINE_CHANNEL_ID,
      client_secret: LINE_CHANNEL_SECRET,
    }),
  })

  if (!tokenRes.ok) {
    return NextResponse.redirect(`${APP_URL}/${locale}/auth/login?error=line_token_failed`)
  }

  const tokenData = (await tokenRes.json()) as LineTokenResponse

  // Fetch LINE profile
  const profileRes = await fetch("https://api.line.me/v2/profile", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  })

  if (!profileRes.ok) {
    return NextResponse.redirect(`${APP_URL}/${locale}/auth/login?error=line_profile_failed`)
  }

  const profile = (await profileRes.json()) as LineProfileResponse

  // Exchange LINE user info → backend JWT
  const backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/line`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      line_user_id: profile.userId,
      display_name: profile.displayName,
      picture_url: profile.pictureUrl,
      email: profile.email,
    }),
  })

  if (!backendRes.ok) {
    return NextResponse.redirect(`${APP_URL}/${locale}/auth/login?error=line_auth_failed`)
  }

  const authData = (await backendRes.json()) as BackendAuthResponse

  const response = NextResponse.redirect(`${APP_URL}/${locale}/dashboard`)
  const isProduction = process.env.NODE_ENV === "production"
  response.cookies.set("medicare_auth", authData.access_token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    path: "/",
    maxAge: 86400,
  })

  return response
}
