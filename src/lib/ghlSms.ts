/**
 * GoHighLevel SMS + conversation helpers (server-side).
 *
 * GHL is both the transport (LC Phone / Twilio under the hood) and the human inbox/store,
 * so Ava reads context and sends replies through GHL's Conversations API — no separate DB.
 *
 * Requires GHL_API_KEY (Private Integration token) with scopes:
 *   conversations/message.write, conversations.readonly, conversations/message.readonly,
 *   contacts.write, contacts.readonly
 */
import type { ChatTurn } from "@/lib/avaTextAgent";

const GHL = "https://services.leadconnectorhq.com";
const V_CONTACTS = "2021-07-28";
const V_CONV = "2023-02-21";

function token() {
  return process.env.GHL_API_KEY;
}
function locationId() {
  return process.env.GHL_LOCATION_ID;
}
export function ghlSmsConfigured(): boolean {
  return Boolean(token() && locationId());
}

async function ghl(path: string, version: string, init: RequestInit) {
  return fetch(`${GHL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token()}`,
      Version: version,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init.headers || {}),
    },
  });
}

export type GhlContact = {
  id: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  tags?: string[];
  dnd?: boolean;
};

export async function getContact(contactId: string): Promise<GhlContact | null> {
  const res = await ghl(`/contacts/${contactId}`, V_CONTACTS, { method: "GET" });
  if (!res.ok) return null;
  const data = (await res.json().catch(() => ({}))) as { contact?: GhlContact };
  return data.contact ?? null;
}

/** True if the contact is flagged for human handling (AI should stay silent). */
export function isHumanHandled(contact: GhlContact | null): boolean {
  const tags = (contact?.tags ?? []).map((t) => t.toLowerCase());
  return tags.includes("sms: human") || tags.includes("ai paused");
}

export async function addTag(contactId: string, tag: string): Promise<void> {
  await ghl(`/contacts/${contactId}/tags`, V_CONTACTS, {
    method: "POST",
    body: JSON.stringify({ tags: [tag] }),
  }).catch(() => {});
}

export async function removeTag(contactId: string, tag: string): Promise<void> {
  await ghl(`/contacts/${contactId}/tags`, V_CONTACTS, {
    method: "DELETE",
    body: JSON.stringify({ tags: [tag] }),
  }).catch(() => {});
}

/** Send an SMS to a contact via GHL (appends to / creates the conversation thread). */
export async function sendSms(
  contactId: string,
  message: string,
): Promise<{ ok: boolean; error?: string; messageId?: string; conversationId?: string }> {
  const res = await ghl(`/conversations/messages`, V_CONV, {
    method: "POST",
    body: JSON.stringify({ type: "SMS", contactId, message }),
  });
  const data = (await res.json().catch(() => ({}))) as {
    messageId?: string;
    conversationId?: string;
    message?: string;
  };
  if (!res.ok) return { ok: false, error: data.message || `GHL send failed (${res.status}).` };
  return { ok: true, messageId: data.messageId, conversationId: data.conversationId };
}

/** Pull recent SMS history for context, oldest -> newest, mapped to Ava's chat turns. */
export async function getRecentHistory(contactId: string, limit = 20): Promise<ChatTurn[]> {
  // 1) find the contact's conversation
  const searchRes = await ghl(
    `/conversations/search?locationId=${encodeURIComponent(locationId() || "")}&contactId=${encodeURIComponent(contactId)}`,
    V_CONV,
    { method: "GET" },
  );
  if (!searchRes.ok) return [];
  const search = (await searchRes.json().catch(() => ({}))) as { conversations?: Array<{ id?: string }> };
  const conversationId = search.conversations?.[0]?.id;
  if (!conversationId) return [];

  // 2) pull its messages
  const msgRes = await ghl(`/conversations/${conversationId}/messages?limit=${limit}`, V_CONV, { method: "GET" });
  if (!msgRes.ok) return [];
  const msgData = (await msgRes.json().catch(() => ({}))) as {
    messages?: { messages?: Array<{ direction?: string; body?: string; messageType?: string; type?: string }> } | Array<{ direction?: string; body?: string }>;
  };
  // GHL nests as { messages: { messages: [...] } } on some versions; tolerate both.
  const list = Array.isArray(msgData.messages)
    ? msgData.messages
    : msgData.messages?.messages ?? [];

  const turns: ChatTurn[] = [];
  for (const m of list) {
    const body = (m.body ?? "").trim();
    if (!body) continue;
    turns.push({ role: m.direction === "inbound" ? "user" : "assistant", text: body });
  }
  // GHL returns newest-first; reverse to chronological.
  return turns.reverse().slice(-limit);
}

export type ConversationSummary = {
  id: string;
  contactId: string;
  name: string;
  lastMessage: string;
  lastMessageDate: string;
  unread: number;
};

/** List recent conversations for the inbox (newest first). */
export async function listConversations(limit = 30): Promise<ConversationSummary[]> {
  const res = await ghl(
    `/conversations/search?locationId=${encodeURIComponent(locationId() || "")}&limit=${limit}&sortBy=last_message_date&sort=desc`,
    V_CONV,
    { method: "GET" },
  );
  if (!res.ok) return [];
  const data = (await res.json().catch(() => ({}))) as {
    conversations?: Array<Record<string, unknown>>;
  };
  const s = (v: unknown) => (v == null ? "" : String(v));
  return (data.conversations ?? []).map((c) => ({
    id: s(c.id),
    contactId: s(c.contactId ?? c.contact_id),
    name: s(c.fullName || c.contactName || c.name || c.email || c.phone || "Unknown"),
    lastMessage: s(c.lastMessageBody || c.lastMessage || ""),
    lastMessageDate: s(c.lastMessageDate || c.dateUpdated || ""),
    unread: typeof c.unreadCount === "number" ? c.unreadCount : 0,
  }));
}

export type DisplayMessage = { direction: "inbound" | "outbound"; body: string; date: string };

/** Full message list for one contact's thread, chronological — for the inbox view. */
export async function getConversationMessages(contactId: string, limit = 50): Promise<DisplayMessage[]> {
  const searchRes = await ghl(
    `/conversations/search?locationId=${encodeURIComponent(locationId() || "")}&contactId=${encodeURIComponent(contactId)}`,
    V_CONV,
    { method: "GET" },
  );
  if (!searchRes.ok) return [];
  const search = (await searchRes.json().catch(() => ({}))) as { conversations?: Array<{ id?: string }> };
  const conversationId = search.conversations?.[0]?.id;
  if (!conversationId) return [];

  const msgRes = await ghl(`/conversations/${conversationId}/messages?limit=${limit}`, V_CONV, { method: "GET" });
  if (!msgRes.ok) return [];
  const msgData = (await msgRes.json().catch(() => ({}))) as {
    messages?: { messages?: Array<Record<string, unknown>> } | Array<Record<string, unknown>>;
  };
  const list = Array.isArray(msgData.messages) ? msgData.messages : msgData.messages?.messages ?? [];
  const s = (v: unknown) => (v == null ? "" : String(v));
  const out: DisplayMessage[] = [];
  for (const m of list) {
    const body = s(m.body).trim();
    if (!body) continue;
    out.push({
      direction: m.direction === "inbound" ? "inbound" : "outbound",
      body,
      date: s(m.dateAdded || m.dateUpdated || ""),
    });
  }
  return out.reverse();
}
