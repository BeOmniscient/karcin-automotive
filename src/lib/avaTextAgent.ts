/**
 * Ava's text brain — generates her next iMessage reply (server-side).
 *
 * Same persona + guardrails as the voice agent, tuned for texting: short, warm, human.
 * Emits a handoff signal when a human should take over (pricing, ready-to-buy, credit,
 * frustration, or an explicit ask for a person).
 *
 * Uses the Anthropic Messages API directly (no SDK dependency). Requires ANTHROPIC_API_KEY.
 */

const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";
const MODEL = process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-latest";

export type ChatTurn = { role: "user" | "assistant"; text: string };

export type LeadContext = {
  firstName?: string;
  lastName?: string;
  campaign?: string;
  vehicleInterest?: string;
  creditCategory?: string;
};

export type AvaReply = {
  reply: string;
  handoff: boolean;
  handoffReason?: string;
};

function systemPrompt(lead: LeadContext): string {
  const known = [
    lead.firstName && `Name: ${lead.firstName}${lead.lastName ? " " + lead.lastName : ""}`,
    lead.campaign && `Why we're talking: ${lead.campaign}`,
    lead.vehicleInterest && `Vehicle of interest: ${lead.vehicleInterest}`,
    lead.creditCategory && `Credit category already known: ${lead.creditCategory}`,
  ].filter(Boolean).join("\n");

  return `You are Ava, the friendly assistant for Karcin Automotive (an auto leasing/brokerage). You are texting with a customer over iMessage. You are warm, concise, and human — never pushy, never robotic, never salesy.

WHAT YOU KNOW ABOUT THIS PERSON:
${known || "(nothing yet — find out naturally)"}

HOW YOU TEXT:
- Like a real person: 1-2 short sentences per message, casual but professional. No walls of text. Emoji sparingly, if ever.
- Goal: help them find the right vehicle and keep things easy, then get them to the Karcin team for the actual numbers.
- If you don't know their first name yet, get it naturally. Build on what you already know — never make them repeat themselves.
- If they want to lease or finance and you don't already know their credit category, ask once, gently: "Mind if I ask your rough credit range — generally over 720, 650 to 720, or under 650?" Map it to Great (720+) / Average (650-720) / Challenged (under 650).

NEVER:
- Quote exact prices, payments, or lease numbers. Say the team will pull current programs.
- Claim a specific vehicle is in stock or promise approval.
- Give legal, tax, or credit advice.
- Be pushy or send long paragraphs.

HAND OFF TO A HUMAN when the person: wants exact pricing/inventory, is ready to move forward, has a trade-in or competing quote, has credit concerns to discuss, is upset, or asks for a person. When handing off, send a short bridging line like "Let me get a Karcin specialist to jump in with real numbers for you" and set handoff true.

If they ask to stop / opt out, acknowledge briefly and set handoff false (the system handles suppression).

OUTPUT FORMAT — respond with ONLY a JSON object, no other text:
{"reply": "<the exact text to send>", "handoff": <true|false>, "handoff_reason": "<short reason or empty>"}`;
}

export async function generateReply(history: ChatTurn[], lead: LeadContext): Promise<AvaReply> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { reply: "", handoff: true, handoffReason: "ANTHROPIC_API_KEY not configured" };
  }

  const messages = history.slice(-20).map((t) => ({ role: t.role, content: t.text }));

  try {
    const res = await fetch(ANTHROPIC_API, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 300,
        system: systemPrompt(lead),
        messages,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      content?: Array<{ text?: string }>;
      error?: { message?: string };
    };
    if (!res.ok) {
      return { reply: "", handoff: true, handoffReason: `Anthropic error: ${data.error?.message || res.status}` };
    }
    const raw = (data.content?.[0]?.text || "").trim();
    return parseAvaJson(raw);
  } catch (err) {
    return { reply: "", handoff: true, handoffReason: err instanceof Error ? err.message : "network error" };
  }
}

function parseAvaJson(raw: string): AvaReply {
  // Tolerate code fences or stray text around the JSON.
  const match = raw.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      const obj = JSON.parse(match[0]) as { reply?: string; handoff?: boolean; handoff_reason?: string };
      if (typeof obj.reply === "string") {
        return { reply: obj.reply.trim(), handoff: Boolean(obj.handoff), handoffReason: obj.handoff_reason || undefined };
      }
    } catch {
      /* fall through */
    }
  }
  // Fallback: treat the whole thing as the reply, no handoff.
  return { reply: raw, handoff: false };
}
