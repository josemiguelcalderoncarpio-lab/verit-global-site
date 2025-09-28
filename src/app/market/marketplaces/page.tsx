// src/app/market/marketplaces/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Section, Card as UICard, CodePanel } from "../../../components/UI";

export default function MarketplacesIndustryPage() {
  return (
    <>
      {/* ---------- BREADCRUMB ---------- */}
      <div className="mx-auto max-w-7xl px-4 pt-6">
        <Link
          href="/market"
          className="inline-flex items-center gap-1 text-sm font-medium text-[var(--brand)] hover:underline"
        >
          <span aria-hidden>←</span> Back to Industries
        </Link>
      </div>

      {/* ---------- HERO ---------- */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:pt-8 md:pt-10 lg:pt-12">
          <div className="grid items-center gap-6 md:grid-cols-2">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                Pay marketplace partners without overpays or drift.
              </h1>
              <p className="mt-4 text-[15px] leading-7 text-slate-700 sm:text-base">
                Stop overpays on late cancels. End rounding drift on surge/tips. Release only the <strong>proven set</strong>—
                tied to fresh Finance/Compliance approvals.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center rounded-xl bg-[var(--brand)] px-5 py-2 text-sm font-semibold text-white shadow hover:opacity-95"
                >
                  Request a pilot
                </Link>
                <Link
                  href="/vgomini"
                  className="inline-flex items-center rounded-xl border border-[var(--brand)] px-5 py-2 text-sm font-semibold text-[var(--brand)] hover:bg-slate-50"
                >
                  View demo
                </Link>
              </div>
            </div>

            <div className="relative h-[240px] overflow-hidden rounded-2xl ring-1 ring-slate-200 sm:h-[300px] md:h-[340px]">
              <Image
                src="/images/market/marketplaces.jpg"
                alt="Marketplaces & Gig market hero"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- WHO THIS IS FOR ---------- */}
      <Section title="Who this is for">
        <div className="grid gap-6 md:grid-cols-3">
          <UICard title="Rides / last‑mile delivery platforms">
            <p>Hundreds of thousands to millions of drivers/couriers daily or weekly; surge, bonuses, tips; multi‑currency.</p>
          </UICard>
          <UICard title="Where pain shows up">
            <p>Rounding drift on surge/tips, re‑runs that change cents, refunds after payout → clawbacks, PSP/GL mismatches.</p>
          </UICard>
          <UICard title="Compliance & audit pressure">
            <p>Need provable equality and approvals tied to the exact outputs—no ad‑hoc evidence packs.</p>
          </UICard>
        </div>
      </Section>

      {/* ---------- WHAT YOU GET ---------- */}
      <Section title="What you get (in plain English)">
        <div className="grid gap-6 md:grid-cols-3">
          <UICard title="No rounding drift">
            <p>Deterministic carry with late quantization—surge/tips stop “moving” on re‑run.</p>
          </UICard>
          <UICard title="Fewer clawbacks">
            <p>Late cancels/refunds do not mutate prior windows; they land in the next window with reasons.</p>
          </UICard>
          <UICard title="Cleaner recon">
            <p>PSP/GL rows tie to <code>window_id</code> + <code>output_digest</code>; auditors verify by replay.</p>
          </UICard>
        </div>
      </Section>

      {/* ---------- BEFORE → AFTER (AT A GLANCE) ---------- */}
      <Section title="Before → After (at a glance)">
        <div className="grid gap-6 lg:grid-cols-2">
          <UICard title="Traditional stack &amp; flow (before)">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li><strong>Data/compute:</strong> Kafka/Kinesis → Spark/Databricks or Snowflake/BigQuery with Airflow/dbt.</li>
              <li><strong>Logic:</strong> SQL/Python aggregates; per‑ride rounding; surge/tips modeled ad hoc.</li>
              <li><strong>Payout rails:</strong> Stripe Connect / Adyen for Platforms; ACH/SEPA files.</li>
              <li><strong>Back office:</strong> NetSuite/Oracle; close/recs via BlackLine/Trintech.</li>
            </ul>
            <p className="mt-3 text-[15px] leading-7 text-slate-700">
              Batches release when the “job finished” — not when replay equals the sealed transcript with fresh approvals.
            </p>
          </UICard>

          <UICard title="Overlay architecture (after)">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li><strong>Deterministic engine:</strong> single‑writer partitions, fixed fold order, 128‑bit integers.</li>
              <li><strong>Late quantization + carry‑ledger:</strong> one‑time rounding; documented ≤½‑unit bound per allocation.</li>
              <li><strong>Transcript + digest:</strong> content‑addressed, replayable evidence of equality.</li>
              <li><strong>Acceptance gate:</strong> Finance ACK + CT (+ optional SPV) with freshness &amp; quorum → only ALLOW releases.</li>
            </ul>
          </UICard>
        </div>
      </Section>

      {/* ---------- HOW IT WORKS (60 seconds) ---------- */}
      <Section title="How it works (60 seconds)">
        <div className="grid gap-6 md:grid-cols-3">
          <UICard title="1) Ingest & compute">
            <p>Order into single‑writer logs; accumulate integers (no FP drift); surge/tips at native precision.</p>
          </UICard>
          <UICard title="2) Window close">
            <p>Close under a monotone watermark; fold in a fixed, published order; quantize once; assign carry deterministically.</p>
          </UICard>
          <UICard title="3) Authorize & disburse">
            <p>Replay equals transcript digest + approvals fresh/in quorum → ALLOW set releases; HOLDs are reason‑coded.</p>
          </UICard>
        </div>
        <p className="mt-4 text-sm text-slate-600">Keep your rails—no rip‑and‑replace.</p>

        {/* Weekly/hourly cadence */}
        <div className="mt-6 rounded-2xl border border-slate-200 p-4">
          <p className="text-sm font-semibold text-slate-900">Hourly cadence (example)</p>
          <ul className="mt-2 grid gap-2 text-[15px] leading-7 text-slate-700 sm:grid-cols-2 lg:grid-cols-5">
            <li><strong>T+0–55m:</strong> Ingest & compute deterministically</li>
            <li><strong>T+55m:</strong> Window close (watermark, fold, quantize, carry)</li>
            <li><strong>T+56m:</strong> Authorize(window_id) — equality + acceptance</li>
            <li><strong>T+57m:</strong> Disburse ALLOW; HOLDs reason‑coded</li>
            <li><strong>Next window:</strong> Late cancels/refunds land here</li>
          </ul>
        </div>
      </Section>

      {/* ---------- ACCEPTANCE POLICY (EXAMPLE) ---------- */}
      <Section title="Acceptance policy (example)">
        <div className="grid gap-6 md:grid-cols-3">
          <UICard title="Required proofs">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li>ACK (Finance reserves) — window‑level</li>
              <li>CT (KYC/OFAC/Tax) — principal/cohort‑level</li>
              <li>SPV (optional) — provider receipt/headers</li>
            </ul>
          </UICard>
          <UICard title="Freshness & quorum">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li>Freshness: ACK ≤ 60m; CT ≤ 24h; SPV ≤ 60m</li>
              <li>Quorum: 2 of 3 (Finance, Compliance, Ops)</li>
            </ul>
          </UICard>
          <UICard title="If unmet">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li>HOLD with reason: <code>STALE_PROOF</code>, <code>INSUFFICIENT_QUORUM</code>, <code>RIGHTS_MISMATCH</code></li>
              <li>Owners alerted; re‑check without mutating outputs</li>
            </ul>
          </UICard>
        </div>
      </Section>

      {/* ---------- FITS YOUR STACK ---------- */}
      <Section title="Fits your stack">
        <div className="grid gap-6 md:grid-cols-3">
          <UICard title="Keep what works">
            <p>Stripe Connect / Adyen for Platforms for payouts; ACH/SEPA rails; NetSuite/Oracle for GL. We run as a pre‑release gate.</p>
          </UICard>

          <UICard title="Add three fields">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li><code>window_id</code> — identifies the payout window</li>
              <li><code>output_digest</code> — ties to the sealed transcript (replay equality)</li>
              <li><code>provider_batch_id</code> — PSP/EBP batch reference</li>
            </ul>
          </UICard>

          <UICard title="One pre‑release call">
            <p className="mb-2 text-[15px] leading-7 text-slate-700">Right before you create the PSP batch:</p>
            <CodePanel title="Authorize">
{String.raw`POST /authorize { window_id }
→ ALLOW roster + HOLD roster with reason codes`}
            </CodePanel>
          </UICard>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <UICard title="Path A — Pay via PSP (fastest)">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li>Create PSP batch from the ALLOW set</li>
              <li>Record Vendor Bills (one per driver per window) in ERP</li>
              <li>Tag rows with <code>window_id</code> and <code>output_digest</code></li>
            </ul>
          </UICard>
          <UICard title="Path B — Pay from ERP (EBP)">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li>Use ALLOW set to build EBP payment file</li>
              <li>Include <code>window_id</code> in memo; capture EBP batch as <code>provider_batch_id</code></li>
              <li>Gate release via <code>Authorize(window_id)</code> before export</li>
            </ul>
          </UICard>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          Data intake options: S3/GCS/SFTP, read‑only DB view, Kafka/Webhook — adapters provided.
        </p>

        <div className="mt-6 rounded-2xl border border-slate-200 p-5">
          <p className="text-sm font-semibold text-slate-900">Where these fields go</p>
          <ul className="mt-2 grid gap-2 text-[15px] leading-7 text-slate-700 sm:grid-cols-2">
            <li><strong>PSP/rails batch metadata:</strong> <code>window_id</code>, <code>output_digest</code>, <code>provider_batch_id</code></li>
            <li><strong>GL (NetSuite/Oracle) custom fields:</strong> <code>custbody_payout_window_id</code>, <code>custbody_output_digest</code>, <code>custbody_provider_batch_id</code></li>
          </ul>
        </div>
      </Section>

      {/* ---------- TECHNICAL DETAILS (COLLAPSED) ---------- */}
      <Section title="Technical details (for software engineers)">
        <details className="rounded-2xl border border-slate-200 p-4">
          <summary className="cursor-pointer select-none text-sm font-semibold text-slate-900">
            View endpoints, data contracts &amp; mappings
          </summary>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <UICard title="API surface">
              <p className="text-[15px] leading-7 text-slate-700">Gate release and fetch evidence:</p>
              <CodePanel title="POST /authorize (window_id)">
{String.raw`// Checks replay digest equality + acceptance matrix (freshness & quorum)
→ Returns: ALLOW roster + HOLD roster with reason codes`}
              </CodePanel>
              <CodePanel title="POST /proofs (submit attestations)">
{String.raw`// Push CT/ACK/SPV payloads; we verify signatures & freshness and update decisions`} 
              </CodePanel>
              <CodePanel title="GET /transcript/{window_id}">
{String.raw`// Content-addressed transcript + output_digest for replay & audit`}
              </CodePanel>
            </UICard>

            <UICard title="Data contracts (minimal)">
              <CodePanel title="Tier 0 — events">
{String.raw`event_id,ts_occurred,principal_id(currency),amount_minor,source_type
// source_type ∈ { fare | surge | tip | refund | adjustment }`}
              </CodePanel>
              <CodePanel title="Tier 2 — attestations (signed JSON)">
{String.raw`// Finance ACK (window-level)
{ "window_id":"2025-09-05/17:00", "reserves_ok":true, "signer":"fin-ops@...", "expires_at":"2025-09-05T18:00:00Z" }

// CT (driver/cohort-level)
{ "principal_id":"DRV-18472", "status":"cleared", "expires_at":"2025-09-06T00:00:00Z" }

// SPV (optional, window-level)
{ "window_id":"2025-09-05/17:00", "provider_batch_id":"ADY-88919", "totals_minor": "123456789", "headers_hash":"0x..." }`}
              </CodePanel>
              <CodePanel title="ERP/PSP delta">
{String.raw`// Add to PSP batch metadata & GL:
window_id, output_digest, provider_batch_id`}
              </CodePanel>
            </UICard>
          </div>
        </details>
      </Section>

      {/* ---------- RESULTS TEAMS AIM FOR ---------- */}
      <Section title="Results teams aim for">
        <div className="grid gap-6 md:grid-cols-3">
          <UICard title="Replay equality ≥ 99.99%">
            <p>Windows where digest(replay) == digest(transcript).</p>
          </UICard>
          <UICard title="Time‑to‑release (p95)">
            <p>Minutes from watermark close to authorized payout (not hours).</p>
          </UICard>
          <UICard title="Disputes ↓ 30–60%">
            <p>Transcript‑based proofs reduce escalations and chargebacks.</p>
          </UICard>
          <UICard title="Change MTTR (bounded)">
            <p>Rollback & recovery bounded to a window via canary → equality → promote.</p>
          </UICard>
          <UICard title="No rounding drift">
            <p>Deterministic carry with ≤½‑ULP bound; surge/tips stay consistent.</p>
          </UICard>
        </div>
        <p className="mt-4 text-xs text-slate-500">Targets are set together during a pilot; they are goals, not guarantees.</p>
      </Section>

      {/* ---------- RISKS & MITIGATIONS ---------- */}
      <Section title="Risks & mitigations">
        <details className="rounded-2xl border border-slate-200 p-4">
          <summary className="cursor-pointer select-none text-sm font-semibold text-slate-900">See risks & how we handle them</summary>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-7 text-slate-700">
            <li>Late/missing proofs → auto‑HOLD; re‑check without mutating outputs.</li>
            <li>Policy/migration defects → digest mismatch; canary + rollback before release.</li>
            <li>Hot partitions → versioned shard function; promote only on digest equality.</li>
          </ul>
        </details>
      </Section>

      {/* ---------- FAQ ---------- */}
      <Section title="FAQ">
        <div className="grid gap-4">
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-900">What about late cancels and refunds?</p>
            <p className="mt-1 text-[15px] leading-7 text-slate-700">
              They never mutate prior windows. We record them as new events in the next window with reason codes. Audit stays clean; no clawback chaos.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-900">Do we change payout rails?</p>
            <p className="mt-1 text-[15px] leading-7 text-slate-700">
              No. You keep Stripe/Adyen/ACH/SEPA and your ERP. We add a pre‑release gate before funds move.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-900">Will surge/tips still round strangely?</p>
            <p className="mt-1 text-[15px] leading-7 text-slate-700">
              No. We quantize once per window and assign sub‑cents in a fixed, documented order (carry‑ledger). Replays match bit‑for‑bit.
            </p>
          </div>
        </div>
      </Section>

      {/* ---------- PILOT CTA ---------- */}
      <Section title="Pilot in 30 days">
        <div className="grid gap-6 md:grid-cols-3">
          <UICard title="What we’ll ask in discovery">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li>What must be true before you release a payout file today? Who signs off?</li>
              <li>How often do you see clawbacks from refunds after payout?</li>
              <li>Where do PSP totals vs GL differ today, and by how much?</li>
            </ul>
          </UICard>
          <UICard title="Next step">
            <p>Gate one cohort for two windows; measure equality, reasons, and time‑to‑release.</p>
          </UICard>
          <div className="flex items-center justify-center">
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-xl bg-[var(--brand)] px-5 py-2 text-sm font-semibold text-white shadow hover:opacity-95"
              >
                Request a pilot
              </Link>
              <Link
                href="/vgomini"
                className="inline-flex items-center rounded-xl border border-[var(--brand)] px-5 py-2 text-sm font-semibold text-[var(--brand)] hover:bg-slate-50"
              >
                View demo
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
