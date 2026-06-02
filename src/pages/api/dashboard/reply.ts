import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/lib/dashAuth";
import { sendSms, addTag } from "@/lib/ghlSms";

/**
 * Mike replies from the dashboard. Sending a human reply flips the thread to
 * "SMS: Human" so Ava stops auto-replying (human takeover).
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (requireAuth(req, res)) return;
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false });
  }
  const { contactId, message } = (req.body ?? {}) as { contactId?: string; message?: string };
  if (!contactId || !message?.trim()) {
    return res.status(400).json({ ok: false, error: "contactId and message required" });
  }
  await addTag(contactId, "SMS: Human");
  const sent = await sendSms(contactId, message.trim());
  if (!sent.ok) return res.status(502).json({ ok: false, error: sent.error });
  return res.status(200).json({ ok: true });
}
