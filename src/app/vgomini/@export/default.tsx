"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import ExportGuide from "./ExportGuide";

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
  Check: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}>
      <path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/>
    </svg>
  ),
  Alert: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}>
      <path fill="currentColor" d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
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
      {right ? <div className="flex items-center gap-2 text-[12px] text-slate-700">{right}</div> : null}
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

/* ---------------- Keys & types ---------------- */
const KEY_SEAL   = "vgos:seal";
const KEY_ACCEPT = "vgos:acceptance";
const KEY_ACCEPT_FALLBACKS = ["vgos:accept", "vgos:acceptance:state"];
const KEY_HEADER = "vgos:acceptance:header";
const KEY_EXPORT = "vgos:export";

type Sealed = {
  sealHash: string;
  window?: { key?: string };
  targets?: { target_total_minor?: number; sum_after_carry_minor?: number };
  final_after?: { principal: string; cents: number }[];
  final?: { principal: string; final_minor: number }[];
};

type AcceptanceHeader = {
  window_id: string;
  policy_version: string;
  outputs_digest: string;
  quorum: number;
  freshness_s: number;
  expiry?: string | null;
};

type Acceptance = {
  acceptanceId: string;
  decision?: string; // normalize below
  sealedHash?: string;
  signature: string;
  windowKey?: string;
  target_total_minor?: number;
  sum_final_minor?: number;
  finals?: Array<{ principal: string; cents: number } | { principal: string; final_minor: number }>;
  header?: Partial<AcceptanceHeader>;
};

type ExportManifest = {
  version: string;
  created_at: string;
  window_key: string;
  sealHash: string;
  acceptanceId: string;
  includeHoldInBooks: boolean;
  providerBatchId?: string;
  header?: Partial<AcceptanceHeader>;
  totals: { allow_sum_minor: number; all_sum_minor: number; principals: number };
  filelist: { name: string; bytes: number; sha256: string }[];
};

/* ---------------- Utils ---------------- */
function readJSON<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const s = sessionStorage.getItem(key) ?? localStorage.getItem(key);
    return s ? (JSON.parse(s) as T) : null;
  } catch { return null; }
}
const money = (minor: number) => `$${(minor / 100).toFixed(2)}`;

async function sha256Hex(input: string): Promise<string> {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(input));
  const bytes = Array.from(new Uint8Array(buf));
  return "0x" + bytes.map(b => b.toString(16).padStart(2, "0")).join("");
}

/* Robust finals coercion (handles string/alternate field) */
function coerceFinals(rows: Acceptance["finals"]): { principal: string; cents: number }[] {
  if (!Array.isArray(rows)) return [];
  return rows.map((r) => {
    const obj = r as Record<string, unknown>;
    const principal =
      typeof obj.principal === "string"
        ? obj.principal
        : String(obj.principal ?? "");
    const centsRaw =
      typeof obj.cents === "number"
        ? obj.cents
        : typeof obj.cents === "string"
        ? Number(obj.cents)
        : typeof obj.final_minor === "number"
        ? obj.final_minor
        : typeof obj.final_minor === "string"
        ? Number(obj.final_minor)
        : 0;
    const cents = Number.isFinite(Number(centsRaw)) ? Number(centsRaw) : 0;
    return { principal, cents };
  });
}

function normalizeDecision(a: Acceptance | null): "ALLOW" | "HOLD" | null {
  if (!a) return null;
  const raw = (a.decision ?? "").toString().toUpperCase();
  if (raw === "ALLOW" || raw === "HOLD") return raw;
  const finals = coerceFinals(a.finals);
  return finals.length > 0 ? "ALLOW" : "HOLD";
}

