
"use client";
import React from "react";

type CSSVars = React.CSSProperties & { ["--d"]?: string };
type Item = { time?: string; text: React.ReactNode };

export function AutoScrollBeforeAfter({
  before,
  after,
  height = 360,
  beforeDurationSec = 36,
  afterDurationSec = 20,
  titleBefore = "BEFORE — Spreadsheet orchestration (ERP + PSP, no Verit)",
  titleAfter = "AFTER — Verit as a proof-gated disbursement gate (with ERP + PSP)",
  fadeFromClass = "from-slate-50",
}: {
  before: Item[];
  after: Item[];
  height?: number;
  beforeDurationSec?: number;
  afterDurationSec?: number;
  titleBefore?: string;
  titleAfter?: string;
  fadeFromClass?: string;
}) {
  return (
    <section className="w-full">
      <style jsx global>{`
        @keyframes auto-scroll-y {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .auto-scroll { animation: auto-scroll-y var(--d, 36s) linear infinite; will-change: transform; }
        .auto-scroll:hover, .auto-scroll:focus-within { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { .auto-scroll { animation: none !important; } }
      `}</style>

      <div className="grid gap-6 md:grid-cols-2">
        {/* BEFORE */}
        <div className="rounded-2xl border bg-white shadow-sm">
          <header className="px-5 pb-3 pt-4">
            <h3 className="text-base font-semibold">{titleBefore}</h3>
          </header>
          <div className="relative overflow-hidden" style={{ height }} aria-label="Before timeline">
            <div className={`pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b ${fadeFromClass} to-transparent`} />
            <div className={`pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t ${fadeFromClass} to-transparent`} />
            <div className="auto-scroll" style={{ ["--d"]: `${beforeDurationSec}s` } as CSSVars} role="log" aria-live="polite">
              <ul className="space-y-2 px-5 pb-6">
                {before.map((it, i) => (
                  <li key={`before-a-${i}`} className="flex gap-3 text-sm leading-5">
                    {it.time && <span className="shrink-0 tabular-nums font-medium">{it.time}</span>}
                    <span className="text-slate-800">{it.text}</span>
                  </li>
                ))}
              </ul>
              <ul className="space-y-2 px-5 pb-6">
                {before.map((it, i) => (
                  <li key={`before-b-${i}`} className="flex gap-3 text-sm leading-5">
                    {it.time && <span className="shrink-0 tabular-nums font-medium">{it.time}</span>}
                    <span className="text-slate-800">{it.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* AFTER */}
        <div className="rounded-2xl border bg-white shadow-sm">
          <header className="px-5 pb-3 pt-4">
            <h3 className="text-base font-semibold">{titleAfter}</h3>
          </header>
          <div className="relative overflow-hidden" style={{ height }} aria-label="After timeline">
            <div className={`pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b ${fadeFromClass} to-transparent`} />
            <div className={`pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t ${fadeFromClass} to-transparent`} />
            <div className="auto-scroll" style={{ ["--d"]: `${afterDurationSec}s` } as CSSVars} role="log" aria-live="polite">
              <ul className="space-y-2 px-5 pb-6">
                {after.map((it, i) => (
                  <li key={`after-a-${i}`} className="flex gap-3 text-sm leading-5">
                    {it.time && <span className="shrink-0 tabular-nums font-medium">{it.time}</span>}
                    <span className="text-slate-800">{it.text}</span>
                  </li>
                ))}
              </ul>
              <ul className="space-y-2 px-5 pb-6">
                {after.map((it, i) => (
                  <li key={`after-b-${i}`} className="flex gap-3 text-sm leading-5">
                    {it.time && <span className="shrink-0 tabular-nums font-medium">{it.time}</span>}
                    <span className="text-slate-800">{it.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-gray-500">Hover to pause. We respect “Reduce Motion”.</p>
    </section>
  );
}

export type { Item };
