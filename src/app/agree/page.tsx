// src/app/agree/page.tsx
"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { emailDomain, isCorporateDomain } from "@/lib/isCorporateDomain";
import BypassBanner from "./BypassBanner";

export const dynamic = "force-dynamic";

/**
 * When true, we bypass all gating (business email, magic-link, etc.),
 * immediately attempt the download (if the target looks like a file),
 * and then return to the caller.
 *
 * Keep this false for real gating.
 */
const BYPASS_GATES = false;

/* ===================== Wrapper ===================== */
export default function AgreePage() {
  return (
    <Suspense fallback={null}>
      <InnerAgree />
    </Suspense>
  );
}

/* ===================== Types ===================== */
type Purpose =
  | "investor_kit"
  | "partner_deck"
  | "founding_customers"
  | "whitepaper"
  | "other";

type ConsentPayload = {
  name: string;
  email: string;
  role: string;
  company?: string;
  purpose: Purpose;
  agreed: true;
  at: string;
  version: "v1";
};

const LS_KEY = "verit:consent:v1";

/* ===================== Utils (original) ===================== */
function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
function isFilePath(p: string) {
  return (
    p.startsWith("/downloads/") ||
    p.startsWith("/exclusive/downloads/") ||
    /\.(pdf|zip|csv|xlsx?|pptx?|docx?)$/i.test(p)
  );
}
function isExclusivePath(p: string) {
  return p.startsWith("/exclusive/downloads/");
}
function readConsent(): ConsentPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentPayload;
    return parsed?.agreed === true && parsed?.version === "v1" ? parsed : null;
  } catch {
    return null;
  }
}

/* Gate cookies expected by middleware */
function setGateCookies(email: string) {
  const oneYear = 60 * 60 * 24 * 365;
  // Host-scoped cookies (work on www.veritglobal.com). Add Domain=.veritglobal.com later if you need cross-subdomain.
  document.cookie = `vg_access_granted=1; Max-Age=${oneYear}; Path=/; Secure; SameSite=Lax`;
  document.cookie = `vg_user_email=${encodeURIComponent(email || "")}; Max-Age=${oneYear}; Path=/; Secure; SameSite=Lax`;
}

/* ---------- return helpers (original) ---------- */
function normalizeSameOrigin(v?: string | null): string | null {
  if (!v) return null;
  const t = v.trim();
  try {
    if (/^https?:\/\//i.test(t)) {
      const u = new URL(t);
      if (typeof window !== "undefined" && u.origin !== window.location.origin) return null;
      return (u.pathname || "/") + (u.search || "");
    }
    if (t.startsWith("/")) return t;
    const u = new URL(t, typeof window !== "undefined" ? window.location.href : "http://x/");
    if (typeof window !== "undefined" && u.origin !== window.location.origin) return null;
    return (u.pathname || "/") + (u.search || "");
  } catch {
    return null;
  }
}
function sameOriginReferrer(): string | null {
  try {
    if (typeof document === "undefined" || !document.referrer) return null;
    const u = new URL(document.referrer);
    if (typeof window !== "undefined" && u.origin !== window.location.origin) return null;
    return (u.pathname || "/") + (u.search || "");
  } catch {
    return null;
  }
}
/** History-first smart return (original) */
function navigateBackSmart(
  explicit: string | null | undefined,
  router: ReturnType<typeof useRouter>
) {
  const to = explicit ? normalizeSameOrigin(explicit) : null;

  if (to && isFilePath(to)) {
    // File downloads should navigate directly
    window.location.href = to;
    return;
  }
  if (typeof window !== "undefined" && window.history.length > 1) {
    window.history.back();
    return;
  }
  if (to && to !== "/product") {
    router.replace(to);
    return;
  }
  const ref = sameOriginReferrer();
  if (ref && ref !== "/product") {
    router.replace(ref);
    return;
  }
  router.replace("/");
}

