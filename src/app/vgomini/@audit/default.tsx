// src/app/vgomini/@audit/default.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import AuditGuide from "./AuditGuide";

/* ---------------- Icons ---------------- */
const I = {
  Check: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}><path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>
  ),
  Alert: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}><path fill="currentColor" d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
  ),
  Info: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10.012 10.012 0 0 0 12 2zm1 15h-2v-6h2zm0-8h-2V7h2z"/></svg>
  ),
  Rotate: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}><path fill="currentColor" d="M12 6V3L7 8l5 5V9a5 5 0 1 1-5 5H5a7 7 0 1 0 7-8z"/></svg>
  ),
  Play: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}><path fill="currentColor" d="M8 5v14l11-7z"/></svg>
  ),
  Download: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}><path fill="currentColor" d="M5 20h14v-2H5v2zM11 4h2v7h3l-4 4-4-4h3V4z"/></svg>
  ),
  Link: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}><path fill="currentColor" d="M3.9 12a5 5 0 0 1 5-5H12v2H8.9a3 3 0 1 0 0 6H12v2H8.9a5 5 0 0 1-5-5zm7.1 1h3.1a3 3 0 0 0 0-6H11V5h3.1a5 5 0 1 1 0 10H11v-2z"/></svg>
  ),
  Upload: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}><path fill="currentColor" d="M5 20h14v-2H5v2zM7 9l5-5 5 5h-3v6h-4V9H7z"/></svg>
  ),
  Back: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
  ),
};

/* ---------------- Small UI atoms ---------------- */
const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger"; leftIcon?: React.ReactNode }
> = ({ variant = "ghost", className = "", children, disabled, leftIcon, ...rest }) => {
  const base = "inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm border transition";
  const tone =
    variant === "primary"
      ? "border-emerald-300 bg-white text-slate-900 enabled:hover:bg-emerald-50"
      : variant === "danger"
      ? "border-rose-300 bg-white text-slate-900 enabled:hover:bg-rose-50"
      : "border-slate-300 bg-white text-slate-700 enabled:hover:bg-slate-50";
  return (
    <button type="button" className={`${base} ${tone} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`} disabled={disabled} {...rest}>
      {leftIcon}
      {children}
    </button>
  );
};

const Chip: React.FC<{ children: React.ReactNode; tone?: "ok" | "warn" | "bad" | "muted" }> = ({ children, tone = "muted" }) => {
  const t =
    tone === "ok"   ? "border-emerald-300 bg-emerald-50 text-emerald-700" :
    tone === "warn" ? "border-amber-300 bg-amber-50 text-amber-700" :
    tone === "bad"  ? "border-rose-300 bg-rose-50 text-rose-700" :
                      "border-slate-300 bg-slate-100 text-slate-700";
  return <span className={`inline-flex items-center rounded-full border px-2 py-[2px] text-[11px] ${t}`}>{children}</span>;
};

const Section: React.FC<{ title: string; right?: React.ReactNode; children: React.ReactNode }> = ({ title, right, children }) => (
  <div className="mb-4 rounded-xl border border-slate-300 bg-white">
    <div className="flex items-center justify-between rounded-t-xl border-b border-slate-300 bg-slate-100 px-3 py-2">
      <div className="text-[12px] font-semibold tracking-wide text-slate-700">{title}</div>
      {right ? <div className="flex items-center gap-2 text-[12px] text-slate-700">{right}</div> : null}
    </div>
    <div className="p-3">{children}</div>
  </div>
);

const Collapse: React.FC<{ title: string; badge?: React.ReactNode; defaultOpen?: boolean; children: React.ReactNode }> = ({ title, badge, defaultOpen, children }) => {
  const [open, setOpen] = React.useState(!!defaultOpen);
  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <button type="button" onClick={() => setOpen(v => !v)} className="flex w-full items-center justify-between px-3 py-2 text-left text-[13px] font-semibold text-slate-800">
        <span className="inline-flex items-center gap-2">{title}</span>
        {badge}
      </button>
      {open ? <div className="border-t border-slate-200 p-3">{children}</div> : null}
    </div>
  );
};

/* ---------------- Shared storage keys ---------------- */
const KEY_SEAL   = "vgos:seal";
const KEY_ACCEPT = "vgos:acceptance";
const KEY_HEADER = "vgos:acceptance:header";
const KEY_EXPORT = "vgos:export";

