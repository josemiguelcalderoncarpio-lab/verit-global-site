// src/app/exclusive/downloads/[file]/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { existsSync, createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { basename, extname, normalize, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Readable } from "node:stream";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Make sure Vercel ships /exclusive/downloads/** with this function */
export const config = {
  unstable_includeFiles: ["exclusive/downloads/**"],
};

// --- MIME map (kept) ---
function contentTypeFor(ext: string): string {
  switch (ext.toLowerCase()) {
    case ".pdf":  return "application/pdf";
    case ".zip":  return "application/zip";
    case ".csv":  return "text/csv; charset=utf-8";
    case ".xlsx": return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case ".pptx": return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    default:      return "application/octet-stream";
  }
}

// Single-segment filename guard
function isSafeFilename(name: string) {
  return (
    !!name &&
    !name.includes("/") &&
    !name.includes("\\") &&
    !name.startsWith(".") &&
    name.trim().length > 0
  );
}

// Support Next 15 where ctx.params may be a Promise
type Params = { file: string };
type Ctx = { params: Params } | { params: Promise<Params> };
function isPromise<T>(v: unknown): v is Promise<T> {
  return typeof (v as { then?: unknown }).then === "function";
}
async function getParams(ctx: Ctx): Promise<Params> {
  const p = (ctx as { params: Params | Promise<Params> }).params;
  return isPromise<Params>(p) ? await p : p;
}

// Resolve candidate absolute paths that work locally and in Vercel bundle
function resolveCandidatePaths(fileName: string): string[] {
  const safe = basename(normalize(fileName));

  // 1) Project root (works in dev)
  const fromCwd = resolve(process.cwd(), "exclusive", "downloads", safe);

  // 2) Relative to this compiled route module (robust in prod)
  const here = dirname(fileURLToPath(import.meta.url));
  // Go back out of the compiled route folder to repo root, then into exclusive/downloads
  const fromModule = resolve(here, "../../../../../../exclusive/downloads", safe);

  return [fromCwd, fromModule];
}

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { file: raw } = await getParams(ctx);
  if (!raw) return NextResponse.json({ error: "missing_file_param" }, { status: 400 });

  let name: string;
  try {
    name = decodeURIComponent(raw);
  } catch {
    return NextResponse.json({ error: "bad_uri_component" }, { status: 400 });
  }
  if (!isSafeFilename(name)) {
    return NextResponse.json({ error: "invalid_file" }, { status: 400 });
  }

  const [abs1, abs2] = resolveCandidatePaths(name);
  const abs = existsSync(abs1) ? abs1 : existsSync(abs2) ? abs2 : null;

  if (!abs) {
    // helpful for Vercel logs if something goes wrong
    console.log("exclusive file not found", { abs1, abs2, cwd: process.cwd() });
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const stats = await stat(abs);
  const ext = extname(abs);
  const filename = basename(abs);

  const headers = new Headers();
  headers.set("Content-Type", contentTypeFor(ext));
  headers.set("Content-Length", String(stats.size));
  // **kept**: force download
  headers.set("Content-Disposition", `attachment; filename="${encodeURIComponent(filename)}"`);
  // **kept**: no caching
  headers.set("Cache-Control", "public, max-age=0, must-revalidate");

  const nodeStream = createReadStream(abs);
  const webStream = Readable.toWeb(nodeStream) as unknown as ReadableStream<Uint8Array>;
  return new Response(webStream, { headers });
}

export const HEAD = GET;
