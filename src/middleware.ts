// src/middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname, search, origin } = req.nextUrl;

  // Kill-switch: bypass gate entirely
  const killSwitch = process.env.NEXT_PUBLIC_DISABLE_AGREE === "1";
  if (killSwitch) return NextResponse.next();

  // Only guard downloads
  const needsGate = pathname.startsWith("/exclusive/downloads/");
  if (!needsGate) return NextResponse.next();

  // Cookie checks
  const c = req.cookies;
  const accessGranted = c.get("vg_access_granted")?.value === "1";
  const hasEmail = Boolean(c.get("vg_user_email")?.value || c.get("user_email")?.value);

  // Fire-and-forget telemetry (don’t await)
  const track = (verdict: "allow" | "block") => {
    fetch(`${origin}/api/gate/track`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        verdict,
        path: pathname + (search || ""),
        killSwitch: false,
      }),
    }).catch(() => {});
  };

  if (accessGranted || hasEmail) {
    track("allow");
    return NextResponse.next();
  }

  const returnTo = pathname + (search || "");
  const agreeUrl = new URL("/agree", req.url);
  agreeUrl.searchParams.set("return", returnTo);
  agreeUrl.searchParams.set("need", "business");

  track("block");
  return NextResponse.redirect(agreeUrl, { status: 307 });
}

export const config = {
  matcher: ["/exclusive/downloads/:path*"],
};
