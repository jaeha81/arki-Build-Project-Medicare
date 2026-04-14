import { NextRequest, NextResponse } from "next/server";

// Dev-only stub — wire to FastAPI + Supabase Auth in production
export async function POST(request: NextRequest) {
  const body = (await request.json()) as { email: string; password: string };

  const adminEmail = process.env.ADMIN_DEV_EMAIL ?? "admin@medicare.dev";
  const adminPassword = process.env.ADMIN_DEV_PASSWORD ?? "admin1234";

  if (body.email === adminEmail && body.password === adminPassword) {
    const token = process.env.ADMIN_DEV_TOKEN ?? "dev-admin-token-placeholder";
    const isProd = process.env.NODE_ENV === "production";

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      path: "/admin",
      maxAge: 60 * 60 * 8, // 8 hours
    });
    return response;
  }

  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}
