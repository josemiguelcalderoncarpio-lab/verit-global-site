// src/app/vgomini/@intake/default.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import IntakeGuide from "./IntakeGuide";
import { useVGO } from "../vgo/VGOProvider";

/* ────────────────── icons / chips ────────────────── */
const Icon = {
  info: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="14" height="14" {...p}>
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-6h2v6Zm0-8h-2V7h2v2Z"
      />
    </svg>
  ),
  table: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="14" height="14" {...p}>
      <path
        fill="currentColor"
        d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5zm2 2v3h14V7H5zm0 5v7h6v-7H5zm8 0v7h6v-7h-6z"
      />
    </svg>
  ),
  refresh: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}>
      <path
        fill="currentColor"
        d="M17.65 6.35A7.95 7.95 0 0 0 12 4a8 8 0 1 0 7.75 6h-2.1A6 6 0 1 1 12 6c1.3 0 2.5.42 3.45 1.13L13 10h7V3l-2.35 3.35z"
      />
    </svg>
  ),
  bolt: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}>
      <path fill="currentColor" d="M11 21v-6H7l6-12v6h4l-6 12z" />
    </svg>
  ),
  chev: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="12" height="12" {...p}>
      <path fill="currentColor" d="m9 6 6 6-6 6z" />
    </svg>
  ),
  pull: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="14" height="14" {...p}>
      <path fill="currentColor" d="M5 20h14v-2H5v2Zm7-16-5 5h3v4h4v-4h3l-5-5Z" />
    </svg>
  ),
  check: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="14" height="14" {...p}>
      <path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
    </svg>
  ),
  stage: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="14" height="14" {...p}>
      <path fill="currentColor" d="M10 17v-4H6l6-8v4h4l-6 8Z" />
    </svg>
  ),
  reset: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="14" height="14" {...p}>
      <path fill="currentColor" d="M12 6V2L7 7l5 5V8a4 4 0 1 1-4 4H6a6 6 0 1 0 6-6Z" />
    </svg>
  ),
};

