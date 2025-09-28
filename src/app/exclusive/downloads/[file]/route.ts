// src/app/exclusive/downloads/[file]/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";          // FS access requires Node runtime (not Edge)
export const dynamic = "force-dynamic";   // avoid static optimization

/* ──────────────────────────────────────────────────────────────────────────────
   Robust path resolution for production bundles
   - Tries common locations first
   - Falls back to a shallow, one-time search under /var/task
   - Caches results for this Lambda’s lifetime
   ──────────────────────────────────────────────────────────────────────────── */
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
        // Only descend into plausible places (keeps search fast)
        if (
          p.includes("exclusive") ||
          p.includes(".next") ||
          p === root
        ) {
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

/* ──────────────────────────────────────────────────────────────────────────────
   Types: support both Next versions where context.params is {file} or Promise<{file}>
   ──────────────────────────────────────────────────────────────────────────── */
type Params = { file: string };
type Ctx =
  | { params: Params }
  | { params: Promise<Params> };

function isPromiseParams(p: Params | Promise<Params>): p is Promise<Params> {
  return typeof (p as any)?.then === "function";
}

/* ──────────────────────────────────────────────────────────────────────────────
   Security helpers
   ──────────────────────────────────────────────────────────────────────────── */
const ALLOWED_EXT = new Set([".pdf", ".zip"]);

function sanitizeAndValidateFilename(raw: string): string | null {
  // Decode URI components (handles %20, etc.)
  const decoded = safeDecodeURIComponent(raw);
  const base = path.basename(decoded); // strip any path traversal
  const ext = path.extname(base).toLowerCase();
  if (!ALLOWED_EXT.has(ext)) return null;
  // optional: block sneaky traversal patterns
  if (base.includes("..") || base.includes("/") || base.includes("\\")) return null;
  return base;
}

function safeDecodeURIComponent(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

/* ──────────────────────────────────────────────────────────────────────────────
   MAIN HANDLER
   ──────────────────────────────────────────────────────────────────────────── */
export async function GET(req: NextRequest, context: Ctx) {
  // ── 1) KEEP YOUR EXISTING GATING/AUTH LOGIC HERE (unchanged) ───────────────
  // If your current file had email gating (cookies/tokens/domain checks/etc.),
  // move that exact block here. Return the same 401/redirect you already use
  // when access should be denied. Nothing else in this file depends on it.
  //
  // Example placeholder (DELETE this comment & use YOUR existing code):
  // const authorized = await yourAuthorizeFunction(req);
  // if (!authorized) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  // ── 2) Get filename from params, supporting both typed shapes ──────────────
  const p = isPromiseParams(context.params) ? await context.params : context.params;
  const rawFile = p.file;

  // ── 3) Sanitize & validate ────────────────────────────────────────────────
  const file = sanitizeAndValidateFilename(rawFile);
  if (!file) {
    return NextResponse.json({ error: "invalid_filename" }, { status: 400 });
  }

  // ── 4) Resolve absolute path robustly (prod-safe) ─────────────────────────
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

  // ── 5) Stream the file (keeps your download headers/behavior) ─────────────
  const stat = await fsp.stat(abs);
  const stream = fs.createReadStream(abs);

  // Choose content-type from extension
  const lower = file.toLowerCase();
  const contentType = lower.endsWith(".pdf")
    ? "application/pdf"
    : lower.endsWith(".zip")
    ? "application/zip"
    : "application/octet-stream";

  return new Response(stream as unknown as ReadableStream, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(stat.size),
      // keep as attachment (as before) so it downloads after gating
      "Content-Disposition": `attachment; filename="${file}"`,
      // ensure no caching of gated downloads
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
