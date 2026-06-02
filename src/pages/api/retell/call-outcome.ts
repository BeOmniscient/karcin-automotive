import type { NextApiRequest, NextApiResponse } from "next";
import { submitVehicleRequest, type VehicleRequestPayload } from "@/lib/ghlIntegration";

/**
 * Retell custom function: save_call_outcome (OUTBOUND Ava)
 *
 * Records the disposition of an outbound call and any updated lead details, then pushes to
 * GoHighLevel via the same submitVehicleRequest path the inbound agent and web form use.
 *
 * Outcomes: reached_interested | reached_callback | reached_not_interested |
 *           do_not_call | voicemail | wrong_number | no_answer
 *
 * Retell posts { call, name, args }; we also accept a flat body for curl testing.
 * Always returns { result } — a short line Ava can read back if needed.
 */

type RetellArgs = {
  outcome?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  campaign?: string;
  vehicle_interest?: string;
  budget_monthly?: string;
  timeline?: string;
  has_trade_in?: boolean;
  callback_time?: string;
  lead_score?: number;
  call_summary?: string;
  notes?: string;
};

const OUTCOMES = new Set([
  "reached_interested",
  "reached_callback",
  "reached_not_interested",
  "do_not_call",
  "voicemail",
  "wrong_number",
  "no_answer",
]);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ result: "Method not allowed." });
  }

  const body = (req.body ?? {}) as { args?: RetellArgs } & RetellArgs;
  const a: RetellArgs = body.args ?? body;

  const outcome = OUTCOMES.has(a.outcome ?? "") ? (a.outcome as string) : "no_answer";
  const phone = (a.phone ?? "").trim();
  const firstName = (a.first_name ?? "").trim();
  const optedOut = outcome === "do_not_call";

  if (!phone) {
    return res.status(200).json({ result: "Noted." });
  }

  const noteParts = [`Outbound call (Ava). Outcome: ${outcome}.`];
  if (a.campaign) noteParts.push(`Campaign: ${a.campaign}.`);
  if (a.call_summary) noteParts.push(a.call_summary);
  if (a.callback_time) noteParts.push(`Requested callback: ${a.callback_time}.`);
  if (a.vehicle_interest) noteParts.push(`Vehicle: ${a.vehicle_interest}.`);
  if (a.budget_monthly) noteParts.push(`Target payment: ${a.budget_monthly}.`);
  if (a.timeline) noteParts.push(`Timeline: ${a.timeline}.`);
  if (typeof a.lead_score === "number") noteParts.push(`Lead score: ${a.lead_score}/5.`);
  if (optedOut) noteParts.push("DO NOT CALL — caller asked to be removed. Suppress from future outbound.");
  if (a.notes) noteParts.push(a.notes);

  const payload: VehicleRequestPayload = {
    firstName: firstName || "(unknown)",
    lastName: (a.last_name ?? "").trim() || "(not given)",
    email: a.email ?? "",
    phone,
    preferredContact: "phone",
    intent: "unsure",
    condition: "either",
    vehicleType: a.vehicle_interest,
    budgetRange: a.budget_monthly,
    timeline: a.timeline,
    hasTradeIn: a.has_trade_in,
    notes: noteParts.join(" "),
    // Disposition drives consent: an opt-out flips every channel off.
    consentCalls: !optedOut,
    consentTexts: !optedOut,
    consentEmails: false,
    source: "Karcin Voice AI — Outbound (Ava)",
    tags: [
      "Voice AI",
      "Outbound Call",
      `Outcome: ${outcome}`,
      ...(a.campaign ? [`Campaign: ${a.campaign}`] : []),
      ...(typeof a.lead_score === "number" ? [`Lead Score ${a.lead_score}`] : []),
    ],
  };

  const result = await submitVehicleRequest(payload);
  if (!result.ok) {
    // eslint-disable-next-line no-console
    console.error("[retell/call-outcome] GHL submission failed:", result.error, payload);
  }

  return res.status(200).json({ result: "Recorded." });
}
