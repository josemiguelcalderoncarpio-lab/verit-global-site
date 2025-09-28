import Image from "next/image";
import Link from "next/link";
import { Section, Card } from "../../components/UI";

export default function InvestorsPage() {
  return (
    <>
      {/* ---------- HERO WITH IMAGE ---------- */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 pt-10 sm:pt-12 md:pt-14 lg:pt-16">
          <div className="grid items-center gap-6 md:grid-cols-2">
            {/* Left: pitch */}
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                Invest in the settlement standard for the digital economy
              </h1>
              <p className="mt-4 text-[15px] leading-7 text-slate-800 sm:text-base">
                Verit Global’s VGoS turns event streams into <span className="font-semibold">provably correct</span> payouts,
                gating disbursements on math and evidence — not guesswork. We sit above existing rails to make
                outcomes penny-exact, audit-ready, and fraud-resistant.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="#round"
                  className="inline-flex items-center rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white shadow hover:opacity-95"
                >
                  Round details
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[var(--brand)] ring-1 ring-[var(--brand)] hover:bg-slate-50"
                >
                  Request the deck
                </Link>
              </div>
            </div>

            {/* Right: hero image */}
            <div className="relative h-[260px] overflow-hidden rounded-2xl ring-1 ring-slate-200 sm:h-[320px] md:h-[360px]">
              <Image
                src="/images/investors/hero.jpg"
                alt="Investor overview — Verit Global"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* High-contrast facts block */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-600">Category</dt>
                <dd className="mt-1 text-base text-slate-900">
                  Deterministic settlement layer <span className="text-slate-700">(above your payout rails)</span>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-600">Wedge</dt>
                <dd className="mt-1 text-base text-slate-900">
                  Ticketed events (sports & concerts), then creators, marketplaces, usage-based SaaS & AI
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-600">Moat</dt>
                <dd className="mt-1 text-base text-slate-900">
                  Determinism + proof-gated disbursement + privacy-first transcripts <span className="text-slate-700">— patent-backed</span>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-600">Model</dt>
                <dd className="mt-1 text-base text-slate-900">
                  Volume-based + enterprise; proof/reporting add-ons
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* ---------- INVESTMENT HIGHLIGHTS ---------- */}
      <Section title="Investment highlights">
        <div className="grid gap-6 md:grid-cols-3">
          <Card title="Visa-scale thesis, payout layer">
            <p>
              Past payment revolutions (cards → online → mobile) became infrastructure. The next wave is
              <span className="font-semibold"> provable digital rewards & payouts</span> — correctness guaranteed before funds move.
            </p>
          </Card>
          <Card title="Deterministic by design">
            <p>
              Canonical order + fixed-precision math + transcripted outputs enable byte-identical replays and reason-coded gating.
            </p>
          </Card>
          <Card title="Keep your rails">
            <p>
              We overlay above Stripe/Adyen/Hyperwallet/etc. to gate disbursements. Faster adoption; no rip-and-replace.
            </p>
          </Card>
          <Card title="Measurable outcomes (pilot)">
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>DSO ≤ 1 day</li>
              <li>Disputes ≤ 0.5%</li>
              <li>Fraud leakage ≤ 0.3%</li>
            </ul>
          </Card>
          <Card title="IP & standard play">
            <p>
              Patent-backed claims around transcript-gated disbursement and re-shard invariance; built to set the standard.
            </p>
          </Card>
          <Card title="Capital efficient path">
            <p>
              Design-partner GTM, basis-point pricing, modular features (privacy/fraud/predictive) for expansion.
            </p>
          </Card>
        </div>
      </Section>

      {/* ---------- MARKET THESIS ---------- */}
      <Section title="Why now — the trust unlock">
        <div className="grid gap-6 md:grid-cols-2">
          <Card title="The pattern repeats">
            <ol className="list-decimal space-y-2 pl-5">
              <li><span className="font-semibold">1950s — Credit cards:</span> safer than cash</li>
              <li><span className="font-semibold">2000s — Online payments:</span> safer than mail</li>
              <li><span className="font-semibold">2010s — Mobile:</span> safer than cards</li>
              <li><span className="font-semibold">2020s — Provable payouts:</span> <em>guarantees</em> vs. promises</li>
            </ol>
            <p className="mt-3 text-[15px] leading-7 text-slate-800">
              Each unlock solved a trust gap and became infrastructure. VGoS applies that same playbook to payouts.
            </p>
          </Card>
          <Card title="The category problem (large & persistent)">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li>Concurrency and version drift create mispays</li>
              <li>Fraud/IVT triggers blanket freezes and clawbacks</li>
              <li>Compliance & audit demand evidence, not dashboards</li>
            </ul>
            <p className="mt-3 text-[15px] leading-7 text-slate-800">
              Our engine upgrades payouts from “best-effort” to <span className="font-semibold">provable</span>.
            </p>
          </Card>
        </div>
      </Section>

      {/* ---------- MOAT & IP ---------- */}
      <Section title="Moat & IP">
        <div className="grid gap-6 md:grid-cols-2">
          <Card title="Why we win and stay won">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li><span className="font-semibold">Deterministic compute:</span> replays match by bytes</li>
              <li><span className="font-semibold">Proof-gated disbursement:</span> funds move only when evidence is fresh & in quorum</li>
              <li><span className="font-semibold">Privacy-first transcripts:</span> auditors verify digests, not raw PII</li>
              <li><span className="font-semibold">Migration guard:</span> dual-run equality before promotion</li>
            </ul>
          </Card>

          <Card title="Patent value trajectory (indicative)">
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full border-collapse text-left text-[15px]">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <Th>Stage</Th>
                    <Th>Legal posture</Th>
                    <Th>What changes</Th>
                    <Th>Patent-only value</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <Row s="1" lp="Non-prov filed (+PCT)" wc="Build-vs-buy calculus starts" v="$0.25–1.5M" />
                  <Row s="2" lp="Notice of Allowance" wc="Legal risk drops; maps to product" v="$1–5M" />
                  <Row s="3" lp="Issued + continuation" wc="Claim runway for leverage" v="$5–20M" />
                  <Row s="4" lp="Mini-portfolio (EU/UK)" wc="Hard to design around" v="$10–50M" />
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Ranges are indicative; company value scales higher with pilots/ARR and lighthouse accounts.
            </p>
          </Card>
        </div>
      </Section>

      {/* ---------- TRACTION & KPIs ---------- */}
      <Section title="Traction & pilot KPIs">
        <div className="grid gap-6 md:grid-cols-3">
          <Metric label="Blocked-run %" value="Target &gt;= 95% bad events caught" />
          <Metric label="Digest-match rate" value="~100% on replays (goal)" />
          <Metric label="Gate latency" value="Sub-minute, burst-safe" />
          <Metric label="Surge stability" value="Queue transparency; no freezes" />
          <Metric label="Dispute rate" value="≤ 0.5% target" />
          <Metric label="DSO" value="≤ 1 day target" />
        </div>
        <p className="mt-3 text-sm text-slate-600">
          Design partner wedge: Ticketed events (on-sale spikes, refunds, multi-party splits); expansion to creators, marketplaces, and usage-based SaaS & AI.
        </p>
      </Section>

      {/* ---------- GTM & BUSINESS MODEL ---------- */}
      <Section title="Go-to-market & business model">
        <div className="grid gap-6 md:grid-cols-2">
          <Card title="GTM motion">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li>Overlay pilot with one high-risk cohort (5–10%)</li>
              <li>Publish transcript digests + reason-coded holds</li>
              <li>Co-sell with proof/ledger partners; reference architecture with rails</li>
            </ul>
          </Card>
          <Card title="Monetization">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li>Volume-based fee (bps) on covered payouts</li>
              <li>Enterprise tier: SLA, audit packs, SSO, data residency</li>
              <li>Add-ons: privacy, fraud, predictive modules</li>
            </ul>
          </Card>
        </div>
      </Section>

      {/* ---------- ROUND DETAILS ---------- */}
      <Section title="Round details">
        <div id="round" className="grid gap-6 md:grid-cols-2">
          <Card title="$10M raise — use of funds">
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full border-collapse text-left text-[15px]">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <Th>Category</Th>
                    <Th>Allocation</Th>
                    <Th>Notes</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <Row3 a="Product & Engineering" b="45%" c="Core settlement, dashboard, SDKs; privacy/fraud modules" />
                  <Row3 a="GTM (BD/Partnerships)" b="20%" c="Design partners, rails/ledger co-sell, solution architecture" />
                  <Row3 a="Security & Compliance" b="15%" c="SOC2/PCI audits; privacy programs; threat modelling" />
                  <Row3 a="Support & Ops" b="10%" c="Pilot success, SLAs, onboarding" />
                  <Row3 a="G&A & Legal (IP)" b="10%" c="Continuations, filings, key hires" />
                </tbody>
              </table>
            </div>
          </Card>

          <Card title="18-month milestones (targets)">
            <ol className="list-decimal space-y-2 pl-5">
              <li>2 lighthouse overlays live (ticketing + one other vertical)</li>
              <li>Digest-match rate ~100%; dispute ≤0.5%; fraud ≤0.3%</li>
              <li>One rails reference design; two integration partners</li>
              <li>Mini-portfolio posture on IP (issued + continuation)</li>
              <li>$1–3M ARR run-rate or 2–3 enterprise expansions</li>
            </ol>
          </Card>
        </div>
      </Section>

      {/* ---------- RISKS & MITIGATIONS ---------- */}
      <Section title="Principal risks & mitigations">
        <div className="grid gap-6 md:grid-cols-2">
          <Card title="Adoption friction">
            <p>Mitigation: Overlay model above existing rails; dual-run and gate only affected items; fast rollback.</p>
          </Card>
          <Card title="Vendor pushback">
            <p>Mitigation: Partner with proof/ledger providers; show value to rails via fewer disputes and happier merchants.</p>
          </Card>
          <Card title="False positives / user impact">
            <p>Mitigation: Reason-coded, surgical holds with clear release paths; bias to not punish good users.</p>
          </Card>
          <Card title="Competitive response">
            <p>Mitigation: Determinism + transcript-gated disbursement + re-shard invariance as a protected combo; keep continuation open.</p>
          </Card>
        </div>
      </Section>

      {/* ---------- TEAM & HIRING ---------- */}
      <Section title="Team & hiring plan">
        <div className="grid gap-6 md:grid-cols-2">
          <Card title="Immediate hires">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li>Founding BD + Solutions Architect (rails/ledger ecosystem)</li>
              <li>Senior Backend (deterministic compute), Security Eng</li>
              <li>Design/UX for audit & finance workflows</li>
            </ul>
          </Card>
          <Card title="Advisors (target)">
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li>Payments/rails executive</li>
              <li>Privacy & compliance lead (GDPR/PCI/SOC2)</li>
              <li>Fraud/abuse expert (platform scale)</li>
            </ul>
          </Card>
        </div>
      </Section>

      {/* ---------- FINAL CTA ---------- */}
      <Section title="Let’s build the settlement standard">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white shadow hover:opacity-95"
          >
            Book an investor session
          </Link>
          <a
            href="#round"
            className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[var(--brand)] ring-1 ring-[var(--brand)] hover:bg-slate-50"
          >
            View round details
          </a>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Forward-looking statements; metrics are targets for pilots and are not guarantees.
        </p>
      </Section>
    </>
  );
}

/* -------------------- local helpers -------------------- */

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">{children}</th>;
}

function Row({
  s, lp, wc, v,
}: {
  s: string; lp: string; wc: string; v: string;
}) {
  return (
    <tr className="align-top">
      <td className="px-4 py-3 font-medium text-slate-900">{s}</td>
      <td className="px-4 py-3 text-slate-800">{lp}</td>
      <td className="px-4 py-3 text-slate-800">{wc}</td>
      <td className="px-4 py-3 text-slate-800">{v}</td>
    </tr>
  );
}

function Row3({ a, b, c }: { a: string; b: string; c: string }) {
  return (
    <tr className="align-top">
      <td className="px-4 py-3 font-medium text-slate-900">{a}</td>
      <td className="px-4 py-3 text-slate-800">{b}</td>
      <td className="px-4 py-3 text-slate-800">{c}</td>
    </tr>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
      <div className="text-sm text-slate-600">{label}</div>
      <div className="mt-1 text-xl font-semibold text-slate-900" dangerouslySetInnerHTML={{ __html: value }} />
    </div>
  );
}
