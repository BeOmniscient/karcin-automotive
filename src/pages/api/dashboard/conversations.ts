import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/lib/dashAuth";
import { listConversations } from "@/lib/ghlSms";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (requireAuth(req, res)) return;
  const conversations = await listConversations(40);
  return res.status(200).json({ conversations });
}
