import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // Kill-switch: bypass gate entirely
  if (process.env.NEXT_PUBLIC_DISABLE_AGREE === "1") {
    // telemetry beacon (allow + killswitch)
    try {
      fetch(`${req.nextUrl.origin}/api/gate/track?verdict=allow&path=${encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search)}&killSwitch=true`, { method: "POST", keepalive: true });
    } catch {}
    return NextResponse.next();
  }

  const { pathname, search } = req.nextUrl;
  const needsGate = pathname.startsWith("/exclusive/downloads/");
  if (!needsGate) return NextResponse.next();

  const c = req.cookies;
  const accessGranted = c.get("vg_access_granted")?.value === "1";
  const hasEmail = Boolean(c.get("vg_user_email")?.value || c.get("user_email")?.value);

  if (accessGranted || hasEmail) {
    // telemetry beacon (allow)
    try {
      fetch(`${req.nextUrl.origin}/api/gate/track?verdict=allow&path=${encodeURIComponent(pathname + (search || ""))}&killSwitch=false`, { method: "POST", keepalive: true });
    } catch {}
    return NextResponse.next();
  }

  // telemetry beacon (block)
  try {
    fetch(`${req.nextUrl.origin}/api/gate/track?verdict=block&path=${encodeURIComponent(pathname + (search || ""))}&killSwitch=false`, { method: "POST", keepalive: true });
  } catch {}

  const returnTo = pathname + (search || "");
  const agreeUrl = new URL("/agree", req.url);
  agreeUrl.searchParams.set("return", returnTo);
  agreeUrl.searchParams.set("need", "business");
  return NextResponse.redirect(agreeUrl, { status: 307 });
}

export const config = {
  matcher: ["/exclusive/downloads/:path*"],
};
