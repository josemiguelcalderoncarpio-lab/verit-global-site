// src/app/vgomini/@order/default.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import OrderGuide from "./OrderGuide";

/* ─────────── Inline monochrome icons ─────────── */
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
  Eye: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="14" height="14" {...p}>
      <path fill="currentColor" d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"/>
    </svg>
  ),
  Order: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="14" height="14" {...p}>
      <path fill="currentColor" d="M7 4h13v2H7V4zm0 7h13v2H7v-2zM7 18h13v2H7v-2zM3 5h2v2H3V5zm0 7h2v2H3v-2zm0 7h2v2H3v-2z"/>
    </svg>
  ),
  Calendar: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="14" height="14" {...p}>
      <path fill="currentColor" d="M7 2h2v2h6V2h2v2h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3V2zm13 8H4v10h16V10z"/>
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
  Copy: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="14" height="14" {...p}><path fill="currentColor" d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1Zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H8V7h11v14Z"/></svg>
  ),
  Note: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="14" height="14" {...p}><path fill="currentColor" d="M4 2h12l4 4v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm12 3v3h3"/><path fill="currentColor" d="M6 9h8v2H6zM6 13h12v2H6zM6 17h12v2H6z"/></svg>
  ),
  Refresh: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="14" height="14" {...p}><path fill="currentColor" d="M12 6V2l5 5-5 5V8a5 5 0 1 0 5 5h2A7 7 0 1 1 12 6z"/></svg>
  ),
};

/* ─────────── UI atoms ─────────── */
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

const Chip: React.FC<{ children: React.ReactNode; title?: string; tone?: "default" | "warn" | "ok" }> = ({ children, title, tone = "default" }) => {
  const t =
    tone === "warn"
      ? "border-amber-300 bg-amber-100 text-amber-800"
      : tone === "ok"
      ? "border-emerald-300 bg-emerald-100 text-emerald-800"
      : "border-slate-300 bg-slate-100 text-slate-700";
  return (
    <span title={title} className={`inline-flex items-center rounded-full border px-2 py-[2px] text-[11px] ${t}`}>
      {children}
    </span>
  );
};

/* ─────────── Types & helpers ─────────── */
type VEvent = {
  event_id: string;
  principal_id?: string;
  principal?: string;
  type: string;
  amount_minor: number;
  currency?: string;
  occurred_at: string;
  partition?: number;
  bucket_id?: string;
  issue?: string | null;
};

const money = (minor: number, currency = "USD") => `${currency === "USD" ? "$" : ""}${(minor / 100).toFixed(2)}`;

// HYDRATION-SAFE timestamp: HH:MM:SS from ISO
const hhmmss = (iso?: string) => (iso ? new Date(iso).toISOString().slice(11, 19) : "—");

const parseMs = (iso?: string | null) => {
  const t = iso ? Date.parse(iso) : NaN;
  return Number.isFinite(t) ? t : 0;
};

/* Safe access to window-scoped props without `any` */
function getWinProp<T>(key: string): T | undefined {
  const w = window as unknown as Record<string, unknown>;
  return w[key] as T | undefined;
}

/* staged-from-Intake reader (covers older + new keys) */
function readStagedFromStorage(): VEvent[] {
  if (typeof window === "undefined") return [];
  const keys = [
    "vgomini:intake:staged", // NEW: ensure compatibility with Intake write
    "vgos:stage",
    "vgos_stage",
    "vgos-staged",
    "vgos_staged",
    "vgos:staged",
    "vgos:intake:staged",
  ];
  for (const k of keys) {
    try {
      const raw = sessionStorage.getItem(k) ?? localStorage.getItem(k);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) return arr as VEvent[];
      }
    } catch {}
  }
  const g = getWinProp<unknown>("__VGOS_STAGE");
  if (Array.isArray(g)) return g as VEvent[];
  return [];
}

/* ─────────── persistent cache (versioned) ─────────── */
const CACHE_KEY = "vgomini:order:v3"; // bump for new fields

