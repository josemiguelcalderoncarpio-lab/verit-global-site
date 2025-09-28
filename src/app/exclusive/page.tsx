// src/app/exclusive/page.tsx
export default function ExclusivePage() {
  return (
    <main className="mx-auto max-w-5xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Exclusive content</h1>
      <p className="text-slate-700">
        You now have access to advanced demo features, downloads, and deep-dive docs.
      </p>
      <a href="/vgomini#audit" className="inline-block rounded bg-emerald-600 px-3 py-1.5 text-white">
        Open Audit in the demo
      </a>
    </main>
  );
}
