import { NextResponse } from "next/server";
import { gatewayStore } from "../../../../../lib/gatewayStore";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const limit = Math.max(1, Math.min(1000, Number(url.searchParams.get("limit") || 200) || 200));
    return NextResponse.json({ rows: gatewayStore.getIngress(limit) }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