type OrderCache = {
  inputRows: VEvent[];
  previewRows: VEvent[];
  orderedRows: VEvent[];
  membershipOn: boolean;
  startDate: string;
  endDate: string;
  lateMinutes: number;
  hasPulled: boolean;
  excludedCount: number;
  lastOrderSig?: string | null;
};

function loadCache(): OrderCache | null {
  if (typeof window === "undefined") return null;
  const mem = getWinProp<OrderCache>("__VGO_ORDER_CACHE");
  if (mem) return mem;
  try {
    const src = sessionStorage.getItem(CACHE_KEY) ?? localStorage.getItem(CACHE_KEY);
    return src ? (JSON.parse(src) as OrderCache) : null;
  } catch {
    return null;
  }
}
function saveCache(state: OrderCache) {
  if (typeof window === "undefined") return;
  (window as unknown as Record<string, unknown>)["__VGO_ORDER_CACHE"] = state;
  try {
    const s = JSON.stringify(state);
    sessionStorage.setItem(CACHE_KEY, s);
    localStorage.setItem(CACHE_KEY, s);
  } catch {}
}

/* ─────────── transcript tier0 (demo) ─────────── */
type OrderTrailer = {
  fold_order_desc: string[];
  ordered_count: number;
  membership: { start: string; end: string; late_tolerance_min: number };
  materialized_at: string;
};

const TIER0_KEY = "vgos:transcript:tier0";
const TIER0_NOTES_KEY = "vgos:transcript:tier0:notes";

function appendTranscriptTrailer(trailer: OrderTrailer) {
  try {
    const arr: OrderTrailer[] = JSON.parse(sessionStorage.getItem(TIER0_KEY) || "[]");
    arr.push(trailer);
    sessionStorage.setItem(TIER0_KEY, JSON.stringify(arr));
    (window as unknown as Record<string, unknown>)["__VGOS_TIER0"] = arr;
  } catch {}
}

type TranscriptNote = { at: string; event_id: string; reason: "OUT_OF_WINDOW" };
function appendTranscriptNotes(notes: TranscriptNote[]) {
  if (!notes.length) return;
  try {
    const arr: TranscriptNote[] = JSON.parse(sessionStorage.getItem(TIER0_NOTES_KEY) || "[]");
    arr.push(...notes);
    sessionStorage.setItem(TIER0_NOTES_KEY, JSON.stringify(arr));
    (window as unknown as Record<string, unknown>)["__VGOS_TIER0_NOTES"] = arr;
  } catch {}
}
function readTranscriptNotes(): TranscriptNote[] {
  try {
    return JSON.parse(sessionStorage.getItem(TIER0_NOTES_KEY) || "[]") as TranscriptNote[];
  } catch {
    return [];
  }
}

/* ─────────── fold descriptor + comparator ─────────── */
const FOLD_DESC = ["bucket_id asc", "partition_id asc"]; // patent anchor

function materializeBucketId(e: VEvent): string {
  const d = e.occurred_at?.slice(0, 10) || "unknown";
  return e.bucket_id || d;
}
function materializePartitionId(e: VEvent): number {
  return typeof e.partition === "number" ? e.partition : 0;
}

// single shared comparator; includes stable tiebreaker by event_id
function cmpByFold(a: VEvent, b: VEvent): number {
  const ba = materializeBucketId(a);
  const bb = materializeBucketId(b);
  if (ba !== bb) return ba < bb ? -1 : 1;

  const pa = materializePartitionId(a);
  const pb = materializePartitionId(b);
  if (pa !== pb) return pa - pb;

  return (a.event_id || "").localeCompare(b.event_id || "");
}

/* ─────────── signature for re-order guard ─────────── */
function djb2(str: string) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i);
  return (h >>> 0).toString(16);
}
function orderSignature(rows: VEvent[], membershipOn: boolean, start: string, end: string, tolMin: number) {
  const settings = `${membershipOn ? 1 : 0}|${start}|${end}|${tolMin}`;
  const keys = rows
    .map((r) => `${r.event_id}|${r.occurred_at}|${r.partition ?? ""}|${r.bucket_id ?? ""}|${r.amount_minor}`)
    .sort()
    .join("\n");
  return djb2(settings + "||" + keys);
}

