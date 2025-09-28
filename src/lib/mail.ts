// src/lib/mail.ts
type Mail = { to: string; subject: string; html: string; text?: string };

export async function sendMail(msg: Mail) {
  const isProd = process.env.NODE_ENV === "production";

  if (!isProd) {
    // Dev: just log the email so you can click the link
    console.log("\n[DEV MAIL] to:", msg.to);
    console.log("subject:", msg.subject);
    console.log("---- text/html ----\n", msg.text ?? msg.html, "\n--------------\n");
    return { ok: true };
  }

  // TODO: plug your SMTP provider here (e.g., Resend/Nodemailer/SES)
  // Example (pseudo):
  // await transporter.sendMail({ from: "no-reply@yourdomain", ...msg });

  console.warn("[sendMail] Production mail not configured yet.");
  return { ok: false, error: "mail_not_configured" };
}
