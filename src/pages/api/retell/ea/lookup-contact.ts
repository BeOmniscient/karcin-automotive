import type { NextApiRequest, NextApiResponse } from "next";
import { searchContacts, getLatestNote } from "@/lib/ghlSms";

/**
 * Ava EA tool: lookup_contact — used in owner mode (Mike/Shane).
 * args: { query }  (a name, phone, or email)
 * Returns a short spoken summary of the best match(es) from GHL.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ result: "Method not allowed." });
  const body = (req.body ?? {}) as { args?: { query?: string } } & { query?: string };
  const query = (body.args?.query ?? body.query ?? "").trim();
  if (!query) return res.status(200).json({ result: "Who should I look up?" });

  const matches = await searchContacts(query, 3);
  if (!matches.length) {
    return res.status(200).json({ result: `I couldn't find anyone matching ${query} in the system.` });
  }

  const top = matches[0];
  const tags = (top.tags || []).filter((t) => !t.toLowerCase().startsWith("lc:")).slice(0, 5);
  const note = await getLatestNote(top.id);
  const name = `${top.firstName || ""} ${top.lastName || ""}`.trim() || "this contact";

  const parts = [`I found ${name}`];
  if (top.phone) parts.push(`phone ${top.phone}`);
  if (tags.length) parts.push(`tagged ${tags.join(", ")}`);
  if (note) parts.push(`Most recent note: ${note.slice(0, 240)}`);
  let result = parts.join(". ") + ".";
  if (matches.length > 1) result += ` There are ${matches.length - 1} other possible matches if that's not the right one.`;

  return res.status(200).json({ result });
}
