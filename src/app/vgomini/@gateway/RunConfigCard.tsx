"use client";

import React, { useState } from "react";

const I = {
  Cloud: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="14" height="14" {...p}>
      <path fill="currentColor" d="M6 19a5 5 0 0 1 0-10 6 6 0 0 1 11.3-1.9A4.5 4.5 0 1 1 18 19H6z" />
    </svg>
  ),
  Clipboard: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="12" height="12" {...p}>
      <path fill="currentColor" d="M9 2h6a2 2 0 0 1 2 2h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2-2zm0 2v2h6V4H9z" />
    </svg>
  ),
  ShieldCheck: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="14" height="14" {...p}>
      <path fill="currentColor" d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3zm-1 14-4-4 1.4-1.4L11 13.2l5.6-5.6L18 9l-7 7z" />
    </svg>
  ),
  Activity: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="14" height="14" {...p}>
      <path fill="currentColor" d="M3 12h4l2 7 4-14 3 7h5" />
    </svg>
  ),
  RotateCcw: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="14" height="14" {...p}>
      <path fill="currentColor" d="M12 5V1L7 6l5 5V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z" />
    </svg>
  ),
};

export type RunConfig = {
  windowId: string;
  partitionsK: number;
  writerToken: string;
};

export function RunConfigCard({
  value,
  onChange,
  endpoints,
  chips,
}: {
  value: RunConfig;
  onChange: (v: RunConfig) => void;
  endpoints: { claim: string; renew: string; release: string };
  chips: {
    partitionsK: number;
    watermark: string | null;
    segmentHash: string;
    counts: { ordered: number; dups: number; rejected: number };
  };
}) {
  const [busy, setBusy] = useState(false);

  async function claim() {
    setBusy(true);
    try {
      const res = await fetch(endpoints.claim, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ window_id: value.windowId }),
      });
      const j = await res.json();
      onChange({ ...value, writerToken: j.token || "demo-writer" });
    } finally {
      setBusy(false);
    }
  }

  async function renew() {
    setBusy(true);
    try {
      await fetch(endpoints.renew, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ window_id: value.windowId, token: value.writerToken }),
      });
    } finally {
      setBusy(false);
    }
  }

  async function release() {
    setBusy(true);
    try {
      await fetch(endpoints.release, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ window_id: value.windowId, token: value.writerToken }),
      });
      onChange({ ...value, writerToken: "" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <header className="flex items-center gap-2 border-b border-slate-200 px-3 py-2 text-[12px] font-semibold text-slate-700">
        <I.Cloud className="h-4 w-4" /> Run configuration
      </header>

      <div className="grid grid-cols-1 gap-3 px-3 py-3 md:grid-cols-3">
        {/* Window */}
        <div>
          <label className="mb-1 block text-[12px] font-medium text-slate-700">Window</label>
          <input
            className="w-full rounded border border-slate-300 px-2 py-1 text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
            value={value.windowId}
            onChange={(e) => onChange({ ...value, windowId: e.target.value })}
            placeholder="demo-2025-09-22"
            spellCheck={false}
          />
        </div>

        {/* Partitions */}
        <div>
          <label className="mb-1 block text-[12px] font-medium text-slate-700">Partitions (K)</label>
          <input
            type="number"
            min={1}
            className="w-full rounded border border-slate-300 px-2 py-1 text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
            value={value.partitionsK}
            onChange={(e) => onChange({ ...value, partitionsK: Math.max(1, Number(e.target.value || 1)) })}
          />
        </div>

        {/* Writer token */}
        <div>
          <label className="mb-1 block text-[12px] font-medium text-slate-700">Writer token</label>
          <div className="flex gap-2">
            <input
              className="w-full rounded border border-slate-300 px-2 py-1 text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
              value={value.writerToken}
              onChange={(e) => onChange({ ...value, writerToken: e.target.value })}
              placeholder="claim to populate"
              spellCheck={false}
            />
            <button
              className="btn-mono"
              disabled={busy}
              onClick={claim}
              title="Single-writer per (partition, window)"
              aria-label="Claim writer"
            >
              <I.ShieldCheck className="h-4 w-4" /> Claim
            </button>
            <button
              className="btn-mono"
              disabled={busy || !value.writerToken}
              onClick={renew}
              title="Renew lease"
              aria-label="Renew writer lease"
            >
              <I.Activity className="h-4 w-4" /> Renew
            </button>
            <button
              className="btn-mono"
              disabled={busy || !value.writerToken}
              onClick={release}
              title="Release writer"
              aria-label="Release writer"
            >
              <I.RotateCcw className="h-4 w-4" /> Release
            </button>
          </div>
        </div>
      </div>

      {/* Chips */}
      <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 px-3 py-2 text-[12px]">
        <Chip label="K" value={String(chips.partitionsK)} />
        <Chip label="ordered" value={String(chips.counts.ordered)} />
        <Chip label="dups" value={String(chips.counts.dups)} />
        <Chip label="rejected" value={String(chips.counts.rejected)} />
        <Chip label="watermark" value={chips.watermark || "—"} />
        <Chip label="segment" value={short(chips.segmentHash)} copyable />
      </div>
    </section>
  );
}

function Chip({ label, value, copyable }: { label: string; value: string; copyable?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-50 px-2 py-1 text-slate-700">
      <span className="text-[11px] uppercase tracking-wide text-slate-500">{label}</span>
      <span className="text-[12px] font-semibold">{value}</span>
      {copyable && (
        <button
          className="ml-1 inline-flex items-center rounded border border-slate-300 bg-white px-1 py-[2px] text-[11px] text-slate-600 hover:bg-slate-100"
          onClick={() => navigator.clipboard.writeText(value)}
          title="Copy"
          aria-label={`Copy ${label}`}
        >
          <I.Clipboard className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}

function short(x?: string) {
  if (!x) return "—";
  return x.length <= 12 ? x : `${x.slice(0, 6)}…${x.slice(-4)}`;
}
