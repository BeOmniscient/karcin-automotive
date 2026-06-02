import type { NextApiRequest, NextApiResponse } from "next";
import { submitVehicleRequest, type VehicleRequestPayload } from "@/lib/ghlIntegration";

/**
 * Retell post-call webhook — the GUARANTEED end-to-end capture.
 *
 * Retell POSTs call_started / call_ended / call_analyzed for every call to this URL. On
 * call_analyzed (the final event, with transcript + recording + post-call analysis) we write
 * the COMPLETE call record to GoHighLevel — even if the in-call save_call_outcome function was
 * never invoked or the call dropped. Nothing collected on a call can be lost.
 *
 * Configured on each agent as webhook_url = {BASE_URL}/api/retell/webhook?key=<RETELL_WEBHOOK_SECRET>.
 */

export const config = { api: { bodyParser: { sizeLimit: "2mb" } } };

type Cad = Record<string, unknown>;
type RetellCall = {
  call_id?: string;
  agent_id?: string;
  direction?: "inbound" | "outbound";
  from_number?: string;
  to_number?: string;
  transcript?: string;
  recording_url?: string;
  public_log_url?: string;
  disconnection_reason?: string;
  retell_llm_dynamic_variables?: Record<string, string>;
  call_analysis?: {
    call_summary?: string;
    user_sentiment?: string;
    call_successful?: boolean;
    custom_analysis_data?: Cad;
  };
};

const str = (v: unknown): string => (v === undefined || v === null ? "" : String(v)).trim();
const truthy = (v: unknown): boolean => v === true || v === "true" || v === "yes";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  // Guard: the webhook URL carries a secret query param.
  const secret = process.env.RETELL_WEBHOOK_SECRET;
  if (secret && req.query.key !== secret) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  const body = (req.body ?? {}) as { event?: string; call?: RetellCall };
  const event = body.event;
  const call = body.call ?? {};

  // Acknowledge non-final events immediately; act only on the analyzed call.
  if (event !== "call_analyzed") {
    return res.status(200).json({ received: event ?? "unknown" });
  }

  const dv = call.retell_llm_dynamic_variables ?? {};
  const cad: Cad = call.call_analysis?.custom_analysis_data ?? {};
  const isOutbound = call.direction === "outbound";
  const phone = isOutbound ? call.to_number : call.from_number;

  if (!phone) {
    return res.status(200).json({ skipped: "no contact phone on call" });
  }

  const firstName = str(cad.first_name) || str(dv.first_name) || "(unknown)";
  const lastName = str(cad.last_name) || str(dv.last_name) || "(not given)";
  const outcome = str(cad.outcome);
  const optedOut = outcome === "do_not_call" || truthy(cad.do_not_call);
  const vehicle = str(cad.vehicle_interest) || str(cad.vehicle_type) || str(dv.vehicle_interest);

  // Comprehensive note: summary -> structured fields -> follow-up -> recording -> full transcript.
  const lines: string[] = [`${isOutbound ? "Outbound" : "Inbound"} call — full record (Ava).`];
  if (call.call_analysis?.call_summary) lines.push(`Summary: ${call.call_analysis.call_summary}`);

  const fields: Array<[string, unknown]> = [
    ["Campaign", dv.campaign],
    ["Outcome", cad.outcome],
    ["Vehicle", vehicle],
    ["Budget", cad.budget_monthly],
    ["Credit", cad.credit_category ?? cad.credit_range],
    ["Timeline", cad.timeline],
    ["Trade-in", truthy(cad.has_trade_in) ? "Yes" : undefined],
    ["Callback time", cad.callback_time],
    ["Best time to reach", cad.best_time_to_reach],
    ["Preferred contact", cad.preferred_contact_method],
    ["Wants text follow-up", truthy(cad.wants_text_follow_up) ? "Yes" : undefined],
    ["FOLLOW-UP ACTION", cad.follow_up_action],
    ["Lead score", cad.lead_score],
    ["Sentiment", call.call_analysis?.user_sentiment],
    ["Disconnect reason", call.disconnection_reason],
  ];
  for (const [k, v] of fields) if (str(v) !== "") lines.push(`${k}: ${v}`);
  if (optedOut) lines.push("DO NOT CALL — caller asked to be removed. Suppress from future outbound.");
  if (call.recording_url) lines.push(`Recording: ${call.recording_url}`);
  if (call.public_log_url) lines.push(`Call log: ${call.public_log_url}`);
  if (call.call_id) lines.push(`Retell call_id: ${call.call_id}`);
  if (call.transcript) lines.push("", "--- Full transcript ---", call.transcript);

  const payload: VehicleRequestPayload = {
    firstName,
    lastName,
    email: str(cad.email),
    phone,
    preferredContact: "phone",
    intent: "unsure",
    condition: "either",
    vehicleType: vehicle || undefined,
    budgetRange: str(cad.budget_monthly) || undefined,
    creditRange: str(cad.credit_category) || str(cad.credit_range) || undefined,
    timeline: str(cad.timeline) || undefined,
    hasTradeIn: truthy(cad.has_trade_in),
    notes: lines.join("\n"),
    consentCalls: !optedOut,
    consentTexts: !optedOut,
    consentEmails: false,
    source: `Karcin Voice AI — ${isOutbound ? "Outbound" : "Inbound"} (full call record)`,
    tags: [
      "Voice AI",
      isOutbound ? "Outbound Call" : "Inbound Call",
      "Full Transcript",
      ...(outcome ? [`Outcome: ${outcome}`] : []),
      ...(str(dv.campaign) ? [`Campaign: ${str(dv.campaign)}`] : []),
      ...(truthy(cad.wants_text_follow_up) ? ["Wants Text Follow-up"] : []),
    ],
  };

  const result = await submitVehicleRequest(payload);
  if (!result.ok) {
    // eslint-disable-next-line no-console
    console.error("[retell/webhook] GHL submission failed:", result.error, { call_id: call.call_id, phone });
  }

  // Always 200 so Retell doesn't retry-storm; we've logged any failure.
  return res.status(200).json({ ok: true });
}
