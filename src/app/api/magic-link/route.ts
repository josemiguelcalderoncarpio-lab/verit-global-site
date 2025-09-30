// src/app/api/magic-link/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { ClientSecretCredential } from "@azure/identity";

/* ------------------------------ types ------------------------------ */
type RowPersonId = { person_id: string };
type RowMagicLink = { email: string; redirect_to: string | null; expires_at: string | null };
type PostBody = { email?: unknown; redirect_to?: unknown; send_email?: unknown };

/* ------------------------------ utils ------------------------------ */

function withCors(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}

async function sha256Hex(input: string) {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function randomToken(bytes = 24) {
  const a = new Uint8Array(bytes);
  crypto.getRandomValues(a);
  return Array.from(a, (b) => b.toString(16).padStart(2, "0")).join("");
}

function normalizeEmail(raw?: string | null): string | null {
  if (!raw) return null;
  const v = raw.trim();
  if (!v) return null;
  try {
    const dec = decodeURIComponent(v);
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dec) ? dec.toLowerCase() : null;
  } catch {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? v.toLowerCase() : null;
  }
}

function pickString(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v : undefined;
}
function pickBool(v: unknown): boolean {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") {
    const s = v.toLowerCase();
    return s === "1" || s === "true" || s === "yes";
  }
  return false;
}

/* -------------------- ensure schema / tables (Neon-safe) -------------------- */
/** IMPORTANT: One statement per call (Neon disallows multi-statement prepared queries). */
async function ensureTables() {
  await sql/* sql */`create schema if not exists verit`;

  await sql/* sql */`
    create table if not exists verit.person (
      person_id bigserial primary key
    )
  `;

  await sql/* sql */`
    create table if not exists verit.person_email (
      email text primary key,
      person_id bigint not null references verit.person(person_id)
    )
  `;

  await sql/* sql */`
    create index if not exists person_email_lower_idx
      on verit.person_email (lower(email))
  `;

  await sql/* sql */`
    create table if not exists verit.magic_link (
      token_hash text primary key,
      person_id bigint not null references verit.person(person_id),
      email text not null,
      redirect_to text,
      created_at timestamptz not null default now(),
      expires_at timestamptz,
      consumed_at timestamptz
    )
  `;
}

/* ------------------------ person resolution ------------------------ */

async function getOrCreatePersonId(email: string): Promise<string> {
  const rows1 = (await sql/* sql */`
    SELECT person_id FROM verit.person_email WHERE lower(email) = lower(${email}) LIMIT 1
  `) as RowPersonId[];
  if (rows1.length && rows1[0].person_id) return rows1[0].person_id;

  const created = (await sql/* sql */`
    INSERT INTO verit.person DEFAULT VALUES RETURNING person_id
  `) as RowPersonId[];
  const personId = created[0].person_id;

  try {
    await sql/* sql */`
      INSERT INTO verit.person_email (email, person_id)
      VALUES (${email}, ${personId})
      ON CONFLICT (email) DO NOTHING
    `;
  } catch {
    const again = (await sql/* sql */`
      SELECT person_id FROM verit.person_email WHERE lower(email) = lower(${email}) LIMIT 1
    `) as RowPersonId[];
    if (again.length && again[0].person_id) return again[0].person_id;
  }
  return personId;
}

/* ----------------------------- providers --------------------------- */
/**
 * M365 via SMTP:
 * - Prefers OAuth2 token (Client Credentials) if tenant/client/secret present.
 * - Falls back to basic SMTP auth using M365_SMTP_PASSWORD if provided.
 * Notes:
 * - Host: smtp.office365.com, Port: 587, STARTTLS.
 */