/* ─────────── component ─────────── */
export default function OrderStep() {
  const [inputRows, setInputRows] = useState<VEvent[]>([]);
  const [previewRows, setPreviewRows] = useState<VEvent[]>([]);
  const [orderedRows, setOrderedRows] = useState<VEvent[]>([]);
  const [hasPulled, setHasPulled] = useState(false);

  const [membershipOn, setMembershipOn] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [lateMinutes, setLateMinutes] = useState(0);
  const [excludedCount, setExcludedCount] = useState(0);

  const [invariantWarn, setInvariantWarn] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [lastOrderSig, setLastOrderSig] = useState<string | null>(null);
  const [notes, setNotes] = useState<TranscriptNote[]>([]);

  const rehydratedRef = useRef(false);
  const autoPulledRef = useRef(false); // ensure we auto-pull only once

  useEffect(() => {
    const cached = loadCache();
    if (cached) {
      setInputRows(cached.inputRows || []);
      setPreviewRows(cached.previewRows || []);
      setOrderedRows(cached.orderedRows || []);
      setMembershipOn(Boolean(cached.membershipOn));
      setStartDate(cached.startDate || "");
      setEndDate(cached.endDate || "");
      setLateMinutes(Number(cached.lateMinutes || 0));
      setHasPulled(Boolean(cached.hasPulled));
      setExcludedCount(Number(cached.excludedCount || 0));
      setLastOrderSig(cached.lastOrderSig ?? null);
      rehydratedRef.current = true;
    } else {
      const rows = readStagedFromStorage();
      setInputRows(rows);
      setHasPulled(true);
      rehydratedRef.current = true;
    }
    // initial notes
    setNotes(readTranscriptNotes());
  }, []);

  // Persist cache when state changes
  useEffect(() => {
    if (!rehydratedRef.current) return;
    saveCache({
      inputRows,
      previewRows,
      orderedRows,
      membershipOn,
      startDate,
      endDate,
      lateMinutes,
      hasPulled,
      excludedCount,
      lastOrderSig,
    });
  }, [
    inputRows,
    previewRows,
    orderedRows,
    membershipOn,
    startDate,
    endDate,
    lateMinutes,
    hasPulled,
    excludedCount,
    lastOrderSig,
  ]);

  // Auto "Get from Intake" once on first visible mount (even if cache existed)
  useEffect(() => {
    if (autoPulledRef.current) return;
    autoPulledRef.current = true;
    // defer to allow Intake to stage within the same tick if both panes load together
    const t = setTimeout(() => {
      getFromIntake();
    }, 0);
    return () => clearTimeout(t);
  }, []);

  // Live refresh: storage + visibility + custom event from Intake
  useEffect(() => {
    const rehydrateFromStorage = () => {
      const next = loadCache();
      if (next) {
        setInputRows(next.inputRows || []);
        setPreviewRows(next.previewRows || []);
        setOrderedRows(next.orderedRows || []);
        setMembershipOn(Boolean(next.membershipOn));
        setStartDate(next.startDate || "");
        setEndDate(next.endDate || "");
        setLateMinutes(Number(next.lateMinutes || 0));
        setHasPulled(Boolean(next.hasPulled));
        setExcludedCount(Number(next.excludedCount || 0));
        setLastOrderSig(next.lastOrderSig ?? null);
      }
      setNotes(readTranscriptNotes());
    };
    const onStorage = (e: StorageEvent) => {
      if (!e.key || (e.key !== CACHE_KEY && e.key !== "vgomini:intake:staged" && e.key !== "vgos:intake:staged")) return;
      rehydrateFromStorage();
    };
    const onVis = () => document.visibilityState === "visible" && rehydrateFromStorage();
    const onIntakeStaged = () => getFromIntake();

    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("vgo:intake-staged", onIntakeStaged as EventListener);

    return () => {
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("vgo:intake-staged", onIntakeStaged as EventListener);
    };
  }, []);

  // Initialize default membership window (last 7 days)
  useEffect(() => {
    if (!rehydratedRef.current) return;
    if (!startDate && !endDate) {
      const end = new Date();
      const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
      const f = (d: Date) => d.toISOString().slice(0, 10);
      setStartDate(f(start));
      setEndDate(f(end));
    }
  }, [startDate, endDate]);

  const counts = useMemo(
    () => ({ input: inputRows.length, preview: previewRows.length, ordered: orderedRows.length }),
    [inputRows, previewRows, orderedRows]
  );

  const currentSig = useMemo(
    () => orderSignature(inputRows, membershipOn, startDate, endDate, lateMinutes),
    [inputRows, membershipOn, startDate, endDate, lateMinutes]
  );
  const unchangedSinceOrder = !!lastOrderSig && lastOrderSig === currentSig;
  const changedSinceOrder = !!lastOrderSig && lastOrderSig !== currentSig;

  function getFromIntake() {
    const rows = readStagedFromStorage();
    setInputRows(rows);
    setPreviewRows([]);
    setOrderedRows([]);
    setHasPulled(true);
    setExcludedCount(0);
  }

  // membership filter only (used by preview + order)
  const applyMembership = (rows: VEvent[]) => {
    if (!membershipOn) return { kept: rows, excluded: 0, excludedRows: [] as VEvent[] };
    const s = startDate ? Date.parse(startDate + "T00:00:00") : -Infinity;
    const e = endDate ? Date.parse(endDate + "T23:59:59.999") + Math.max(0, lateMinutes) * 60_000 : Infinity;
    const kept: VEvent[] = [];
    const excludedRows: VEvent[] = [];
    for (const r of rows) {
      const t = parseMs(r.occurred_at);
      if (t >= s && t <= e) kept.push(r);
      else excludedRows.push(r);
    }
    return { kept, excluded: excludedRows.length, excludedRows };
  };

  function preview() {
    if (!inputRows.length) return;
    const { kept, excluded } = applyMembership(inputRows);
    setExcludedCount(excluded);

    if (kept.length <= 20) {
      setPreviewRows(kept);
      return;
    }
    const first = kept.slice(0, 10);
    const last = kept.slice(-10);
    const seen = new Set<string>();
    const uniq = [...first, ...last].filter((r) => {
      const key = `${r.event_id}|${r.occurred_at}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    setPreviewRows(uniq);
  }

  function devAssertSortedKeys(keys: string[], where: string) {
    if (process.env.NODE_ENV === "production") return;
    const sorted = [...keys].sort();
    const ok = keys.every((k, i) => k === sorted[i]);
    if (!ok) {
      const msg = `Iteration invariant violated in ${where}: keys not sorted`;
      console.warn(msg);
      setInvariantWarn(msg);
    }
  }

  async function copyDescriptor() {
    const text = JSON.stringify({ fold_order_desc: FOLD_DESC });
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {}
    }
  }

  function runOrder() {
    // 1) filter by membership window
    const { kept, excluded, excludedRows } = applyMembership(inputRows);
    setExcludedCount(excluded);

    // 1b) reason-coded transcript notes for exclusions
    if (excludedRows.length) {
      const now = new Date().toISOString();
      appendTranscriptNotes(
        excludedRows.map((r) => ({ at: now, event_id: r.event_id, reason: "OUT_OF_WINDOW" as const }))
      );
      setNotes(readTranscriptNotes()); // update UI
    }

    // 2) materialize fold keys
    const base = kept.map((r) => ({
      ...r,
      bucket_id: materializeBucketId(r),
      partition: materializePartitionId(r),
    }));

    // 3) canonical sort (fold)
    const ordered = [...base].sort(cmpByFold);

    // 4) persist ordered + transcript trailer + lastOrderSig
    setOrderedRows(ordered);
    setLastOrderSig(currentSig);
    try {
      sessionStorage.setItem("vgos:order:ordered", JSON.stringify(ordered));
    } catch {}

    appendTranscriptTrailer({
      fold_order_desc: FOLD_DESC,
      ordered_count: ordered.length,
      membership: { start: startDate, end: endDate, late_tolerance_min: lateMinutes },
      materialized_at: new Date().toISOString(),
    });
  }

  function resetAll() {
    setInputRows([]);
    setPreviewRows([]);
    setOrderedRows([]);
    setHasPulled(false);
    setExcludedCount(0);
    setInvariantWarn(null);
    setLastOrderSig(null);
    try {
      sessionStorage.removeItem("vgos:order:ordered");
      sessionStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_KEY);
      (window as unknown as Record<string, unknown>)["__VGO_ORDER_CACHE"] = undefined;
    } catch {}
  }

  const ready = orderedRows.length > 0;
  const prevReady = useRef(ready);
  useEffect(() => {
    if (prevReady.current === ready) return;
    prevReady.current = ready;
    if (ready) window.dispatchEvent(new CustomEvent("vgo:unlock-accumulate"));
  }, [ready]);

  function continueToAccumulate() {
    if (!ready) return;
    window.dispatchEvent(new CustomEvent("vgo:goto-accumulate"));
  }

  const windowChipText = useMemo(() => {
    if (!membershipOn) return null;
    if (!startDate && !endDate) return null;
    const tol = lateMinutes ? ` (+${lateMinutes}m)` : "";
    return `window: ${startDate || "—"} … ${endDate || "—"}${tol}`;
  }, [membershipOn, startDate, endDate, lateMinutes]);

  const foldChipTitle = JSON.stringify({ fold_order_desc: FOLD_DESC });

  /* ─────────── Notes panel helpers ─────────── */
  const refreshNotes = () => setNotes(readTranscriptNotes());

  return (
    <div className="mx-auto max-w-6xl">
      {/* ── Field guide card */}
      <div className="mb-3 rounded-lg border border-slate-300 bg-white">
        <div className="flex items-center gap-2 rounded-t-lg bg-slate-50 px-3 py-2 text-[12px] font-semibold text-slate-700">
          <span>Order — Deterministic event sequencing</span>
        </div>
        <div className="max-h-36 overflow-y-auto px-3 py-3">
          <OrderGuide />
        </div>
      </div>

      {/* Readiness banner */}
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
              ? "Order is ready. Continue to Accumulate."
              : "To continue, pull from Intake, (optionally) set a membership window, then produce a deterministic order."}
          </span>
        </div>
        <button
          onClick={continueToAccumulate}
          disabled={!ready}
          className={[
            "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[13px] font-medium",
            ready ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-amber-500/60 text-white cursor-not-allowed",
          ].join(" ")}
        >
          Continue to Accumulate <span aria-hidden>↦</span>
        </button>
      </div>

      {/* Actions */}
      <Section
        title="Actions"
        right={
          <div className="flex flex-wrap items-center gap-2">
            <Chip title={foldChipTitle}>fold: bucket_id↑, partition_id↑</Chip>
            {windowChipText ? <Chip title="membership window">{windowChipText}</Chip> : null}
            <Chip>staged: {counts.input}</Chip>
            <Chip>previewed: {counts.preview}</Chip>
            <Chip>ordered: {counts.ordered}</Chip>
            {excludedCount > 0 ? <Chip title="rows excluded by window">excluded: {excludedCount}</Chip> : null}
            {invariantWarn ? <Chip title={invariantWarn}>⚠ invariant</Chip> : null}
            {changedSinceOrder ? <Chip tone="warn" title="Input or membership changed since last Order">input changed</Chip> : null}
            {unchangedSinceOrder && ready ? <Chip tone="ok" title="Current state matches the last Order">up to date</Chip> : null}
            {copied ? <Chip>copied</Chip> : null}
            <Button onClick={resetAll} leftIcon={<I.RotateCcw />}>Reset</Button>
          </div>
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={getFromIntake} leftIcon={<I.CloudDown />}>Get from Intake</Button>
          <Button onClick={preview} disabled={inputRows.length === 0} leftIcon={<I.Eye />}>Preview (first/last 20)</Button>

          <div className="ms-2 flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-1.5">
            <label className="flex items-center gap-2 text-sm text-slate-800" title="Enable time-window membership filter">
              <input
                type="checkbox"
                className="h-4 w-4 accent-slate-900"
                checked={membershipOn}
                onChange={(e) => setMembershipOn(e.target.checked)}
              />
              Membership
            </label>
          </div>

          <Button
            onClick={runOrder}
            disabled={inputRows.length === 0 || unchangedSinceOrder}
            leftIcon={<I.Order />}
            title={unchangedSinceOrder ? "No changes since last Order" : "Run canonical fold"}
          >
            Order (deterministic)
          </Button>
          <Button onClick={copyDescriptor} leftIcon={<I.Copy />}>Copy descriptor</Button>
        </div>
      </Section>

      {/* Membership window */}
      <Section
        title="Membership window"
        right={
          <div className="flex flex-wrap items-center gap-2 text-[12px] text-slate-700">
            <Chip title="rows included if occurred_at ≥ start && ≤ end + tolerance">rule: include within range</Chip>
          </div>
        }
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 text-[12px] font-medium text-slate-800">
              <I.Calendar /> Start date
            </div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={!membershipOn}
              spellCheck={false}
              autoComplete="off"
              className={[
                "mt-1 w-full rounded-lg border px-2 py-1 text-sm",
                "border-slate-400 bg-white text-slate-900 placeholder-slate-500",
                "focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-600",
                !membershipOn ? "opacity-70 bg-slate-100" : "",
              ].join(" ")}
            />
          </div>
          <div>
            <div className="flex items-center gap-2 text-[12px] font-medium text-slate-800">
              <I.Calendar /> End date
            </div>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={!membershipOn}
              spellCheck={false}
              autoComplete="off"
              className={[
                "mt-1 w-full rounded-lg border px-2 py-1 text-sm",
                "border-slate-400 bg-white text-slate-900 placeholder-slate-500",
                "focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-600",
                !membershipOn ? "opacity-70 bg-slate-100" : "",
              ].join(" ")}
            />
          </div>
          <div>
            <div className="text-[12px] font-medium text-slate-800">Late tolerance (min)</div>
            <input
              type="number"
              min={0}
              step={1}
              value={lateMinutes}
              onChange={(e) => setLateMinutes(Math.max(0, Number(e.target.value || 0)))}
              disabled={!membershipOn}
              spellCheck={false}
              autoComplete="off"
              className={[
                "mt-1 w-full rounded-lg border px-2 py-1 text-sm",
                "border-slate-400 bg-white text-slate-900 placeholder-slate-500",
                "focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-600",
                !membershipOn ? "opacity-70 bg-slate-100" : "",
              ].join(" ")}
            />
          </div>
        </div>
      </Section>

      {/* Input (from Intake) */}
      <Section title="Input (from Intake)" right={<span className="text-[12px] text-slate-600">{inputRows.length} row(s)</span>}>
        <div className="max-h-56 overflow-auto">
          <table className="min-w-[720px] w-full text-[12px]">
            <thead className="sticky top-0 bg-slate-100 text-slate-700">
              <tr className="[&>th]:px-3 [&>th]:py-2 [&>th]:text-left">
                <th>event_id</th>
                <th>principal</th>
                <th>type</th>
                <th>amount</th>
                <th>occurred_at</th>
              </tr>
            </thead>
            <tbody className="bg-white text-slate-800">
              {inputRows.length === 0 ? (
                <tr className="text-slate-600">
                  <td className="px-3 py-3" colSpan={5}>
                    No rows yet. This auto-pulls from Intake; click <strong>Get from Intake</strong> to refresh.
                  </td>
                </tr>
              ) : (
                inputRows.map((r, i) => (
                  <tr key={`${r.event_id}_i_${i}`} className="border-t border-slate-200 [&>td]:px-3 [&>td]:py-1.5">
                    <td className="font-mono">{r.event_id}</td>
                    <td>{r.principal ?? r.principal_id}</td>
                    <td>{r.type}</td>
                    <td>{money(r.amount_minor, r.currency)}</td>
                    <td>{hhmmss(r.occurred_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Preview (not ordered) */}
      <Section title="Preview (not ordered)">
        <div className="max-h-56 overflow-auto">
          <table className="min-w-[720px] w-full text-[12px]">
            <thead className="sticky top-0 bg-slate-100 text-slate-700">
              <tr className="[&>th]:px-3 [&>th]:py-2 [&>th]:text-left">
                <th>event_id</th>
                <th>occurred_at</th>
                <th>principal</th>
                <th>type</th>
                <th>amount</th>
              </tr>
            </thead>
            <tbody className="bg-white text-slate-800">
              {previewRows.length === 0 ? (
                <tr className="text-slate-600">
                  <td className="px-3 py-3" colSpan={5}>Click <strong>Preview</strong> to sample current input.</td>
                </tr>
              ) : (
                previewRows.map((r, i) => (
                  <tr key={`${r.event_id}_p_${i}`} className="border-t border-slate-200 [&>td]:px-3 [&>td]:py-1.5">
                    <td className="font-mono">{r.event_id}</td>
                    <td>{hhmmss(r.occurred_at)}</td>
                    <td>{r.principal ?? r.principal_id}</td>
                    <td>{r.type}</td>
                    <td>{money(r.amount_minor, r.currency)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Ordered (final sequence) */}
      <Section title="Ordered (final sequence)" right={<Chip title={foldChipTitle}>fold: bucket_id↑, partition_id↑</Chip>}>
        <div className="max-h-56 overflow-auto">
          <table className="min-w-[720px] w-full text-[12px]">
            <thead className="sticky top-0 bg-slate-100 text-slate-700">
              <tr className="[&>th]:px-3 [&>th]:py-2 [&>th]:text-left">
                <th>#</th>
                <th>event_id</th>
                <th>occurred_at</th>
                <th>principal</th>
                <th>type</th>
                <th>amount</th>
              </tr>
            </thead>
            <tbody className="bg-white text-slate-800">
              {orderedRows.length === 0 ? (
                <tr className="text-slate-600">
                  <td className="px-3 py-3" colSpan={6}>
                    Run <strong>Order (deterministic)</strong> to produce the sequence.
                  </td>
                </tr>
              ) : (
                orderedRows.map((r, i) => (
                  <tr key={`${r.event_id}_o_${i}`} className="border-t border-slate-200 [&>td]:px-3 [&>td]:py-1.5">
                    <td>{i + 1}</td>
                    <td className="font-mono">{r.event_id}</td>
                    <td>{hhmmss(r.occurred_at)}</td>
                    <td>{r.principal ?? r.principal_id}</td>
                    <td>{r.type}</td>
                    <td>{money(r.amount_minor, r.currency)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Notes (membership exclusions) */}
      <Section
        title="Notes (membership exclusions)"
        right={
          <div className="flex items-center gap-2">
            <Chip title="Reason-coded entries appended during Order">Tier0 notes</Chip>
            <Button onClick={refreshNotes} leftIcon={<I.Refresh />}>Refresh</Button>
          </div>
        }
      >
        <div className="max-h-40 overflow-auto">
          <table className="min-w-[520px] w-full text-[12px]">
            <thead className="sticky top-0 bg-slate-100 text-slate-700">
              <tr className="[&>th]:px-3 [&>th]:py-2 [&>th]:text-left">
                <th><span className="inline-flex items-center gap-1"><I.Note /> at</span></th>
                <th>event_id</th>
                <th>reason</th>
              </tr>
            </thead>
            <tbody className="bg-white text-slate-800">
              {notes.length === 0 ? (
                <tr className="text-slate-600">
                  <td className="px-3 py-3" colSpan={3}>No notes recorded.</td>
                </tr>
              ) : (
                notes.map((n, i) => (
                  <tr key={`${n.event_id}_${i}`} className="border-t border-slate-200 [&>td]:px-3 [&>td]:py-1.5">
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
