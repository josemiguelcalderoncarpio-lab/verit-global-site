"use client";

import React from "react";

/**
 * Content-only field guide for Acceptance.
 * - The parent section supplies the light gray header and scroll container.
 * - No random/locale rendering, so SSR hydration stays stable.
 */
export default function AcceptanceGuide() {
  return (
    <div className="text-[13px] leading-[1.55] text-slate-700">
      {/* What Acceptance does */}
      <p className="mb-2">
        <strong>Goal.</strong> Bind the sealed outputs to a <em>payout header</em> and verify an
        <em> acceptance bundle</em> that meets freshness and quorum. Funds only move if the bundle
        verifies and the <code>outputs_digest</code> exactly matches the sealed snapshot.
      </p>

      {/* How to read this page */}
      <ol className="mb-3 list-decimal space-y-2 pl-5">
        <li>
          <strong>Gate banner.</strong> Turns green when the bundle is verified and persisted. This
          unlocks <em>Continue to Export</em>.
        </li>
        <li>
          <strong>Chips.</strong> Right-rail shows compact state: <code>digest=</code>…,{" "}
          <code>quorum</code> achieved, <code>freshness</code> status, and the active{" "}
          <code>policy_version</code>.
        </li>
        <li>
          <strong>Panels (top → bottom).</strong> <em>Input (from Seal)</em> → <em>Actions</em> →{" "}
          <em>Output (payout header &amp; acceptance bundle)</em>.
        </li>
      </ol>

      {/* Data sources */}
      <p className="mb-1 font-semibold">Data sources</p>
      <ul className="mb-3 list-disc space-y-1 pl-5">
        <li>
          <strong>Sealed snapshot.</strong> Read the immutable <code>outputs_digest</code>, fold
          descriptor, and transcript root produced by Seal.
        </li>
        <li>
          <strong>Policy metadata.</strong> Pull <code>policy_version</code> and any policy notes.
        </li>
        <li>
          <strong>Config.</strong> Acceptance matrix with <code>kinds</code>,{" "}
          <code>quorum</code>, <code>freshness_s</code>, and <code>expiry</code>.
        </li>
      </ul>

      {/* Payout header */}
      <p className="mb-1 font-semibold">Payout header (bound to the digest)</p>
      <ul className="mb-3 list-disc space-y-1 pl-5">
        <li>
          Structure:{" "}
          <code>
            &#123; window_id, policy_version, outputs_digest, quorum, freshness_s, expiry,
            signer_id &#125;
          </code>
          .
        </li>
        <li>
          The header is persisted and referenced by downstream artifacts. Any mismatch with Seal
          blocks acceptance.
        </li>
      </ul>

      {/* Acceptance kinds */}
      <p className="mb-1 font-semibold">Acceptance kinds (ACK / SPV / CT)</p>
      <ul className="mb-3 list-disc space-y-1 pl-5">
        <li>
          <strong>Signed ACK.</strong> Required in the demo. Verified locally (dev signer) or via
          mTLS hook. Reason codes on failure: <code>INVALID_SIGNATURE</code>,{" "}
          <code>VERIFIER_UNAVAILABLE</code>.
        </li>
        <li>
          <strong>SPV &amp; CT stubs.</strong> Present as optional slots. On attempt, they record
          non-blocking reason codes: <code>VERIFIER_UNAVAILABLE</code> or{" "}
          <code>STALE_PROOF</code>.
        </li>
        <li>
          <strong>Quorum.</strong> Bundle passes only when the number of satisfied kinds reaches the
          configured <code>quorum</code>.
        </li>
        <li>
          <strong>Freshness.</strong> Proof timestamps must fall within <code>freshness_s</code>{" "}
          (and before <code>expiry</code>). Otherwise: <code>STALE_PROOF</code>.
        </li>
      </ul>

      {/* Actions */}
      <p className="mb-1 font-semibold">Actions</p>
      <ul className="mb-3 list-disc space-y-1 pl-5">
        <li>
          <strong>Build header.</strong> Compose the header from Seal + Policy. This step does not
          mutate upstream.
        </li>
        <li>
          <strong>Verify bundle.</strong> Evaluate selected kinds, enforce quorum/freshness, and
          record a reason-coded outcome per verifier path.
        </li>
        <li>
          <strong>Save acceptance.</strong> Persist the verified header + bundle. Turns the gate
          green and enables <em>Continue to Export</em>.
        </li>
        <li>
          <strong>Reset.</strong> Clears Acceptance-local state only.
        </li>
      </ul>

      {/* Output */}
      <p className="mb-1 font-semibold">Output (what is persisted)</p>
      <ul className="mb-3 list-disc space-y-1 pl-5">
        <li>
          <code>vgos:acceptance:header</code> &rarr; the finalized payout header.
        </li>
        <li>
          <code>vgos:acceptance:bundle</code> &rarr; verification records with{" "}
          <code>verified_flag</code> and <code>reason_code</code> per kind.
        </li>
        <li>
          <code>vgos:transcript:acceptance:notes</code> &rarr; audit notes, e.g.,{" "}
          <code>INSUFFICIENT_QUORUM</code>, <code>STALE_PROOF</code>.
        </li>
      </ul>

      {/* Determinism & hygiene */}
      <p className="mb-1 font-semibold">Determinism &amp; hygiene</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          Header binds to <code>outputs_digest</code> byte-for-byte. Any change upstream invalidates
          acceptance.
        </li>
        <li>
          Hydration-safe UI: no locale formatting; timestamps shown as ISO slices in read-only
          fields.
        </li>
        <li>
          Navigation parity: once saved, the green button both dispatches the custom event and
          updates the provider state for chevrons.
        </li>
      </ul>
    </div>
  );
}