async function sendMagicLinkM365(to: string, link: string) {
  const tenantId = process.env.M365_TENANT_ID?.trim();
  const clientId = process.env.M365_CLIENT_ID?.trim();
  const clientSecret = process.env.M365_CLIENT_SECRET?.trim();
  const smtpUser = (process.env.M365_USER || "jose@veritglobal.com").trim(); // authenticated principal
  const fromAddress = (process.env.M365_FROM || "no-reply@veritglobal.com").trim(); // visible From
  const smtpPassword = process.env.M365_SMTP_PASSWORD?.trim(); // optional basic auth
  const debug = process.env.EMAIL_DEBUG === "1";

  const html = `
    <div style="font-family:system-ui,Segoe UI,Arial">
      <h2>Your secure access link</h2>
      <p><a href="${link}" style="display:inline-block;background:#111;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none">Continue</a></p>
      <p>If the button doesn’t work, copy this URL:</p>
      <p style="word-break:break-all"><a href="${link}">${link}</a></p>
    </div>
  `;

  // Build transport options
  const baseOpts: SMTPTransport.Options = {
    host: "smtp.office365.com",
    port: 587,
    secure: false, // STARTTLS
    tls: { minVersion: "TLSv1.2" },
    logger: debug,
  };

  let transportOpts: SMTPTransport.Options;

  if (tenantId && clientId && clientSecret) {
    // OAuth2 (XOAUTH2) using app-only token for SMTP AUTH
    const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
    const token = await credential.getToken("https://outlook.office365.com/.default");
    if (!token?.token) throw new Error("Failed to obtain SMTP OAuth2 token");
    transportOpts = {
      ...baseOpts,
      auth: { type: "OAuth2", user: smtpUser, accessToken: token.token },
    };
  } else if (smtpPassword) {
    // Basic auth (requires SMTP AUTH enabled on the mailbox)
    transportOpts = {
      ...baseOpts,
      auth: { user: smtpUser, pass: smtpPassword },
    };
  } else {
    throw new Error("No SMTP auth configured: provide Tenant/Client/Secret or M365_SMTP_PASSWORD");
  }

  const transporter = nodemailer.createTransport(transportOpts);

  await transporter.sendMail({
    from: `Verit Global <${fromAddress}>`,
    to,
    subject: "Your secure access link",
    text: `Your secure link:\n\n${link}\n`,
    html,
  });
}

/* -------------------- (COMMENTED) Graph sendMail for later ------------------- */
/*
async function sendMagicLinkGraph(to: string, link: string) {
  const tenantId = process.env.M365_TENANT_ID!;
  const clientId = process.env.M365_CLIENT_ID!;
  const clientSecret = process.env.M365_CLIENT_SECRET!;
  const fromAddress = process.env.M365_FROM || "no-reply@veritglobal.com";
  const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
  const graphToken = await credential.getToken("https://graph.microsoft.com/.default");
  if (!graphToken?.token) throw new Error("Failed to get Graph token");

  const html = `... same as above ...`;
  const message = {
    message: {
      subject: "Your secure access link",
      body: { contentType: "HTML", content: html },
      toRecipients: [{ emailAddress: { address: to } }],
      from: { emailAddress: { address: fromAddress } },
      replyTo: [{ emailAddress: { address: fromAddress } }],
      sender: { emailAddress: { address: fromAddress } },
    },
    saveToSentItems: false,
  };

  const resp = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(fromAddress)}/sendMail`, {
    method: "POST",
    headers: { Authorization: `Bearer ${graphToken.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });
  if (!resp.ok) throw new Error(`Graph sendMail failed (${resp.status}): ${await resp.text()}`);
}
*/

async function sendMagicLinkResend(to: string, link: string) {
  const apiKey = process.env.RESEND_API_KEY!;
  const from = process.env.RESEND_FROM || "Verit Global <onboarding@resend.dev>";
  if (!apiKey) throw new Error("RESEND_API_KEY missing");

  const html = `
    <div style="font-family:system-ui,Segoe UI,Arial">
      <h2>Your secure access link</h2>
      <p><a href="${link}" style="display:inline-block;background:#111;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none">Continue</a></p>
      <p>If the button doesn’t work, copy this URL:</p>
      <p style="word-break:break-all"><a href="${link}">${link}</a></p>
    </div>
  `;
  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject: "Your secure access link", html, text: `Your secure link:\n\n${link}\n` }),
  });
  if (!resp.ok) throw new Error(`Resend ${resp.status}: ${await resp.text()}`);
}

/* -------------------------------- POST ----------------------------- */

