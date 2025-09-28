// src/app/contact/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Section, Card } from "../../components/UI";

// -------- Real company + routing --------
const COMPANY_NAME = "Verit Global Labs Inc.";
const PHONE = "+19548717524"; // E.164 for tel:
const PHONE_DISPLAY = "954 871 75 24";

const CONTACTS = {
  investors: "investors@veritglobal.com",
  sales: "sales@veritglobal.com",
  partnerships: "partnerships@veritglobal.com",
  security: "security@veritglobal.com",
  press: "press@veritglobal.com",
  support: "support@veritglobal.com",
  billing: "billing@veritglobal.com",
  careers: "careers@veritglobal.com",
  hero: "hero@veritglobal.com",
};

const CAL_SALES_URL = process.env.NEXT_PUBLIC_CAL_SALES_URL || ""; // e.g. https://cal.com/veritglobal/intro-30

// -------- Downloads map (exclusive are gated under /exclusive/downloads; public are under /public/downloads) --------
const DOWNLOADS = {
  // Exclusive (business-email gated)
  foundingCustomerDeck: { label: "Founding Customers Deck (PDF)", href: "/exclusive/downloads/verit-funding-customer-deck.pdf" }, // filename uses 'funding'
  investorKitZip:       { label: "Investor Kit (ZIP)",              href: "/exclusive/downloads/verit-investor-kit.zip" },
  investorDeck:         { label: "Investor Deck (PDF)",             href: "/exclusive/downloads/verit-investor-deck.pdf" },
  investorQA:           { label: "Investor Q&A (PDF)",              href: "/exclusive/downloads/verit-investor-qa.pdf" },
  partnerDeck:          { label: "Sales Partners Deck (PDF)",       href: "/exclusive/downloads/verit-partner-deck.pdf" },
  strategicPartnerDeck: { label: "Strategic Integration Partners Deck (PDF)", href: "/exclusive/downloads/verit-strategic-partner-deck.pdf" }, // singular file name
  universityDeck:       { label: "University Program Deck (PDF)",   href: "/exclusive/downloads/verit-university-program-deck.pdf" },
  heroProgramDeck:      { label: "Hero Referral Program (PDF)",     href: "/exclusive/downloads/verit-hero-program-deck.pdf" },
  techDeck:             { label: "Technical Architecture Deck (PDF)", href: "/exclusive/downloads/verit-tech-deck.pdf" },

  // Public (no gate)
  investorOnePager:     { label: "Investor One-Pager (PDF)",        href: "/downloads/verit-investor-onepager.pdf" },
  techOnePager:         { label: "Technical One-Pager (PDF)",       href: "/downloads/verit-tech-onepager.pdf" },
  freelanceIcDeckPublic:{ label: "Freelance / IC Deck (PDF)",       href: "/downloads/verit-freelance_ic_deck.pdf" },
} as const;

/* ---------------- Consent gate (client-only, tiny) ---------------- */
const CONSENT_KEY = "verit:consent:v1";
type ConsentPayload = { agreed: true; version: "v1"; name?: string; email?: string; at?: string };

function hasConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as ConsentPayload;
    return parsed?.agreed === true && parsed?.version === "v1";
  } catch {
    return false;
  }
}

// Only gate truly-exclusive assets. Public /downloads/* should NOT be gated.
function isExclusiveDownload(href: string): boolean {
  return href.startsWith("/exclusive/downloads/");
}

/** Link that enforces consent ONLY for /exclusive/downloads; falls back to normal Link otherwise. */
function DownloadLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  // Not an exclusive asset — behave exactly like a normal Link
  if (!isExclusiveDownload(href)) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  // Exclusive asset — require consent
  return (
    <Link
      href={href}
      className={className}
      onClick={(e) => {
        if (!hasConsent()) {
          e.preventDefault();
          router.push(`/agree?return=${encodeURIComponent(href)}&need=business`);
        }
      }}
      prefetch={false}
    >
      {children}
    </Link>
  );
}

/* ---------------- Utilities ---------------- */
function mailto(email: string, subject?: string, body?: string) {
  const q: string[] = [];
  if (subject) q.push(`subject=${encodeURIComponent(subject)}`);
  if (body) q.push(`body=${encodeURIComponent(body)}`);
  const qs = q.length ? `?${q.join("&")}` : "";
  return `mailto:${email}${qs}`;
}

