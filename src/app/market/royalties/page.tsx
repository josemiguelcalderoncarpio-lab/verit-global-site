// src/app/market/royalties/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Section, Card as UICard, CodePanel } from "../../../components/UI";

export default function RoyaltiesIndustryPage() {
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
                Pay rightsholders penny‑exact—every cycle.
              </h1>
              <p className="mt-4 text-[15px] leading-7 text-slate-700 sm:text-base">
                Sub‑cents, recoup waterfalls, FX, and rights holds shouldn’t break payouts. We release only the
                <strong> proven set</strong>—tied to fresh Finance and Rights/Tax approvals—so replays match bit‑for‑bit and audits are simpler.
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
                src="/images/market/royalties.jpg"
                alt="Royalties / Media & IP market hero"
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
          <UICard title="Labels, publishers, distributors, platforms">
            <p>Paying thousands to hundreds of thousands of rightsholders (artists, writers, producers, PROs) per cycle across streaming, downloads, sync, UGC—often with advances/recoupment and cross‑currency FX.</p>
          </UICard>
          <UICard title="Where pain shows up">
            <p>Sub‑cent payouts, opaque rounding, spreadsheet reruns that change cents, ad‑hoc recoup maths, migration/FX drift, and brutal audits/disputes.</p>
          </UICard>
          <UICard title="Outcome we target">
            <p>Penny‑exact, explainable allocations; rights holds are clear and auditable; replays match transcripts—so disputes drop and audits speed up.</p>
          </UICard>
        </div>
      </Section>

      {/* ---------- WHAT YOU GET ---------- */}
      <Section title="What you get (in plain English)">
        <div className="grid gap-6 md:grid-cols-3">
          <UICard title="No rounding drift">
            <p>Late quantization + deterministic carry‑ledger: assign sub‑cents once per window in a fixed, documented order.</p>
          </UICard>
          <UICard title="Deterministic recoup">
            <p>Recoup waterfalls (advance → costs → royalty) execute in a fixed order; equality is provable via transcript digest.</p>
          </UICard>
          <UICard title="Clean audits & fewer disputes">
            <p>PSP/GL rows tie to <code>window_id</code> + <code>output_digest</code>; replay proves cents and reasons.</p>
          </UICard>
        </div>
      </Section>

      {/* ---------- BEFORE → AFTER (AT A GLANCE) ---------- */}
      <Section title="Before → After (at a glance)">
        <div className="grid gap-6 lg:grid-cols-2">
          <UICard title="Traditional stack &amp; flow (before)">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li><strong>Ingest:</strong> DSP/UGC statements (CSV/XML) into a warehouse or royalties package.</li>
              <li><strong>Logic:</strong> SQL/Python + sheets; per‑line/per‑work rounding; ad‑hoc recoup.</li>
              <li><strong>Payout/GL:</strong> Tipalti/Payoneer/PayPal/bank; SAP/NetSuite; close/recs with BlackLine/Trintech + spreadsheets.</li>
            </ul>
            <p className="mt-3 text-[15px] leading-7 text-slate-700">
              Reruns produce different cents; refunds/claims mutate history; audits rely on ad‑hoc evidence packs.
            </p>
          </UICard>

          <UICard title="Overlay architecture (after)">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li><strong>Deterministic engine:</strong> single‑writer logs, fixed fold order, 128‑bit integer accumulation.</li>
              <li><strong>Late quantization + carry‑ledger:</strong> one‑time rounding with ≤½‑ULP bound per allocation.</li>
              <li><strong>Transcript + digest:</strong> sealed, content‑addressed, replayable evidence of equality.</li>
              <li><strong>Acceptance gate:</strong> Finance ACK + Rights/Tax CT (+ optional SPV) with freshness &amp; quorum → only ALLOW releases.</li>
              <li><strong>Contract primitives:</strong> deterministic CAP_APPLY for caps/floors; bounded‑loss gating; explicit failure modes.</li>
            </ul>
          </UICard>
        </div>
      </Section>

      {/* ---------- HOW IT WORKS (60 seconds) ---------- */}
      <Section title="How it works (60 seconds)">
        <div className="grid gap-6 md:grid-cols-3">
          <UICard title="1) Ingest & compute">
            <p>Normalize usage/events (streams, downloads, UGC, advances/recoup, chargebacks) into ordered logs with idempotency; compute splits/recoup deterministically in integers.</p>
          </UICard>
          <UICard title="2) Window close">
            <p>Advance a monotone watermark; fold in a fixed, published order; quantize once; distribute sub‑cents via carry‑ledger; seal transcript & compute <code>output_digest</code>.</p>
          </UICard>
          <UICard title="3) Authorize & disburse">
            <p>Replay equals transcript digest and approvals are fresh/in quorum → ALLOW exports; stale/failed proofs HOLD with reasons.</p>
          </UICard>
        </div>
        <p className="mt-4 text-sm text-slate-600">Keep your rails—no rip‑and‑replace.</p>

        {/* Cycle cadence */}
        <div className="mt-6 rounded-2xl border border-slate-200 p-4">
          <p className="text-sm font-semibold text-slate-900">Monthly/quarterly cadence (example)</p>
          <ul className="mt-2 grid gap-2 text-[15px] leading-7 text-slate-700 sm:grid-cols-2 lg:grid-cols-5">
            <li><strong>T‑7–0 d:</strong> Ingest & compute deterministically</li>
            <li><strong>T 17:00:</strong> Window close (watermark, fold, quantize, carry)</li>
            <li><strong>T 17:05:</strong> Authorize(window_id) — equality + acceptance</li>
            <li><strong>T 17:10:</strong> Export ALLOW; HOLDs reason‑coded</li>
            <li><strong>Next cycle:</strong> Late claims/chargebacks land here</li>
          </ul>
        </div>
      </Section>

      {/* ---------- ACCEPTANCE POLICY (EXAMPLE) ---------- */}
      <Section title="Acceptance policy (example)">
        <div className="grid gap-6 md:grid-cols-3">
          <UICard title="Required proofs">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li>ACK (Finance reserves) — window‑level</li>
              <li>CT (Rights/Legal + Tax) — rightsholder/cohort‑level</li>
              <li>SPV (optional) — distributor/DSP header or bank receipt</li>
            </ul>
          </UICard>
          <UICard title="Freshness & quorum">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li>Freshness: ACK ≤ 24h; CT ≤ 7d; SPV ≤ 24h</li>
              <li>Quorum: 2 of 3 (Finance, Legal/Rights, Ops)</li>
            </ul>
          </UICard>
          <UICard title="If unmet">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li>HOLD with reason: <code>STALE_PROOF</code>, <code>RIGHTS_MISMATCH</code>, <code>INSUFFICIENT_QUORUM</code></li>
              <li>Owners alerted; re‑check without mutating outputs</li>
            </ul>
          </UICard>
        </div>
      </Section>

      {/* ---------- FITS YOUR STACK ---------- */}
      <Section title="Fits your stack">
        <div className="grid gap-6 md:grid-cols-3">
          <UICard title="Keep what works">
            <p>Keep your royalties package and payout rails (Tipalti/Payoneer/PayPal/bank) and your ERP (SAP/NetSuite). We run as a pre‑release gate.</p>
          </UICard>

          <UICard title="Add three fields">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li><code>window_id</code> — identifies the payout window</li>
              <li><code>output_digest</code> — ties to the sealed transcript (replay equality)</li>
              <li><code>provider_batch_id</code> — PSP/EBP/bank batch reference</li>
            </ul>
          </UICard>

          <UICard title="One pre‑release call">
            <p className="mb-2 text-[15px] leading-7 text-slate-700">Right before you export or create the payout batch:</p>
            <CodePanel title="Authorize">
{String.raw`POST /authorize { window_id }
→ ALLOW roster + HOLD roster with reason codes`}
            </CodePanel>
          </UICard>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <UICard title="Path A — Pay via PSP (fastest)">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li>Create PSP/bank batch from the ALLOW set</li>
              <li>Record AP entries per rightsholder per window</li>
              <li>Tag rows with <code>window_id</code>, <code>output_digest</code>, <code>provider_batch_id</code></li>
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
            <li><strong>GL (SAP/NetSuite) custom fields:</strong> <code>custbody_payout_window_id</code>, <code>custbody_output_digest</code>, <code>custbody_provider_batch_id</code>, <code>custbody_transcript_url</code></li>
          </ul>
        </div>
      </Section>

      {/* ---------- TECHNICAL DETAILS (COLLAPSED) ---------- */}
      <Section title="Technical details (for software engineers)">
        <details className="rounded-2xl border border-slate-200 p-4">
          <summary className="cursor-pointer select-none text-sm font-semibold text-slate-900">
            View endpoints, policy primitives, data contracts &amp; mappings
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

            <UICard title="Policy primitives (royalties)">
              <ul className="mt-2 list-disc space-y-2 pl-5">
                <li>Deterministic splits (work/song/recording)</li>
                <li>Recoup waterfall (advance → costs → royalty) in fixed order</li>
                <li>CAP_APPLY for caps/floors (with reason if clamped)</li>
                <li>Bounded‑loss gating; explicit failure modes</li>
                <li>FX at integer scale; late quantization preserves penny‑exact outcomes</li>
              </ul>
            </UICard>

            <UICard title="Data contracts (minimal)">
              <CodePanel title="Tier 0 — usage/recoup/refund events">
{String.raw`event_id,ts_occurred,principal_id,work_id,currency,amount_minor,source_type(stream|download|ugc_claim|advance|recoup|refund|adjustment),external_ref`}
              </CodePanel>
              <CodePanel title="Tier 1 — rightsholder registry">
{String.raw`principal_id,payout_token,tax_status,residency_country,withholding_rate_bps?`}
              </CodePanel>
              <CodePanel title="Tier 2 — attestations (signed JSON)">
{String.raw`// Finance ACK (window-level)
{ "window_id":"2025-09-30/monthly", "reserves_ok":true, "signer":"fin-ops@...", "expires_at":"2025-10-01T00:00:00Z" }

// Rights/Tax CT (holder- or cohort-level)
{ "principal_id":"ART-50821", "status":"cleared", "expires_at":"2025-10-15T00:00:00Z" }

// SPV (optional, window-level)
{ "window_id":"2025-09-30/monthly", "provider_batch_id":"PAY-90331", "totals_minor": "123456789", "headers_hash":"0x..." }`}
              </CodePanel>
              <CodePanel title="ERP/PSP delta">
{String.raw`// Add to PSP batch metadata & GL/AP:
window_id, output_digest, provider_batch_id, transcript_url`}
              </CodePanel>
            </UICard>

            <UICard title="Worked micro‑example">
              <CodePanel title="Split + recoup + sub‑cents + rights hold">
{String.raw`// Catalog: Work W (A:50%, B:30%, C:20%); C recoup balance -$400; B rights stale
// Revenue window: $12,345.67 (streams + UGC)
i128 accumulate → deterministic waterfall → late quantize → carry-ledger
Seal transcript → output_digest=0xabc... → Authorize(window)
// HOLD(B, STALE_PROOF); ALLOW(A,C) → pay; B auto-releases next window on fresh CT`}
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
          <UICard title="Penny‑exact outcomes">
            <p>Late quantization + carry‑ledger assigns sub‑cents deterministically; no rounding drift.</p>
          </UICard>
          <UICard title="Time‑to‑release (p95)">
            <p>Minutes from watermark close to authorized payout once proofs are fresh.</p>
          </UICard>
          <UICard title="Disputes ↓ 30–60%">
            <p>Transcript‑based proofs cut rightsholder tickets materially.</p>
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
            <li>Invariant violations (overflow/negative balance) → mark window INVALID; checkpointed recovery.</li>
            <li>Hot catalogs/partitions → versioned shard function; promote only on digest equality.</li>
          </ul>
        </details>
      </Section>

      {/* ---------- FAQ ---------- */}
      <Section title="FAQ">
        <div className="grid gap-4">
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-900">Do you replace our royalties package?</p>
            <p className="mt-1 text-[15px] leading-7 text-slate-700">
              No. We sit in front of payout and act as a settlement governor. You keep your package and rails; we require equality + fresh approvals before cash moves.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-900">How do you handle recoup and sub‑cents?</p>
            <p className="mt-1 text-[15px] leading-7 text-slate-700">
              Recoup waterfalls execute deterministically in integers; late quantization runs once per window and assigns sub‑cents via a carry‑ledger recorded in the transcript.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-900">What if a rightsholder’s W‑9/W‑8 or rights clearance is stale?</p>
            <p className="mt-1 text-[15px] leading-7 text-slate-700">
              That rightsholder is HOLD with a clear reason (e.g., <code>STALE_PROOF</code> or <code>RIGHTS_MISMATCH</code>). Others pay on time. Once fresh, the item auto‑releases in the next window.
            </p>
          </div>
        </div>
      </Section>

      {/* ---------- PILOT CTA ---------- */}
      <Section title="Pilot in 30 days">
        <div className="grid gap-6 md:grid-cols-3">
          <UICard title="What we’ll ask in discovery">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li>How are splits/recoup modeled today, and where do cents drift?</li>
              <li>Which rails (Tipalti/Payoneer/bank) and ERP fields do you use?</li>
              <li>Where do distributor/DSP totals vs GL differ, and by how much?</li>
            </ul>
          </UICard>
          <UICard title="Next step">
            <p>Gate a catalog/rightsholder cohort for two cycles; measure equality, reasons, and time‑to‑release.</p>
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
