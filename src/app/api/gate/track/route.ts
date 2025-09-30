import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";

function getClient() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("Missing DATABASE_URL");
  return neon(url);
}

async function ensureTable(sql: ReturnType<typeof neon>) {
  // Create schema/table if not present. Uses BIGSERIAL to avoid extensions.
  await sql/* sql */`
    create schema if not exists verit;
    create table if not exists verit.gate_event (
      id bigserial primary key,
      ts timestamptz not null default now(),
      verdict text not null check (verdict in ('allow','block')),
      path text not null,
      kill_switch boolean not null default false,
      ip text,
      user_agent text
    );
    create index if not exists gate_event_ts_idx on verit.gate_event (ts desc);
    create index if not exists gate_event_verdict_ts_idx on verit.gate_event (verdict, ts desc);
  `;
}

export async function POST(req: Request) {
  try {
    const sql = getClient();
    await ensureTable(sql);

    // Accept either JSON body or query params for easy beacons
    let verdict = "";
    let path = "";
    let killSwitch = false;

    const url = new URL(req.url);
    const ctype = req.headers.get("content-type") || "";
    if (ctype.includes("application/json")) {
      const body = await req.json().catch(() => ({} as any));
      verdict = String(body?.verdict || "").toLowerCase();
      path = String(body?.path || url.searchParams.get("path") || "");
      killSwitch = String(body?.killSwitch ?? url.searchParams.get("killSwitch") ?? "false") === "true";
    } else {
      verdict = String(url.searchParams.get("verdict") || "").toLowerCase();
      path = String(url.searchParams.get("path") || "");
      killSwitch = String(url.searchParams.get("killSwitch") || "false") === "true";
    }

    if (verdict !== "allow" && verdict !== "block") {
      return NextResponse.json({ ok: false, error: "invalid verdict" }, { status: 400 });
    }
    if (!path) path = "/unknown";

    // IP & UA best-effort (Vercel)
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      null;
    const ua = req.headers.get("user-agent") || null;

    await sql/* sql */`
      insert into verit.gate_event (verdict, path, kill_switch, ip, user_agent)
      values (${verdict}, ${path}, ${killSwitch}, ${ip}, ${ua})
    `;

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[gate/track] error:", err?.message || err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
