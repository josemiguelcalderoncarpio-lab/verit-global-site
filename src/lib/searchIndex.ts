// src/lib/searchIndex.ts
export type SearchDoc = {
  title: string;
  href: string;
  body: string;
  tags?: string[];
};

export const INDEX: SearchDoc[] = [
  {
    title: "Home",
    href: "/",
    body:
      "Set the settlement standard. Deterministic payouts (VGoS). Provably correct before money moves. Penny-exact, audit-ready, fraud-resistant. Ticketed Events wedge; creators, marketplaces, usage-based SaaS & AI next.",
    tags: ["deterministic", "payouts", "audit", "fraud", "investors", "hero"],
  },
  {
    title: "Product — VGoS",
    href: "/product",
    body:
      "We gate disbursement above your existing rails. Three checks: numbers match; required checks pass; the right people sign. Deterministic replays; transcripts; reason-coded holds; integration beside Stripe/Adyen/Hyperwallet/Wise.",
    tags: ["vgos", "determinism", "transcripts", "gate", "stripe", "adyen", "hyperwallet", "wise"],
  },
  {
    title: "Market",
    href: "/market",
    body:
      "Solutions by vertical: Ticketed Events, Creators/Ads/Affiliates, Marketplaces & On-Demand, Usage-based SaaS & AI. Problems → Guarantees → Pilot scope.",
    tags: ["ticketing", "sports", "concerts", "creators", "marketplaces", "ai"],
  },
  {
    title: "Tech & Security",
    href: "/tech",
    body:
      "Architecture snapshot; security posture; deterministic + privacy; compatibility layer; APIs & SDKs; deployment models; SRE/compliance KPIs; implementation plan.",
    tags: ["security", "privacy", "api", "sdk", "deployment", "soc2", "pci"],
  },
  {
    title: "Investors",
    href: "/investors",
    body:
      "Thesis, moat & IP, KPIs, GTM & model, use of funds, milestones, risks. Patent value trajectory. $10M raise to build the settlement standard.",
    tags: ["round", "kpis", "ip", "patent", "fundraise", "moat"],
  },
  {
    title: "About",
    href: "/about",
    body:
      "Mission, what we build, principles, company snapshot (Delaware C-Corp), roadmap at a glance, FAQ. Brand color #014E76.",
    tags: ["mission", "principles", "faq", "brand"],
  },
  {
    title: "Contact",
    href: "/contact",
    body:
      "Formspree contact form. Pilot requests, investor sessions, technical reviews. Deployed on Vercel; Next.js + Tailwind.",
    tags: ["form", "formspree", "pilot", "vercel"],
  },
];
