// src/lib/isCorporateDomain.ts
// One file, no `any`, exports:
//  - emailDomain(email) -> string | null
//  - isCorporateDomain(domain) -> boolean
//  - isCorporateEmail(email) -> boolean

/** Extract the domain part from an email address. */
export function emailDomain(email: string): string | null {
  const m = String(email).trim().toLowerCase().match(/^[^@]+@([^@]+)$/);
  return m ? m[1] : null;
}

/**
 * Known free email providers that should NOT count as corporate/organization.
 * Tweak this list as needed for your policy.
 */
const FREE_EMAIL_DOMAINS = new Set<string>([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "ymail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  "aol.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "proton.me",
  "protonmail.com",
  "gmx.com",
  "gmx.net",
  "mail.com",
  "yandex.com",
  "yandex.ru",
  "zoho.com",
  "pm.me",
]);

/**
 * Some disposable/temporary providers (non-exhaustive).
 * You can extend this with your internal list if needed.
 */
const DISPOSABLE_SUFFIXES: ReadonlyArray<string> = [
  ".tempmailo.com",
  ".temp-mail.org",
  ".10minutemail.com",
  ".guerrillamail.com",
  ".mailinator.com",
  ".trashmail.com",
  ".discard.email",
  ".sharklasers.com",
];

/**
 * Decide if a domain should be treated as corporate/organization.
 * Rules:
 *  - Reject if the domain is in common free-mail providers.
 *  - Reject if the domain matches known disposable suffixes.
 *  - Allow .edu/.ac, .gov, .mil as organization-like.
 *  - Otherwise, treat non-free domains as corporate.
 */
export function isCorporateDomain(domain: string): boolean {
  const d = domain.trim().toLowerCase();

  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(d)) return false;

  if (FREE_EMAIL_DOMAINS.has(d)) return false;
  if (DISPOSABLE_SUFFIXES.some((s) => d.endsWith(s))) return false;

  if (/\.(edu|ac|gov|mil)$/i.test(d)) return true;

  // Everything else (non-free, non-disposable, valid TLD) counts as corporate/org.
  return true;
}

/**
 * Convenience: check an email directly.
 * Returns true only if the email has a valid domain AND that domain is corporate by the rules above.
 */
export function isCorporateEmail(email: string): boolean {
  const dom = emailDomain(email);
  return !!dom && isCorporateDomain(dom);
}
