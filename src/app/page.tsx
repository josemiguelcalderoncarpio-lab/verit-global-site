"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { Section, Card } from "../components/UI";

type CSSVars = CSSProperties & { ["--d"]?: string };

export default function Page() {
  /* -------------------- HERO ROTATOR -------------------- */
  const slides = useMemo(
    () => [
      { src: "/images/hero1.jpg",      caption: "Set the settlement standard" },
      { src: "/images/hero2.jpg", caption: "AI Agents that stay on top of the process" },
      { src: "/images/hero3.jpg",      caption: "Payouts you can prove" },
      { src: "/images/hero4.jpg",      caption: "Deterministic by design (VGoS)" },
      { src: "/images/hero5.jpg",      caption: "Controls before funds move" },
      { src: "/images/hero6.jpg",    caption: "Custom machine learning that understands your payouts" },
      { src: "/images/hero7.jpg",      caption: "Scalable. Composable. Reliable." },
    ],
    []
  );

  const subheads = useMemo(
    () => [
      "Built for platforms with complex, high-volume payouts — provable, replayable, audit-ready.",
      "From intake to release, custom AI Agents collect and chase attestations, reconcile receipts, and only ping you when a decision is needed.",
      "Close with proof, not hope. Deterministic windows eliminate penny drift and ambiguity.",
      "Same inputs → same outputs. Canonical order, integer math, and versioned policy manifests.",
      "Gate disbursements with attestations and acceptance checks before funds move.",
      "Machine-learning models learn your programs to surface drift, anomalies, and policy insights—off the payout path, so settlement stays deterministic.",
      "Horizontal scale, modular services, and versioned policy keep releases coherent.",
    ],
    []
  );

  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const next = useCallback(() => setIdx((i) => (i + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setIdx((i) => (i - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(next, 6000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, next]);

  return (
    <>
      {/* -------------------- HERO -------------------- */}
      <section
        className="relative mx-auto max-w-7xl px-4 py-10 sm:py-12 md:py-14 lg:py-16"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="relative h-[360px] w-full overflow-hidden rounded-2xl shadow-sm ring-1 ring-slate-200 sm:h-[420px] md:h-[520px]">
          <Image
            key={idx}
            src={slides[idx].src}
            alt={slides[idx].caption}
            fill
            sizes="100vw"
            className="object-cover transition-opacity duration-500"
            priority
          />
          {/* Strong overlay for contrast */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/35 to-black/10" />

          {/* Headline & CTAs */}
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
            <div className="max-w-[720px]">
              <h1 className="text-2xl font-semibold leading-snug text-white drop-shadow sm:text-3xl md:text-4xl">
                {slides[idx].caption}
              </h1>
              <p className="mt-2 max-w-[60ch] text-sm text-white/90 sm:text-base">{subheads[idx]}</p>

              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-95"
                >
                  Request a pilot
                </Link>
                <Link
                  href="/product"
                  className="inline-flex items-center justify-center rounded-xl bg-white/95 px-4 py-2 text-sm font-semibold text-[var(--brand)] ring-1 ring-[var(--brand)] hover:bg-white"
                >
                  3-min overview
                </Link>
              </div>
            </div>

            {/* Prev/Next */}
            <div className="hidden shrink-0 gap-2 md:flex">
              <button
                aria-label="Previous slide"
                className="rounded-full bg-white/95 p-2 text-slate-800 shadow hover:bg-white"
                onClick={prev}
              >
                ‹
              </button>
              <button
                aria-label="Next slide"
                className="rounded-full bg-white/95 p-2 text-slate-800 shadow hover:bg-white"
                onClick={next}
              >
                ›
              </button>
            </div>
          </div>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-2 rounded-full bg-black/35 px-3 py-1">
              {slides.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setIdx(i)}
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    i === idx ? "bg-white" : "bg-white/60 hover:bg-white/90"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* One-liner under hero */}
      </section>

      <Section title="Who we serve">
        <div className="flex flex-wrap gap-3">
          <a href="/market/creators" className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="#144B75" strokeWidth="2"><path d="M3 11l18-5-2 13-8-3-4 3V8z"/></svg>
            <span>Creators &amp; Ad/Affiliate Networks</span>
          </a>
          <a href="/market/marketplaces" className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="#144B75" strokeWidth="2"><path d="M3 9h18M5 9V5h14v4M5 9v10h14V9"/></svg>
            <span>Marketplaces &amp; Gig</span>
          </a>
          <a href="/market/travel" className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="#144B75" strokeWidth="2"><path d="M10 21l-1-4-2-2-5-1 2-2 5 1 3-3-5-9 2-1 7 8 5 1 2 2-6 2-3 3 1 5z"/></svg>
            <span>Travel Agencies &amp; Supplier Payouts</span>
          </a>
          <a href="/market/royalties" className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="#144B75" strokeWidth="2"><path d="M8 4l4 4 4-4 3 6-7 6-7-6 3-6zM5 20h14"/></svg>
            <span>Royalties, Media &amp; IP</span>
          </a>
          <a href="/market/exchanges" className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="#144B75" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M7 12h10M12 7v10"/></svg>
            <span>Exchanges &amp; Digital-Asset Platforms</span>
          </a>
        </div>
      </Section>
      <div className="mx-auto mt-4 max-w-3xl text-center">
        <p className="text-base text-slate-700">
          We gate disbursements with math and evidence — not guesswork. Integrates above your
          existing rails; built for regulators, finance, and growth.
        </p>
      </div>

      <Section title="Problem">
        <div className="grid gap-6 md:grid-cols-3">
          <Card title="Pennies leak at scale">
            <p>Millions of micro-payments turn tiny fractions into real dollars. Fixed-precision rounding hides drift; “adjustment” tabs paper over it, then diverge again next cycle.</p>
          </Card>
          <Card title="Unstable order & duplicates">
            <p>Joins across ERP/PSP/CSV exports aren’t canonical. Race conditions and fuzzy keys let duplicates sneak in; the same inputs can yield different totals under load.</p>
          </Card>
          <Card title="Late changes break totals">
            <p>A $17 refund lands at 11:00 AM and isn’t noticed until 1:00 PM. Teams back-propagate across tabs, resend files, and hope the PSP got the final one—no single source of truth.</p>
          </Card>
        </div>
      </Section>

      <Section title="With VGOS">
        <div className="grid gap-6 md:grid-cols-3">
          <Card title="Deterministic windowing">
            <p>Events are ordered by <code>event_id</code> with a single writer + monotone watermark. Same inputs → same outputs; exports are idempotent and byte-identical.</p>
          </Card>
          <Card title="No hidden drift">
            <p>Integer math + late quantization + a carry ledger eliminate penny loss. Remainders are assigned explicitly, not “lost” in rounding.</p>
          </Card>
          <Card title="Change-proof operations">
            <p>Late refund or policy tweak? VGOS creates a new window version and digest. Holds are reason-coded <em>before</em> money moves, and PSP payloads include <code>If-Match: &lt;digest&gt;</code> for integrity.</p>
          </Card>
        </div>
      </Section>

      <Section title="Day in the Life of the Payments Department">
        <style jsx>{`
          @keyframes autoScrollY { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
          .autoScroll { animation: autoScrollY var(--d, 36s) linear infinite; will-change: transform; }
          .autoScroll:hover, .autoScroll:focus-within { animation-play-state: paused; }
          @media (prefers-reduced-motion: reduce) { .autoScroll { animation: none !important; } }
        `}</style>
        <div className="grid gap-6 md:grid-cols-2">
          {/* BEFORE */}
          <div className="rounded-2xl border bg-white shadow-sm">
            <header className="px-5 pb-3 pt-4"><h3 className="text-base font-semibold text-slate-900">BEFORE — Spreadsheet orchestration (ERP + PSP, no Verit)</h3></header>
            <div className="relative overflow-hidden" style={{ height: 360 }} aria-label="Before timeline">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-slate-50 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-slate-50 to-transparent" />
              <div className="autoScroll" style={{ ["--d"]:"38s" } as CSSVars} role="log" aria-live="polite">
                <ul className="space-y-2 px-5 pb-6">
                  <li className="flex gap-3 text-sm leading-5"><span className="shrink-0 tabular-nums font-medium text-[#144B75]">7:30 AM</span><span className="text-slate-800">Pull last night’s ERP/PSP exports; fix headers, time zones, encodings.</span></li>
                  <li className="flex gap-3 text-sm leading-5"><span className="shrink-0 tabular-nums font-medium text-[#144B75]">7:45 AM</span><span className="text-slate-800">Build the master workbook; split tabs by program/region; re-type to numbers.</span></li>
                  <li className="flex gap-3 text-sm leading-5"><span className="shrink-0 tabular-nums font-medium text-[#144B75]">8:00 AM</span><span className="text-slate-800">Join 6–12 CSVs; apply policy: <strong>1% bonus</strong>, round to cent.</span></li>
                  <li className="flex gap-3 text-sm leading-5"><span className="shrink-0 tabular-nums font-medium text-[#144B75]">8:20 AM</span><span className="text-slate-800">VLOOKUP/SUMIFS across tabs; copy/paste values to freeze calculations.</span></li>
                  <li className="flex gap-3 text-sm leading-5"><span className="shrink-0 tabular-nums font-medium text-[#144B75]">8:35 AM</span><span className="text-slate-800">Attempt dedupe across fuzzy keys; duplicates slip through.</span></li>
                  <li className="flex gap-3 text-sm leading-5"><span className="shrink-0 tabular-nums font-medium text-[#144B75]">8:50 AM</span><span className="text-slate-800">Per-payee totals; ERP GL variance shows <strong>–¢ drift</strong>.</span></li>
                  <li className="flex gap-3 text-sm leading-5"><span className="shrink-0 tabular-nums font-medium text-[#144B75]">9:05 AM</span><span className="text-slate-800">Add a “rounding adj.” tab to patch small variances.</span></li>
                  <li className="flex gap-3 text-sm leading-5"><span className="shrink-0 tabular-nums font-medium text-[#144B75]">9:20 AM</span><span className="text-slate-800">Email Eng about missing event types; wait.</span></li>
                  <li className="flex gap-3 text-sm leading-5"><span className="shrink-0 tabular-nums font-medium text-[#144B75]">9:45 AM</span><span className="text-slate-800">Export <code>payout_v1.csv</code> to PSP; informal sign-off via Slack.</span></li>
                  <li className="flex gap-3 text-sm leading-5"><span className="shrink-0 tabular-nums font-medium text-[#144B75]">10:00 AM</span><span className="text-slate-800">Manager asks “What changed since yesterday?”—no canonical log.</span></li>
                  <li className="flex gap-3 text-sm leading-5"><span className="shrink-0 tabular-nums font-medium text-[#144B75]">11:00 AM</span><span className="text-slate-800"><strong>CHANGE LANDS LATE:</strong> a <strong>$17 refund</strong> hits ERP. No one sees it yet.</span></li>
                  <li className="flex gap-3 text-sm leading-5"><span className="shrink-0 tabular-nums font-medium text-[#144B75]">11:10 AM</span><span className="text-slate-800">Continue statements; PSP staging <code>v1</code>.</span></li>
                  <li className="flex gap-3 text-sm leading-5"><span className="shrink-0 tabular-nums font-medium text-[#144B75]">12:00 PM</span><span className="text-slate-800">Compliance ping; quick meeting; lunch.</span></li>
                  <li className="flex gap-3 text-sm leading-5"><span className="shrink-0 tabular-nums font-medium text-[#144B75]">1:00 PM</span><span className="text-slate-800"><strong>DISCOVERY:</strong> find the $17 refund; scramble to re-import, re-join, re-sum, re-export.</span></li>
                  <li className="flex gap-3 text-sm leading-5"><span className="shrink-0 tabular-nums font-medium text-[#144B75]">1:55 PM</span><span className="text-slate-800">Controller asks “Exactly what changed?”—no transcript.</span></li>
                  <li className="flex gap-3 text-sm leading-5"><span className="shrink-0 tabular-nums font-medium text-[#144B75]">2:30 PM</span><span className="text-slate-800">Auditor requests proof that <code>v2</code> replaced <code>v1</code> coherently.</span></li>
                  <li className="flex gap-3 text-sm leading-5"><span className="shrink-0 tabular-nums font-medium text-[#144B75]">3:45 PM</span><span className="text-slate-800">Approvals trickle via email; holds tracked manually.</span></li>
                  <li className="flex gap-3 text-sm leading-5"><span className="shrink-0 tabular-nums font-medium text-[#144B75]">4:30 PM</span><span className="text-slate-800">Finance “signs” with caveats; disputes likely next cycle.</span></li>
                </ul>
                <ul className="space-y-2 px-5 pb-6">
                  {/* duplicate list for seamless loop */}
                  <li className="flex gap-3 text-sm leading-5"><span className="shrink-0 tabular-nums font-medium text-[#144B75]">7:30 AM</span><span className="text-slate-800">Pull last night’s ERP/PSP exports; fix headers, time zones, encodings.</span></li>
                  <li className="flex gap-3 text-sm leading-5"><span className="shrink-0 tabular-nums font-medium text-[#144B75]">7:45 AM</span><span className="text-slate-800">Build the master workbook; split tabs by program/region; re-type to numbers.</span></li>
                  <li className="flex gap-3 text-sm leading-5"><span className="shrink-0 tabular-nums font-medium text-[#144B75]">8:00 AM</span><span className="text-slate-800">Join 6–12 CSVs; apply policy: <strong>1% bonus</strong>, round to cent.</span></li>
                  <li className="flex gap-3 text-sm leading-5"><span className="shrink-0 tabular-nums font-medium text-[#144B75]">8:20 AM</span><span className="text-slate-800">VLOOKUP/SUMIFS across tabs; copy/paste values to freeze calculations.</span></li>
                  <li className="flex gap-3 text-sm leading-5"><span className="shrink-0 tabular-nums font-medium text-[#144B75]">8:35 AM</span><span className="text-slate-800">Attempt dedupe across fuzzy keys; duplicates slip through.</span></li>
                  <li className="flex gap-3 text-sm leading-5"><span className="shrink-0 tabular-nums font-medium text-[#144B75]">8:50 AM</span><span className="text-slate-800">Per-payee totals; ERP GL variance shows <strong>–¢ drift</strong>.</span></li>
                  <li className="flex gap-3 text-sm leading-5"><span className="shrink-0 tabular-nums font-medium text-[#144B75]">9:05 AM</span><span className="text-slate-800">Add a “rounding adj.” tab to patch small variances.</span></li>
                  <li className="flex gap-3 text-sm leading-5"><span className="shrink-0 tabular-nums font-medium text-[#144B75]">9:20 AM</span><span className="text-slate-800">Email Eng about missing event types; wait.</span></li>
                </ul>
              </div>
            </div>
          </div>

          {/* AFTER */}
          <div className="rounded-2xl border bg-white shadow-sm">
            <header className="px-5 pb-3 pt-4"><h3 className="text-base font-semibold text-slate-900">AFTER — Verit as a proof-gated disbursement gate (with ERP + PSP)</h3></header>
            <div className="relative overflow-hidden" style={{ height: 360 }} aria-label="After timeline">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-slate-50 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-slate-50 to-transparent" />
              <ul className="space-y-2 px-5 pb-6">
                <li className="flex gap-3 text-sm leading-5"><span className="shrink-0 tabular-nums font-medium text-[#144B75]">7:30 AM</span><span className="text-slate-800">Events stream into Verit; ingest dedupes by <code>event_id</code> and canonicalizes fields.</span></li>
                <li className="flex gap-3 text-sm leading-5"><span className="shrink-0 tabular-nums font-medium text-[#144B75]">8:00 AM</span><span className="text-slate-800"><strong>Close Window:</strong> deterministic order; integer accumulation; late quantization + carry ledger.</span></li>
                <li className="flex gap-3 text-sm leading-5"><span className="shrink-0 tabular-nums font-medium text-[#144B75]">8:02 AM</span><span className="text-slate-800"><strong>Seal & Digest:</strong> transcript digest; <strong>Replay = Digest</strong>.</span></li>
                <li className="flex gap-3 text-sm leading-5"><span className="shrink-0 tabular-nums font-medium text-[#144B75]">8:05 AM</span><span className="text-slate-800"><strong>Approvals:</strong> Finance/Audit acceptance matrix applies reason-coded holds <em>before money moves</em>.</span></li>
                <li className="flex gap-3 text-sm leading-5"><span className="shrink-0 tabular-nums font-medium text-[#144B75]">10:00 AM</span><span className="text-slate-800">Export <code>/payouts?status=ALLOW</code> (idempotent PSP payloads with <code>If-Match: &lt;digest&gt;</code>).</span></li>
                <li className="flex gap-3 text-sm leading-5"><span className="shrink-0 tabular-nums font-medium text-[#144B75]">11:00 AM</span><span className="text-slate-800"><strong>LATE CHANGE:</strong> $17 refund arrives → system versions the window; new digest.</span></li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-3 text-center text-xs text-gray-500">Hover to pause. We respect “Reduce Motion”.</p>
      </Section>

      <Section title="Why now">
        <div className="grid gap-6 md:grid-cols-3">
          <Card title="Regulatory pressure">
            <p>
              Audit-ready payouts are becoming a requirement. Deterministic proofs reduce
              remediation risk and accelerate audits.
            </p>
          </Card>
          <Card title="Adversarial traffic">
            <p>
              Bots & synthetic events outpace manual review. Reason-coded gates block the outliers
              without punishing good users.
            </p>
          </Card>
          <Card title="Concurrency drift">
            <p>
              Non-deterministic systems diverge under load. Fixed-precision math + canonical order
              keep results byte-identical.
            </p>
          </Card>
        </div>
      </Section>

      {/* -------------------- HOW IT WORKS -------------------- */}
      <Section title="How it works">
        <div className="grid gap-6 md:grid-cols-4">
          <Step
            icon={<IconIngest />}
            title="Ingest & order"
            desc="Canonical event order eliminates concurrency drift and double-counting."
          />
          <Step
            icon={<IconCompute />}
            title="Deterministic compute"
            desc="Fixed-precision math; transcripted outputs enable byte-identical replays."
          />
          <Step
            icon={<IconVerify />}
            title="Verify & gate"
            desc="ACK/SPV/compliance evidence must satisfy freshness & quorum before release."
          />
          <Step
            icon={<IconDisburse />}
            title="Disburse & prove"
            desc="Penny-exact payouts; auditors verify transcript digests without raw PII."
          />
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <strong className="text-slate-900">Integration:</strong> VGoS sits beside your data
          warehouse, fraud/compliance stack, and payment processors. Turn modules on by flag; no
          rip-and-replace.
        </div>
      </Section>

      {/* -------------------- FINAL CTA -------------------- */}
      <Section title="Ready to see it?">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white shadow hover:opacity-95"
          >
            Request a pilot
          </Link>
          <Link
            href="/investors"
            className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[var(--brand)] ring-1 ring-[var(--brand)] hover:bg-slate-50"
          >
            Investor materials
          </Link>
        </div>
      </Section>
    </>
  );
}

/* ==================== SMALL UI PIECES FOR THIS PAGE ==================== */

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-2xl font-semibold text-slate-900">{value}</div>
      <div className="mt-1 text-sm text-slate-600">{label}</div>
    </div>
  );
}

function KPI({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
      <div className="text-sm text-slate-600">{label}</div>
      <div className="mt-1 text-xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function Chip({ href, label, primary }: { href: string; label: string; primary?: boolean }) {
  return (
    <Link
      href={href}
      className={[
        "inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition",
        primary
          ? "bg-[var(--brand)] text-white shadow hover:opacity-95"
          : "bg-white text-slate-800 ring-1 ring-slate-300 hover:ring-[var(--brand)] hover:text-[var(--brand)]",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

function Step({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3">{icon}</div>
      <div className="text-base font-semibold text-slate-900">{title}</div>
      <p className="mt-1 text-[15px] leading-7 text-slate-700">{desc}</p>
    </div>
  );
}

/* -------------------- INLINE ICONS (SVG) -------------------- */

function IconIngest() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-[var(--brand)]" fill="none" stroke="currentColor">
      <rect x="3" y="4" width="18" height="6" rx="1.5" strokeWidth="2" />
      <path d="M7 14h10M5 18h14" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconCompute() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-[var(--brand)]" fill="none" stroke="currentColor">
      <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" />
      <path d="M8 10h8M8 14h5" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconVerify() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-[var(--brand)]" fill="none" stroke="currentColor">
      <path d="M12 3l7 4v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V7l7-4z" strokeWidth="2" />
      <path d="M9.5 12.5l1.8 1.8 3.4-3.4" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconDisburse() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-[var(--brand)]" fill="none" stroke="currentColor">
      <path d="M12 3v18M7 8l5-5 5 5" strokeWidth="2" strokeLinecap="round" />
      <rect x="3" y="14" width="18" height="7" rx="1.5" strokeWidth="2" />
    </svg>
  );
}
