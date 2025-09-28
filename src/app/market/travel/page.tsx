// src/app/market/travel/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Section, Card as UICard, CodePanel } from "../../../components/UI";

export default function TravelIndustryPage() {
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
                Payout suppliers with confidence—even through refund waves.
              </h1>
              <p className="mt-4 text-[15px] leading-7 text-slate-700 sm:text-base">
                Refund waves, FX drift, and migrations shouldn’t break payouts. We release only the <strong>proven set</strong>—
                tied to fresh Finance/Compliance approvals—so overpayments stop and audits get simpler.
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
                src="/images/market/travel.jpg"
                alt="Travel / Supplier payouts market hero"
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
          <UICard title="OTAs, booking platforms, aggregators">
            <p>Paying tens to hundreds of thousands of suppliers (hotels, airlines, car rentals, agencies) weekly or monthly.</p>
          </UICard>
          <UICard title="Where pain shows up">
            <p>Refund waves cause overpayments and clawbacks; multi‑currency rounding drift; ERP/PSP mismatches; migration risk; audit burden.</p>
          </UICard>
          <UICard title="Outcome we target">
            <p>Only proven payouts release; affected suppliers HOLD with clear reasons until proofs are fresh.</p>
          </UICard>
        </div>
      </Section>

      {/* ---------- WHAT YOU GET ---------- */}
      <Section title="What you get (in plain English)">
        <div className="grid gap-6 md:grid-cols-3">
          <UICard title="Overpayment prevention">
            <p>Refund waves no longer leak into already‑exported payouts; impacted suppliers HOLD with a reason.</p>
          </UICard>
          <UICard title="Deterministic & penny‑exact">
            <p>Integer math with late quantization + carry‑ledger; replay equals transcript—no drift.</p>
          </UICard>
          <UICard title="Cleaner audits & recon">
            <p>Vendor Bills/Payments carry <code>window_id</code> + <code>output_digest</code>; PSP/ERP tie back instantly.</p>
          </UICard>
        </div>
      </Section>

      {/* ---------- BEFORE → AFTER (AT A GLANCE) ---------- */}
      <Section title="Before → After (at a glance)">
        <div className="grid gap-6 lg:grid-cols-2">
          <UICard title="Traditional stack &amp; flow (before)">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li><strong>ERP:</strong> NetSuite, Oracle, SAP for vendor bills + AP</li>
              <li><strong>Rails:</strong> Tipalti, Payoneer, bank/ACH/SEPA wires</li>
              <li><strong>Data/compute:</strong> bookings in a SQL warehouse or custom ETL</li>
              <li><strong>Close/recs:</strong> spreadsheets + BlackLine/Trintech</li>
            </ul>
            <p className="mt-3 text-[15px] leading-7 text-slate-700">
              Refunds often hit after the payout file is exported → overpayments &amp; clawbacks; migrations cause off‑by‑cent differences; audits rely on spreadsheets.
            </p>
          </UICard>

          <UICard title="Overlay architecture (after)">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li><strong>Deterministic engine:</strong> canonical fold order, 128‑bit integers, no intermediate rounding.</li>
              <li><strong>Late quantization + carry‑ledger:</strong> deterministic sub‑cent assignment with ≤½‑ULP bound.</li>
              <li><strong>Transcript + output_digest:</strong> sealed record; replay always yields the same digest.</li>
              <li><strong>Acceptance gate:</strong> Finance ACK + Compliance/Tax (optional PSP SPV); reason‑coded HOLDs.</li>
              <li><strong>Cross‑version equality:</strong> migrations promote only when digests match.</li>
            </ul>
          </UICard>
        </div>
      </Section>

      {/* ---------- HOW IT WORKS (60 seconds) ---------- */}
      <Section title="How it works (60 seconds)">
        <div className="grid gap-6 md:grid-cols-3">
          <UICard title="1) Ingest & compute">
            <p>Booking/refund events ingested with idempotency; accumulate integers for base rates, commissions, FX.</p>
          </UICard>
          <UICard title="2) Window close">
            <p>Weekly/monthly watermark closes; fold in canonical order; quantize once; carry assigned deterministically; seal transcript & digest.</p>
          </UICard>
          <UICard title="3) Authorize & disburse">
            <p>Replay equals transcript & proofs are fresh → ALLOW set exports; affected suppliers HOLD with reasons until proofs refresh.</p>
          </UICard>
        </div>
        <p className="mt-4 text-sm text-slate-600">Keep your rails—no rip‑and‑replace.</p>

        {/* Weekly cadence */}
        <div className="mt-6 rounded-2xl border border-slate-200 p-4">
          <p className="text-sm font-semibold text-slate-900">Weekly cadence (example)</p>
          <ul className="mt-2 grid gap-2 text-[15px] leading-7 text-slate-700 sm:grid-cols-2 lg:grid-cols-5">
            <li><strong>Mon–Thu:</strong> Ingest & compute deterministically</li>
            <li><strong>Fri 17:00:</strong> Window close (watermark, fold, quantize, carry)</li>
            <li><strong>Fri 17:05:</strong> Authorize(window_id) — equality + acceptance</li>
            <li><strong>Fri 17:10:</strong> Export ALLOW to Tipalti/Payoneer/bank; HOLDs reason‑coded</li>
            <li><strong>Next window:</strong> Refund adjustments land here (no silent rewrites)</li>
          </ul>
        </div>
      </Section>

      {/* ---------- ACCEPTANCE POLICY (EXAMPLE) ---------- */}
      <Section title="Acceptance policy (example)">
        <div className="grid gap-6 md:grid-cols-3">
          <UICard title="Required proofs">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li>ACK (Finance reserves) — window‑level</li>
              <li>CT (Tax/KYC/sanctions) — supplier/cohort‑level</li>
              <li>SPV (optional) — PSP/bank receipt</li>
            </ul>
          </UICard>
          <UICard title="Freshness & quorum">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li>Freshness: ACK ≤ 24h; CT ≤ 7d; SPV ≤ 24h</li>
              <li>Quorum: 2 of 3 (Finance, Compliance, Ops)</li>
            </ul>
          </UICard>
          <UICard title="If unmet">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li>HOLD with reason: <code>STALE_PROOF</code>, <code>REFUND_PENDING</code>, <code>INSUFFICIENT_QUORUM</code></li>
              <li>Owners alerted; re‑check without mutating outputs</li>
            </ul>
          </UICard>
        </div>
      </Section>

      {/* ---------- FITS YOUR STACK ---------- */}
      <Section title="Fits your stack">
        <div className="grid gap-6 md:grid-cols-3">
          <UICard title="Keep what works">
            <p>Tipalti, Payoneer, or bank wires for payouts; NetSuite/Oracle/SAP for GL. We run as a pre‑release gate.</p>
          </UICard>

          <UICard title="Add three fields">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li><code>window_id</code> — identifies the payout window</li>
              <li><code>output_digest</code> — ties to the sealed transcript (replay equality)</li>
              <li><code>provider_batch_id</code> — PSP/EBP/bank batch reference</li>
            </ul>
          </UICard>

          <UICard title="One pre‑release call">
            <p className="mb-2 text-[15px] leading-7 text-slate-700">Right before you export the payout file:</p>
            <CodePanel title="Authorize">
{String.raw`POST /authorize { window_id }
→ ALLOW roster + HOLD roster with reason codes`}
            </CodePanel>
          </UICard>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <UICard title="Path A — Pay via PSP (Tipalti/Payoneer/bank)">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li>Export ALLOW set to PSP/bank as usual</li>
              <li>Create/attach <code>provider_batch_id</code> from the rail</li>
              <li>Record Vendor Bills/Payments per supplier per window in ERP</li>
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
            <li><strong>GL (NetSuite) custom fields:</strong> <code>custbody_payout_window_id</code>, <code>custbody_output_digest</code>, <code>custbody_provider_batch_id</code>, <code>custbody_transcript_url</code></li>
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
{String.raw`// Verifies replay digest equality + acceptance matrix (freshness & quorum)
→ Returns: ALLOW roster + HOLD roster with reason codes`}
              </CodePanel>
              <CodePanel title="POST /proofs (submit attestations)">
{String.raw`// Push CT/ACK/SPV payloads; we verify signatures & freshness and update decisions`} 
              </CodePanel>
              <CodePanel title="GET /transcript/{window_id}">
{String.raw`// Sealed transcript + output_digest for replay & audit`}
              </CodePanel>
            </UICard>

            <UICard title="Data contracts (minimal)">
              <CodePanel title="Tier 0 — booking/refund events">
{String.raw`event_id,ts_occurred,supplier_id,currency,amount_minor,source_type(ex: booking|refund|adjustment),external_ref`}
              </CodePanel>
              <CodePanel title="Tier 1 — supplier registry">
{String.raw`supplier_id,bank_token,tax_status,residency_country,withholding_rate`}
              </CodePanel>
              <CodePanel title="Tier 2 — attestations (signed JSON)">
{String.raw`// Finance ACK (window-level)
{ "window_id":"2025-09-05/weekly", "reserves_ok":true, "signer":"fin-ops@...", "expires_at":"2025-09-06T00:00:00Z" }

// Compliance/Tax CT (supplier-level)
{ "supplier_id":"HOTEL-4812", "status":"cleared", "expires_at":"2025-09-10T00:00:00Z" }

// SPV (optional, window-level)
{ "window_id":"2025-09-05/weekly", "provider_batch_id":"TIP-33991", "totals_minor": "123456789", "headers_hash":"0x..." }`}
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
          <UICard title="Overpayment prevention">
            <p>Blocks 100% of overpayments from refund waves by HOLDing affected suppliers.</p>
          </UICard>
          <UICard title="Replay equality ≥ 99.99%">
            <p>Windows where digest(replay) == digest(transcript).</p>
          </UICard>
          <UICard title="Same‑day time‑to‑release">
            <p>Authorized disbursement same‑day after window close when proofs are fresh.</p>
          </UICard>
          <UICard title="Disputes ↓ 40–60%">
            <p>Transcript‑based proofs reduce supplier support burden.</p>
          </UICard>
          <UICard title="Audit efficiency">
            <p>Transcripts replace thousands of spreadsheet lookups during audit.</p>
          </UICard>
        </div>
        <p className="mt-4 text-xs text-slate-500">Targets are set together during a pilot; they are goals, not guarantees.</p>
      </Section>

      {/* ---------- RISKS & MITIGATIONS ---------- */}
      <Section title="Risks & mitigations">
        <details className="rounded-2xl border border-slate-200 p-4">
          <summary className="cursor-pointer select-none text-sm font-semibold text-slate-900">See risks & how we handle them</summary>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-7 text-slate-700">
            <li>Refund tsunami → stale CT proofs: reason‑coded HOLD; unaffected suppliers paid on time.</li>
            <li>Migration mismatch: digest mismatch → rollback + bounded exposure.</li>
            <li>Hot suppliers: shard function + dual‑write; promote only on digest equality.</li>
          </ul>
        </details>
      </Section>

      {/* ---------- FAQ ---------- */}
      <Section title="FAQ">
        <div className="grid gap-4">
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-900">What if refunds hit after we exported the payout file?</p>
            <p className="mt-1 text-[15px] leading-7 text-slate-700">
              Impacted suppliers are automatically HOLD with a clear reason (<code>REFUND_PENDING</code>). Unaffected suppliers are paid on time. The adjustments post in the next window—no silent rewrites.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-900">Do we change payout rails?</p>
            <p className="mt-1 text-[15px] leading-7 text-slate-700">
              No. Keep Tipalti/Payoneer/bank and your ERP. We add a pre‑release gate before funds move.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-900">How do migrations work safely?</p>
            <p className="mt-1 text-[15px] leading-7 text-slate-700">
              We run dual for a canary cohort and only promote when the new logic produces identical digests to the old system for N windows.
            </p>
          </div>
        </div>
      </Section>

      {/* ---------- PILOT CTA ---------- */}
      <Section title="Pilot in 30 days">
        <div className="grid gap-6 md:grid-cols-3">
          <UICard title="What we’ll ask in discovery">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li>How often do refunds arrive after your payout cutoff?</li>
              <li>Which rails (Tipalti/Payoneer/bank) and ERP fields do you use today?</li>
              <li>Where do PSP totals vs ERP differ, and by how much?</li>
            </ul>
          </UICard>
          <UICard title="Next step">
            <p>Gate one supplier cohort for two windows; measure equality, reasons, and time‑to‑release.</p>
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
