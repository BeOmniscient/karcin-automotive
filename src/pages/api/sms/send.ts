import type { NextApiRequest, NextApiResponse } from "next";
import { sendSms, removeTag } from "@/lib/ghlSms";

/**
 * Send / initiate an SMS to a contact via GHL (the first AI touch, or an automation trigger).
 *
 * POST {BASE_URL}/api/sms/send   header: x-karcin-secret: <OUTBOUND_TRIGGER_SECRET>
 * body: { "contactId": "...", "message": "...", "resumeAi"?: true }
 *
 * resumeAi clears the "SMS: Human" pause so Ava handles subsequent replies.
 * (Most first-touch texts can also be sent natively from a GHL workflow.)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }
  const secret = process.env.OUTBOUND_TRIGGER_SECRET;
  if (!secret || req.headers["x-karcin-secret"] !== secret) {
    return res.status(401).json({ ok: false, error: "Unauthorized." });
  }

  const b = (req.body ?? {}) as { contactId?: string; message?: string; resumeAi?: boolean };
  if (!b.contactId || !b.message) {
    return res.status(400).json({ ok: false, error: "contactId and message are required." });
  }

  if (b.resumeAi) {
    await removeTag(b.contactId, "SMS: Human");
    await removeTag(b.contactId, "AI Paused");
  }

  const sent = await sendSms(b.contactId, b.message);
  if (!sent.ok) return res.status(502).json({ ok: false, error: sent.error });
  return res.status(200).json({ ok: true, messageId: sent.messageId, conversationId: sent.conversationId });
}
