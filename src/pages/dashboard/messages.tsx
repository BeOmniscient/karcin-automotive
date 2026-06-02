import { useCallback, useEffect, useRef, useState } from "react";
import Head from "next/head";

type Conversation = {
  id: string;
  contactId: string;
  name: string;
  lastMessage: string;
  lastMessageDate: string;
  unread: number;
};
type Message = { direction: "inbound" | "outbound"; body: string; date: string };

const card = "rounded-xl border border-neutral-dark/10 bg-highlight";

export default function MessagesInbox() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [avaActive, setAvaActive] = useState(true);
  const [contactName, setContactName] = useState("");
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadConversations = useCallback(async () => {
    const res = await fetch("/api/dashboard/conversations");
    if (res.status === 401) { setAuthed(false); return; }
    setAuthed(true);
    const data = await res.json();
    setConversations(data.conversations ?? []);
  }, []);

  const loadMessages = useCallback(async (contactId: string) => {
    const res = await fetch(`/api/dashboard/messages?contactId=${encodeURIComponent(contactId)}`);
    if (!res.ok) return;
    const data = await res.json();
    setMessages(data.messages ?? []);
    setAvaActive(Boolean(data.avaActive));
    setContactName([data.contact?.firstName, data.contact?.lastName].filter(Boolean).join(" ") || data.contact?.phone || "");
  }, []);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  // Poll conversations + active thread.
  useEffect(() => {
    if (authed !== true) return;
    const t = setInterval(() => {
      loadConversations();
      if (activeId) loadMessages(activeId);
    }, 8000);
    return () => clearInterval(t);
  }, [authed, activeId, loadConversations, loadMessages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const login = async () => {
    setLoginError("");
    const res = await fetch("/api/dashboard/login", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }),
    });
    if (res.ok) { setPassword(""); loadConversations(); }
    else setLoginError("Incorrect password.");
  };

  const openThread = (c: Conversation) => { setActiveId(c.contactId); setMessages([]); loadMessages(c.contactId); };

  const send = async () => {
    if (!activeId || !draft.trim() || sending) return;
    setSending(true);
    const body = draft.trim();
    setDraft("");
    setMessages((m) => [...m, { direction: "outbound", body, date: new Date().toISOString() }]);
    await fetch("/api/dashboard/reply", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contactId: activeId, message: body }),
    });
    setAvaActive(false);
    setSending(false);
    loadMessages(activeId);
  };

  const toggleAva = async () => {
    if (!activeId) return;
    const next = !avaActive;
    setAvaActive(next);
    await fetch("/api/dashboard/ava", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contactId: activeId, on: next }),
    });
  };

  if (authed === null) {
    return <Shell><div className="p-10 text-neutral-dark/50">Loading…</div></Shell>;
  }

  if (authed === false) {
    return (
      <Shell>
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className={`${card} w-full max-w-sm p-8`}>
            <p className="eyebrow text-primary">Omniscient · Karcin</p>
            <h1 className="mt-2 font-display text-2xl text-neutral-dark">Messages</h1>
            <p className="mt-2 text-sm text-neutral-dark/60">Enter the dashboard password to continue.</p>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              placeholder="Password"
              className="mt-5 w-full rounded-lg border border-neutral-dark/15 bg-secondary px-4 py-3 text-sm focus:border-primary focus:outline-none"
            />
            {loginError && <p className="mt-2 text-sm text-primary">{loginError}</p>}
            <button onClick={login} className="btn-primary mt-4 w-full">Sign in</button>
          </div>
        </div>
      </Shell>
    );
  }

  const active = conversations.find((c) => c.contactId === activeId);

  return (
    <Shell>
      <div className="grid h-[calc(100vh-9rem)] grid-cols-1 gap-4 md:grid-cols-[320px_1fr]">
        {/* Thread list */}
        <div className={`${card} overflow-y-auto`}>
          <div className="sticky top-0 border-b border-neutral-dark/10 bg-highlight px-4 py-3">
            <p className="font-display text-lg text-neutral-dark">Conversations</p>
          </div>
          {conversations.length === 0 && <p className="p-4 text-sm text-neutral-dark/50">No conversations yet.</p>}
          {conversations.map((c) => (
            <button
              key={c.id || c.contactId} onClick={() => openThread(c)}
              className={`block w-full border-b border-neutral-dark/5 px-4 py-3 text-left transition hover:bg-secondary/60 ${activeId === c.contactId ? "bg-secondary" : ""}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-neutral-dark">{c.name}</span>
                {c.unread > 0 && <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-highlight">{c.unread}</span>}
              </div>
              <p className="mt-0.5 truncate text-sm text-neutral-dark/55">{c.lastMessage}</p>
            </button>
          ))}
        </div>

        {/* Conversation */}
        <div className={`${card} flex flex-col`}>
          {!activeId ? (
            <div className="flex flex-1 items-center justify-center text-neutral-dark/40">Select a conversation</div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-neutral-dark/10 px-5 py-3">
                <div>
                  <p className="font-medium text-neutral-dark">{contactName || active?.name}</p>
                  <p className="text-xs text-neutral-dark/50">{avaActive ? "Ava is handling replies" : "You're handling this — Ava paused"}</p>
                </div>
                <button
                  onClick={toggleAva}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${avaActive ? "bg-primary/10 text-primary" : "bg-neutral-dark/10 text-neutral-dark/70"}`}
                >
                  {avaActive ? "Ava: On" : "Ava: Off"} · tap to {avaActive ? "take over" : "hand back"}
                </button>
              </div>

              <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto px-5 py-4">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.direction === "inbound" ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${m.direction === "inbound" ? "bg-secondary text-neutral-dark" : "bg-primary text-highlight"}`}>
                      {m.body}
                    </div>
                  </div>
                ))}
                {messages.length === 0 && <p className="text-sm text-neutral-dark/40">No messages yet.</p>}
              </div>

              <div className="border-t border-neutral-dark/10 p-3">
                <div className="flex items-end gap-2">
                  <textarea
                    value={draft} onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                    placeholder="Type a reply… (sending pauses Ava)"
                    rows={1}
                    className="min-h-[44px] flex-1 resize-none rounded-lg border border-neutral-dark/15 bg-secondary px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                  />
                  <button onClick={send} disabled={sending || !draft.trim()} className="btn-primary disabled:opacity-50">Send</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head><title>Messages · Omniscient · Karcin</title><meta name="robots" content="noindex" /></Head>
      <div className="min-h-screen bg-secondary text-neutral-dark">
        <header className="border-b border-neutral-dark/10 bg-highlight px-6 py-4">
          <span className="font-display text-xl tracking-[0.18em]">KARCIN</span>
          <span className="ml-3 text-sm text-neutral-dark/50">Omniscient · Messages</span>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </>
  );
}
