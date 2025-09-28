"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import GatewayGuide from "./GatewayGuide";
import { useVGO } from "../vgo/VGOProvider";

/* -------------------- tiny inline icons (no deps) -------------------- */
const I = {
  info: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}>
      <path fill="currentColor" d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm1 15h-2v-6h2v6Zm0-8h-2V7h2v2Z"/>
    </svg>
  ),
  table: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="14" height="14" {...p}>
      <path fill="currentColor" d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5zm2 2v3h14V7H5zm0 5v7h6v-7H5zm8 0v7h6v-7h-6z"/>
    </svg>
  ),
  layers: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}>
      <path fill="currentColor" d="M12 2l9 5-9 5-9-5 9-5zm-9 9l9 5 9-5v5l-9 5-9-5v-5z"/>
    </svg>
  ),
  play: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}>
      <path fill="currentColor" d="M8 5v14l11-7z"/>
    </svg>
  ),
  repeat: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}>
      <path fill="currentColor" d="M7 7h7V4l5 4-5 4V9H7a3 3 0 0 0 0 6h3v2H7a5 5 0 0 1 0-10z"/>
    </svg>
  ),
  upload: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}>
      <path fill="currentColor" d="M12 2l5 5h-3v6h-4V7H7l5-5zM5 18h14v2H5z"/>
    </svg>
  ),
  copy: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}>
      <path fill="currentColor" d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/>
    </svg>
  ),
  code: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}>
      <path fill="currentColor" d="M8.6 16.6L4 12l4.6-4.6L7.2 6l-6 6 6 6 1.4-1.4zm6.8 0L20 12l-4.6-4.6L16.8 6l6 6-6 6-1.4-1.4z"/>
    </svg>
  ),
  reset: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}>
      <path fill="currentColor" d="M17.65 6.35A8 8 0 1 0 20 16h-2a6 6 0 1 1-1.76-4.24L13 15h9V6z"/>
    </svg>
  ),
  key: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="14" height="14" {...p}>
      <path fill="currentColor" d="M14 3a7 7 0 0 0-6.93 8.06L2 16v5h5l2.94-2.94A7 7 0 1 0 14 3Zm0 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z"/>
    </svg>
  ),
  alert: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="15" height="15" {...p}>
      <path fill="currentColor" d="M1 21h22L12 2 1 21zm12-3h-2v2h2v-2zm0-6h-2v5h2v-5z"/>
    </svg>
  ),
  chain: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="14" height="14" {...p}>
      <path fill="currentColor" d="M10.6 13.4a1 1 0 0 0 1.4 1.4l4.95-4.95a3 3 0 0 0-4.24-4.24L10 7.3l1.4 1.4 2.7-2.7a1 1 0 1 1 1.4 1.4L10.6 13.4zM7 10l-2.7 2.7a3 3 0 1 0 4.24 4.24L12 14.5l-1.4-1.4-3.46 3.46a1 1 0 1 1-1.4-1.4L8.4 10z"/>
    </svg>
  ),
};

/* ----------------------------- types & helpers ----------------------------- */

type Source = "Stripe" | "NetSuite" | "SAP Ariba" | "PowerShell";

type EventBody = {
  event_id: string;
  principal_id: string;
  amount_minor: number;
  currency: string;
  type: "order" | "refund";
  occurred_at: string;
  tenant_id?: string;
  bucket_id?: string;
};

type Row = {
  received_at: string;
  idempotency?: string;
  event_id: string;
  principal: string;
  type: "order" | "refund";
  amount: string; // $x.xx
  replayed?: "yes" | "no";
  partition?: number;
  input_hash?: string;
  segment_hash_after?: string;
};

type Reject = { at: string; code: string; detail?: string };

// very small JSON type for canonicalization
type JSONValue =
  | string
  | number
  | boolean
  | null
  | { [k: string]: JSONValue }
  | JSONValue[];

/* narrowers */
const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const toString = (v: unknown): string | undefined =>
  typeof v === "string" ? v : undefined;

