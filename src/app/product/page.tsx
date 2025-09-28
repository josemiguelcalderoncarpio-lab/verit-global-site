"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Section, Card } from "../../components/UI";

export default function ProductPage() {
  return (
    <>
      {/* =================== 1) HERO =================== */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 pt-10 sm:pt-12 md:pt-14 lg:pt-16">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                Deterministic settlement with proof-gated disbursement
              </h1>
              <p className="mt-4 text-[15px] leading-7 text-slate-700 sm:text-base">
                We don’t replace your rails—we are the release gate. Money moves only when the math replays identically
                and the right evidence is fresh and in-quorum.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
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
                  Demo
                </Link>
              </div>
            </div>
            <div className="relative h-[260px] w-full overflow-hidden rounded-2xl border border-slate-200 sm:h-[320px] md:h-[360px]">
              <Image
                src="/images/product/overview.jpg"
                alt="Overview of VGoS as a release gate before rails/GL"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* =================== 2) WHERE WE SIT =================== */}
      <Section id="where" title="Where VGoS sits in your stack">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5">
          <StackDiagram />
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="text-sm font-semibold text-slate-900">Common Sources</div>
              <div className="mt-2 flex flex-wrap gap-2">
                <Chip>ERP (orders, returns)</Chip>
                <Chip>PSP exports</Chip>
                <Chip>Event bus (Kafka/Kinesis)</Chip>
                <Chip>Data warehouse (Snowflake/BigQuery)</Chip>
                <Chip>Fraud/KYC (vendor tokens)</Chip>
                <Chip>CSV drops (SFTP/S3/GCS)</Chip>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="text-sm font-semibold text-slate-900">Common Rails &amp; Destinations</div>
              <div className="mt-2 flex flex-wrap gap-2">
                <Chip>Stripe Connect</Chip>
                <Chip>Adyen for Platforms</Chip>
                <Chip>PayPal Payouts</Chip>
                <Chip>Treasury/ACH</Chip>
                <Chip>Banking-as-a-Service</Chip>
                <Chip>NetSuite / GL</Chip>
                <Chip>Tipalti</Chip>
                <Chip>Case mgmt (Jira/ServiceNow)</Chip>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <InfoCard
              title="10-second version"
              icon={<IconFlash />}
              text="We gate disbursements right before your rails/GL. If Replay = Digest and required evidence is fresh and in-quorum, we authorize the ALLOW set; otherwise rows are HOLD with reason codes."
            />
            <InfoCard
              title="One API + 3 fields"
              icon={<IconCode />}
              text='Call Authorize(window_id) before release. Add window_id, output_digest, and provider_batch_id to released rows so everything reconciles by digest.'
            />
            <InfoCard
              title="Your stack stays the same"
              icon={<IconLayers />}
              text="Rails, ERPs, and your warehouse remain. VGoS is an overlay, not a rip-and-replace."
            />
          </div>
        </div>
      </Section>

      {/* =================== 3) WHY IT’S DIFFERENT =================== */}
      <Section id="patent" title="Patent-backed architecture (why it’s different)">
        <p className="text-[15px] leading-7 text-slate-700">
          Our method is patent-pending (provisional filed). The design keeps settlement deterministic while improving control,
          auditability, and scale.
        </p>
        <div className="mt-5 grid gap-6 md:grid-cols-3">
          <FeatureCard icon={<IconDeterministic />} title="Deterministic windowing">
            Single writer + monotone watermark; same inputs → same outputs, every time.
          </FeatureCard>
          <FeatureCard icon={<IconMath />} title="Integer math &amp; carry ledger">
            Caps/bonuses without drift. Fixed-precision accumulation; remainders assigned explicitly.
          </FeatureCard>
          <FeatureCard icon={<IconDigest />} title="Replay-equal transcripts">
            Each window seals to a digest; replays must equal the digest before money moves.
          </FeatureCard>
          <FeatureCard icon={<IconShield />} title="Proof-gated disbursement">
            Freshness + Quorum over ACK/SPV/CT; missing evidence → deterministic HOLD with owners.
          </FeatureCard>
          <FeatureCard icon={<IconPolicy />} title="Versioned policy manifests">
            Save → canary → promote → rollback; every change is transcripted and scoped to a window.
          </FeatureCard>
          <FeatureCard icon={<IconOps />} title="Governance &amp; recovery">
            Reason-coded holds, owner trails, and predictable audits; transcripted decisions.
          </FeatureCard>
        </div>
      </Section>

      {/* =================== 4) CUSTOM AI =================== */}
      <AISection />

      {/* =================== 5) HOW IT WORKS (SCROLLER) =================== */}
      <HowItWorksScroller />

      {/* =================== 6) POLICY & CHANGE MGMT =================== */}
      <Section id="policy" title="Policy: what must be true before we pay">
        <div className="grid gap-6 md:grid-cols-3">
          <MiniCheck icon={<IconKnob />} title="Knobs">
            Bonus %, global/per-principal caps, required attestations (ACK/SPV/CT).
          </MiniCheck>
          <MiniCheck icon={<IconOutcome />} title="Outcomes">
            ALLOW/HOLD with machine-readable reasons (e.g., CT_INVALID, ACK_EXPIRED, CAP_APPLIED).
          </MiniCheck>
          <MiniCheck icon={<IconChange />} title="Change management">
            Save → transcript → canary → promote; replays must equal digest or no release.
          </MiniCheck>
        </div>
        <p className="mt-3 text-sm text-slate-600">
          Missing/expired attestations create deterministic <span className="font-medium">HOLD</span> rows with owners and SLAs.
        </p>
      </Section>

      {/* =================== 7) INTEGRATIONS =================== */}
      <Section id="integrations" title="Integrations (end-to-end)">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card title="A. Ingest patterns">
            <ul className="mt-2 space-y-1.5 text-[15px] text-slate-700">
              <Bullet>Webhook/API POST → <code>/api/v1/events</code> with <code>Idempotency-Key</code>, <code>X-Window-Id</code>, <code>X-Writer-Token</code>.</Bullet>
              <Bullet>Batch NDJSON → <code>/api/v1/events/batch</code>.</Bullet>
              <Bullet>Sources: Stripe, NetSuite, SAP Ariba, CSV (S3/GCS/SFTP), Kafka/Kinesis, Snowflake/BigQuery.</Bullet>
              <Bullet>Deterministic partitions via <code>tenant|window|bucket</code> → <code>K</code>.</Bullet>
            </ul>
          </Card>
          <Card title="B. Windowing &amp; safety">
            <ul className="mt-2 space-y-1.5 text-[15px] text-slate-700">
              <Bullet>One writer per (partition, window) (lease + TTL); conflicts rejected.</Bullet>
              <Bullet>Retries are safe via idempotency; duplicates visible as <em>replayed = yes</em>.</Bullet>
              <Bullet>Replay checks block releases unless <em>Replay = Digest</em>.</Bullet>
            </ul>
          </Card>
          <Card title="C. Destinations">
            <ul className="mt-2 space-y-1.5 text-[15px] text-slate-700">
              <Bullet>Rails: Stripe Connect, Adyen for Platforms, PayPal Payouts, Treasury/ACH, BaaS.</Bullet>
              <Bullet>Finance: NetSuite, Tipalti (digest-bound records).</Bullet>
              <Bullet>Case mgmt: Jira/ServiceNow (HOLDs open tickets with reason + owner).</Bullet>
              <Bullet>Google Agent Payments Protocol (AP2).</Bullet>
            </ul>
          </Card>
        </div>
      </Section>

      {/* =================== 8) PROOF PACK =================== */}
      <Section id="proofs" title="Proofs we produce (for Finance, Audit, Compliance)">
        <div className="flex flex-wrap gap-2">
          <Chip>Transcript digest (hash, size, created-at)</Chip>
          <Chip>Replay receipts (replay == digest)</Chip>
          <Chip>Reason-code taxonomy (owners & SLAs)</Chip>
          <Chip>Policy versions (diffs & effective windows)</Chip>
          <Chip>Cross-system binding (IDs in PSP + GL)</Chip>
          <Chip>Privacy-first audits (no raw PII)</Chip>
        </div>
      </Section>

      {/* =================== 9) WHO WE SERVE =================== */}
      <Section id="who" title="Who we serve">
        <p className="mb-4 text-sm text-slate-600">
          Explore examples by vertical on our{" "}
          <Link href="../market" className="text-[var(--brand)] underline underline-offset-2 hover:opacity-90">
            Market page
          </Link>
          .
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          <Card title="Creators &amp; Ad/Affiliate Networks">
            <p>Digest-bound payouts, bonus/cap controls, tax tokens, and dispute-ready transcripts.</p>
          </Card>
          <Card title="Marketplaces &amp; Gig">
            <p>Freshness/Quorum for KYC/OFAC; duplicate-aware intake; deterministic rounding at scale.</p>
          </Card>
          <Card title="Exchanges / Brokerage">
            <p>Tighter Freshness/Quorum; custody/chain receipts as SPV; reason-coded holds.</p>
          </Card>
          <Card title="Travel / Supplier Payouts">
            <p>Refund/rebook tokens; windowed caps; clean GL binding via window_id/digest.</p>
          </Card>
          <Card title="Royalties / Media &amp; IP">
            <p>Rights/cap enforcement; usage SPV optional; publisher/label approvals transcripted.</p>
          </Card>
          <Card title="B2B Rebates &amp; Incentives">
            <p>Contract-bound tokens; policy audits; canary/promotion for rule changes.</p>
          </Card>
        </div>
      </Section>

      {/* =================== 10) PILOT CTA =================== */}
      <Section title="Pilot in 30 days">
        <div className="grid gap-6 md:grid-cols-3">
          <Card title="Targets">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li>Worker/creator DSO → ≤ 1 day</li>
              <li>Dispute rate → ≤ 0.5%</li>
              <li>Fraud leakage → ≤ 0.3%</li>
            </ul>
          </Card>
          <Card title="Why teams like it">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li>Fewer clawbacks &amp; faster close</li>
              <li>Privacy-first audits via transcript digests</li>
              <li>Controls that don’t punish good users</li>
            </ul>
          </Card>
          <Card title="Next step">
            <p>
              Gate one high-risk cohort for two windows; measure replays, reason codes, and promotion time.
              If we don’t meet the targets we agree up front, you don’t expand.
            </p>
            <div className="mt-4">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-xl bg-[var(--brand)] px-5 py-2 text-sm font-semibold text-white shadow hover:opacity-95"
              >
                Book pilot scope call
              </Link>
            </div>
          </Card>
        </div>
      </Section>
    </>
  );
}

