"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Product", href: "/product" },
  { label: "Market", href: "/market" },
  { label: "Tech & Security", href: "/tech" },
  { label: "Investors", href: "/investors" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Verit Global logo" width={36} height={36} priority />
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-semibold text-[var(--brand)]">Verit Global</span>
            <span className="mt-0.5 h-0.5 w-full rounded bg-[var(--brand)]" />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "rounded-lg px-3 py-2 text-[15px] font-medium transition focus:outline-none focus:ring-2",
                  active
                    ? "bg-white text-[var(--brand)] ring-1 ring-[var(--brand)]"
                    : "text-slate-800 hover:text-[var(--brand)] hover:ring-1 hover:ring-[var(--brand)] hover:bg-slate-50",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop search (stable attrs + suppressHydrationWarning) */}
        <form action="/search" method="GET" className="hidden md:block" noValidate>
          <label htmlFor="site-search" className="sr-only">Search</label>
          <div className="relative" suppressHydrationWarning>
            <input
              id="site-search"
              name="q"
              type="search"
              placeholder="Search…"
              className="w-56 rounded-full border border-slate-300 bg-white px-4 py-2 text-[15px] shadow-sm outline-none placeholder:text-slate-400 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]"
              aria-label="Search site"
              // Make markup stable on both server & client:
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
              autoComplete="off"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-500 hover:text-slate-700"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="7" strokeWidth="2" />
                <path d="M20 20l-3.5-3.5" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </form>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle navigation"
          className="ml-1 rounded-md p-2 ring-1 ring-slate-300 md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M3 6h18M3 12h18M3 18h18"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Nav + Search */}
      {mobileOpen && (
        <div className="border-t border-slate-200 md:hidden">
          <nav className="mx-auto grid max-w-7xl grid-cols-2 gap-1 px-4 py-2">
            {NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "rounded-lg px-3 py-2 text-sm font-medium transition",
                    active
                      ? "bg-white text-[var(--brand)] ring-1 ring-[var(--brand)]"
                      : "text-slate-800 hover:text-[var(--brand)] hover:ring-1 hover:ring-[var(--brand)] hover:bg-slate-50",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile search (stable attrs + suppressHydrationWarning) */}
          <form action="/search" method="GET" className="mx-auto max-w-7xl px-4 pb-3" noValidate>
            <label htmlFor="site-search-mobile" className="sr-only">Search</label>
            <div suppressHydrationWarning>
              <input
                id="site-search-mobile"
                name="q"
                type="search"
                placeholder="Search…"
                className="w-full rounded-full border border-slate-300 bg-white px-4 py-2 text-[15px] shadow-sm outline-none placeholder:text-slate-400 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]"
                aria-label="Search site (mobile)"
                spellCheck={false}
                autoCorrect="off"
                autoCapitalize="off"
                autoComplete="off"
              />
            </div>
          </form>
        </div>
      )}
    </header>
  );
}
