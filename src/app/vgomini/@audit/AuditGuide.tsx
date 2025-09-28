"use client";
import * as React from "react";

export default function AuditGuide() {
  return (
    <div className="space-y-1.5 text-[12px] leading-5 text-slate-700">
      <p><strong>Audit & Replay — field guide</strong></p>
      <ol className="list-decimal pl-5 space-y-1">
        <li>Reload the latest snapshots (Seal • Acceptance • Manifest).</li>
        <li>Run <em>Replay checks</em> to verify digests, decisions, totals, and file hashes.</li>
        <li>Open sections to inspect records, policy header, and artifacts.</li>
        <li>Download the audit bundle and attach to your ticket/system of record.</li>
      </ol>
    </div>
  );
}
