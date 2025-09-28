// src/lib/db.ts
import { neon } from "@neondatabase/serverless";

const isProd = process.env.NODE_ENV === "production";

// Accept either set of names so local/dev/prod all work:
const url =
  (isProd ? process.env.DATABASE_URL : process.env.DEV_DATABASE_URL) ||
  (isProd ? process.env.POSTGRES_URL : process.env.POSTGRES_URL_DEV);

if (!url) {
  throw new Error(
    `Missing DB URL. Set one of:
 - PROD:   DATABASE_URL or POSTGRES_URL
 - DEV:    DEV_DATABASE_URL or POSTGRES_URL_DEV
(in Vercel or .env.local respectively).`
  );
}

export const sql = neon(url);
