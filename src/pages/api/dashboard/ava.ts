import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/lib/dashAuth";
import { addTag, removeTag } from "@/lib/ghlSms";

/** Toggle Ava on/off for a thread. on=false pauses (human owns it); on=true hands back to AI. */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (requireAuth(req, res)) return;
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false });
  }
  const { contactId, on } = (req.body ?? {}) as { contactId?: string; on?: boolean };
  if (!contactId) return res.status(400).json({ ok: false, error: "contactId required" });

  if (on) {
    await removeTag(contactId, "SMS: Human");
    await removeTag(contactId, "AI Paused");
    await removeTag(contactId, "Needs Human Follow-up");
  } else {
    await addTag(contactId, "SMS: Human");
  }
  return res.status(200).json({ ok: true, avaActive: Boolean(on) });
}
