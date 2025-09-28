"use client";

import React from "react";
import { Hash, Activity } from "../vgo/UI";

export function TranscriptStrip({
  counts,
  segmentHash,
  watermark,
  partitionsK,
}: {
  counts: { ordered: number; dups: number; rejected: number };
  segmentHash: string;
  watermark: string | null;
  partitionsK: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 px-3 py-2 text-[12px]">
      <Chip label="K" value={String(partitionsK)} />
      <Chip label="ordered" value={String(counts.ordered)} />
      <Chip label="dups" value={String(counts.dups)} />
      <Chip label="rejected" value={String(counts.rejected)} />
      <Chip label="watermark" value={watermark || "—"} />
      <Chip label="segment" value={short(segmentHash)} copyable />
    </div>
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
        >
          <Hash className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}

function short(x?: string) {
  if (!x) return "—";
  return x.length <= 12 ? x : `${x.slice(0, 6)}…${x.slice(-4)}`;
}
