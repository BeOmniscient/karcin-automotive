import type { NextApiRequest, NextApiResponse } from "next";
import { setAuthCookie } from "@/lib/dashAuth";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false });
  }
  const expected = process.env.DASHBOARD_PASSWORD;
  if (!expected) return res.status(500).json({ ok: false, error: "Dashboard password not configured." });

  const { password } = (req.body ?? {}) as { password?: string };
  if (!password || password !== expected) {
    return res.status(401).json({ ok: false, error: "Incorrect password." });
  }
  setAuthCookie(res);
  return res.status(200).json({ ok: true });
}
