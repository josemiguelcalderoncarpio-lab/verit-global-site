// src/app/vgomini/@acceptance/default.tsx
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AcceptanceGuide from "./AcceptanceGuide";

/* ---------------- Icons (unchanged) ---------------- */
const I = {
  Table: (p: React.SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 24 24" width="14" height="14" {...p}><path fill="currentColor" d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5zm2 2v3h14V7H5zm0 5v7h6v-7H5zm8 0v7h6v-7h-6z"/></svg>),
  CloudDown: (p: React.SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 24 24" width="16" height="16" {...p}><path fill="currentColor" d="M6 19a5 5 0 0 1 0-10 6 6 0 0 1 11.3-1.9A4.5 4.5 0 1 1 18 19H6zm6-3 4-4h-3V8h-2v4H8l4 4z"/></svg>),
  Check: (p: React.SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 24 24" width="16" height="16" {...p}><path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>),
  Alert: (p: React.SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 24 24" width="16" height="16" {...p}><path fill="currentColor" d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>),
  Download: (p: React.SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 24 24" width="16" height="16" {...p}><path fill="currentColor" d="M5 20h14v-2H5v2zM11 4h2v7h3l-4 4-4-4h3V4z"/></svg>),
  Copy: (p: React.SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 24 24" width="16" height="16" {...p}><path fill="currentColor" d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14h13a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/></svg>),
  Shield: (p: React.SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 24 24" width="16" height="16" {...p}><path fill="currentColor" d="M12 2l8 4v6c0 5-3.6 9.7-8 10-4.4-.3-8-5-8-10V6l8-4zm0 18c3-0.2 6-3.8 6-8V7.2L12 5 6 7.2V12c0 4.2 3 7.8 6 8z"/></svg>),
  RotateCcw: (p: React.SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 24 24" width="16" height="16" {...p}><path fill="currentColor" d="M12 5V1L7 6l5 5V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z"/></svg>),
  Lock: (p: React.SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 24 24" width="14" height="14" {...p}><path fill="currentColor" d="M7 10V7a5 5 0 0 1 10 0v3h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h1zm2 0h6V7a3 3 0 0 0-6 0v3z"/></svg>),
} as const;

/* ---------------- UI atoms (unchanged) ---------------- */
const Section: React.FC<{ title: string; right?: React.ReactNode; children: React.ReactNode }> = ({ title, right, children }) => (
  <div className="mb-4 rounded-xl border border-slate-300 bg-white">
    <div className="flex items-center justify-between rounded-t-xl border-b border-slate-300 bg-slate-100 px-3 py-2">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700"><I.Table /></span>
        <div className="text-[12px] font-semibold tracking-wide text-slate-700">{title}</div>
      </div>
      {right ? <div className="text-[12px] text-slate-700">{right}</div> : null}
    </div>
    <div className="p-3">{children}</div>
  </div>
);

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost"; leftIcon?: React.ReactNode }> = ({ variant = "ghost", className = "", children, disabled, leftIcon, ...rest }) => {
  const base = "inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm border transition";
  const tone = variant === "primary" ? "border-emerald-300 bg-white text-slate-900 enabled:hover:bg-emerald-50" : "border-slate-300 bg-white text-slate-700 enabled:hover:bg-slate-50";
  return <button type="button" className={`${base} ${tone} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`} disabled={disabled} {...rest}>{leftIcon}{children}</button>;
};

const Chip: React.FC<{ children: React.ReactNode; tone?: "ok" | "warn" | "muted" | "info" }> = ({ children, tone = "muted" }) => {
  const t = tone === "ok" ? "border-emerald-300 bg-emerald-50 text-emerald-700" : tone === "warn" ? "border-amber-300 bg-amber-50 text-amber-700" : tone === "info" ? "border-sky-300 bg-sky-50 text-sky-700" : "border-slate-300 bg-slate-100 text-slate-700";
  return <span className={`inline-flex items-center rounded-full border px-2 py-[2px] text-[11px] ${t}`}>{children}</span>;
};

/* ---------------- Keys & helpers ---------------- */
const KEY_SEAL = "vgos:seal";
const KEY_ACCEPT = "vgos:acceptance";
const KEY_POLICY_ALLOW = "vgos:policy_allowlist";
const KEY_PAYOUT_HEADER = "vgos:payout_header";
const KEY_TRANSCRIPT_NOTES = "vgos:transcript:acceptance:notes";
const KEY_RETURN_TO = "vgo:returnTo";

type Sealed = {
  sealHash: string;
  window?: { key?: string };
  counts?: { events?: number; principals?: number; eligible?: number };
  targets?: { target_total_minor?: number; sum_after_carry_minor?: number; remainder_minor?: number };
  policy?: { manifestHash?: string; target_total_minor?: number; version?: string };
  final_after?: { principal: string; cents: number }[];
  final?: { principal: string; final_minor: number }[];
};

type PayoutHeader = {
  window_id: string;
  policy_version: string;
  outputs_digest: string;
  quorum: number;
  freshness_s: number;
  expiry: string;
  signer_id: string;
};

type ProofKind = "ACK" | "SPV" | "CT";
type Proof = {
  kind: ProofKind;
  signer: string;
  ts: string;
  sig?: string;
  digest: string;
  ok: boolean;
  reason_code?: "STALE_PROOF" | "INVALID_SIGNATURE" | "VERIFIER_UNAVAILABLE";
};

type AcceptanceBundle = {
  kinds: ProofKind[];
  quorum: number;
  freshness_s: number;
  proofs: Proof[];
  verified: boolean;
  reason_code: null | "STALE_PROOF" | "INSUFFICIENT_QUORUM" | "INVALID_SIGNATURE" | "VERIFIER_UNAVAILABLE";
};

type Acceptance = {
  version: string;
  acceptanceId: string;
  decidedAt: string;
  decision: "ALLOW" | "HOLD";
  reasons?: string;
  sealedHash: string;
  policyHash?: string | null;
  windowKey?: string;
  counts?: Sealed["counts"];
  target_total_minor: number;
  sum_final_minor: number;
  finals: { principal: string; cents: number }[];
  header: PayoutHeader;
  bundle: AcceptanceBundle;
  signature: string;
};

type AcceptNote = {
  at: string;
  code: "ACCEPT_ALLOW" | "ACCEPT_HOLD";
  reason: string | null;
  bundle: { verified: boolean; reason_code: AcceptanceBundle["reason_code"] | null; quorum: number; freshness_s: number };
};

function readJSON<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try { const s = sessionStorage.getItem(key) ?? localStorage.getItem(key); return s ? (JSON.parse(s) as T) : null; } catch { return null; }
}
const money = (minor: number) => `$${(minor / 100).toFixed(2)}`;

/* ---------------- Return helpers (kept for Audit use) ---------------- */
function isFilePath(v?: string | null) {
  if (!v) return false;
  const x = v.toLowerCase();
  return x.endsWith(".pdf") || x.endsWith(".zip") || x.includes("/exclusive/downloads/") || x.includes("/downloads/");
}
function isAcceptanceSelf(path: string) {
  try {
    const here = window.location.pathname.toLowerCase();
    return /acceptance/.test(here) && path.toLowerCase() === here;
  } catch { return false; }
}
function normalizeSameOrigin(v?: string | null): string | null {
  if (!v) return null;
  const t = v.trim();
  try {
    if (/^https?:\/\//i.test(t)) {
      const u = new URL(t);
      if (u.origin !== window.location.origin) return null;
      return (u.pathname || "/") + (u.search || "");
    }
    if (t.startsWith("/")) return t;
    const u = new URL(t, window.location.href);
    if (u.origin !== window.location.origin) return null;
    return (u.pathname || "/") + (u.search || "");
  } catch { return null; }
}
function sameOriginReferrer(): string | null {
  try {
    if (!document.referrer) return null;
    const u = new URL(document.referrer);
    if (u.origin !== window.location.origin) return null;
    return (u.pathname || "/") + (u.search || "");
  } catch { return null; }
}

/** Typed narrowing for history.state without `any`. */
function getHistoryReturnTo(): string | null {
  try {
    const st: unknown = window.history?.state;
    if (st && typeof st === "object" && "returnTo" in st) {
      const val = (st as Record<string, unknown>).returnTo;
      return typeof val === "string" ? val : null;
    }
    return null;
  } catch {
    return null;
  }
}

function resolveExplicitTarget(params: URLSearchParams): string | null {
  const q = (k: string) => normalizeSameOrigin(params.get(k) || undefined);
  const cand =
    q("returnTo") ??
    q("r") ??
    q("go") ??
    normalizeSameOrigin(getHistoryReturnTo()) ??
    normalizeSameOrigin(sameOriginReferrer());

  const bad = (p: string | null) => !p || p === "/contact" || isAcceptanceSelf(p);
  if (bad(cand)) {
    try { if ((sessionStorage.getItem(KEY_RETURN_TO) || "") === "/contact") sessionStorage.removeItem(KEY_RETURN_TO); } catch {}
    return null;
  }
  try { sessionStorage.setItem(KEY_RETURN_TO, cand!); } catch {}
  return cand;
}
function navigateBackSmart(to: string | null, router: ReturnType<typeof useRouter>) {
  if (to && isFilePath(to)) { window.location.href = to; return; }
  // Intentionally DO NOT use history.back() here to avoid /contact bounce.
  if (to && to !== "/contact") { router.replace(to); return; }
  router.replace("/");
}

export default function AcceptanceStep() {
  const router = useRouter();
  const params = useSearchParams();

  // Compute explicit target once; DO NOT default to '/contact'
  const explicitReturnTo = React.useMemo(() => resolveExplicitTarget(params), [params]);
  const returnRef = React.useRef<string | null>(explicitReturnTo);

  /* ---------------- Existing functionality (unchanged) ---------------- */

  const [sealed, setSealed] = React.useState<Sealed | null>(null);
  const [finals, setFinals] = React.useState<{ principal: string; cents: number }[]>([]);
  const [targetMinor, setTargetMinor] = React.useState<number>(0);
  const [sumMinor, setSumMinor] = React.useState<number>(0);
  const [eventsCount, setEventsCount] = React.useState<number>(0);
  const [principalsCount, setPrincipalsCount] = React.useState<number>(0);
  const [eligibleCount, setEligibleCount] = React.useState<number>(0);
  const [policyHash, setPolicyHash] = React.useState<string | null>(null);
  const [windowKey, setWindowKey] = React.useState<string | undefined>(undefined);
  const [policyVersion, setPolicyVersion] = React.useState<string>("v1.0.0");

  // controls
  const [preset, setPreset] = React.useState<"strict" | "normal" | "lenient">("normal");
  const [secret, setSecret] = React.useState<string>("demo-secret");
  const [decision, setDecision] = React.useState<"ALLOW" | "HOLD">("HOLD");
  const [reasons, setReasons] = React.useState<string>("");

  // payout header & bundle controls
  const [quorum, setQuorum] = React.useState<number>(2);
  const [freshnessS, setFreshnessS] = React.useState<number>(3600);
  const [signerId] = React.useState<string>("ack-local-demo");

  // acceptance presence (and binding to current seal)
  const [accepted, setAccepted] = React.useState<boolean>(false);
  const [acceptArtifact, setAcceptArtifact] = React.useState<Acceptance | null>(null);

  const caps = React.useMemo(() => {
    if (preset === "strict") return { perPrincipalMax: 50_000_00, principalsMax: 200 };
    if (preset === "lenient") return { perPrincipalMax: 2_000_000_00, principalsMax: 10_000 };
    return { perPrincipalMax: 500_000_00, principalsMax: 2000 };
  }, [preset]);

  const loadFromSeal = React.useCallback(() => {
    const s = readJSON<Sealed>(KEY_SEAL);
    setSealed(s ?? null);

    const f =
      (s?.final_after && s.final_after.map((x) => ({ principal: x.principal, cents: Number(x.cents || 0) }))) ||
      (s?.final && s.final.map((x) => ({ principal: x.principal, cents: Number(x.final_minor || 0) }))) ||
      [];
    setFinals(f);

    const tgt =
      s?.targets?.target_total_minor ??
      s?.policy?.target_total_minor ??
      f.reduce((acc, r) => acc + r.cents, 0);
    setTargetMinor(Number(tgt || 0));

    const sum = f.reduce((acc, r) => acc + r.cents, 0);
    setSumMinor(sum);

    setEventsCount(Number(s?.counts?.events || 0));
    setPrincipalsCount(f.length);
    setEligibleCount(Number(s?.counts?.eligible || 0));
    setPolicyHash(s?.policy?.manifestHash ?? null);
    setPolicyVersion(s?.policy?.version ?? "v1.0.0");
    setWindowKey(s?.window?.key);

    const a = readJSON<Acceptance>(KEY_ACCEPT);
    if (a && s && a.sealedHash === s.sealHash) {
      setAccepted(true);
      setAcceptArtifact(a);
      setDecision(a.decision);
      setReasons(a.reasons || "");
    } else {
      setAccepted(false);
      setAcceptArtifact(null);
    }
  }, []);

  React.useEffect(() => { loadFromSeal(); }, [loadFromSeal]);

  React.useEffect(() => {
    const h1: EventListener = () => { loadFromSeal(); };
    const h2: EventListener = () => { loadFromSeal(); };
    const h3 = (e: StorageEvent) => {
      if (!e.key) return;
      if ([KEY_SEAL, KEY_ACCEPT, KEY_PAYOUT_HEADER].includes(e.key)) loadFromSeal();
    };
    window.addEventListener("vgos:seal-ready", h1);
    window.addEventListener("focus", h2);
    window.addEventListener("storage", h3);
    return () => {
      window.removeEventListener("vgos:seal-ready", h1);
      window.removeEventListener("focus", h2);
      window.removeEventListener("storage", h3);
    };
  }, [loadFromSeal]);

  /* ---------------- Validations ---------------- */
  const allowList = readJSON<string[]>(KEY_POLICY_ALLOW) || null;

  const exists = Boolean(sealed?.sealHash);
  const sumEqTarget = targetMinor > 0 && sumMinor === targetMinor;
  const remainderOk = typeof sealed?.targets?.remainder_minor === "number" ? sealed?.targets?.remainder_minor === 0 : true;
  const allowPolicy = allowList ? (policyHash ? allowList.includes(policyHash) : false) : true;
  const nonNeg = finals.every((r) => r.cents >= 0);
  const withinPrincipalCap = finals.every((r) => r.cents <= caps.perPrincipalMax);
  const withinCountCap = finals.length <= caps.principalsMax;

  React.useEffect(() => {
    const allOk = exists && sumEqTarget && remainderOk && allowPolicy && nonNeg && withinPrincipalCap && withinCountCap;
    setDecision(allOk ? "ALLOW" : "HOLD");
    if (!allOk && !reasons) {
      const why: string[] = [];
      if (!exists) why.push("no sealed digest");
      if (!sumEqTarget) why.push("sum ≠ target");
      if (!remainderOk) why.push("remainder ≠ 0");
      if (!allowPolicy) why.push("policy hash not allowed");
      if (!nonNeg) why.push("negative payouts");
      if (!withinPrincipalCap) why.push("per-principal over cap");
      if (!withinCountCap) why.push("too many principals");
      setReasons(why.join("; "));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exists, sumEqTarget, remainderOk, allowPolicy, nonNeg, withinPrincipalCap, withinCountCap]);

  const ready = accepted;

  /* ---------------- Helper: build payout header ---------------- */
  const buildHeader = (): PayoutHeader => {
    const expiryIso = new Date(Date.now() + freshnessS * 1000).toISOString();
    return {
      window_id: String(windowKey || "unknown"),
      policy_version: policyVersion,
      outputs_digest: String(sealed?.sealHash || ""),
      quorum,
      freshness_s: freshnessS,
      expiry: expiryIso,
      signer_id: "ack-local-demo",
    };
  };

  /* ---------------- Helper: build & verify bundle ---------------- */
  async function hmacSha256Hex(secret: string, message: string): Promise<string> {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
    const bytes = Array.from(new Uint8Array(sig));
    return "0x" + bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  const makeAck = async (digest: string): Promise<Proof> => {
    const ts = new Date().toISOString();
    const sig = await hmacSha256Hex(secret || "demo-secret", `ack-local-demo|${digest}|${ts}`);
    return { kind: "ACK", signer: "ack-local-demo", ts, sig, digest, ok: true };
  };
  const makeSpv = (digest: string): Proof => ({ kind: "SPV", signer: "spv-demo", ts: new Date().toISOString(), digest, ok: false, reason_code: "VERIFIER_UNAVAILABLE" });
  const makeCt = (digest: string): Proof => ({ kind: "CT", signer: "ct-demo", ts: new Date().toISOString(), digest, ok: false, reason_code: "VERIFIER_UNAVAILABLE" });

  const verifyBundle = (bundle: AcceptanceBundle): AcceptanceBundle => {
    const now = Date.now();
    let stale = false;
    for (const p of bundle.proofs) {
      const ageS = Math.max(0, Math.floor((now - Date.parse(p.ts)) / 1000));
      if (ageS > bundle.freshness_s) { p.ok = false; p.reason_code = "STALE_PROOF"; stale = true; }
      if (p.kind === "ACK" && (!p.sig || !p.sig.startsWith("0x"))) { p.ok = false; p.reason_code = "INVALID_SIGNATURE"; }
      if (p.digest !== (sealed?.sealHash || "")) { p.ok = false; p.reason_code = "INVALID_SIGNATURE"; }
    }
    const okCount = bundle.proofs.filter((p) => p.ok).length;
    const quorumOk = okCount >= bundle.quorum;
    return { ...bundle, verified: quorumOk && !stale, reason_code: !quorumOk ? "INSUFFICIENT_QUORUM" : stale ? "STALE_PROOF" : null };
  };

  /* ---------------- Banner (Return removed) ---------------- */
  const Banner = () => (
    <div className={`mb-3 flex items-center justify-between rounded-lg border px-3 py-2 text-[13px] ${ready ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
      <div className="flex items-center gap-2">
        {ready ? <I.Check /> : <I.Alert />}
        <span>{ready ? "Acceptance committed. Continue to Export." : "To continue, load Seal, review validations, configure header/bundle, choose ALLOW/HOLD, and commit the decision."}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={["inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[13px] font-medium", ready ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-amber-500/60 text-white cursor-not-allowed"].join(" ")}
          disabled={!ready}
          onClick={() => { if (!ready) return; window.dispatchEvent(new CustomEvent("vgo:goto-export")); }}
        >
          Continue to Export <span aria-hidden>↦</span>
        </button>
        {/* Return button intentionally removed on Acceptance */}
      </div>
    </div>
  );

  /* ---------------- Actions ---------------- */
  const onCommit = async () => {
    if (!sealed?.sealHash) { alert("No sealed digest found. Seal first."); return; }
    if (decision === "HOLD" && !reasons.trim()) { alert("Please enter reasons for HOLD."); return; }

    const header = buildHeader();
    try {
      sessionStorage.setItem(KEY_PAYOUT_HEADER, JSON.stringify(header));
      localStorage.setItem(KEY_PAYOUT_HEADER, JSON.stringify(header));
    } catch {}

    const proofs: Proof[] = [await makeAck(sealed.sealHash), makeSpv(sealed.sealHash), makeCt(sealed.sealHash)];
    const kinds: AcceptanceBundle["kinds"] = ["ACK", "SPV", "CT"];
    let bundle: AcceptanceBundle = { kinds, quorum, freshness_s: freshnessS, proofs, verified: false, reason_code: null };
    bundle = verifyBundle(bundle);

    let finalDecision: "ALLOW" | "HOLD" = decision;
    let finalReasons = reasons.trim();
    if (decision === "ALLOW" && !bundle.verified) {
      finalDecision = "HOLD";
      finalReasons = bundle.reason_code || "bundle not verified";
    }

    const acceptanceId = crypto.randomUUID();
    const receiptSig = await hmacSha256Hex(secret || "demo-secret", `${acceptanceId}|${sealed.sealHash}`);

    const artifact: Acceptance = {
      version: "v1.0.0",
      acceptanceId,
      decidedAt: new Date().toISOString(),
      decision: finalDecision,
      reasons: finalReasons || undefined,
      sealedHash: sealed.sealHash,
      policyHash: policyHash ?? null,
      windowKey,
      counts: sealed.counts,
      target_total_minor: targetMinor,
      sum_final_minor: sumMinor,
      finals,
      header,
      bundle,
      signature: receiptSig,
    };

    try {
      const s = JSON.stringify(artifact);
      sessionStorage.setItem(KEY_ACCEPT, s);
      localStorage.setItem(KEY_ACCEPT, s);

      // Update local UI state
      setAcceptArtifact(artifact);
      setAccepted(true);

      // Persist transcript note
      const notes = readJSON<AcceptNote[]>(KEY_TRANSCRIPT_NOTES) || [];
      notes.push({
        at: new Date().toISOString(),
        code: finalDecision === "ALLOW" ? "ACCEPT_ALLOW" : "ACCEPT_HOLD",
        reason: artifact.reasons || null,
        bundle: { verified: bundle.verified, reason_code: bundle.reason_code, quorum, freshness_s: freshnessS },
      });
      try { sessionStorage.setItem(KEY_TRANSCRIPT_NOTES, JSON.stringify(notes)); } catch {}

      // Notify other panes
      window.dispatchEvent(new CustomEvent("vgos:acceptance-ready"));

      // Inform user; stay on page (no implicit navigation to avoid /contact bounce)
      alert("Acceptance committed. Use “Continue to Export ↦” when ready.");

      // If you ever want to auto-advance without history/back:
      // if (finalDecision === "ALLOW") window.dispatchEvent(new CustomEvent("vgo:goto-export"));
    } catch {
      alert("Failed to persist acceptance.");
    }
  };

  const downloadAcceptance = () => {
    if (!acceptArtifact) return;
    const name = `vgos-acceptance-${acceptArtifact.acceptanceId}.json`;
    const blob = new Blob([JSON.stringify(acceptArtifact, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    if (!finals.length) return;
    const header = "principal,final_minor\n";
    const rows = finals.map((r) => `${r.principal},${r.cents}`).join("\n");
    const csv = header + rows + "\n";
    const fname = `vgos-payouts-${String(windowKey || "window").replace(/[^\w.-]+/g, "_")}.csv`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = fname; document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };

  const copySealHash = async () => {
    if (!sealed?.sealHash) return;
    try { await navigator.clipboard.writeText(sealed.sealHash); } catch {}
  };

  const reopenAcceptance = () => {
    try {
      sessionStorage.removeItem(KEY_ACCEPT);
      localStorage.removeItem(KEY_ACCEPT);
    } catch {}
    setAccepted(false);
    setAcceptArtifact(null);
  };

  /* ---------------- UI ---------------- */
  const headerChip = (() => {
    const h = readJSON<PayoutHeader>(KEY_PAYOUT_HEADER);
    return h ? <Chip tone="ok">header ✓</Chip> : <Chip>header: —</Chip>;
  })();

  const bundleChips = (() => {
    const h = readJSON<PayoutHeader>(KEY_PAYOUT_HEADER);
    const a = acceptArtifact;
    const root: React.ReactNode[] = [];
    root.push(a?.bundle?.verified ? <Chip key="b1" tone="ok">bundle ✓</Chip> : <Chip key="b1" tone="warn">bundle?</Chip>);
    root.push(<Chip key="b2">Q: {quorum}</Chip>);
    root.push(<Chip key="b3">F: {freshnessS}s</Chip>);
    if (h?.expiry) root.push(<Chip key="b4" tone="info"><I.Lock />&nbsp;exp</Chip>);
    return <div className="flex flex-wrap items-center gap-2">{root}</div>;
  })();

  return (
    <div className="mx-auto max-w-6xl">
      {/* Field guide */}
      <div className="mb-3 rounded-lg border border-slate-300 bg-white p-3">
        <div className="text-[12px] font-semibold tracking-wide text-slate-800">Acceptance — field guide</div>
        <div className="mt-1 max-h-40 overflow-y-auto rounded border border-slate-200 bg-slate-50 p-2">
          <AcceptanceGuide />
        </div>
      </div>

      {/* Banner */}
      <Banner />

      {/* Controls */}
      <Section
        title="Controls"
        right={<div className="flex flex-wrap items-center gap-2">
          <Chip>events: {eventsCount}</Chip>
          <Chip>principals: {principalsCount}</Chip>
          <Chip>eligible: {eligibleCount}</Chip>
          <Chip>target: {money(targetMinor)}</Chip>
          <Chip tone={sealed?.sealHash ? "ok" : "warn"}>{sealed?.sealHash ? "sealed ✓" : "no sealed digest"}</Chip>
          {headerChip}
        </div>}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" leftIcon={<I.CloudDown />} onClick={loadFromSeal} aria-label="Get from Seal">Get from Seal</Button>

          <label className="text-[12px] text-slate-700">Preset:&nbsp;
            <select className="rounded-md border border-slate-300 bg-white px-2 py-1 text-[12px] text-slate-800" value={preset} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPreset(e.target.value as "strict" | "normal" | "lenient")} aria-label="Preset">
              <option value="strict">strict</option>
              <option value="normal">normal</option>
              <option value="lenient">lenient</option>
            </select>
          </label>

          <label className="text-[12px] text-slate-700">Quorum Q:&nbsp;
            <input type="number" min={1} className="w-20 rounded-md border border-slate-300 bg-white px-2 py-1 text-[12px] text-slate-800" value={quorum} onChange={(e) => setQuorum(Math.max(1, Number(e.target.value || 1)))} aria-label="Quorum" />
          </label>

          <label className="text-[12px] text-slate-700">Freshness F (sec):&nbsp;
            <input type="number" min={0} className="w-24 rounded-md border border-slate-300 bg-white px-2 py-1 text-[12px] text-slate-800" value={freshnessS} onChange={(e) => setFreshnessS(Math.max(0, Number(e.target.value || 0)))} aria-label="Freshness seconds" />
          </label>

          <label className="text-[12px] text-slate-700">HMAC secret:&nbsp;
            <input type="password" className="rounded-md border border-slate-300 bg-white px-2 py-1 text-[12px] text-slate-800" value={secret} onChange={(e) => setSecret(e.target.value)} suppressHydrationWarning aria-label="Signer secret" />
          </label>

          <div className="ml-auto flex items-center gap-2">
            <Button leftIcon={<I.Copy />} onClick={copySealHash} disabled={!sealed?.sealHash} aria-label="Copy seal hash">Copy seal hash</Button>
            <Button leftIcon={<I.Download />} onClick={downloadCSV} disabled={!finals.length} aria-label="Download CSV">Payout CSV</Button>
            <Button leftIcon={<I.Download />} onClick={downloadAcceptance} disabled={!acceptArtifact} aria-label="Download acceptance">Download acceptance</Button>
            <Button leftIcon={<I.RotateCcw />} onClick={reopenAcceptance} disabled={!accepted} aria-label="Reopen">Reopen</Button>
          </div>
        </div>
      </Section>

      {/* Validations */}
      <Section
        title="Validations"
        right={
          <div className="flex flex-wrap items-center gap-2">
            <Chip tone={sumEqTarget ? "ok" : "warn"}>Σ final == target</Chip>
            <Chip tone={remainderOk ? "ok" : "warn"}>remainder == 0</Chip>
            <Chip tone={allowPolicy ? "ok" : "warn"}>policy allowed</Chip>
            <Chip tone={nonNeg ? "ok" : "warn"}>non-negative</Chip>
            <Chip tone={withinPrincipalCap ? "ok" : "warn"}>per-principal ≤ cap</Chip>
            <Chip tone={withinCountCap ? "ok" : "warn"}>count ≤ cap</Chip>
          </div>
        }
      >
        <ul className="space-y-1 text-[12px] leading-5 text-slate-800">
          <li className="flex items-center gap-2">{sumEqTarget ? <I.Check /> : <I.Alert />} Σ(final) = {sumMinor}¢ ({money(sumMinor)}), target = {targetMinor}¢ ({money(targetMinor)})</li>
          <li className="flex items-center gap-2">{remainderOk ? <I.Check /> : <I.Alert />} remainder from Seal is {sealed?.targets?.remainder_minor ?? 0}¢</li>
          <li className="flex items-center gap-2">{allowPolicy ? <I.Check /> : <I.Alert />} policy hash {policyHash ? <code className="rounded bg-slate-100 px-1">{policyHash}</code> : "—"} {allowPolicy ? "is allowed" : "is NOT in allow-list"}</li>
          <li className="flex items-center gap-2">{nonNeg ? <I.Check /> : <I.Alert />} no negative payouts</li>
          <li className="flex items-center gap-2">{withinPrincipalCap ? <I.Check /> : <I.Alert />} per-principal ≤ {money(caps.perPrincipalMax)}</li>
          <li className="flex items-center gap-2">{withinCountCap ? <I.Check /> : <I.Alert />} principals ≤ {caps.principalsMax}</li>
        </ul>
      </Section>

      {/* Decision */}
      <Section title="Decision">
        <div className="flex flex-wrap items-center gap-4">
          <label className="inline-flex items-center gap-2 text-[12px] text-slate-800">
            <input type="radio" name="decision" value="ALLOW" checked={decision === "ALLOW"} onChange={() => setDecision("ALLOW")} aria-label="Decision allow" />
            ALLOW
          </label>
          <label className="inline-flex items-center gap-2 text-[12px] text-slate-800">
            <input type="radio" name="decision" value="HOLD" checked={decision === "HOLD"} onChange={() => setDecision("HOLD")} aria-label="Decision hold" />
            HOLD
          </label>
          <label className="ml-4 text-[12px] text-slate-700">
            Reasons (required for HOLD):&nbsp;
            <input
              type="text"
              className="w-[360px] rounded-md border border-slate-300 bg-white px-2 py-1 text-[12px] text-slate-800"
              value={reasons}
              onChange={(e) => setReasons(e.target.value)}
              placeholder="Why HOLD? (caps, policy mismatch, etc.)"
              aria-label="Hold reasons"
            />
          </label>

          <Button variant="primary" leftIcon={<I.Shield />} className="ml-auto" onClick={onCommit} disabled={!sealed?.sealHash || (decision === "HOLD" && !reasons.trim())} aria-label="Commit decision">
            Commit decision
          </Button>
        </div>
      </Section>

      {/* Final allocations */}
      <Section title="Final allocations (for export)" right={<div className="flex items-center gap-2"><Chip>Σ final: {money(sumMinor)}</Chip><Chip>target: {money(targetMinor)}</Chip></div>}>
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
              {finals.length === 0 ? (
                <tr className="text-slate-600"><td className="px-3 py-3" colSpan={3}>No finals. Load a sealed snapshot.</td></tr>
              ) : (
                finals.map((r) => (
                  <tr key={r.principal} className="border-t border-slate-200 [&>td]:px-3 [&>td]:py-1.5">
                    <td className="font-mono">{r.principal}</td>
                    <td>{r.cents}</td>
                    <td>{money(r.cents)}</td>
                  </tr>
                ))
              )}
            </tbody>
            {finals.length > 0 && (
              <tfoot className="bg-slate-50 text-slate-800">
                <tr className="[&>td]:px-3 [&>td]:py-2 font-semibold">
                  <td>Σ totals</td>
                  <td>{sumMinor}</td>
                  <td>{money(sumMinor)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </Section>
    </div>
  );
}
