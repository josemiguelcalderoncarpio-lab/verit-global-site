"use client";

import { useState } from "react";

// add/remove keys here as your demo evolves
const LOCAL_KEYS = [
  "verit:consent:v1",
  "verit:device:v1",
  "vgos:seal",
  "vgos:acceptance",
  "vgos:acceptance:header",
  "vgos:export",
];

function clearLocal() {
  try {
    for (const k of LOCAL_KEYS) localStorage.removeItem(k);
    // clear device cookie
    document.cookie = "verit_device=; Max-Age=0; Path=/; SameSite=Lax";
  } catch {}
}

export default function DevToolbar() {
  const [busy, setBusy] = useState(false);

  async function handleReset() {
    if (!confirm("Reset DEV database and clear local session/context?")) return;
    setBusy(true);
    try {
      clearLocal();
      const res = await fetch("/api/dev/reset-all", { method: "POST" });
      if (!res.ok) throw new Error(await res.text());
      alert("✅ Reset complete.");
      location.reload();
    } catch (e) {
      console.error(e);
      alert("❌ Reset failed. See console for details.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-black/70 text-white px-3 py-2 shadow-lg backdrop-blur"
      style={{ fontSize: 12 }}
      aria-label="Dev tools"
    >
      <span className="opacity-80">DEV</span>
      <button
        onClick={handleReset}
        disabled={busy}
        className="rounded-md px-3 py-1 bg-rose-600 disabled:opacity-50"
        title="Truncate DEV DB & clear local storage/cookies"
      >
        {busy ? "Resetting…" : "Reset Context & Data"}
      </button>
    </div>
  );
}
