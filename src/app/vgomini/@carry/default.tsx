"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useVGO } from "../vgo/VGOProvider";
import CarryGuide from "./CarryGuide";

/* ---------------- Icons ---------------- */
const I = {
  Table: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden {...p}>
      <path fill="currentColor" d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5zm2 2v3h14V7H5zm0 5v7h6v-7H5zm8 0v7h6v-7h-6z"/>
    </svg>
  ),
  CloudDown: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden {...p}>
      <path fill="currentColor" d="M6 19a5 5 0 0 1 0-10 6 6 0 0 1 11.3-1.9A4.5 4.5 0 1 1 18 19H6zm6-3 4-4h-3V8h-2v4H8l4 4z"/>
    </svg>
  ),
  Wand: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden {...p}>
      <path fill="currentColor" d="M3 21l10-10 2 2L5 23H3v-2zM14 3l2 2-2 2-2-2 2-2zm4 4l2 2-8 8-2-2 8-8z"/>
    </svg>
  ),
  Save: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden {...p}>
      <path fill="currentColor" d="M17 3H5a2 2 0 0 0-2 2v14l4-4h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-2 6H7V7h8v2z"/>
    </svg>
  ),
  RotateCcw: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden {...p}>
      <path fill="currentColor" d="M12 5V1L7 6l5 5V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z"/>
    </svg>
  ),
  Alert: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden {...p}>
      <path fill="currentColor" d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
    </svg>
  ),
  Check: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden {...p}>
      <path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/>
    </svg>
  ),
  Copy: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden {...p}>
      <path fill="currentColor" d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14h13a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/>
    </svg>
  ),
};

/* ---------------- Small UI atoms ---------------- */
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

