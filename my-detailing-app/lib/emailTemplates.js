// Inline-styled HTML templates for Resend. Email clients strip <style>
// blocks and don't reliably support modern CSS, so everything here uses
// table layout and inline styles rather than Tailwind classes.

export function verificationEmailHtml({ customerName, serviceName, dateLabel, timeLabel, verifyUrl }) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background-color:#0B0B0B;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0B0B0B;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:480px;background-color:#171717;border:1px solid #2A2A2A;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background-color:#DC2626;padding:20px 24px;">
                <span style="color:#FFFFFF;font-size:14px;font-weight:bold;letter-spacing:0.08em;text-transform:uppercase;">
                  Don's Professional Car Detailing
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 24px;">
                <h1 style="margin:0 0 16px;color:#FFFFFF;font-size:22px;">Confirm Your Appointment</h1>
                <p style="margin:0 0 16px;color:#B3B3B3;font-size:15px;line-height:1.6;">
                  Hi ${customerName}, thanks for booking with Don's Professional Car Detailing. Here are your requested details:
                </p>
                <table role="presentation" width="100%" style="margin:0 0 24px;border-collapse:collapse;">
                  <tr>
                    <td style="padding:6px 0;color:#B3B3B3;font-size:14px;">Service</td>
                    <td style="padding:6px 0;color:#FFFFFF;font-size:14px;text-align:right;font-weight:bold;">${serviceName}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#B3B3B3;font-size:14px;">Date</td>
                    <td style="padding:6px 0;color:#FFFFFF;font-size:14px;text-align:right;font-weight:bold;">${dateLabel}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#B3B3B3;font-size:14px;">Time</td>
                    <td style="padding:6px 0;color:#FFFFFF;font-size:14px;text-align:right;font-weight:bold;">${timeLabel}</td>
                  </tr>
                </table>
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
                  <tr>
                    <td style="border-radius:8px;background-color:#DC2626;">
                      <a href="${verifyUrl}" style="display:inline-block;padding:14px 28px;color:#FFFFFF;font-size:16px;font-weight:bold;text-decoration:none;">
                        Confirm My Appointment
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin:0;color:#EF4444;font-size:14px;font-weight:bold;line-height:1.6;">
                  You must click this link within 2 hours to secure your booking, or your request will automatically expire.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 24px;border-top:1px solid #2A2A2A;">
                <p style="margin:0;color:#6b6b6b;font-size:12px;">
                  If you didn't request this appointment, you can safely ignore this email.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
