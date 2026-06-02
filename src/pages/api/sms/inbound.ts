import type { NextApiRequest, NextApiResponse } from "next";
import { generateReply, type ChatTurn, type LeadContext } from "@/lib/avaTextAgent";
import {
  getContact, getRecentHistory, sendSms, addTag, isHumanHandled,
} from "@/lib/ghlSms";

/**
 * Inbound SMS handler — called by a GHL workflow when a customer replies.
 *
 * GHL Workflow: Trigger "Customer Replied" (SMS) -> Action "Webhook" (POST) to
 *   {BASE_URL}/api/sms/inbound?key=<SMS_WEBHOOK_SECRET>
 * with a custom JSON body: { "contactId": "{{contact.id}}", "message": "{{message.body}}" }
 *
 * Ava replies via GHL unless the thread is human-handled. She hands off (tags "SMS: Human")
 * on pricing / ready-to-buy / trade-in / credit / frustration / "talk to a person".
 */

function optOut(text: string): boolean {
  const t = text.trim().toLowerCase();
  return ["stop", "stopall", "unsubscribe", "cancel", "quit", "end", "remove me", "do not text"].some(
    (k) => t === k || t.startsWith(k),
  );
}

function pick(obj: Record<string, unknown>, keys: string[]): string {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.trim()) return v.trim();
    if (typeof v === "number") return String(v);
  }
  return "";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }
  if (process.env.SMS_WEBHOOK_SECRET && req.query.key !== process.env.SMS_WEBHOOK_SECRET) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  const body = (req.body ?? {}) as Record<string, unknown>;
  const contactId = pick(body, ["contactId", "contact_id", "id"]);
  const text = pick(body, ["message", "body", "message_body", "sms_body", "last_message", "text"]);

  if (!contactId || !text) {
    return res.status(200).json({ skipped: "missing contactId or message" });
  }

  // Opt-out: GHL/Twilio auto-set DND on STOP, but tag + stay silent to be safe.
  if (optOut(text)) {
    await addTag(contactId, "SMS: Opted Out");
    return res.status(200).json({ ok: true, action: "opt_out" });
  }

  const contact = await getContact(contactId);

  // Human is handling this thread -> AI stays silent.
  if (isHumanHandled(contact)) {
    return res.status(200).json({ ok: true, action: "human_handled" });
  }

  // Build context from GHL history + the just-received message.
  const history: ChatTurn[] = await getRecentHistory(contactId);
  if (!history.length || history[history.length - 1].text !== text) {
    history.push({ role: "user", text });
  }

  const tags = (contact?.tags ?? []);
  const creditTag = tags.find((t) => t.toLowerCase().startsWith("credit:"));
  const lead: LeadContext = {
    firstName: contact?.firstName,
    lastName: contact?.lastName,
    creditCategory: creditTag ? creditTag.split(":")[1]?.trim() : undefined,
  };

  const ava = await generateReply(history, lead);

  if (ava.handoff) {
    await addTag(contactId, "SMS: Human");
    await addTag(contactId, "Needs Human Follow-up");
    if (ava.reply) await sendSms(contactId, ava.reply); // bridging line
    return res.status(200).json({ ok: true, action: "handoff", reason: ava.handoffReason });
  }

  if (!ava.reply) {
    // Safety: never send empty; flag for a human instead.
    await addTag(contactId, "SMS: Human");
    return res.status(200).json({ ok: true, action: "handoff_empty_reply" });
  }

  const sent = await sendSms(contactId, ava.reply);
  if (!sent.ok) {
    // eslint-disable-next-line no-console
    console.error("[sms/inbound] GHL send failed:", sent.error, { contactId });
    await addTag(contactId, "SMS: Human");
    return res.status(200).json({ ok: false, action: "send_failed" });
  }
  return res.status(200).json({ ok: true, action: "replied" });
}