/* ===================== Page ===================== */
function InnerAgree(): React.ReactElement {
  const router = useRouter();
  const params = useSearchParams();

  // Accept several query keys; do NOT default to /contact or /product here
  const explicitParam =
    params.get("return") ||
    params.get("returnTo") ||
    params.get("r") ||
    params.get("go") ||
    null;

  const returnTo = normalizeSameOrigin(explicitParam) || "";
  const needBusiness =
    params.get("need") === "business" || (returnTo ? isFilePath(returnTo) : false);
  const requireEmailVerification = returnTo ? isExclusivePath(returnTo) : false;

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [purpose, setPurpose] = React.useState<Purpose>("whitepaper");
  const [agree, setAgree] = React.useState(false);

  const [submitting, setSubmitting] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const [ok, setOk] = React.useState(false);

  // Magic-link state (original)
  const [emailSent, setEmailSent] = React.useState(false);
  const [lastSentTo, setLastSentTo] = React.useState<string | null>(null);

  // mount flag for hydration-safe footer
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  // Back action (original)
  const goBack = React.useCallback(() => {
    navigateBackSmart(returnTo || null, router);
  }, [router, returnTo]);

  // Prefill from saved consent (original)
  React.useEffect(() => {
    const saved = readConsent();
    if (!saved) return;
    setName((v) => v || saved.name || "");
    setEmail((v) => v || saved.email || "");
    setRole((v) => v || saved.role || "");
    setCompany((v) => v || saved.company || "");
  }, []);

  /* ----------------- TEMP BYPASS: always succeed & download ----------------- */
  const bypassAndFinish = React.useCallback(async () => {
    // 1) best-effort store a minimal consent payload (keeps analytics continuity)
    const payload: ConsentPayload = {
      name: name || "(bypass)",
      email: email || "bypass@example.com",
      role: role || "(bypass)",
      company: company || undefined,
      purpose,
      agreed: true,
      at: new Date().toISOString(),
      version: "v1",
    };
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(payload));
    } catch {}

    // 2) fire-and-forget survey log like before (kept original shape)
    try {
      await fetch("/api/survey", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: "consent",
          needBusiness,
          ...payload,
          asset: returnTo && isFilePath(returnTo) ? returnTo : undefined,
        }),
      });
    } catch {}

    // 2.5) set the gate cookies so middleware will allow on return
    setGateCookies(email || "bypass@example.com");

    // 3) if it looks like a file, trigger download first
    if (returnTo && isFilePath(returnTo)) {
      try {
        const a = document.createElement("a");
        a.href = returnTo;
        a.download = "";
        a.rel = "noopener";
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch {
        window.open(returnTo, "_blank", "noopener,noreferrer");
      }
    }

    // 4) then navigate back to where they came from
    navigateBackSmart(returnTo || null, router);
  }, [company, email, name, needBusiness, purpose, returnTo, role, router]);

  /* ----------------- ORIGINAL: magic-link sender (kept; unused in bypass) -----------------
  async function sendMagicLink(toEmail: string) {
    const redirect_to = returnTo || "/";
    const res = await fetch("/api/magic-link", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: toEmail, redirect_to }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j?.error || "magic_link_failed");
    }
    setEmailSent(true);
    setLastSentTo(toEmail);
  }
  --------------------------------------------------------------------- */

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setSubmitting(true);

    // ---------------- BYPASS BLOCK ----------------
    if (BYPASS_GATES) {
      setOk(true);
      await bypassAndFinish();
      setSubmitting(false);
      return;
    }
    // ---------------- END BYPASS ------------------

    // ---------------- ORIGINAL VALIDATION (kept) ----------------
    const nameVal = name.trim();
    const emailVal = email.trim().toLowerCase();
    const roleVal = role.trim();
    const companyVal = company.trim();

    if (!nameVal) return setErr("Please enter your name.");
    if (!isValidEmail(emailVal)) return setErr("Please enter a valid email address.");

    const dom = emailDomain(emailVal);
    if (!dom) return setErr("Email must include a domain.");

    if (needBusiness && !isCorporateDomain(dom)) {
      return setErr("A business / organization email is required for this download.");
    }

    if (!roleVal) return setErr("Please enter your role/title.");
    if (!purpose) return setErr("Please select a purpose.");
    if (!agree) return setErr("Please accept the Terms and Privacy Policy to proceed.");

    const payload: ConsentPayload = {
      name: nameVal,
      email: emailVal,
      role: roleVal,
      company: companyVal || undefined,
      purpose,
      agreed: true,
      at: new Date().toISOString(),
      version: "v1",
    };

    try {
      localStorage.setItem(LS_KEY, JSON.stringify(payload));
    } catch {}

    try {
      await fetch("/api/survey", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: "consent",
          needBusiness,
          ...payload,
          asset: returnTo && isFilePath(returnTo) ? returnTo : undefined,
        }),
      });
    } catch {}

    // Make cookies available for middleware before we redirect/download
    setGateCookies(emailVal);

    setOk(true);
    setSubmitting(false);

    if (requireEmailVerification) {
      /* try {
        await sendMagicLink(emailVal);
      } catch {
        setErr("We couldn't send the verification email. Please try again.");
      }
      return; */
      // Kept intentionally commented while verification flow is not enabled.
    }

    if (returnTo && isFilePath(returnTo)) {
      // Trigger download
      try {
        const a = document.createElement("a");
        a.href = returnTo;
        a.download = "";
        a.rel = "noopener";
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch {
        window.open(returnTo, "_blank", "noopener,noreferrer");
      }
    }

    // Return to caller (history-first)
    navigateBackSmart(returnTo || null, router);
    // ---------------- END ORIGINAL ----------------
  }

  // If user edits the email, clear previous “sent” state (original)
  const handleEmailChange = (v: string) => {
    setEmail(v);
    setEmailSent(false);
    setLastSentTo(null);
    setErr(null);
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-xl flex-col justify-center px-4 py-8">
      <div className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
        <header className="mb-5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Before you download
          </h1>
          <p className="mt-1 text-[15px] leading-7 text-slate-700">
            We ask for minimal info to enable downloads and protect our materials.
          </p>
          <BypassBanner enabled={BYPASS_GATES} />
        </header>

        {/* UI kept the same so it looks familiar */}
        <form onSubmit={onSubmit} noValidate suppressHydrationWarning>
          <label className="mb-3 block">
            <span className="mb-1 block text-sm font-medium text-slate-800">Name</span>
            <input
              type="text"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
              placeholder="Your name"
              required
              spellCheck={false}
            />
          </label>

          <label className="mb-3 block">
            <span className="mb-1 block text-sm font-medium text-slate-800">
              Email{" "}
              {needBusiness && <em className="text-slate-500">(business/org required)</em>}
            </span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => handleEmailChange(e.currentTarget.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
              placeholder={needBusiness ? "you@company.com" : "you@example.com"}
              required
              spellCheck={false}
            />
          </label>

          <label className="mb-3 block">
            <span className="mb-1 block text-sm font-medium text-slate-800">Role / Title</span>
            <input
              type="text"
              name="role"
              autoComplete="organization-title"
              value={role}
              onChange={(e) => setRole(e.currentTarget.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
              placeholder="e.g., Founder, VP Engineering, Finance Manager"
              required
              spellCheck={false}
            />
          </label>

          <label className="mb-3 block">
            <span className="mb-1 block text-sm font-medium text-slate-800">
              Company <span className="text-slate-500">(optional)</span>
            </span>
            <input
              type="text"
              name="company"
              autoComplete="organization"
              value={company}
              onChange={(e) => setCompany(e.currentTarget.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
              placeholder="Company name"
              spellCheck={false}
            />
          </label>

          <label className="mb-3 block">
            <span className="mb-1 block text-sm font-medium text-slate-800">
              What are you downloading?
            </span>
            <select
              name="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.currentTarget.value as Purpose)}
              className="w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
              required
            >
              <option value="whitepaper">Whitepaper / technical brief</option>
              <option value="investor_kit">Investor kit</option>
              <option value="partner_deck">Sales / Partner deck</option>
              <option value="founding_customers">Founding Customers program deck</option>
              <option value="other">Other</option>
            </select>
          </label>

          <label className="mb-4 flex cursor-pointer items-start gap-2">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.currentTarget.checked)}
              className="mt-[2px] h-4 w-4 rounded border-slate-400 text-slate-900 focus:ring-0"
              aria-describedby="terms"
              required
            />
            <span id="terms" className="text-sm leading-6 text-slate-800">
              I agree to the processing of my information in accordance with the{" "}
              <a href="/privacy" className="underline hover:text-slate-900">Privacy Policy</a>{" "}
              and <a href="/terms" className="underline hover:text-slate-900">Terms</a>.
            </span>
          </label>

          {err && (
            <div className="mb-3 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-800">
              {err}
            </div>
          )}

          {ok && (
            <div className="mb-3 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              We’re processing your request…
            </div>
          )}

          <div className="mt-1 flex items-center justify-between gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Agree and continue"
            >
              {submitting ? "Saving…" : "Agree & continue"}
            </button>

            {/* Cancel should always leave this page */}
            <button
              type="button"
              onClick={() => navigateBackSmart(returnTo || null, router)}
              className="text-sm text-slate-700 underline hover:text-slate-900"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Render this only on client after mount to avoid hydration mismatches */}
      <p className="mt-4 text-center text-[12px] leading-5 text-slate-600">
        You were sent here from:{" "}
        <span className="font-mono">
          {mounted ? (returnTo || sameOriginReferrer() || "/") : ""}
        </span>
      </p>
    </div>
  );
}
