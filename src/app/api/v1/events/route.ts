// src/app/api/v1/events/route.ts
import { NextResponse } from "next/server";
// Prefer your path alias if configured:
import { gatewayStore, type EventBody } from "@/app/lib/gatewayStore";
// If you don't use tsconfig paths, swap to a relative import:
// import { gatewayStore, type EventBody } from "../../../lib/gatewayStore";

export async function GET() {
  // Intake expects an array of rows (newest first is fine)
  // Each row should include: event_id, principal_id, amount_minor, currency, type, occurred_at
  // plus optional: received_at, idempotency_key, replayed
  return NextResponse.json(gatewayStore.list(), { status: 200 });
}

export async function POST(req: Request) {
  try {
    const idem = req.headers.get("Idempotency-Key") ?? undefined;
    const body = (await req.json()) as EventBody;

    // Minimal validation – matches what Gateway sends today
    if (!body?.event_id) {
      return NextResponse.json({ error: "missing event_id" }, { status: 400 });
    }
    if (!body?.occurred_at) {
      return NextResponse.json({ error: "missing occurred_at" }, { status: 400 });
    }

    const row = gatewayStore.add(body, idem);
    // Demo behavior: we record a row even on duplicate, flagged with replayed:true.
    // If you prefer “ack-only” on duplicates, update gatewayStore.add to skip push when replayed.
    return NextResponse.json(row, { status: 201 });
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
}
