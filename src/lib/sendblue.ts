/**
 * Sendblue client — iMessage/SMS for Karcin (server-side only).
 * Docs: https://docs.sendblue.com/api-v2/
 *
 * Auth headers: sb-api-key-id, sb-api-secret-key.
 * Send: POST https://api.sendblue.co/api/send-message
 */

const SENDBLUE_API = "https://api.sendblue.co/api";

export type SendblueSendStyle =
  | "celebration" | "shooting_star" | "fireworks" | "lasers"
  | "love" | "confetti" | "balloons" | "spotlight" | "echo" | "invisible" | "gentle" | "loud" | "slam";

export type SendMessageInput = {
  to: string;            // recipient phone, E.164
  content: string;
  statusCallback?: string;
  sendStyle?: SendblueSendStyle;
  mediaUrl?: string;
};

export type SendblueMessage = {
  status?: string;        // QUEUED | SENT | DELIVERED | READ | ERROR ...
  message_handle?: string;
  content?: string;
  from_number?: string;
  to_number?: string;
  is_outbound?: boolean;  // true = we/agent sent; false = inbound reply
  service?: "iMessage" | "SMS" | string;
  was_downgraded?: boolean;
  error_code?: number | null;
  error_message?: string | null;
  date_sent?: string;
  media_url?: string;
};

export type SendResult =
  | { ok: true; message: SendblueMessage }
  | { ok: false; error: string; status?: number };

function creds() {
  return {
    keyId: process.env.SENDBLUE_API_KEY_ID,
    secret: process.env.SENDBLUE_API_SECRET,
    fromNumber: process.env.SENDBLUE_FROM_NUMBER,
  };
}

export function sendblueConfigured(): boolean {
  const c = creds();
  return Boolean(c.keyId && c.secret && c.fromNumber);
}

/** Send an iMessage (auto-falls back to SMS) to a contact. */
export async function sendMessage(input: SendMessageInput): Promise<SendResult> {
  const { keyId, secret, fromNumber } = creds();
  if (!keyId || !secret || !fromNumber) {
    return { ok: false, error: "Sendblue not configured (SENDBLUE_API_KEY_ID / SENDBLUE_API_SECRET / SENDBLUE_FROM_NUMBER)." };
  }

  try {
    const res = await fetch(`${SENDBLUE_API}/send-message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "sb-api-key-id": keyId,
        "sb-api-secret-key": secret,
      },
      body: JSON.stringify({
        number: input.to,
        from_number: fromNumber,
        content: input.content,
        ...(input.statusCallback ? { status_callback: input.statusCallback } : {}),
        ...(input.sendStyle ? { send_style: input.sendStyle } : {}),
        ...(input.mediaUrl ? { media_url: input.mediaUrl } : {}),
      }),
    });
    const data = (await res.json().catch(() => ({}))) as SendblueMessage;
    if (!res.ok) {
      return { ok: false, status: res.status, error: data.error_message || `Sendblue send failed (${res.status}).` };
    }
    return { ok: true, message: data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Sendblue network error." };
  }
}

/** Normalize whatever Sendblue posts to our inbound webhook into a typed shape. */
export function parseInbound(body: unknown): SendblueMessage {
  const b = (body ?? {}) as Record<string, unknown>;
  const s = (v: unknown) => (v === undefined || v === null ? undefined : String(v));
  return {
    message_handle: s(b.message_handle),
    content: s(b.content),
    from_number: s(b.from_number),
    to_number: s(b.to_number),
    is_outbound: b.is_outbound === true || b.is_outbound === "true",
    service: s(b.service),
    status: s(b.status),
    media_url: s(b.media_url),
    date_sent: s(b.date_sent),
    error_code: typeof b.error_code === "number" ? b.error_code : null,
  };
}

/** STOP / opt-out detection for inbound text. */
export function isOptOut(content?: string): boolean {
  const t = (content ?? "").trim().toLowerCase();
  return ["stop", "stopall", "unsubscribe", "cancel", "end", "quit", "stop calling", "remove me", "do not text"].some(
    (k) => t === k || t.startsWith(k),
  );
}
