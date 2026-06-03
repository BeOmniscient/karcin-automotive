import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Ava EA tool: research_question — answer a general or business question for the owner
 * (Mike/Shane) using Anthropic. Voice-length answers only. Requires ANTHROPIC_API_KEY.
 *
 * args: { question }
 */
const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";
const MODEL = process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-latest";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ result: "Method not allowed." });
  const body = (req.body ?? {}) as { args?: { question?: string } } & { question?: string };
  const question = (body.args?.question ?? body.question ?? "").trim();
  if (!question) return res.status(200).json({ result: "What would you like me to look into?" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(200).json({ result: "I can't reach my research tools right now — I'll file this for the team to answer." });
  }

  try {
    const r = await fetch(ANTHROPIC_API, {
      method: "POST",
      headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 300,
        system:
          "You are Ava, the executive assistant for Karcin Automotive (an NJ auto leasing broker), answering a spoken question for the owner on a phone call. Answer concisely and conversationally in 1-3 sentences — this is being read aloud. If the question needs real-time data you don't have (live pricing, today's inventory, specific account numbers), say you'll pull it / file it rather than guessing. Never invent specifics.",
        messages: [{ role: "user", content: question }],
      }),
    });
    const data = (await r.json().catch(() => ({}))) as { content?: Array<{ text?: string }>; error?: { message?: string } };
    if (!r.ok) return res.status(200).json({ result: "I had trouble looking that up just now — want me to file it for the team?" });
    const text = (data.content?.[0]?.text || "").trim();
    return res.status(200).json({ result: text || "I'm not sure on that one — I can file it for the team to confirm." });
  } catch {
    return res.status(200).json({ result: "I couldn't reach my research tools — I'll log it for follow-up." });
  }
}
