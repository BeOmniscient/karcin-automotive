import type { NextApiRequest, NextApiResponse } from "next";
import { nextLifecycleAction, type LeaseData } from "@/lib/lifecycle";
import { getCustomFieldIndex, searchContactsByTag, sendSms, addTag } from "@/lib/ghlSms";

/**
 * Lease lifecycle / pull-ahead engine — runs daily (Vercel Cron) or on demand.
 *
 * Scans contacts tagged "Lease Customer", computes the single due action per Diane's clock,
 * and either sends Ava's text (channel sms) or flags Mike (channel human) — tagging "lc:<key>"
 * so nothing fires twice. Sending is GATED behind LIFECYCLE_SEND_ENABLED=true (off until A2P
 * 10DLC is live); until then it's a dry-run that reports exactly what it WOULD do.
 *
 * Auth: Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`; manual calls use ?key=<CRON_SECRET>.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const secret = process.env.CRON_SECRET;
  const authed =
    !secret ||
    req.headers.authorization === `Bearer ${secret}` ||
    req.query.key === secret;
  if (!authed) return res.status(401).json({ error: "Unauthorized" });

  const sendEnabled = process.env.LIFECYCLE_SEND_ENABLED === "true";
  const today = new Date();

  const idToKey = await getCustomFieldIndex();
  const contacts = await searchContactsByTag("Lease Customer", idToKey);

  const planned: Array<{ contactId: string; first?: string; key: string; stage: string; channel: string; sent: boolean }> = [];

  for (const c of contacts) {
    const alreadySent = new Set(
      c.tags.filter((t) => t.toLowerCase().startsWith("lc:")).map((t) => t.slice(3).trim().toLowerCase()),
    );
    const lease: LeaseData = {
      firstName: c.firstName,
      leaseEndDate: c.fields["lease_end_date"],
      leaseStartDate: c.fields["lease_start_date"],
      annualMileage: c.fields["annual_mileage_allowance"] ? Number(c.fields["annual_mileage_allowance"]) : undefined,
      currentMileage: c.fields["current_mileage"] ? Number(c.fields["current_mileage"]) : undefined,
      alreadySent,
    };

    const action = nextLifecycleAction(lease, today);
    if (!action) continue;

    let didSend = false;
    if (sendEnabled) {
      if (action.channel === "sms") {
        const r = await sendSms(c.id, action.message);
        didSend = r.ok;
      } else {
        // human: route to Mike, don't text
        if (action.tag) await addTag(c.id, action.tag);
        didSend = true;
      }
      if (didSend) await addTag(c.id, `lc:${action.key}`); // mark so it never repeats
    }

    planned.push({ contactId: c.id, first: c.firstName, key: action.key, stage: action.stage, channel: action.channel, sent: didSend });
  }

  return res.status(200).json({
    ok: true,
    mode: sendEnabled ? "live" : "dry-run",
    leaseCustomers: contacts.length,
    actions: planned.length,
    planned,
  });
}
