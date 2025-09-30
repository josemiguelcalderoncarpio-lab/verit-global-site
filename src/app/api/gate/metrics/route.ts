import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";

function getClient() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("Missing DATABASE_URL");
  return neon(url);
}

export async function GET() {
  try {
    const sql = getClient();
    // Last 24h and 7d simple counts
    const [{ rows: dayRows }] = await Promise.all([
      sql/* sql */`
        with span as (
          select now() - interval '24 hours' as since
        )
        select verdict, count(*)::int as cnt
        from verit.gate_event, span
        where ts >= span.since
        group by verdict
      `.then((rows:any)=>[{rows}]),
    ]).catch((e:any)=>{ throw e; });

    const weekRows = await sql/* sql */`
      with span as (
        select now() - interval '7 days' as since
      )
      select verdict, count(*)::int as cnt
      from verit.gate_event, span
      where ts >= span.since
      group by verdict
      order by verdict
    `;

    const day = Object.fromEntries(dayRows.rows.map((r:any)=>[r.verdict, r.cnt]));
    const week = Object.fromEntries(weekRows.map((r:any)=>[r.verdict, r.cnt]));

    return NextResponse.json({
      ok: true,
      last24h: { allow: day.allow || 0, block: day.block || 0 },
      last7d:  { allow: week.allow || 0, block: week.block || 0 },
    });
  } catch (err:any) {
    console.error("[gate/metrics] error:", err?.message || err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
