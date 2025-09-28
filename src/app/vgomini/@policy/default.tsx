// src/app/vgomini/@policy/default.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import PolicyGuide from "./PolicyGuide";
import { useRouter } from "next/navigation";
import { useVGO } from "../vgo/VGOProvider";

/* ─────────────────────────────────────────────
   Tiny inline icons (monochrome; same tone)
   ───────────────────────────────────────────── */
const I = {
  Table: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="14" height="14" {...p}>
      <path fill="currentColor" d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5zm2 2v3h14V7H5zm0 5v7h6v-7H5zm8 0v7h6v-7h-6z"/>
    </svg>
  ),
  CloudDown: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}>
      <path fill="currentColor" d="M6 19a5 5 0 0 1 0-10 6 6 0 0 1 11.3-1.9A4.5 4.5 0 1 1 18 19H6zm6-3 4-4h-3V8h-2v4H8l4 4z"/>
    </svg>
  ),
  Wand: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}>
      <path fill="currentColor" d="M3 21l10-10 2 2L5 23H3v-2zM14 3l2 2-2 2-2-2 2-2zm4 4l2 2-8 8-2-2 8-8z"/>
    </svg>
  ),
  Save: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}>
      <path fill="currentColor" d="M17 3H5a2 2 0 0 0-2 2v14l4-4h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-2 6H7V7h8v2z"/>
    </svg>
  ),
  RotateCcw: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}>
      <path fill="currentColor" d="M12 5V1L7 6l5 5V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z"/>
    </svg>
  ),
  Alert: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}>
      <path fill="currentColor" d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
    </svg>
  ),
  Check: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}>
      <path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/>
    </svg>
  ),
  Info: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="14" height="14" {...p}>
      <path fill="currentColor" d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
    </svg>
  ),
  Copy: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}><path fill="currentColor" d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14h13a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/></svg>
  ),
  Trash: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}><path fill="currentColor" d="M6 7h12l-1 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 7zm3-4h6l1 2H8l1-2z"/></svg>
  ),
};

