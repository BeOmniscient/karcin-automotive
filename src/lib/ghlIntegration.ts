export type VehicleRequestPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredContact: "phone" | "text" | "email";
  intent: "lease" | "finance" | "buy" | "unsure";
  condition: "new" | "pre-owned" | "either";
  vehicleType?: string;
  makeModel?: string;
  budgetRange?: string;
  downPayment?: string;
  leaseEndDate?: string;
  currentVehicle?: string;
  hasTradeIn?: boolean;
  creditRange?: string;
  timeline?: string;
  notes?: string;
  consentCalls: boolean;
  consentTexts: boolean;
  consentEmails: boolean;
  /** Where the lead came from — becomes the GHL contact source. */
  source?: string;
  /** Extra GHL tags to apply (e.g. campaign, lead score). */
  tags?: string[];
};

export type SubmitResult =
  | { ok: true }
  | { ok: false; error: string };

const GHL_API = "https://services.leadconnectorhq.com";
const GHL_VERSION = "2021-07-28";

/**
 * Server-side only. Pushes a lead into GoHighLevel.
 *
 * Priority:
 *   1. GHL API v2 (GHL_API_KEY + GHL_LOCATION_ID) — full fidelity: upsert contact,
 *      attach a complete note with every field, apply tags, optionally open an opportunity.
 *   2. Inbound webhook (NEXT_PUBLIC_GHL_FORM_WEBHOOK_URL) — posts the raw JSON.
 *   3. Dev no-op so the UI/call flow works without credentials.
 *
 * NOTE: GHL_API_KEY is a private (non-public) env var, so the API branch only ever runs
 * server-side. The web form posts to /api/lead; voice agents post to /api/retell/*.
 */
export async function submitVehicleRequest(
  payload: VehicleRequestPayload,
): Promise<SubmitResult> {
  const token = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;

  if (token && locationId) {
    return submitViaApi(payload, token, locationId);
  }

  const webhook = process.env.NEXT_PUBLIC_GHL_FORM_WEBHOOK_URL;
  if (webhook) {
    return submitViaWebhook(payload, webhook);
  }

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.info("[ghl] no API token or webhook configured — skipping submission", payload);
    return { ok: true };
  }
  return { ok: false, error: "Lead routing is not configured. Please contact us directly." };
}

function normalizePhone(raw?: string): string {
  const d = (raw ?? "").replace(/[^\d+]/g, "");
  if (/^\+\d{10,15}$/.test(d)) return d;
  if (/^\d{10}$/.test(d)) return `+1${d}`;
  if (/^1\d{10}$/.test(d)) return `+${d}`;
  return raw ?? "";
}

function buildTags(p: VehicleRequestPayload): string[] {
  const tags = new Set<string>(["Karcin Lead", ...(p.tags ?? [])]);
  if (p.intent && p.intent !== "unsure") tags.add(`Intent: ${p.intent}`);
  if (p.hasTradeIn) tags.add("Trade-in");
  if (p.consentCalls === false) tags.add("DO NOT CALL");
  return [...tags];
}

/** A complete, human-readable note so nothing is lost even without GHL custom fields. */
function composeNote(p: VehicleRequestPayload): string {
  const lines: string[] = [];
  if (p.source) lines.push(`Source: ${p.source}`);
  const detail: Array<[string, unknown]> = [
    ["Preferred contact", p.preferredContact],
    ["Intent", p.intent],
    ["New/Pre-owned", p.condition],
    ["Vehicle type", p.vehicleType],
    ["Make/Model", p.makeModel],
    ["Budget", p.budgetRange],
    ["Down payment", p.downPayment],
    ["Lease end date", p.leaseEndDate],
    ["Current vehicle", p.currentVehicle],
    ["Trade-in", p.hasTradeIn ? "Yes" : undefined],
    ["Credit range", p.creditRange],
    ["Timeline", p.timeline],
    ["Consent (call/text/email)", `${p.consentCalls ? "Y" : "N"}/${p.consentTexts ? "Y" : "N"}/${p.consentEmails ? "Y" : "N"}`],
  ];
  for (const [label, val] of detail) {
    if (val !== undefined && val !== null && String(val).trim() !== "") lines.push(`${label}: ${val}`);
  }
  if (p.notes) lines.push("", p.notes);
  return lines.join("\n");
}

async function ghlFetch(path: string, token: string, body: unknown) {
  return fetch(`${GHL_API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Version: GHL_VERSION,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
}

async function submitViaApi(
  p: VehicleRequestPayload,
  token: string,
  locationId: string,
): Promise<SubmitResult> {
  try {
    // 1) Upsert the contact (dedupes on phone/email within the location).
    const upsertRes = await ghlFetch("/contacts/upsert", token, {
      locationId,
      firstName: p.firstName,
      lastName: p.lastName,
      email: p.email || undefined,
      phone: normalizePhone(p.phone) || undefined,
      source: p.source || "Karcin Automotive",
      tags: buildTags(p),
    });

    if (!upsertRes.ok) {
      const text = await upsertRes.text();
      // eslint-disable-next-line no-console
      console.error("[ghl] contact upsert failed", upsertRes.status, text);
      return { ok: false, error: `GHL upsert failed (${upsertRes.status}).` };
    }

    const upsertData = (await upsertRes.json().catch(() => ({}))) as {
      contact?: { id?: string };
    };
    const contactId = upsertData.contact?.id;

    // 2) Attach the full detail as a note (non-fatal if it fails).
    if (contactId) {
      const noteRes = await ghlFetch(`/contacts/${contactId}/notes`, token, {
        body: composeNote(p),
      });
      if (!noteRes.ok) {
        // eslint-disable-next-line no-console
        console.error("[ghl] note create failed", noteRes.status, await noteRes.text());
      }

      // 3) Optionally open an opportunity in a pipeline.
      const pipelineId = process.env.GHL_PIPELINE_ID;
      const pipelineStageId = process.env.GHL_PIPELINE_STAGE_ID;
      if (pipelineId) {
        const oppRes = await ghlFetch("/opportunities/", token, {
          pipelineId,
          locationId,
          contactId,
          name: `${p.firstName} ${p.lastName} — ${p.vehicleType || p.makeModel || "Vehicle lead"}`.trim(),
          status: "open",
          ...(pipelineStageId ? { pipelineStageId } : {}),
        });
        if (!oppRes.ok) {
          // eslint-disable-next-line no-console
          console.error("[ghl] opportunity create failed", oppRes.status, await oppRes.text());
        }
      }
    }

    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "GHL network error." };
  }
}

async function submitViaWebhook(
  payload: VehicleRequestPayload,
  webhook: string,
): Promise<SubmitResult> {
  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return { ok: false, error: `Submission failed (${res.status}).` };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Network error." };
  }
}
