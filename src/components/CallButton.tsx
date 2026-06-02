import { HiOutlinePhone } from "react-icons/hi";
import { PHONE_TEL, PHONE_DISPLAY } from "@/lib/site";

/**
 * Floating "Call 24/7" button — always reachable, pinned bottom-left so it doesn't
 * collide with the GHL chat widget (bottom-right). tel: link opens the dialer.
 */
export function CallButton() {
  return (
    <a
      href={PHONE_TEL}
      aria-label={`Call Karcin Automotive 24/7 at ${PHONE_DISPLAY}`}
      className="group fixed bottom-5 left-5 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-highlight shadow-card transition hover:scale-[1.03] hover:bg-primary/90"
    >
      <HiOutlinePhone className="h-5 w-5" />
      <span className="text-sm font-semibold">Call 24/7</span>
    </a>
  );
}
