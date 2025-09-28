// src/app/api/magic-link/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "edge";

// ---------- small helpers ----------
async function sha256Hex(input: string) {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function randomToken(bytes = 24) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// base64url for Edge-runtime (no Buffer)
function toBase64Url(json: string) {
  const latin1 = unescape(encodeURIComponent(json));
  return btoa(latin1).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function withCors(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Headers", "content-type, x-requested-with");
  res.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.headers.set("Access-Control-Max-Age", "86400");
  return res;
}

export async function OPTIONS() {
  return withCors(NextResponse.json({ ok: true }));
}

// ---------- outbound email (Resend) ----------
async function sendEmail({
  to,
  subject,
  text,
  html,
  replyTo,
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || "Verit <no-reply@veritglobal.com>";

  if (!apiKey) {
    return { ok: false, reason: "missing_api_key" as const };
  }

  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text,
      html,
      reply_to: replyTo || process.env.RESEND_REPLY_TO || "support@veritglobal.com",
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text().catch(() => "");
    console.error("[magic-link] Resend error:", resp.status, errText);
    return { ok: false, reason: "resend_error" as const, status: resp.status, body: errText };
  }

  return { ok: true as const };
}

/**
 * POST /api/magic-link
 * body: { email: string, go?: string }
 * - ensures a person + primary email exists for this address (creates if new)
 * - creates a magic link row
 * - sends email via Resend if RESEND_API_KEY is present
 *   - in dev, the subject is prefixed with "[DEV TEST]"
 * - otherwise returns a preview payload
 */
export async function POST(req: NextRequest) {
  try {
    let data: unknown;
    try {
      data = await req.json();
    } catch {
      return withCors(NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 }));
    }

    const obj = (data ?? {}) as Record<string, unknown>;
    const email = String(obj.email ?? "").trim().toLowerCase();
    const go = String(obj.go ?? "/contact");

    if (!/.+@.+\..+/.test(email)) {
      return withCors(NextResponse.json({ ok: false, error: "invalid_email" }, { status: 422 }));
    }

    // ensure person exists for this email (create if new)
    const existing = await sql`
      SELECT p.person_id, pe.verified_at
      FROM verit.person_email pe
      JOIN verit.person p ON p.person_id = pe.person_id
      WHERE pe.email = ${email}
      LIMIT 1
    `;

    let personId: string;

    if (existing.length > 0) {
      personId = existing[0].person_id as string;
    } else {
      const created = await sql`
        WITH new_person AS (
          INSERT INTO verit.person (full_name) VALUES (NULL)
          RETURNING person_id
        ),
        new_email AS (
          INSERT INTO verit.person_email (person_id, email, is_primary)
          SELECT person_id, ${email}, TRUE FROM new_person
          RETURNING person_id
        )
        SELECT person_id FROM new_email
      `;
      personId = created[0].person_id as string;
    }

    // insert magic link
    const token = randomToken(24);
    const tokenHash = await sha256Hex(token);
    const expiresAtIso = new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(); // 48h

    await sql`
      INSERT INTO verit.magic_link
        (token_hash, person_id, email, context, redirect_to, sent_via, created_at, expires_at)
      VALUES
        (${tokenHash}, ${personId}, ${email}, 'email_verify', ${go}, 'email', NOW(), ${expiresAtIso})
      ON CONFLICT (token_hash) DO NOTHING
    `;

    const base = process.env.NEXT_PUBLIC_BASE_URL ?? req.nextUrl.origin ?? "http://localhost:3000";
    const link = `${base}/api/magic-link?t=${token}&go=${encodeURIComponent(go)}`;

    // Build the message
    const baseSubject = "Verify your email to access Verit downloads";
    const subject =
      process.env.NODE_ENV !== "production" ? `[DEV TEST] ${baseSubject}` : baseSubject;

    const text = [
      "Hi,",
      "",
      "Please confirm your email to access the materials:",
      link,
      "",
      "If you didn’t request this, you can ignore this email.",
      "",
      "— Verit",
    ].join("\n");

    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;">
        <p>Hi,</p>
        <p>Please confirm your email to access the materials:</p>
        <p>
          <a href="${link}" style="display:inline-block;padding:10px 14px;border-radius:8px;border:1px solid #ccc;text-decoration:none;">
            ✅ Click here to verify
          </a>
        </p>
        <p style="margin-top:16px;color:#666">Or paste this link in your browser:<br/>
          <span style="font-family:monospace">${link}</span>
        </p>
        <p>If you didn’t request this, you can ignore this email.</p>
        <p>— Verit</p>
      </div>
    `.trim();

    // Send if we have a key; otherwise return preview
    const didSend = process.env.RESEND_API_KEY
      ? await sendEmail({ to: email, subject, text, html })
      : { ok: false as const, reason: "missing_api_key" as const };

    if (didSend.ok) {
      return withCors(NextResponse.json({ ok: true, sent: true }));
    }

    // No key? Return a preview (useful in local dev)
    console.log("[magic-link] RESEND_API_KEY missing → returning preview only.");
    return withCors(
      NextResponse.json({ ok: true, sent: false, preview: { to: email, subject, text, html } })
    );
  } catch (err) {
    console.error("[/api/magic-link POST] error:", err);
    return withCors(NextResponse.json({ ok: false, error: "internal_error" }, { status: 500 }));
  }
}

/**
 * GET /api/magic-link?t=...&go=...
 * - verifies the email (sets person_email.verified_at)
 * - consumes the token
 * - sets an HttpOnly cookie (verit_auth)
 * - redirects to ?go=... (or stored redirect_to), default /contact
 */
export async function GET(req: NextRequest) {
  try {
    const t = req.nextUrl.searchParams.get("t") || "";
    const go = req.nextUrl.searchParams.get("go") || "/contact";
    if (!t) return withCors(NextResponse.json({ ok: false, error: "missing_token" }, { status: 400 }));

    const tokenHash = await sha256Hex(t);
    const rows = await sql`
      SELECT token_hash, person_id, email, redirect_to, expires_at, consumed_at
      FROM verit.magic_link
      WHERE token_hash = ${tokenHash}
      LIMIT 1
    `;
    if (rows.length === 0) {
      return withCors(NextResponse.json({ ok: false, error: "invalid_token" }, { status: 400 }));
    }

    const ml = rows[0] as {
      token_hash: string;
      person_id: string;
      email: string;
      redirect_to: string | null;
      expires_at: string;
      consumed_at: string | null;
    };

    if (ml.consumed_at) return withCors(NextResponse.json({ ok: false, error: "already_used" }, { status: 410 }));
    if (new Date(ml.expires_at).getTime() < Date.now()) {
      return withCors(NextResponse.json({ ok: false, error: "expired" }, { status: 410 }));
    }

    // mark verified + consume
    await sql`
      UPDATE verit.person_email
      SET verified_at = NOW()
      WHERE person_id = ${ml.person_id} AND email = ${ml.email}
    `;
    await sql`UPDATE verit.magic_link SET consumed_at = NOW() WHERE token_hash = ${tokenHash}`;

    // set HttpOnly auth cookie
    const isProd = process.env.NODE_ENV === "production";
    const payload = toBase64Url(JSON.stringify({ email: ml.email, pid: ml.person_id }));
    const cookie = [
      `verit_auth=${payload}`,
      "Path=/",
      "HttpOnly",
      "SameSite=Lax",
      `Max-Age=${60 * 60 * 24 * 90}`,
      isProd ? "Secure" : "",
    ]
      .filter(Boolean)
      .join("; ");

    const dest = ml.redirect_to ?? go ?? "/contact";
    const res = NextResponse.redirect(dest, { status: 302 });
    res.headers.set("Set-Cookie", cookie);
    return res;
  } catch (err) {
    console.error("[/api/magic-link GET] error:", err);
    return withCors(NextResponse.json({ ok: false, error: "internal_error" }, { status: 500 }));
  }
}