/* ---------------- Component ---------------- */
export default function ExportStep() {
  const router = useRouter();

  const [seal, setSeal] = React.useState<Sealed | null>(null);
  const [accept, setAccept] = React.useState<(Acceptance & { decision: "ALLOW" | "HOLD" }) | null>(null);
  const [header, setHeader] = React.useState<AcceptanceHeader | null>(null);
  const [exportManifest, setExportManifest] = React.useState<ExportManifest | null>(null);

  const [invBad, setInvBad] = React.useState(false);

  const finalsFromSeal =
    (seal?.final_after && seal.final_after.map(x => ({ principal: x.principal, cents: Number(x.cents || 0) }))) ||
    (seal?.final && seal.final.map(x => ({ principal: x.principal, cents: Number(x.final_minor || 0) }))) ||
    [];

  const finalsFromAcceptanceOnly = coerceFinals(accept?.finals);
  const finalsFromAcceptance = finalsFromAcceptanceOnly.length > 0 ? finalsFromAcceptanceOnly : finalsFromSeal;

  const allowSum = finalsFromAcceptance.reduce((s, r) => s + r.cents, 0);
  const allSum = allowSum;
  const principals = finalsFromAcceptance.length;

  const windowKey = accept?.windowKey || seal?.window?.key || "window:not-specified";
  const sealHash = seal?.sealHash || "";
  const acceptanceId = accept?.acceptanceId || "";
  const acceptanceMatchesSeal = !!(accept && seal && accept.sealedHash === seal.sealHash);

  const [includeHoldInBooks, setIncludeHoldInBooks] = React.useState<boolean>(true);
  const [providerBatchId, setProviderBatchId] = React.useState<string>("");

  const ready =
    !!exportManifest &&
    exportManifest.sealHash === sealHash &&
    exportManifest.acceptanceId === acceptanceId;

  const computeInv = React.useCallback((m: ExportManifest | null) => {
    if (!m) return setInvBad(false);
    const present = m.filelist.filter(f => typeof f.sha256 === "string" && f.sha256.length > 0).length;
    const bad = present !== m.filelist.length;
    if (process.env.NODE_ENV !== "production") setInvBad(bad); else setInvBad(false);
  }, []);

  // Load snapshots (robust: fallbacks, uppercase decisions, infer when missing)
  const loadAll = React.useCallback(() => {
    const s = readJSON<Sealed>(KEY_SEAL);

    let a: Acceptance | null =
      readJSON<Acceptance>(KEY_ACCEPT) ??
      KEY_ACCEPT_FALLBACKS.map(k => readJSON<Acceptance>(k)).find(Boolean) ??
      null;

    // Patch missing sealedHash from seal (for matching)
    if (a && !a.sealedHash && s?.sealHash) a = { ...a, sealedHash: s.sealHash };

    // Normalize decision
    const dec = normalizeDecision(a);
    const aNorm = a && dec ? { ...a, decision: dec } as Acceptance & { decision: "ALLOW" | "HOLD" } : null;

    // Header: explicit key or acceptance.header
    const h =
      readJSON<AcceptanceHeader>(KEY_HEADER) ??
      (aNorm?.header as AcceptanceHeader | undefined) ??
      null;

    const m = readJSON<ExportManifest>(KEY_EXPORT);

    setSeal(s ?? null);
    setAccept(aNorm);
    setHeader(h ?? null);
    setExportManifest(m ?? null);
    computeInv(m ?? null);

    if ((!s || !aNorm) && (window as unknown as { __vgos_clicked_get_from_acceptance__?: boolean }).__vgos_clicked_get_from_acceptance__) {
      console.warn("[export] nothing to load from storage yet");
      alert("No Acceptance/Seal found yet. Commit Acceptance first.");
    }
  }, [computeInv]);

  React.useEffect(() => { loadAll(); }, [loadAll]);

  React.useEffect(() => {
    const reload = () => loadAll();
    const onStorage = (e: StorageEvent) => {
      if (!e.key) return;
      if ([KEY_SEAL, KEY_ACCEPT, KEY_EXPORT, KEY_HEADER, ...KEY_ACCEPT_FALLBACKS].includes(e.key)) loadAll();
    };
    window.addEventListener("focus", reload);
    window.addEventListener("storage", onStorage);
    window.addEventListener("vgos:acceptance-ready", reload as unknown as EventListener);
    return () => {
      window.removeEventListener("focus", reload);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("vgos:acceptance-ready", reload as unknown as EventListener);
    };
  }, [loadAll]);

  /* ---------------- Banner ---------------- */
  const Banner = () => {
    const ok = ready && !invBad;
    return (
      <div
        className={`mb-3 flex items-center justify-between rounded-lg border px-3 py-2 text-[13px] ${
          ok ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"
        }`}
      >
        <div className="flex items-center gap-2">
          {ok ? <I.Check /> : <I.Alert />}
          <span>
            {ok
              ? "Exports are ready. Replay & Audit."
              : "To continue, load Acceptance and generate exports."}
          </span>
        </div>
        <button
          type="button"
          className={[
            "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[13px] font-medium",
            ok ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-amber-500/60 text-white cursor-not-allowed",
          ].join(" ")}
          disabled={!ok}
          onClick={() => {
            if (!ok) return;
            window.dispatchEvent(new CustomEvent("vgos:export-ready"));
            // 🔧 Key fix: tell the layout to switch to Audit
            window.dispatchEvent(new Event("vgo:goto-audit"));
            try {
              router.push("/vgomini#audit");
              setTimeout(() => {
                try { window.dispatchEvent(new HashChangeEvent("hashchange")); } catch {}
              }, 0);
            } catch {
              try { window.location.assign("/vgomini#audit"); } catch {
                window.location.hash = "#audit";
              }
            }
          }}
          aria-label="Go to Audit"
        >
          Audit <span aria-hidden>↦</span>
        </button>
      </div>
    );
  };

  /* ---------------- Generators ---------------- */
  const filenameStem = React.useMemo(() => {
    const wk = String(windowKey || "window").replace(/[^\w.-]+/g, "_");
    const d8 = sealHash ? sealHash.slice(2, 10) : "digest";
    return `${wk}-${d8}`;
  }, [windowKey, sealHash]);

  const download = (name: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };

  const genPayoutCsv = (rows: { principal: string; cents: number }[]) => {
    const hdr = header ? `# window=${header.window_id}, digest=${header.outputs_digest}, quorum=${header.quorum}, freshness_s=${header.freshness_s}\n` : "";
    const headerLine = "principal,final_minor\n";
    const body = rows.map(r => `${r.principal},${r.cents}`).join("\n");
    return hdr + headerLine + body + "\n";
  };

  const genNetsuiteBillsCsv = (rows: { principal: string; cents: number }[]) => {
    const headerLine = [
      "External ID","Vendor","Date","Currency","Memo",
      "custbody_payout_window_id","custbody_output_digest","custbody_transcript_url",
      "custbody_quorum","custbody_freshness_s",
      "Expense Account","Expense Amount"
    ].join(",");
    const date = new Date().toISOString().slice(0,10);
    const lines = rows.map(r => {
      const externalId = `bill:${windowKey}:${r.principal}`;
      const vendor = r.principal;
      const currency = "USD";
      const memo = `Creator payout ${windowKey}`;
      const transcript = "";
      const quorum = header?.quorum ?? "";
      const freshness = header?.freshness_s ?? "";
      const expenseAccount = "Creator Payout Expense";
      const amount = (r.cents/100).toFixed(2);
      return [
        externalId,vendor,date,currency,memo,
        String(windowKey),sealHash,transcript,
        String(quorum),String(freshness),
        expenseAccount,amount
      ].map(v => `"${String(v).replace(/"/g,'""')}"`).join(",");
    });
    return headerLine + "\n" + lines.join("\n") + "\n";
  };

  const genNetsuitePaymentsCsv = (rows: { principal: string; cents: number }[], pspBatchId: string) => {
    const headerLine = [
      "External ID","Vendor","Date","Account (AP)","Memo",
      "custbody_payout_window_id","custbody_provider_batch_id",
      "custbody_quorum","custbody_freshness_s",
      "Apply Bill External ID","Payment Amount"
    ].join(",");
    const date = new Date().toISOString().slice(0,10);
    const lines = rows.map(r => {
      const payExternalId = `pay:${windowKey}:${r.principal}`;
      const vendor = r.principal;
      const ap = "Accounts Payable";
      const memo = `Creator payout ${windowKey}`;
      const billExternalId = `bill:${windowKey}:${r.principal}`;
      const quorum = header?.quorum ?? "";
      const freshness = header?.freshness_s ?? "";
      const amount = (r.cents/100).toFixed(2);
      return [
        payExternalId,vendor,date,ap,memo,
        String(windowKey),pspBatchId || "",
        String(quorum),String(freshness),
        billExternalId,amount
      ].map(v => `"${String(v).replace(/"/g,'""')}"`).join(",");
    });
    return headerLine + "\n" + lines.join("\n") + "\n";
  };

  const genProviderBatchJson = (rows: { principal: string; cents: number }[], pspBatchId?: string) => {
    const obj = {
      window_key: windowKey,
      output_digest: sealHash,
      provider_batch_id: pspBatchId || null,
      created_at: new Date().toISOString(),
      header: header ? {
        window_id: header.window_id,
        policy_version: header.policy_version,
        outputs_digest: header.outputs_digest,
        quorum: header.quorum,
        freshness_s: header.freshness_s,
        expiry: header.expiry ?? null,
      } : null,
      lines: rows.map(r => ({ principal: r.principal, amount_minor: r.cents })),
    };
    return JSON.stringify(obj, null, 2) + "\n";
  };

  const genGlJournalCsv = (rows: { principal: string; cents: number }[], _includeAll: boolean) => {
    const headerLine = "Date,Memo,Debit Account,Debit Amount,Credit Account,Credit Amount,Reference\n";
    const date = new Date().toISOString().slice(0,10);
    const memo = `Creator payout ${windowKey} (q=${header?.quorum ?? ""},F=${header?.freshness_s ?? ""})`;
    const debit = "Creator Payout Expense";
    const credit = "Accounts Payable";
    const lines = rows.map(r => {
      const amt = (r.cents/100).toFixed(2);
      const ref = r.principal;
      return `${date},"${memo}",${debit},${amt},${credit},${amt},"${ref}"`;
    });
    return headerLine + lines.join("\n") + "\n";
  };

  const generateExports = async () => {
    if (!sealHash || !acceptanceId) { alert("Missing Seal or Acceptance."); return; }
    if (!acceptanceMatchesSeal) { alert("Acceptance does not match current Seal."); return; }
    if (!principals || allowSum <= 0) { alert("Nothing to export."); return; }

    // Drive rows from normalized decision OR data presence
    const isAllow = accept?.decision === "ALLOW" || finalsFromAcceptance.length > 0;

    const providerRows = isAllow ? finalsFromAcceptance : [];
    const booksRows = isAllow ? finalsFromAcceptance : (includeHoldInBooks ? finalsFromAcceptance : []);

    const files: { name: string; content: string; mime: string }[] = [];

    const payoutsCsv = genPayoutCsv(providerRows);
    files.push({ name: `payouts-${filenameStem}.csv`, content: payoutsCsv, mime: "text/csv" });

    const billsCsv = genNetsuiteBillsCsv(booksRows);
    files.push({ name: `netsuite-bills-${filenameStem}.csv`, content: billsCsv, mime: "text/csv" });

    const paymentsCsv = genNetsuitePaymentsCsv(providerRows, providerBatchId || "");
    files.push({ name: `netsuite-payments-${filenameStem}.csv`, content: paymentsCsv, mime: "text/csv" });

    const providerJson = genProviderBatchJson(providerRows, providerBatchId || undefined);
    files.push({ name: `provider-batch-${filenameStem}.json`, content: providerJson, mime: "application/json" });

    const glCsv = genGlJournalCsv(booksRows, includeHoldInBooks);
    files.push({ name: `gl-journal-${filenameStem}.csv`, content: glCsv, mime: "text/csv" });

    const filelist: ExportManifest["filelist"] = [];
    for (const f of files) {
      const h = await sha256Hex(f.content);
      filelist.push({ name: f.name, bytes: new TextEncoder().encode(f.content).length, sha256: h });
    }

    const manifest: ExportManifest = {
      version: "v1.0.0",
      created_at: new Date().toISOString(),
      window_key: String(windowKey),
      sealHash,
      acceptanceId,
      includeHoldInBooks,
      providerBatchId: providerBatchId || undefined,
      header: header || undefined,
      totals: { allow_sum_minor: allowSum, all_sum_minor: allSum, principals },
      filelist,
    };

    const manifestStr = JSON.stringify(manifest, null, 2) + "\n";
    const manifestHash = await sha256Hex(manifestStr);
    manifest.filelist.push({ name: `vgos-export-manifest-${filenameStem}.json`, bytes: manifestStr.length, sha256: manifestHash });

    const auditObj = {
      meta: { created_at: new Date().toISOString(), kind: "vgos-audit-bundle", window_key: windowKey },
      seal, acceptance: accept, header: header || undefined, manifest,
      guide_hint: "Open @audit to view the explanatory guide and run checks.",
    };
    const auditStr = JSON.stringify(auditObj, null, 2) + "\n";
    const auditHash = await sha256Hex(auditStr);
    manifest.filelist.push({ name: `audit-bundle-${filenameStem}.json`, bytes: auditStr.length, sha256: auditHash });

    try {
      const persistStr = JSON.stringify(manifest, null, 2) + "\n";
      sessionStorage.setItem(KEY_EXPORT, persistStr);
      localStorage.setItem(KEY_EXPORT, persistStr);
      setExportManifest(manifest);
      if (process.env.NODE_ENV !== "production") {
        const present = manifest.filelist.filter(f => f.sha256 && f.sha256.length > 0).length;
        const bad = present !== manifest.filelist.length;
        setInvBad(bad);
        if (bad) console.warn("[export] invariant: some files missing sha256", { present, total: manifest.filelist.length });
      } else { setInvBad(false); }
      window.dispatchEvent(new CustomEvent("vgos:export-ready"));
      alert("Exports generated.");
    } catch { alert("Failed to persist export manifest."); }
  };

  const resetExports = () => {
    try { sessionStorage.removeItem(KEY_EXPORT); localStorage.removeItem(KEY_EXPORT); } catch {}
    setExportManifest(null);
    setInvBad(false);
  };

  const copySealHash = async () => { if (!sealHash) return; try { await navigator.clipboard.writeText(sealHash); } catch {} };
  const copyAcceptanceSig = async () => { const sig = accept?.signature; if (!sig) return; try { await navigator.clipboard.writeText(sig); } catch {} };
  const copyManifestJson = async () => { if (!exportManifest) return; try { await navigator.clipboard.writeText(JSON.stringify(exportManifest, null, 2)); } catch {} };

  // Preview: drive off normalized decision OR presence of rows (prevents false "HOLD" messaging)
  const isAllowPreview = (accept?.decision === "ALLOW") || finalsFromAcceptance.length > 0;
  const providerRowsPreview = isAllowPreview ? finalsFromAcceptance : [];
  const booksRowsPreview = isAllowPreview ? finalsFromAcceptance : (includeHoldInBooks ? finalsFromAcceptance : []);
  const previewRows = providerRowsPreview;

  return (
    <div className="mx-auto max-w-6xl">
      {/* Field guide */}
      <div className="mb-3 rounded-xl border border-slate-300 bg-white">
        <div className="flex items-center justify-between rounded-t-xl border-b border-slate-300 bg-slate-100 px-3 py-2">
          <div className="text-[12px] font-semibold tracking-wide text-slate-700">Export — field guide</div>
        </div>
        <div className="max-h-28 overflow-y-auto p-3 text-[12px] leading-5 text-slate-700">
          <ExportGuide />
        </div>
      </div>

      <Banner />

      <Section
        title="Input (from Acceptance / Seal)"
        right={
          <div className="flex flex-wrap items-center gap-2">
            <Chip>window: {String(windowKey)}</Chip>
            {header ? <Chip>q={header.quorum}</Chip> : null}
            {header ? <Chip>F={header.freshness_s}s</Chip> : null}
            <Chip>principals: {principals}</Chip>
            <Chip>Σ allow: {money(allowSum)}</Chip>
            <Chip>target: {money(accept?.target_total_minor || seal?.targets?.target_total_minor || 0)}</Chip>
            <Chip tone={acceptanceMatchesSeal ? "ok" : "warn"}>{acceptanceMatchesSeal ? "acceptance ↔ seal ✓" : "mismatch"}</Chip>
          </div>
        }
      >
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Button
            variant="primary"
            leftIcon={<I.CloudDown />}
            onClick={() => {
              (window as unknown as { __vgos_clicked_get_from_acceptance__?: boolean }).__vgos_clicked_get_from_acceptance__ = true;
              loadAll();
              setTimeout(() => { (window as unknown as { __vgos_clicked_get_from_acceptance__?: boolean }).__vgos_clicked_get_from_acceptance__ = false; }, 0);
            }}
            aria-label="Get from Acceptance"
          >
            Get from Acceptance
          </Button>

          <label className="text-[12px] text-slate-700 inline-flex items-center gap-2">
            Include HOLD in books:
            <input
              type="checkbox"
              checked={includeHoldInBooks}
              onChange={e => setIncludeHoldInBooks(e.target.checked)}
              aria-label="Include HOLD rows in books exports"
            />
          </label>

          <label className="text-[12px] text-slate-700 inline-flex items-center gap-2">
            Provider batch id:
            <input
              type="text"
              className="rounded-md border border-slate-300 bg-white px-2 py-1 text-[12px] text-slate-800"
              value={providerBatchId}
              onChange={e => setProviderBatchId(e.target.value)}
              placeholder="optional"
              aria-label="Provider batch id"
              spellCheck={false}
            />
          </label>

          <div className="ml-auto flex items-center gap-2">
            <Button leftIcon={<I.Copy />} onClick={copySealHash} disabled={!sealHash} aria-label="Copy digest">Copy digest</Button>
            <Button leftIcon={<I.Copy />} onClick={copyAcceptanceSig} disabled={!accept?.signature} aria-label="Copy acceptance signature">Copy signature</Button>
          </div>
        </div>

        <div className="max-h-56 overflow-auto">
          <table className="min-w-[680px] w-full text-[12px]">
            <thead className="sticky top-0 bg-slate-100 text-slate-700">
              <tr className="[&>th]:px-3 [&>th]:py-2 [&>th]:text-left">
                <th scope="col">principal</th>
                <th scope="col">final (¢)</th>
                <th scope="col">final ($)</th>
              </tr>
            </thead>
            <tbody className="bg-white text-slate-800">
              {previewRows.length === 0 ? (
                <tr className="text-slate-600">
                  <td className="px-3 py-3" colSpan={3}>
                    {isAllowPreview
                      ? "No rows. Commit Acceptance first."
                      : "Acceptance is HOLD. Provider preview is empty; books exports can still include holds if toggled."}
                  </td>
                </tr>
              ) : (
                previewRows.slice(0, 50).map(r => (
                  <tr key={r.principal} className="border-t border-slate-200 [&>td]:px-3 [&>td]:py-1.5">
                    <td className="font-mono">{r.principal}</td>
                    <td>{r.cents}</td>
                    <td>{money(r.cents)}</td>
                  </tr>
                ))
              )}
            </tbody>
            {previewRows.length > 0 && (
              <tfoot className="bg-slate-50 text-slate-800">
                <tr className="[&>td]:px-3 [&>td]:py-2 font-semibold">
                  <td>Σ (previewed {Math.min(previewRows.length, 50)} of {previewRows.length})</td>
                  <td>{allowSum}</td>
                  <td>{money(allowSum)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </Section>

      <Section
        title="Actions"
        right={
          <div className="flex flex-wrap items-center gap-2">
            <Chip>seal: {sealHash ? `${sealHash.slice(0,12)}…` : "—"}</Chip>
            <Chip>acceptance: {acceptanceId ? `${acceptanceId.slice(0,8)}…` : "—"}</Chip>
            <Chip>batch: {providerBatchId || "—"}</Chip>
            {invBad ? <Chip tone="bad">invariant</Chip> : null}
            <Button leftIcon={<I.RotateCcw />} onClick={resetExports} disabled={!exportManifest} aria-label="Reset exports">Reset</Button>
          </div>
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary" onClick={() => void generateExports()} disabled={!acceptanceMatchesSeal || !principals || allowSum <= 0} aria-label="Generate exports">
            Generate exports
          </Button>
        </div>
      </Section>

      <Section
        title="Output (artifacts & manifest)"
        right={
          <>
            <Chip tone={ready ? "ok" : "warn"}>{ready ? "manifest bound ✓" : "no manifest for current snapshots"}</Chip>
            <Chip>files: {exportManifest?.filelist.length ?? 0}</Chip>
            {header ? <Chip>header: q={header.quorum},F={header.freshness_s}</Chip> : null}
            <Button leftIcon={<I.Copy />} onClick={copyManifestJson} disabled={!exportManifest} aria-label="Copy manifest JSON">
              Copy manifest JSON
            </Button>
          </>
        }
      >
        {!exportManifest ? (
          <div className="text-[12px] text-slate-700">No manifest yet. Click <strong>Generate exports</strong>.</div>
        ) : (
          <div className="space-y-3">
            <div className="text-[12px] text-slate-800">
              <div className="mb-1 font-semibold">Manifest</div>
              <pre className="max-h-48 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3">
{JSON.stringify(exportManifest, null, 2)}
              </pre>
            </div>

            <div className="text-[12px] text-slate-800">
              <div className="mb-1 font-semibold">Downloads</div>
              <div className="flex flex-wrap gap-2">
                {exportManifest.filelist.map(f => (
                  <Button
                    key={f.name}
                    leftIcon={<I.Download />}
                    aria-label={`Download ${f.name}`}
                    onClick={async () => {
                      const name = f.name;
                      const isAllowNow = (accept?.decision === "ALLOW") || finalsFromAcceptance.length > 0;

                      if (name.startsWith("payouts-") && name.endsWith(".csv")) {
                        const content = genPayoutCsv(isAllowNow ? finalsFromAcceptance : []);
                        download(name, content, "text/csv");
                      } else if (name.startsWith("netsuite-bills-") && name.endsWith(".csv")) {
                        const rows = isAllowNow ? finalsFromAcceptance : (includeHoldInBooks ? finalsFromAcceptance : []);
                        const content = genNetsuiteBillsCsv(rows);
                        download(name, content, "text/csv");
                      } else if (name.startsWith("netsuite-payments-") && name.endsWith(".csv")) {
                        const rows = isAllowNow ? finalsFromAcceptance : [];
                        const content = genNetsuitePaymentsCsv(rows, exportManifest.providerBatchId || "");
                        download(name, content, "text/csv");
                      } else if (name.startsWith("provider-batch-") && name.endsWith(".json")) {
                        const rows = isAllowNow ? finalsFromAcceptance : [];
                        const content = genProviderBatchJson(rows, exportManifest.providerBatchId);
                        download(name, content, "application/json");
                      } else if (name.startsWith("gl-journal-") && name.endsWith(".csv")) {
                        const rows = isAllowNow ? finalsFromAcceptance : (exportManifest.includeHoldInBooks ? finalsFromAcceptance : []);
                        const content = genGlJournalCsv(rows, exportManifest.includeHoldInBooks);
                        download(name, content, "text/csv");
                      } else if (name.startsWith("vgos-export-manifest-") && name.endsWith(".json")) {
                        const content = JSON.stringify(exportManifest, null, 2) + "\n";
                        download(name, content, "application/json");
                      } else if (name.startsWith("audit-bundle-") && name.endsWith(".json")) {
                        const auditObj = {
                          meta: { created_at: new Date().toISOString(), kind: "vgos-audit-bundle", window_key: windowKey },
                          seal, acceptance: accept, header: header || undefined, manifest: exportManifest,
                          guide_hint: "Open @audit to view the explanatory guide and run checks.",
                        };
                        const content = JSON.stringify(auditObj, null, 2) + "\n";
                        download(name, content, "application/json");
                      } else {
                        alert("Unknown artifact type.");
                      }
                    }}
                  >
                    {f.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}
