// src/app/api/dev/reset-all/route.ts
import { NextResponse } from "next/server";

type ResetPayload = {
  /** When true, perform an extra-aggressive reset (hook for future server-side state). */
  hard?: boolean;
  // Allow unknown extras without using `any`
  [k: string]: unknown;
};

export const runtime = "nodejs";

/**
 * Dev helper: clear auth/session cookies so local state is effectively "logged out".
 * Accepts JSON body: { hard?: boolean }
 */
export async function POST(req: Request) {
  let payload: ResetPayload | null = null;
  try {
    payload = (await req.json()) as ResetPayload;
  } catch {
    // no body or invalid JSON is fine — treat as a soft reset
    payload = null;
  }

  const hard = payload?.hard === true;

  // Build a response FIRST so we can attach Set-Cookie headers to it
  const res = NextResponse.json({
    ok: true,
    hard,
    cleared: [
      "verit_auth",
      "vgo_auth",
      // add any other server cookies here as needed:
      "vgomini_session",
      "vgomini_flags",
    ],
  });

  // Expire known cookies (adjust names to match your project)
  // NOTE: client-only storage (localStorage/sessionStorage) cannot be cleared from server.
  const expire = new Date(0);
  const cookieOptions = { expires: expire, path: "/" } as const;

  res.cookies.set("verit_auth", "", cookieOptions);
  res.cookies.set("vgo_auth", "", cookieOptions);
  res.cookies.set("vgomini_session", "", cookieOptions);
  res.cookies.set("vgomini_flags", "", cookieOptions);

  // If you later keep any server-side caches/DB flags for dev, clear them when `hard` is true
  // e.g. await myCache.reset(); (left intentionally as a no-op)

  return res;
}

/** Optional: GET as a convenience (e.g., curl without a body) */
export async function GET() {
  const res = NextResponse.json({
    ok: true,
    note: "Use POST with { hard: true } for an aggressive reset.",
  });

  const expire = new Date(0);
  const cookieOptions = { expires: expire, path: "/" } as const;
  res.cookies.set("verit_auth", "", cookieOptions);
  res.cookies.set("vgo_auth", "", cookieOptions);
  res.cookies.set("vgomini_session", "", cookieOptions);
  res.cookies.set("vgomini_flags", "", cookieOptions);

  return res;
}
