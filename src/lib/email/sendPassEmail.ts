import { Resend } from "resend";
import QRCode from "qrcode";

interface SendPassEmailParams {
  attendeeName: string;
  attendeeEmail: string;
  registrationId: string;
  selections: {
    slot1?: { theatreName: string; title: string; slotTime?: string };
    slot2?: { theatreName: string; title: string; slotTime?: string };
    slot3?: { theatreName: string; title: string; slotTime?: string };
  };
}

/**
 * Sends a confirmation email to the attendee with their itinerary and an embedded scannable QR Code.
 */
export async function sendPassEmail({
  attendeeName,
  attendeeEmail,
  registrationId,
  selections,
}: SendPassEmailParams) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey === "re_your_api_key_here") {
    console.warn("RESEND_API_KEY is not configured in environment. Skipping email dispatch.");
    return { success: false, skipped: true, message: "Resend API key not configured." };
  }

  try {
    const resend = new Resend(apiKey);
    const fromAddress =
      process.env.RESEND_FROM_EMAIL || "Odyssey 2026 Summit <onboarding@resend.dev>";

    // Generate QR Code Buffer (PNG) for inline CID attachment
    const qrPayload = JSON.stringify({
      type: "ODYSSEY_PASS",
      regId: registrationId,
      name: attendeeName,
      email: attendeeEmail,
    });

    const qrBuffer = await QRCode.toBuffer(qrPayload, {
      width: 240,
      margin: 2,
      color: {
        dark: "#183944",
        light: "#ffffff",
      },
    });

    const slot1Theatre = selections.slot1?.theatreName || "Sakura · Theatre 1";
    const slot1Title = selections.slot1?.title || "Breakout Session 1";
    const slot2Theatre = selections.slot2?.theatreName || "Sakura · Theatre 2";
    const slot2Title = selections.slot2?.title || "Breakout Session 2";
    const slot3Theatre = selections.slot3?.theatreName || "Sakura · Theatre 3";
    const slot3Title = selections.slot3?.title || "Breakout Session 3";

    // 1. Generate RFC 5545 .ics Calendar Invite with 3 distinct session slot events
    const nowIso = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//BOT Consulting//Odyssey 2026 Summit//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:REQUEST",

      // Slot 1: 15:00 – 15:40 IST (09:30 – 10:10 UTC)
      "BEGIN:VEVENT",
      `UID:odyssey-slot1-${registrationId}@botconsulting.io`,
      `DTSTAMP:${nowIso}`,
      `DTSTART:20261023T093000Z`,
      `DTEND:20261023T101000Z`,
      `SUMMARY:Slot 1: ${slot1Title} (${slot1Theatre})`,
      `DESCRIPTION:Odyssey 2026 Partner Summit — Breakout Slot 1\\nSession: ${slot1Title}\\nVenue / Room: ${slot1Theatre}\\nRegistration ID: ${registrationId}\\nAttendee: ${attendeeName} (${attendeeEmail})\\n\\nPlease arrive 5 minutes early with your QR pass.`,
      `LOCATION:${slot1Theatre}\\, Ananta Spa & Resort\\, Jaipur\\, Rajasthan\\, India`,
      "STATUS:CONFIRMED",
      `ORGANIZER;CN="BOT Consulting Partner Summit":mailto:partnersummit@botconsulting.io`,
      `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN=${attendeeName}:mailto:${attendeeEmail}`,
      "BEGIN:VALARM",
      "TRIGGER:-PT10M",
      "ACTION:DISPLAY",
      `DESCRIPTION:Reminder: Slot 1 starts in 10 minutes at ${slot1Theatre}`,
      "END:VALARM",
      "END:VEVENT",

      // Slot 2: 15:40 – 16:20 IST (10:10 – 10:50 UTC)
      "BEGIN:VEVENT",
      `UID:odyssey-slot2-${registrationId}@botconsulting.io`,
      `DTSTAMP:${nowIso}`,
      `DTSTART:20261023T101000Z`,
      `DTEND:20261023T105000Z`,
      `SUMMARY:Slot 2: ${slot2Title} (${slot2Theatre})`,
      `DESCRIPTION:Odyssey 2026 Partner Summit — Breakout Slot 2\\nSession: ${slot2Title}\\nVenue / Room: ${slot2Theatre}\\nRegistration ID: ${registrationId}\\nAttendee: ${attendeeName} (${attendeeEmail})\\n\\nPlease arrive 5 minutes early with your QR pass.`,
      `LOCATION:${slot2Theatre}\\, Ananta Spa & Resort\\, Jaipur\\, Rajasthan\\, India`,
      "STATUS:CONFIRMED",
      `ORGANIZER;CN="BOT Consulting Partner Summit":mailto:partnersummit@botconsulting.io`,
      `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN=${attendeeName}:mailto:${attendeeEmail}`,
      "BEGIN:VALARM",
      "TRIGGER:-PT10M",
      "ACTION:DISPLAY",
      `DESCRIPTION:Reminder: Slot 2 starts in 10 minutes at ${slot2Theatre}`,
      "END:VALARM",
      "END:VEVENT",

      // Slot 3: 16:20 – 17:00 IST (10:50 – 11:30 UTC)
      "BEGIN:VEVENT",
      `UID:odyssey-slot3-${registrationId}@botconsulting.io`,
      `DTSTAMP:${nowIso}`,
      `DTSTART:20261023T105000Z`,
      `DTEND:20261023T113000Z`,
      `SUMMARY:Slot 3: ${slot3Title} (${slot3Theatre})`,
      `DESCRIPTION:Odyssey 2026 Partner Summit — Breakout Slot 3\\nSession: ${slot3Title}\\nVenue / Room: ${slot3Theatre}\\nRegistration ID: ${registrationId}\\nAttendee: ${attendeeName} (${attendeeEmail})\\n\\nPlease arrive 5 minutes early with your QR pass.`,
      `LOCATION:${slot3Theatre}\\, Ananta Spa & Resort\\, Jaipur\\, Rajasthan\\, India`,
      "STATUS:CONFIRMED",
      `ORGANIZER;CN="BOT Consulting Partner Summit":mailto:partnersummit@botconsulting.io`,
      `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN=${attendeeName}:mailto:${attendeeEmail}`,
      "BEGIN:VALARM",
      "TRIGGER:-PT10M",
      "ACTION:DISPLAY",
      `DESCRIPTION:Reminder: Slot 3 starts in 10 minutes at ${slot3Theatre}`,
      "END:VALARM",
      "END:VEVENT",

      "END:VCALENDAR",
    ].join("\r\n");

    const icsBuffer = Buffer.from(icsContent, "utf-8");

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Odyssey 2026 Breakout Pass</title>
</head>
<body style="margin:0;padding:0;background-color:#faf5ee;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#101d22;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#faf5ee;padding:30px 15px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background-color:#ffffff;border:1px solid rgba(24,57,68,0.14);">
          
          <!-- Header -->
          <tr>
            <td style="background-color:#183944;padding:32px 30px;text-align:center;">
              <p style="margin:0 0 6px 0;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#42c3d6;">
                Odyssey 2026 · Partner Summit
              </p>
              <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;">
                Your Breakout Session Pass
              </h1>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding:32px 30px;">
              <p style="font-size:16px;line-height:1.5;margin:0 0 16px 0;">
                Hello <strong>${attendeeName}</strong>,
              </p>
              <p style="font-size:15px;line-height:1.6;color:#5c6b70;margin:0 0 24px 0;">
                Your breakout session registration for Day 1 of the Partner Summit is confirmed. Please keep this pass and QR code accessible on your phone when arriving at each theatre. A calendar invite is also attached to this email.
              </p>

              <!-- Pass Badge Card -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#faf5ee;border:2px solid #2a8a8a;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px;border-bottom:1px solid rgba(24,57,68,0.14);">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td>
                          <p style="margin:0;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#5c6b70;">
                            Registration ID
                          </p>
                          <p style="margin:4px 0 0 0;font-family:monospace;font-size:20px;font-weight:700;color:#f16522;">
                            ${registrationId}
                          </p>
                        </td>
                        <td align="right">
                          <p style="margin:0;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#5c6b70;">
                            Attendee
                          </p>
                          <p style="margin:4px 0 0 0;font-size:13px;font-weight:600;color:#101d22;">
                            ${attendeeEmail}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Itinerary Sessions -->
                <tr>
                  <td style="padding:20px;">
                    <p style="margin:0 0 12px 0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#183944;">
                      Your Day 1 Schedule &bull; Oct 23, 2026
                    </p>

                    <!-- Slot 1 -->
                    <div style="background-color:#ffffff;border:1px solid rgba(24,57,68,0.1);padding:12px;margin-bottom:10px;">
                      <div style="font-size:13px;font-weight:700;color:#101d22;margin-bottom:4px;">
                        <span>15:00 – 15:40</span> &bull; <span style="color:#215052;">${slot1Theatre}</span>
                      </div>
                      <div style="font-size:12px;color:#5c6b70;">${slot1Title}</div>
                    </div>

                    <!-- Slot 2 -->
                    <div style="background-color:#ffffff;border:1px solid rgba(24,57,68,0.1);padding:12px;margin-bottom:10px;">
                      <div style="font-size:13px;font-weight:700;color:#101d22;margin-bottom:4px;">
                        <span>15:40 – 16:20</span> &bull; <span style="color:#215052;">${slot2Theatre}</span>
                      </div>
                      <div style="font-size:12px;color:#5c6b70;">${slot2Title}</div>
                    </div>

                    <!-- Slot 3 -->
                    <div style="background-color:#ffffff;border:1px solid rgba(24,57,68,0.1);padding:12px;">
                      <div style="font-size:13px;font-weight:700;color:#101d22;margin-bottom:4px;">
                        <span>16:20 – 17:00</span> &bull; <span style="color:#215052;">${slot3Theatre}</span>
                      </div>
                      <div style="font-size:12px;color:#5c6b70;">${slot3Title}</div>
                    </div>
                  </td>
                </tr>

                <!-- QR Code Section -->
                <tr>
                  <td align="center" style="background-color:#ffffff;padding:24px 20px;border-top:1px dashed rgba(24,57,68,0.2);">
                    <p style="margin:0 0 12px 0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#5c6b70;">
                      Volunteer Check-In QR Pass
                    </p>
                    <img src="cid:summit_pass_qr" width="180" height="180" alt="Summit Pass QR Code" style="display:block;border:1px solid rgba(24,57,68,0.14);" />
                    <p style="margin:12px 0 0 0;font-size:12px;color:#5c6b70;max-width:320px;line-height:1.4;">
                      Show this QR code at the door of each theatre for instant one-tap check-in.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Footer note -->
              <p style="font-size:12px;color:#5c6b70;line-height:1.5;margin:0;">
                Need to view your pass later? You can look it up at any time by visiting the <a href="https://summit.botconsulting.io/sessions" style="color:#2a8a8a;text-decoration:none;font-weight:600;">Summit Sessions Page</a> and clicking <strong>Find My Pass</strong>.
              </p>
            </td>
          </tr>

          <!-- Email Footer -->
          <tr>
            <td style="background-color:#f5efe6;padding:20px 30px;text-align:center;border-top:1px solid rgba(24,57,68,0.1);">
              <p style="margin:0;font-size:11px;color:#5c6b70;">
                BOT Consulting &bull; Odyssey 2026 Partner Summit
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const emailPayload = {
      from: fromAddress,
      to: [attendeeEmail],
      subject: `Your Breakout Pass [${registrationId}] — Odyssey 2026 Summit`,
      html: emailHtml,
      attachments: [
        {
          filename: "summit-pass-qr.png",
          content: qrBuffer,
          contentType: "image/png",
          contentId: "summit_pass_qr",
        },
        {
          filename: "odyssey-2026-breakout-pass.ics",
          content: icsBuffer,
          contentType: "text/calendar; charset=utf-8; method=REQUEST",
        },
      ],
    };

    let sendResult = await resend.emails.send(emailPayload);

    // If custom domain is not yet verified on Resend, fallback to onboarding@resend.dev for testing
    if (sendResult.error && sendResult.error.message?.includes("not verified")) {
      console.warn("Domain not verified on Resend. Retrying with onboarding@resend.dev for development.");
      sendResult = await resend.emails.send({
        ...emailPayload,
        from: "Odyssey 2026 Summit <onboarding@resend.dev>",
      });
    }

    if (sendResult.error) {
      console.error("Resend email dispatch error:", sendResult.error);
      return { success: false, error: sendResult.error.message };
    }

    return { success: true, data: sendResult.data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to dispatch email";
    console.error("Failed to send pass email:", err);
    return { success: false, error: message };
  }
}
