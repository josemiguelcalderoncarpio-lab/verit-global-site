import { NextResponse } from "next/server";
export const runtime = "edge";
export async function GET(req: Request) {
  const url = new URL(req.url);
  const headers = new Headers(req.headers);
  const cookieHeader = headers.get("cookie") || "";
  const cookies: Record<string, string> = {};
  for (const pair of cookieHeader.split(/;\s*/).filter(Boolean)) {
    const [k, ...rest] = pair.split("=");
    if (!k) continue;
    cookies[k] = rest.join("=") ?? "";
  }
  const accessGranted = cookies["vg_access_granted"] === "1";
  const hasEmail = Boolean(cookies["vg_user_email"] || cookies["user_email"]);
  const killSwitch = process.env.NEXT_PUBLIC_DISABLE_AGREE === "1";
  const verdict = killSwitch || accessGranted || hasEmail ? "allow" : "block";
  return NextResponse.json({
    ok: true,
    verdict,
    killSwitch,
    cookiesSeen: {
      vg_access_granted: cookies["vg_access_granted"] ?? null,
      vg_user_email: cookies["vg_user_email"] ?? null,
      user_email: cookies["user_email"] ?? null,
    },
    request: {
      path: url.pathname + url.search,
      host: headers.get("host") || null,
      userAgent: headers.get("user-agent") || null,
    },
  });
}