export async function POST(req: NextRequest) {
  try {
    await ensureTables();

    // parse body (json or form)
    const ct = (req.headers.get("content-type") || "").toLowerCase();
    let body: PostBody = {};
    if (ct.includes("application/json")) body = (await req.json()) as PostBody;
    else if (ct.includes("application/x-www-form-urlencoded")) {
      body = Object.fromEntries(new URLSearchParams(await req.text())) as Record<string, unknown>;
    }

    const email = normalizeEmail(pickString(body.email) ?? null);
    if (!email) return withCors(NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 }));

    const redirect_to = (() => {
      const v = pickString(body.redirect_to);
      return v && v.trim() ? v.trim() : undefined;
    })();

    const shouldSend = body.send_email === undefined ? true : pickBool(body.send_email);

    // Ensure we have a person and a person_email row
    const personId = await getOrCreatePersonId(email);

    // Create token row
    const token = randomToken(24);
    const tokenHash = await sha256Hex(token);
    await sql/* sql */`
      INSERT INTO verit.magic_link (person_id, email, token_hash, redirect_to, expires_at)
      VALUES (${personId}, ${email}, ${tokenHash}, ${redirect_to ?? null}, now() + interval '1 day')
    `;

    // Build origin (prefer PUBLIC_ORIGIN)
    const base = new URL(req.url);
    const computedOrigin = `${base.protocol}//${base.host}`;
    const origin = (process.env.PUBLIC_ORIGIN?.trim() || computedOrigin).replace(/\/+$/, "");

    const link = `${origin}/api/magic-link?token=${encodeURIComponent(token)}${
      redirect_to ? `&go=${encodeURIComponent(redirect_to)}` : ""
    }`;

    if (shouldSend) {
      try {
        const provider = (process.env.EMAIL_PROVIDER || "M365").toUpperCase();
        if (provider === "M365") {
          await sendMagicLinkM365(email, link);
          // await sendMagicLinkGraph(email, link); // (commented) switch back later if desired
        } else if (provider === "RESEND") {
          await sendMagicLinkResend(email, link);
        } else {
          throw new Error(`Unknown EMAIL_PROVIDER: ${provider}`);
        }
      } catch (err: unknown) {
        console.error("[magic-link] send failed]:", err);
        const msg = err instanceof Error ? err.message : String(err);
        if (process.env.EMAIL_DEBUG === "1") {
          return withCors(NextResponse.json({ ok: false, error: "send_failed", details: msg }, { status: 502 }));
        }
        return withCors(NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 }));
      }
    }

    return withCors(NextResponse.json({ ok: true, email, link, sent: !!shouldSend }));
  } catch (err) {
    console.error("[/api/magic-link POST] error:", err);
    return withCors(NextResponse.json({ ok: false, error: "internal_error" }, { status: 500 }));
  }
}

/* -------------------------------- GET ------------------------------ */

export async function GET(req: NextRequest) {
  try {
    await ensureTables();

    const url = new URL(req.url);
    const token = url.searchParams.get("token") || "";
    const go = url.searchParams.get("go") || undefined;
    if (!token) return withCors(NextResponse.json({ ok: false, error: "missing_token" }, { status: 400 }));

    const tokenHash = await sha256Hex(token);

    const rows = (await sql/* sql */`
      SELECT email, redirect_to, expires_at
      FROM verit.magic_link
      WHERE token_hash = ${tokenHash}
      LIMIT 1
    `) as RowMagicLink[];
    const row = rows[0];
    if (!row) return withCors(NextResponse.json({ ok: false, error: "invalid_token" }, { status: 400 }));

    if (row.expires_at && new Date(row.expires_at).getTime() < Date.now()) {
      return withCors(NextResponse.json({ ok: false, error: "token_expired" }, { status: 400 }));
    }

    // mark consumed; ignore if column missing
    try {
      await sql/* sql */`UPDATE verit.magic_link SET consumed_at = now() WHERE token_hash = ${tokenHash}`;
    } catch {}

    const email: string = row.email;

    // Destination (relative or absolute) -> make absolute for redirect
    const dest = row.redirect_to ?? go ?? "/contact";
    const base = new URL(req.url);
    const origin = `${base.protocol}//${base.host}`;
    const redirectUrl = /^https?:\/\//i.test(dest) ? dest : `${origin}${dest.startsWith("/") ? "" : "/"}${dest}`;

    const res = NextResponse.redirect(redirectUrl, { status: 302 });

    // Cookies (host + apex)
    const isProd = (process.env.VERCEL_ENV || process.env.NODE_ENV) === "production";
    const common = {
      path: "/",
      sameSite: "lax" as const,
      secure: isProd,
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 365,
    };

    const host = base.host; // e.g., www.veritglobal.com
    const apexDomain = host.endsWith(".veritglobal.com") ? ".veritglobal.com" : undefined;

    const setAll = (name: string, value: string) => {
      res.cookies.set(name, value, common);
      if (apexDomain) res.cookies.set(name, value, { ...common, domain: apexDomain });
    };

    setAll("vg_user_email", email);
    setAll("user_email", email); // legacy
    setAll("vg_access_granted", "1");

    return withCors(res);
  } catch (err) {
    console.error("[/api/magic-link GET] error:", err);
    return withCors(NextResponse.json({ ok: false, error: "internal_error" }, { status: 500 }));
  }
}
