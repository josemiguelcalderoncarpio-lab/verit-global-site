// src/app/vgomini/@info/default.tsx
"use client";

import * as React from "react";

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`rounded-2xl border border-slate-200 bg-white p-4 ${className}`}>{children}</div>
);

const StepCard: React.FC<{
  n: number;
  title: string;
  why: string;
  what: string;
}> = ({ n, title, why, what }) => (
  <div className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3">
    <span className="mt-[2px] inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-700 text-[12px] font-bold text-white">
      {n}
    </span>
    <div className="min-w-0">
      {/* Title: larger */}
      <div className="text-[16px] font-semibold leading-6">{title}</div>
      {/* Why: bold, a bit bigger than explanation */}
      <div className="mt-[2px] text-[13px] font-semibold text-slate-800 leading-5">{why}</div>
      {/* Explanation: next line, slightly smaller */}
      <div className="mt-1 text-[12px] text-slate-700 leading-5">{what}</div>
    </div>
  </div>
);

export default function InfoPage() {
  const start = (e?: React.MouseEvent) => {
    e?.preventDefault();
    try { window.dispatchEvent(new CustomEvent("vgo:goto-gateway")); }
    catch { window.location.hash = "#gateway"; }
  };

  const steps = [
    {
      t: "Gateway",
      why: "Prevent duplicates and define the exact payout run.",
      what:
        "Capture raw files/feeds exactly once and assign a unique window ID. Retries or resubmits can’t double-count, and every later step references this window for clean traceability."
    },
    {
      t: "Intake",
      why: "Normalize inputs so math and joins are stable.",
      what:
        "Parse rows into a single schema and fixed-point types (integer cents, never floats). This removes format drift so joins and arithmetic behave identically during replay."
    },
    {
      t: "Order",
      why: "Make outputs deterministic for any replay.",
      what:
        "Assign a fixed processing sequence (event_id + monotone watermark). With order locked, the same inputs always yield the same outputs—no race conditions or non-canonical joins."
    },
    {
      t: "Accumulate",
      why: "Surface per-principal totals before rules.",
      what:
        "Group by principal (creator/merchant/etc.) and sum base earnings to a clean per-principal table. This isolates per-person amounts for review and for downstream steps."
    },
    {
      t: "Policy",
      why: "Apply business rules transparently and consistently.",
      what:
        "Run explicit rules—eligibility, thresholds, caps, reasons—to produce a proposed decision per principal. The rule trail shows exactly why each amount is allowed or held."
    },
    {
      t: "Carry",
      why: "Handle minimums/rollovers without rounding drift.",
      what:
        "Move amounts across windows as required (e.g., minimum payout thresholds). Using integer cents keeps the carry ledger consistent and prevents long-term rounding creep."
    },
    {
      t: "Seal",
      why: "Anchor evidence to one immutable snapshot.",
      what:
        "Freeze inputs and outputs and compute a SHA-256 digest (the seal hash). Any later acceptance or export must reference this exact digest, proving provenance."
    },
    {
      t: "Acceptance",
      why: "Add governance before money moves.",
      what:
        "Commit a signed decision—ALLOW or HOLD—referencing the seal hash, with quorum/freshness facts. This is the approval checkpoint captured in the transcript."
    },
    {
      t: "Export",
      why: "Deliver artifacts downstream can verify independently.",
      what:
        "Generate provider, billing, and GL files and index them in a manifest with byte sizes and SHA-256 for each. Anyone can hash files to confirm integrity without trusting us."
    },
    {
      t: "Audit",
      why: "Prove exports match the accepted snapshot.",
      what:
        "Reload snapshots, run replay checks (seal↔accept linkage, totals, duplicates, file hashes), and download an evidence bundle combining artifacts and verification results."
    },
  ];

  const [glossaryOpen, setGlossaryOpen] = React.useState(false);

  return (
    <div className="space-y-8 text-[14px] leading-6 text-slate-800">
      {/* Lead text (bold first line + interactive explanation) */}
      <section className="space-y-2">
        <p className="font-semibold">
          VGOSMini is a working ultra-simplified model of VGOS so you can grasp the logic end-to-end.
        </p>
        <p>
          <strong>To simulate a payment,</strong> follow an interactive, step-by-step flow using the chevrons from left to right.
          Each panel includes a short field guide, and as you complete actions the UI unlocks the next stage. Use the green
          <span className="px-1 font-semibold">Continue</span> buttons to advance when a step is complete.
        </p>
        <a
          href="#gateway"
          onClick={start}
          className="text-emerald-700 underline underline-offset-2 hover:text-emerald-800"
        >
          Start here →
        </a>
      </section>

      {/* Ten steps (numbered with 3-tier typography) */}
      <section className="space-y-3">
        <h3 className="text-base font-semibold">The ten steps</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {steps.map((s, idx) => (
            <StepCard key={s.t} n={idx + 1} title={s.t} why={s.why} what={s.what} />
          ))}
        </div>
      </section>

      {/* Glossary (collapsible) */}
      <section className="space-y-3">
        <h3 className="text-base font-semibold">Glossary</h3>
        <Card>
          <button
            type="button"
            onClick={() => setGlossaryOpen(v => !v)}
            className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-800"
          >
            <span
              className="inline-block h-5 w-5 rounded-full bg-slate-200 text-center font-mono leading-5 text-slate-700"
              aria-hidden
            >
              {glossaryOpen ? "–" : "+"}
            </span>
            {glossaryOpen ? "Hide terms" : "Show terms"}
          </button>

          {glossaryOpen && (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <div className="font-semibold">Window</div>
                <div className="text-slate-700">Batch/time slice identifier for this payout run.</div>
              </div>
              <div>
                <div className="font-semibold">Transcript</div>
                <div className="text-slate-700">Step-by-step record of inputs/outputs used for replay and audit.</div>
              </div>
              <div>
                <div className="font-semibold">Seal hash</div>
                <div className="text-slate-700">SHA-256 digest of the sealed snapshot; anchors every later action.</div>
              </div>
              <div>
                <div className="font-semibold">Acceptance</div>
                <div className="text-slate-700">Signed decision (ALLOW/HOLD) referencing the exact seal hash.</div>
              </div>
              <div>
                <div className="font-semibold">Quorum (q)</div>
                <div className="text-slate-700">Number of independent verifiers/sources required for acceptance.</div>
              </div>
              <div>
                <div className="font-semibold">Freshness (F)</div>
                <div className="text-slate-700">Maximum age (seconds) data may be when accepted.</div>
              </div>
              <div>
                <div className="font-semibold">Final amount (¢)</div>
                <div className="text-slate-700">Per-principal payout in integer cents (no floating-point drift).</div>
              </div>
              <div>
                <div className="font-semibold">Carry</div>
                <div className="text-slate-700">Rules that move money across windows (e.g., minimum thresholds).</div>
              </div>
              <div>
                <div className="font-semibold">Manifest</div>
                <div className="text-slate-700">JSON index listing exported artifacts with sizes and SHA-256 hashes.</div>
              </div>
              <div>
                <div className="font-semibold">Provider batch id</div>
                <div className="text-slate-700">Optional identifier linking your PSP run to this export set.</div>
              </div>
              <div>
                <div className="font-semibold">Replay checks</div>
                <div className="text-slate-700">Automated validations: seal↔accept linkage, totals, duplicates, file hashes.</div>
              </div>
              <div>
                <div className="font-semibold">Audit bundle</div>
                <div className="text-slate-700">Evidence package (seal, acceptance, header, manifest, replay results).</div>
              </div>
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}
