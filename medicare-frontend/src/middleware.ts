import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin route protection
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("admin_token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    // JWT validation happens in admin layout / API layer
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/",
    "/(en|ja)/:path*",
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
