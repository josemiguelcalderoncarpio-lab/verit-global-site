import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";

type GateVerdict = "allow" | "block";
type CountRow = { verdict: GateVerdict; cnt: number };

/** Minimal, generic-free shape of the Neon SQL tag */
type NeonSql = (
  strings: TemplateStringsArray,
  ...values: unknown[]
) => Promise<unknown[]>;

function getClient(): NeonSql {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("Missing DATABASE_URL");
  // Cast once to our minimal interface so we don't pull in Neon generics
  return neon(url) as unknown as NeonSql;
}

async function ensureTable(sql: NeonSql): Promise<void> {
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

export async function GET(req: Request) {
  const debug = new URL(req.url).searchParams.get("debug") === "1";

  try {
    const sql = getClient();
    await ensureTable(sql);

    const dayRowsUnknown = await sql/* sql */`
      with span as (select now() - interval '24 hours' as since)
      select verdict::text as verdict, count(*)::int as cnt
      from verit.gate_event, span
      where ts >= span.since
      group by verdict
      order by verdict
    `;

    const weekRowsUnknown = await sql/* sql */`
      with span as (select now() - interval '7 days' as since)
      select verdict::text as verdict, count(*)::int as cnt
      from verit.gate_event, span
      where ts >= span.since
      group by verdict
      order by verdict
    `;

    // Narrow unknown → our row type
    const dayRows = dayRowsUnknown as unknown as CountRow[];
    const weekRows = weekRowsUnknown as unknown as CountRow[];

    const last24h: Record<GateVerdict, number> = { allow: 0, block: 0 };
    for (const r of dayRows) last24h[r.verdict] = r.cnt;

    const last7d: Record<GateVerdict, number> = { allow: 0, block: 0 };
    for (const r of weekRows) last7d[r.verdict] = r.cnt;

    return NextResponse.json({ ok: true, last24h, last7d });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { ok: false, error: debug ? msg : "server_error" },
      { status: 500 }
    );
  }
}
