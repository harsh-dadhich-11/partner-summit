import { NextResponse } from "next/server";
import { RECAP_ACCESS_COOKIE } from "@/lib/recapAccess";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({ name: RECAP_ACCESS_COOKIE, value: "", httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 0, path: "/", sameSite: "lax" });
  return response;
}
