// src/app/api/survey/route.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";

/* ------------------------ tiny guards ------------------------ */
const isRecord = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);
const isString = (v: unknown): v is string => typeof v === "string";
const isBoolean = (v: unknown): v is boolean => typeof v === "boolean";
const isValidEmail = (s: string | undefined): s is string =>
  !!s && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

/* ------------------------ payload shapes --------------------- */
type ConsentPayload = {
  type?: "consent";
  name?: string;
  email?: string;
  role?: string;
  company?: string;
  purpose?: string;
  agreed?: boolean;
  at?: string;              // ISO string from client
  needBusiness?: boolean;
  asset?: string;           // e.g. /downloads/foo.pdf
  [k: string]: unknown;     // forward-compatible
};

type GenericSurveyPayload = {
  type?: string;            // e.g. "feedback"
  email?: string;
  [k: string]: unknown;
};

type SurveyPayload = ConsentPayload | GenericSurveyPayload;

/* ------------------------ JWT helper ------------------------ */
function signAccessJWT(
  payload: { email: string; features: string[]; expSeconds?: number },
  secret: string
): string {
  const exp = Math.floor(Date.now() / 1000) + (payload.expSeconds ?? 60 * 60 * 24 * 30); // 30d
  const { email, features } = payload;
  return jwt.sign({ email, features, exp }, secret);
}

/* ------------------------ CORS helpers ---------------------- */
const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
};

/* ------------------------ ROUTES ---------------------------- */
export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  return NextResponse.json({ ok: true, hint: "POST JSON to this endpoint" }, { headers: CORS_HEADERS });
}

export async function POST(req: Request) {
  const ct = (req.headers.get("content-type") || "").toLowerCase();
  if (!ct.includes("application/json")) {
    return NextResponse.json(
      { ok: false, error: "unsupported_media_type" },
      { status: 415, headers: CORS_HEADERS }
    );
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400, headers: CORS_HEADERS }
    );
  }
  if (!isRecord(raw)) {
    return NextResponse.json(
      { ok: false, error: "invalid_body" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const data = raw as SurveyPayload;
  const type = isString(data.type) ? data.type : "unknown";
  const email = isString(data.email) ? data.email.trim().toLowerCase() : undefined;
  const agreed = isBoolean((data as ConsentPayload).agreed) ? (data as ConsentPayload).agreed === true : false;

  // Optional webhook forward (best-effort)
  const hook = process.env.SURVEY_WEBHOOK_URL;
  if (hook) {
    try {
      await fetch(hook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...data,
          _meta: {
            receivedAt: new Date().toISOString(),
            ua: req.headers.get("user-agent") ?? undefined,
            // Don’t attempt to type req.ip — not available in App Router Request
            fwd: req.headers.get("x-forwarded-for") ?? undefined,
          },
        }),
      });
    } catch {
      // ignore telemetry errors
    }
  }

  // Base response
  const res = NextResponse.json({ ok: true, type, email }, { headers: CORS_HEADERS });

  // Unlock access when this is a valid consent
  if (type === "consent" && isValidEmail(email) && agreed) {
    const secret = process.env.JWT_SECRET || "";
    if (secret) {
      const token = signAccessJWT({ email, features: ["exclusive"] }, secret);
      // Set both cookies used across the app (server checks one or the other)
      const cookieOpts = {
        httpOnly: true,
        secure: true,
        sameSite: "lax" as const,
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30d
      };
      res.cookies.set("vgo_auth", token, cookieOpts);
      res.cookies.set("verit_auth", "1", cookieOpts); // simple flag for UI checks that look for this
    }
  }

  return res;
}
