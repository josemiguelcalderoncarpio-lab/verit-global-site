"use client";

import React from "react";

/**
 * ExportGuide — field-guide content for the Export step.
 * - Hydration-safe (no Date.now(), no toLocale* in render).
 * - Mirrors the tone/structure of Intake/Order/Accumulate/Carry/Seal/Acceptance guides.
 */
export default function ExportGuide() {
  return (
    <div className="text-[12px] leading-5 text-slate-700">
      <p className="mb-2">
        <strong>Goal.</strong> Produce export artifacts derived from the <em>sealed</em> snapshot and the
        <em> committed acceptance</em>. Each artifact is listed in a <em>manifest</em> with file hashes so downstream
        systems can verify integrity. If Seal or Acceptance change, the manifest is invalidated and must be rebuilt.
      </p>

      <ol className="list-decimal pl-5 space-y-1">
        <li>
          <strong>Gate banner.</strong> Turns green once an acceptance is committed; that unlocks <em>Finish ↦</em>.
        </li>
        <li>
          <strong>Chips.</strong> Summarize readiness at a glance: <code>seal hash</code>, <code>acceptance id</code>,
          <code> header</code> (quorum/freshness), and artifact counts.
        </li>
        <li>
          <strong>Panels (top → bottom).</strong> <em>Controls</em> → <em>Artifacts</em> → <em>Manifest (hashes)</em> →{" "}
          <em>Download</em>.
        </li>
      </ol>

      <hr className="my-2 border-slate-200" />

      <p className="mb-1 font-semibold text-slate-800">Data sources</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong>Seal digest.</strong> Canonical outputs digest from <code>vgos:seal</code> (must be sealed).
        </li>
        <li>
          <strong>Acceptance payload.</strong> Decision bound to a <em>payout header</em> and an acceptance bundle
          from <code>vgos:acceptance</code>.
        </li>
        <li>
          <strong>Payout header (echoed).</strong> We embed key header fields in artifact headers/memos for
          cross-system reconciliation.
        </li>
      </ul>

      <pre className="mt-2 rounded bg-slate-50 p-2 text-[11px] leading-4">{`// Minimal payout_header echoed into file headers/memos
{
  "window_id": "YYYY-MM-DD..YYYY-MM-DD",
  "policy_version": "v1.0.0",
  "outputs_digest": "<hex>",
  "quorum": 2,
  "freshness_s": 3600
}`}</pre>

      <hr className="my-2 border-slate-200" />

      <p className="mb-1 font-semibold text-slate-800">Artifacts</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong>CSV/JSON/NDJSON</strong> for final allocations. Rows are serialized from the sealed/accepted
          snapshot—no recomputation in Export.
        </li>
        <li>
          <strong>Deterministic formatting.</strong> Keys sorted, integer minor units on disk; any currency formatting
          remains UI-only.
        </li>
        <li>
          <strong>Headers/memos.</strong> Include <code>window_id</code>, <code>policy_version</code>,{" "}
          <code>outputs_digest</code>, and the header’s <code>quorum</code>/<code>freshness_s</code>.
        </li>
      </ul>

      <pre className="mt-2 rounded bg-slate-50 p-2 text-[11px] leading-4">{`// Example NDJSON line (per principal)
{"principal":"CRE-00001","final_minor":1230,"window_id":"2025-09-23..2025-09-23",
 "outputs_digest":"<hex>","policy_version":"v1.0.0","quorum":2,"freshness_s":3600}
`}</pre>

      <hr className="my-2 border-slate-200" />

      <p className="mb-1 font-semibold text-slate-800">Manifest (hashes &amp; binding)</p>
      <p className="mb-1">
        The manifest lists artifact filenames, sizes, and cryptographic hashes. It also reiterates the binding to{" "}
        <code>outputs_digest</code> so any change upstream invalidates the set.
      </p>
      <pre className="mt-2 rounded bg-slate-50 p-2 text-[11px] leading-4">{`{
  "outputs_digest": "<hex>",
  "window_id": "YYYY-MM-DD..YYYY-MM-DD",
  "files": [
    {"name":"payouts.csv","bytes":1234,"sha256":"<hex>"},
    {"name":"payouts.json","bytes":987,"sha256":"<hex>"},
    {"name":"payouts.ndjson","bytes":456,"sha256":"<hex>"}
  ]
}`}</pre>

      <hr className="my-2 border-slate-200" />

      <p className="mb-1 font-semibold text-slate-800">Controls &amp; Actions</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong>Build artifacts.</strong> Materializes CSV/JSON/NDJSON and computes hashes; writes{" "}
          <code>vgos:export</code> and shows a manifest preview.
        </li>
        <li>
          <strong>Download.</strong> Individual files and the manifest; the manifest is the source of truth for payload
          verification downstream.
        </li>
        <li>
          <strong>Finish ↦</strong> (demo only) clears the working state and returns to Gateway for a fresh run.
        </li>
      </ul>

      <hr className="my-2 border-slate-200" />

      <p className="mb-1 font-semibold text-slate-800">Determinism &amp; UX invariants</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>All persisted numbers are integers in minor units; formatting happens at render.</li>
        <li>Stable key order in JSON/NDJSON; no locale-dependent formatting in files.</li>
        <li>
          Tables use <code>border-slate-300</code> and <code>bg-slate-100</code> headers with zebra rows; headers have{" "}
          <code>scope=&quot;col&quot;</code>.
        </li>
        <li>Buttons include <code>aria-label</code>s for accessibility.</li>
      </ul>

      <hr className="my-2 border-slate-200" />

      <p className="mb-1 font-semibold text-slate-800">Acceptance criteria</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Artifact files are derived solely from the sealed/accepted snapshot (no drift).</li>
        <li>Manifest includes hashes for every file and repeats <code>outputs_digest</code>.</li>
        <li>Payout header fields (<code>quorum</code>, <code>freshness_s</code>) appear in file headers/memos.</li>
        <li>
          <em>Finish ↦</em> only enables after artifacts + manifest are built and stored.
        </li>
      </ul>
    </div>
  );
}
