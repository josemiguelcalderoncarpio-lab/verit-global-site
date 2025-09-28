"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useVGO } from "../vgo/VGOProvider";
import SealGuide from "./SealGuide";

/* ---------------- Icons (inline, monochrome) ---------------- */
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
  Seal: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}>
      <path fill="currentColor" d="M12 2l3 3 4-.5-1 3.9 2.7 2.7-3.9 1 -.5 4-3-3-3 3-.5-4-3.9-1L6 8.4 5 4.5 9 5l3-3z"/>
    </svg>
  ),
  Eye: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}>
      <path fill="currentColor" d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
    </svg>
  ),
  EyeOff: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}>
      <path fill="currentColor" d="M2 4.27 3.28 3 21 20.72 19.73 22l-2.3-2.29C15.93 20.57 14.03 21 12 21 5 21 2 14 2 14s1.16-2.48 3.44-4.77L2 4.27zM12 7a5 5 0 0 1 5 5c0 .58-.1 1.13-.3 1.64L13.36 10.3c.5-.2 1.06-.3 1.64-.3a3 3 0 0 1 3 3c0 .58-.1 1.13-.3 1.64L16.73 16 8 7.27A5 5 0 0 1 12 7zM12 3c7 0 10 7 10 7s-.62 1.31-1.83 2.83l-1.42-1.42C19.56 9.95 20 9 20 9s-3-7-8-7c-2.03 0-3.93.43-5.43 1.29L5.8 4.86C7.27 4.29 9.47 3 12 3z"/>
    </svg>
  ),
  Download: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}>
      <path fill="currentColor" d="M5 20h14v-2H5v2zM11 4h2v7h3l-4 4-4-4h3V4z"/>
    </svg>
  ),
  Copy: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}>
      <path fill="currentColor" d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14h13a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/>
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
      aria-label={typeof children === "string" ? String(children) : undefined}
      className={`${base} ${tone} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      disabled={disabled}
      {...rest}
    >
      {leftIcon}
      {children}
    </button>
  );
};

const Chip: React.FC<{ children: React.ReactNode; tone?: "ok" | "warn" | "muted" | "bad" }> = ({ children, tone = "muted" }) => {
  const t =
    tone === "ok"
      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
      : tone === "warn"
      ? "border-amber-300 bg-amber-50 text-amber-700"
      : tone === "bad"
      ? "border-rose-300 bg-rose-50 text-rose-700"
      : "border-slate-300 bg-slate-100 text-slate-700";
  return <span className={`inline-flex items-center rounded-full border px-2 py-[2px] text-[11px] ${t}`}>{children}</span>;
};

/* ---------------- Storage keys & helpers ---------------- */
const KEY_CARRY = "vgos:carry";
const KEY_POLICY = "vgos:policy";
const KEY_ACCUM  = "vgos:accumulate";
const KEY_ORDER  = "vgos:ordered";
const KEY_SEAL   = "vgos:seal";

const KEY_WATERMARK = "vgos:intake:watermark";
const KEY_FOLD_DESC = "vgos:order:fold_desc";
const KEY_TIER0_ROOT = "vgos:transcript:tier0:root";
const KEY_CARRY_LEDGER = "vgos:transcript:tier2:carry";

/* ---------------- Types ---------------- */
type CarrySave = { rows: { principal: string; final_minor: number }[]; target_total_minor: number };
type PolicyRow = { principal: string; decision: "ALLOW" | "HOLD" };
type OrderedRow = { principal: string; type: string; amount_minor: number; occurred_at?: string; id?: string };

type FinalRow = { principal: string; final_minor: number };
type SealSignature = { signer_id: string; alg: string; domain: string; signature: string };
type Tier0Root = {
  version: string;
  manifest_hash: string;
  segments?: { carry_ledger_count?: number };
  watermark?: unknown;
  fold_order_desc?: string[];
  outputs_digest: string;
  window?: { key?: string };
  materialized_at?: string;
};
type SealDigest = {
  version: "v1.0.0";
  window: { key: string };
  counts: { events: number; principals: number; eligible: number };
  targets: { target_total_minor: number; sum_after_carry_minor: number; remainder_minor: number };
  final: FinalRow[];
  sources: { orderedHash: string };
  carryFingerprint: string;
  tier0_root: Tier0Root;
  idempotency: { windowKey: string; sealedAt: string };
  sealHash: string;
  signature: SealSignature;
};

type VGOExt = {
  unlock?: (k: string) => void;
  setActive?: (k: string) => void;
  setStatus?: (k: string, s: string) => void;
  setComplete?: (k: string, done: boolean) => void;
};

function readJSON<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const s = sessionStorage.getItem(key) ?? localStorage.getItem(key);
    return s ? (JSON.parse(s) as T) : null;
  } catch {
    return null;
  }
}
const money = (minor: number) => `$${(minor / 100).toFixed(2)}`;

/* ---------------- Stable stringify & hashing ---------------- */
function stableStringify(obj: unknown): string {
  const seen = new WeakSet<object>();
  const stringify = (x: unknown): unknown => {
    if (x && typeof x === "object") {
      const o = x as Record<string, unknown>;
      if (seen.has(o)) return null;
      seen.add(o);
      if (Array.isArray(o)) return o.map(stringify);
      const out: Record<string, unknown> = {};
      Object.keys(o)
        .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
        .forEach((k) => {
          out[k] = stringify(o[k]);
        });
      return out;
    }
    if (typeof x === "number" && !Number.isFinite(x)) return String(x);
    return x;
  };
  return JSON.stringify(stringify(obj));
}
async function sha256Hex(input: string): Promise<string> {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(input));
  const bytes = Array.from(new Uint8Array(buf));
  return "0x" + bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
}
/* demo signature */
async function devSign(domain: string, canonicalDigest: string) {
  const payload = `${domain}|${canonicalDigest}`;
  const sig = await sha256Hex(payload);
  return { signer_id: "demo-dev", alg: "SHA-256", domain, signature: sig };
}

/* ---------------- Component ---------------- */
export default function SealStep() {
  const router = useRouter();
  const vgo = useVGO() as VGOExt;

  const [carry, setCarry] = React.useState<CarrySave | null>(null);
  const [policy, setPolicy] = React.useState<PolicyRow[] | null>(null);
  const [ordered, setOrdered] = React.useState<OrderedRow[] | null>(null);

  const [sealed, setSealed] = React.useState<boolean>(false);
  const [sealHash, setSealHash] = React.useState<string | null>(null);
  const [digest, setDigest] = React.useState<SealDigest | null>(null);
  const [showDigest, setShowDigest] = React.useState<boolean>(true);

  const [root, setRoot] = React.useState<Tier0Root | null>(null);
  const [rootOpen, setRootOpen] = React.useState<boolean>(false);
  const [sigOk, setSigOk] = React.useState<boolean>(false);
  const [invariantBad, setInvariantBad] = React.useState<boolean>(false);

  /* ---------- helpers ---------- */
  const computeCarryFingerprint = React.useCallback(async (c: CarrySave | null) => {
    if (!c) return null;
    return await sha256Hex(stableStringify({ rows: c.rows, target_total_minor: c.target_total_minor }));
  }, []);

  const loadAll = React.useCallback(async () => {
    const c = readJSON<CarrySave>(KEY_CARRY);
    const p = readJSON<PolicyRow[]>(KEY_POLICY);
    const o = readJSON<OrderedRow[]>(KEY_ORDER);
    setCarry(c); setPolicy(p); setOrdered(o);

    const prev = readJSON<SealDigest>(KEY_SEAL);
    if (prev?.sealHash) {
      const currentFp = await computeCarryFingerprint(c);
      const prevFp = prev.carryFingerprint || null;
      const matches = Boolean(currentFp && prevFp && currentFp === prevFp);
      if (matches) { setSealed(true); setSealHash(prev.sealHash); setDigest(prev); }
      else { setSealed(false); setSealHash(null); setDigest(null); }
    } else { setSealed(false); setSealHash(null); setDigest(null); }

    const r = readJSON<Tier0Root>(KEY_TIER0_ROOT);
    setRoot(r ?? null);
  }, [computeCarryFingerprint]);

  React.useEffect(() => { void loadAll(); }, [loadAll]);

  React.useEffect(() => {
    const onCarryReady = (_e: Event) => { void loadAll(); };
    const onStorage = (e: StorageEvent) => {
      if (!e.key) return;
      if ([KEY_CARRY, KEY_POLICY, KEY_ACCUM, KEY_ORDER, KEY_SEAL, KEY_TIER0_ROOT].includes(e.key)) void loadAll();
    };
    window.addEventListener("vgos:carry-ready", onCarryReady as EventListener);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("vgos:carry-ready", onCarryReady as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, [loadAll]);

  /* ---------- derived ---------- */
  const rows: FinalRow[] = carry?.rows ?? [];
  const finalsSum = rows.reduce((s, r) => s + (r?.final_minor ?? 0), 0);
  const principals = rows.length;
  const target = carry?.target_total_minor ?? 0;
  const remainder = target - finalsSum;

  const eventsCount = (ordered?.length ?? 0);
  const eligibleCount = React.useMemo(() => (policy ?? []).filter(p => p.decision === "ALLOW").length, [policy]);
  const canSeal = principals > 0 && target > 0 && remainder === 0 && !sealed;

  /* ---------- dev integrity checks ---------- */
  React.useEffect(() => {
    const isDev = typeof process !== "undefined" && process.env.NODE_ENV !== "production";
    if (!isDev) return;
    let bad = false;

    if (digest?.targets) {
      const a = Number(digest.targets.sum_after_carry_minor ?? NaN);
      const b = Number(finalsSum);
      const c = Number(digest.targets.remainder_minor ?? NaN);
      if (!(Number.isFinite(a) && a === b)) { console.warn("[seal] invariant: sum_after_carry_minor mismatch", { a, b }); bad = true; }
      if (!(Number.isFinite(c) && c === 0)) { console.warn("[seal] invariant: remainder not zero", { c }); bad = true; }
    }
    setInvariantBad(bad);

    // signature sanity
    (async () => {
      if (!digest?.signature || !digest?.sealHash) { setSigOk(false); return; }
      const expected = await sha256Hex(`vgos:seal:v1|${digest.sealHash}`);
      const ok = expected === digest.signature.signature;
      if (!ok) console.warn("[seal] signature sanity failed", { expected, actual: digest.signature.signature });
      setSigOk(ok);
    })();
  }, [digest, finalsSum]);

  /* ---------- build + persist ---------- */
  async function buildAndPersistSeal(): Promise<SealDigest | null> {
    if (!carry) return null;

    const times = (ordered ?? [])
      .map((o) => (o.occurred_at ? Date.parse(o.occurred_at) : NaN))
      .filter((n): n is number => Number.isFinite(n));
    const min = times.length ? new Date(Math.min(...times)).toISOString().slice(0, 10) : null;
    const max = times.length ? new Date(Math.max(...times)).toISOString().slice(0, 10) : null;
    const windowKey = min && max ? `${min}..${max}` : "window:not-specified";

    const orderedHash = await sha256Hex(stableStringify(ordered ?? []));
    const carryFingerprint = await sha256Hex(stableStringify({ rows: carry.rows, target_total_minor: carry.target_total_minor }));

    const outputs_digest = await sha256Hex(
      stableStringify({
        finals: carry.rows.map((r) => ({ principal: r.principal, final_minor: r.final_minor })),
        target_total_minor: carry.target_total_minor,
      })
    );

    const fold_order_desc = readJSON<string[]>(KEY_FOLD_DESC) ?? ["bucket_id asc", "partition_id asc"];
    const watermark: unknown = readJSON<unknown>(KEY_WATERMARK) ?? null;

    const manifest_hash = await sha256Hex(
      stableStringify({
        orderedHash,
        carryFingerprint,
        outputs_digest,
      })
    );

    const ledgerCount = (() => {
      try {
        const s = sessionStorage.getItem(KEY_CARRY_LEDGER) ?? "[]";
        const arr = JSON.parse(s);
        return Array.isArray(arr) ? arr.length : 0;
      } catch { return 0; }
    })();

    const tier0_root: Tier0Root = {
      version: "v1.0.0",
      manifest_hash,
      segments: { carry_ledger_count: ledgerCount },
      watermark,
      fold_order_desc,
      outputs_digest,
      window: { key: windowKey },
      materialized_at: new Date().toISOString(),
    };

    const digestObj = {
      version: "v1.0.0" as const,
      window: { key: windowKey },
      counts: { events: (ordered?.length ?? 0), principals, eligible: eligibleCount },
      targets: {
        target_total_minor: carry.target_total_minor,
        sum_after_carry_minor: finalsSum,
        remainder_minor: target - finalsSum,
      },
      final: carry.rows.map((r) => ({ principal: r.principal, final_minor: r.final_minor })),
      sources: { orderedHash },
      carryFingerprint,
      tier0_root,
      idempotency: { windowKey, sealedAt: new Date().toISOString() },
    };

    const canonical = stableStringify(digestObj);
    const sealHash = await sha256Hex(canonical);
    const signature = await devSign("vgos:seal:v1", sealHash);

    const sealedPayload: SealDigest = { ...digestObj, sealHash, signature };

    try {
      const s = JSON.stringify(sealedPayload);
      sessionStorage.setItem(KEY_SEAL, s);
      localStorage.setItem(KEY_SEAL, s);
      const rootStr = JSON.stringify(tier0_root);
      sessionStorage.setItem(KEY_TIER0_ROOT, rootStr);
      localStorage.setItem(KEY_TIER0_ROOT, rootStr);
    } catch { /* ignore */ }

    return sealedPayload;
  }

  /* ---------- actions ---------- */
  const onSeal = async () => {
    if (!(principals > 0 && target > 0 && remainder === 0) || sealed) return;
    const payload = await buildAndPersistSeal();
    if (!payload) return;
    setDigest(payload);
    setSealHash(payload.sealHash);
    setSealed(true);
    setRoot(readJSON<Tier0Root>(KEY_TIER0_ROOT) ?? null);
    try { window.dispatchEvent(new CustomEvent("vgos:seal-ready")); } catch { /* ignore */ }
  };

  const downloadJSON = () => {
    if (!digest || !sealHash) return;
    const windowKey = digest?.window?.key || "window";
    const name = `vgos-seal-${String(windowKey).replace(/[^\w.-]+/g, "_")}-${sealHash.slice(2, 10)}.json`;
    const blob = new Blob([JSON.stringify(digest, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };

  const copyHash = async () => { if (sealHash) { try { await navigator.clipboard.writeText(sealHash); } catch { /* ignore */ } } };
  const copyManifest = async () => { if (root?.manifest_hash) { try { await navigator.clipboard.writeText(root.manifest_hash); } catch { /* ignore */ } } };
  const copyOutputs = async () => {
    const source: FinalRow[] = (digest?.final as FinalRow[] | undefined) ?? rows;
    const finals = source.map((r) => ({ principal: r.principal, final_minor: r.final_minor }));
    try { await navigator.clipboard.writeText(JSON.stringify(finals, null, 2)); } catch { /* ignore */ }
  };
  const copyRootJSON = async () => { if (root) { try { await navigator.clipboard.writeText(JSON.stringify(root, null, 2)); } catch { /* ignore */ } } };

  const reopen = async () => {
    try { sessionStorage.removeItem(KEY_SEAL); localStorage.removeItem(KEY_SEAL); } catch { /* ignore */ }
    setSealed(false); setSealHash(null); setDigest(null); setSigOk(false); setInvariantBad(false);
    try { localStorage.removeItem("vgomini:navigate"); } catch { /* ignore */ }
  };

  /* ---------- UI ---------- */
  const Banner: React.FC = () => {
    const ok = sealed;
    return (
      <div className={`mb-3 flex items-center justify-between rounded-lg border px-3 py-2 text-[13px] ${
        ok ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"
      }`}>
        <div className="flex items-center gap-2">
          {ok ? <I.Check/> : <I.Alert/>}
          <span>{ok ? "Seal is ready. Continue to Acceptance." : "To continue, load from Carry and pass validations to enable sealing."}</span>
        </div>
        <div className="flex items-center gap-2">
          <Chip tone={root ? "ok" : "muted"}>root: {root ? "✓" : "—"}</Chip>
          <Chip tone={sealed && sigOk ? "ok" : sealed ? "warn" : "muted"}>sig: {sealed ? (sigOk ? "✓" : "?") : "—"}</Chip>
          <button
            type="button"
            className={[
              "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[13px] font-medium",
              ok ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-amber-500/60 text-white cursor-not-allowed",
            ].join(" ")}
            disabled={!ok}
            onClick={() => {
              if (!ok) return;
              vgo.unlock?.("acceptance");
              vgo.setActive?.("acceptance");
              try { window.dispatchEvent(new CustomEvent("vgo:goto-acceptance")); } catch { /* ignore */ }
              try { router.replace("/vgomini"); } catch { /* ignore */ }
            }}
          >
            Continue to Acceptance <span aria-hidden>↦</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-6xl">
      {/* Field guide */}
      <section className="mb-3 rounded-lg border border-slate-300 bg-white">
        <header className="flex items-center gap-2 rounded-t-lg bg-slate-100 px-3 py-2">
          <span className="text-[12px] font-semibold tracking-wide text-slate-700">Seal — field guide</span>
        </header>
        <div className="max-h-36 overflow-y-auto px-3 py-3">
          <SealGuide />
        </div>
      </section>

      <Banner />

      {/* Input */}
      <Section
        title="Input (from Carry / Policy)"
        right={
          <div className="flex flex-wrap items-center gap-2">
            <Chip>events: {eventsCount}</Chip>
            <Chip>principals: {principals}</Chip>
            <Chip>eligible: {eligibleCount}</Chip>
            <Chip tone={remainder === 0 ? "ok" : "warn"}>remainder (¢): {remainder}</Chip>
            <Chip>target: {money(target)}</Chip>
            <Chip tone={sealed ? "ok" : "muted"}>{sealed ? "sealed ✓" : "not sealed"}</Chip>
            <Chip tone={root ? "ok" : "muted"}>root: {root ? "✓" : "—"}</Chip>
            <Chip tone={sealed && sigOk ? "ok" : sealed ? "warn" : "muted"}>sig: {sealed ? (sigOk ? "✓" : "?") : "—"}</Chip>
          </div>
        }
      >
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Button variant="primary" leftIcon={<I.CloudDown />} onClick={() => void loadAll()}>Get from Carry</Button>
        </div>

        <div className="max-h-56 overflow-auto">
          <table className="min-w-[700px] w-full text-[12px]">
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
                  <td className="px-3 py-3" colSpan={3}>No data. Click <strong>Get from Carry</strong>.</td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.principal} className="border-top border-slate-200 [&>td]:px-3 [&>td]:py-1.5">
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
                  <td>Σ</td>
                  <td>{finalsSum}</td>
                  <td>{money(finalsSum)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </Section>

      {/* Actions */}
      <Section
        title="Actions"
        right={
          <div className="flex flex-wrap items-center gap-2">
            <Chip tone={remainder === 0 ? "ok" : "warn"}>remainder (¢): {remainder}</Chip>
            <Chip>target: {money(target)}</Chip>
            <Chip tone={sealed && sigOk ? "ok" : sealed ? "warn" : "muted"}>sig: demo-dev/SHA-256 {sealed ? (sigOk ? "✓" : "?") : "—"}</Chip>
            {invariantBad && <Chip tone="bad">invariant</Chip>}
            <Button leftIcon={<I.RotateCcw />} onClick={() => void reopen()} disabled={!sealed}>Reopen</Button>
          </div>
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          <Button leftIcon={<I.Seal />} variant="primary" onClick={() => void onSeal()} disabled={!canSeal}>
            Seal
          </Button>
          <Button leftIcon={<I.Download />} onClick={downloadJSON} disabled={!sealed || !digest}>Download JSON</Button>
          <Button leftIcon={<I.Copy />} onClick={copyHash} disabled={!sealed || !sealHash}>Copy hash</Button>
          <Button leftIcon={<I.Copy />} onClick={copyOutputs} disabled={!rows.length && !digest}>Copy outputs JSON</Button>
          <Button leftIcon={<I.Copy />} onClick={copyManifest} disabled={!root?.manifest_hash}>Copy manifest hash</Button>
          <Button leftIcon={showDigest ? <I.EyeOff /> : <I.Eye />} onClick={() => setShowDigest(v => !v)}>
            {showDigest ? "Hide digest" : "Show digest"}
          </Button>
        </div>
      </Section>

      {/* Output (validations & digest) */}
      <Section
        title="Output (validations & digest)"
        right={
          <div className="flex flex-wrap items-center gap-2">
            <Chip tone={principals > 0 ? "ok" : "warn"}>finals: {principals}</Chip>
            <Chip tone={target > 0 ? "ok" : "warn"}>target: {money(target)}</Chip>
            <Chip tone={remainder === 0 ? "ok" : "warn"}>remainder (¢): {remainder}</Chip>
            {sealHash ? <Chip tone="ok">hash: {sealHash.slice(0, 14)}…</Chip> : <Chip>hash: —</Chip>}
          </div>
        }
      >
        {showDigest ? (
          <pre className="max-h-72 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-[12px] leading-5 text-slate-800">
{JSON.stringify(digest ?? { hint: "Seal to generate canonical digest…" }, null, 2)}
          </pre>
        ) : (
          <div className="text-[12px] text-slate-600">Digest hidden.</div>
        )}
      </Section>

      {/* Transcript root (Tier0) — collapsible */}
      <Section
        title="Transcript root (Tier0)"
        right={
          <div className="flex items-center gap-2">
            <Chip tone={root ? "ok" : "muted"}>{root ? "root ✓ saved" : "root: —"}</Chip>
            <Button onClick={() => setRootOpen(o => !o)}>{rootOpen ? "Collapse" : "Expand"}</Button>
            <Button leftIcon={<I.Copy />} onClick={copyRootJSON} disabled={!root}>Copy root JSON</Button>
          </div>
        }
      >
        {rootOpen && root ? (
          <div className="text-[12px]">
            <div className="mb-2 grid grid-cols-1 gap-2 md:grid-cols-2">
              <div className="rounded-md border border-slate-200 bg-slate-50 p-2">
                <div className="font-semibold">manifest_hash</div>
                <div className="font-mono break-all">{root.manifest_hash ?? "—"}</div>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-2">
                <div className="font-semibold">outputs_digest</div>
                <div className="font-mono break-all">{root.outputs_digest ?? "—"}</div>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-2">
                <div className="font-semibold">carry_ledger_count</div>
                <div className="font-mono">{root?.segments?.carry_ledger_count ?? 0}</div>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-2">
                <div className="font-semibold">fold_order_desc</div>
                <div className="font-mono break-all">{Array.isArray(root?.fold_order_desc) ? root.fold_order_desc.join(", ") : "—"}</div>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-2">
                <div className="font-semibold">window.key</div>
                <div className="font-mono">{root?.window?.key ?? "—"}</div>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-2">
                <div className="font-semibold">materialized_at</div>
                <div className="font-mono">{root?.materialized_at ?? "—"}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-[12px] text-slate-600">{root ? "Collapsed." : "No root saved yet. Seal to generate a root."}</div>
        )}
      </Section>
    </div>
  );
}
