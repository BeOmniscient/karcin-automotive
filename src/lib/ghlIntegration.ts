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
};

export type SubmitResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Posts a Vehicle Request to GoHighLevel.
 * Wire GHL_FORM_WEBHOOK_URL in env to enable. Falls back to a no-op success
 * during local dev / preview so the UI flow can be tested without credentials.
 */
export async function submitVehicleRequest(
  payload: VehicleRequestPayload,
): Promise<SubmitResult> {
  const webhook = process.env.NEXT_PUBLIC_GHL_FORM_WEBHOOK_URL;

  if (!webhook) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.info("[ghl] no webhook configured — skipping submission", payload);
      return { ok: true };
    }
    return { ok: false, error: "Form is not configured. Please contact us directly." };
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      return { ok: false, error: `Submission failed (${res.status}).` };
    }
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Network error.",
    };
  }
}