/* =================== Local UI bits =================== */

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
      {children}
    </span>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return <li className="pl-2">• {children}</li>;
}

function InfoCard({ title, text, icon }: { title: string; text: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#E6F0F7] text-[#144B75]">
          {icon}
        </span>
        <div className="text-base font-semibold text-slate-900">{title}</div>
      </div>
      <p className="text-[15px] leading-7 text-slate-700">{text}</p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#E6F0F7] text-[#144B75]">
          {icon}
        </span>
        <div className="text-base font-semibold text-slate-900">{title}</div>
      </div>
      <p className="text-[15px] leading-7 text-slate-700">{children}</p>
    </div>
  );
}

function Step({
  title,
  icon,
  children,
  className = ""
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`snap-start rounded-2xl border border-slate-200 bg-white p-4 shadow-sm min-w-[240px] md:min-w-[280px] lg:min-w-[300px] ${className}`}>
      <div className="mb-1 flex items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#E6F0F7] text-[#144B75]">
          {icon}
        </span>
        <div className="text-sm font-semibold text-slate-900">{title}</div>
      </div>
      <p className="text-[13px] leading-6 text-slate-700">{children}</p>
    </div>
  );
}

function MiniCheck({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#E6F0F7] text-[#144B75]">
          {icon}
        </span>
        <div className="text-base font-semibold text-slate-900">{title}</div>
      </div>
      <p className="text-[15px] leading-7 text-slate-700">{children}</p>
    </div>
  );
}

