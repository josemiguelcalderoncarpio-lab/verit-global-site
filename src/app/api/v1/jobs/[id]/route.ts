// src/app/api/v1/jobs/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GatewayStore } from "@/lib/gatewayStore"; // adjust if your alias/path differs

const store = GatewayStore.instance;

type Params = { id: string };

// GET /api/v1/jobs/[id]
export async function GET(
  _request: NextRequest,
  context: { params: Promise<Params> } // ← typed routes expect a Promise here
): Promise<Response> {
  const { id } = await context.params;

  const job = store.getJob(id);
  if (!job) {
    return NextResponse.json({ error: "job_not_found" }, { status: 404 });
  }
  return NextResponse.json(job, { status: 200 });
}
