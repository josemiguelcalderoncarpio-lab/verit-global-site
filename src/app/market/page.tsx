// src/app/market/page.tsx
// --------------------------------------------------------------------------------------
// Market landing (server component, no client JS)
//
// Tiles show an image, blurb, and two CTAs:
//   • “Run demo” → /vgomini
//   • “Read page” → /market/[market]
//
// Images live in: /public/images/market/{slug}.jpg
//   creators.jpg, marketplaces.jpg, travel.jpg, royalties.jpg, exchanges.jpg
// NOTE: On Vercel/Linux, paths are case-sensitive. Keep folder/file names exact.
// --------------------------------------------------------------------------------------

import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Market | Verit Global",
  description:
    "Deterministic Settlement by market: creators, marketplaces, travel, royalties, and exchanges.",
};

type Item = {
  slug: "creators" | "marketplaces" | "travel" | "royalties" | "exchanges";
  title: string;
  blurb: string;
  pageHref: string;
  demoHref: string;
  imageAlt: string;
};

const INDUSTRIES: Item[] = [
  {
    slug: "creators",
    title: "Creators & Ad/Affiliate Networks",
    blurb:
      "Idempotent ingest across networks; fixed fold order; acceptance with reason-coded holds. Click-through evidence to cash.",
    pageHref: "/market/creators",
    demoHref: "/vgomini",
    imageAlt: "Creator analytics dashboard with payouts and campaign lines",
  },
  {
    slug: "marketplaces",
    title: "Marketplaces & Gig",
    blurb:
      "Order/adjustment ledgers, refunds, and equitable payouts to drivers/sellers—same rails, windowed and replayable.",
    pageHref: "/market/marketplaces",
    demoHref: "/vgomini",
    imageAlt: "Marketplace orders and driver settlement overview",
  },
  {
    slug: "travel",
    title: "Travel Agencies & Supplier Payouts",
    blurb:
      "Bookings + refunds with control totals; supplier payouts tied to sealed transcripts; reconciliation that actually closes.",
    pageHref: "/market/travel",
    demoHref: "/vgomini",
    imageAlt: "Travel booking interface with itinerary and supplier list",
  },
  {
    slug: "royalties",
    title: "Royalties, Media & IP",
    blurb:
      "Deterministic splits, claims, and rights holds; late rounding once; click-through proofs bind statements to cash.",
    pageHref: "/market/royalties",
    demoHref: "/vgomini",
    imageAlt: "Media catalog and royalty statement visualization",
  },
  {
    slug: "exchanges",
    title: "Exchanges & Digital-Asset Platforms",
    blurb:
      "Trades + custody with CT/headers; quorum-based acceptance; GL entries linked to immutable evidence digests.",
    pageHref: "/market/exchanges",
    demoHref: "/vgomini",
    imageAlt: "Trading chart and custody ledger tiles",
  },
];

// Simple tile that uses the public path: /images/market/{slug}.jpg
function Tile({ item }: { item: Item }) {
  const src = `/images/market/${item.slug}.jpg`;
  return (
    <article
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      aria-labelledby={`${item.slug}-title`}
    >
      {/* Banner (no fallback gray; uses your actual asset) */}
      <div className="relative aspect-[16/9] w-full">
        <Image
          src={src}
          alt={item.imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
        {/* Subtle overlay for legibility on light images */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent" />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h2 id={`${item.slug}-title`} className="text-lg font-semibold text-slate-900">
            {item.title}
          </h2>
          <p className="mt-2 text-[14.5px] leading-7 text-slate-700">{item.blurb}</p>
        </div>

        {/* CTAs */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Link
            href={item.demoHref}
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
            aria-label={`Run demo for ${item.title}`}
          >
            Run demo
          </Link>
          <Link
            href={item.pageHref}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-200/70"
            aria-label={`Open market page for ${item.title}`}
          >
            Read page
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function IndustryPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 pt-10">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Market solutions</h1>
        <p className="mt-2 max-w-3xl text-[15px] leading-7 text-slate-700">
          Same math, tailored to your domain. Pick your market to read how it fits your stack—or jump straight into the
          interactive demo.
        </p>
      </header>

      {/* Grid */}
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {INDUSTRIES.map((item) => (
          <Tile key={item.slug} item={item} />
        ))}
      </section>

      {/* Footer tip */}
      <div className="mt-10 rounded-2xl border border-dashed border-slate-200 p-4 text-[13px] text-slate-600">
        Pro tip: In the demo, start in <span className="font-medium text-slate-800">Overview</span> to see the steps at a
        glance, then switch to <span className="font-medium text-slate-800">Old vs New</span> or{" "}
        <span className="font-medium text-slate-800">Storyboard</span> to walk a real window end-to-end.
      </div>
    </main>
  );
}
