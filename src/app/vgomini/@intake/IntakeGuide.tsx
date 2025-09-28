// src/app/vgomini/@intake/IntakeGuide.tsx
"use client";

import React from "react";

/**
 * Content-only field guide for Intake.
 * - No borders/headers here (the parent panel supplies them).
 * - No scrolling here (parent handles max-height + overflow).
 */
export default function IntakeGuide() {
  return (
    <div className="text-[13px] leading-[1.55] text-slate-700">
      {/* What Intake does */}
      <p className="mb-2">
        <strong>Goal.</strong> Transform raw events pulled from <em>Gateway</em> into a clean,
        deduplicated set that is <em>ready to order</em>. Intake performs shape normalization,
        emits reason-coded duplicates to the transcript, advances watermarks, and stages a minimal
        set for the next step. No monetary mutation occurs here—Intake only prepares data and evidence.
      </p>

      {/* How to read the page */}
      <ol className="list-decimal pl-5 space-y-2 mb-3">
        <li>
          <strong>Gate banner.</strong> Yellow = not ready; turns green only after a successful
          <strong> Stage</strong>. “Continue to Order” stays disabled until there’s at least one staged row.
        </li>
        <li>
          <strong>Chips.</strong> Counters for <code>input</code>, <code>validated</code>,
          <code>staged</code>, and <code>dups</code>. Watermark chips show target <code>W*</code>
          and each partition’s latest accepted time (<code>pN: hh:mm:ss</code>). The window can close when
          <code> ∀p Wₚ ≥ W*</code>.
        </li>
        <li>
          <strong>Panels.</strong> Read top-to-bottom: <em>Input (raw)</em> → <em>Actions</em> →
          <em>Validated (preview)</em> → <em>Staged (deduped)</em> → <em>Transcript (duplicates)</em>.
        </li>
      </ol>

      {/* Input (raw) */}
      <p className="mb-1 font-semibold">Input (raw)</p>
      <ul className="list-disc pl-5 space-y-1 mb-3">
        <li>
          <strong>Pull from Gateway / Refresh</strong> fetches the latest rows (auto on first visit).
          A new pull clears downstream state to avoid accidental carry-over.
        </li>
        <li>
          <strong>Columns.</strong> <code>received_at</code>, <code>idempotency</code>, <code>event_id</code>,
          <code>principal</code>, <code>type</code>, <code>amount</code>, <code>replayed?</code>. Sticky headers
          + zebra rows aid scanning.
        </li>
        <li>
          <strong>Watermarks.</strong> Rows may include <code>partition</code>. Intake computes target <code>W*</code>
          (max observed time) and shows per-partition chips.
        </li>
      </ul>

      {/* Actions */}
      <p className="mb-1 font-semibold">Actions</p>
      <ul className="list-disc pl-5 space-y-1 mb-3">
        <li>
          <strong>Validate.</strong> Produces two duplicate kinds:
          <code> idempotency-dup</code> and <code>event-id-dup</code>. Duplicates are not forwarded; they are
          emitted as reason-coded transcript notes.
        </li>
        <li>
          <strong>Stage → Order.</strong> Writes the minimal, deduped set (stable tie-breakers) for the next step
          and unlocks <em>Order</em>.
        </li>
        <li>
          <strong>Reset.</strong> Clears Intake-local state only (Input/Validated/Staged/Transcript).
        </li>
      </ul>

      {/* Validated */}
      <p className="mb-1 font-semibold">Validated (preview fold order)</p>
      <ul className="list-disc pl-5 space-y-1 mb-3">
        <li>
          <strong>Shape normalization.</strong> Money → minor units (ints), timestamps → ISO strings.
          Issues appear in the <code>issue</code> column if present.
        </li>
        <li><strong>Preview only.</strong> Nothing moves forward until you click <em>Stage → Order</em>.</li>
      </ul>

      {/* Staged */}
      <p className="mb-1 font-semibold">Staged for next box (deduped • ordered-ready)</p>
      <ul className="list-disc pl-5 space-y-1 mb-3">
        <li>Exactly the rows that <em>Order</em> will process. Any upstream change requires re-stage.</li>
      </ul>

      {/* Transcript */}
      <p className="mb-1 font-semibold">Transcript (duplicates only)</p>
      <ul className="list-disc pl-5 space-y-1 mb-3">
        <li>
          Notes include <code>at</code>, <code>event_id</code>, and <code>reason</code>
          (<code>idempotency-dup</code> or <code>event-id-dup</code>), proving duplicates didn’t mutate money.
        </li>
      </ul>

      {/* Invariants */}
      <p className="mb-1 font-semibold">Invariants (why auditors care)</p>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>Idempotency filter + reasons</strong> — duplicates never change monetary state.</li>
        <li><strong>Monotone watermarks</strong> — window closes only when all partitions meet <code>W*</code>.</li>
        <li><strong>No self-reset on nav</strong> — Intake persists until you hit Reset.</li>
      </ul>
    </div>
  );
}
