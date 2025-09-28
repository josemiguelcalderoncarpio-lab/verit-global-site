// src/app/market/exchanges/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Section, Card as UICard, CodePanel } from "../../../components/UI";

export default function ExchangesIndustryPage() {
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
                Settle LPs, validators, and users exactly—across chain and fiat.
              </h1>
              <p className="mt-4 text-[15px] leading-7 text-slate-700 sm:text-base">
                Cross‑domain mismatches (off‑chain books vs on‑chain payouts) and micro‑fee drift shouldn’t exist. We release only the
                <strong> proven set</strong>—bound to on‑chain headers/receipts and fresh approvals—so replays match bit‑for‑bit.
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
                src="/images/market/exchanges.jpg"
                alt="Exchanges & Digital-Asset Platforms market hero"
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
          <UICard title="CEX / hybrid exchanges & Web3 platforms">
            <p>Splitting trading fees, staking yields, or rebates with LPs, validators, and users across on‑chain and fiat rails.</p>
          </UICard>
          <UICard title="Where pain shows up">
            <p>Off‑chain vs on‑chain mismatches, re‑runs that change cents/wei, micro‑fee rounding drift, finality not tied to payouts, heavy audit lift.</p>
          </UICard>
          <UICard title="Outcome we target">
            <p>Wei/penny‑exact, cross‑domain‑verified disbursements; replayable transcripts; approvals fresh/in‑quorum; clean audits.</p>
          </UICard>
        </div>
      </Section>

      {/* ---------- WHAT YOU GET ---------- */}
      <Section title="What you get (in plain English)">
        <div className="grid gap-6 md:grid-cols-3">
          <UICard title="No micro‑fee drift">
            <p>Integer math + late quantization + deterministic carry—sub‑cents/wei assigned once per window.</p>
          </UICard>
          <UICard title="Cross‑domain proof">
            <p>Bind payouts to on‑chain headers/receipts (SPV) and sealed transcripts; auditors can replay and verify.</p>
          </UICard>
          <UICard title="Safer policy changes">
            <p>Canary + digest equality across versions; promotion only on equality; rollback bounded to a window.</p>
          </UICard>
        </div>
      </Section>

      {/* ---------- BEFORE → AFTER (AT A GLANCE) ---------- */}
      <Section title="Before → After (at a glance)">
        <div className="grid gap-6 lg:grid-cols-2">
          <UICard title="Traditional stack &amp; flow (before)">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li><strong>Off‑chain:</strong> matching engine + warehouse fees (Snowflake/BigQuery/Spark) with FP math & per‑trade rounding</li>
              <li><strong>Payout rails:</strong> on‑chain programs/custody wallets and/or ACH/SEPA/PSPs</li>
              <li><strong>Back office:</strong> subledger/ERP + spreadsheets, monthly close tools</li>
            </ul>
            <p className="mt-3 text-[15px] leading-7 text-slate-700">
              Re‑runs shift cents/wei; finality not tied to payout; no replay‑proof that “this batch exactly equals those inputs.” Audits are heavy.
            </p>
          </UICard>

          <UICard title="Overlay architecture (after)">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li><strong>Deterministic engine:</strong> single‑writer logs/partitions; fixed fold order; i128 accumulation.</li>
              <li><strong>Late quantization + carry‑ledger:</strong> round once at finalization; ≤½‑ULP bound; assignments recorded.</li>
              <li><strong>Transcript + output_digest:</strong> content‑addressed, replayable evidence; require digest equality.</li>
              <li><strong>Acceptance gate:</strong> Finance ACK + CT (KYC/OFAC/Tax) + optional SPV headers/receipts; freshness & quorum.</li>
              <li><strong>Cross‑domain adapter:</strong> verify on‑chain block header / custody receipt inside the same audited pipeline.</li>
            </ul>
          </UICard>
        </div>
      </Section>

      {/* ---------- HOW IT WORKS (60 seconds) ---------- */}
      <Section title="How it works (60 seconds)">
        <div className="grid gap-6 md:grid-cols-3">
          <UICard title="1) Ingest & compute">
            <p>Normalize maker/taker fees, rebates, staking rewards into ordered logs with idempotency; compute deterministically in integers.</p>
          </UICard>
          <UICard title="2) Window close">
            <p>Advance a monotone watermark; fold in a fixed order; late quantize; assign carry deterministically; seal transcript & digest.</p>
          </UICard>
          <UICard title="3) Authorize & disburse">
            <p>Require replay equality + acceptance success (ACK/CT and optional SPV). Release only the ALLOW set; HOLDs reason‑coded.</p>
          </UICard>
        </div>
        <p className="mt-4 text-sm text-slate-600">Keep your rails—no rip‑and‑replace.</p>

        {/* Hourly cadence */}
        <div className="mt-6 rounded-2xl border border-slate-200 p-4">
          <p className="text-sm font-semibold text-slate-900">Hourly cadence (example)</p>
          <ul className="mt-2 grid gap-2 text-[15px] leading-7 text-slate-700 sm:grid-cols-2 lg:grid-cols-5">
            <li><strong>T+0–55m:</strong> Ingest & compute deterministically</li>
            <li><strong>T+55m:</strong> Window close (watermark, fold, quantize, carry)</li>
            <li><strong>T+56m:</strong> Authorize(window_id) — equality + acceptance</li>
            <li><strong>T+57m:</strong> Disburse ALLOW (on‑chain or ACH/PSP); HOLDs reason‑coded</li>
            <li><strong>Next window:</strong> Late trades/chargebacks land here</li>
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
              <li>SPV (optional) — on‑chain block header/Merkle proof or custody/bank receipt headers</li>
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
              <li>HOLD with reason: <code>STALE_PROOF</code>, <code>INSUFFICIENT_QUORUM</code>, <code>INVALID_SIGNATURE</code></li>
              <li>Owners alerted; re‑check without mutating outputs</li>
            </ul>
          </UICard>
        </div>
      </Section>

      {/* ---------- FITS YOUR STACK ---------- */}
      <Section title="Fits your stack">
        <div className="grid gap-6 md:grid-cols-3">
          <UICard title="Keep what works">
            <p>Keep your on‑chain programs/custody wallets and/or ACH/SEPA rails, plus your ERP/subledger. We add a pre‑release gate.</p>
          </UICard>

          <UICard title="Add three fields">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li><code>window_id</code> — identifies the payout window</li>
              <li><code>output_digest</code> — ties to the sealed transcript (replay equality)</li>
              <li><code>provider_batch_id</code> — tx batch hash / custody receipt / PSP batch reference</li>
            </ul>
          </UICard>

          <UICard title="One pre‑release call">
            <p className="mb-2 text-[15px] leading-7 text-slate-700">Right before you post transfers or create the ACH/PSP batch:</p>
            <CodePanel title="Authorize">
{String.raw`POST /authorize { window_id }
→ ALLOW roster + HOLD roster with reason codes`}
            </CodePanel>
          </UICard>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <UICard title="Path A — On‑chain (programmatic)">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li>Execute on‑chain batch for ALLOW set</li>
              <li>Record <code>provider_batch_id</code> (tx batch hash)</li>
              <li>POST <code>/proofs</code> with SPV headers/headers_hash to close the loop</li>
            </ul>
          </UICard>
          <UICard title="Path B — Off‑chain (ACH/PSP)">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li>Create PSP/ACH file from ALLOW set</li>
              <li>Include <code>window_id</code> in memo; capture batch ref as <code>provider_batch_id</code></li>
              <li>Optional: SPV receipt from custody/bank after execution</li>
            </ul>
          </UICard>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          Data intake options: S3/GCS/SFTP, read‑only DB view, Kafka/Webhook — adapters provided.
        </p>

        <div className="mt-6 rounded-2xl border border-slate-200 p-5">
          <p className="text-sm font-semibold text-slate-900">Where these fields go</p>
          <ul className="mt-2 grid gap-2 text-[15px] leading-7 text-slate-700 sm:grid-cols-2">
            <li><strong>On‑chain/PSP batch metadata:</strong> <code>window_id</code>, <code>output_digest</code>, <code>provider_batch_id</code></li>
            <li><strong>GL/subledger custom fields:</strong> <code>custbody_payout_window_id</code>, <code>custbody_output_digest</code>, <code>custbody_provider_batch_id</code>, <code>custbody_transcript_url</code></li>
          </ul>
        </div>
      </Section>

      {/* ---------- TECHNICAL DETAILS (COLLAPSED) ---------- */}
      <Section title="Technical details (for software engineers)">
        <details className="rounded-2xl border border-slate-200 p-4">
          <summary className="cursor-pointer select-none text-sm font-semibold text-slate-900">
            View endpoints, SPV, data contracts &amp; mappings
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

            <UICard title="SPV (simple proof of validity)">
              <ul className="mt-2 list-disc space-y-2 pl-5">
                <li>On‑chain: block header + Merkle proof (chain_id, height, root)</li>
                <li>Custody/bank: receipt headers (batch id, totals, timestamp, signature)</li>
                <li>We bind these to the same <code>window_id</code> and <code>output_digest</code> for cross‑domain proof</li>
              </ul>
            </UICard>

            <UICard title="Data contracts (minimal)">
              <CodePanel title="Tier 0 — fee/rebate/reward events">
{String.raw`event_id,ts_occurred,principal_id,instrument,currency,amount_minor,source_type(maker_fee|taker_fee|rebate|stake_reward|refund|adjustment),chain_id?`}
              </CodePanel>
              <CodePanel title="Tier 2 — attestations (signed JSON)">
{String.raw`// Finance ACK (window-level)
{ "window_id":"2025-09-05/17:00", "reserves_ok":true, "signer":"fin-ops@...", "expires_at":"2025-09-05T18:00:00Z" }

// CT (principal/cohort-level)
{ "principal_id":"LP-99102", "status":"cleared", "expires_at":"2025-09-06T00:00:00Z" }

// SPV (optional, window-level)
{ "window_id":"2025-09-05/17:00", "provider_batch_id":"TXB-88919", "totals_minor":"123456789", "headers_hash":"0x..." }`}
              </CodePanel>
              <CodePanel title="ERP/PSP/on-chain delta">
{String.raw`// Add to payout metadata & GL:
window_id, output_digest, provider_batch_id, transcript_url`}
              </CodePanel>
            </UICard>

            <UICard title="Worked micro‑example">
              <CodePanel title="Off‑chain → on‑chain with SPV">
{String.raw`// Hourly window W: $12,345.67 fees to 3 LPs; LP-B CT stale
i128 accumulate → late quantize → carry-ledger (2 sub-cents assigned deterministically)
Seal transcript → output_digest=0xabc... → Authorize(W)
// HOLD(LP-B, STALE_PROOF); ALLOW LP-A/C
Execute on-chain batch → provider_batch_id=0x...; POST SPV headers_hash
Persist window_id/output_digest/provider_batch_id in subledger/ERP`}              
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
          <UICard title="Wei/penny‑exact outcomes">
            <p>Late quantization + deterministic carry assigns sub‑units once; no drift on micro‑fees.</p>
          </UICard>
          <UICard title="Time‑to‑release (p95)">
            <p>Minutes from watermark close to authorized disbursement once proofs are fresh.</p>
          </UICard>
          <UICard title="Reason‑coded blocks">
            <p>Counts by reason (<code>DIGEST_MISMATCH</code>, <code>STALE_PROOF</code>, etc.) visible per window.</p>
          </UICard>
          <UICard title="Migration safety">
            <p>Promote only on digest equality across versions; canary and rollback bound risk.</p>
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
            <li>Policy/migration defects → digest mismatch; canary + rollback; bounded exposure.</li>
            <li>Hot markets/partitions → versioned shard function; promote only on digest equality.</li>
          </ul>
        </details>
      </Section>

      {/* ---------- FAQ ---------- */}
      <Section title="FAQ">
        <div className="grid gap-4">
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-900">How do you reconcile off‑chain accounting with on‑chain payouts?</p>
            <p className="mt-1 text-[15px] leading-7 text-slate-700">
              We bind the same <code>window_id</code> and <code>output_digest</code> to both the sealed transcript and the on‑chain/custody receipt via SPV headers, so a replay can prove equality end‑to‑end.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-900">Will we need new payout rails or smart contracts?</p>
            <p className="mt-1 text-[15px] leading-7 text-slate-700">
              No. Keep your contracts and rails. We add a pre‑release gate and a tiny SPV receipt to tie the payout back to the transcript.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-900">What about re‑runs that used to change wei/cents?</p>
            <p className="mt-1 text-[15px] leading-7 text-slate-700">
              Integer math + late quantization + deterministic carry mean a re‑run produces the same outputs bit‑for‑bit. If not, it won’t authorize.
            </p>
          </div>
        </div>
      </Section>

      {/* ---------- PILOT CTA ---------- */}
      <Section title="Pilot in 30 days">
        <div className="grid gap-6 md:grid-cols-3">
          <UICard title="What we’ll ask in discovery">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li>Which markets/LP cohorts and rails (on‑chain vs ACH/PSP) are in scope?</li>
              <li>Where do off‑chain vs on‑chain totals differ today, and by how much?</li>
              <li>What must be true before cash moves? Who signs off?</li>
            </ul>
          </UICard>
          <UICard title="Next step">
            <p>Pilot a cohort for N hourly/daily windows; measure equality, reasons, and time‑to‑release.</p>
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
