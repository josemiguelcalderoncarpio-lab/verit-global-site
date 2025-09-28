"use client";

import { useEffect, useMemo, useState } from "react";

type LikertProps = {
  name: string;
  label: string;
  help?: string;
  required?: boolean;
};

function Likert({ name, label, help, required }: LikertProps) {
  const [value, setValue] = useState<number | null>(null);
  return (
    <div className="mb-6">
      <label className="block font-medium mb-1">{label}{required && <span className="text-rose-600">*</span>}</label>
      {help && <p className="text-sm text-gray-500 mb-2">{help}</p>}
      <div className="flex gap-3 items-center">
        {[1,2,3,4,5].map(n => (
          <label key={n} className="flex items-center gap-1">
            <input
              type="radio"
              name={name}
              value={n}
              checked={value === n}
              onChange={() => setValue(n)}
              required={required && n === 1} // ensure at least one required
            />
            <span className="text-sm">{n}</span>
          </label>
        ))}
      </div>
      {/* mirror value in a hidden input so formData has the number */}
      <input type="hidden" name={name} value={value ?? ""} />
    </div>
  );
}

export default function Page() {
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState<boolean | null>(null);

  // Capture UTM in URL; backend reads them from the URL automatically.
  // (No special handling needed here.)

  // Optional: prefill market from query ?market=Gaming
  const industryDefault = useMemo(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("market") || "";
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setOk(null);
    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/survey" + window.location.search, {
      method: "POST",
      body: form
    });
    const json = await res.json();
    setOk(!!json?.ok);
    setSubmitting(false);
    if (json?.ok) e.currentTarget.reset();
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-semibold mb-2">Quick Market Pulse (1–5)</h1>
      <p className="text-gray-600 mb-8">
        Answer about your <em>market</em>—not your company. 1 = never/low, 5 = very often/high.
      </p>

      <form onSubmit={onSubmit} className="space-y-2">
        {/* Honeypot (should stay empty) */}
        <input type="text" name="company" className="hidden" tabIndex={-1} autoComplete="off" />

        <div className="mb-6">
          <label className="block font-medium mb-1">Market</label>
          <input
            name="market"
            defaultValue={industryDefault}
            placeholder="e.g., Marketplaces/Gig"
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div className="mb-6">
          <label className="block font-medium mb-1">Optional contact (we hash it)</label>
          <input
            name="respondent_id"
            placeholder="email or handle (optional)"
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <Likert name="q1" label="Do payout totals change when runs are re-done in your market?" required />
        <Likert name="q2" label="Are tiny rounding differences a real issue at scale?" required />
        <Likert name="q3" label="How often do late/duplicate records force fixes after close?" required />
        <Likert name="q4" label="How common is it to hold payment until the math is verified and approvals are fresh?" required />
        <Likert name="q5" label="When payout logic or data sharding changes, how risky are mistakes?" required />
        <Likert name="q6" label="What pilot path seems most realistic (fit) for peers?" help="Higher = more realistic to adopt now" required />
        <Likert name="q7" label="Biggest barrier to adding this safety layer?" help="Higher = barrier is surmountable" required />

        <button
          type="submit"
          disabled={submitting}
          className="rounded-md px-4 py-2 bg-emerald-600 text-white disabled:opacity-60"
        >
          {submitting ? "Sending..." : "Submit"}
        </button>

        {ok === true && <p className="text-emerald-700 mt-3">Thanks! Your response was recorded.</p>}
        {ok === false && <p className="text-rose-700 mt-3">Something went wrong. Please try again.</p>}
      </form>
    </main>
  );
}
