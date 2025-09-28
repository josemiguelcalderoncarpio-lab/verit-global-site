// src/app/vgomini/layout.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import { VGOProvider } from "./vgo/VGOProvider";

/** Keys must match your /vgomini/@* folder names */
const STEPS = [
  { key: "gateway",    label: "Gateway" },
  { key: "intake",     label: "Intake" },
  { key: "order",      label: "Order" },
  { key: "accumulate", label: "Accumulate" },
  { key: "policy",     label: "Policy" },
  { key: "carry",      label: "Carry" },
  { key: "seal",       label: "Seal" },
  { key: "acceptance", label: "Acceptance" },
  { key: "export",     label: "Export" },
  { key: "audit",      label: "Audit" },
] as const;

type StepKey = (typeof STEPS)[number]["key"];

/* ─────────── Updated gating: email OR cookie ─────────── */
function hasAuthCookie(): boolean {
  if (typeof document === "undefined") return false;
  return /(?:^|;\s*)verit_auth=/.test(document.cookie);
}
function readEmailFromConsent(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("verit:consent:v1");
    if (!raw) return null;
    const obj = JSON.parse(raw);
    const email = typeof obj?.email === "string" ? obj.email.trim() : "";
    return email && email.includes("@") ? email : null;
  } catch {
    return null;
  }
}
function hasAccess(): boolean {
  // Keep supporting your existing cookie, but also allow saved consent to unlock
  if (hasAuthCookie()) return true;
  return Boolean(readEmailFromConsent());
}
function requireAuthAndRedirect(toKey: StepKey) {
  const base = typeof window !== "undefined" ? window.location.origin : "";
  const returnTo = `/vgomini#${toKey}`;
  const url = `${base}/agree?returnTo=${encodeURIComponent(returnTo)}&title=VGOmini`;
  window.location.href = url;
}

/* ─────────── Equal-width connected chevrons ─────────── */
const H = 56;
const TAIL = 22;
const OVERLAP = 2;
const PILL_W = 132;
const ACTIVE_BG = "rgb(15 23 42)";
const ACTIVE_FG = "#fff";
const INACTIVE_BG = "rgb(241 245 249)";
const INACTIVE_FG = "rgb(71 85 105)";
const INACTIVE_BG_HOVER = "rgb(226 232 240)";
const BORDER = "rgb(226 232 240)";