/* ─────────────────────────────────────────────
   Shared UI atoms
   ───────────────────────────────────────────── */
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
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost"; leftIcon?: React.ReactNode }
> = ({ variant = "ghost", className = "", children, disabled, leftIcon, ...rest }) => {
  const base = "inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm border transition";
  const tone =
    variant === "primary"
      ? "border-emerald-300 bg-white text-slate-900 enabled:hover:bg-emerald-50"
      : "border-slate-300 bg-white text-slate-700 enabled:hover:bg-slate-50";
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

const Chip: React.FC<{ children: React.ReactNode; tone?: "default" | "amber" | "emerald" }> = ({ children, tone = "default" }) => {
  const t =
    tone === "amber"
      ? "border-amber-300 bg-amber-50 text-amber-700"
      : tone === "emerald"
      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
      : "border-slate-300 bg-slate-100 text-slate-700";
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-[2px] text-[11px] ${t}`}>
      {children}
    </span>
  );
};

/* ─────────────────────────────────────────────
   Types & helpers
   ───────────────────────────────────────────── */
type RollRow = {
  principal: string;
  count: number;
  gross_minor: number;
  refunds_minor: number;
  net_minor: number;
};

type FinanceAck = {
  window_id?: string;
  reserves_ok?: boolean;
  signer?: string;
  expires_at?: string; // ISO
};

type CTStatus = {
  principal_id: string;
  status: "cleared" | "hold" | "missing" | string;
  expires_at?: string; // ISO
};

type PolicyRow = {
  principal: string;
  net_minor: number;
  bonus_exact_subcent: string;   // decimal string, units = cents (may include sub-cent fractions, e.g. "1.05")
  bonus_quantized_minor: number; // always 0 in Policy (Carry owns final assignment)
  payout_minor: number;          // = net_minor + bonus_quantized_minor (then bounded by cap)
  decision: "ALLOW" | "HOLD";
  reason?: string;
  cap_applied?: { before: number; cap_minor: number; capped_delta: number } | null;
};

type PolicyNote = {
  at?: string;
  principal?: string;
  code?: string;
  before?: number;
  cap_minor?: number;
  capped_delta?: number;
};

type VGOExt = {
  unlock?: (k: string) => void;
  setActive?: (k: string) => void;
  setStatus: (k: string, s: string) => void;
  setComplete: (k: string, done: boolean) => void;
};

const money = (minor: number, currency = "USD") => {
  const sign = currency === "USD" ? "$" : "";
  return `${sign}${(minor / 100).toFixed(2)}`;
};

const ACCUM_KEY = "vgos:accumulate";      // input
const SAVE_KEY  = "vgos:policy";          // persisted output for Carry
const CACHE_KEY = "vgomini:policy:v2";    // this step's own state
const POLICY_TRANSCRIPT_KEY = "vgos:transcript:policy";          // decisions
const POLICY_NOTES_KEY      = "vgos:transcript:policy:notes";    // reason-coded notes (e.g., cap)

/* stable sort for persistence */
function sortRows(rows: PolicyRow[]) {
  return [...rows].sort((a, b) => a.principal.localeCompare(b.principal));
}

/* lightweight transcript appends */
function appendTranscript(entries: unknown[], key = POLICY_TRANSCRIPT_KEY) {
  try {
    const arr = JSON.parse(sessionStorage.getItem(key) || "[]");
    if (Array.isArray(arr)) {
      arr.push(...entries);
      sessionStorage.setItem(key, JSON.stringify(arr));
    } else {
      sessionStorage.setItem(key, JSON.stringify(entries));
    }
  } catch {
    // ignore
  }
}
function appendNote(note: unknown) {
  appendTranscript([note], POLICY_NOTES_KEY);
}

type PolicyCache = {
  accum: RollRow[];
  financeAckText: string;
  ctText: string;
  bonusPct: number;
  capMinorText: string;     // global cap in cents (string for empty/Infinity)
  capOverridesText: string; // JSON array of { principal_id, cap_minor }
  rows: PolicyRow[];
  ready: boolean;
};

function readAccumulate(): RollRow[] {
  if (typeof window === "undefined") return [];
  try {
    const s = sessionStorage.getItem(ACCUM_KEY) ?? localStorage.getItem(ACCUM_KEY);
    if (!s) return [];
    const arr = JSON.parse(s);
    return Array.isArray(arr) ? (arr as RollRow[]) : [];
  } catch {
    return [];
  }
}

function loadCache(): PolicyCache | null {
  if (typeof window === "undefined") return null;
  try {
    const s = sessionStorage.getItem(CACHE_KEY) ?? localStorage.getItem(CACHE_KEY);
    return s ? (JSON.parse(s) as PolicyCache) : null;
  } catch {
    return null;
  }
}
function saveCache(next: PolicyCache) {
  try {
    const s = JSON.stringify(next);
    sessionStorage.setItem(CACHE_KEY, s);
    localStorage.setItem(CACHE_KEY, s);
  } catch {
    // ignore
  }
}

function safeParseJSON<T>(text: string): { ok: true; value: T } | { ok: false; err: string } {
  try {
    const v = JSON.parse(text) as T;
    return { ok: true, value: v };
  } catch (e: unknown) {
    const msg = (e && typeof e === "object" && "message" in e)
      ? String((e as { message?: unknown }).message ?? "Invalid JSON")
      : "Invalid JSON";
    return { ok: false, err: msg };
  }
}

function isExpired(iso?: string): boolean {
  if (!iso) return false;
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return false;
  return Date.now() > t;
}

const isRecord = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);

/* ─────────────────────────────────────────────
   Component
   ───────────────────────────────────────────── */
export default function PolicyStep() {
  const router = useRouter();
  const vgo = useVGO() as unknown as VGOExt;

  // Input (from Accumulate)
  const [accum, setAccum] = useState<RollRow[]>([]);
  // Attestations raw text
  const [financeAckText, setFinanceAckText] = useState<string>("");
  const [ctText, setCtText] = useState<string>("");
  // Parsed errors
  const [financeAckErr, setFinanceAckErr] = useState<string | null>(null);
  const [ctErr, setCtErr] = useState<string | null>(null);
  // Policy configuration
  const [bonusPct, setBonusPct] = useState<number>(1); // default 1%
  const [capMinorText, setCapMinorText] = useState<string>(""); // empty = no global cap
  const [capOverridesText, setCapOverridesText] = useState<string>(""); // per-principal caps JSON
  // Output rows
  const [rows, setRows] = useState<PolicyRow[]>([]);
  const [ready, setReady] = useState<boolean>(false);

  // Dev notes (POLICY_CAP_APPLIED etc.)
  const [notes, setNotes] = useState<PolicyNote[]>([]);

  // Rehydrate on mount; auto-pull from Accumulate only if no cache
  useEffect(() => {
    const cached = loadCache();
    if (cached) {
      setAccum(cached.accum || []);
      setFinanceAckText(cached.financeAckText || "");
      setCtText(cached.ctText || "");
      setBonusPct(Number.isFinite(cached.bonusPct) ? cached.bonusPct : 1);
      setCapMinorText(cached.capMinorText ?? "");
      setCapOverridesText(cached.capOverridesText ?? "");
      setRows(cached.rows || []);
      setReady(Boolean(cached.ready));
    } else {
      const a = readAccumulate();
      setAccum(a);
      setReady(false);
    }
    refreshNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshNotes = () => {
    try {
      const arr = JSON.parse(sessionStorage.getItem(POLICY_NOTES_KEY) || "[]");
      setNotes(Array.isArray(arr) ? (arr.slice(-200) as PolicyNote[]) : []);
    } catch {
      setNotes([]);
    }
  };

  // Persist whenever state changes
  useEffect(() => {
    saveCache({
      accum,
      financeAckText,
      ctText,
      bonusPct,
      capMinorText,
      capOverridesText,
      rows,
      ready,
    });
  }, [accum, financeAckText, ctText, bonusPct, capMinorText, capOverridesText, rows, ready]);

  // Gating: when ready flips, update chevrons and unlock Carry
  const prevReady = useRef<boolean>(ready);
  useEffect(() => {
    if (prevReady.current === ready) return;
    prevReady.current = ready;
    vgo.setStatus("policy", ready ? "Ready" : "Pending");
    vgo.setComplete("policy", ready);
    if (ready) vgo.unlock?.("carry");
  }, [ready, vgo]);

  // Derived helpers
  const accumTotals = useMemo(() => {
    const t = { principals: accum.length, net_minor: 0, count: 0 };
    for (const r of accum) {
      t.net_minor += r.net_minor;
      t.count += r.count;
    }
    return t;
  }, [accum]);

  // Attestation hint chip (computed from current text input)
  const ackHint = useMemo<"ACK_OK" | "ACK_MISSING" | "ACK_EXPIRED" | "RESERVES_NOK">(() => {
    const txt = financeAckText.trim();
    if (!txt) return "ACK_MISSING";
    const parsed = safeParseJSON<FinanceAck>(txt);
    if (!parsed.ok) return "ACK_MISSING";
    const a = parsed.value;
    if (a?.reserves_ok === false) return "RESERVES_NOK";
    if (isExpired(a?.expires_at)) return "ACK_EXPIRED";
    return "ACK_OK";
  }, [financeAckText]);

  // Actions
  const getFromAccumulate = () => {
    const a = readAccumulate();
    setAccum(a);
    setRows([]);
    setReady(false);
  };

  const applyPolicy = () => {
    // Parse Finance ACK
    let ack: FinanceAck | null = null;
    setFinanceAckErr(null);
    if (financeAckText.trim()) {
      const p = safeParseJSON<FinanceAck>(financeAckText.trim());
      if (!p.ok) {
        setFinanceAckErr(p.err);
        return;
      }
      ack = p.value;
    } else {
      ack = null; // treat as missing
    }

    // Parse CT table
    let ct: CTStatus[] = [];
    setCtErr(null);
    if (ctText.trim()) {
      const p = safeParseJSON<unknown>(ctText.trim());
      if (!p.ok) {
        setCtErr(p.err);
        return;
      }
      const val = p.value;
      const maybeRows = Array.isArray(val)
        ? val
        : (isRecord(val) && Array.isArray((val as { rows?: unknown }).rows) ? (val as { rows: unknown[] }).rows : null);

      if (!maybeRows) {
        setCtErr("Expected an array or { rows: [...] }");
        return;
      }

      ct = maybeRows
        .filter((r): r is Record<string, unknown> => isRecord(r))
        .map((r) => ({
          principal_id: String(r.principal_id ?? ""),
          status: String(r.status ?? "missing"),
          expires_at: typeof r.expires_at === "string" ? r.expires_at : undefined,
        }))
        .filter((r) => r.principal_id.length > 0);
    }

    // Parse caps
    const globalCap = capMinorText.trim() === "" ? Infinity : Math.max(0, Math.trunc(Number(capMinorText)));
    const capMap = new Map<string, number>(); // prefer-const
    if (capOverridesText.trim()) {
      const parsed = safeParseJSON<unknown>(capOverridesText.trim());
      if (parsed.ok) {
        const v = parsed.value;
        const rows = Array.isArray(v)
          ? v
          : (isRecord(v) && Array.isArray((v as { rows?: unknown }).rows) ? (v as { rows: unknown[] }).rows : null);
        if (rows) {
          for (const r of rows) {
            if (isRecord(r) && r.principal_id && Number.isFinite(Number(r.cap_minor))) {
              capMap.set(String(r.principal_id), Math.max(0, Math.trunc(Number(r.cap_minor))));
            }
          }
        }
      }
    }

    // Build quick index for CT
    const ctMap = new Map<string, CTStatus>();
    for (const r of ct) {
      if (r && r.principal_id) ctMap.set(r.principal_id, r);
    }

    // Check Finance ACK once (window-level)
    let windowAllow = true;
    let windowReason = "";
    if (!ack) {
      windowAllow = false;
      windowReason = "ACK_MISSING";
    } else if (ack.reserves_ok === false) {
      windowAllow = false;
      windowReason = "RESERVES_NOK";
    } else if (isExpired(ack.expires_at)) {
      windowAllow = false;
      windowReason = "ACK_EXPIRED";
    }

    // Compute policy rows
    const pct = Number.isFinite(bonusPct) ? bonusPct : 0;
    const out: PolicyRow[] = accum.map((r) => {
      const net = Number(r.net_minor || 0);

      // exact bonus in cents (string): may carry sub-cent as decimal
      const exactCents = (net * pct) / 100; // units = cents
      const bonusExactStr = exactCents.toFixed(2); // e.g., "1.05" cents
      const bonusQuantMinor = 0; // Carry owns sub-cent assignment
      const beforeCap = net + bonusQuantMinor;

      // effective cap
      const cap = capMap.get(r.principal) ?? globalCap;
      const afterCap = Math.min(beforeCap, cap);

      // Attestations → decision
      const ctRow = ctMap.get(r.principal);
      let allow = windowAllow;
      let reason: string | undefined;

      if (!ctRow) {
        allow = false;
        reason = "CT_MISSING";
      } else {
        const status = String(ctRow.status || "").toLowerCase();
        if (status !== "cleared" && status !== "ok") {
          allow = false;
          reason = `CT_${status.toUpperCase()}`;
        } else if (isExpired(ctRow.expires_at)) {
          allow = false;
          reason = "CT_EXPIRED";
        }
      }

      if (!windowAllow) {
        allow = false;
        reason = windowReason;
      }

      // cap trail (non-monetary note)
      let capApplied: PolicyRow["cap_applied"] = null;
      if (Number.isFinite(cap) && afterCap < beforeCap) {
        capApplied = {
          before: beforeCap,
          cap_minor: cap,
          capped_delta: beforeCap - afterCap,
        };
        // Emit policy note immediately so it’s visible even before Save
        appendNote({
          at: new Date().toISOString(),
          principal: r.principal,
          code: "POLICY_CAP_APPLIED",
          before: beforeCap,
          cap_minor: cap,
          capped_delta: beforeCap - afterCap,
        });
      }

      return {
        principal: r.principal,
        net_minor: net,
        bonus_exact_subcent: bonusExactStr,
        bonus_quantized_minor: bonusQuantMinor,
        payout_minor: afterCap,
        decision: allow ? "ALLOW" : "HOLD",
        reason,
        cap_applied: capApplied,
      };
    });

    setRows(out);
    setReady(false); // not saved yet
    refreshNotes(); // show any new cap notes
  };

  const savePolicy = () => {
    if (rows.length === 0) return;

    // Persist rows in a canonical order with stable key ordering
    const rowsSorted = sortRows(rows);
    try {
      const s = JSON.stringify(rowsSorted);
      sessionStorage.setItem(SAVE_KEY, s);
      localStorage.setItem(SAVE_KEY, s);
    } catch {
      // ignore
    }

    // Write decisions to transcript (one entry per principal)
    const now = new Date().toISOString();
    appendTranscript(
      rowsSorted.map((r) => ({
        at: now,
        principal: r.principal,
        decision: r.decision,
        reason: r.reason ?? null,
        bonus_exact_cents: r.bonus_exact_subcent,
        bonus_quantized_minor: r.bonus_quantized_minor,
        payout_minor: r.payout_minor,
      }))
    );

    setReady(true);
    vgo.setStatus("policy", "Ready");
    vgo.setComplete("policy", true);
    vgo.unlock?.("carry");
    window.dispatchEvent(new CustomEvent("vgos:policy-ready"));
  };

  const resetAll = () => {
    setRows([]);
    setReady(false);
    try {
      sessionStorage.removeItem(SAVE_KEY);
      localStorage.removeItem(SAVE_KEY);
      sessionStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_KEY);
    } catch {
      // ignore
    }
    vgo.setStatus("policy", "Pending");
    vgo.setComplete("policy", false);
  };

  // Output totals
  const totals = useMemo(() => {
    const t = {
      principals: rows.length,
      net_minor: 0,
      bonus_exact_sum_cents: 0,
      bonus_quantized_minor: 0,
      payout_minor: 0,
      allows: 0,
      holds: 0,
      caps_applied: 0,
    };
    for (const r of rows) {
      t.net_minor += r.net_minor;
      t.bonus_exact_sum_cents += Number(r.bonus_exact_subcent || 0);
      t.bonus_quantized_minor += r.bonus_quantized_minor;
      t.payout_minor += r.payout_minor;
      if (r.decision === "ALLOW") t.allows += 1;
      else t.holds += 1;
      if (r.cap_applied) t.caps_applied += 1;
    }
    return t;
  }, [rows]);

  // Effective cap preview (chip)
  const effectiveCapChip = useMemo(() => {
    if (capMinorText.trim() === "") return "cap: ∞";
    const v = Math.max(0, Math.trunc(Number(capMinorText) || 0));
    return `cap: ${v}¢`;
  }, [capMinorText]);

  // Copy JSON utility
  const copyPolicyJSON = async () => {
    let s = "";
    try {
      s =
        sessionStorage.getItem(SAVE_KEY) ||
        localStorage.getItem(SAVE_KEY) ||
        JSON.stringify(sortRows(rows));
      if (s) await navigator.clipboard.writeText(s);
    } catch {
      // ignore
    }
  };

  // Clear notes
  const clearNotes = () => {
    try {
      sessionStorage.removeItem(POLICY_NOTES_KEY);
    } catch {
      // ignore
    }
    setNotes([]);
  };

  // helper for note-number rendering
  const isFiniteNumber = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

  return (
    <div className="mx-auto max-w-6xl">
      {/* Description */}
      <section className="mb-3 rounded-lg border border-slate-300 bg-white">
        <header className="flex items-center gap-2 rounded-t-lg bg-slate-100 px-3 py-2">
          <span className="text-[12px] font-semibold tracking-wide text-slate-700">
            Policy — field guide
          </span>
        </header>
        {/* Let the parent own the outer scroll; keep a modest inner pane height to match other steps */}
        <div className="max-h-36 overflow-y-auto px-3 py-3">
          <PolicyGuide />
        </div>
      </section>

      {/* Readiness banner */}
      <div
        className={`mb-3 flex items-center justify-between rounded-lg border px-3 py-2 text-[13px] ${
          ready
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-amber-200 bg-amber-50 text-amber-700"
        }`}
      >
        <div className="flex items-center gap-2">
          {ready ? <I.Check /> : <I.Alert />}
          <span>
            {ready
              ? "Policy is ready. Continue to Carry."
              : "To continue, pull from Accumulate, load attestations, apply policy, and save."}
          </span>
        </div>
        <button
          className={[
            "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[13px] font-medium",
            ready ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-amber-500/60 text-white cursor-not-allowed",
          ].join(" ")}
          disabled={!ready}
          onClick={() => {
            vgo.unlock?.("carry");
            vgo.setActive?.("carry");
            window.dispatchEvent(new CustomEvent("vgo:goto-carry"));
            router.replace("/vgomini"); // match Order/Accumulate nav pattern
          }}
        >
          Continue to Carry <span aria-hidden>↦</span>
        </button>
      </div>

      {/* Input (from Accumulate) */}
      <Section
        title="Input (from Accumulate)"
        right={
          <div className="flex items-center gap-2">
            <Chip>principals: {accum.length}</Chip>
            <Chip>Σ net: {money(accumTotals.net_minor)}</Chip>
          </div>
        }
      >
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Button aria-label="Get from Accumulate" variant="primary" onClick={getFromAccumulate} leftIcon={<I.CloudDown />}>
            Get from Accumulate
          </Button>
        </div>

        <div className="max-h-56 overflow-auto">
          <table className="min-w-[760px] w-full text-[12px]">
            <thead className="sticky top-0 bg-slate-100 text-slate-700">
              <tr className="[&>th]:px-3 [&>th]:py-2 [&>th]:text-left">
                <th scope="col">principal</th>
                <th scope="col">count</th>
                <th scope="col">gross (¢)</th>
                <th scope="col">refunds (¢)</th>
                <th scope="col">net (¢)</th>
              </tr>
            </thead>
            <tbody className="bg-white text-slate-800">
              {accum.length === 0 ? (
                <tr className="text-slate-600">
                  <td className="px-3 py-3" colSpan={5}>
                    No rollup yet. Click <strong>Get from Accumulate</strong>.
                  </td>
                </tr>
              ) : (
                accum.slice(0, 50).map((r) => (
                  <tr key={r.principal} className="border-t border-slate-200 [&>td]:px-3 [&>td]:py-1.5">
                    <td className="font-mono">{r.principal}</td>
                    <td>{r.count}</td>
                    <td>{r.gross_minor}</td>
                    <td>{r.refunds_minor}</td>
                    <td>{r.net_minor}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Attestations + Window Bonus + Caps */}
      <Section
        title="Attestations (Finance ACK & CT)"
        right={
          <div className="flex items-center gap-2">
            {/* Attestation hint */}
            <Chip tone={ackHint === "ACK_OK" ? "emerald" : "amber"}>
              {ackHint.replace("_", " ")}
            </Chip>
            <Chip>{effectiveCapChip}</Chip>
            <div className="flex items-center gap-1 text-[12px] text-slate-700">
              <I.Info />
              <span className="font-medium">Bonus %</span>
              <input
                aria-label="Bonus percent"
                type="number"
                min={0}
                step={0.01}
                value={bonusPct}
                onChange={(e) => setBonusPct(Number(e.target.value || 0))}
                className="h-7 w-24 rounded-md border border-slate-300 px-2 text-[12px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
                spellCheck={false}
              />
            </div>
          </div>
        }
      >
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <div className="mb-1 text-[12px] font-medium text-slate-800">Finance ACK (JSON)</div>
            <textarea
              aria-label="Finance ACK JSON"
              value={financeAckText}
              onChange={(e) => setFinanceAckText(e.target.value)}
              placeholder='e.g. {"window_id":"2025-09W3","reserves_ok":true,"signer":"ops@","expires_at":"2025-12-31T23:59:59Z"}'
              className="h-28 w-full rounded-md border border-slate-300 bg-white p-2 text-[12px] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
              spellCheck={false}
            />
            {financeAckErr && <div className="mt-1 text-[12px] text-amber-700">⚠ {financeAckErr}</div>}
          </div>
          <div>
            <div className="mb-1 text-[12px] font-medium text-slate-800">Compliance/Tax (CT) statuses (JSON)</div>
            <textarea
              aria-label="Compliance/Tax statuses JSON"
              value={ctText}
              onChange={(e) => setCtText(e.target.value)}
              placeholder='e.g. [{"principal_id":"acct_1","status":"cleared"},{"principal_id":"acct_2","status":"hold"}]'
              className="h-28 w-full rounded-md border border-slate-300 bg-white p-2 text-[12px] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
              spellCheck={false}
            />
            {ctErr && <div className="mt-1 text-[12px] text-amber-700">⚠ {ctErr}</div>}
          </div>
        </div>

        {/* Caps config */}
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div>
            <div className="mb-1 text-[12px] font-medium text-slate-800">Global cap (¢)</div>
            <input
              aria-label="Global cap in cents"
              type="number"
              min={0}
              step={1}
              value={capMinorText}
              onChange={(e) => setCapMinorText(e.target.value)}
              placeholder="leave blank for ∞"
              className="h-8 w-48 rounded-md border border-slate-300 px-2 text-[12px] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
              spellCheck={false}
            />
          </div>
          <div>
            <div className="mb-1 text-[12px] font-medium text-slate-800">Per-principal cap overrides (JSON)</div>
            <textarea
              aria-label="Cap overrides JSON"
              value={capOverridesText}
              onChange={(e) => setCapOverridesText(e.target.value)}
              placeholder='e.g. [{"principal_id":"CRE-00001","cap_minor":1000}]'
              className="h-20 w-full rounded-md border border-slate-300 bg-white p-2 text-[12px] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
              spellCheck={false}
            />
          </div>
        </div>
      </Section>

      {/* Actions */}
      <Section
        title="Actions"
        right={
          <div className="flex items-center gap-2">
            <Chip>principals: {rows.length || accum.length}</Chip>
            <Chip>Σ net: {money(accumTotals.net_minor)}</Chip>
            <Button aria-label="Reset Policy state" onClick={resetAll} leftIcon={<I.RotateCcw />}>
              Reset
            </Button>
          </div>
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          <Button aria-label="Apply Policy" onClick={applyPolicy} disabled={accum.length === 0} leftIcon={<I.Wand />}>
            Apply Policy
          </Button>
          <Button aria-label="Save Policy" variant="primary" onClick={savePolicy} disabled={rows.length === 0} leftIcon={<I.Save />}>
            Save Policy
          </Button>
        </div>
      </Section>

      {/* Output (policy result) */}
      <Section
        title="Output (policy result)"
        right={
          <div className="flex items-center gap-2 text-[12px] text-slate-700">
            <Chip>ALLOW: {totals.allows}</Chip>
            <Chip>HOLD: {totals.holds}</Chip>
            <Chip>caps: {totals.caps_applied}</Chip>
            <Chip>Σ net: {money(totals.net_minor)}</Chip>
            <Chip>Σ bonus_exact (¢): {totals.bonus_exact_sum_cents.toFixed(2)}</Chip>
            <Chip>Σ payout (¢): {totals.payout_minor}</Chip>
            <Button aria-label="Copy policy JSON" onClick={copyPolicyJSON} leftIcon={<I.Copy />}>
              Copy JSON
            </Button>
          </div>
        }
      >
        <div className="max-h-72 overflow-auto">
          <table className="min-w-[980px] w-full text-[12px]">
            <thead className="sticky top-0 bg-slate-100 text-slate-700">
              <tr className="[&>th]:px-3 [&>th]:py-2 [&>th]:text-left">
                <th scope="col">principal</th>
                <th scope="col">net (¢)</th>
                <th scope="col">bonus_exact (¢)</th>
                <th scope="col">bonus_quantized (¢)</th>
                <th scope="col">payout_pre_carry (¢)</th>
                <th scope="col">decision</th>
                <th scope="col">reason</th>
                <th scope="col">cap note</th>
              </tr>
            </thead>
            <tbody className="bg-white text-slate-800">
              {rows.length === 0 ? (
                <tr className="text-slate-600">
                  <td className="px-3 py-3" colSpan={8}>
                    No rows yet. Click <strong>Apply Policy</strong>.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.principal} className="border-t border-slate-200 [&>td]:px-3 [&>td]:py-1.5">
                    <td className="font-mono">{r.principal}</td>
                    <td>{r.net_minor}</td>
                    <td>{r.bonus_exact_subcent}</td>
                    <td>{r.bonus_quantized_minor}</td>
                    <td>{r.payout_minor}</td>
                    <td className={r.decision === "ALLOW" ? "text-emerald-700 font-medium" : "text-amber-700 font-medium"}>
                      {r.decision}
                    </td>
                    <td className="text-slate-600">{r.reason ?? "—"}</td>
                    <td className="text-slate-600">
                      {r.cap_applied
                        ? `capped to ${r.cap_applied.cap_minor}¢ (−${r.cap_applied.capped_delta}¢)`
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-2 text-[11px] text-slate-600">
          Carry will deterministically assign sub-cent remainders (largest fractional remainder first) and finalize payouts.
        </div>
      </Section>

      {/* Notes (dev) */}
      <Section
        title="Notes (dev)"
        right={
          <div className="flex items-center gap-2">
            <Chip>notes: {notes.length}</Chip>
            <Button aria-label="Clear policy notes" onClick={clearNotes} leftIcon={<I.Trash />}>
              Clear notes
            </Button>
          </div>
        }
      >
        <div className="max-h-48 overflow-auto">
          <table className="min-w-[720px] w-full text-[12px]">
            <thead className="sticky top-0 bg-slate-100 text-slate-700">
              <tr className="[&>th]:px-3 [&>th]:py-2 [&>th]:text-left">
                <th scope="col">at</th>
                <th scope="col">principal</th>
                <th scope="col">code</th>
                <th scope="col">before (¢)</th>
                <th scope="col">cap (¢)</th>
                <th scope="col">delta (¢)</th>
              </tr>
            </thead>
            <tbody className="bg-white text-slate-800">
              {notes.length === 0 ? (
                <tr className="text-slate-600">
                  <td className="px-3 py-3" colSpan={6}>No notes recorded.</td>
                </tr>
              ) : (
                notes.map((n, i) => (
                  <tr key={i} className="border-top border-slate-200 [&>td]:px-3 [&>td]:py-1.5">
                    <td className="font-mono">{String(n.at || "").slice(11, 19) || "—"}</td>
                    <td className="font-mono">{n.principal || "—"}</td>
                    <td className="text-slate-700">{n.code || "—"}</td>
                    <td>{isFiniteNumber(n.before) ? n.before : "—"}</td>
                    <td>{isFiniteNumber(n.cap_minor) ? n.cap_minor : "—"}</td>
                    <td>{isFiniteNumber(n.capped_delta) ? n.capped_delta : "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-2 text-[11px] text-slate-600">
          Non-monetary transcript helpers; cleared with <em>Clear notes</em>. Persisted in session storage for demo only.
        </div>
      </Section>
    </div>
  );
}
