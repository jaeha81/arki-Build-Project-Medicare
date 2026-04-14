import { NextRequest, NextResponse } from "next/server";

// Dev-only stub — wire to FastAPI + Supabase Auth in production
export async function POST(request: NextRequest) {
  const body = (await request.json()) as { email: string; password: string };

  const adminEmail = process.env.ADMIN_DEV_EMAIL ?? "admin@medicare.dev";
  const adminPassword = process.env.ADMIN_DEV_PASSWORD ?? "admin1234";

  if (body.email === adminEmail && body.password === adminPassword) {
    return NextResponse.json({ token: "dev-admin-token-placeholder" });
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