/* =================== HOW IT WORKS SCROLLER =================== */

function HowItWorksScroller() {
  const ref = useRef<HTMLDivElement>(null);

  const scrollByAmount = (dx: number) => {
    ref.current?.scrollBy({ left: dx, behavior: "smooth" });
  };

  return (
    <Section id="how" title="How it works (one clean pass)">
      {/* See it live link */}
      <div className="mb-2 flex justify-end">
        <Link href="../vgomini" className="text-sm font-medium text-[var(--brand)] underline underline-offset-2 hover:opacity-90">
          See it live
        </Link>
      </div>
      <div className="relative">
        {/* Controls */}
        <div className="pointer-events-none absolute -left-2 -right-2 -top-10 flex justify-end gap-2 md:-top-12">
          <button
            aria-label="Scroll left"
            onClick={() => scrollByAmount(-320)}
            className="pointer-events-auto hidden items-center justify-center rounded-full border border-slate-300 bg-white px-3 py-1 text-sm text-slate-700 shadow hover:bg-slate-50 md:inline-flex"
          >
            ‹
          </button>
          <button
            aria-label="Scroll right"
            onClick={() => scrollByAmount(320)}
            className="pointer-events-auto hidden items-center justify-center rounded-full border border-slate-300 bg-white px-3 py-1 text-sm text-slate-700 shadow hover:bg-slate-50 md:inline-flex"
          >
            ›
          </button>
        </div>

        {/* Track */}
        <div
          ref={ref}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 pt-2 [scrollbar-width:none] [-ms-overflow-style:none]"
          style={{ scrollBehavior: "smooth" }}
        >
          <Step title="Intake" icon={<IconIntake />}>Idempotent POST/NDJSON; explicit duplicate semantics.</Step>
          <Step title="Order" icon={<IconOrder />}>Single-writer lease + watermark; late events roll to next window.</Step>
          <Step title="Accumulate" icon={<IconAccumulate />}>Integer math (no floats) for penny-exact totals.</Step>
          <Step title="Policy" icon={<IconPolicy />}>Bonuses & caps; inputs: Finance ACK + CT statuses; reason-coded decisions.</Step>
          <Step title="Acceptance" icon={<IconShield />}>Evidence checks (ACK/SPV/CT) with Freshness & Quorum.</Step>
          <Step title="Seal" icon={<IconDigest />}>Transcript digest; replays must equal digest.</Step>
          <Step title="Carry" icon={<IconCarry />}>Deterministic remainder assignment (no hidden drift).</Step>
          <Step title="Export" icon={<IconExport />}>Rails/GL payloads stamped with window_id/digest/batch_id.</Step>
          <Step title="Gateway" icon={<IconGateway />}>Authorize(window_id) → {`{ ALLOW[], HOLD[] }`}.</Step>
        </div>
      </div>
    </Section>
  );
}

