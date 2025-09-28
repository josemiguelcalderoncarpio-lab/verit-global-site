// src/app/market/creators/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Section, Card as UICard, CodePanel } from "../../../components/UI";

export default function CreatorsIndustryPage() {
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
                Pay creators and affiliates exactly, every time.
              </h1>
              <p className="mt-4 text-[15px] leading-7 text-slate-700 sm:text-base">
                End rounding drift, re‑run surprises, and spreadsheet reconciliations. Only the <strong>proven set</strong> releases—
                with Finance &amp; Tax sign‑off in one place.
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
                src="/images/market/creators.jpg"
                alt="Creators market hero"
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
          <UICard title="Large creator / affiliate networks">
            <p>250k–500k+ payees across ads, ecommerce, sponsorships, bonuses, and refunds.</p>
          </UICard>
          <UICard title="Multi‑source revenue &amp; adjustments">
            <p>Multiple data feeds (impressions, clicks, orders) + corrections (refunds/chargebacks).</p>
          </UICard>
          <UICard title="Ops &amp; finance under pressure">
            <p>Pain today: rounding drift, disputes, slow reconciliations, change/migration risk, audit friction.</p>
          </UICard>
        </div>
      </Section>

      {/* ---------- WHAT YOU GET ---------- */}
      <Section title="What you get (in plain English)">
        <div className="grid gap-6 md:grid-cols-3">
          <UICard title="Fewer creator disputes">
            <p>Statements replay identically; cents add up the same way—every time.</p>
          </UICard>
          <UICard title="Penny‑exact outcomes">
            <p>Integer math + deterministic carry with a clear, documented policy.</p>
          </UICard>
          <UICard title="Faster close &amp; clean recon">
            <p>PSP/GL rows tie back to a transcript digest—no more “why is this off by a cent?”.</p>
          </UICard>
        </div>
      </Section>

      {/* ---------- BEFORE → AFTER (AT A GLANCE) ---------- */}
      <Section title="Before → After (at a glance)">
        <div className="grid gap-6 lg:grid-cols-2">
          <UICard title="Traditional stack &amp; flow (before)">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li><strong>Data:</strong> Snowflake/BigQuery (+ Airflow/dbt) aggregate impressions/clicks/revenue.</li>
              <li><strong>Logic:</strong> SQL/Python jobs with floating‑point math; per‑item rounding.</li>
              <li><strong>Payout:</strong> Stripe Connect / PayPal Payouts / Tipalti bulk files.</li>
              <li><strong>Back office:</strong> NetSuite; close/recs in BlackLine/Trintech.</li>
            </ul>
            <p className="mt-3 text-[15px] leading-7 text-slate-700">
              Proof gaps: batches release because “job finished,” not because replay matched and Finance/Tax approvals were fresh and bound.
            </p>
          </UICard>

          <UICard title="Overlay architecture (after)">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li><strong>Deterministic engine:</strong> single‑writer partitions, canonical fold order, 128‑bit integers.</li>
              <li><strong>Late quantization + carry‑ledger:</strong> one‑time rounding in a documented, reproducible order.</li>
              <li><strong>Acceptance matrix:</strong> Finance ACK + Tax/CT (and optional SPV) with freshness &amp; quorum.</li>
              <li><strong>Authorize(window_id):</strong> returns ALLOW/HOLD with reason codes; only ALLOW releases.</li>
            </ul>
          </UICard>
        </div>
      </Section>

      {/* ---------- HOW IT WORKS (60 seconds) ---------- */}
      <Section title="How it works (60 seconds)">
        <div className="grid gap-6 md:grid-cols-3">
          <UICard title="1) Compute consistently">
            <p>We compute your weekly window deterministically—no order or rounding drift.</p>
          </UICard>
          <UICard title="2) Approve once, with evidence">
            <p>Finance ACK + Tax/Compliance attestations stay fresh and bound to the exact outputs.</p>
          </UICard>
          <UICard title="3) Release the proven set">
            <p>We authorize the ALLOW set only; the rest wait with reason‑coded HOLDs.</p>
          </UICard>
        </div>
        <p className="mt-4 text-sm text-slate-600">Keep your rails—no rip‑and‑replace.</p>
      </Section>

      {/* ---------- FITS YOUR STACK (IMPROVED) ---------- */}
      <Section title="Fits your stack">
        <div className="grid gap-6 md:grid-cols-3">
          <UICard title="Keep what works">
            <p>Stripe, Adyen, PayPal, Tipalti for payouts; NetSuite for GL. We sit in front as a pre‑release gate.</p>
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

        <div className="mt-6 rounded-2xl border border-slate-200 p-5">
          <p className="text-sm font-semibold text-slate-900">Where these fields go</p>
          <ul className="mt-2 grid gap-2 text-[15px] leading-7 text-slate-700 sm:grid-cols-2">
            <li><strong>PSP/rails batch metadata:</strong> <code>window_id</code>, <code>output_digest</code>, <code>provider_batch_id</code></li>
            <li><strong>GL (NetSuite) custom fields:</strong> <code>custbody_payout_window_id</code>, <code>custbody_output_digest</code>, <code>custbody_provider_batch_id</code></li>
          </ul>
        </div>
      </Section>

      {/* ---------- TECHNICAL DETAILS (COLLAPSED) ---------- */}
      <Section title="Technical details (for software engineers)">
        <details className="rounded-2xl border border-slate-200 p-4">
          <summary className="cursor-pointer select-none text-sm font-semibold text-slate-900">
            View endpoints &amp; mappings
          </summary>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <UICard title="Endpoints">
              <p className="text-[15px] leading-7 text-slate-700">Use these calls to gate release and fetch evidence:</p>
              <CodePanel title="POST /authorize (window_id)">
{String.raw`// Evaluates replay equality + acceptance matrix (ACK/CT/SPV freshness & quorum)
→ Returns: ALLOW roster + HOLD roster with reason codes`}
              </CodePanel>
              <CodePanel title="POST /proofs (submit attestations)">
{String.raw`// Push CT/ACK/SPV payloads; we verify signatures & freshness and update decisions`} 
              </CodePanel>
              <CodePanel title="GET /transcript/{window_id}">
{String.raw`// Sealed transcript + output_digest for replay & audit`}
              </CodePanel>
            </UICard>

            <UICard title="Artifacts & mappings">
              <p className="text-[15px] leading-7 text-slate-700">What auditors and finance receive & where it lands:</p>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                <li>Sealed transcript (per window) with <code>output_digest</code></li>
                <li>ALLOW/HOLD rosters + reason codes</li>
                <li>Carry‑ledger (optional) for sub‑cent traceability</li>
              </ul>
              <CodePanel title="NetSuite mapping (ready to import)">
{String.raw`// Vendor Bill/Payment custom fields:
custbody_payout_window_id
custbody_output_digest
custbody_provider_batch_id
custbody_transcript_url`}
              </CodePanel>
            </UICard>
          </div>
        </details>
      </Section>

      {/* ---------- RESULTS TEAMS AIM FOR ---------- */}
      <Section title="Results teams aim for">
        <div className="grid gap-6 md:grid-cols-3">
          <UICard title="Replays match ≥ 99.99%">
            <p>Digest(replay) equals digest(transcript) across windows and re‑runs.</p>
          </UICard>
          <UICard title="Disputes ↓ 30–60%">
            <p>Proof‑backed statements and reason‑coded holds reduce escalations.</p>
          </UICard>
          <UICard title="Minutes, not hours">
            <p>Time from window close to authorized disbursement measured in minutes.</p>
          </UICard>
        </div>
        <p className="mt-4 text-xs text-slate-500">Targets are set together during a pilot; they are goals, not guarantees.</p>
      </Section>

      {/* ---------- PILOT CTA ---------- */}
      <Section title="Pilot in 30 days">
        <div className="grid gap-6 md:grid-cols-3">
          <UICard title="What we’ll ask in discovery">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li>What must be true before you release a payout file today? Who signs off?</li>
              <li>Have you ever rolled back or reissued a payout run? Why and how long?</li>
              <li>How do you prove equality across versions or after replay?</li>
            </ul>
          </UICard>
          <UICard title="Next step">
            <p>Gate one cohort for two windows; measure replays, reasons, and promotion time.</p>
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
