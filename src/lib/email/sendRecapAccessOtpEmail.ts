import { Resend } from "resend";
import { escapeHtml } from "@/lib/email/escapeHtml";

export async function sendRecapAccessOtpEmail(
  email: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === "re_your_api_key_here") {
    return { success: false, error: "Email service is not configured." };
  }

  const recipient = escapeHtml(email);
  const resend = new Resend(apiKey);
  const from = process.env.RECAP_ACCESS_FROM_EMAIL || "Odyssey Partner Summit <partnersummit@botconsulting.io>";

  try {
    const result = await resend.emails.send({
      from,
      to: [email],
      subject: `${code} is your Odyssey 2026 recap access code`,
      text: `Your Odyssey 2026 recap access code is ${code}. It expires in 10 minutes. If you did not request access, you can ignore this email.`,
      html: `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#faf5ee;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#101d22;">
    <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="padding:30px 15px;background:#faf5ee;">
      <tr><td align="center">
        <table width="480" cellspacing="0" cellpadding="0" role="presentation" style="max-width:480px;width:100%;background:#fff;border:1px solid rgba(24,57,68,.14);">
          <tr><td style="padding:24px 30px;text-align:center;background:#183944;color:#42c3d6;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Odyssey 2026 · Partner Summit</td></tr>
          <tr><td style="padding:34px 30px;text-align:center;">
            <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#5c6b70;">Use this code to access the Odyssey 2026 recap.</p>
            <p style="margin:0;color:#f16522;font-family:monospace;font-size:34px;font-weight:700;letter-spacing:8px;">${code}</p>
            <p style="margin:20px 0 0;font-size:12px;line-height:1.6;color:#5c6b70;">This code expires in 10 minutes. It was requested for ${recipient}. If that was not you, you can ignore this email.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`,
    });

    if (result.error) {
      console.error("Recap access OTP dispatch failed:", result.error);
      return { success: false, error: "We could not send the code. Please try again shortly." };
    }

    return { success: true };
  } catch (error) {
    console.error("Recap access OTP dispatch failed:", error);
    return { success: false, error: "We could not send the code. Please try again shortly." };
  }
}