/* =================== AI Section =================== */

function AISection() {
  return (
    <Section id="ai" title="Custom AI working for you">
      <p className="mb-6 text-slate-600">
        Add intelligence without risking determinism. <strong>Custom agents</strong> handle the busywork;
        <strong> custom models</strong> surface insights — proofs still gate disbursements.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Custom Agents */}
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="relative h-48 w-full">
            <Image
              src="/images/hero2.jpg"
              alt="Custom agents orchestrating attestations and follow-ups across the payout process"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority={false}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
            <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-slate-800 ring-1 ring-white/80">
              Custom Agents
            </div>
          </div>
          <div className="p-5">
            <h3 className="text-base font-semibold text-slate-900">Stay on top of the process</h3>
            <p className="mt-1 text-sm leading-6 text-slate-700">
              From intake to release, custom agents collect and chase attestations, reconcile receipts,
              and only ping you when a decision is needed. They don’t change the math—they keep the process moving.
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
              <li>• Auto-collect missing docs; route to owners with SLAs</li>
              <li>• Nudge on potential duplicates before HOLDs</li>
              <li>• Watch Freshness &amp; Quorum; summarize what’s blocking release</li>
            </ul>
          </div>
        </article>

        {/* Custom Machine Learning */}
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="relative h-48 w-full">
            <Image
              src="/images/hero6.jpg"
              alt="Custom machine learning surfacing payout anomalies and policy insights"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority={false}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
            <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-slate-800 ring-1 ring-white/80">
              Custom Machine Learning
            </div>
          </div>
          <div className="p-5">
            <h3 className="text-base font-semibold text-slate-900">Understand payouts, spot drift</h3>
            <p className="mt-1 text-sm leading-6 text-slate-700">
              Custom models learn your programs to surface drift, anomalies, and policy insights—off
              the payout path, so settlement stays deterministic.
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
              <li>• Cohort &amp; outlier detection across payees and programs</li>
              <li>• Policy impact analysis before you ship a change</li>
              <li>• Forecasts on holds, release timing, and cash needs</li>
            </ul>
          </div>
        </article>
      </div>
    </Section>
  );
}

