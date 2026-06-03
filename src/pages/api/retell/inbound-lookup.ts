import type { NextApiRequest, NextApiResponse } from "next";
import { findContactByPhone, getLatestNote } from "@/lib/ghlSms";

/**
 * Retell INBOUND webhook — fires the instant a call comes in, before Ava speaks.
 * Returns dynamic_variables that personalize her greeting + behavior by caller.
 *
 * Set on the Retell phone number:
 *   inbound_webhook_url = https://www.karcinauto.com/api/retell/inbound-lookup?key=<RETELL_WEBHOOK_SECRET>
 *
 * Retell posts { event:"call_inbound", call_inbound:{ from_number, to_number, agent_id } }
 * and expects { call_inbound: { dynamic_variables, override_agent_id?, metadata? } } within 10s.
 */

function e164(raw: string): string {
  const d = (raw || "").replace(/[^\d+]/g, "");
  if (/^\+\d{10,15}$/.test(d)) return d;
  if (/^\d{10}$/.test(d)) return `+1${d}`;
  if (/^1\d{10}$/.test(d)) return `+${d}`;
  return raw || "";
}

type Vip = { name: string; role: string };
function vipLookup(phone: string): Vip | null {
  try {
    const map = JSON.parse(process.env.KARCIN_VIP_NUMBERS || "{}") as Record<string, Vip>;
    return map[phone] ?? null;
  } catch {
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }
  const secret = process.env.RETELL_WEBHOOK_SECRET;
  if (secret && req.query.key !== secret) return res.status(401).json({ error: "Unauthorized." });

  const body = (req.body ?? {}) as { call_inbound?: { from_number?: string } };
  const from = e164(body.call_inbound?.from_number || "");

  // Defaults (new/unknown caller)
  const vars: Record<string, string> = {
    caller_type: "new",
    caller_name: "",
    caller_known: "false",
    caller_context: "",
    greeting: "Thank you for calling Karcin Automotive, this is Ava. Just so you know, this call may be recorded. How can I help you today?",
  };

  // 1) VIP / owner recognition
  const vip = from ? vipLookup(from) : null;
  if (vip) {
    vars.caller_type = "owner";
    vars.caller_role = vip.role;
    vars.caller_name = vip.name;
    vars.caller_known = "true";
    vars.greeting = `Hi ${vip.name}! It's Ava. How can I help you today?`;
    return res.status(200).json({ call_inbound: { dynamic_variables: vars } });
  }

  // 2) Known-contact lookup in GHL
  if (from) {
    try {
      const contact = await findContactByPhone(from);
      if (contact) {
        const first = (contact.firstName || "").trim();
        const tags = (contact.tags || []).filter((t) => !t.toLowerCase().startsWith("lc:")).slice(0, 6);
        const note = await getLatestNote(contact.id);
        const ctx = [
          first && `Name: ${first} ${contact.lastName || ""}`.trim(),
          tags.length && `Tags: ${tags.join(", ")}`,
          note && `Recent: ${note.slice(0, 220)}`,
        ].filter(Boolean).join(". ");
        vars.caller_type = "known";
        vars.caller_known = "true";
        vars.caller_name = first;
        vars.caller_context = ctx;
        vars.greeting = first
          ? `Thanks for calling Karcin Automotive, this is Ava — just so you know, this call may be recorded. Is this ${first}?`
          : vars.greeting;
      }
    } catch {
      /* fall through to default greeting */
    }
  }

  return res.status(200).json({ call_inbound: { dynamic_variables: vars } });
}
