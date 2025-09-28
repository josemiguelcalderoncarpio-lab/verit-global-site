"use client";

import React from "react";

/**
 * GatewayGuide
 * A compact, scrollable “field guide” for the Gateway step.
 * - Shows ~6–8 lines by default (constrained height) with a scrollbar.
 * - Product-centric explanations for the terms shown in the UI.
 * - Pure client component; no state, no effects (zero hydration risk).
 */
export default function GatewayGuide() {
  return (
    <section className="mb-3 rounded-lg border border-slate-200 bg-white">
      <header className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-[12px] font-semibold text-slate-700">
        Gateway — field guide
      </header>

      {/* Constrain height so only ~6–8 lines show; rest scrolls */}
      <div className="max-h-38 overflow-y-auto px-4 py-3 text-[13px] leading-[1.45] text-slate-700">
        <p className="mb-2">
          <strong>Gateway</strong> ingests transactional events, normalizes payloads,
          and guarantees <em>exactly-once</em> semantics with an <code>Idempotency-Key</code>.
          Post one event for instant feedback or stream an NDJSON batch for throughput.
        </p>

        <p className="mb-2">
          <strong>Window</strong> is the active run/bucket (e.g., a payout period); switching it is
          like moving to a new ledger page. <strong>K</strong> is the number of parallel lanes (partitions).
          We deterministically route each event to a <strong>partition</strong> by hashing
          <code>tenant_id · window · bucket</code> so ordering stays stable for the same inputs.
        </p>

        <p className="mb-2">
          Each input is canonicalized (sorted keys, normalized strings) and hashed into <em>input_hash</em>.
          A short <strong>segment</strong> marker reflects the transcript head (a running fingerprint over
          the accepted sequence). The <strong>watermark</strong> shows the receive time of the latest row—
          if it’s moving, Gateway is actively ingesting.
        </p>

        <p className="mb-2">
          A <strong>writer lease</strong> ensures only one producer writes to the same (partition, window).
          Claim/renew/release the lease, or simulate a conflict to see actions lock and a red badge appear.
        </p>

        <p className="mb-0">
          Use <strong>Send sample</strong>, <strong>Retry duplicate</strong>, <strong>Send batch</strong>,
          <strong> Seed deterministic set</strong>, or <strong>Record only (transcript)</strong> to explore
          dedup, partitioning, and the transcript chain. Once at least one event is in, the banner turns green
          and you can continue to <strong>Intake</strong>.
        </p>
      </div>
    </section>
  );
}
