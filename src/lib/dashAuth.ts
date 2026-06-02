import crypto from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Minimal shared-password gate for the Karcin dashboard (v1).
 * Set DASHBOARD_PASSWORD (and optionally DASHBOARD_SESSION_SECRET) in env.
 * Upgrade to per-user auth later without touching the data routes.
 */
const COOKIE = "karcin_dash";

function secret(): string {
  return process.env.DASHBOARD_SESSION_SECRET || process.env.DASHBOARD_PASSWORD || "dev-only-secret";
}

export function sessionToken(): string {
  return crypto.createHmac("sha256", secret()).update("authed-v1").digest("hex");
}

export function isAuthed(req: NextApiRequest): boolean {
  return req.cookies?.[COOKIE] === sessionToken();
}

export function setAuthCookie(res: NextApiResponse): void {
  const parts = [
    `${COOKIE}=${sessionToken()}`,
    "HttpOnly",
    "Path=/",
    "SameSite=Lax",
    "Max-Age=2592000",
  ];
  if (process.env.NODE_ENV === "production") parts.push("Secure");
  res.setHeader("Set-Cookie", parts.join("; "));
}

/** Guard a data route. Returns true if the response was already sent (401). */
export function requireAuth(req: NextApiRequest, res: NextApiResponse): boolean {
  if (isAuthed(req)) return false;
  res.status(401).json({ error: "Unauthorized" });
  return true;
}
