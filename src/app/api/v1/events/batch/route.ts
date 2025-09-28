// src/app/api/v1/events/batch/route.ts
import { NextResponse } from "next/server";
// Prefer your path alias if configured:
import { gatewayStore, type EventBody } from "@/app/lib/gatewayStore";
// If you don't use tsconfig paths, swap to a relative import:
// import { gatewayStore, type EventBody } from "../../../../lib/gatewayStore";

export async function POST(req: Request) {
  try {
    const idem = req.headers.get("Idempotency-Key") ?? undefined;

    // Accept NDJSON body (one JSON object per line)
    const text = await req.text();
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      return NextResponse.json({ error: "empty batch" }, { status: 400 });
    }

    let parsed: EventBody[];
    try {
      parsed = lines.map((l) => JSON.parse(l) as EventBody);
    } catch {
      return NextResponse.json({ error: "invalid NDJSON" }, { status: 400 });
    }

    const { job } = gatewayStore.addBatch(parsed, idem);
    // 202 Accepted matches your Gateway UI (“returns { job }”)
    return NextResponse.json({ job }, { status: 202 });
  } catch {
    return NextResponse.json({ error: "bad batch" }, { status: 400 });
  }
}
