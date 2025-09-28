import Image from "next/image";
import Link from "next/link";
import { Section, Card } from "../../components/UI";

export default function AboutPage() {
  return (
    <>
      {/* ---------- HERO (badge removed) ---------- */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 pt-10 sm:pt-12 md:pt-14 lg:pt-16">
          <div className="grid items-center gap-6 md:grid-cols-2">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                About Verit Global
              </h1>
              <p className="mt-4 text-[15px] leading-7 text-slate-700 sm:text-base">
                We’re building the settlement layer for the digital economy — turning billions of
                micro-events into payouts you can <span className="font-semibold">prove</span>.
                Our product, <span className="font-semibold">VGoS</span>, releases funds only when
                the numbers match and the required checks pass. That means penny-exact outcomes,
                audit-ready evidence, and fewer incidents.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/product"
                  className="inline-flex items-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-300 hover:bg-slate-50"
                >
                  What we build
                </Link>
                <Link
                  href="/investors"
                  className="inline-flex items-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-300 hover:bg-slate-50"
                >
                  Investor overview
                </Link>
                <Link
                  href="/about/privacy"
                  className="inline-flex items-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-300 hover:bg-slate-50"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>

            {/* Optional banner image */}
            <div className="relative h-[240px] overflow-hidden rounded-2xl ring-1 ring-slate-200 sm:h-[300px] md:h-[340px]">
              <Image
                src="/images/about/hero.jpg"
                alt="Verit Global — About"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- PATENT / IP NOTICE ---------- */}
      <Section title="Intellectual Property">
        <div className="grid gap-6 md:grid-cols-3">
          <Card title="Patent status">
            <p className="text-[15px] leading-7 text-slate-700">
              <span className="font-semibold">Provisional Patent Application</span> on file:
              <br />
              <em>
                “Deterministic Settlement System with Partitioned Ordering and Content-Addressed
                Transcripts”
              </em>
              .
            </p>
            <p className="mt-2 text-[13px] text-slate-600">
              Covers core techniques that enable proof-gated disbursement, replayable results,
              partitioned ordering for surge safety, and content-addressed audit transcripts.
            </p>
          </Card>

          <Card title="Scope (plain language)">
            <ul className="mt-1 list-disc space-y-2 pl-5 text-[15px] leading-7 text-slate-700">
              <li>Byte-identical replays (deterministic math) and carry-ledger fairness.</li>
              <li>Reason-coded “holds” and multi-party acceptance gates before funds move.</li>
              <li>Partitioned ordering for scale—no cross-stream interference at surge.</li>
              <li>Content-addressed transcripts for tamper-evident audits.</li>
            </ul>
          </Card>

          <Card title="Notice">
            <p className="text-[15px] leading-7 text-slate-700">
              © 2025 Verit Global Labs Inc. All rights reserved. Unauthorized use, copying, or
              adaptation of covered methods or artifacts is prohibited.
            </p>
            <div className="mt-3">
              <Link
                href="/contact#security"
                className="text-[var(--brand)] underline-offset-2 hover:underline"
              >
                Contact us for IP questions or disclosure
              </Link>
            </div>
          </Card>
        </div>
      </Section>

      {/* ---------- MISSION & WHAT WE DO ---------- */}
      <Section title="Mission & what we do">
        <div className="grid gap-6 md:grid-cols-3">
          <Card title="Mission">
            <p>
              Make digital payouts <span className="font-semibold">provably correct</span> and
              <span className="font-semibold"> fair</span> — so platforms, partners, and regulators
              can trust outcomes the first time.
            </p>
          </Card>
          <Card title="What we build">
            <p>
              <span className="font-semibold">VGoS</span>, a deterministic payout engine that gates
              disbursement until the math replays identically and required approvals/attestations
              are fresh and in quorum. It sits <em>above</em> existing payout rails.
            </p>
          </Card>
          <Card title="Why it matters">
            <p>
              Legacy stacks drift under concurrency and policy complexity. We replace guesswork with
              evidence, cutting disputes, clawbacks, and incident cost — while speeding audits.
            </p>
          </Card>
        </div>
      </Section>

      {/* ---------- COMPANY SNAPSHOT ---------- */}
      <Section title="Company snapshot">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <dl className="grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-600">Legal</dt>
              <dd className="mt-1 text-base text-slate-900">
                Verit Global Labs Inc. — Delaware C-Corp (2025)
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-600">Product</dt>
              <dd className="mt-1 text-base text-slate-900">
                VGoS deterministic settlement (above existing rails)
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-600">Stack</dt>
              <dd className="mt-1 text-base text-slate-900">
                Next.js + Tailwind · Vercel · GitHub CI
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-600">Core verticals</dt>
              <dd className="mt-1 text-base text-slate-900">
                Gaming & Esports · Creator platforms · AI & usage-based SaaS · Marketplaces & on-demand ·
                Ticketing & live events · Digital media payouts
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-600">Security</dt>
              <dd className="mt-1 text-base text-slate-900">
                SSO/RBAC · TLS 1.3 · AES-256 at rest · tamper-evident logs · audit transcripts
              </dd>
            </div>
          </dl>
        </div>
      </Section>

      {/* ---------- VERTICALS ---------- */}
      <Section title="Verticals we serve">
        <div className="grid gap-6 md:grid-cols-3">
          <Card title="Gaming & Esports">
            <p>Replay-proven rewards; transparent pacing; reason-coded holds on suspected fraud only.</p>
          </Card>
          <Card title="Creator Platforms">
            <p>Deterministic revshare & carries; pre-release tax/withholding checks; fewer clawbacks.</p>
          </Card>
          <Card title="AI & Usage-based SaaS">
            <p>128-bit folds; invoice replays; acceptance-gated release with freshness & quorum.</p>
          </Card>
          <Card title="Marketplaces & On-Demand">
            <p>Deterministic fee splits, cancellations, tips, returns; zero-guesswork migrations.</p>
          </Card>
          <Card title="Ticketing & Live Events">
            <p>Payouts across venues, promoters, and artists; surge-safe with audit-ready transcripts.</p>
          </Card>
          <Card title="Digital Media Payouts">
            <p>Partner/affiliate shares with byte-identical replays; disputes handled with proofs.</p>
          </Card>
        </div>
      </Section>

      {/* ---------- DOWNLOADS ---------- */}
      <Section title="Downloads">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <ul className="grid gap-3 md:grid-cols-2">
            <li>
              <Link href="/downloads/verit-funding-customer-deck.pdf" className="text-[var(--brand)] hover:underline">
                Founding Customers Deck (PDF)
              </Link>
            </li>
            <li>
              <Link href="/downloads/verit-partner-deck.pdf" className="text-[var(--brand)] hover:underline">
                Sales Partners Deck (PDF)
              </Link>
            </li>
            <li>
              <Link href="/downloads/verit-investor-deck.pdf" className="text-[var(--brand)] hover:underline">
                Investor Deck (PDF)
              </Link>
            </li>
            <li>
              <Link href="/downloads/verit-investor-onepager.pdf" className="text-[var(--brand)] hover:underline">
                Investor One-Pager (PDF)
              </Link>
            </li>
            <li>
              <Link href="/downloads/verit-investor-qa.pdf" className="text-[var(--brand)] hover:underline">
                Investor Q&amp;A (PDF)
              </Link>
            </li>
            <li>
              <Link href="/downloads/verit-investor-kit.zip" className="text-[var(--brand)] hover:underline">
                Investor Kit (ZIP)
              </Link>
            </li>
          </ul>
        </div>
      </Section>

      {/* ---------- CTA ---------- */}
      <Section title="Talk with us">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-300 hover:bg-slate-50"
          >
            Contact
          </Link>
          <Link
            href="/investors"
            className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-300 hover:bg-slate-50"
          >
            For investors
          </Link>
          <Link
            href="/product"
            className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-300 hover:bg-slate-50"
          >
            See the product
          </Link>
          <Link
            href="/about/privacy"
            className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-300 hover:bg-slate-50"
          >
            Privacy Policy
          </Link>
        </div>
      </Section>
    </>
  );
}
