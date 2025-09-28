"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Section } from "../components/UI";
import { INDEX, type SearchDoc } from "./searchIndex";;

/* ---------- tiny search utils (no libs) ---------- */

function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}
function tokenize(q: string) {
  return normalize(q).split(/[^a-z0-9]+/i).filter(Boolean);
}
function levenshtein(a: string, b: string) {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  // small DP for short tokens
  const prev = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    const curr = [i] as number[];
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1,            // deletion
        curr[j - 1] + 1,        // insertion
        prev[j - 1] + cost      // substitution
      );
    }
    for (let j = 0; j <= n; j++) prev[j] = curr[j];
  }
  return prev[n];
}
function fuzzyIncludes(hay: string, needle: string) {
  if (hay.includes(needle)) return { hit: true, fuzzy: false };
  // allow small typos for tokens length >= 4 (distance ≤ 1)
  if (needle.length >= 4) {
    const words = hay.split(/[^a-z0-9]+/i);
    for (const w of words) {
      if (Math.abs(w.length - needle.length) <= 1 && levenshtein(w, needle) <= 1) {
        return { hit: true, fuzzy: true };
      }
    }
  }
  return { hit: false, fuzzy: false };
}

type Scored = SearchDoc & { score: number; firstHit: number };

function scoreDoc(doc: SearchDoc, tokens: string[]): Scored {
  const title = normalize(doc.title);
  const body = normalize(doc.body);
  const tags = normalize((doc.tags || []).join(" "));
  let score = 0;
  let firstHit = Infinity;

  const phrase = tokens.join(" ");
  if (phrase && title.includes(phrase)) score += 30;

  tokens.forEach((t) => {
    const titleHit = fuzzyIncludes(title, t);
    const tagHit = fuzzyIncludes(tags, t);
    const bodyHit = fuzzyIncludes(body, t);

    if (titleHit.hit) score += titleHit.fuzzy ? 8 : 12;
    if (tagHit.hit) score += tagHit.fuzzy ? 7 : 10;
    if (bodyHit.hit) score += bodyHit.fuzzy ? 3 : 6;

    const posTitle = title.indexOf(t);
    const posBody = body.indexOf(t);
    const pos = Math.min(posTitle >= 0 ? posTitle : Infinity, posBody >= 0 ? posBody : Infinity);
    if (pos < firstHit) firstHit = pos;
  });

  // slight boost for shorter pages (feel snappier)
  if ((doc.body || "").length < 400) score += 2;

  return { ...doc, score, firstHit: firstHit === Infinity ? 999999 : firstHit };
}

function highlight(text: string, tokens: string[]) {
  // only highlight exact (not fuzzy) to keep it simple
  if (!tokens.length) return text;
  const out: React.ReactNode[] = [];
  const src = text;
  const re = new RegExp(`(${tokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(src))) {
    const [m] = match;
    const idx = match.index;
    out.push(src.slice(last, idx));
    out.push(<mark key={idx} className="rounded bg-yellow-200 px-0.5">{m}</mark>);
    last = idx + m.length;
  }
  out.push(src.slice(last));
  return out;
}

function snippet(body: string, tokens: string[], max = 180) {
  const nBody = normalize(body);
  let start = 0;
  for (const t of tokens) {
    const pos = nBody.indexOf(t);
    if (pos >= 0) { start = Math.max(0, pos - 50); break; }
  }
  const raw = body.slice(start, start + max);
  return (start > 0 ? "…" : "") + raw + (start + max < body.length ? "…" : "");
}

/* ---------- Search Page ---------- */

export default function SearchPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const initial = (sp.get("q") || "").trim();
  const [q, setQ] = useState(initial);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard: "/" focuses search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !/(input|textarea)/i.test((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const tokens = useMemo(() => tokenize(q), [q]);

  const results = useMemo(() => {
    if (!tokens.length) return [] as Scored[];
    return INDEX
      .map((d) => scoreDoc(d, tokens))
      .filter((d) => d.score > 0)
      .sort((a, b) => (b.score - a.score) || (a.firstHit - b.firstHit))
      .slice(0, 20);
  }, [tokens]);

  // Keep URL in sync (so header form & back/forward work)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (q) params.set("q", q); else params.delete("q");
    const url = `/search${params.toString() ? `?${params.toString()}` : ""}`;
    // replace (not push) for smoother typing
    router.replace(url);
  }, [q, router]);

  return (
    <Section title="Search">
      <form
        action="/search"
        method="GET"
        className="mb-6"
        onSubmit={(e) => {
          // we already live-update; let submit keep URL stable
          if (!q) e.preventDefault();
        }}
      >
        <label htmlFor="search-q" className="sr-only">Search</label>
        <input
          id="search-q"
          ref={inputRef}
          name="q"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search pages (try: payouts, fraud, ticketing, audit, API, patent)…"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base shadow-sm outline-none placeholder:text-slate-400 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]"
        />
        <p className="mt-2 text-xs text-slate-500">Tip: press <kbd className="rounded border bg-slate-50 px-1">/</kbd> to focus.</p>
      </form>

      {!q && <p className="text-slate-600">Type a query above. We support typos and multi-word searches.</p>}

      {q && results.length === 0 && (
        <div className="rounded-xl border border-slate-200 p-4 text-slate-700">
          <p>No results for <span className="font-medium text-slate-900">“{q}”</span>.</p>
          <p className="mt-1 text-sm">Try broader terms: <em>payouts</em>, <em>ticketing</em>, <em>fraud</em>, <em>audit</em>, <em>API</em>, <em>investors</em>.</p>
        </div>
      )}

      <ul className="space-y-4">
        {results.map((r) => (
          <li key={r.href} className="rounded-xl border border-slate-200 p-4 hover:bg-slate-50">
            <Link href={r.href} className="text-lg font-semibold text-slate-900 hover:text-[var(--brand)]">
              {highlight(r.title, tokens)}
            </Link>
            <p className="mt-1 text-[15px] text-slate-700">
              {highlight(snippet(r.body, tokens), tokens)}
            </p>
            {r.tags && r.tags.length > 0 && (
              <p className="mt-2 text-xs text-slate-500">Tags: {r.tags.join(", ")}</p>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}