/* ---------------- Page ---------------- */
export default function ContactPage() {
  return (
    <>
      {/* -------------------- TOP HERO: HERO REFERRALS -------------------- */}
      <section id="hero" className="relative border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-cyan-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:py-7 md:py-8">
          <div className="grid items-center gap-6 md:grid-cols-[1.2fr,0.8fr]">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Hero Program — 10% forever on deals you refer</h1>
              <p className="mt-2 max-w-2xl text-[15px] leading-7 text-slate-700">
                Know a person or company who should use Deterministic Settlement? Make the intro, we’ll run the process end-to-end, and you earn <strong>10% of our platform benefits</strong> for the lifetime of the account.
              </p>
              <p className="mt-2 text-[13px] text-slate-600">
                Send your intro to <Link href={`mailto:${CONTACTS.hero}`} className="text-[var(--brand)] hover:underline">{CONTACTS.hero}</Link> and we’ll reply with full details and the agreement.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href={mailto(CONTACTS.hero, "Hero referral", `Intro:
• Person/Company:
• Contact:
• Why a fit:
• Your name & payment details:`)}
                  className="inline-flex items-center rounded-xl bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-95"
                >
                  Email hero@veritglobal.com
                </Link>
                <DownloadLink
                  href={DOWNLOADS.heroProgramDeck.href}
                  className="inline-flex items-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-300 hover:bg-slate-50"
                >
                  Program one-pager (PDF)
                </DownloadLink>
              </div>
            </div>
            <div className="relative h-[160px] rounded-2xl border border-emerald-200 bg-white/60 p-5">
              <ul className="list-disc space-y-1 pl-5 text-[14px] text-slate-800">
                <li><strong>Simple:</strong> make an intro, we drive the deal</li>
                <li><strong>Aligned:</strong> paid on realized platform benefits</li>
                <li><strong>Durable:</strong> lifetime of the account</li>
                <li><strong>Transparent:</strong> we share status and milestones</li>
              </ul>
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-emerald-300/50" />
            </div>
          </div>
        </div>
      </section>

      {/* -------------------- TOP HERO: PROGRAMS -------------------- */}
      <section className="bg-white">
        <div className="relative mx-auto max-w-7xl px-4 pt-28 sm:pt-32 md:pt-36 lg:pt-40">
          {/* top-right logo (desktop) — now fixed path */}
          <div className="pointer-events-none absolute right-6 top-6 z-10 hidden select-none md:block">
            <BrandLogo className="h-44 w-auto md:h-48" />
          </div>
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Programs</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-700">
            Founding customers, investors, and partners each have a fast lane to the right team.
          </p>

          {/* Equal-height cards */}
          <div className="mt-12 grid items-stretch gap-10 md:grid-cols-3">
            {/* Early / Founding Customers */}
            <ProgramCard>
              <Card title="Early / Founding Customers">
                <div className="flex min-h-[260px] flex-1 flex-col">
                  <p className="text-[15px] leading-7 text-slate-700">
                    Join the Founding Customers Program: no platform fees forever, revenue-share upside, and white-glove dual-run migration. Limited slots by vertical.
                  </p>

                  <div className="mt-auto flex flex-wrap gap-3 pt-4">
                    <Link
                      href={mailto(
                        CONTACTS.sales,
                        "Founding Customer Program",
                        "Hi Verit—please consider us for the Founding Customers Program."
                      )}
                      className="inline-flex items-center rounded-xl bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-95"
                    >
                      Apply for early access
                    </Link>
                    <DownloadLink
                      href={DOWNLOADS.foundingCustomerDeck.href}
                      className="inline-flex items-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[var(--brand)] ring-1 ring-[var(--brand)] hover:bg-slate-50"
                    >
                      Founding Customers Deck
                    </DownloadLink>
                  </div>
                </div>
              </Card>
            </ProgramCard>

            {/* Investors */}
            <ProgramCard>
              <Card title="Investors">
                <div className="flex min-h-[260px] flex-1 flex-col">
                  <p className="text-[15px] leading-7 text-slate-700">
                    VC / PE / strategics. Get the overview and materials pack.
                  </p>

                  <div className="mt-auto flex flex-wrap gap-3 pt-4">
                    <Link
                      href={mailto(CONTACTS.investors, "Investor intro", "Hi Verit—I’d like to talk about the round.")}
                      className="inline-flex items-center rounded-xl bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-95"
                    >
                      Email investors
                    </Link>
                    <DownloadLink
                      href={DOWNLOADS.investorKitZip.href}
                      className="inline-flex items-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[var(--brand)] ring-1 ring-[var(--brand)] hover:bg-slate-50"
                    >
                      Investor Kit (ZIP)
                    </DownloadLink>
                  </div>
                </div>
              </Card>
            </ProgramCard>

            {/* Sales Partners */}
            <ProgramCard>
              <Card title="Sales Partners">
                <div className="flex min-h-[260px] flex-1 flex-col">
                  <p className="text-[15px] leading-7 text-slate-700">
                    Payment providers, auditors, DSPs, and platform partners. Let’s integrate and go to market together.
                  </p>

                  <div className="mt-auto flex flex-wrap gap-3 pt-4">
                    <Link
                      href={mailto(CONTACTS.partnerships, "Partnerships", "Hi Verit—let’s explore an integration/partnership.")}
                      className="inline-flex items-center rounded-xl bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-95"
                    >
                      Partner with us
                    </Link>
                    <DownloadLink
                      href={DOWNLOADS.partnerDeck.href}
                      className="inline-flex items-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[var(--brand)] ring-1 ring-[var(--brand)] hover:bg-slate-50"
                    >
                      Sales Partners Deck
                    </DownloadLink>
                    {CAL_SALES_URL && (
                      <Link
                        href={CAL_SALES_URL}
                        className="inline-flex items-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[var(--brand)] ring-1 ring-[var(--brand)] hover:bg-slate-50"
                      >
                        Book intro
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            </ProgramCard>

            {/* Strategic Integration Partners */}
            <ProgramCard>
              <Card title="Strategic Integration Partners (ISVs / ERPs / PSPs)">
                <div className="flex min-h-[260px] flex-1 flex-col">
                  <p className="text-[15px] leading-7 text-slate-700">
                    Co-build certified interfaces (e.g., NetSuite, SAP, Stripe, Adyen), SDKs, and connectors. Joint GTM and solution playbooks.
                  </p>
                  <div className="mt-auto flex flex-wrap gap-3 pt-4">
                    <Link
                      href={mailto(CONTACTS.partnerships, "Strategic Integration Partner", "Hi Verit—interested in co-developing an interface/connector.")}
                      className="inline-flex items-center rounded-xl bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-95"
                    >
                      Become a strategic partner
                    </Link>
                    <DownloadLink
                      href={DOWNLOADS.strategicPartnerDeck.href}
                      className="inline-flex items-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[var(--brand)] ring-1 ring-[var(--brand)] hover:bg-slate-50"
                    >
                      Strategic Partners Deck
                    </DownloadLink>
                  </div>
                </div>
              </Card>
            </ProgramCard>

            {/* University Research Partners */}
            <ProgramCard>
              <Card title="University Research Partners">
                <div className="flex min-h-[260px] flex-1 flex-col">
                  <p className="text-[15px] leading-7 text-slate-700">
                    Collaborate on deterministic finance, compliance transparency, and reproducible computing. Ideal for labs and capstone projects.
                  </p>
                  <div className="mt-auto flex flex-wrap gap-3 pt-4">
                    <Link
                      href={mailto(CONTACTS.partnerships, "University partnership", "Hi Verit—we’re exploring a research/education partnership.")}
                      className="inline-flex items-center rounded-xl bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-95"
                    >
                      Propose collaboration
                    </Link>
                    <DownloadLink
                      href={DOWNLOADS.universityDeck.href}
                      className="inline-flex items-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[var(--brand)] ring-1 ring-[var(--brand)] hover:bg-slate-50"
                    >
                      University Program Deck
                    </DownloadLink>
                  </div>
                </div>
              </Card>
            </ProgramCard>

            {/* Freelancers & Studios */}
            <ProgramCard>
              <Card title="Freelancers & Studios (Co-development)">
                <div className="flex min-h-[260px] flex-1 flex-col">
                  <p className="text-[15px] leading-7 text-slate-700">
                    Join our freelance network to build connectors, SDK samples, and pilot integrations. Great fit for boutique agencies and ICs.
                  </p>
                  <div className="mt-auto flex flex-wrap gap-3 pt-4">
                    <Link
                      href={mailto(CONTACTS.careers, "Freelance / IC collaboration", "Hi Verit—here’s my profile/portfolio; interested in co-development work.")}
                      className="inline-flex items-center rounded-xl bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-95"
                    >
                      Join the network
                    </Link>
                    {/* Public deck (no gate) */}
                    <DownloadLink
                      href={DOWNLOADS.freelanceIcDeckPublic.href}
                      className="inline-flex items-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[var(--brand)] ring-1 ring-[var(--brand)] hover:bg-slate-50"
                    >
                      {DOWNLOADS.freelanceIcDeckPublic.label}
                    </DownloadLink>
                    <Link
                      href="#careers"
                      className="inline-flex items-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-300 hover:bg-slate-50"
                    >
                      See roles & expectations
                    </Link>
                  </div>
                </div>
              </Card>
            </ProgramCard>
          </div>
        </div>
      </section>

      {/* -------------------- CAREERS -------------------- */}
      <Section title="Careers (Founding team)">
        <div className="grid gap-6 md:grid-cols-2">
          <Card title="Open roles (equity-first at this stage)">
            <ul className="mt-1 list-disc space-y-2 pl-5 text-[15px] leading-7 text-slate-700">
              <li>Principal Architect (distributed systems, fintech)</li>
              <li>Backend Engineers (Go/Rust/Java; governance, privacy, fraud)</li>
              <li>Frontend Engineer (React/TypeScript; console & DX)</li>
              <li>DevOps/Infra (Kubernetes, CI/CD, security/compliance)</li>
              <li>ML/Data Engineer (fraud detection, privacy-preserving analytics)</li>
              <li>Product Manager (B2B SaaS, developer experience)</li>
              <li>Technical Writer / DevRel (docs, SDK examples)</li>
              <li>Compliance/Legal (SOC2, PCI, GDPR/CCPA)</li>
              <li>Sales Engineer (enterprise integrations, PoCs)</li>
            </ul>
            <p className="mt-3 text-[13px] text-slate-600">
              Roles align with the MVP team plan and platform architecture in our technical implementation guide.
            </p>
            <div className="mt-auto flex flex-wrap gap-3 pt-2">
              <Link
                href={mailto(CONTACTS.careers, "Founding role application", "Hi Verit—I’d like to apply. Role: ...  Links: ...")}
                className="inline-flex items-center rounded-xl bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-95"
              >
                Email careers
              </Link>
              <DownloadLink
                href={DOWNLOADS.investorKitZip.href}
                className="inline-flex items-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[var(--brand)] ring-1 ring-[var(--brand)] hover:bg-slate-50"
              >
                Read more about us
              </DownloadLink>
            </div>
          </Card>

          <Card title="How we work">
            <ul className="mt-1 list-disc space-y-2 pl-5 text-[15px] leading-7 text-slate-700">
              <li>Pre-funding: equity-heavy compensation; remote-first</li>
              <li>Security & privacy by default; code with proofs & transcripts</li>
              <li>Short pilot cycles (30 days), dual-run comparisons, reason-coded holds</li>
              <li>High bar for design/UX in console & SDKs</li>
            </ul>
            <p className="mt-3 text-[13px] text-slate-600">
              We’re implementing a production-grade platform described in our guide; expect real ownership and impact.
            </p>
          </Card>
        </div>
      </Section>

      {/* -------------------- BY PROFILE -------------------- */}
      <Section title="By profile">
        <div className="grid items-stretch gap-6 md:grid-cols-3">
          <ContactCard
            id="sales"
            title="Sales / Pilot"
            body="Choose a wedge (tournament, cohort, city, SKU). We dual-run and gate only where evidence is missing."
            primaryHref={mailto(CONTACTS.sales, "Pilot request", "Hi Verit—I’d like to scope a 30-day pilot.")}
            primaryLabel="Email sales"
            secondaryHref={CAL_SALES_URL || undefined}
            secondaryLabel={CAL_SALES_URL ? "Book 30-min intro" : undefined}
          />

          <ContactCard
            id="partnerships"
            title="Partnerships / Integrations"
            body="Tech alliances, PSPs, ERPs, ISVs — co-build interfaces and joint GTM."
            primaryHref={mailto(CONTACTS.partnerships, "Partnerships", "Hi Verit—partnership/integration interest: ")}
            primaryLabel="Email partnerships"
            secondaryHref={DOWNLOADS.partnerDeck.href}
            secondaryLabel="Sales Partners Deck"
            extraLinks={[{ href: DOWNLOADS.strategicPartnerDeck.href, label: DOWNLOADS.strategicPartnerDeck.label }]}
          />

          <ContactCard
            id="universities"
            title="Universities / Research"
            body="Co-develop on deterministic settlement, compliance transparency, reproducible compute. Senior projects and research labs welcome."
            primaryHref={mailto(CONTACTS.partnerships, "University partnership", "Hi Verit—university collaboration idea: ")}
            primaryLabel="Email partnerships"
            secondaryHref={DOWNLOADS.universityDeck.href}
            secondaryLabel="University Program Deck"
          />

          <ContactCard
            id="security"
            title="Security / Disclosure"
            body="Report a vulnerability or security concern. We acknowledge within 24–48 hours."
            primaryHref={mailto(CONTACTS.security, "Security disclosure", "Hi Verit—I’d like to privately disclose a potential issue.")}
            primaryLabel="Email security"
          />

          <ContactCard
            id="support"
            title="Support / Billing"
            body="Customer support, billing, and tax documentation."
            primaryHref={mailto(CONTACTS.support, "Support request", "Hi Verit—support/billing question:")}
            primaryLabel="Email support"
            secondaryHref={mailto(CONTACTS.billing, "Billing", "Hi Verit—billing question:")}
            secondaryLabel="Billing"
          />

          <ContactCard
            id="careers"
            title="Careers / Freelance network"
            body="Founding roles and freelance/boutique collaborations for connectors, SDKs, and pilots."
            primaryHref={mailto(CONTACTS.careers, "Founding role or freelance collaboration", "Hi Verit—role/freelance: ...  Links: ...")}
            primaryLabel="Email careers"
            secondaryHref={DOWNLOADS.freelanceIcDeckPublic.href} // public deck
            secondaryLabel={DOWNLOADS.freelanceIcDeckPublic.label}
          />

          <ContactCard
            id="press"
            title="Press / Media"
            body="Briefings, quotes, and speaking requests."
            primaryHref={mailto(CONTACTS.press, "Press inquiry", "Hi Verit—press/media request:")}
            primaryLabel="Email press"
          />

          <ContactCard
            id="investors-2"
            title="Investors"
            body="For materials and intros if you skipped the top section."
            primaryHref={mailto(CONTACTS.investors, "Investor intro", "Hi Verit—I’d like to talk about the round.")}
            primaryLabel="Email investors"
            secondaryHref={DOWNLOADS.investorKitZip.href}
            secondaryLabel="Investor Kit (ZIP)"
          />

          {/* Technology / Architecture: public one-pager as primary, exclusive long deck as extra */}
          <ContactCard
            id="technology"
            title="Technology / Architecture"
            body="Deep dive into compute shape, carry-ledger, transcripts, and proof-gated disbursement. Ideal for CTOs, architects, and diligence."
            primaryHref={DOWNLOADS.techOnePager.href}     // public
            primaryLabel={DOWNLOADS.techOnePager.label}
            secondaryHref={mailto(CONTACTS.support, "Technical questions", "Hi Verit—technical question:")}
            secondaryLabel="Ask a question"
            extraLinks={[{ href: DOWNLOADS.techDeck.href, label: DOWNLOADS.techDeck.label }]} // gated long deck
          />
        </div>
      </Section>

      {/* -------------------- DIRECT INFO -------------------- */}
      <Section title="Direct info">
        <div className="grid gap-6 md:grid-cols-3">
          <Card title="Email directory">
            <ul className="space-y-2 text-[15px] leading-7 text-slate-700">
              <li><strong>Investors:</strong> <Link href={`mailto:${CONTACTS.investors}`} className="text-[var(--brand)] hover:underline">{CONTACTS.investors}</Link></li>
              <li><strong>Sales:</strong> <Link href={`mailto:${CONTACTS.sales}`} className="text-[var(--brand)] hover:underline">{CONTACTS.sales}</Link></li>
              <li><strong>Partnerships:</strong> <Link href={`mailto:${CONTACTS.partnerships}`} className="text-[var(--brand)] hover:underline">{CONTACTS.partnerships}</Link></li>
              <li><strong>Security:</strong> <Link href={`mailto:${CONTACTS.security}`} className="text-[var(--brand)] hover:underline">{CONTACTS.security}</Link></li>
              <li><strong>Press:</strong> <Link href={`mailto:${CONTACTS.press}`} className="text-[var(--brand)] hover:underline">{CONTACTS.press}</Link></li>
              <li><strong>Support:</strong> <Link href={`mailto:${CONTACTS.support}`} className="text-[var(--brand)] hover:underline">{CONTACTS.support}</Link></li>
              <li><strong>Billing:</strong> <Link href={`mailto:${CONTACTS.billing}`} className="text-[var(--brand)] hover:underline">{CONTACTS.billing}</Link></li>
              <li><strong>Careers:</strong> <Link href={`mailto:${CONTACTS.careers}`} className="text-[var(--brand)] hover:underline">{CONTACTS.careers}</Link></li>
            </ul>
          </Card>

          <Card title="Company">
            <div className="space-y-2 text-[15px] leading-7 text-slate-700">
              <div><strong>Legal name:</strong> {COMPANY_NAME}</div>
              <div>
                <strong>Incorporated:</strong> Delaware, USA (2025) via{" "}
                <Link href="https://firstbase.io" className="text-[var(--brand)] hover:underline" target="_blank" rel="noopener noreferrer">
                  Firstbase.io
                </Link>
              </div>
              <div><strong>Hours:</strong> Mon–Fri, 9:00–17:00 ET • <strong>Response:</strong> 24–48 hours</div>
            </div>
          </Card>

          <Card title="Files">
            <ul className="space-y-2 text-[15px] leading-7 text-slate-700">
              {/* Exclusive */}
              <li><DownloadLink href={DOWNLOADS.foundingCustomerDeck.href} className="text-[var(--brand)] hover:underline">{DOWNLOADS.foundingCustomerDeck.label}</DownloadLink></li>
              <li><DownloadLink href={DOWNLOADS.partnerDeck.href} className="text-[var(--brand)] hover:underline">{DOWNLOADS.partnerDeck.label}</DownloadLink></li>
              <li><DownloadLink href={DOWNLOADS.strategicPartnerDeck.href} className="text-[var(--brand)] hover:underline">{DOWNLOADS.strategicPartnerDeck.label}</DownloadLink></li>
              <li><DownloadLink href={DOWNLOADS.universityDeck.href} className="text-[var(--brand)] hover:underline">{DOWNLOADS.universityDeck.label}</DownloadLink></li>
              <li><DownloadLink href={DOWNLOADS.investorDeck.href} className="text-[var(--brand)] hover:underline">{DOWNLOADS.investorDeck.label}</DownloadLink></li>
              <li><DownloadLink href={DOWNLOADS.investorQA.href} className="text-[var(--brand)] hover:underline">{DOWNLOADS.investorQA.label}</DownloadLink></li>
              <li><DownloadLink href={DOWNLOADS.investorKitZip.href} className="text-[var(--brand)] hover:underline">{DOWNLOADS.investorKitZip.label}</DownloadLink></li>
              <li><DownloadLink href={DOWNLOADS.techDeck.href} className="text-[var(--brand)] hover:underline">{DOWNLOADS.techDeck.label}</DownloadLink></li>

              {/* Public */}
              <li><DownloadLink href={DOWNLOADS.investorOnePager.href} className="text-[var(--brand)] hover:underline">{DOWNLOADS.investorOnePager.label}</DownloadLink></li>
              <li><DownloadLink href={DOWNLOADS.techOnePager.href} className="text-[var(--brand)] hover:underline">{DOWNLOADS.techOnePager.label}</DownloadLink></li>
              <li><DownloadLink href={DOWNLOADS.freelanceIcDeckPublic.href} className="text-[var(--brand)] hover:underline">{DOWNLOADS.freelanceIcDeckPublic.label}</DownloadLink></li>
            </ul>
          </Card>
        </div>
      </Section>

      {/* -------------------- BOTTOM: TALK TO A HUMAN -------------------- */}
      <Section title="Talk to a human">
        <div className="grid gap-6 md:grid-cols-3">
          <Card title="Phone">
            <p className="text-[15px] leading-7 text-slate-700">
              Prefer voice? A human will answer during business hours.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Link
                href={`tel:${PHONE}`}
                className="inline-flex items-center rounded-xl bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-95"
                aria-label={`Call ${PHONE_DISPLAY}`}
              >
                Call {PHONE_DISPLAY}
              </Link>
              {CAL_SALES_URL && (
                <Link
                  href={CAL_SALES_URL}
                  className="inline-flex items-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[var(--brand)] ring-1 ring-[var(--brand)] hover:bg-slate-50"
                >
                  Book 30-min intro
                </Link>
              )}
            </div>
          </Card>

          <Card title="Response times">
            <ul className="mt-1 list-disc space-y-2 pl-5 text-[15px] leading-7 text-slate-700">
              <li>Business hours: Mon–Fri, 9:00–17:00 ET</li>
              <li>Typical email response: 24–48 hours</li>
              <li>Security disclosures: acknowledged within 24–48 hours</li>
            </ul>
          </Card>

          <Card title="Routing tip">
            <p className="text-[15px] leading-7 text-slate-700">
              Using the specific emails above (investors, partnerships, support) is the fastest way to reach the right team.
            </p>
          </Card>
        </div>
      </Section>
    </>
  );
}

/* --- Helpers --- */

// Ensures equal height for Program cards regardless of content length
function ProgramCard({ children }: { children: React.ReactNode }) {
  return (
    <section className="h-full">
      <div className="flex h-full">
        {/* Card sits inside a flex container; inner content uses min-h and mt-auto on actions */}
        {children}
      </div>
    </section>
  );
}

function ContactCard({
  id,
  title,
  body,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  extraLinks,
  minHeightClass,
}: {
  id?: string;
  title: string;
  body: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  extraLinks?: { href: string; label: string }[];
  minHeightClass?: string; // e.g., "min-h-[240px]" | "h-[340px]"
}) {
  // Choose DownloadLink only when the href is a gated exclusive file
  const Primary = isExclusiveDownload(primaryHref) ? DownloadLink : Link;
  const Secondary = secondaryHref && isExclusiveDownload(secondaryHref) ? DownloadLink : Link;

  return (
    <section id={id} className="h-full">
      <Card title={title}>
        <div className={`flex flex-col ${minHeightClass || "min-h-[240px]"}`}>
          <p className="text-[15px] leading-7 text-slate-700">{body}</p>

          <div className="mt-auto flex flex-wrap gap-3 pt-2">
            <Primary
              href={primaryHref}
              className="inline-flex items-center rounded-xl bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-95"
            >
              {primaryLabel}
            </Primary>

            {secondaryHref && secondaryLabel ? (
              <Secondary
                href={secondaryHref}
                className="inline-flex items-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[var(--brand)] ring-1 ring-[var(--brand)] hover:bg-slate-50"
              >
                {secondaryLabel}
              </Secondary>
            ) : null}
          </div>

          {extraLinks && extraLinks.length > 0 && (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {extraLinks.map((l) => {
                const Extra = isExclusiveDownload(l.href) ? DownloadLink : Link;
                return (
                  <li key={l.href}>
                    <Extra href={l.href} className="text-[var(--brand)] hover:underline">
                      {l.label}
                    </Extra>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Card>
    </section>
  );
}

function BrandLogo({ className }: { className?: string }) {
  // Use the known-good asset only; avoids 404s and "invalid image" warnings
  return (
    <Image
      src="/logo.png"
      alt={COMPANY_NAME}
      width={260}
      height={84}
      className={className || "h-10 w-auto"}
      priority
    />
  );
}
