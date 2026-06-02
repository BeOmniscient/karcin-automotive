import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Trigger an OUTBOUND call from Ava via the Retell API.
 *
 * Your website (on web-inquiry), CRM/GoHighLevel automation, or a cron job POSTs a person +
 * campaign context here; we hand it to Retell's create-phone-call as dynamic variables so the
 * one outbound agent personalizes every call.
 *
 * SECURITY: this places real, billable phone calls. Protected by a shared secret —
 * send header `x-karcin-secret: <OUTBOUND_TRIGGER_SECRET>`. Requests without it are rejected.
 *
 * Body: {
 *   to: "+1XXXXXXXXXX"            // required, E.164
 *   first_name?, last_name?,
 *   campaign?: "web_inquiry" | "past_customer" | "reminder" | "general",
 *   call_reason?: string,        // spoken reason ("You recently asked about a BMW X5 lease…")
 *   vehicle_interest?: string,
 *   metadata?: object            // echoed back on the call object / webhooks
 * }
 */

const RETELL_API = "https://api.retellai.com/v2/create-phone-call";

function toE164(raw: string): string | null {
  const digits = raw.replace(/[^\d+]/g, "");
  if (/^\+\d{10,15}$/.test(digits)) return digits;
  if (/^\d{10}$/.test(digits)) return `+1${digits}`;
  if (/^1\d{10}$/.test(digits)) return `+${digits}`;
  return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

  const secret = process.env.OUTBOUND_TRIGGER_SECRET;
  if (!secret || req.headers["x-karcin-secret"] !== secret) {
    return res.status(401).json({ ok: false, error: "Unauthorized." });
  }

  const apiKey = process.env.RETELL_API_KEY;
  const fromNumber = process.env.RETELL_FROM_NUMBER;
  const agentId = process.env.RETELL_OUTBOUND_AGENT_ID;
  if (!apiKey || !fromNumber || !agentId) {
    return res.status(500).json({
      ok: false,
      error: "Outbound not configured. Set RETELL_API_KEY, RETELL_FROM_NUMBER, RETELL_OUTBOUND_AGENT_ID.",
    });
  }

  const b = (req.body ?? {}) as Record<string, unknown>;
  const to = toE164(String(b.to ?? ""));
  if (!to) {
    return res.status(400).json({ ok: false, error: "Invalid or missing 'to' number (E.164, e.g. +12015550144)." });
  }

  // Everything Retell substitutes into {{...}} in the agent must be strings.
  const dynamicVariables: Record<string, string> = {
    first_name: String(b.first_name ?? "there"),
    last_name: String(b.last_name ?? ""),
    campaign: String(b.campaign ?? "general"),
    call_reason: String(b.call_reason ?? "I wanted to follow up on your interest in a vehicle with Karcin."),
    vehicle_interest: String(b.vehicle_interest ?? ""),
  };

  try {
    const r = await fetch(RETELL_API, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from_number: fromNumber,
        to_number: to,
        override_agent_id: agentId,
        retell_llm_dynamic_variables: dynamicVariables,
        metadata: { campaign: dynamicVariables.campaign, ...(b.metadata as object | undefined) },
      }),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      // eslint-disable-next-line no-console
      console.error("[retell/place-call] Retell error:", r.status, data);
      return res.status(502).json({ ok: false, error: `Retell error ${r.status}`, detail: data });
    }
    return res.status(200).json({ ok: true, call_id: data.call_id, call_status: data.call_status });
  } catch (err) {
    return res.status(502).json({ ok: false, error: err instanceof Error ? err.message : "Network error." });
  }
}
