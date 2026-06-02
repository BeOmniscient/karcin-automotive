import type { NextApiRequest, NextApiResponse } from "next";
import { submitVehicleRequest, type VehicleRequestPayload } from "@/lib/ghlIntegration";

/**
 * Server-side lead intake for the website Vehicle Request form.
 *
 * The form is a client component, so it can't hold the GHL token. It POSTs here, and this
 * route runs submitVehicleRequest server-side — so web leads flow into GHL via the same
 * full-fidelity API path as the inbound/outbound voice agents.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

  const b = (req.body ?? {}) as Partial<VehicleRequestPayload>;
  if (!b.firstName || !b.phone) {
    return res.status(400).json({ ok: false, error: "First name and phone are required." });
  }

  const payload: VehicleRequestPayload = {
    firstName: String(b.firstName),
    lastName: String(b.lastName ?? ""),
    email: String(b.email ?? ""),
    phone: String(b.phone),
    preferredContact: (b.preferredContact as VehicleRequestPayload["preferredContact"]) ?? "email",
    intent: (b.intent as VehicleRequestPayload["intent"]) ?? "unsure",
    condition: (b.condition as VehicleRequestPayload["condition"]) ?? "either",
    vehicleType: b.vehicleType,
    makeModel: b.makeModel,
    budgetRange: b.budgetRange,
    downPayment: b.downPayment,
    leaseEndDate: b.leaseEndDate,
    currentVehicle: b.currentVehicle,
    hasTradeIn: Boolean(b.hasTradeIn),
    creditRange: b.creditRange,
    timeline: b.timeline,
    notes: b.notes,
    consentCalls: Boolean(b.consentCalls),
    consentTexts: Boolean(b.consentTexts),
    consentEmails: Boolean(b.consentEmails),
    source: "Karcin Website — Vehicle Request",
    tags: ["Website Form"],
  };

  const result = await submitVehicleRequest(payload);
  if (!result.ok) return res.status(502).json(result);
  return res.status(200).json({ ok: true });
}