function ConnectedChevron({
  label, active, disabled, onClick, isFirst, isLast,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  const pill: React.CSSProperties = {
    height: H,
    width: PILL_W,
    padding: "0 12px",
    borderTopLeftRadius: 9999,
    borderBottomLeftRadius: 9999,
    background: active ? ACTIVE_BG : INACTIVE_BG,
    color: active ? ACTIVE_FG : INACTIVE_FG,
    fontWeight: 700,
    fontSize: 13,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    lineHeight: 1,
    borderTop: `1px solid ${active ? ACTIVE_BG : BORDER}`,
    borderBottom: `1px solid ${active ? ACTIVE_BG : BORDER}`,
    borderLeft: `1px solid ${active ? ACTIVE_BG : BORDER}`,
    borderRight: "none",
    userSelect: "none",
  };
  const tip: React.CSSProperties = {
    width: 0,
    height: 0,
    borderTop: `${H / 2}px solid transparent`,
    borderBottom: `${H / 2}px solid transparent`,
    borderLeft: `${TAIL}px solid ${active ? ACTIVE_BG : INACTIVE_BG}`,
    display: "inline-block",
  };
  const wrapper: React.CSSProperties = {
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled && !active ? 0.45 : 1,
    display: "inline-flex",
    alignItems: "center",
    marginLeft: isFirst ? 0 : -OVERLAP,
    borderTopRightRadius: isLast ? 9999 : 0,
    borderBottomRightRadius: isLast ? 9999 : 0,
  };

  return (
    <button
      type="button"
      aria-current={active ? "step" : undefined}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className="focus:outline-none focus:ring-2 focus:ring-slate-400"
      style={wrapper}
      onMouseEnter={(e) => {
        if (!active && !disabled) (e.currentTarget.firstElementChild as HTMLElement).style.background = INACTIVE_BG_HOVER;
      }}
      onMouseLeave={(e) => {
        if (!active && !disabled) (e.currentTarget.firstElementChild as HTMLElement).style.background = INACTIVE_BG;
      }}
    >
      <span style={pill}>{label}</span>
      <span aria-hidden style={tip} />
    </button>
  );
}

function ChevronBar({
  steps, activeKey, unlockedUntil, onStepClick, before,
}: {
  steps: readonly { key: StepKey; label: string }[];
  activeKey: StepKey;
  unlockedUntil: number;
  onStepClick?: (key: StepKey) => void;
  before?: React.ReactNode;
}) {
  const activeIndex = steps.findIndex((s) => s.key === activeKey);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
      <div className="flex flex-nowrap items-center overflow-x-auto" style={{ gap: 0, scrollbarGutter: "stable both-edges" }}>
        {before ? <div className="mr-3 shrink-0">{before}</div> : null}
        {steps.map((s, i) => (
          <ConnectedChevron
            key={s.key}
            label={s.label}
            active={i === activeIndex}
            disabled={i > unlockedUntil}
            onClick={() => onStepClick?.(s.key)}
            isFirst={i === 0}
            isLast={i === steps.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

function StepShell({ children }: { children: React.ReactNode }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-6">{children}</section>;
}

/* ──────────────── Hero ──────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200">
      <div className="relative h-[200px] w-full">
        <Image
          src="/images/vgosmini-hero.jpg"
          alt="VGOSmini banner"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/20 to-black/25" />
        <div className="absolute bottom-0 left-0 p-4">
          <h1 className="text-3xl font-extrabold tracking-wider text-white">
            <span className="uppercase">VGOS</span>
            <span className="uppercase text-emerald-300">mini</span>
          </h1>
          <p className="mt-1 text-xs text-white/90">
            Deterministic settlement, exactly-once ingestion, fixed-point arithmetic, signed transcript root.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────── Layout ───────────────────────────── */
export default function VGOminiLayout({
  children, info, gateway, intake, order, accumulate, policy, carry, seal, acceptance, export: exportStep, audit,
}: {
  children: React.ReactNode;
  info: React.ReactNode;
  gateway: React.ReactNode;
  intake: React.ReactNode;
  order: React.ReactNode;
  accumulate: React.ReactNode;
  policy: React.ReactNode;
  carry: React.ReactNode;
  seal: React.ReactNode;
  acceptance: React.ReactNode;
  export: React.ReactNode;
  audit: React.ReactNode;
}) {
  const [activeKey, setActiveKey] = React.useState<StepKey>("gateway");
  const [unlockedUntil, setUnlockedUntil] = React.useState<number>(0);
  const [showInfo, setShowInfo] = React.useState(false);

  const didHydrate = React.useRef(false);
  const showInfoRef = React.useRef(false);
  const FIRST_VISIT_KEY = "vgomini:firstVisitDone";

  React.useEffect(() => {
    showInfoRef.current = showInfo;
  }, [showInfo]);

  // First-load: Info or restore progress
  React.useEffect(() => {
    if (didHydrate.current) return;
    didHydrate.current = true;

    const hash = (typeof window !== "undefined" ? window.location.hash.replace(/^#/, "") : "") || "";
    const ls = typeof window !== "undefined" ? window.localStorage : undefined;

    const firstVisit = !ls?.getItem(FIRST_VISIT_KEY);
    if (hash === "info" || firstVisit) {
      setShowInfo(true);
      try { ls?.setItem(FIRST_VISIT_KEY, "1"); } catch {}
      setActiveKey("gateway");
      setUnlockedUntil(0);
      return;
    }

    try {
      const k = (ls?.getItem("vgomini:active") as StepKey) || "gateway";
      const u = Number(ls?.getItem("vgomini:unlockedUntil"));
      setActiveKey(k);
      setUnlockedUntil(Number.isFinite(u) ? u : 0);
    } catch {}
  }, []);

  // Persist progress (stable deps array)
  React.useEffect(() => {
    if (showInfoRef.current) return;
    try {
      localStorage.setItem("vgomini:active", activeKey);
      localStorage.setItem("vgomini:unlockedUntil", String(unlockedUntil));
    } catch {}
  }, [activeKey, unlockedUntil]);

  const unlockTo = React.useCallback((idx: number) => {
    setUnlockedUntil((u) => (idx > u ? idx : u));
  }, []);

  // Programmatic nav events (strings, no WindowEventMap typing)
  React.useEffect(() => {
    const nav = (to: StepKey) => {
      const targetIndex = STEPS.findIndex((s) => s.key === to);
      if (targetIndex >= 1 && !hasAccess()) {
        requireAuthAndRedirect(to);
        return;
      }
      unlockTo(targetIndex);
      setShowInfo(false);
      setActiveKey(to);
      try {
        if (window.location.hash === "#info") history.replaceState(null, "", "/vgomini");
      } catch {}
    };

    const handlers: [string, (e: Event) => void][] = [
      ["vgo:goto-gateway",    () => nav("gateway")],
      ["vgo:goto-intake",     () => nav("intake")],
      ["vgo:goto-order",      () => nav("order")],
      ["vgo:goto-accumulate", () => nav("accumulate")],
      ["vgo:goto-policy",     () => nav("policy")],
      ["vgo:goto-carry",      () => nav("carry")],
      ["vgo:goto-seal",       () => nav("seal")],
      ["vgo:goto-acceptance", () => nav("acceptance")],
      ["vgo:goto-export",     () => nav("export")],
      ["vgo:goto-audit",      () => nav("audit")],
      ["vgo:goto-info",       () => { setShowInfo(true); try { window.location.hash = "#info"; } catch {} }],
    ];

    // FIX: remove `as any` (use `as string`)
    handlers.forEach(([t, h]) => window.addEventListener(t as string, h as EventListener));
    return () => handlers.forEach(([t, h]) => window.removeEventListener(t as string, h as EventListener));
  }, [unlockTo]);

  // Unlock-next listeners (unchanged; strings to avoid typing errors)
  React.useEffect(() => {
    const byKey: Record<StepKey, number> = STEPS.reduce<Record<StepKey, number>>((acc, s, i) => {
      acc[s.key] = i;
      return acc;
    }, {} as Record<StepKey, number>);

    const unlockNext = (current: StepKey) => unlockTo(byKey[current] + 1);

    const subs = ([
      ["vgos:gateway-ready",    "gateway"],
      ["vgos:intake-ready",     "intake"],
      ["vgos:order-ready",      "order"],
      ["vgos:accumulate-ready", "accumulate"],
      ["vgos:policy-ready",     "policy"],
      ["vgos:carry-ready",      "carry"],
      ["vgos:seal-ready",       "seal"],
      ["vgos:acceptance-ready", "acceptance"],
      ["vgos:export-ready",     "export"],
      ["vgos:audit-ready",      "audit"],
    ] as const).map(([evt, key]) => {
      const h = () => unlockNext(key);
      window.addEventListener(evt as string, h as EventListener);
      return [evt, h] as const;
    });

    return () => subs.forEach(([evt, h]) => window.removeEventListener(evt as string, h as EventListener));
  }, [unlockTo]);

  // Keep Info visible if hash is #info
  React.useEffect(() => {
    const onHash = () => {
      const h = (window.location.hash || "").replace(/^#/, "");
      setShowInfo(h === "info");
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const slotByKey: Record<StepKey, React.ReactNode> = {
    gateway,
    intake,
    order,
    accumulate,
    policy,
    carry,
    seal,
    acceptance,
    export: exportStep,
    audit,
  };

  // Small info button
  const InfoButton = (
    <button
      type="button"
      aria-label="Info — How this demo works"
      title="Info — How this demo works"
      onClick={() => {
        setShowInfo(true);
        try { window.location.hash = "#info"; } catch {}
      }}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-600 text-white shadow-sm ring-1 ring-slate-400/40 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
    >
      <span className="font-black leading-none" style={{ fontSize: 20 }}>i</span>
    </button>
  );

  return (
    <VGOProvider>
      <div className="mx-auto w-full max-w-6xl space-y-5 px-4 py-6">
        <Hero />
        <ChevronBar
          steps={STEPS}
          activeKey={activeKey}
          unlockedUntil={unlockedUntil}
          before={InfoButton}
          onStepClick={(key) => {
            const idx = STEPS.findIndex((s) => s.key === key);
            // Gate Intake and beyond unless we have access (email/cookie)
            if (idx >= 1 && !hasAccess()) {
              requireAuthAndRedirect(key);
              return;
            }
            if (idx <= unlockedUntil) {
              setShowInfo(false);
              setActiveKey(key);
              try {
                if (window.location.hash === "#info") history.replaceState(null, "", "/vgomini");
              } catch {}
            }
          }}
        />
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          {showInfo ? info : (slotByKey[activeKey] ?? children)}
        </section>
      </div>
    </VGOProvider>
  );
}
