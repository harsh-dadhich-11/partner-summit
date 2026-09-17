import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/**
 * POST /api/volunteer/auth
 * Authenticates an on-site volunteer via their work email and 4-digit PIN access code.
 * Returns their profile and assigned theatre ('theatre-1', 'theatre-2', 'theatre-3', or 'all').
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, accessCode } = body;

    if (!email || !accessCode) {
      return NextResponse.json(
        { success: false, error: "Email and access PIN are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const cleanCode = String(accessCode).trim();

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: "Database not configured." },
        { status: 503 }
      );
    }

    // Query volunteers table
    const { data: volunteer, error } = await supabaseAdmin
      .from("volunteers")
      .select("id, name, email, assigned_theatre_id, is_active, access_code")
      .eq("email", normalizedEmail)
      .eq("access_code", cleanCode)
      .eq("is_active", true)
      .maybeSingle();

    if (error) {
      console.error("Error authenticating volunteer:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    if (!volunteer) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or access PIN. Please check your credentials.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Welcome, ${volunteer.name}!`,
      volunteer: {
        id: volunteer.id,
        name: volunteer.name,
        email: volunteer.email,
        assignedTheatreId: volunteer.assigned_theatre_id,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("Unhandled error in volunteer auth:", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
