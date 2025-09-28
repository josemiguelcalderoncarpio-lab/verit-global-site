// src/app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  // Use your final domain when ready by setting NEXT_PUBLIC_SITE_URL on Vercel.
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://verit-global-site.vercel.app";
  const lastmod = new Date();

  // List only the pages you want indexed (omit /search, etc.)
  const routes = [
    "/",            // Home
    "/product",
    "/market",
    "/tech",
    "/investors",
    "/about",
    "/contact",
  ];

  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: lastmod,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
