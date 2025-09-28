// src/components/DownloadLink.tsx
"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { emailDomain, isCorporateDomain } from "@/lib/isCorporateDomain";

type Consent = { email: string; agreed: true; version: "v1" };
const LS_KEY = "verit:consent:v1";

function readConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

function isDownloadHref(href: string): boolean {
  return href.startsWith("/downloads/") || /\.(pdf|zip|csv|xlsx?|pptx?)$/i.test(href);
}

/**
 * DownloadLink
 * - For non-download hrefs -> renders normal <a> (you can wrap with <Link> elsewhere if you want).
 * - For downloads -> uses <a> but prevents Next client routing & triggers window.location for a reliable file load.
 */
export function DownloadLink({
  href,
  requireBusinessEmail = false,
  className,
  children,
  title,
  ariaLabel,
}: {
  href: string;
  requireBusinessEmail?: boolean;
  className?: string;
  children: React.ReactNode;
  title?: string;
  ariaLabel?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Only gate downloads
    if (!isDownloadHref(href)) return;

    const consent = readConsent();
    if (!consent) {
      e.preventDefault();
      const need = requireBusinessEmail ? "&need=business" : "";
      router.push(`/agree?return=${encodeURIComponent(pathname)}${need}`);
      return;
    }

    if (requireBusinessEmail) {
      const dom = emailDomain(consent.email);
      if (!dom || !isCorporateDomain(dom)) {
        e.preventDefault();
        router.push(`/agree?return=${encodeURIComponent(pathname)}&need=business`);
        return;
      }
    }

    // Consent OK (and corp if required) => trigger a hard navigation to the file
    // to avoid blank screen from client routing.
    e.preventDefault();
    window.location.href = href; // or window.open(href, "_self")
  };

  // For non-download destinations we just render a normal anchor (no gating)
  if (!isDownloadHref(href)) {
    return (
      <a href={href} className={className} title={title} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
      className={className}
      onClick={onClick}
      // Suggest download behavior to the browser (won't affect PDFs in all browsers, but harmless)
      download
      rel="noopener"
      title={title}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
