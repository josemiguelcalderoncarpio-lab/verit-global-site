// src/lib/token.ts

import jwt, { SignOptions, VerifyOptions, JwtPayload } from "jsonwebtoken";

/** Shape we expect to store inside the JWT */
export type AccessTokenPayload = {
  email: string;
  features: string[];
  // Standard JWT fields are allowed to be present after verification:
  iat?: number;
  exp?: number;
  nbf?: number;
  iss?: string;
  sub?: string;
  aud?: string | string[];
  jti?: string;
  [k: string]: unknown;
};

/**
 * Sign an access token (HS256 by default).
 * Equivalent behavior to previous `require('jsonwebtoken')` version.
 */
export function signToken(
  payload: AccessTokenPayload,
  secret: string,
  options: SignOptions = {}
): string {
  // Default to HS256 unless caller overrides in options
  const algFallback: SignOptions = { algorithm: "HS256" };
  return jwt.sign(payload, secret, { ...algFallback, ...options });
}

/**
 * Verify an access token. Returns the decoded payload on success, or null on failure.
 */
export function verifyToken<T extends AccessTokenPayload = AccessTokenPayload>(
  token: string,
  secret: string,
  options: VerifyOptions = {}
): T | null {
  try {
    const decoded = jwt.verify(token, secret, { algorithms: ["HS256"], ...options });
    if (typeof decoded === "string") return null;
    // Cast to our payload type
    return decoded as T;
  } catch {
    return null;
  }
}

/**
 * Convenience: check whether a token is valid and includes a feature.
 */
export function hasFeature(
  token: string | null | undefined,
  secret: string,
  feature: string
): boolean {
  if (!token) return false;
  const payload = verifyToken(token, secret);
  return Array.isArray(payload?.features) && payload!.features.includes(feature);
}
