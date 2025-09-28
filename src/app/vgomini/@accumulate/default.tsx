"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import AccumulateGuide from "./AccumulateGuide";
import { useVGO } from "../vgo/VGOProvider";
import { useRouter } from "next/navigation";

/* ───────── icons (mono) ───────── */
const I = {
  Table: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="14" height="14" {...p}>
      <path fill="currentColor" d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5zm2 2v3h14V7H5zm0 5v7h6v-7H5zm8 0v7h6v-7h-6z"/>
    </svg>
  ),
  CloudDown: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="14" height="14" {...p}>
      <path fill="currentColor" d="M6 19a5 5 0 0 1 0-10 6 6 0 0 1 11.3-1.9A4.5 4.5 0 1 1 18 19H6zm6-3 4-4h-3V8h-2v4H8l4 4z"/>
    </svg>
  ),
  Refresh: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="14" height="14" {...p}>
      <path fill="currentColor" d="M12 6V2l5 5-5 5V8a5 5 0 1 0 5 5h2A7 7 0 1 1 12 6z"/>
    </svg>
  ),
  Save: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="14" height="14" {...p}>
      <path fill="currentColor" d="M17 3H5a2 2 0 0 0-2 2v14l4-4h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-2 6H7V7h8v2z"/>
    </svg>
  ),
  RotateCcw: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="14" height="14" {...p}>
      <path fill="currentColor" d="M12 5V1L7 6l5 5V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z"/>
    </svg>
  ),
  Alert: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="14" height="14" {...p}>
      <path fill="currentColor" d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
    </svg>
  ),
  Check: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="14" height="14" {...p}>
      <path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/>
    </svg>
  ),
  Flag: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="14" height="14" {...p}>
      <path fill="currentColor" d="M4 2h2v20H4V2zm4 2h10l-3 4 3 4H8z"/>
    </svg>
  ),
  Copy: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="14" height="14" {...p}><path fill="currentColor" d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14h13a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/></svg>
  ),
  Trash: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="14" height="14" {...p}><path fill="currentColor" d="M6 7h12l-1 14H7L6 7zm3-4h6l1 2h4v2H4V5h4l1-2z"/></svg>
  ),
};

/* ───────── atoms (match @order) ───────── */
const Section: React.FC<{ title: string; right?: React.ReactNode; children: React.ReactNode }> = ({
  title, right, children,
}) => (
  <div className="mb-4 rounded-xl border border-slate-300 bg-white">
    <div className="flex items-center justify-between rounded-t-xl border-b border-slate-300 bg-slate-100 px-3 py-2">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700">
          <I.Table />
        </span>
        <div className="text-[12px] font-semibold tracking-wide text-slate-700">{title}</div>
      </div>
      {right ? <div className="text-[12px] text-slate-700">{right}</div> : null}
    </div>
    <div className="p-3">{children}</div>
  </div>
);

