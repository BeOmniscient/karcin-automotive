type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
  window.fbq?.("trackCustom", name, params);
}
