// src/app/api/access/check/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

type FeaturePayload = JwtPayload & {
  features?: unknown;
};

export async function GET(req: NextRequest) {
  const token = req.cookies.get("vgo_auth")?.value;
  if (!token) {
    return NextResponse.json({ granted: false });
  }

  const want = req.nextUrl.searchParams.get("f") ?? "exclusive";
  const secret = process.env.JWT_SECRET ?? "";

  try {
    const verified = jwt.verify(token, secret) as string | FeaturePayload;

    // If the token was a string payload, it won't carry features
    const featuresUnknown: unknown =
      typeof verified === "string" ? undefined : verified.features;

    const granted =
      Array.isArray(featuresUnknown) &&
      featuresUnknown.some((f) => typeof f === "string" && f === want);

    return NextResponse.json({ granted });
  } catch {
    // Invalid token, bad signature, or missing secret
    return NextResponse.json({ granted: false });
  }
}