function Chip({
  tone = "slate",
  children,
  title,
}: {
  tone?: "slate" | "amber" | "emerald" | "sky" | "rose";
  children: React.ReactNode;
  title?: string;
}) {
  const cls: Record<string, string> = {
    slate: "bg-slate-100 text-slate-700 border-slate-300",
    amber: "bg-amber-100 text-amber-800 border-amber-300",
    emerald: "bg-emerald-100 text-emerald-800 border-emerald-300",
    sky: "bg-sky-100 text-sky-800 border-sky-300",
    rose: "bg-rose-100 text-rose-800 border-rose-300",
  };
  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-[2px] text-[12px] ${cls[tone]}`}
    >
      {children}
    </span>
  );
}

/* ────────────────── types ────────────────── */
type ApiRow = {
  received_at: string;
  idempotency?: string;
  idempotency_key?: string;
  event_id: string;
  principal?: string;
  principal_id?: string;
  type: "order" | "refund";
  amount_minor?: number;
  amount?: string;
  replayed?: boolean | "yes" | "no";
  partition?: number;
  partition_id?: number;
};

type GwRow = {
  received_at: string;
  idempotency?: string;
  idempotency_key?: string;
  event_id: string;
  principal?: string;
  principal_id?: string;
  type: "order" | "refund";
  amount_minor?: number;
  amount?: string;
  replayed?: "yes" | "no";
  partition?: number;
};

type ValidRow = {
  event_id: string;
  principal: string;
  type: "order" | "refund";
  amount_minor: number;
  occurred_at?: string;
  partition?: number;
};

type DupNote = {
  at: string;
  event_id: string;
  reason: "idempotency-dup" | "event-id-dup";
};

type ProvideIntakeDetail = { rows: ValidRow[] };

type WindowWithBridge = Window & { __INTAKE_BRIDGE__?: boolean };

/* ────────────────── helpers ────────────────── */
const moneyToMinor = (v: unknown): number => {
  if (typeof v === "number" && Number.isFinite(v)) return Math.round(v * 100);
  if (typeof v === "string") {
    const n = Number(v.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(n) ? Math.round(n * 100) : 0;
  }
  return 0;
};

const fmtTime = (iso?: string) =>
  iso ? new Date(iso).toISOString().slice(11, 19) : "—";

/* ────────────────── component ────────────────── */
export default function IntakeStep() {
  const vgo = useVGO();

  const [input, setInput] = useState<GwRow[]>([]);
  const [validatedRows, setValidatedRows] = useState<ValidRow[]>([]);
  const [stagedRows, setStagedRows] = useState<ValidRow[]>([]);
  const [dups, setDups] = useState<DupNote[]>([]);
  const [loading, setLoading] = useState(false);

  // ── watermark calc
  const { byPartition, targetW } = useMemo(() => {
    const byP = new Map<number, string>();
    let maxTs = "";
    for (const r of input) {
      const p = r.partition ?? 0;
      const ts = r.received_at;
      if (!byP.has(p) || (byP.get(p) as string) < ts) byP.set(p, ts);
      if (!maxTs || maxTs < ts) maxTs = ts;
    }
    return { byPartition: byP, targetW: maxTs };
  }, [input]);

  const allAtOrBeyond = useMemo(() => {
    if (!targetW) return false;
    for (const [, ts] of byPartition) if (ts < targetW) return false;
    return byPartition.size > 0;
  }, [byPartition, targetW]);

  const stagedReady = stagedRows.length > 0;
  const gateReady = stagedReady && allAtOrBeyond;
  const prevGate = useRef(gateReady);

  useEffect(() => {
    if (prevGate.current === gateReady) return;
    prevGate.current = gateReady;
    vgo.setStatus?.("intake", gateReady ? "Ready" : "Pending");
    vgo.setComplete?.("intake", gateReady);
    // We intentionally avoid adding `vgo` to deps to keep provider reference stable for this gate flip.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gateReady]);

  /* ────────────────── Pull / Validate / Stage ────────────────── */

  async function pullFromGateway() {
    try {
      setLoading(true);
      const r = await fetch("/api/v1/events", { cache: "no-store" });
      const json: unknown = await r.json();
      const raw: ApiRow[] = Array.isArray(json) ? (json as ApiRow[]) : [];

      const rows: GwRow[] = raw.map((d) => ({
        received_at: d.received_at,
        idempotency: d.idempotency ?? d.idempotency_key,
        idempotency_key: d.idempotency_key,
        event_id: d.event_id,
        principal: d.principal ?? d.principal_id,
        principal_id: d.principal_id,
        type: d.type,
        amount_minor: d.amount_minor,
        amount: d.amount,
        replayed: d.replayed === true || d.replayed === "yes" ? "yes" : "no",
        partition: d.partition ?? d.partition_id,
      }));

      setInput(rows);
      setValidatedRows([]);
      setStagedRows([]);
      setDups([]);
    } finally {
      setLoading(false);
    }
  }

  function validate() {
    if (!input.length) return;

    const seenEvent = new Set<string>();
    const out: ValidRow[] = [];
    const dupNotes: DupNote[] = [];

    for (const r of input) {
      const isReplay = r.replayed === "yes";

      if (isReplay) {
        dupNotes.push({
          at: r.received_at,
          event_id: r.event_id,
          reason: "idempotency-dup",
        });
        continue;
      }

      if (seenEvent.has(r.event_id)) {
        dupNotes.push({
          at: r.received_at,
          event_id: r.event_id,
          reason: "event-id-dup",
        });
        continue;
      }
      seenEvent.add(r.event_id);

      out.push({
        event_id: r.event_id,
        principal: String(r.principal || r.principal_id || ""),
        type: r.type,
        amount_minor: r.amount_minor ?? moneyToMinor(r.amount ?? 0),
        occurred_at: r.received_at,
        partition: r.partition ?? 0,
      });
    }

    setDups(dupNotes);
    setValidatedRows(out);
    setStagedRows([]); // require explicit Stage
  }

  function stage() {
    if (!validatedRows.length) return;
    setStagedRows(validatedRows);
    try {
      sessionStorage.setItem(
        "vgomini:intake:staged",
        JSON.stringify(validatedRows)
      );
    } catch {
      // ignore
    }
    window.dispatchEvent(new CustomEvent("vgo:intake-staged"));
  }

  // Bridge so Order can request rows even if storage was cleared
  useEffect(() => {
    if (typeof window === "undefined") return;
    const W = window as WindowWithBridge;
    if (W.__INTAKE_BRIDGE__) return;
    W.__INTAKE_BRIDGE__ = true;

    const onRequest = () => {
      try {
        const raw = sessionStorage.getItem("vgomini:intake:staged");
        const rows: ValidRow[] = raw ? (JSON.parse(raw) as ValidRow[]) : [];
        window.dispatchEvent(
          new CustomEvent<ProvideIntakeDetail>("vgo:provide-intake", {
            detail: { rows },
          })
        );
      } catch {
        window.dispatchEvent(
          new CustomEvent<ProvideIntakeDetail>("vgo:provide-intake", {
            detail: { rows: [] },
          })
        );
      }
    };
    window.addEventListener("vgo:request-intake", onRequest);
    return () => window.removeEventListener("vgo:request-intake", onRequest);
  }, []);

  function resetLocal() {
    setValidatedRows([]);
    setStagedRows([]);
    setDups([]);
  }

  const counts = useMemo(
    () => ({
      input: input.length,
      validated: validatedRows.length,
      staged: stagedRows.length,
      dupCount: dups.length,
    }),
    [input.length, validatedRows.length, stagedRows.length, dups.length]
  );

  function continueToOrder() {
    const gateReady = stagedRows.length > 0 && allAtOrBeyond;
    if (!gateReady) return;
    vgo.setComplete?.("intake", true);
    window.dispatchEvent(new CustomEvent("vgo:goto-order"));
  }

  /* ────────────────── UI ────────────────── */
  return (
    <div className="mx-auto max-w-6xl px-4 pb-10">
      {/* Guide */}
      <div className="mb-3 rounded-lg border border-slate-300 bg-white">
        <div className="flex items-center gap-2 rounded-t-lg bg-slate-50 px-3 py-2 text-[12px] font-semibold text-slate-700">
          {Icon.info({})} <span>Intake — field guide</span>
        </div>
        <div className="max-h-32 overflow-y-auto px-3 py-3">
          <IntakeGuide />
        </div>
      </div>

      {/* Gate banner */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={[
          "mb-3 flex items-center justify-between rounded-lg border px-3 py-2 text-[13px]",
          stagedRows.length > 0 && allAtOrBeyond
            ? "border-emerald-300 bg-emerald-50 text-emerald-800"
            : "border-amber-300 bg-amber-50 text-amber-800",
        ].join(" ")}
      >
        <div>
          {stagedRows.length > 0 && allAtOrBeyond
            ? "Order is ready. Window closed (∀p Wp ≥ W*)."
            : "To continue, pull, validate, stage rows, and wait until all partitions reach W*."}
        </div>
        <button
          onClick={continueToOrder}
          disabled={!(stagedRows.length > 0 && allAtOrBeyond)}
          className={[
            "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[13px] font-medium",
            stagedRows.length > 0 && allAtOrBeyond
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "cursor-not-allowed bg-amber-500/60 text-white",
          ].join(" ")}
        >
          Continue to Order {Icon.chev({})}
        </button>
      </div>

      {/* Input (raw) */}
      <section className="mb-3 rounded-lg border border-slate-300 bg-white">
        <div className="flex items-center justify-between rounded-t-lg bg-slate-50 px-3 py-2">
          <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-700">
            {Icon.table({})} <span>Input (raw)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={pullFromGateway}
              className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-[12px] text-slate-700 hover:bg-slate-50"
              title="Fetch latest rows from Gateway"
            >
              {Icon.refresh({})} Pull from Gateway
            </button>
          </div>
        </div>
        <div className="px-3 py-2">
          <div className="overflow-auto rounded-md border border-slate-300">
            <table className="w-full text-left text-[12px]">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-2 py-2">received_at</th>
                  <th className="px-2 py-2">idempotency</th>
                  <th className="px-2 py-2">event_id</th>
                  <th className="px-2 py-2">principal</th>
                  <th className="px-2 py-2">type</th>
                  <th className="px-2 py-2">amount</th>
                  <th className="px-2 py-2">replayed?</th>
                </tr>
              </thead>
              <tbody className="text-slate-800">
                {input.length === 0 ? (
                  <tr>
                    <td className="px-2 py-3 text-slate-500" colSpan={7}>
                      {loading ? "Loading…" : "No rows yet. Click Pull from Gateway."}
                    </td>
                  </tr>
                ) : (
                  input.map((r, i) => (
                    <tr
                      key={i}
                      className="border-t border-slate-200 odd:bg-slate-50/50"
                    >
                      <td className="px-2 py-1 whitespace-nowrap">
                        {fmtTime(r.received_at)}
                      </td>
                      <td
                        className="px-2 py-1 font-mono text-[11px] truncate max-w-[16ch]"
                        title={r.idempotency || r.idempotency_key}
                      >
                        {r.idempotency || r.idempotency_key || "—"}
                      </td>
                      <td
                        className="px-2 py-1 font-mono text-[11px] truncate max-w-[12ch]"
                        title={r.event_id}
                      >
                        {r.event_id}
                      </td>
                      <td className="px-2 py-1">
                        {r.principal || r.principal_id || "—"}
                      </td>
                      <td className="px-2 py-1">{r.type}</td>
                      <td className="px-2 py-1">
                        {typeof r.amount_minor === "number"
                          ? `$${(r.amount_minor / 100).toFixed(2)}`
                          : r.amount || "—"}
                      </td>
                      <td className="px-2 py-1">
                        {r.replayed === "yes" ? "yes" : "no"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Actions */}
      <section className="mb-3 rounded-lg border border-slate-300 bg-white">
        <div className="flex items-center justify-between rounded-t-lg bg-slate-50 px-3 py-2">
          <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-700">
            {Icon.bolt({})} <span>Actions</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <Chip tone="sky" title="input rows">
              input: {input.length}
            </Chip>
            <Chip tone="emerald" title="validated rows">
              validated: {validatedRows.length}
            </Chip>
            <Chip tone="slate" title="staged rows">
              staged: {stagedRows.length}
            </Chip>
            <Chip tone="amber" title="duplicates found">
              dups: {dups.length}
            </Chip>
            <Chip
              tone={allAtOrBeyond ? "emerald" : "amber"}
              title="target watermark"
            >
              W*:{targetW ? ` ${fmtTime(targetW)}` : " —"}
            </Chip>
            <Chip
              tone={allAtOrBeyond ? "emerald" : "amber"}
              title="window closed?"
            >
              closed: {allAtOrBeyond ? "yes" : "no"}
            </Chip>
            <span className="text-[11px] text-slate-600">Partitions:</span>
            {[...byPartition.entries()].map(([p, ts]) => (
              <Chip
                key={p}
                tone={!targetW || ts >= targetW ? "emerald" : "amber"}
                title={`partition ${p}`}
              >
                p{p}: {fmtTime(ts)}
              </Chip>
            ))}
            <button
              onClick={resetLocal}
              className="ml-2 inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-[12px] text-slate-700 hover:bg-slate-50"
              title="Clear Intake-local state"
            >
              {Icon.reset({})} Reset
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 px-3 py-2">
          <button
            onClick={pullFromGateway}
            className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-[12px] text-slate-700 hover:bg-slate-50"
          >
            {Icon.pull({})} Pull from Gateway
          </button>
          <button
            onClick={validate}
            className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-[12px] text-slate-700 hover:bg-slate-50"
          >
            {Icon.check({})} Validate
          </button>
          <button
            onClick={stage}
            className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-[12px] text-slate-700 hover:bg-slate-50"
          >
            {Icon.stage({})} Stage → Order {Icon.chev({})}
          </button>
        </div>
      </section>

      {/* Validated */}
      <section className="mb-3 rounded-lg border border-slate-300 bg-white">
        <div className="flex items-center justify-between rounded-t-lg bg-slate-50 px-3 py-2">
          <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-700">
            {Icon.table({})} <span>Validated (preview fold order)</span>
          </div>
          <div className="text-[11px] text-slate-600">
            {validatedRows.length ? `${validatedRows.length} row(s)` : "No data yet"}
          </div>
        </div>
        <div className="px-3 py-2">
          <div className="overflow-auto rounded-md border border-slate-300">
            <table className="w-full text-left text-[12px]">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-2 py-2">event_id</th>
                  <th className="px-2 py-2">principal</th>
                  <th className="px-2 py-2">type</th>
                  <th className="px-2 py-2">amount</th>
                  <th className="px-2 py-2">occurred_at</th>
                  <th className="px-2 py-2">issue</th>
                </tr>
              </thead>
              <tbody className="text-slate-800">
                {validatedRows.length === 0 ? (
                  <tr>
                    <td className="px-2 py-3 text-slate-500" colSpan={6}>
                      Nothing to validate. Click Validate.
                    </td>
                  </tr>
                ) : (
                  validatedRows.map((r) => (
                    <tr
                      key={r.event_id}
                      className="border-t border-slate-200 odd:bg-slate-50/50"
                    >
                      <td className="px-2 py-1 font-mono text-[11px]">
                        {r.event_id}
                      </td>
                      <td className="px-2 py-1">{r.principal}</td>
                      <td className="px-2 py-1">{r.type}</td>
                      <td className="px-2 py-1">
                        ${(r.amount_minor / 100).toFixed(2)}
                      </td>
                      <td className="px-2 py-1 whitespace-nowrap">
                        {fmtTime(r.occurred_at)}
                      </td>
                      <td className="px-2 py-1">—</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Output (staged) */}
      <section className="rounded-lg border border-slate-300 bg-white">
        <div className="flex items-center justify-between rounded-t-lg bg-slate-50 px-3 py-2">
          <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-700">
            {Icon.table({})}{" "}
            <span>Staged for next box (deduped • ordered-ready)</span>
          </div>
          <div className="text-[11px] text-slate-600">
            {stagedRows.length ? `${stagedRows.length} row(s)` : "Validate first."}
          </div>
        </div>
        <div className="px-3 py-2">
          <div className="overflow-auto rounded-md border border-slate-300">
            <table className="w-full text-left text-[12px]">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-2 py-2">event_id</th>
                  <th className="px-2 py-2">principal</th>
                  <th className="px-2 py-2">type</th>
                  <th className="px-2 py-2">amount</th>
                  <th className="px-2 py-2">occurred_at</th>
                </tr>
              </thead>
              <tbody className="text-slate-800">
                {stagedRows.length === 0 ? (
                  <tr>
                    <td className="px-2 py-3 text-slate-500" colSpan={5}>
                      No rows yet.
                    </td>
                  </tr>
                ) : (
                  stagedRows.map((r) => (
                    <tr
                      key={r.event_id}
                      className="border-t border-slate-200 odd:bg-slate-50/50"
                    >
                      <td className="px-2 py-1 font-mono text-[11px]">
                        {r.event_id}
                      </td>
                      <td className="px-2 py-1">{r.principal}</td>
                      <td className="px-2 py-1">{r.type}</td>
                      <td className="px-2 py-1">
                        ${(r.amount_minor / 100).toFixed(2)}
                      </td>
                      <td className="px-2 py-1 whitespace-nowrap">
                        {fmtTime(r.occurred_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Transcript (duplicates) */}
      <section className="mt-3 rounded-lg border border-slate-300 bg-white">
        <div className="flex items-center justify-between rounded-t-lg bg-slate-50 px-3 py-2">
          <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-700">
            {Icon.table({})} <span>Transcript (duplicates only)</span>
          </div>
          <div className="text-[11px] text-slate-600">
            {dups.length ? `${dups.length} note(s)` : "No duplicates recorded."}
          </div>
        </div>
        <div className="px-3 py-2">
          <div className="overflow-auto rounded-md border border-slate-300">
            <table className="w-full text-left text-[12px]">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-2 py-2">at</th>
                  <th className="px-2 py-2">event_id</th>
                  <th className="px-2 py-2">reason</th>
                </tr>
              </thead>
              <tbody className="text-slate-800">
                {dups.length === 0 ? (
                  <tr>
                    <td className="px-2 py-3 text-slate-500" colSpan={3}>
                      —
                    </td>
                  </tr>
                ) : (
                  dups.map((d, i) => (
                    <tr
                      key={`${d.event_id}-${i}`}
                      className="border-t border-slate-200 odd:bg-slate-50/50"
                    >
                      <td className="px-2 py-1 whitespace-nowrap">
                        {fmtTime(d.at)}
                      </td>
                      <td className="px-2 py-1 font-mono text-[11px]">
                        {d.event_id}
                      </td>
                      <td className="px-2 py-1">{d.reason}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
