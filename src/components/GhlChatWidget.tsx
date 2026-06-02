import { useEffect } from "react";

/**
 * GoHighLevel Chat Widget loader.
 *
 * Injects the GHL chat widget when NEXT_PUBLIC_GHL_CHAT_WIDGET_ID is set (renders nothing
 * otherwise). Get the widget id from GHL: Sites -> Chat Widget -> create/configure the widget,
 * attach Conversation AI + Ava's knowledge base, then copy the data-widget-id from the embed.
 */
export function GhlChatWidget() {
  const widgetId = process.env.NEXT_PUBLIC_GHL_CHAT_WIDGET_ID;

  useEffect(() => {
    if (!widgetId) return;
    if (document.getElementById("ghl-chat-widget-script")) return;

    const s = document.createElement("script");
    s.id = "ghl-chat-widget-script";
    s.src = "https://widgets.leadconnectorhq.com/loader.js";
    s.setAttribute("data-resources-url", "https://widgets.leadconnectorhq.com/chat-widget/loader.js");
    s.setAttribute("data-widget-id", widgetId);
    s.async = true;
    document.body.appendChild(s);
  }, [widgetId]);

  return null;
}
