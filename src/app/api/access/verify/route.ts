// src/app/api/access/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
// (Optional) look up token hash and invalidate it here

export async function GET(req: NextRequest) {
  const email = (req.nextUrl.searchParams.get("e") || "").toLowerCase();
  if (!email) return NextResponse.redirect(new URL("/vgomini?verify_error=1", req.url));

  const token = jwt.sign({ email, features: ["exclusive"] }, process.env.JWT_SECRET!, { expiresIn: "7d" });

  const res = NextResponse.redirect(new URL("/exclusive", req.url)); // Exclusive hub
  res.cookies.set("vgo_auth", token, { httpOnly: true, sameSite: "lax", secure: true, path: "/" });
  return res;
}
