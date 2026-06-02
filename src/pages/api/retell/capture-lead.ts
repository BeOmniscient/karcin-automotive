import type { NextApiRequest, NextApiResponse } from "next";
import { submitVehicleRequest, type VehicleRequestPayload } from "@/lib/ghlIntegration";

/**
 * Retell custom function: capture_lead
 *
 * Ava (the Karcin voice receptionist) calls this once she has at least first name,
 * last name, and phone. We map her collected fields onto the same VehicleRequestPayload
 * the website form uses, and push it to GoHighLevel via submitVehicleRequest — so a phone
 * lead and a web lead land in the exact same place.
 *
 * Retell posts { call, name, args }. We read args (and accept a flat body for curl testing).
 * Always return { result } — a short line Ava can read back if needed.
 */

type RetellArgs = {
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  intent?: string;
  condition?: string;
  vehicle_type?: string;
  make_model?: string;
  trim?: string;
  budget_monthly?: string;
  down_payment?: string;
  current_vehicle?: string;
  has_trade_in?: boolean;
  credit_range?: string;
  timeline?: string;
  has_competing_quote?: boolean;
  urgency?: string;
  lead_score?: number;
  call_summary?: string;
  notes?: string;
};

function mapIntent(v?: string): VehicleRequestPayload["intent"] {
  const t = (v ?? "").toLowerCase();
  if (t.includes("lease")) return "lease";
  if (t.includes("finance")) return "finance";
  if (t.includes("buy") || t.includes("cash") || t.includes("purchase")) return "buy";
  return "unsure";
}

function mapCondition(v?: string): VehicleRequestPayload["condition"] {
  const t = (v ?? "").toLowerCase();
  if (t.includes("new")) return "new";
  if (t.includes("pre") || t.includes("used")) return "pre-owned";
  return "either";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ result: "Method not allowed." });
  }

  const body = (req.body ?? {}) as { args?: RetellArgs } & RetellArgs;
  const a: RetellArgs = body.args ?? body;

  const firstName = (a.first_name ?? "").trim();
  const lastName = (a.last_name ?? "").trim();
  const phone = (a.phone ?? "").trim();

  if (!firstName || !phone) {
    return res.status(200).json({
      result:
        "I just want to make sure the team can reach you — could I grab your first and last name and the best phone number?",
    });
  }

  // Stitch the voice-only context into the form's notes field so nothing is lost.
  const noteParts = ["Captured by Ava (inbound voice call)."];
  if (a.call_summary) noteParts.push(a.call_summary);
  if (a.vehicle_type) noteParts.push(`Vehicle type: ${a.vehicle_type}.`);
  if (a.budget_monthly) noteParts.push(`Target payment: ${a.budget_monthly}.`);
  if (typeof a.lead_score === "number") noteParts.push(`Lead score: ${a.lead_score}/5.`);
  if (a.urgency) noteParts.push(`Urgency: ${a.urgency}.`);
  if (a.has_competing_quote) noteParts.push("Has a competing quote.");
  if (a.notes) noteParts.push(a.notes);
  const missing = [
    !firstName && "first_name",
    !lastName && "last_name",
    !phone && "phone",
  ].filter(Boolean);
  if (missing.length) noteParts.push(`Missing required fields: ${missing.join(", ")}.`);

  const payload: VehicleRequestPayload = {
    firstName,
    lastName: lastName || "(not given)",
    email: a.email ?? "",
    phone,
    preferredContact: "phone",
    intent: mapIntent(a.intent),
    condition: mapCondition(a.condition),
    vehicleType: a.vehicle_type,
    makeModel: [a.make_model, a.trim].filter(Boolean).join(" ") || undefined,
    budgetRange: a.budget_monthly,
    downPayment: a.down_payment,
    currentVehicle: a.current_vehicle,
    hasTradeIn: a.has_trade_in,
    creditRange: a.credit_range,
    timeline: a.timeline,
    notes: noteParts.join(" "),
    // Voice consent: the begin message discloses recording; phone follow-up is the explicit ask.
    consentCalls: true,
    consentTexts: true,
    consentEmails: Boolean(a.email),
  };

  const result = await submitVehicleRequest(payload);

  if (!result.ok) {
    // Don't make Ava promise something that failed silently — but keep her line graceful.
    // eslint-disable-next-line no-console
    console.error("[retell/capture-lead] GHL submission failed:", result.error, payload);
    return res.status(200).json({
      result:
        "Got it — I've noted your details for the Karcin team and they'll follow up with options that fit what you're looking for.",
    });
  }

  return res.status(200).json({
    result: `Perfect, ${firstName} — I've sent this to the Karcin team and they'll follow up at ${phone} with options that actually fit what you're looking for.`,
  });
}
