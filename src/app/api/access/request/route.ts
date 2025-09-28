// src/app/api/access/request/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
// If your tsconfig has `paths: { "@/*": ["src/*"] }`:
import { isCorporateDomain } from "@/lib/isCorporateDomain";
// Otherwise, use a relative path like:
// import { isCorporateDomain } from "../../../../lib/isCorporateDomain";

const Schema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  company: z.string().optional(),
  role: z.string().optional(),
  use_case: z.string().max(1000).optional(),
  consent: z.string().optional()
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const email = parsed.data.email.toLowerCase();

  // single-use token (store hash in DB if you want a ledger)
  const token = crypto.randomBytes(32).toString("hex");
  // const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const origin = process.env.NEXT_PUBLIC_APP_ORIGIN || req.nextUrl.origin;
  const verifyUrl = new URL(`${origin}/api/access/verify`);
  verifyUrl.searchParams.set("t", token);
  verifyUrl.searchParams.set("e", email);

  // BIG auto-approve: any non-free domain
  const autoapprove = isCorporateDomain(email);

  // TODO: persist request + tokenHash if desired
  // TODO: send email with verifyUrl (Resend/SendGrid/etc.)

  return NextResponse.json({ ok: true, autoapprove });
}
