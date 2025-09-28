"use client";

import React from "react";

/**
 * CarryGuide — field-guide content for the Carry step.
 * - Hydration-safe (no Date.now, no toLocale*, no random).
 * - No unescaped quotes/apostrophes in JSX text.
 * - Mirrors the tone/structure used in Intake/Order/Accumulate guides.
 */
export default function CarryGuide() {
  return (
    <div className="text-[12px] leading-5 text-slate-700">
      <p className="mb-2">
        <strong>Goal.</strong> Consume the per-principal Policy results and distribute any sub-cent remainder to produce
        finalized <em>per-principal payouts</em> in minor units (¢). Distribution is deterministic and audit-ready.
      </p>

      <ol className="list-decimal pl-5 space-y-1">
        <li>
          <strong>Gate banner.</strong> Turns green once final allocations are saved. That unlocks{" "}
          <em>Continue to Seal</em>.
        </li>
        <li>
          <strong>Chips.</strong> Counters summarize the set: <code>eligible</code> principals,{" "}
          <code>&Sigma; exact bonus</code>, <code>rounded bonus</code>, <code>remainder</code> (¢), and{" "}
          <code>target total</code>. These reflect the current compute snapshot.
        </li>
        <li>
          <strong>Panels (top &rarr; bottom).</strong> <em>Input (from Policy)</em> &rarr; <em>Actions</em> &rarr;{" "}
          <em>Preview (ranking &amp; carry deltas)</em> &rarr; <em>Output (final allocations)</em>.
        </li>
      </ol>

      <hr className="my-2 border-slate-200" />

      <p className="mb-1 font-semibold text-slate-800">Deterministic remainder distribution</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong>Inputs.</strong> For each principal: <code>net_minor</code>,{" "}
          <code>bonus_exact_subcent</code> (string in cents, may include 2-decimal fraction), and an eligibility flag
          (<code>ALLOW</code>/<code>HOLD</code> from Policy).
        </li>
        <li>
          <strong>Floor + remainder.</strong> Convert <code>bonus_exact_subcent</code> to minor units: floor the bonus
          to <code>floor_bonus_minor</code>, collect <code>frac</code> = exact &minus; floor (0 &le; frac &lt; 1). The sum of
          fractional parts produces a non-negative integer <code>remainder_minor</code> (¢) to be assigned.
        </li>
        <li>
          <strong>Ranking (stable &amp; deterministic).</strong> Sort by:
          <ol className="list-decimal pl-5 mt-1">
            <li>fractional part <em>descending</em>,</li>
            <li>then principal <em>A&rarr;Z</em> (or a documented stable hash) as the tiebreaker.</li>
          </ol>
          This guarantees a total order with no randomness.
        </li>
        <li>
          <strong>Carry loop.</strong> Walk the ranking once; for the first <code>remainder_minor</code> principals,
          add +1¢. All others get +0¢. <em>No negative carries</em> are permitted (guarded invariant).
        </li>
        <li>
          <strong>Finalization.</strong> <code>final_bonus_minor = floor_bonus_minor + carry_delta_minor</code>;{" "}
          <code>final_payout_minor = net_minor + final_bonus_minor</code>.
        </li>
        <li>
          <strong>Eligibility guard.</strong> Only <code>ALLOW</code> principals receive the carry assignment.{" "}
          <code>HOLD</code> rows surface for transparency but never get a positive delta.
        </li>
      </ul>

      <hr className="my-2 border-slate-200" />

      <p className="mb-1 font-semibold text-slate-800">Actions</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong>Get from Policy.</strong> Loads the latest policy snapshot (read-only).
        </li>
        <li>
          <strong>Distribute remainder.</strong> Computes ranking and per-principal{" "}
          <code>carry_delta_minor</code>, then shows a <em>Preview</em> table with <code>floor</code>, <code>frac</code>
          , <code>carry</code>, and <code>final bonus</code>.
        </li>
        <li>
          <strong>Save allocations.</strong> Persists final rows; enables the green gate. In the demo, it writes to{" "}
          <code>vgos:carry</code> (or equivalent) and unlocks Seal.
        </li>
        <li>
          <strong>Reset.</strong> Clears Carry&rsquo;s local state only (never resets upstream).
        </li>
      </ul>

      <hr className="my-2 border-slate-200" />

      <p className="mb-1 font-semibold text-slate-800">Transcript &amp; ledger (Tier2)</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          On <em>Save allocations</em>, append a compact <strong>carry ledger</strong> entry to the transcript
          (Tier2, optional in demo):
          <pre className="mt-1 rounded bg-slate-50 p-2 text-[11px] leading-4">
{`{
  "at": "YYYY-MM-DDThh:mm:ssZ",
  "principal": "CRE-00001",
  "delta_minor": 1,         // +1¢ or 0¢
  "floor_bonus_minor": 12,
  "final_bonus_minor": 13
}`}
          </pre>
          This materializes the ranking outcome and per-principal deltas for audit.
        </li>
        <li>
          <strong>Invariant:</strong> <code>&Sigma; final_bonus_minor == round(&Sigma; exact bonus)</code> and{" "}
          <code>&Sigma; carry_delta_minor == remainder_minor</code>. Emit a red dev badge and console warning if violated
          (dev-only assert).
        </li>
      </ul>

      <hr className="my-2 border-slate-200" />

      <p className="mb-1 font-semibold text-slate-800">Determinism &amp; UX invariants</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Single comparator function implements the ranking (frac ↓, then principal A&rarr;Z).</li>
        <li>No iteration over unsorted object maps; operate on arrays only (document the invariant).</li>
        <li>Render all amounts in minor units; formatting to dollars is done in UI only.</li>
        <li>Hydration-safe: no <code>toLocale*</code>, no <code>Date.now()</code> paths in render.</li>
      </ul>

      <hr className="my-2 border-slate-200" />

      <p className="mb-1 font-semibold text-slate-800">Forward link &mdash; Seal</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          Seal will compute <strong>outputs_digest</strong> over a <em>byte-wise canonical serialization</em> (sorted map
          keys, fixed integer encodings), then produce a <strong>Tier0 transcript root</strong> including manifest hash,
          segments, watermark, fold descriptor, and <code>outputs_digest</code>.
        </li>
        <li>
          The demo signs with a dev key and stores signature fields (domain-separated) to unlock Acceptance.
        </li>
      </ul>

      <hr className="my-2 border-slate-200" />

      <p className="mb-1 font-semibold text-slate-800">Acceptance criteria</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Preview shows ranked list with floor, frac, carry, and final bonus.</li>
        <li>
          Final output totals equal the target; <code>&Sigma; final</code> matches{" "}
          <code>&Sigma; net + &Sigma; final_bonus</code>.
        </li>
        <li>Carry ledger entries appear in transcript Tier2 after save.</li>
        <li>Reloading preserves the saved allocations (no self-reset).</li>
      </ul>
    </div>
  );
}
