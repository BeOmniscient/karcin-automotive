import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/lib/dashAuth";
import { getConversationMessages, getContact, isHumanHandled } from "@/lib/ghlSms";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (requireAuth(req, res)) return;
  const contactId = String(req.query.contactId || "");
  if (!contactId) return res.status(400).json({ error: "contactId required" });

  const [messages, contact] = await Promise.all([
    getConversationMessages(contactId),
    getContact(contactId),
  ]);
  return res.status(200).json({
    messages,
    avaActive: !isHumanHandled(contact),
    contact: contact ? { firstName: contact.firstName, lastName: contact.lastName, phone: contact.phone } : null,
  });
}
