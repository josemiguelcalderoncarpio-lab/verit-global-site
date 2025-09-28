/* eslint-disable react/no-unescaped-entities */
// src/app/vgomini/@seal/SealGuide.tsx
"use client";

import React from "react";

/** JSON sample built as data, then stringified so quotes render normally
    while the linter stays quiet (rule disabled at file scope). */
const ROOT_SAMPLE = {
  version: "v1.0.0",
  window: { key: "YYYY-MM-DD..YYYY-MM-DD" },
  counts: { events: "N", principals: "P", eligible: "E" },
  targets: {
    target_total_minor: "T",
    sum_after_carry_minor: "S",
    remainder_minor: 0,
  },
  fold: { desc: ["bucket_id asc", "partition_id asc"] },
  segments: { manifest_hash: "<hex>", carry_ledger_ref: "<optional-ref>" },
  watermark: { "W*": "ISO", partitions: { p0: "ISO", "...": "ISO" } },
  algo: "sha256",
  outputs_digest: "<hex>",
};

export default function SealGuide() {
  return (
    <div className="text-[12px] leading-5 text-slate-700">
      <p className="mb-2">
        <strong>Goal.</strong> Finalize the payout snapshot by verifying per-principal totals and
        producing a <em>canonical, hashed digest</em> suitable for audit &amp; export. The digest binds
        to the exact Carry snapshot via a canonical byte serialization. The step also writes a minimal
        Tier0 transcript root and (in the demo) signs it with a developer key to unlock{" "}
        <em>Acceptance</em>.
      </p>

      <ol className="list-decimal space-y-1 pl-5">
        <li>
          <strong>Gate banner.</strong> Turns green once the current snapshot is sealed; that unlocks{" "}
          <em>Continue to Acceptance</em>.
        </li>
        <li>
          <strong>Chips.</strong> Counters summarize the set (finals Σ, target, remainder=0) and show
          a short hash fingerprint when sealed.
        </li>
        <li>
          <strong>Panels (top → bottom).</strong> <em>Input (from Carry)</em> → <em>Actions</em> →{" "}
          <em>Output (validations &amp; digest)</em>.
        </li>
      </ol>

      <hr className="my-2 border-slate-200" />

      <p className="mb-1 font-semibold text-slate-800">Canonical serialization (byte-wise)</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <strong>Object key order.</strong> All object keys are sorted lexicographically (UTF-8 code
          unit order).
        </li>
        <li>
          <strong>Numbers.</strong> Monetary and counters are encoded as{" "}
          <em>integers in minor units</em> (no floats, no scientific notation, no leading zeros except
          the value 0).
        </li>
        <li>
          <strong>Booleans/strings.</strong> Lowercase booleans; strings are UTF-8 without
          control-char escapes beyond JSON minimum.
        </li>
        <li>
          <strong>Arrays.</strong> Preserved in the computed order; do not sort.
        </li>
        <li>
          <strong>Bytes.</strong> The serializer emits a compact JSON byte stream with the above
          constraints; the digest is computed over those bytes exactly.
        </li>
      </ul>

      <hr className="my-2 border-slate-200" />

      <p className="mb-1 font-semibold text-slate-800">Digest computation</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <strong>Algorithm.</strong> <code>algo</code> = <code>sha256</code> (demo may also allow{" "}
          <code>blake3</code>).
        </li>
        <li>
          <strong>Payload.</strong> Canonical serialization of the sealed snapshot: per-principal
          finals plus a compact header with window &amp; totals.
        </li>
        <li>
          <strong>Output.</strong> <code>outputs_digest</code> as lowercase hex.
        </li>
        <li>
          <strong>Invariant.</strong> <code>Σ final_minor == target_total_minor</code> must hold
          before sealing.
        </li>
      </ul>

      <hr className="my-2 border-slate-200" />

      <p className="mb-1 font-semibold text-slate-800">Tier0 transcript root (minimal)</p>
      <p className="mb-1">Written at seal time; binds the sealed snapshot to pipeline context.</p>
      <pre className="mt-1 overflow-auto rounded bg-slate-50 p-2 text-[11px] leading-4">
        {JSON.stringify(ROOT_SAMPLE, null, 2)}
      </pre>

      <hr className="my-2 border-slate-200" />

      <p className="mb-1 font-semibold text-slate-800">Signature (demo)</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          Sign <code>domain || outputs_digest</code> with a developer key (e.g., ed25519). Store{" "}
          <code>{`{signer_id, sig, alg, domain}`}</code> alongside the transcript root. In the demo,
          keys live only in memory; do not persist secrets.
        </li>
        <li>Acceptance will verify signature freshness/quorum against this root.</li>
      </ul>

      <hr className="my-2 border-slate-200" />

      <p className="mb-1 font-semibold text-slate-800">Determinism &amp; UX invariants</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>All amounts in minor units; formatting happens only in the UI.</li>
        <li>
          No <code>toLocale*</code> or <code>Date.now()</code> in render paths (hydration-safe).
        </li>
        <li>Tables use consistent contrast: border-slate-300, bg-slate-100 headers, zebra rows.</li>
        <li>
          Accessibility: table headers use <code>scope="col"</code>; buttons have{" "}
          <code>aria-label</code>s.
        </li>
      </ul>

      <hr className="my-2 border-slate-200" />

      <p className="mb-1 font-semibold text-slate-800">Acceptance criteria</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>Digest remains stable across reloads for the same snapshot &amp; algorithm.</li>
        <li>
          Transcript root shows fold descriptor, window, counts, targets, and{" "}
          <code>outputs_digest</code>.
        </li>
        <li>&quot;Continue to Acceptance&quot; only enables after a successful seal.</li>
      </ul>
    </div>
  );
}
