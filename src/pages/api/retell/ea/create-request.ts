import type { NextApiRequest, NextApiResponse } from "next";
import { createTask } from "@/lib/ghlSms";

/**
 * Ava EA tool: create_request — files a task/request into the OS (GHL) for the team.
 * args: { request, priority? }
 *
 * Logs to GHL as a task on the ops inbox contact (KARCIN_OPS_CONTACT_ID). If that's not set,
 * it still acknowledges and logs server-side so the conversation isn't blocked.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ result: "Method not allowed." });
  const body = (req.body ?? {}) as { args?: { request?: string; priority?: string } } & { request?: string; priority?: string };
  const request = (body.args?.request ?? body.request ?? "").trim();
  const priority = (body.args?.priority ?? body.priority ?? "normal").trim();
  if (!request) return res.status(200).json({ result: "What should I file for you?" });

  const opsContact = process.env.KARCIN_OPS_CONTACT_ID;
  const title = `Ava request${priority && priority !== "normal" ? ` [${priority}]` : ""}`;

  if (opsContact) {
    const ok = await createTask(opsContact, title, request);
    if (ok) return res.status(200).json({ result: `Done — I've filed that with the team: "${request}". They'll see it in the system.` });
  }

  // eslint-disable-next-line no-console
  console.log("[ea/create-request] (no ops contact configured) request:", priority, request);
  return res.status(200).json({
    result: `Got it — I've logged your request: "${request}". I'll make sure the team picks it up.`,
  });
}
