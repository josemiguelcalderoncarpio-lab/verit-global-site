// src/app/vgomini/@order/OrderGuide.tsx
"use client";

import React from "react";

/**
 * Content-only field guide for Order.
 * - No borders/headers here (the parent panel supplies them).
 * - No scrolling here (parent handles max-height + overflow).
 */
export default function OrderGuide() {
  return (
    <div className="text-[13px] leading-[1.55] text-slate-700">
      {/* What Order does */}
      <p className="mb-2">
        <strong>Goal.</strong> Take the <em>staged &amp; validated</em> rows from <em>Intake</em>
        and produce a <strong>canonical, deterministic sequence</strong> for downstream stages.
        Ordering follows a <em>lexicographic fold</em> and forbids unordered iteration—this is the
        contract auditors care about.
      </p>

      {/* How to read the page */}
      <ol className="list-decimal pl-5 space-y-2 mb-3">
        <li>
          <strong>Gate banner.</strong> Green after a successful <em>Order (deterministic)</em>.
          Only then the <em>Continue to Accumulate</em> button unlocks the next step.
        </li>
        <li>
          <strong>Chips.</strong> Counters for <code>staged</code>, <code>previewed</code>,
          <code>ordered</code>, and a <code>fold</code> descriptor chip summarizing the sort keys
          (hover shows full JSON). A compact <code>window</code> chip appears when membership is active.
        </li>
        <li>
          <strong>Panels (top → bottom).</strong> <em>Actions</em> → <em>Membership window</em> →
          <em>Input (from Intake)</em> → <em>Preview</em> → <em>Ordered (final sequence)</em>.
        </li>
      </ol>

      {/* Actions */}
      <p className="mb-1 font-semibold">Actions</p>
      <ul className="list-disc pl-5 space-y-1 mb-3">
        <li>
          <strong>Get from Intake.</strong> Loads the current <em>staged</em> rows. Re-running this
          clears Preview/Ordered so you don’t accidentally operate on stale data.
        </li>
        <li>
          <strong>Preview (first/last 20).</strong> Applies membership filtering (if configured)
          and shows a small sample before ordering. Counters indicate <code>kept</code> and
          <code>excluded</code> rows.
        </li>
        <li>
          <strong>Membership.</strong> Optional constraint with <code>start</code>,
          <code>end</code>, and <code>late tolerance (min)</code>. Rows are included iff
          <code> occurred_at ≥ start</code> and <code> occurred_at ≤ end + tolerance</code>.
          Exclusions are non-mutating and may be reason-coded into the transcript (e.g.,
          <code>OUT_OF_WINDOW</code>).
        </li>
        <li>
          <strong>Order (deterministic).</strong> Writes the final sequence using the explicit fold
          descriptor, persists it, updates chips, and unlocks <em>Accumulate</em>.
        </li>
        <li>
          <strong>Reset.</strong> Clears Order-local state only (never resets Gateway/Intake).
        </li>
      </ul>

      {/* Canonical fold descriptor */}
      <p className="mb-1 font-semibold">Canonical fold (patent anchor)</p>
      <ul className="list-disc pl-5 space-y-1 mb-3">
        <li>
          <strong>Descriptor.</strong>{" "}
          <code>fold_order_desc = [&quot;bucket_id asc&quot;, &quot;partition_id asc&quot;]</code>. We may add a stable
          tiebreaker <code>event_id asc</code> for clarity; it does not change payouts, only makes
          determinism explicit.
        </li>
        <li>
          <strong>Serialization.</strong> When you click <em>Order (deterministic)</em>, the fold
          descriptor is serialized into the <em>transcript trailer</em> for this window together with
          counts and membership settings:
          <pre className="mt-1 rounded bg-slate-50 p-2 text-[12px] text-slate-800 overflow-x-auto">{`{
  "fold_order_desc": ["bucket_id asc", "partition_id asc"],
  "ordered_count": N,
  "membership": { "start": "…", "end": "…", "late_tolerance_min": T },
  "materialized_at": "YYYY-MM-DDTHH:MM:SSZ"
}`}</pre>
        </li>
        <li>
          <strong>Invariant.</strong> All code paths must avoid iterating unsorted JS objects/maps.
          Implementation uses arrays plus a single shared comparator; dev-mode asserts warn if an
          unordered iteration sneaks in.
        </li>
      </ul>

      {/* Panels */}
      <p className="mb-1 font-semibold">Membership window</p>
      <ul className="list-disc pl-5 space-y-1 mb-3">
        <li>
          Use this to exclude out-of-period rows without touching upstream state. The <code>window</code> chip
          reflects the active interval and tolerance.
        </li>
        <li>
          Hydration-safe inputs: ISO strings or controlled text; no locale rendering. Timestamps displayed in
          tables as <code>HH:MM:SS</code> from ISO to keep SSR/CSR identical.
        </li>
      </ul>

      <p className="mb-1 font-semibold">Input (from Intake)</p>
      <ul className="list-disc pl-5 space-y-1 mb-3">
        <li>Read-only view of the staged set. Any change upstream requires re-pull.</li>
        <li>
          Columns: <code>event_id</code>, <code>principal</code>, <code>type</code>,
          <code>amount</code>, <code>occurred_at</code>.
        </li>
      </ul>

      <p className="mb-1 font-semibold">Preview (not ordered)</p>
      <ul className="list-disc pl-5 space-y-1 mb-3">
        <li>Reflects membership filtering only—this is the sanity check step.</li>
        <li>Shows first/last 20 rows; chips show <code>kept</code> / <code>excluded</code>.</li>
      </ul>

      <p className="mb-1 font-semibold">Ordered (final sequence)</p>
      <ul className="list-disc pl-5 space-y-1 mb-3">
        <li>
          Persisted, canonical sequence over the fold descriptor. Leftmost <code>#</code> column is
          the 1-based position in the sequence.
        </li>
        <li>
          Header shows a <code>fold:</code> badge so operators can confirm sort criteria at a glance.
        </li>
      </ul>

      {/* Determinism & UX invariants */}
      <p className="mb-1 font-semibold">Determinism &amp; UX invariants</p>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>Explicit sort keys.</strong> Never rely on engine/object iteration order.</li>
        <li><strong>Stable comparator.</strong> One function implements <code>bucket_id↑, partition_id↑, event_id↑</code>.</li>
        <li><strong>Hydration-safe time.</strong> Render timestamps via ISO slices; no <code>toLocale…</code>.</li>
        <li><strong>No self-reset on nav.</strong> Order state persists until you click Reset.</li>
        <li>
          <strong>Transcript trailer.</strong> Fold descriptor + counts + membership are recorded so
          downstream (Seal/Acceptance/Export) can bind to the same snapshot.
        </li>
      </ul>
    </div>
  );
}
