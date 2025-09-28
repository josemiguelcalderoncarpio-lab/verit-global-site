// src/components/AccessSurveyModal.tsx
"use client";
import React from "react";

export function AccessSurveyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [busy, setBusy] = React.useState(false);
  const [sent, setSent] = React.useState<null | "auto" | "manual">(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);

    // Build a typed plain object from FormData without using `any`
    const fd = new FormData(e.currentTarget);
    const entries = Array.from(fd.entries()).map(([k, v]) => [
      k,
      typeof v === "string" ? v : v.name, // if a File ever appears, send its name
    ] as const);
    const data: Record<string, string> = Object.fromEntries(entries);

    const r = await fetch("/api/access/request", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });

    setBusy(false);
    if (r.ok) {
      const j = await r.json();
      setSent(j.autoApproved ? "auto" : "manual");
    } else {
      alert("Something went wrong.");
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30">
      <form onSubmit={onSubmit} className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl space-y-4">
        <h3 className="text-lg font-semibold">Request access to Exclusive Content</h3>
        <p className="text-sm text-slate-600">
          Unlock advanced demos, downloads, and deep-dive docs. Use your <strong>work email</strong> for instant access.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <label className="col-span-2 text-sm">
            Work email
            <input name="email" type="email" required className="mt-1 w-full rounded border px-2 py-1.5" />
          </label>
          <label className="text-sm">
            Name
            <input name="name" className="mt-1 w-full rounded border px-2 py-1.5" />
          </label>
          <label className="text-sm">
            Company / site
            <input name="company" className="mt-1 w-full rounded border px-2 py-1.5" />
          </label>
          <label className="col-span-2 text-sm">
            Role
            <select name="role" className="mt-1 w-full rounded border px-2 py-1.5">
              <option>Product</option>
              <option>Engineering</option>
              <option>Finance</option>
              <option>Ops</option>
              <option>Other</option>
            </select>
          </label>
          <label className="col-span-2 text-sm">
            Use case (1–2 sentences)
            <textarea name="use_case" rows={3} className="mt-1 w-full rounded border px-2 py-1.5" />
          </label>
          <label className="col-span-2 inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="consent" required /> I agree to be contacted about this access.
          </label>
        </div>

        {sent === "auto" && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-800 text-sm">
            ✅ Thanks! We sent a magic link to your email. Click it to unlock Exclusive Content.
          </div>
        )}
        {sent === "manual" && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800 text-sm">
            ✉️ Thanks! We received your request. We’ll review and follow up shortly.
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded border px-3 py-1.5">
            Close
          </button>
          <button disabled={busy} className="rounded bg-emerald-600 px-3 py-1.5 text-white disabled:opacity-50">
            {busy ? "Sending…" : "Send request"}
          </button>
        </div>
      </form>
    </div>
  );
}
