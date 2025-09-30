import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";

type GateVerdict = "allow" | "block";
type CountRow = { verdict: GateVerdict; cnt: number };

function getClient() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("Missing DATABASE_URL");
  return neon(url);
}

export async function GET() {
  try {
    const sql = getClient();

    const dayRows = await sql<CountRow>/* sql */`
      with span as (select now() - interval '24 hours' as since)
      select verdict::text as verdict, count(*)::int as cnt
      from verit.gate_event, span
      where ts >= span.since
      group by verdict
      order by verdict
    `;

    const weekRows = await sql<CountRow>/* sql */`
      with span as (select now() - interval '7 days' as since)
      select verdict::text as verdict, count(*)::int as cnt
      from verit.gate_event, span
      where ts >= span.since
      group by verdict
      order by verdict
    `;

    const dayMap: Record<GateVerdict, number> = { allow: 0, block: 0 };
    for (const r of dayRows) dayMap[r.verdict] = r.cnt;

    const weekMap: Record<GateVerdict, number> = { allow: 0, block: 0 };
    for (const r of weekRows) weekMap[r.verdict] = r.cnt;

    return NextResponse.json({
      ok: true,
      last24h: { allow: dayMap.allow, block: dayMap.block },
      last7d:  { allow: weekMap.allow, block: weekMap.block },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[gate/metrics] error:", msg);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
