import { NextRequest, NextResponse, after } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { BOTCONSULTING_EMAIL_REGEX } from "@/lib/validators";
import { normalizeEmail } from "@/lib/otp";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { sendPassEmail } from "@/lib/email/sendPassEmail";

export const dynamic = "force-dynamic";

const GENERIC_MESSAGE = "If this email is registered, your pass has been sent to it.";

interface SessionSummary {
  theatre_name: string;
  title: string;
  slot_time: string;
}

/**
 * POST /api/registration/resend
 * Lost-ID recovery: re-sends the pass email to the registered inbox.
 * Nothing is shown on screen and the response is identical whether or not the email
 * is registered, so this can't be used to discover or view someone else's pass.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = normalizeEmail(body.email);

    if (!BOTCONSULTING_EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, error: "Enter your @botconsulting.io work email." },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ success: false, error: "Database not configured." }, { status: 503 });
    }

    const [emailAllowed, ipAllowed] = await Promise.all([
      checkRateLimit(`pass-resend:email:${email}`, 3, 3600),
      checkRateLimit(`pass-resend:ip:${getClientIp(req)}`, 10, 3600),
    ]);
    if (!emailAllowed || !ipAllowed) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const { data: registration } = await supabaseAdmin
      .from("registrations")
      .select(`
        registration_id,
        attendee_name,
        attendee_email,
        slot_1:sessions!registrations_slot_1_session_id_fkey(theatre_name, title, slot_time),
        slot_2:sessions!registrations_slot_2_session_id_fkey(theatre_name, title, slot_time),
        slot_3:sessions!registrations_slot_3_session_id_fkey(theatre_name, title, slot_time)
      `)
      .eq("attendee_email", email)
      .maybeSingle();

    if (registration) {
      const toSelection = (val: unknown) => {
        const session = (Array.isArray(val) ? val[0] : val) as SessionSummary | null;
        return session
          ? { theatreName: session.theatre_name, title: session.title, slotTime: session.slot_time }
          : undefined;
      };

      // Sent after the response so registered and unregistered emails respond equally fast
      after(async () => {
        const emailResult = await sendPassEmail({
          attendeeName: registration.attendee_name,
          attendeeEmail: registration.attendee_email,
          registrationId: registration.registration_id,
          selections: {
            slot1: toSelection(registration.slot_1),
            slot2: toSelection(registration.slot_2),
            slot3: toSelection(registration.slot_3),
          },
        });
        if (!emailResult.success) {
          console.warn("Pass resend email warning:", emailResult);
        }
      });
    }

    return NextResponse.json({ success: true, message: GENERIC_MESSAGE });
  } catch (err: unknown) {
    console.error("Unhandled error in /api/registration/resend:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