const toNumber = (v: unknown): number | undefined =>
  typeof v === "number" && Number.isFinite(v) ? v : undefined;

const fmtMoney = (minor: number) => `$${(minor / 100).toFixed(2)}`;

/* canonical JSON: sorted keys, NFC strings, finite numbers only */
function canonicalJSON(obj: unknown): string {
  const seen = new WeakSet<object>();

  const walk = (x: unknown): JSONValue => {
    if (Array.isArray(x)) return x.map(walk);
    if (isRecord(x)) {
      if (seen.has(x)) return null;
      seen.add(x);
      const out: Record<string, JSONValue> = {};
      for (const k of Object.keys(x).sort()) out[k] = walk(x[k]);
      return out;
    }
    if (typeof x === "number" && Number.isFinite(x)) return x;
    if (typeof x === "string") return x.normalize("NFC");
    if (typeof x === "boolean" || x === null) return x;
    return null;
  };

  return JSON.stringify(walk(obj));
}

async function sha256Hex(s: string): Promise<string> {
  const buf = new TextEncoder().encode(s);
  const dig = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(dig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function modHash(s: string, K: number): Promise<number> {
  const h = await sha256Hex(s);
  const n = parseInt(h.slice(-8), 16);
  return K > 0 ? n % K : 0;
}

/* --------------------------------- UI ---------------------------------- */
type BatchReport = Record<string, unknown> | null;

export default function Gateway() {
  const vgo = useVGO();

  // client-persisted config
  const [booted, setBooted] = useState(false);
  const [windowId, setWindowId] = useState("");
  const [K, setK] = useState(8);

  // writer lease
  const [writerToken, setWriterToken] = useState<string | null>(null);
  const [leaseTTL, setLeaseTTL] = useState<number>(0); // seconds remaining

  // conflict demo
  const [conflictUntil, setConflictUntil] = useState<number>(0);

  // UI state
  const [source, setSource] = useState<Source>("Stripe");
  const [rows, setRows] = useState<Row[]>([]);
  const [rejects, setRejects] = useState<Reject[]>([]);
  const [showCode, setShowCode] = useState(false);
  const [curl, setCurl] = useState("");
  const [showRejects, setShowRejects] = useState(false);

  const lastIdem = useRef<string | null>(null);

  // keep last batch for duplicate retry
  const lastBatchIdem = useRef<string | null>(null);
  const lastBatchLines = useRef<EventBody[] | null>(null);
  const [lastBatchReport, setLastBatchReport] = useState<BatchReport>(null);

  /* Boot + persist */
  useEffect(() => {
    setWindowId(localStorage.getItem("gw:windowId") || new Date().toISOString().slice(0, 10));
    setK(Number(localStorage.getItem("gw:K") || "8"));
    const w = localStorage.getItem("gw:writerToken");
    if (w) {
      setWriterToken(w);
      setLeaseTTL(Number(localStorage.getItem("gw:writerTTL") || "60"));
    }
    setBooted(true);
  }, []);
  useEffect(() => {
    if (booted) localStorage.setItem("gw:windowId", windowId);
  }, [booted, windowId]);
  useEffect(() => {
    if (booted) localStorage.setItem("gw:K", String(K));
  }, [booted, K]);
  useEffect(() => {
    if (!booted) return;
    if (writerToken) {
      localStorage.setItem("gw:writerToken", writerToken);
      localStorage.setItem("gw:writerTTL", String(leaseTTL));
    } else {
      localStorage.removeItem("gw:writerToken");
      localStorage.removeItem("gw:writerTTL");
    }
  }, [booted, writerToken, leaseTTL]);

  /* Hydrate output from server once (prevents auto-reset on nav) */
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch("/api/v1/events", { cache: "no-store" });
        const data: unknown = await r.json();
        if (!alive || !Array.isArray(data)) return;

        const mapped: Row[] = data.map((d: unknown) => {
          const rec = isRecord(d) ? d : {};
          const amountMinor = toNumber(rec["amount_minor"]) ?? 0;
          return {
            received_at: toString(rec["received_at"]) || "",
            idempotency: (toString(rec["idempotency_key"]) ?? toString(rec["idempotency"])) || undefined,
            event_id: toString(rec["event_id"]) || "",
            principal: toString(rec["principal_id"]) || toString(rec["principal"]) || "",
            type: (toString(rec["type"]) === "refund" ? "refund" : "order"),
            amount: fmtMoney(amountMinor),
            replayed: rec["replayed"] ? "yes" : "no",
            partition: typeof rec["partition_id"] === "number" ? (rec["partition_id"] as number) :
              typeof rec["partition"] === "number" ? (rec["partition"] as number) : undefined,
            input_hash: toString(rec["input_hash"]),
            segment_hash_after: toString(rec["segment_hash_after"]),
          };
        });

        setRows(mapped);
      } catch {
        // ignore fetch errors in demo
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  /* Writer lease countdown */
  useEffect(() => {
    if (!writerToken || leaseTTL <= 0) return;
    const id = setInterval(() => {
      setLeaseTTL((s) => {
        if (s <= 1) {
          setWriterToken(null);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [writerToken, leaseTTL]);

  /* Conflict countdown (visual lock for demo) */
  useEffect(() => {
    if (!conflictUntil) return;
    const id = setInterval(() => {
      if (Date.now() >= conflictUntil) {
        setConflictUntil(0);
        clearInterval(id);
      }
    }, 250);
    return () => clearInterval(id);
  }, [conflictUntil]);

  /* Readiness banner (guarded) */
  const ready = rows.length > 0;
  const inConflict = conflictUntil > Date.now();
  const prevReady = useRef<boolean | null>(null);
  useEffect(() => {
    if (prevReady.current === ready) return;
    prevReady.current = ready;
    // We intentionally avoid listing `vgo` to prevent churn loops when the provider updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    vgo.setStatus("gateway", ready ? "Ready" : "Pending");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    vgo.setComplete("gateway", ready);
  }, [ready]);

  function gotoIntake() {
    if (!ready || inConflict) return;
    vgo.setComplete("gateway", true);
    window.dispatchEvent(new CustomEvent("vgo:goto-intake"));
  }

  /* Transcript chain: prev ⟶ next visualization data */
  const chain = useMemo(() => {
    let prev = "0";
    const nodes = rows
      .slice()
      .reverse()
      .map((r) => {
        const next = r.input_hash ? `${prev}|${r.input_hash}` : prev;
        const head = r.input_hash ? next : prev;
        prev = head;
        return { event_id: r.event_id, head: head.slice(0, 16) };
      });
    return nodes.slice(-10);
  }, [rows]);

  /* Tallies + cues */
  const dups = rows.filter((r) => r.replayed === "yes").length;
  const watermark = rows[0]?.received_at || "—";
  const segment = useMemo(() => {
    if (rows.length === 0) return "0x";
    const payload = rows.map((r) => r.input_hash || "").join("|");
    return payload ? `0x${payload.length.toString(16).slice(0, 8)}` : "0x";
  }, [rows]);
  const rejectsCount = rejects.length;

  /* Snippet on demand */
  function buildCurlSnippet(s: Source) {
    const body: EventBody = {
      event_id: `evt-${crypto.randomUUID().slice(0, 8)}`,
      principal_id: "CRE-99001",
      amount_minor: 1230,
      currency: "USD",
      type: "order",
      occurred_at: new Date().toISOString(),
      tenant_id: "TENANT-1",
      bucket_id: "B-001",
    };
    const per: Record<Source, string[]> = {
      Stripe: [
        '-H "Content-Type: application/json"',
        '-H "Idempotency-Key: $(uuidgen)"',
        '-H "X-Stripe-Signature: demo"',
      ],
      NetSuite: [
        '-H "Content-Type: application/json"',
        '-H "Idempotency-Key: $(uuidgen)"',
        '-H "X-NetSuite-Account: 12345"',
      ],
      "SAP Ariba": [
        '-H "Content-Type: application/json"',
        '-H "Idempotency-Key: $(uuidgen)"',
        '-H "X-Ariba-Company: VERIT"',
      ],
      PowerShell: [
        '-H "Content-Type: application/json"',
        '-H "Idempotency-Key: $(New-Guid)"',
      ],
    };
    const gw = [
      `-H "X-Window-Id: ${windowId}"`,
      writerToken ? `-H "X-Writer-Token: ${writerToken}"` : "# add X-Writer-Token",
    ];
    return [
      `curl -X POST "http://localhost:3000/api/v1/events" \\`,
      ...per[s].map((h) => `  ${h} \\`),
      ...gw.map((h) => `  ${h} \\`),
      `  -d '${JSON.stringify(body)}'`,
    ].join("\n");
  }
  function toggleCode() {
    if (!showCode) setCurl(buildCurlSnippet(source));
    setShowCode((v) => !v);
  }
  function copySnippet() {
    const txt = showCode ? curl : buildCurlSnippet(source);
    navigator.clipboard.writeText(txt).catch(() => {});
    if (!showCode) setCurl(txt);
  }

  /* Writer helpers */
  function claimWriter() {
    setWriterToken(crypto.randomUUID());
    setLeaseTTL(60);
  }
  function releaseWriter() {
    setWriterToken(null);
    setLeaseTTL(0);
  }
  function renewWriter() {
    if (writerToken) setLeaseTTL(60);
  }
  function simulateConflict() {
    setRejects((rs) => [
      {
        at: new Date().toLocaleTimeString(),
        code: "WRITER_CONFLICT",
        detail: "Concurrent writer rejected for (partition, window).",
      },
      ...rs,
    ].slice(0, 20));
    setConflictUntil(Date.now() + 5000);
  }

  /* Enrich + append */
  async function enrich(e: EventBody, idem: string, replayed = false): Promise<Row> {
    const canonical = canonicalJSON({ window_id: windowId, ...e });
    const input_hash = await sha256Hex(canonical);
    const partition = await modHash(
      `${e.tenant_id || "TENANT-1"}|${windowId}|${e.bucket_id || "B-001"}`,
      K
    );
    return {
      received_at: new Date().toLocaleTimeString(),
      idempotency: idem,
      event_id: e.event_id,
      principal: e.principal_id,
      type: e.type,
      amount: fmtMoney(e.amount_minor),
      replayed: replayed ? "yes" : "no",
      partition,
      input_hash,
      segment_hash_after: segment,
    };
  }

  /* Actions */
  const disabledSend = !writerToken || leaseTTL <= 0 || !booted || inConflict;
  const btn =
    "inline-flex items-center gap-2 rounded border border-slate-300 bg-slate-50 px-2 py-1 " +
    "text-[12px] text-slate-700 hover:bg-slate-100 whitespace-nowrap " +
    "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 disabled:opacity-90";

  async function sendSample() {
    if (disabledSend) return;
    const idem = crypto.randomUUID();
    lastIdem.current = idem;
    const body: EventBody = {
      event_id: `evt-${crypto.randomUUID().slice(0, 6)}`,
      principal_id: "CRE-99001",
      amount_minor: 1230,
      currency: "USD",
      type: "order",
      occurred_at: new Date().toISOString(),
      tenant_id: "TENANT-1",
      bucket_id: "B-001",
    };
    await fetch("/api/v1/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": idem,
        "X-Window-Id": windowId,
        "X-Writer-Token": writerToken!,
      },
      body: JSON.stringify(body),
    }).catch(() => {});
    const newRow = await enrich(body, idem, false);
    setRows((r) => [newRow, ...r]);
  }

  async function retryDuplicate() {
    if (!writerToken || !lastIdem.current) return;
    const body: EventBody = {
      event_id: `dup-${crypto.randomUUID().slice(0, 6)}`,
      principal_id: "CRE-99001",
      amount_minor: 1230,
      currency: "USD",
      type: "order",
      occurred_at: new Date().toISOString(),
      tenant_id: "TENANT-1",
      bucket_id: "B-001",
    };
    await fetch("/api/v1/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": lastIdem.current!,
        "X-Window-Id": windowId,
        "X-Writer-Token": writerToken!,
      },
      body: JSON.stringify(body),
    }).catch(() => {});
    const dupRow = await enrich(body, lastIdem.current!, true);
    setRows((r) => [dupRow, ...r]);
  }

  async function sendBatch() {
    if (disabledSend) return;
    const idem = crypto.randomUUID();
    lastIdem.current = idem;
    const lines: EventBody[] = [
      {
        event_id: `b-${crypto.randomUUID().slice(0, 6)}`,
        principal_id: "CRE-99001",
        amount_minor: 999,
        currency: "USD",
        type: "order",
        occurred_at: new Date().toISOString(),
        tenant_id: "TENANT-1",
        bucket_id: "B-001",
      },
      {
        event_id: `b-${crypto.randomUUID().slice(0, 6)}`,
        principal_id: "CRE-99002",
        amount_minor: 1230,
        currency: "USD",
        type: "refund",
        occurred_at: new Date(Date.now() + 15_000).toISOString(),
        tenant_id: "TENANT-1",
        bucket_id: "B-001",
      },
    ];
    lastBatchIdem.current = idem;
    lastBatchLines.current = lines;

    await fetch("/api/v1/events/batch", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-ndjson",
        "Idempotency-Key": idem,
        "X-Window-Id": windowId,
        "X-Writer-Token": writerToken!,
      },
      body: lines.map((l) => JSON.stringify(l)).join("\n"),
    })
      .then(async (res) => {
        if (res.status === 202) {
          const j: unknown = await res.json().catch(() => ({}));
          setLastBatchReport((isRecord(j) ? j : {}) as Record<string, unknown>);
        }
      })
      .catch(() => {});

    const enriched = await Promise.all(lines.map((l) => enrich(l, idem, false)));
    setRows((r) => [...enriched.reverse(), ...r]);
  }

  async function retryLastBatch() {
    if (!writerToken || !lastBatchIdem.current || !lastBatchLines.current) return;
    const idem = lastBatchIdem.current;
    const lines = lastBatchLines.current;

    await fetch("/api/v1/events/batch", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-ndjson",
        "Idempotency-Key": idem,
        "X-Window-Id": windowId,
        "X-Writer-Token": writerToken!,
      },
      body: lines.map((l) => JSON.stringify(l)).join("\n"),
    }).catch(() => {});

    const enriched = await Promise.all(lines.map((l) => enrich({ ...l }, idem, true)));
    setRows((r) => [...enriched.reverse(), ...r]);
  }

  function seedDeterministic() {
    const base: EventBody[] = [
      {
        event_id: "evt-7b15t1",
        principal_id: "CRE-99001",
        amount_minor: 1230,
        currency: "USD",
        type: "order",
        occurred_at: "2025-09-18T12:00:00Z",
        tenant_id: "TENANT-1",
        bucket_id: "B-001",
      },
      {
        event_id: "evt-g9a7p9",
        principal_id: "CRE-99004",
        amount_minor: 1638,
        currency: "USD",
        type: "order",
        occurred_at: "2025-09-18T12:00:30Z",
        tenant_id: "TENANT-1",
        bucket_id: "B-001",
      },
    ];
    (async () => {
      const idem = crypto.randomUUID();
      lastIdem.current = idem;
      const out = await Promise.all(base.map((b) => enrich(b, idem, false)));
      setRows((r) => [...out, ...r]);
    })();
  }

  function recordOnly() {
    (async () => {
      const idem = "(transcript-only)";
      const body: EventBody = {
        event_id: `evt-${crypto.randomUUID().slice(0, 6)}`,
        principal_id: "CRE-99001",
        amount_minor: 111,
        currency: "USD",
        type: "order",
        occurred_at: new Date().toISOString(),
        tenant_id: "TENANT-1",
        bucket_id: "B-001",
      };
      const row = await enrich(body, idem, false);
      setRows((r) => [row, ...r]);
    })();
  }

  async function onReset() {
    await fetch("/api/v1/events", { method: "DELETE" }).catch(() => {});
    setRows([]);
    setLastBatchReport(null);
    lastIdem.current = null;
    lastBatchIdem.current = null;
    lastBatchLines.current = null;
  }

  /* ------------------------------- render ------------------------------- */
  return (
    <div className="mx-auto max-w-6xl px-4 pb-10">
      <GatewayGuide />

      {/* Banner */}
      <div
        className={[
          "mb-4 flex items-center justify-between rounded-lg border px-3 py-2 text-[13px]",
          inConflict
            ? "border-amber-300 bg-amber-50 text-amber-700"
            : ready
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-amber-200 bg-amber-50 text-amber-700",
        ].join(" ")}
      >
        <div>
          {inConflict
            ? "Action lane is temporarily locked by a simulated conflicting writer."
            : ready
            ? "Intake is ready. You can continue."
            : "To continue, claim a writer and send at least one event."}
        </div>
        <button
          className={[
            "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[13px] font-medium",
            ready && !inConflict
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-amber-500/60 text-white cursor-not-allowed",
          ].join(" ")}
          disabled={!ready || inConflict}
          onClick={gotoIntake}
        >
          Continue to Intake <span aria-hidden>↦</span>
        </button>
      </div>

      {/* Run config + lease */}
      <section className="mb-3 overflow-hidden rounded-lg border border-slate-200 bg-white">
        <header className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2 text-[12px] font-semibold text-slate-700">
          {I.info({ className: "text-slate-600" })} Run config
          <span className="ml-2 font-normal text-slate-600">
            Window &amp; partitions define routing; writer lease locks the lane.
          </span>
        </header>
        <div className="flex flex-wrap items-center gap-3 p-3 text-[12px]">
          <label className="flex items-center gap-2">
            <span className="text-slate-700">Window</span>
            <input
              value={windowId}
              onChange={(e) => setWindowId(e.target.value)}
              className="rounded-md border border-slate-300 px-2 py-1 text-slate-800 outline-none focus:ring-2 focus:ring-slate-300"
            />
          </label>
          <label className="flex items-center gap-2">
            <span className="text-slate-700">K</span>
            <input
              type="number"
              min={1}
              value={K}
              onChange={(e) => setK(Math.max(1, Number(e.target.value || 1)))}
              className="w-16 rounded-md border border-slate-300 px-2 py-1 text-slate-800 outline-none focus:ring-2 focus:ring-slate-300"
            />
          </label>

          <div className="ml-auto flex items-center gap-2">
            <span className="inline-flex items-center gap-2 text-[12px] text-slate-800">
              {I.key({})}
              <span className="font-semibold">Writer:</span>
              {writerToken ? (
                <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-semibold leading-none text-white">
                  CLAIMED · TTL {String(leaseTTL).padStart(2, "0")}s
                </span>
              ) : (
                <span className="rounded-full bg-slate-300 px-2 py-0.5 text-[11px] font-semibold leading-none text-slate-800">
                  NONE
                </span>
              )}
              {inConflict && (
                <span className="rounded-full bg-rose-600 px-2 py-0.5 text-[11px] font-semibold leading-none text-white">
                  CONFLICT (5s)
                </span>
              )}
            </span>
            {!writerToken ? (
              <button
                className="inline-flex items-center gap-2 rounded border border-slate-300 bg-slate-50 px-2 py-1 text-[12px] text-slate-700 hover:bg-slate-100"
                onClick={claimWriter}
              >
                Claim writer
              </button>
            ) : (
              <>
                <button
                  className="inline-flex items-center gap-2 rounded border border-slate-300 bg-slate-50 px-2 py-1 text-[12px] text-slate-700 hover:bg-slate-100"
                  onClick={renewWriter}
                >
                  Renew
                </button>
                <button
                  className="inline-flex items-center gap-2 rounded border border-slate-300 bg-slate-50 px-2 py-1 text-[12px] text-slate-700 hover:bg-slate-100"
                  onClick={releaseWriter}
                >
                  Release
                </button>
                <button
                  className="inline-flex items-center gap-1 rounded border border-rose-300 bg-rose-50 px-2 py-1 text-[12px] text-rose-700 hover:bg-rose-100"
                  onClick={simulateConflict}
                  title="Simulate a second writer in the same (partition, window) for 5 seconds"
                >
                  {I.alert({})} Simulate conflicting writer
                </button>
              </>
            )}
          </div>
        </div>

        {/* cues row */}
        <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 px-3 py-2 text-[12px] text-slate-700">
          <span className="rounded-full bg-slate-100 px-2 py-0.5">ordered: {rows.length}</span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5">dups: {dups}</span>
          <button
            className="rounded-full bg-slate-100 px-2 py-0.5 hover:bg-slate-200"
            onClick={() => setShowRejects((v) => !v)}
          >
            rejects: {rejectsCount}
          </button>
          <span className="rounded-full bg-slate-100 px-2 py-0.5">WATERMARK: {watermark}</span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5">SEGMENT: {segment}</span>
        </div>

        {/* rejections viewer */}
        {showRejects && (
          <div className="border-t border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-700">
            {rejects.length === 0 ? (
              <div className="text-slate-500">No rejects yet.</div>
            ) : (
              <ul className="space-y-1">
                {rejects.map((r, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="rounded bg-rose-50 px-1.5 py-0.5 text-rose-700">{r.code}</span>
                    <span className="text-slate-500">{r.at}</span>
                    <span>— {r.detail || ""}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>

      {/* Input */}
      <section className="mb-3 overflow-hidden rounded-lg border border-slate-200 bg-white">
        <header className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2">
          <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-700">
            {I.table({ className: "text-slate-600" })} Input
          </div>
          <div className="flex items-center gap-2">
            <button
              className="inline-flex items-center gap-2 rounded border border-slate-300 bg-slate-50 px-2 py-1 text-[12px] text-slate-700 hover:bg-slate-100"
              onClick={copySnippet}
            >
              <I.copy /> Copy snippet
            </button>
            <button
              className="inline-flex items-center gap-2 rounded border border-slate-300 bg-slate-50 px-2 py-1 text-[12px] text-slate-700 hover:bg-slate-100"
              onClick={toggleCode}
            >
              <I.code />
              {showCode ? "Hide code" : "Show code"}
            </button>
          </div>
        </header>
        <div className="px-3 py-2">
          <div className="flex flex-wrap items-center gap-4 text-[13px] text-slate-700">
            {(["Stripe", "NetSuite", "SAP Ariba", "PowerShell"] as Source[]).map((s) => (
              <label key={s} className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="src"
                  checked={source === s}
                  onChange={() => setSource(s)}
                  className="h-3.5 w-3.5"
                />
                <span>{s}</span>
              </label>
            ))}
          </div>
          {showCode && (
            <pre className="mt-2 max-h-44 overflow-auto rounded-md border border-slate-200 bg-slate-50 p-2 text-[12px] leading-[1.3] text-slate-800">
{curl}
            </pre>
          )}
        </div>
      </section>

      {/* Actions */}
      <section className="mb-3 overflow-hidden rounded-lg border border-slate-200 bg-white">
        <header className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2">
          <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-700">
            {I.layers({ className: "text-slate-600" })} Actions
          </div>
          <button
            className="inline-flex items-center gap-2 rounded border border-slate-300 bg-slate-50 px-2 py-1 text-[12px] text-slate-700 hover:bg-slate-100"
            onClick={onReset}
          >
            {I.reset({})} Reset
          </button>
        </header>
        <div className="overflow-x-auto">
          <div className="flex items-center gap-2 whitespace-nowrap px-3 py-2">
            <button className={btn} onClick={sendSample} disabled={disabledSend} title="POST /api/v1/events">
              {I.play({})} Send sample
            </button>
            <button
              className={btn}
              onClick={retryDuplicate}
              disabled={!writerToken || !lastIdem.current || inConflict}
              title="Reuse last Idempotency-Key"
            >
              {I.repeat({})} Retry duplicate
            </button>
            <button className={btn} onClick={sendBatch} disabled={disabledSend} title="POST NDJSON to /api/v1/events/batch">
              {I.upload({})} Send batch
            </button>
            <button
              className={btn}
              onClick={retryLastBatch}
              disabled={!writerToken || !lastBatchReport || !lastBatchIdem.current || inConflict}
              title="Resubmit last batch with same Idempotency-Key"
            >
              {I.repeat({})} Retry last batch
            </button>
            <button className={btn} onClick={seedDeterministic} disabled={inConflict} title="Load predictable rows">
              {I.info({})} Seed deterministic set
            </button>
            <button
              className={btn}
              onClick={recordOnly}
              disabled={inConflict}
              title="Append Tier-0-like entry without API"
            >
              {I.chain({})} Record only (transcript)
            </button>
          </div>
        </div>
      </section>

      {/* Output + transcript chain panel */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_280px]">
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <header className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2 text-[12px] font-semibold text-slate-700">
            {I.table({ className: "text-slate-600" })} Output
          </header>
          <div className="px-3 py-2">
            <div className="overflow-auto">
              <table className="min-w-full text-left text-[12px]">
                <thead className="text-slate-500">
                  <tr className="[&>th]:py-1.5 [&>th]:pr-4">
                    <th>received_at</th>
                    <th>idempotency</th>
                    <th>event_id</th>
                    <th>principal</th>
                    <th>type</th>
                    <th>amount</th>
                    <th>partition</th>
                    <th>input_hash</th>
                    <th>segment_hash</th>
                    <th>replayed?</th>
                  </tr>
                </thead>
                <tbody className="text-slate-800">
                  {rows.length === 0 ? (
                    <tr>
                      <td className="py-2 text-slate-500" colSpan={10}>
                        No rows yet. Use the control panel to send requests.
                      </td>
                    </tr>
                  ) : (
                    rows.map((r, i) => (
                      <tr key={i} className="border-t border-slate-100 align-top [&>td]:py-1.5 [&>td]:pr-4">
                        <td>{r.received_at}</td>
                        <td className="text-slate-600">{r.idempotency || "—"}</td>
                        <td className="font-mono">{r.event_id}</td>
                        <td>{r.principal}</td>
                        <td>{r.type}</td>
                        <td>{r.amount}</td>
                        <td className="text-slate-600">{r.partition ?? "—"}</td>
                        <td className="text-slate-600">{r.input_hash ? r.input_hash.slice(0, 12) : "—"}</td>
                        <td className="text-slate-600">{r.segment_hash_after || "—"}</td>
                        <td>{r.replayed}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <aside className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <header className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2 text-[12px] font-semibold text-slate-700">
            {I.chain({ className: "text-slate-600" })} Transcript chain
          </header>
          <div className="px-3 py-2 text-[12px] text-slate-700">
            {chain.length === 0 ? (
              <div className="text-slate-500">Nothing yet — send an event to see the chain grow.</div>
            ) : (
              <ul className="space-y-2">
                {chain.map((n, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="h-[6px] w-[6px] rounded-full bg-slate-400" />
                    <span className="font-mono text-slate-600">{n.head}</span>
                    <span className="text-slate-400">←</span>
                    <span className="truncate">{n.event_id}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
