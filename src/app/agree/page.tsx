"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { emailDomain, isCorporateDomain } from "@/lib/isCorporateDomain";

export const dynamic = "force-dynamic";

/* ===================== Original Implementation wrapped in Suspense ===================== */
export default function AgreePage() {
  return (
    <Suspense fallback={null}>
      <InnerAgree />
    </Suspense>
  );
}

/* ===================== The original page contents live here unchanged ===================== */

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

/* ---------- utilities (kept from your version) ---------- */
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

/* ---------- helpers for robust return behavior ---------- */
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
  } catch {
    return null;
  }
}
function sameOriginReferrer(): string | null {
  try {
    if (!document.referrer) return null;
    const u = new URL(document.referrer);
    if (u.origin !== window.location.origin) return null;
    return (u.pathname || "/") + (u.search || "");
  } catch {
    return null;
  }
}
/** History-first smart return
 * 1) If explicit target is a file → direct navigate (href)
 * 2) Else if browser has real history → history.back()
 * 3) Else if explicit same-origin target exists and is not '/product' → router.replace(target)
 * 4) Else if same-origin referrer exists and is not '/product' → router.replace(referrer)
 * 5) Else → router.replace('/')  (no /contact)
 */
function navigateBackSmart(
  explicit: string | null | undefined,
  router: ReturnType<typeof useRouter>
) {
  const to = explicit ? normalizeSameOrigin(explicit) : null;

  if (to && isFilePath(to)) {
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

function InnerAgree() {
  const router = useRouter();
  const params = useSearchParams();

  // Accept several query keys; do NOT default to /contact or /product here
  const explicitParam =
    params.get("return") ||
    params.get("returnTo") ||
    params.get("r") ||
    params.get("go") ||
    null;

  const returnTo = normalizeSameOrigin(explicitParam) || ""; // keep original variable name for downstream logic
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

  // Magic-link state
  const [emailSent, setEmailSent] = React.useState(false);
  const [lastSentTo, setLastSentTo] = React.useState<string | null>(null);

  // mount flag for hydration-safe footer
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  // Replace hardcoded /contact: use smart history-first return
  const goBack = React.useCallback(() => {
    navigateBackSmart(returnTo || null, router);
  }, [router, returnTo]);

  React.useEffect(() => {
    const saved = readConsent();
    if (!saved) return;
    setName((v) => v || saved.name || "");
    setEmail((v) => v || saved.email || "");
    setRole((v) => v || saved.role || "");
    setCompany((v) => v || saved.company || "");
  }, []);

  async function sendMagicLink(toEmail: string) {
    // Send the caller path back to your API (fallback to '/' not '/contact')
    const go = returnTo || "/";
    const res = await fetch("/api/magic-link", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: toEmail, go }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j?.error || "magic_link_failed");
    }
    setEmailSent(true);
    setLastSentTo(toEmail);
  }

  async function triggerPublicDownload() {
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

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);

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

    setSubmitting(true);

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

    setOk(true);
    setSubmitting(false);

    if (requireEmailVerification) {
      try {
        await sendMagicLink(emailVal); // ALWAYS send to current email
      } catch {
        setErr("We couldn't send the verification email. Please try again.");
      }
      return; // wait for user to click email
    }

    if (returnTo && isFilePath(returnTo)) {
      await triggerPublicDownload();
    }

    // Return to caller (history-first). No /contact or /product fallback.
    navigateBackSmart(returnTo || null, router);
  }

  async function onResend() {
    const current = email.trim().toLowerCase();
    if (!isValidEmail(current)) {
      setErr("Please enter a valid email address before resending.");
      return;
    }
    setSubmitting(true);
    setErr(null);
    try {
      await sendMagicLink(current); // resend to CURRENT email
    } catch {
      setErr("We couldn't resend the email. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // IMPORTANT: if the user edits the email, clear any previous “sent” state
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
        </header>

        {/* suppressHydrationWarning helps if a browser extension injects attributes */}
        <form onSubmit={onSubmit} noValidate suppressHydrationWarning>
          <label className="mb-3 block">
            <span className="mb-1 block text-sm font-medium text-slate-800">
              Name
            </span>
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
              {needBusiness && (
                <em className="text-slate-500">(business/org required)</em>
              )}
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
            <span className="mb-1 block text-sm font-medium text-slate-800">
              Role / Title
            </span>
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

          {ok && !requireEmailVerification && (
            <div className="mb-3 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              Thanks! Your download should start shortly.
            </div>
          )}

          {ok && requireEmailVerification && (
            <div className="mb-3 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              <div className="font-semibold">Confirm your email</div>
              <div className="mt-1">
                We’ve sent a secure link to{" "}
                <span className="font-mono">{email.trim().toLowerCase()}</span>. Click it to
                verify your email and we’ll start your download automatically.
              </div>
              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onResend}
                  disabled={submitting}
                  className="rounded-md border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium hover:bg-amber-100 disabled:opacity-60"
                >
                  {submitting ? "Resending…" : "Resend link"}
                </button>
                <span className="text-xs text-slate-600">
                  Wrong address? Edit above and submit again.
                </span>
              </div>
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

            {ok ? (
              <button
                type="button"
                onClick={goBack}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                aria-label="Return"
              >
                Return
              </button>
            ) : (
              <button
                type="button"
                onClick={goBack}
                className="text-sm text-slate-700 underline hover:text-slate-900"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Render this only on client after mount to avoid hydration mismatches */}
      <p className="mt-4 text-center text-[12px] leading-5 text-slate-600">
        You were sent here from:{" "}
        <span className="font-mono">
          {returnTo || sameOriginReferrer() || "/"}
        </span>
      </p>
    </div>
  );
}