/* =================== Inline icons (tiny blue) =================== */

function IconFlash() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 3L4 14h7l-1 7 9-11h-7l1-7z" />
    </svg>
  );
}
function IconCode() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 9l-3 3 3 3M16 9l3 3-3 3M12 19l2-14" />
    </svg>
  );
}
function IconLayers() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2l9 4-9 4-9-4 9-4z" />
      <path d="M3 10l9 4 9-4M3 16l9 4 9-4" />
    </svg>
  );
}
function IconDeterministic() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12h18M6 8l6-4 6 4M6 16l6 4 6-4" />
    </svg>
  );
}
function IconMath() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 8h6M4 12h6M4 16h6M14 8h6M14 12h6M14 16h6" />
    </svg>
  );
}
function IconDigest() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 8h10M7 12h7M7 16h4" />
    </svg>
  );
}
function IconShield() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3l7 4v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V7l7-4z" />
      <path d="M9.5 12.5l1.8 1.8 3.4-3.4" />
    </svg>
  );
}
function IconOps() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a8 8 0 10-2.4 2.4L21 21" />
    </svg>
  );
}
function IconPolicy() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="6" y="3" width="12" height="18" rx="1" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </svg>
  );
}

/* timeline-specific icons */
function IconIntake() { return (<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M6 3h12M4 11h16M4 15h10M4 19h6" /></svg>); }
function IconOrder() { return (<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7h18M7 3v18M3 12h18" /></svg>); }
function IconAccumulate() { return (<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 12h8M12 8v8"/></svg>); }
function IconCarry() { return (<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 18h16M8 14l4-4 4 4" /></svg>); }
function IconExport() { return (<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v10M8 9l4-4 4 4"/><rect x="3" y="15" width="18" height="6" rx="2"/></svg>); }
function IconGateway() { return (<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 12h8M12 8v8"/></svg>); }
function IconKnob() { return (<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="8"/><path d="M12 12l4-4"/></svg>); }
function IconOutcome() { return (<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12l5 5L20 7"/></svg>); }
function IconChange() { return (<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1018 0A9 9 0 103 12z"/><path d="M12 7v5l3 3"/></svg>); }

/* =================== Diagram =================== */

function StackDiagram() {
  return (
    <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
      <Box title="Sources" subtitle="ERP · PSP · Events · CSV · DWH · KYC/Tax" />
      <Arrow />
      <Gate />
      <Arrow />
      <Box title="Rails + GL" subtitle="Stripe/Adyen/PayPal · ACH · BaaS · NetSuite/Tipalti" />
    </div>
  );
}

function Box({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <div className="mt-0.5 text-xs text-slate-600">{subtitle}</div>
    </div>
  );
}

function Arrow() {
  return <div aria-hidden className="h-px w-full bg-gradient-to-r from-slate-300 to-slate-400 md:w-10 md:rotate-0" />;
}

function Gate() {
  return (
    <div className="rounded-xl border-2 border-[var(--brand)] bg-white p-4 text-center">
      <div className="text-sm font-semibold text-slate-900">VGoS Gate</div>
      <div className="mt-1 text-xs text-slate-600">Replay = Digest ✓ · Acceptance ✓</div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <code className="rounded-md bg-slate-50 px-2 py-1 text-xs text-slate-700">Authorize(window_id)</code>
        <code className="rounded-md bg-slate-50 px-2 py-1 text-xs text-slate-700">{'{'}ALLOW[], HOLD[]{'}'}</code>
      </div>
      <div className="mt-3 text-xs text-slate-600">
        Add to released rows: <span className="font-mono">window_id</span>, <span className="font-mono">output_digest</span>, <span className="font-mono">provider_batch_id</span>
      </div>
    </div>
  );
}