const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { leftIcon?: React.ReactNode }
> = ({ className = "", children, disabled, leftIcon, ...rest }) => {
  const base = "inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm border transition";
  const tone = "border-slate-300 bg-white text-slate-700 enabled:hover:bg-slate-50";
  return (
    <button
      type="button"
      className={`${base} ${tone} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      disabled={disabled}
      {...rest}
    >
      {leftIcon}
      {children}
    </button>
  );
};

const Chip: React.FC<{ children: React.ReactNode; title?: string; tone?: "ok" | "warn" | "default" }> = ({
  children,
  title,
  tone = "default",
}) => {
  const t =
    tone === "ok"
      ? "border-emerald-300 bg-emerald-100 text-emerald-800"
      : tone === "warn"
      ? "border-amber-300 bg-amber-100 text-amber-800"
      : "border-slate-300 bg-slate-100 text-slate-700";
  return (
    <span title={title} className={`inline-flex items-center rounded-full border px-2 py-[2px] text-[11px] ${t}`}>
      {children}
    </span>
  );
};

/* ───────── types/helpers ───────── */
type VEvent = {
  event_id: string;
  principal_id?: string;
  principal?: string;
  type: string;
  amount_minor: number;   // integer minor units
  occurred_at: string;
};

type RollRow = {
  principal: string;
  count: number;
  gross_minor: number;
  refunds_minor: number;
  net_minor: number;
};

const ORDERED_KEY = "vgos:order:ordered";
const SAVE_KEY = "vgos:accumulate";
const CACHE_KEY = "vgomini:accumulate:v4";
const CKPT_KEY  = "vgos:accumulate:checkpoints";
const TIER1_TRANSCRIPT_KEY = "vgos:transcript:tier1";
const ACC_NOTES_KEY = "vgos:transcript:accumulate:notes";

type AccumulateCache = {
  ordered: VEvent[];
  rows: RollRow[];
  saved: boolean;
  lastInputSig?: string | null;
};

/* Hydration-safe time (HH:MM:SS) */
const hhmmss = (iso?: string) => (iso ? new Date(iso).toISOString().slice(11, 19) : "—");

/* Tiny stable hash (for rollup guard) */
function djb2(str: string) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i);
  return (h >>> 0).toString(16);
}
function inputSignature(events: VEvent[]) {
  return djb2(
    events
      .map((e) => `${e.event_id}|${e.occurred_at}|${e.principal ?? e.principal_id}|${e.type}|${e.amount_minor}`)
      .join("\n")
  );
}

/* Read ordered events from Order */
function readOrdered(): VEvent[] {
  try {
    const s = sessionStorage.getItem(ORDERED_KEY) ?? localStorage.getItem(ORDERED_KEY);
    if (!s) return [];
    const arr = JSON.parse(s);
    return Array.isArray(arr) ? (arr as VEvent[]) : [];
  } catch {
    return [];
  }
}

/* Cache helpers */
function loadCache(): AccumulateCache | null {
  try {
    const s = sessionStorage.getItem(CACHE_KEY) ?? localStorage.getItem(CACHE_KEY);
    return s ? (JSON.parse(s) as AccumulateCache) : null;
  } catch {
    return null;
  }
}
function saveCache(next: AccumulateCache) {
  try {
    const s = JSON.stringify(next);
    sessionStorage.setItem(CACHE_KEY, s);
    localStorage.setItem(CACHE_KEY, s);
  } catch {}
}

/* Dev-notes append */
function appendAccNote(note: { at: string; event_id: string; reason: string }) {
  if (typeof window === "undefined") return;
  try {
    const arr = JSON.parse(sessionStorage.getItem(ACC_NOTES_KEY) || "[]");
    arr.push(note);
    sessionStorage.setItem(ACC_NOTES_KEY, JSON.stringify(arr));
  } catch {}
}
function readAccNotes(): { at: string; event_id: string; reason: string }[] {
  try {
    return JSON.parse(sessionStorage.getItem(ACC_NOTES_KEY) || "[]");
  } catch {
    return [];
  }
}
function clearAccNotes() {
  try {
    sessionStorage.removeItem(ACC_NOTES_KEY);
  } catch {}
}

/* Integer-only accumulator with dev-only sanity */
function rollup(events: VEvent[]): RollRow[] {
  const map = new Map<string, RollRow>();
  for (const ev of events) {
    // DEV-ONLY sanity: non-integer minor units
    if (process.env.NODE_ENV !== "production" && !Number.isInteger(ev.amount_minor)) {
      console.warn("Accumulate: NON_INTEGER_AMOUNT excluded", ev);
      appendAccNote({ at: new Date().toISOString(), event_id: ev.event_id, reason: "NON_INTEGER_AMOUNT" });
      continue; // exclude the row from rollup
    }

    const key = ev.principal ?? ev.principal_id ?? "(unknown)";
    if (!map.has(key)) map.set(key, { principal: key, count: 0, gross_minor: 0, refunds_minor: 0, net_minor: 0 });
    const row = map.get(key)!;
    row.count += 1;

    // Strict integer path: amounts are minor units; never produce fractions
    const amt = Math.trunc(ev.amount_minor || 0);
    if ((ev.type || "").toLowerCase() === "refund") {
      const v = Math.abs(amt);
      row.refunds_minor += v;
      row.net_minor -= v;
    } else {
      row.gross_minor += amt;
      row.net_minor += amt;
    }
  }
  return Array.from(map.values()).sort((a, b) => a.principal.localeCompare(b.principal));
}

/* UI-only money formatting */
const money = (minor: number) => `$${(minor / 100).toFixed(2)}`;

/* Checkpoints (Tier1) */
type Checkpoint = {
  tier: "tier1";
  ordered_pos: number;
  principals: number;
  net_minor: number;
  acc_digest: string;
  materialized_at: string;
};
function readCheckpoints(): Checkpoint[] {
  try {
    return JSON.parse(sessionStorage.getItem(CKPT_KEY) || "[]") as Checkpoint[];
  } catch {
    return [];
  }
}
function appendTier1Transcript(ckpt: Checkpoint) {
  try {
    const arr = JSON.parse(sessionStorage.getItem(TIER1_TRANSCRIPT_KEY) || "[]");
    arr.push(ckpt);
    sessionStorage.setItem(TIER1_TRANSCRIPT_KEY, JSON.stringify(arr));
  } catch {}
}
function writeCheckpoint(rows: RollRow[], position: number) {
  const accDigest = djb2(JSON.stringify(rows)); // demo digest; Seal will use canonical bytes
  const ckpt: Checkpoint = {
    tier: "tier1",
    ordered_pos: position,
    principals: rows.length,
    net_minor: rows.reduce((s, r) => s + r.net_minor, 0),
    acc_digest: accDigest,
    materialized_at: new Date().toISOString(),
  };
  try {
    const arr = readCheckpoints();
    arr.push(ckpt);
    sessionStorage.setItem(CKPT_KEY, JSON.stringify(arr));
  } catch {}
  // also mirror to transcript space
  appendTier1Transcript(ckpt);
  return ckpt;
}
function clearCheckpoints() {
  try {
    sessionStorage.removeItem(CKPT_KEY);
  } catch {}
}

/* ───────── component ───────── */
export default function AccumulateStep() {
  const vgo = useVGO();
  const router = useRouter();

  const [ordered, setOrdered] = useState<VEvent[]>([]);
  const [rows, setRows] = useState<RollRow[]>([]);
  const [saved, setSaved] = useState(false);
  const [lastInputSig, setLastInputSig] = useState<string | null>(null);

  const [ckpts, setCkpts] = useState<Checkpoint[]>([]);
  const [notes, setNotes] = useState<{ at: string; event_id: string; reason: string }[]>([]);
  const [copied, setCopied] = useState(false);

  // Rehydrate / initial load
  useEffect(() => {
    const cached = loadCache();
    if (cached) {
      setOrdered(cached.ordered || []);
      setRows(cached.rows || []);
      setSaved(Boolean(cached.saved));
      setLastInputSig(cached.lastInputSig ?? null);
    } else {
      const src = readOrdered();
      setOrdered(src);
      setRows(src.length ? rollup(src) : []);
      setSaved(false);
      setLastInputSig(src.length ? inputSignature(src) : null);
    }
    setCkpts(readCheckpoints());
    setNotes(readAccNotes());
  }, []);

  // Persist cache
  useEffect(() => {
    saveCache({ ordered, rows, saved, lastInputSig });
  }, [ordered, rows, saved, lastInputSig]);

  // Gating
  const ready = saved && rows.length > 0;
  const prevReady = useRef<boolean>(ready);
  useEffect(() => {
    if (prevReady.current === ready) return;
    prevReady.current = ready;
    vgo.setStatus("accumulate", ready ? "Ready" : "Pending");
    vgo.setComplete("accumulate", ready);
    if (ready) {
      ( (vgo as unknown) as { unlock?: (k: "policy" | string) => void } ).unlock?.("policy");
    }
  }, [ready, vgo]);

  // Derived totals
  const totals = useMemo(() => {
    const t = { count: 0, gross_minor: 0, refunds_minor: 0, net_minor: 0 };
    for (const r of rows) {
      t.count += r.count;
      t.gross_minor += r.gross_minor;
      t.refunds_minor += r.refunds_minor;
      t.net_minor += r.net_minor;
    }
    return t;
  }, [rows]);

  // Guards: has input changed since we computed/saved?
  const currentSig = useMemo(() => inputSignature(ordered), [ordered]);
  const inputChanged = !!lastInputSig && lastInputSig !== currentSig;
  const upToDate = saved && !inputChanged && rows.length > 0;

  // Actions
  const getFromOrder = () => {
    const src = readOrdered();
    setOrdered(src);
    setRows(src.length ? rollup(src) : []);
    setSaved(false);
    setLastInputSig(src.length ? inputSignature(src) : null);
    setNotes(readAccNotes());
  };

  const recompute = () => {
    setRows(ordered.length ? rollup(ordered) : []);
    setSaved(false);
    setNotes(readAccNotes());
  };

  const saveRollup = () => {
    if (rows.length === 0) return;
    try {
      const s = JSON.stringify(rows);
      sessionStorage.setItem(SAVE_KEY, s);
      localStorage.setItem(SAVE_KEY, s);
    } catch {}
    setSaved(true);
    setLastInputSig(currentSig);

    // Tier1 checkpoint at save time (position = total ordered)
    writeCheckpoint(rows, ordered.length);
    setCkpts(readCheckpoints());
    setNotes(readAccNotes());

    vgo.setStatus("accumulate", "Ready");
    vgo.setComplete("accumulate", true);
    ( (vgo as unknown) as { unlock?: (k: "policy" | string) => void } ).unlock?.("policy");
    window.dispatchEvent(new CustomEvent("vgos:accumulate-ready"));
  };

  const checkpointNow = () => {
    writeCheckpoint(rows, ordered.length);
    setCkpts(readCheckpoints());
  };

  const copyTotals = async () => {
    const payload = {
      principals: rows.length,
      totals: {
        count: totals.count,
        gross_minor: totals.gross_minor,
        refunds_minor: totals.refunds_minor,
        net_minor: totals.net_minor,
      },
      rows,
    };
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  const resetAll = () => {
    setRows([]);
    setSaved(false);
    setLastInputSig(null);
    try {
      sessionStorage.removeItem(SAVE_KEY);
      localStorage.removeItem(SAVE_KEY);
      sessionStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_KEY);
      // keep checkpoints/notes unless hard reset
    } catch {}
    vgo.setStatus("accumulate", "Pending");
    vgo.setComplete("accumulate", false);
  };

  const clearAllCheckpoints = () => {
    clearCheckpoints();
    setCkpts(readCheckpoints());
  };

  const clearNotes = () => {
    clearAccNotes();
    setNotes(readAccNotes());
  };

  // CTA: ensure navigation really happens
  const continueToPolicy = () => {
    if (!ready) return;
    ( (vgo as unknown) as {
      unlock?: (k: "policy" | string) => void;
      setActive?: (k: "policy" | string) => void;
    } ).unlock?.("policy");
    ( (vgo as unknown) as { setActive?: (k: "policy" | string) => void } ).setActive?.("policy");
    window.dispatchEvent(new CustomEvent("vgo:goto-policy"));
    try {
      localStorage.setItem("vgomini:navigate", JSON.stringify({ ts: Date.now(), to: "policy" }));
    } catch {}
    router.replace("/vgomini");
  };

  /* ───────── render ───────── */
  return (
    <div className="mx-auto max-w-6xl">
      {/* Field guide */}
      <div className="mb-3 rounded-lg border border-slate-300 bg-white">
        <div className="flex items-center gap-2 rounded-t-lg bg-slate-50 px-3 py-2 text-[12px] font-semibold text-slate-700">
          <span>Accumulate — Per-principal rollup from ordered events</span>
        </div>
        <div className="max-h-36 overflow-y-auto px-3 py-3">
          <AccumulateGuide />
        </div>
      </div>

      {/* Gate banner */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={[
          "mb-3 flex items-center justify-between rounded-lg border px-3 py-2 text-[13px]",
          ready ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-amber-300 bg-amber-50 text-amber-800",
        ].join(" ")}
      >
        <div className="flex items-center gap-2">
          {ready ? <I.Check /> : <I.Alert />}
          <span>
            {ready
              ? "Rollup is ready. Continue to Policy."
              : "To continue, pull from Order, recompute, and save at least one rollup row."}
          </span>
        </div>
        <button
          aria-label="Continue to Policy"
          onClick={continueToPolicy}
          disabled={!ready}
          className={[
            "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[13px] font-medium",
            ready ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-amber-500/60 text-white cursor-not-allowed",
          ].join(" ")}
        >
          Continue to Policy <span aria-hidden>↦</span>
        </button>
      </div>

      {/* Input (from Order) */}
      <Section
        title="Input (from Order)"
        right={
          <div className="flex items-center gap-2">
            <Chip>ordered events: {ordered.length}</Chip>
            {inputChanged ? <Chip tone="warn" title="Ordered input has changed since last save">input changed</Chip> : null}
            {upToDate ? <Chip tone="ok" title="Saved rollup matches current input">up to date</Chip> : null}
          </div>
        }
      >
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Button aria-label="Get from Order" onClick={getFromOrder} leftIcon={<I.CloudDown />}>Get from Order</Button>
          <Button aria-label="Recompute" onClick={recompute} disabled={ordered.length === 0} leftIcon={<I.Refresh />}>Recompute</Button>
          <Button aria-label="Save rollup" onClick={saveRollup} disabled={rows.length === 0} leftIcon={<I.Save />}>Save rollup</Button>
          <Button aria-label="Checkpoint now" onClick={checkpointNow} disabled={rows.length === 0} leftIcon={<I.Flag />}>Checkpoint now</Button>
          <Button aria-label="Reset Accumulate state" onClick={resetAll} leftIcon={<I.RotateCcw />}>Reset</Button>
        </div>

        <div className="max-h-56 overflow-auto">
          <table className="min-w-[720px] w-full text-[12px]">
            <thead className="sticky top-0 bg-slate-100 text-slate-700">
              <tr className="[&>th]:px-3 [&>th]:py-2 [&>th]:text-left">
                <th scope="col">event_id</th>
                <th scope="col">occurred_at</th>
                <th scope="col">principal</th>
                <th scope="col">type</th>
                <th scope="col">amount (¢)</th>
              </tr>
            </thead>
            <tbody className="bg-white text-slate-800">
              {ordered.length === 0 ? (
                <tr className="text-slate-600">
                  <td className="px-3 py-3" colSpan={5}>No events. Click <strong>Get from Order</strong>.</td>
                </tr>
              ) : (
                ordered.slice(0, 50).map((r, i) => (
                  <tr key={`${r.event_id}_i_${i}`} className="border-t border-slate-200 [&>td]:px-3 [&>td]:py-1.5">
                    <td className="font-mono">{r.event_id}</td>
                    <td>{hhmmss(r.occurred_at)}</td>
                    <td>{r.principal ?? r.principal_id ?? "(unknown)"}</td>
                    <td>{r.type}</td>
                    <td>{Math.trunc(r.amount_minor || 0)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Output (per-principal rollup) */}
      <Section
        title="Output (per-principal rollup)"
        right={
          <div className="flex items-center gap-2">
            <Chip>principals: {rows.length}</Chip>
            <Chip>Σ count: {totals.count}</Chip>
            <Chip>Σ net: {money(totals.net_minor)}</Chip>
          </div>
        }
      >
        <div className="mb-2 flex items-center gap-2">
          <Button aria-label="Copy totals JSON" onClick={copyTotals} leftIcon={<I.Copy />}>
            Copy totals JSON
          </Button>
          {copied ? <Chip tone="ok">copied</Chip> : null}
        </div>

        <div className="max-h-72 overflow-auto">
          <table className="min-w-[760px] w-full text-[12px]">
            <thead className="sticky top-0 bg-slate-100 text-slate-700">
              <tr className="[&>th]:px-3 [&>th]:py-2 [&>th]:text-left">
                <th scope="col">principal</th>
                <th scope="col">count</th>
                <th scope="col">gross (¢)</th>
                <th scope="col">refunds (¢)</th>
                <th scope="col">net (¢)</th>
                <th scope="col">net ($)</th>
              </tr>
            </thead>
            <tbody className="bg-white text-slate-800">
              {rows.length === 0 ? (
                <tr className="text-slate-600">
                  <td className="px-3 py-3" colSpan={6}>No rollup yet. Click <strong>Recompute</strong>, then <strong>Save rollup</strong>.</td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.principal} className="border-t border-slate-200 [&>td]:px-3 [&>td]:py-1.5">
                    <td className="font-mono">{r.principal}</td>
                    <td>{r.count}</td>
                    <td>{r.gross_minor}</td>
                    <td>{r.refunds_minor}</td>
                    <td>{r.net_minor}</td>
                    <td>{money(r.net_minor)}</td>
                  </tr>
                ))
              )}
            </tbody>
            {rows.length > 0 && (
              <tfoot className="bg-slate-50 text-slate-800">
                <tr className="[&>td]:px-3 [&>td]:py-2 font-semibold">
                  <td>Σ totals</td>
                  <td>{totals.count}</td>
                  <td>{totals.gross_minor}</td>
                  <td>{totals.refunds_minor}</td>
                  <td>{totals.net_minor}</td>
                  <td>{money(totals.net_minor)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
        <div className="mt-2 text-[11px] text-slate-600">
          Net = Gross − Refunds. Saved to <code className="rounded bg-slate-100 px-1">vgos:accumulate</code> for the Policy step.
        </div>
      </Section>

      {/* Checkpoints (Tier1, optional) */}
      <Section
        title="Checkpoints (Tier1)"
        right={
          <div className="flex items-center gap-2">
            <Chip title="Compact snapshots written on Save or on demand">demo snapshots</Chip>
            <Button aria-label="Clear checkpoints" onClick={clearAllCheckpoints} leftIcon={<I.Trash />}>
              Clear checkpoints
            </Button>
          </div>
        }
      >
        <div className="max-h-40 overflow-auto">
          <table className="min-w-[680px] w-full text-[12px]">
            <thead className="sticky top-0 bg-slate-100 text-slate-700">
              <tr className="[&>th]:px-3 [&>th]:py-2 [&>th]:text-left">
                <th scope="col">#</th>
                <th scope="col">at</th>
                <th scope="col">ordered_pos</th>
                <th scope="col">principals</th>
                <th scope="col">net (¢)</th>
                <th scope="col">digest</th>
              </tr>
            </thead>
            <tbody className="bg-white text-slate-800">
              {ckpts.length === 0 ? (
                <tr className="text-slate-600">
                  <td className="px-3 py-3" colSpan={6}>No checkpoints recorded yet.</td>
                </tr>
              ) : (
                ckpts.map((c, i) => (
                  <tr key={`${c.materialized_at}_${i}`} className="border-t border-slate-200 [&>td]:px-3 [&>td]:py-1.5">
                    <td>{i + 1}</td>
                    <td className="font-mono">{c.materialized_at.slice(11, 19)}</td>
                    <td>{c.ordered_pos}</td>
                    <td>{c.principals}</td>
                    <td>{c.net_minor}</td>
                    <td className="font-mono">{c.acc_digest}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Notes (dev) */}
      <Section
        title="Notes (dev)"
        right={<Chip title="Sanity notes captured during compute">diagnostics</Chip>}
      >
        <div className="mb-2">
          <Button aria-label="Clear notes" onClick={clearNotes} leftIcon={<I.Trash />}>Clear notes</Button>
        </div>
        <div className="max-h-40 overflow-auto">
          <table className="min-w-[620px] w-full text-[12px]">
            <thead className="sticky top-0 bg-slate-100 text-slate-700">
              <tr className="[&>th]:px-3 [&>th]:py-2 [&>th]:text-left">
                <th scope="col">at</th>
                <th scope="col">event_id</th>
                <th scope="col">reason</th>
              </tr>
            </thead>
            <tbody className="bg-white text-slate-800">
              {notes.length === 0 ? (
                <tr className="text-slate-600">
                  <td className="px-3 py-3" colSpan={3}>No notes recorded.</td>
                </tr>
              ) : (
                notes.map((n, i) => (
                  <tr key={`${n.at}_${i}`} className="border-t border-slate-200 [&>td]:px-3 [&>td]:py-1.5">
                    <td className="font-mono">{n.at.slice(11, 19)}</td>
                    <td className="font-mono">{n.event_id}</td>
                    <td>{n.reason}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}