const Chip: React.FC<{ children: React.ReactNode; tone?: "default" | "red" }> = ({ children, tone = "default" }) => {
  const t =
    tone === "red"
      ? "border-rose-300 bg-rose-50 text-rose-700"
      : "border-slate-300 bg-slate-100 text-slate-700";
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-[2px] text-[11px] ${t}`}>
      {children}
    </span>
  );
};

/* ---------------- Types & helpers ---------------- */
type PolicyRow = {
  principal: string;
  net_minor: number;
  bonus_exact_subcent: string;      // decimal string in cents, e.g. "1.05"
  bonus_quantized_minor: number;    // (policy kept 0; Carry finalizes)
  payout_minor: number;
  decision: "ALLOW" | "HOLD";
};

type CarryInput = {
  principal: string;
  net_minor: number;
  exact_bonus_cents: number;        // cents with fraction (e.g., 1.05)
  floor_bonus_minor: number;        // integer cents
  frac: number;                     // 0.. <1
  eligible: boolean;
};

type CarryRow = {
  principal: string;
  net_minor: number;
  floor_bonus_minor: number;
  frac: number;
  carry_delta: number;              // -1, 0, +1 (no negative guard at rank/assign level)
  final_bonus_minor: number;        // floor + delta
  final_minor: number;              // net + final_bonus_minor
};

type CarryCache = {
  input: CarryInput[];
  ranked: CarryRow[];
  rows: CarryRow[];
  saved: boolean;
};

type CarryLedgerEntry = {
  at: string; // ISO timestamp
  principal: string;
  delta_minor: number;
  floor_bonus_minor: number;
  final_bonus_minor: number;
};

function isLedgerArray(v: unknown): v is CarryLedgerEntry[] {
  return Array.isArray(v) && v.every((x) =>
    x && typeof x === "object" &&
    typeof (x as CarryLedgerEntry).at === "string" &&
    typeof (x as CarryLedgerEntry).principal === "string" &&
    typeof (x as CarryLedgerEntry).delta_minor === "number" &&
    typeof (x as CarryLedgerEntry).floor_bonus_minor === "number" &&
    typeof (x as CarryLedgerEntry).final_bonus_minor === "number"
  );
}

const POLICY_KEY = "vgos:policy";
const CARRY_SAVE_KEY = "vgos:carry";
const CARRY_CACHE_KEY = "vgomini:carry:v1";
const TRANSCRIPT_T2_CARRY = "vgos:transcript:tier2:carry";

const money = (minor: number) => `$${(minor / 100).toFixed(2)}`;

/* ---------------- Storage helpers ---------------- */
function safeParse<T>(s: string | null, guard: (v: unknown) => v is T): T | null {
  if (!s) return null;
  try {
    const v = JSON.parse(s) as unknown;
    return guard(v) ? v : null;
  } catch {
    return null;
  }
}

function readPolicyRows(): PolicyRow[] {
  if (typeof window === "undefined") return [];
  try {
    const s = sessionStorage.getItem(POLICY_KEY) ?? localStorage.getItem(POLICY_KEY);
    const v = JSON.parse(s ?? "[]");
    return Array.isArray(v) ? (v as PolicyRow[]) : [];
  } catch {
    return [];
  }
}

function loadCache(): CarryCache | null {
  if (typeof window === "undefined") return null;
  try {
    const s = sessionStorage.getItem(CARRY_CACHE_KEY) ?? localStorage.getItem(CARRY_CACHE_KEY);
    if (!s) return null;
    const v = JSON.parse(s) as unknown;
    if (!v || typeof v !== "object") return null;
    const c = v as Partial<CarryCache>;
    return {
      input: Array.isArray(c.input) ? (c.input as CarryInput[]) : [],
      ranked: Array.isArray(c.ranked) ? (c.ranked as CarryRow[]) : [],
      rows: Array.isArray(c.rows) ? (c.rows as CarryRow[]) : [],
      saved: Boolean(c.saved),
    };
  } catch {
    return null;
  }
}
function saveCache(next: CarryCache) {
  try {
    const s = JSON.stringify(next);
    sessionStorage.setItem(CARRY_CACHE_KEY, s);
    localStorage.setItem(CARRY_CACHE_KEY, s);
  } catch {
    // ignore
  }
}

/* ---------------- Deterministic carry ---------------- */
function toCarryInput(policyRows: PolicyRow[]): CarryInput[] {
  return policyRows.map((r) => {
    const exact = Number(r.bonus_exact_subcent || 0); // cents with sub-cent
    const floor = Math.floor(exact);
    const frac = Math.max(0, exact - floor);
    return {
      principal: r.principal,
      net_minor: Number(r.net_minor || 0),
      exact_bonus_cents: exact,
      floor_bonus_minor: floor,
      frac,
      eligible: r.decision === "ALLOW",
    };
  });
}

function distributeRemainder(inputs: CarryInput[]) {
  const eligible = inputs.filter((x) => x.eligible);
  const totalExact = eligible.reduce((s, x) => s + x.exact_bonus_cents, 0); // cents (fractional permitted)
  const sumFloors  = eligible.reduce((s, x) => s + x.floor_bonus_minor, 0); // integer cents
  const rounded    = Math.round(totalExact);                                // integer cents
  const startRemainder = rounded - sumFloors;                               // ±N

  // Initialize rows
  const rows: CarryRow[] = inputs.map((x) => ({
    principal: x.principal,
    net_minor: x.net_minor,
    floor_bonus_minor: x.eligible ? x.floor_bonus_minor : 0,
    frac: x.eligible ? x.frac : 0,
    carry_delta: 0,
    final_bonus_minor: x.eligible ? x.floor_bonus_minor : 0,
    final_minor: x.net_minor + (x.eligible ? x.floor_bonus_minor : 0),
  }));

  if (startRemainder === 0 || eligible.length === 0) {
    return { rows, startRemainder, totalExact, rounded };
  }

  const dir = startRemainder > 0 ? 1 : -1;
  let left = Math.abs(startRemainder);

  // Rank: frac DESC, principal A→Z (stable)
  const rank = [...rows]
    .filter((r) => r.frac > 0 || dir < 0)
    .sort((a, b) => {
      if (b.frac !== a.frac) return b.frac - a.frac;
      return a.principal.localeCompare(b.principal);
    });

  // Assign ±1 until exhausted
  for (let i = 0; left > 0 && rank.length > 0; i = (i + 1) % rank.length) {
    rank[i].carry_delta += dir;
    rank[i].final_bonus_minor += dir;
    rank[i].final_minor += dir;
    left--;
  }

  return { rows, startRemainder, totalExact, rounded };
}

/* ---------------- Component ---------------- */
export default function CarryStep() {
  const router = useRouter();
  const vgo = useVGO();

  const [input, setInput] = useState<CarryInput[]>([]);
  const [ranked, setRanked] = useState<CarryRow[]>([]);
  const [rows, setRows] = useState<CarryRow[]>([]);
  const [saved, setSaved] = useState<boolean>(false);

  const [invariantBad, setInvariantBad] = useState<boolean>(false);
  const [ledgerCount, setLedgerCount] = useState<number>(0);

  // rehydrate / auto-pull
  useEffect(() => {
    const cached = loadCache();
    if (cached) {
      setInput(cached.input || []);
      setRanked(cached.ranked || []);
      setRows(cached.rows || []);
      setSaved(Boolean(cached.saved));
    } else {
      const policy = readPolicyRows();
      const prepared = toCarryInput(policy);
      setInput(prepared);
      setRanked([]);
      setRows([]);
      setSaved(false);
    }

    // ledger count
    try {
      const prev = sessionStorage.getItem(TRANSCRIPT_T2_CARRY) ?? "[]";
      const arr = safeParse<CarryLedgerEntry[]>(prev, isLedgerArray);
      setLedgerCount(arr ? arr.length : 0);
    } catch {
      setLedgerCount(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // persist cache on change
  useEffect(() => {
    saveCache({ input, ranked, rows, saved });
  }, [input, ranked, rows, saved]);

  // telemetry
  const eligibleCount = useMemo(() => input.filter((x) => x.eligible).length, [input]);
  const totals = useMemo(() => {
    const eligible = input.filter((x) => x.eligible);
    const totalExact = eligible.reduce((s, x) => s + x.exact_bonus_cents, 0);
    const rounded = Math.round(totalExact);
    const floors = eligible.reduce((s, x) => s + x.floor_bonus_minor, 0);
    return {
      totalExact,
      rounded,
      remainder: rounded - floors,
      netSum: input.reduce((s, x) => s + x.net_minor, 0),
    };
  }, [input]);

  const targetTotalMinor = useMemo(() => totals.netSum + totals.rounded, [totals]);
  const ready = saved && rows.length > 0;

  // actions
  const getFromPolicy = () => {
    const policy = readPolicyRows();
    const prepared = toCarryInput(policy);
    setInput(prepared);
    setRanked([]);
    setRows([]);
    setSaved(false);
    setInvariantBad(false);
  };

  const distribute = () => {
    const { rows: out, startRemainder, totalExact } = distributeRemainder(input);

    // Preview: eligible ordered by frac desc, principal A→Z
    const preview = [...out]
      .filter((r) => r.final_bonus_minor > 0 || r.frac > 0 || r.carry_delta !== 0 || input.find(i => i.principal === r.principal)?.eligible)
      .sort((a, b) => {
        if (b.frac !== a.frac) return b.frac - a.frac;
        return a.principal.localeCompare(b.principal);
      });

    setRanked(preview);
    setRows(out);
    setSaved(false);

    // DEV invariant (silent in prod)
    try {
      if (process.env.NODE_ENV !== "production") {
        const sumFinalBonus = out.reduce((s, r) => s + r.final_bonus_minor, 0);
        const sumCarryDelta = out.reduce((s, r) => s + r.carry_delta, 0);
        const expectRounded = Math.round(totalExact);
        const ok = sumFinalBonus === expectRounded && sumCarryDelta === startRemainder;
        setInvariantBad(!ok);
        if (!ok) {
          // eslint-disable-next-line no-console
          console.warn("[Carry] Invariant violated", {
            sumFinalBonus,
            expectRounded,
            sumCarryDelta,
            startRemainder,
          });
        }
      } else {
        setInvariantBad(false);
      }
    } catch {
      // ignore
    }
  };

  function appendCarryLedger(entries: ReadonlyArray<{
    principal: string; delta_minor: number; floor_bonus_minor: number; final_bonus_minor: number;
  }>) {
    try {
      const now = new Date().toISOString(); // handler use only
      const prevRaw = sessionStorage.getItem(TRANSCRIPT_T2_CARRY) ?? "[]";
      const prev = safeParse<CarryLedgerEntry[]>(prevRaw, isLedgerArray) ?? [];
      const next: CarryLedgerEntry[] = [
        ...prev,
        ...entries.map(e => ({
          at: now,
          principal: e.principal,
          delta_minor: e.delta_minor,
          floor_bonus_minor: e.floor_bonus_minor,
          final_bonus_minor: e.final_bonus_minor,
        })),
      ];
      const s = JSON.stringify(next);
      sessionStorage.setItem(TRANSCRIPT_T2_CARRY, s);
      localStorage.setItem(TRANSCRIPT_T2_CARRY, s);
      setLedgerCount(next.length);
    } catch {
      // no-op in demo
    }
  }

  const saveAllocations = () => {
    if (rows.length === 0) return;

    // Persist final allocations for Seal
    try {
      const payload = {
        rows: rows.map(({ principal, final_minor }) => ({ principal, final_minor })),
        target_total_minor: targetTotalMinor,
      };
      const s = JSON.stringify(payload);
      sessionStorage.setItem(CARRY_SAVE_KEY, s);
      localStorage.setItem(CARRY_SAVE_KEY, s);
    } catch {
      // ignore
    }

    // write Tier2 carry ledger entries
    try {
      const ledger = rows.map((r) => ({
        principal: r.principal,
        delta_minor: r.carry_delta,
        floor_bonus_minor: r.floor_bonus_minor,
        final_bonus_minor: r.final_bonus_minor,
      }));
      appendCarryLedger(ledger);
    } catch {
      // ignore
    }

    setSaved(true);

    try {
      window.dispatchEvent(new CustomEvent("vgos:carry-ready"));
      localStorage.removeItem("vgomini:navigate");
    } catch {
      // ignore
    }
  };

  const copyLedgerJSON = async () => {
    try {
      const raw = sessionStorage.getItem(TRANSCRIPT_T2_CARRY) ?? "[]";
      await navigator.clipboard.writeText(raw);
    } catch {
      // ignore
    }
  };

  const resetAll = () => {
    setRanked([]);
    setRows([]);
    setSaved(false);
    setInvariantBad(false);
    try {
      sessionStorage.removeItem(CARRY_SAVE_KEY);
      localStorage.removeItem(CARRY_SAVE_KEY);
      sessionStorage.removeItem(CARRY_CACHE_KEY);
      localStorage.removeItem(CARRY_CACHE_KEY);
      localStorage.removeItem("vgomini:navigate");
    } catch {
      // ignore
    }
  };

  // banner
  const Banner = () => (
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
            ? "Carry is ready. Continue to Seal."
            : "To continue, pull from Policy and distribute the remainder."}
        </span>
      </div>
      <button
        type="button"
        className={[
          "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[13px] font-medium",
          ready ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-amber-500/60 text-white cursor-not-allowed",
        ].join(" ")}
        disabled={!ready}
        onClick={() => {
          if (!ready) return;
          // Nav parity: unlock + setActive + event + router.replace
          try {
            (vgo as unknown as { unlock?: (k: string) => void; setActive?: (k: string) => void; })
              ?.unlock?.("seal");
            (vgo as unknown as { unlock?: (k: string) => void; setActive?: (k: string) => void; })
              ?.setActive?.("seal");
          } catch {}
          try {
            window.dispatchEvent(new CustomEvent("vgo:goto-seal"));
          } catch {}
          router.replace("/vgomini");
        }}
        aria-label="Continue to Seal"
      >
        Continue to Seal <span aria-hidden>↦</span>
      </button>
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl">
      {/* Field guide */}
      <section className="mb-3 rounded-lg border border-slate-300 bg-white">
        <header className="flex items-center gap-2 rounded-t-lg bg-slate-100 px-3 py-2">
          <span className="text-[12px] font-semibold tracking-wide text-slate-700">Carry — field guide</span>
        </header>
        <div className="max-h-36 overflow-y-auto px-3 py-3">
          <CarryGuide />
        </div>
      </section>

      {/* Readiness banner */}
      <Banner />

      {/* Input (from Policy) */}
      <Section
        title="Input (from Policy)"
        right={
          <div className="flex items-center gap-2">
            <Chip>eligible: {eligibleCount}</Chip>
            <Chip>Σ exact bonus (¢): {totals.totalExact.toFixed(2)}</Chip>
            <Chip>rounded bonus (¢): {totals.rounded}</Chip>
            <Chip>remainder (¢): {totals.remainder}</Chip>
            <Chip>target total: {money(targetTotalMinor)}</Chip>
          </div>
        }
      >
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Button aria-label="Get from Policy" variant="primary" onClick={getFromPolicy} leftIcon={<I.CloudDown />}>
            Get from Policy
          </Button>
        </div>

        <div className="max-h-56 overflow-auto">
          <table className="min-w-[900px] w-full text-[12px]">
            <thead className="sticky top-0 bg-slate-100 text-slate-700">
              <tr className="[&>th]:px-3 [&>th]:py-2 [&>th]:text-left">
                <th scope="col">principal</th>
                <th scope="col">eligible</th>
                <th scope="col">net (¢)</th>
                <th scope="col">bonus exact (¢)</th>
                <th scope="col">floor bonus (¢)</th>
                <th scope="col">frac</th>
              </tr>
            </thead>
            <tbody className="bg-white text-slate-800">
              {input.length === 0 ? (
                <tr className="text-slate-600">
                  <td className="px-3 py-3" colSpan={6}>
                    No input. Save Policy first, then click <strong>Get from Policy</strong>.
                  </td>
                </tr>
              ) : (
                input.slice(0, 80).map((r) => (
                  <tr key={r.principal} className="border-t border-slate-200 [&>td]:px-3 [&>td]:py-1.5">
                    <td className="font-mono">{r.principal}</td>
                    <td className={r.eligible ? "text-emerald-700" : "text-amber-700"}>{r.eligible ? "ALLOW" : "HOLD"}</td>
                    <td>{r.net_minor}</td>
                    <td>{r.exact_bonus_cents.toFixed(2)}</td>
                    <td>{r.floor_bonus_minor}</td>
                    <td>{r.frac.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Actions */}
      <Section
        title="Actions"
        right={
          <div className="flex items-center gap-2">
            {invariantBad && <Chip tone="red">invariant</Chip>}
            <Chip>eligible: {eligibleCount}</Chip>
            <Chip>remainder (¢): {totals.remainder}</Chip>
            <Chip>target: {money(targetTotalMinor)}</Chip>
            <Chip>ledger entries: {ledgerCount}</Chip>
            <Button aria-label="Reset Carry" onClick={resetAll} leftIcon={<I.RotateCcw />}>Reset</Button>
          </div>
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          <Button aria-label="Distribute remainder" onClick={distribute} disabled={input.length === 0} leftIcon={<I.Wand />}>
            Distribute remainder
          </Button>
          <Button aria-label="Save allocations" variant="primary" onClick={saveAllocations} disabled={rows.length === 0} leftIcon={<I.Save />}>
            Save allocations
          </Button>
        </div>
      </Section>

      {/* Preview (ranking & carry deltas) */}
      <Section title="Preview (ranking & carry deltas)">
        <div className="max-h-56 overflow-auto">
          <table className="min-w-[820px] w-full text-[12px]">
            <thead className="sticky top-0 bg-slate-100 text-slate-700">
              <tr className="[&>th]:px-3 [&>th]:py-2 [&>th]:text-left">
                <th scope="col">principal</th>
                <th scope="col">net (¢)</th>
                <th scope="col">floor bonus (¢)</th>
                <th scope="col">frac</th>
                <th scope="col">carry Δ (¢)</th>
                <th scope="col">final bonus (¢)</th>
              </tr>
            </thead>
            <tbody className="bg-white text-slate-800">
              {ranked.length === 0 ? (
                <tr className="text-slate-600">
                  <td className="px-3 py-3" colSpan={6}>Nothing to preview. Click <strong>Distribute remainder</strong>.</td>
                </tr>
              ) : (
                ranked.map((r) => (
                  <tr key={r.principal} className="border-t border-slate-200 [&>td]:px-3 [&>td]:py-1.5">
                    <td className="font-mono">{r.principal}</td>
                    <td>{r.net_minor}</td>
                    <td>{r.floor_bonus_minor}</td>
                    <td>{r.frac.toFixed(2)}</td>
                    <td className={r.carry_delta === 0 ? "text-slate-700" : r.carry_delta > 0 ? "text-emerald-700" : "text-amber-700"}>
                      {r.carry_delta > 0 ? `+${r.carry_delta}` : r.carry_delta}
                    </td>
                    <td>{r.final_bonus_minor}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Output (final allocations) */}
      <Section
        title="Output (final allocations)"
        right={
          <div className="flex items-center gap-2 text-[12px] text-slate-700">
            <Chip>Σ final: {money(rows.reduce((s, r) => s + r.final_minor, 0))}</Chip>
            <Chip>target: {money(targetTotalMinor)}</Chip>
            <Button aria-label="Copy carry ledger JSON" onClick={copyLedgerJSON} leftIcon={<I.Copy />}>Copy ledger JSON</Button>
          </div>
        }
      >
        <div className="max-h-72 overflow-auto">
          <table className="min-w-[680px] w-full text-[12px]">
            <thead className="sticky top-0 bg-slate-100 text-slate-700">
              <tr className="[&>th]:px-3 [&>th]:py-2 [&>th]:text-left">
                <th scope="col">principal</th>
                <th scope="col">final (¢)</th>
                <th scope="col">final ($)</th>
              </tr>
            </thead>
            <tbody className="bg-white text-slate-800">
              {rows.length === 0 ? (
                <tr className="text-slate-600">
                  <td className="px-3 py-3" colSpan={3}>No rows yet. Click <strong>Distribute remainder</strong>, then <strong>Save allocations</strong>.</td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.principal} className="border-t border-slate-200 [&>td]:px-3 [&>td]:py-1.5">
                    <td className="font-mono">{r.principal}</td>
                    <td>{r.final_minor}</td>
                    <td>{money(r.final_minor)}</td>
                  </tr>
                ))
              )}
            </tbody>
            {rows.length > 0 && (
              <tfoot className="bg-slate-50 text-slate-800">
                <tr className="[&>td]:px-3 [&>td]:py-2 font-semibold">
                  <td>Σ totals</td>
                  <td>{rows.reduce((s, r) => s + r.final_minor, 0)}</td>
                  <td>{money(rows.reduce((s, r) => s + r.final_minor, 0))}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
        <div className="mt-2 text-[11px] text-slate-600">
          Sum(final) must equal the target. Eligible principals only receive the carry assignment.
        </div>
      </Section>
    </div>
  );
}
