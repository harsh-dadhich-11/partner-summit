import { NextRequest, NextResponse } from "next/server";
import { RECAP_ACCESS_COOKIE, verifyRecapAccessToken } from "@/lib/recapAccess";

const PROTECTED_PREFIXES = [
  "/recap",
  "/highlights",
  "/insights",
  "/gallery",
  "/resources/session-summaries",
] as const;

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export async function middleware(request: NextRequest) {
  if (!isProtectedPath(request.nextUrl.pathname)) return NextResponse.next();

  const session = await verifyRecapAccessToken(request.cookies.get(RECAP_ACCESS_COOKIE)?.value);
  if (session) return NextResponse.next();

  const accessUrl = new URL("/access", request.url);
  accessUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  const response = NextResponse.redirect(accessUrl);
  response.cookies.set({ name: RECAP_ACCESS_COOKIE, value: "", httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 0, path: "/", sameSite: "lax" });
  return response;
}

export const config = {
  matcher: [
    "/recap/:path*",
    "/highlights/:path*",
    "/insights/:path*",
    "/gallery/:path*",
    "/resources/session-summaries/:path*",
  ],
};
