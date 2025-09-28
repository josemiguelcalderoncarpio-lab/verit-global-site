// src/app/exclusive/downloads/[file]/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";        // needed for FS access
export const dynamic = "force-dynamic"; // do not statically optimize

/* ────────────────────────────────────────────────────────────────────────────
   Robust path resolution for production bundles
   - Tries common locations first
   - Falls back to a shallow, one-time search under /var/task
   - Caches results for this Lambda’s lifetime
   ────────────────────────────────────────────────────────────────────────── */
const FILE_CACHE = new Map<string, string>();

function tryCommonSpots(filename: string): string | null {
  const cwd = process.cwd();
  const guesses = [
    path.join(cwd, "exclusive", "downloads", filename),                           // /var/task/exclusive/...
    path.join("/var", "exclusive", "downloads", filename),                        // /var/exclusive/...
    path.join(cwd, ".next", "server", "app", "exclusive", "downloads", filename), // traced under .next/server/app/...
    path.join(cwd, ".next", "server", "chunks", "exclusive", "downloads", filename),
  ];
  for (const p of guesses) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

async function searchOnceUnderTask(filename: string): Promise<string | null> {
  const root = "/var/task";
  const queue: string[] = [root];
  const visited = new Set<string>();
  let steps = 0;
  const MAX_STEPS = 3000; // safety limit

  while (queue.length && steps < MAX_STEPS) {
    const dir = queue.shift()!;
    if (visited.has(dir)) continue;
    visited.add(dir);

    let entries: fs.Dirent[];
    try {
      entries = await fsp.readdir(dir, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const e of entries) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) {
        // only descend into plausible places (keeps search fast)
        if (p.includes("exclusive") || p.includes(".next") || p === root) {
          queue.push(p);
        }
      } else if (e.isFile() && e.name === filename) {
        return p;
      }
      steps++;
      if (steps >= MAX_STEPS) break;
    }
  }
  return null;
}

async function resolveExclusivePath(filename: string): Promise<string | null> {
  if (FILE_CACHE.has(filename)) return FILE_CACHE.get(filename)!;

  const fast = tryCommonSpots(filename);
  if (fast) {
    FILE_CACHE.set(filename, fast);
    return fast;
  }
  const found = await searchOnceUnderTask(filename);
  if (found) {
    FILE_CACHE.set(filename, found);
    return found;
  }
  return null;
}

/* ────────────────────────────────────────────────────────────────────────────
   Helpers & types
   ────────────────────────────────────────────────────────────────────────── */
type Params = { file: string };

function isPromiseLike<T>(value: unknown): value is PromiseLike<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "then" in (value as object) &&
    typeof (value as { then: unknown }).then === "function"
  );
}

const ALLOWED_EXT = new Set([".pdf", ".zip"]);

function safeDecodeURIComponent(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

function sanitizeAndValidateFilename(raw: string): string | null {
  const decoded = safeDecodeURIComponent(raw);
  const base = path.basename(decoded); // strip any traversal
  const ext = path.extname(base).toLowerCase();
  if (!ALLOWED_EXT.has(ext)) return null;
  if (base.includes("..") || base.includes("/") || base.includes("\\")) return null;
  return base;
}

/* ────────────────────────────────────────────────────────────────────────────
   Main handler
   ────────────────────────────────────────────────────────────────────────── */
export async function GET(
  req: NextRequest,
  context: { params: Params | Promise<Params> }
) {
  // ── 1) KEEP YOUR EXISTING GATING/AUTH LOGIC HERE (unchanged) ─────────────
  // e.g. if (!authorized) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  // ── 2) Read params (supports both direct and Promise forms) ──────────────
  const maybeParams = context.params as unknown;
  const params: Params = isPromiseLike<Params>(maybeParams)
    ? await maybeParams
    : (maybeParams as Params);

  const rawFile = params.file;
  const file = sanitizeAndValidateFilename(rawFile);
  if (!file) {
    return NextResponse.json({ error: "invalid_filename" }, { status: 400 });
  }

  // ── 3) Resolve absolute path robustly (prod-safe) ────────────────────────
  const abs = await resolveExclusivePath(file);
  if (!abs) {
    console.warn("exclusive file not found (after include + search)", {
      file,
      absTried: [
        path.join(process.cwd(), "exclusive", "downloads", file),
        path.join("/var", "exclusive", "downloads", file),
        path.join(process.cwd(), ".next", "server", "app", "exclusive", "downloads", file),
        path.join(process.cwd(), ".next", "server", "chunks", "exclusive", "downloads", file),
      ],
      cwd: process.cwd(),
    });
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  // ── 4) Stream the file (keeps your download behavior/headers) ───────────
  const stat = await fsp.stat(abs);
  const nodeStream = fs.createReadStream(abs);

  const lower = file.toLowerCase();
  const contentType =
    lower.endsWith(".pdf")
      ? "application/pdf"
      : lower.endsWith(".zip")
      ? "application/zip"
      : "application/octet-stream";

  return new Response(nodeStream as unknown as ReadableStream, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(stat.size),
      "Content-Disposition": `attachment; filename="${file}"`,
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
