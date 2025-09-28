// src/app/vgomini/@policy/PolicyGuide.tsx
"use client";

import React from "react";

/**
 * Content-only field guide for Policy.
 * - No borders/headers here (the parent panel supplies them).
 * - No scrolling here (parent handles max-height + overflow).
 */
export default function PolicyGuide() {
  return (
    <div className="text-[13px] leading-[1.55] text-slate-700">
      {/* What Policy does */}
      <p className="mb-2">
        <strong>Goal.</strong> Consume the <em>per-principal rollup</em> from <em>Accumulate</em> and
        produce a per-principal <strong>policy decision</strong> plus a precise payout basis for
        downstream steps. Policy implements <strong>late quantization</strong> (quantize as late as
        possible), supports <strong>bounded-loss caps</strong>, and emits <strong>reason-coded</strong>{" "}
        outcomes (<code>ALLOW</code>/<code>HOLD</code>).
      </p>

      {/* How to read the page */}
      <ol className="mb-3 list-decimal space-y-2 pl-5">
        <li>
          <strong>Gate banner.</strong> Turns green once a policy result is <em>saved</em>. That
          unlocks <em>Continue to Carry</em>.
        </li>
        <li>
          <strong>Chips.</strong> Small counters summarize the current set:{" "}
          <code>principals</code>, <code>Σ net</code>, <code>bonus_exact</code> vs{" "}
          <code>bonus_quantized</code>, and the <code>payout_pre_carry</code> (in minor units).
        </li>
        <li>
          <strong>Panels (top → bottom).</strong> <em>Input (from Accumulate)</em> →{" "}
          <em>Attestations</em> → <em>Actions</em> → <em>Output (policy result)</em>.
        </li>
      </ol>

      {/* Inputs and attestations */}
      <p className="mb-1 font-semibold">Inputs</p>
      <ul className="mb-3 list-disc space-y-1 pl-5">
        <li>
          <strong>Rollup input.</strong> For each principal: <code>count</code>,{" "}
          <code>gross_minor</code>, <code>refunds_minor</code>, <code>net_minor</code> (all integers,
          minor units).
        </li>
        <li>
          <strong>Bonus % (window-level).</strong> Optional window bonus applied to{" "}
          <code>net_minor</code>. Example: <code>1</code> means +1% window bonus.
        </li>
        <li>
          <strong>Attestations.</strong> Two JSON blobs you can paste or edit:
          <ul className="mt-1 list-disc pl-5">
            <li>
              <em>Finance ACK</em>: array of signer receipts with expiry. Required for{" "}
              <code>ALLOW</code>. Example:
              <pre className="mt-1 overflow-x-auto rounded bg-slate-50 p-2 text-[12px] text-slate-800">{`[
  {"window_id":"2025-09W5","reserves_ok":true,"signer":"ops","expires_at":"2025-12-31T23:59:59Z"}
]`}</pre>
            </li>
            <li>
              <em>Compliance/Tax (CT) statuses</em>: array mapping principal → status. Any non-&quot;clear&quot;
              produces <code>HOLD</code> with a reason. Example:
              <pre className="mt-1 overflow-x-auto rounded bg-slate-50 p-2 text-[12px] text-slate-800">{`[
  {"principal_id":"acct_1","status":"clear"},
  {"principal_id":"acct_2","status":"hold"}
]`}</pre>
            </li>
          </ul>
        </li>
      </ul>

      {/* Late quantization & caps */}
      <p className="mb-1 font-semibold">Policy math — late quantization &amp; caps (patent anchor)</p>
      <ul className="mb-3 list-disc space-y-1 pl-5">
        <li>
          <strong>Exact bonus (no rounding yet).</strong>{" "}
          <code>bonus_exact_minor = net_minor × bonus_pct / 100</code>. This may be fractional in
          cents; we carry the exact value in state (string or rational form) for transparency.
        </li>
        <li>
          <strong>Quantize late.</strong> <code>bonus_quantized_minor = floor(bonus_exact_minor)</code>{" "}
          (integer cents). The <strong>remainder</strong>{" "}
          <code>bonus_remainder_minor = bonus_exact_minor − bonus_quantized_minor</code> is forwarded
          to <em>Carry</em> for deterministic sub-cent allocation.
        </li>
        <li>
          <strong>Bounded-loss caps (per principal).</strong> Optional{" "}
          <code>cap_minor</code> limits the pre-carry payout:
          <pre className="mt-1 overflow-x-auto rounded bg-slate-50 p-2 text-[12px] text-slate-800">{`payout_pre_carry = min(
  net_minor + bonus_quantized_minor,
  cap_minor | Infinity
)`}</pre>
          When the cap binds, record a transcript note{" "}
          <code>POLICY_CAP_APPLIED</code> with <code>{`{ before, cap_minor, capped_delta }`}</code>.
        </li>
        <li>
          <strong>Decision.</strong> <code>ALLOW</code> iff:
          <ul className="list-disc pl-5">
            <li>Finance ACK present, not expired.</li>
            <li>Compliance/Tax status for principal is <code>clear</code>.</li>
          </ul>
          Otherwise <code>HOLD</code> with a specific reason code (see below).
        </li>
      </ul>

      {/* Reason codes */}
      <p className="mb-1 font-semibold">Reason codes (transcript)</p>
      <ul className="mb-3 list-disc space-y-1 pl-5">
        <li>
          <code>ACK_MISSING</code>, <code>ACK_EXPIRED</code> — Finance attestation missing/expired.
        </li>
        <li>
          <code>CT_HOLD</code> — Compliance/Tax status not clear.
        </li>
        <li>
          <code>POLICY_CAP_APPLIED</code> — Cap bounded payout; includes fields{" "}
          <code>before</code>, <code>cap_minor</code>, <code>capped_delta</code>.
        </li>
      </ul>

      {/* Output rows */}
      <p className="mb-1 font-semibold">Output (policy result)</p>
      <ul className="mb-3 list-disc space-y-1 pl-5">
        <li>
          Columns per principal: <code>net (¢)</code>, <code>bonus_exact (¢)</code>,{" "}
          <code>bonus_quantized (¢)</code>, <code>payout_pre_carry (¢)</code>,{" "}
          <code>decision</code>, <code>reason</code>.
        </li>
        <li>
          Footer chips summarize: <code>ALLOW</code>/<code>HOLD</code> counts,{" "}
          <code>Σ bonus_exact</code> vs <code>Σ bonus_quantized</code>, and{" "}
          <code>Σ payout_pre_carry</code>.
        </li>
        <li>
          Saving writes to <code>vgos:policy</code> and emits transcript records under{" "}
          <code>vgos:transcript:policy</code>.
        </li>
      </ul>

      {/* Actions + behavior */}
      <p className="mb-1 font-semibold">Actions</p>
      <ul className="mb-3 list-disc space-y-1 pl-5">
        <li>
          <strong>Get from Accumulate.</strong> Loads rollup input. No upstream mutation.
        </li>
        <li>
          <strong>Apply Policy.</strong> Executes bonus/caps/decision logic. Uses integer minor units
          on the compute path; any sub-cent occurs only in <em>bonus_exact</em> and is carried to{" "}
          <em>Carry</em> via the remainder.
        </li>
        <li>
          <strong>Save Policy.</strong> Persists results and turns the gate green. You can navigate
          back and forth without losing state unless <em>Reset</em>.
        </li>
        <li>
          <strong>Reset.</strong> Clears Policy-local state (never resets upstream steps).
        </li>
      </ul>

      {/* Determinism & UX invariants */}
      <p className="mb-1 font-semibold">Determinism &amp; UX invariants</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <strong>Integer path only.</strong> Compute with integers in minor units; format dollars in
          the UI. No <code>toLocale…</code> during render.
        </li>
        <li>
          <strong>Stable serialization.</strong> When persisting policy results, serialize maps with
          sorted keys so Seal can compute a canonical digest later.
        </li>
        <li>
          <strong>No self-reset on nav.</strong> State persists until an explicit <em>Reset</em>.
        </li>
        <li>
          <strong>Transcript.</strong> Each cap or hold emits a reason-coded entry. These bind to the
          same window snapshot as Seal/Acceptance.
        </li>
      </ul>
    </div>
  );
}
