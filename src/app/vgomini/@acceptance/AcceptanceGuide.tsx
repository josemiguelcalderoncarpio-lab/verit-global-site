"use client";

import React from "react";

/**
 * AcceptanceGuide — field-guide content for the Acceptance step.
 * Hydration-safe (no Date.now(), no toLocale* in render),
 * no unescaped quotes, and consistent with other guides.
 */
export default function AcceptanceGuide() {
  return (
    <div className="text-[12px] leading-5 text-slate-700">
      <p className="mb-2">
        <strong>Goal.</strong> Finalize an <em>ALLOW/HOLD</em> decision by validating the sealed snapshot against
        acceptance policy. Acceptance binds the decision to a <em>payout header</em> and an
        <em> acceptance bundle</em> (freshness + quorum + proofs). Funds move only when digest equality holds and the
        acceptance checks pass.
      </p>

      <ol className="list-decimal pl-5 space-y-1">
        <li>
          <strong>Gate banner.</strong> Turns green once a decision is committed; that unlocks
          <em> Continue to Export</em>.
        </li>
        <li>
          <strong>Chips.</strong> Right-rail counters summarize the set (final Σ, target, remainder=0), sealed state,
          and any acceptance hints (e.g., <code>ACK_MISSING</code>, <code>STALE_PROOF</code>).
        </li>
        <li>
          <strong>Panels (top → bottom).</strong> <em>Controls</em> → <em>Validations</em> → <em>Decision</em> →
          <em> Final allocations</em>.
        </li>
      </ol>

      <hr className="my-2 border-slate-200" />

      <p className="mb-1 font-semibold text-slate-800">Data sources</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong>Seal digest.</strong> Read the canonical digest from <code>vgos:seal</code> (must be sealed).
        </li>
        <li>
          <strong>Final allocations.</strong> The totals (<code>final_minor</code>) rendered here must match the sealed snapshot.
        </li>
        <li>
          <strong>Attestations (demo).</strong> A local signer provides <code>ACK</code>. <code>SPV</code> and{" "}
          <code>CT</code> are stubbed with reason codes.
        </li>
      </ul>

      <hr className="my-2 border-slate-200" />

      <p className="mb-1 font-semibold text-slate-800">Payout header (bound to the decision)</p>
      <p className="mb-1">
        The header names the snapshot being accepted and the policy context. It is recorded to transcript and echoed in
        exported artifacts.
      </p>
      <pre className="mt-1 rounded bg-slate-50 p-2 text-[11px] leading-4">
{`{
  "window_id": "YYYY-MM-DD..YYYY-MM-DD",
  "policy_version": "v1.0.0",
  "outputs_digest": "<hex>",          // from Seal
  "quorum": 2,                        // Q (min approvals)
  "freshness_s": 3600,                // F (max age of proofs)
  "expiry": "ISO-8601 timestamp",
  "signer_id": "ack-local-demo"       // who attested
}`}
      </pre>

      <p className="mt-2 mb-1 font-semibold text-slate-800">
        Acceptance bundle (freshness + quorum + proofs)
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong>Kinds.</strong> <code>ACK</code> (implemented), <code>SPV</code>, <code>CT</code> (stubs). Each entry
          is a signed statement over <code>outputs_digest</code>.
        </li>
        <li>
          <strong>Freshness F.</strong> All proofs must be younger than <code>freshness_s</code> when the decision is
          committed. Otherwise: <code>STALE_PROOF</code>.
        </li>
        <li>
          <strong>Quorum Q.</strong> Must collect at least <code>Q</code> valid proofs. Otherwise:
          <code> INSUFFICIENT_QUORUM</code>.
        </li>
        <li>
          <strong>Verification.</strong> For the demo: ACK is verified by a local signer. SPV/CT return
          <code> VERIFIER_UNAVAILABLE</code>.
        </li>
      </ul>

      <pre className="mt-2 rounded bg-slate-50 p-2 text-[11px] leading-4">
{`{
  "kinds": ["ACK"],
  "quorum": 2,
  "freshness_s": 3600,
  "proofs": [
    { "kind": "ACK", "signer": "ack-local-demo", "ts": "ISO", "sig": "<hex>", "digest": "<hex>" }
  ],
  "verified": true,
  "reason_code": null
}`}
      </pre>

      <hr className="my-2 border-slate-200" />

      <p className="mb-1 font-semibold text-slate-800">Controls &amp; Actions</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong>Get from Seal.</strong> Loads the sealed snapshot and re-runs validations (digest equality, totals,
          non-negative, per-principal caps applied, etc.).
        </li>
        <li>
          <strong>Copy seal hash / Download acceptance.</strong> Operator shortcuts. The downloaded JSON embeds the
          payout header and acceptance bundle.
        </li>
        <li>
          <strong>Decision.</strong> Choose <em>ALLOW</em> or <em>HOLD</em>. If <em>HOLD</em>, include a reason. If{" "}
          <em>ALLOW</em>, the app verifies F/Q and proofs; failing checks force <em>HOLD</em> with a reason code.
        </li>
        <li>
          <strong>Commit decision.</strong> Persists the acceptance payload to <code>vgos:acceptance</code>, appends a
          transcript note, and unlocks <em>Export</em>.
        </li>
        <li>
          <strong>Reopen.</strong> Clears the acceptance state so any change in Seal forces a fresh verification.
        </li>
      </ul>

      <hr className="my-2 border-slate-200" />

      <p className="mb-1 font-semibold text-slate-800">Reason codes (non-monetary)</p>
      <ul className="list-disc pl-5 space-y-1">
        <li><code>ACK_MISSING</code> — no ACK proof provided.</li>
        <li><code>INVALID_SIGNATURE</code> — proof signature mismatch over <code>outputs_digest</code>.</li>
        <li><code>STALE_PROOF</code> — proof older than <code>freshness_s</code>.</li>
        <li><code>INSUFFICIENT_QUORUM</code> — fewer than <code>Q</code> valid proofs.</li>
        <li><code>VERIFIER_UNAVAILABLE</code> — SPV/CT stubbed in the demo.</li>
      </ul>

      <hr className="my-2 border-slate-200" />

      <p className="mb-1 font-semibold text-slate-800">Determinism &amp; UX invariants</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>All amounts are integers in minor units; any currency formatting is UI-only.</li>
        <li>No <code>toLocale*</code> or <code>Date.now()</code> in render paths.</li>
        <li>
          Tables: <code>border-slate-300</code>, <code>bg-slate-100</code> headers, zebra rows; headers use{" "}
          <code>scope=&quot;col&quot;</code>.
        </li>
        <li>Buttons include <code>aria-label</code>s for accessibility.</li>
      </ul>

      <hr className="my-2 border-slate-200" />

      <p className="mb-1 font-semibold text-slate-800">Acceptance criteria</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          Payout header echoes <code>window_id</code>, <code>policy_version</code>, and <code>outputs_digest</code>.
        </li>
        <li>
          Bundle shows <code>kinds</code>, <code>quorum</code>, <code>freshness_s</code>, and per-proof verification.
        </li>
        <li><em>Continue to Export</em> enables only after a committed decision.</li>
      </ul>
    </div>
  );
}