/* ---------------- Types ---------------- */
type Sealed = {
  sealHash: string;
  window?: { key?: string };
  final_after?: { principal: string; cents: number }[];
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
  decision: "ALLOW" | "HOLD";
  sealedHash: string;
  signature: string;
  windowKey?: string;
  sum_final_minor: number;
  finals: { principal: string; cents: number }[];
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
const isHexDigest = (s?: string) => !!s && /^0x[0-9a-f]{64}$/i.test(s);

async function sha256HexBytes(bytes: ArrayBuffer): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", bytes);
  const arr = Array.from(new Uint8Array(buf));
  return "0x" + arr.map(b => b.toString(16).padStart(2, "0")).join("");
}

/* ---------------- File Verifier ---------------- */
function FileVerifier({ manifest }: { manifest: ExportManifest | null }) {
  const [rows, setRows] = React.useState<{ name: string; bytes: number; hash?: string; match?: boolean }[]>([]);
  const onFiles = async (files: FileList | null) => {
    if (!files) return;
    const next: typeof rows = [];
    for (const f of Array.from(files)) {
      const buf = await f.arrayBuffer();
      const hash = await sha256HexBytes(buf);
      const man = manifest?.filelist.find(x => x.name === f.name);
      next.push({ name: f.name, bytes: f.size, hash, match: !!man && man.sha256.toLowerCase() === hash.toLowerCase() });
    }
    setRows(next);
  };
  return (
    <div className="space-y-2">
      <div
        onDrop={(e) => { e.preventDefault(); onFiles(e.dataTransfer.files); }}
        onDragOver={(e) => e.preventDefault()}
        className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center"
      >
        <I.Upload />
        <div className="mt-1 text-sm font-semibold">Drag & drop files to verify</div>
        <div className="text-xs text-slate-600">Hashes are computed locally and compared to the manifest.</div>
        <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm hover:bg-slate-50">
          <input type="file" className="hidden" multiple onChange={(e) => onFiles(e.target.files)} />
          Choose files…
        </label>
      </div>
      {rows.length > 0 && (
        <div className="grid grid-cols-1 gap-2">
          {rows.map(r => (
            <div key={r.name} className="rounded-lg border border-slate-200 bg-white p-2 text-[12px]">
              <div className="mb-1 flex items-center justify-between">
                <div className="font-semibold">{r.name}</div>
                <Chip tone={r.match ? "ok" : "bad"}>{r.match ? "match ✓" : "mismatch"}</Chip>
              </div>
              <div className="text-slate-700">bytes: {r.bytes}</div>
              <div className="font-mono text-slate-700">{r.hash}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Component ---------------- */
export default function AuditStep() {
  const router = useRouter();

  const [seal, setSeal] = React.useState<Sealed | null>(null);
  const [accept, setAccept] = React.useState<Acceptance | null>(null);
  const [header, setHeader] = React.useState<AcceptanceHeader | null>(null);
  const [manifest, setManifest] = React.useState<ExportManifest | null>(null);

  const [replayRan, setReplayRan] = React.useState(false);
  const [replayOk, setReplayOk] = React.useState<boolean | null>(null);
  const [replayNotes, setReplayNotes] = React.useState<string[]>([]);
  const [dlMenu, setDlMenu] = React.useState(false);

  const windowKey = accept?.windowKey || seal?.window?.key || "window:not-specified";
  const sealHash  = seal?.sealHash || "";
  const finals    = accept?.finals || seal?.final_after?.map(x => ({ principal: x.principal, cents: Number(x.cents || 0) })) || [];

  const totals = React.useMemo(() => {
    const principals = finals.length;
    const sumMinor   = finals.reduce((s, r) => s + r.cents, 0);
    return { principals, sumMinor };
  }, [finals]);

  const bound = !!manifest && manifest.sealHash === sealHash && manifest.acceptanceId === (accept?.acceptanceId || "");

  const loadAll = React.useCallback(() => {
    setSeal(readJSON<Sealed>(KEY_SEAL));
    setAccept(readJSON<Acceptance>(KEY_ACCEPT));
    const h = readJSON<AcceptanceHeader>(KEY_HEADER) ??
      (readJSON<Acceptance>(KEY_ACCEPT)?.header as AcceptanceHeader | undefined) ?? null;
    setHeader(h);
    setManifest(readJSON<ExportManifest>(KEY_EXPORT));
  }, []);
  React.useEffect(() => { loadAll(); }, [loadAll]);

  /* HOLD heuristics for demo (provider vs books file counts) */
  const providerFiles = React.useMemo(
    () => manifest?.filelist.filter(f => /provider/i.test(f.name)).length ?? 0,
    [manifest]
  );
  const booksFiles = React.useMemo(
    () => manifest?.filelist.filter(f => /(books|journal|gl)/i.test(f.name)).length ?? 0,
    [manifest]
  );

  /* ------------- Replay ------------- */
  const runReplay = React.useCallback(() => {
    const notes: string[] = [];
    let ok = true;

    // presence
    if (!seal) { ok = false; notes.push("Seal: missing."); }
    if (!accept) { ok = false; notes.push("Acceptance: missing."); }

    // linkage
    if (accept && seal && accept.sealedHash !== seal.sealHash) { ok = false; notes.push("Mismatch: acceptance.sealedHash ≠ seal.sealHash."); }
    if (seal && !isHexDigest(seal.sealHash)) { ok = false; notes.push("Seal hash is not a 0x-prefixed 32-byte hex."); }
    if (accept && !accept.signature) { ok = false; notes.push("Acceptance signature missing."); }

    // header
    if (!header) { notes.push("Header not provided (continuing)."); }
    if (header?.outputs_digest && header.outputs_digest !== seal?.sealHash) { ok = false; notes.push("Header.outputs_digest does not match Seal."); }

    // totals & records
    if (accept) {
      const expected = accept.sum_final_minor ?? totals.sumMinor;
      if (totals.sumMinor !== expected) { ok = false; notes.push(`Totals mismatch: computed Σ=${totals.sumMinor} vs acceptance Σ=${expected}.`); }
      if (finals.some(r => r.cents < 0)) { ok = false; notes.push("Negative cents in finals."); }
      const seen = new Set<string>(); let dup = false;
      for (const r of finals) { if (seen.has(r.principal)) { dup = true; break; } seen.add(r.principal); }
      if (dup) { ok = false; notes.push("Duplicate principals detected in finals."); }
    }

    // manifest expectations (ALLOW vs HOLD)
    if (accept?.decision === "ALLOW") {
      if (!manifest) { ok = false; notes.push("Export manifest missing for ALLOW decision."); }
      if (manifest && !bound) { ok = false; notes.push("Manifest not bound to current Seal/Acceptance."); }
      if (manifest) {
        const badHashes = manifest.filelist.filter(f => !isHexDigest(f.sha256)).length;
        if (badHashes > 0) { ok = false; notes.push(`Manifest has ${badHashes} file(s) with invalid sha256.`); }
      }
    } else if (accept?.decision === "HOLD") {
      // For HOLD: provider exports usually empty; books may include holds if toggled.
      if (manifest) {
        if (providerFiles > 0) { ok = false; notes.push(`HOLD decision: expected 0 provider files, found ${providerFiles}.`); }
        if (manifest.includeHoldInBooks && booksFiles === 0) { ok = false; notes.push("HOLD decision with includeHoldInBooks=true but no books/journal files found."); }
      } else {
        notes.push("HOLD decision: manifest is optional (no provider payouts).");
      }
    } else {
      // No decision yet
      if (!manifest) { ok = false; notes.push("No manifest yet — generate exports after committing acceptance."); }
    }

    setReplayNotes(notes);
    setReplayOk(ok);
    setReplayRan(true);

    try { window.dispatchEvent(new CustomEvent("vgos:audit-ready")); } catch {}
  }, [seal, accept, header, manifest, totals, finals, bound, providerFiles, booksFiles]);

  /* ------------- Downloads / share ------------- */
  const buildBundleObject = React.useCallback(() => {
    return {
      meta: { created_at: new Date().toISOString(), kind: "vgos-audit-bundle", window_key: windowKey },
      seal, acceptance: accept, header, manifest,
      replay: { ok: replayOk, notes: replayNotes },
    };
  }, [windowKey, seal, accept, header, manifest, replayOk, replayNotes]);

  const downloadJSON = React.useCallback(async (obj: unknown, nameStem: string) => {
    const content = JSON.stringify(obj, null, 2) + "\n";
    const hashBuf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(content));
    const hex = Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, "0")).join("");
    const name = `${nameStem}-${(windowKey || "window").replace(/[^\w.-]+/g, "_")}-${hex.slice(0,8)}.json`;
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }, [windowKey]);

  const downloadFullBundle = React.useCallback(async () => {
    await downloadJSON(buildBundleObject(), "audit-bundle");
  }, [buildBundleObject, downloadJSON]);

  const downloadChecksOnly = React.useCallback(async () => {
    const obj = { meta: { created_at: new Date().toISOString(), kind: "vgos-replay-report", window_key: windowKey }, replay: { ok: replayOk, notes: replayNotes } };
    await downloadJSON(obj, "replay-report");
  }, [downloadJSON, windowKey, replayOk, replayNotes]);

  const copyPermalink = React.useCallback(async () => {
    const url = new URL(window.location.href);
    url.hash = `audit:${sealHash || "no-seal"}`;
    await navigator.clipboard.writeText(url.toString());
  }, [sealHash]);

  /* -------- Return to main menu -------- */
  const goMain = React.useCallback(() => {
    try { window.dispatchEvent(new Event("vgo:goto-info")); } catch {}
    try { router.push("/vgomini#info"); }
    catch {
      try { window.location.assign("/vgomini#info"); } catch { window.location.hash = "#info"; }
    }
  }, [router]);

  /* ---------------- UI state & tones ---------------- */
  const toneSeal   = seal ? "ok" : "bad";
  const toneAccept = accept ? "ok" : "bad";
  const toneLink   = accept && seal ? (accept.sealedHash === seal.sealHash ? "ok" : "bad") : "muted";
  const toneHeader = header ? "ok" : "warn";
  const toneMan    = manifest ? (bound ? "ok" : "bad") : (accept?.decision === "HOLD" ? "warn" : "warn");

  const topStatusTone = replayRan ? (replayOk ? "ok" : "bad") : "warn";
  const topStatusText = replayRan
    ? (replayOk ? "Audit successful — all checks passed." : "Audit found issues — see notes below.")
    : "Ready. Load snapshots and run Replay checks.";

  const fullBundleDisabled = !manifest; // typical on HOLD (no provider exports)

  return (
    <div className="mx-auto max-w-6xl">
      {/* Field guide */}
      <div className="mb-3 rounded-xl border border-slate-300 bg-white">
        <div className="flex items-center justify-between rounded-t-xl border-b border-slate-300 bg-slate-100 px-3 py-2">
          <div className="text-[12px] font-semibold tracking-wide text-slate-700">Audit — field guide</div>
          {/* Return to main menu */}
          <Button leftIcon={<I.Back />} onClick={goMain}>Return to main menu</Button>
        </div>
        <div className="max-h-28 overflow-y-auto p-3 text-[12px] leading-5 text-slate-700">
          <AuditGuide />
        </div>
      </div>

      {/* Verdict / actions */}
      <div
        className={`mb-3 flex items-center justify-between rounded-lg border px-3 py-2 text-[13px] ${
          topStatusTone === "ok" ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : topStatusTone === "bad" ? "border-rose-200 bg-rose-50 text-rose-700"
          : "border-amber-200 bg-amber-50 text-amber-700"
        }`}
      >
        <div className="flex items-center gap-2">
          {topStatusTone === "ok" ? <I.Check /> : topStatusTone === "bad" ? <I.Alert /> : <I.Info /> }
          <span>{topStatusText}</span>
        </div>
        <div className="relative flex items-center gap-2">
          {/* Secondary Return to main menu */}
          <Button leftIcon={<I.Back />} onClick={goMain}>Return to main menu</Button>
          <Button leftIcon={<I.Rotate />} onClick={loadAll}>Reload</Button>
          <Button variant="primary" leftIcon={<I.Play />} onClick={runReplay}>Replay checks</Button>
          <div className="relative">
            <Button leftIcon={<I.Download />} onClick={() => setDlMenu(v => !v)}>Download</Button>
            {dlMenu && (
              <div className="absolute right-0 z-10 mt-1 w-56 overflow-hidden rounded-lg border border-slate-200 bg-white text-[13px] shadow">
                <button className="block w-full px-3 py-2 text-left hover:bg-slate-50" onClick={() => { setDlMenu(false); downloadChecksOnly(); }}>Checks only (.json)</button>
                <button
                  className={`block w-full px-3 py-2 text-left ${fullBundleDisabled ? "text-slate-400" : "hover:bg-slate-50"}`}
                  disabled={fullBundleDisabled}
                  onClick={() => { setDlMenu(false); if (!fullBundleDisabled) downloadFullBundle(); }}
                >
                  Full bundle (.json){fullBundleDisabled ? " — requires manifest" : ""}
                </button>
                <button className="block w-full px-3 py-2 text-left text-slate-400" disabled>PDF summary — coming soon</button>
              </div>
            )}
          </div>
          <Button leftIcon={<I.Link />} onClick={copyPermalink}>Share link</Button>
        </div>
      </div>

      {/* (rest unchanged) */}
      <Section
        title="Overview"
        right={
          <div className="flex flex-wrap items-center gap-2">
            <Chip tone={toneSeal}>seal: {seal ? `${sealHash.slice(0,12)}…` : "—"}</Chip>
            <Chip tone={toneAccept}>acceptance: {accept?.acceptanceId ? `${accept.acceptanceId.slice(0,8)}…` : "—"}</Chip>
            <Chip tone={toneLink}>acceptance ↔ seal</Chip>
            <Chip tone={accept?.decision === "HOLD" ? "warn" : "muted"}>decision: {accept?.decision || "—"}</Chip>
            <Chip tone={toneHeader}>header: {header ? `q=${header.quorum}, F=${header.freshness_s}` : "—"}</Chip>
            <Chip>principals: {totals.principals}</Chip>
            <Chip>Σ: {money(totals.sumMinor)}</Chip>
            <Chip tone={toneMan}>manifest: {manifest ? (bound ? "bound" : "mismatch") : (accept?.decision === "HOLD" ? "optional" : "—")}</Chip>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Collapse title="Snapshot (Seal, Acceptance, Header)" defaultOpen badge={
            accept?.decision === "ALLOW" ? <Chip tone="ok">ALLOW</Chip> :
            accept?.decision === "HOLD"  ? <Chip tone="warn">HOLD</Chip>  : <Chip tone="muted">—</Chip>
          }>
            <div className="space-y-2 text-[12px] text-slate-800">
              <div><strong>Window:</strong> {windowKey}</div>
              <div><strong>Seal:</strong> {sealHash || "—"}</div>
              <div><strong>Acceptance:</strong> {accept?.acceptanceId || "—"} {accept ? `(${accept.decision})` : ""}</div>
              <div><strong>Header:</strong> {header ? `policy=${header.policy_version} · q=${header.quorum} · F=${header.freshness_s}s · digest=${header.outputs_digest?.slice(0,10)}…` : "—"}</div>
              {accept?.decision === "HOLD" && (
                <div className="rounded-md border border-amber-200 bg-amber-50 p-2 text-amber-800">
                  HOLD: Provider exports should be empty. Books/GL may include holds if configured (<code>includeHoldInBooks</code>).
                </div>
              )}
            </div>
          </Collapse>

          <Collapse title="Replay summary" defaultOpen badge={
            replayRan ? (replayOk ? <Chip tone="ok">passed</Chip> : <Chip tone="bad">issues</Chip>) : <Chip tone="warn">not run</Chip>
          }>
            <ul className="list-disc pl-5 text-[12px] text-slate-800">
              {replayRan && replayNotes.length === 0 ? <li>All checks passed.</li> : null}
              {replayNotes.map((n, i) => <li key={i}>{n}</li>)}
              {!replayRan ? <li>Click <em>Replay checks</em> to verify digests, totals, and artifacts.</li> : null}
            </ul>
          </Collapse>
        </div>
      </Section>

      <Section title="Replay checks">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Collapse title="Integrity" badge={<Chip tone={replayRan ? (replayOk ? "ok" : "bad") : "warn"}>{replayRan ? (replayOk ? "ok" : "issues") : "n/a"}</Chip>}>
            <ul className="list-disc pl-5 text-[12px] text-slate-800">
              <li>Acceptance references exact <code>sealHash</code>.</li>
              <li>Manifest file count, bytes, and <code>sha256</code> values valid.</li>
              <li>Header quorum/freshness respected.</li>
            </ul>
          </Collapse>
          <Collapse title="Accounting">
            <ul className="list-disc pl-5 text-[12px] text-slate-800">
              <li>Grand totals match exports and acceptance.</li>
              <li>No duplicate principals; no negative cents.</li>
              <li>Carry-in/out balances (if applicable).</li>
            </ul>
          </Collapse>
          <Collapse title="Determinism">
            <ul className="list-disc pl-5 text-[12px] text-slate-800">
              <li>Processing order is monotone; watermark never regresses.</li>
              <li>Recompute subset yields byte-identical results.</li>
            </ul>
          </Collapse>
          <Collapse title="Policy">
            <ul className="list-disc pl-5 text-[12px] text-slate-800">
              <li>Each decision has an explicit rule trail.</li>
              <li>ALLOW/HOLD consistent with configured policy version.</li>
            </ul>
          </Collapse>
        </div>
      </Section>

      <Section title="Records (payees)">
        <div className="max-h-64 overflow-auto">
          <table className="min-w-[680px] w-full text-[12px]">
            <thead className="sticky top-0 bg-slate-100 text-slate-700">
              <tr className="[&>th]:px-3 [&>th]:py-2 [&>th]:text-left">
                <th>principal</th><th>final (¢)</th><th>final ($)</th>
              </tr>
            </thead>
            <tbody className="bg-white text-slate-800">
              {finals.length === 0 ? (
                <tr><td className="px-3 py-3 text-slate-600" colSpan={3}>No records. Commit Acceptance first.</td></tr>
              ) : finals.map(r => (
                <tr key={r.principal} className="border-t border-slate-200 [&>td]:px-3 [&>td]:py-1.5">
                  <td className="font-mono">{r.principal}</td>
                  <td>{r.cents}</td>
                  <td>{money(r.cents)}</td>
                </tr>
              ))}
            </tbody>
            {finals.length > 0 && (
              <tfoot className="bg-slate-50 text-slate-800">
                <tr className="[&>td]:px-3 [&>td]:py-2 font-semibold">
                  <td>Σ ({finals.length})</td>
                  <td>{totals.sumMinor}</td>
                  <td>{money(totals.sumMinor)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </Section>

      <Section
        title="Manifest & files"
        right={
          <div className="flex items-center gap-2">
            <Chip tone={toneMan}>{manifest ? (bound ? "bound ✓" : "mismatch") : (accept?.decision === "HOLD" ? "optional" : "no manifest")}</Chip>
            <Chip>files: {manifest?.filelist.length ?? 0}</Chip>
            {accept?.decision === "HOLD" && <Chip tone="warn">provider expected: 0</Chip>}
          </div>
        }
      >
        {!manifest ? (
          <div className="text-[12px] text-slate-700">
            {accept?.decision === "HOLD"
              ? "HOLD decision: provider exports typically omitted; books/GL may still be produced if configured."
              : "No manifest found. Generate exports in the previous step."}
          </div>
        ) : (
          <div className="space-y-3">
            <Collapse title="Manifest JSON" defaultOpen>
              <pre className="max-h-56 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-[12px] text-slate-800">
{JSON.stringify(manifest, null, 2)}
              </pre>
            </Collapse>
            <Collapse title="Files (hashes)">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {manifest.filelist.map(f => (
                  <div key={f.name} className="rounded-lg border border-slate-200 bg-white p-2 text-[12px]">
                    <div className="mb-1 flex items-center justify-between">
                      <div className="font-semibold">{f.name}</div>
                      <Chip tone={isHexDigest(f.sha256) ? "ok" : "bad"}>{isHexDigest(f.sha256) ? "sha256 ✓" : "sha256 ?"}</Chip>
                    </div>
                    <div className="text-slate-700">bytes: {f.bytes}</div>
                    <div className="font-mono text-slate-700">{f.sha256}</div>
                  </div>
                ))}
              </div>
            </Collapse>
            <Collapse title="Verify your files against the manifest" defaultOpen>
              <FileVerifier manifest={manifest} />
            </Collapse>
          </div>
        )}
      </Section>

      <Section title="Signature / Attestor">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 text-[12px]">
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="mb-2 font-semibold">Seal</div>
            <div>hash: <span className="font-mono">{sealHash || "—"}</span></div>
            <div>window: <span className="font-mono">{accept?.windowKey ?? seal?.window?.key ?? "—"}</span></div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="mb-2 font-semibold">Acceptance</div>
            <div>id: <span className="font-mono">{accept?.acceptanceId || "—"}</span></div>
            <div>decision: {accept?.decision || "—"}</div>
            <div>sig: <span className="font-mono">{accept?.signature ? `${accept.signature.slice(0,18)}…` : "—"}</span></div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="mb-2 font-semibold">Header</div>
            <div>policy: {header?.policy_version || "—"}</div>
            <div>q: {header?.quorum ?? "—"} · F: {header?.freshness_s ?? "—"}s</div>
            <div>digest: <span className="font-mono">{header?.outputs_digest ? `${header.outputs_digest.slice(0,18)}…` : "—"}</span></div>
          </div>
        </div>
      </Section>
    </div>
  );
}
