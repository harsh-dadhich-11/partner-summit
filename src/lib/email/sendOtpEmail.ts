import { Resend } from "resend";

/**
 * Sends the 6-digit registration verification code.
 * Unlike the pass email, failures are returned to the caller so the UI can tell the user.
 */
export async function sendOtpEmail(email: string, code: string): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey === "re_your_api_key_here") {
    console.warn("RESEND_API_KEY is not configured. Cannot send OTP email.");
    return { success: false, error: "Email service is not configured." };
  }

  try {
    const resend = new Resend(apiKey);
    const fromAddress =
      process.env.RESEND_FROM_EMAIL || "Odyssey 2026 Summit <onboarding@resend.dev>";

    const emailPayload = {
      from: fromAddress,
      to: [email],
      subject: `${code} is your Odyssey 2026 verification code`,
      text: `Your Odyssey 2026 breakout registration code is ${code}. It expires in 10 minutes. If you didn't request this, you can ignore this email.`,
      html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background-color:#faf5ee;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#101d22;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#faf5ee;padding:30px 15px;">
    <tr>
      <td align="center">
        <table width="480" border="0" cellspacing="0" cellpadding="0" style="max-width:480px;width:100%;background-color:#ffffff;border:1px solid rgba(24,57,68,0.14);">
          <tr>
            <td style="background-color:#183944;padding:24px 30px;text-align:center;">
              <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#42c3d6;">
                Odyssey 2026 · Partner Summit
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 30px;text-align:center;">
              <p style="font-size:15px;line-height:1.6;color:#5c6b70;margin:0 0 20px 0;">
                Use this code to verify your email and continue your breakout session registration.
              </p>
              <p style="margin:0;font-family:monospace;font-size:34px;font-weight:700;letter-spacing:8px;color:#f16522;">
                ${code}
              </p>
              <p style="font-size:12px;color:#5c6b70;margin:20px 0 0 0;">
                This code expires in 10 minutes. If you didn't request it, you can ignore this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    };

    let sendResult = await resend.emails.send(emailPayload);

    // If custom domain is not yet verified on Resend, fallback to onboarding@resend.dev for testing
    if (sendResult.error && sendResult.error.message?.includes("not verified")) {
      console.warn("Domain not verified on Resend. Retrying OTP with onboarding@resend.dev.");
      sendResult = await resend.emails.send({
        ...emailPayload,
        from: "Odyssey 2026 Summit <onboarding@resend.dev>",
      });
    }

    if (sendResult.error) {
      console.error("Resend OTP dispatch error:", sendResult.error);
      return { success: false, error: sendResult.error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to send verification email";
    console.error("Failed to send OTP email:", err);
    return { success: false, error: message };
  }
}
