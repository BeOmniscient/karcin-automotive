import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { HiPlus, HiMinus } from "react-icons/hi";

export const faqs = [
  {
    q: "Is Karcin a dealership?",
    a: "No. Karcin Automotive is an independent automotive brokerage and concierge service. We do not own or sell vehicles. All vehicle transactions occur through licensed dealership and lender partners.",
  },
  {
    q: "Do you charge fees?",
    a: "Vehicle purchases, leases, financing, and tax/registration fees are handled through licensed dealers and lenders. Karcin may charge optional concierge fees or deposits for specific services — these are always disclosed up front.",
  },
  {
    q: "How long does it take to find a vehicle?",
    a: "Timelines vary based on availability and your preferences. We&rsquo;ll set realistic expectations during your initial conversation and keep you updated throughout the search.",
  },
  {
    q: "How do you protect my information?",
    a: "We obtain explicit consent for calls, texts, and emails, and only use your information to assist with your vehicle search. You can request data access, correction, or deletion at any time.",
  },
  {
    q: "Can I opt out of communications?",
    a: "Yes. You can opt out of any channel at any time by replying STOP to text messages, using the unsubscribe link in emails, or contacting us directly.",
  },
];

export function FAQPreview() {
  return (
    <section className="container-page py-20 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">FAQ</p>
        <h2 className="mt-4 section-heading">Common questions, answered.</h2>
      </div>

      <div className="mx-auto mt-10 max-w-3xl divide-y divide-neutral-dark/10 rounded-xl2 border-[2px] border-accent bg-highlight">
        {faqs.slice(0, 4).map((faq, idx) => (
          <FaqRow key={idx} q={faq.q} a={faq.a} />
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link href="/faq" className="btn-secondary">
          See all FAQs
        </Link>
      </div>
    </section>
  );
}

function FaqRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
      >
        <span className="font-display text-base text-neutral-dark md:text-lg">{q}</span>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          {open ? <HiMinus /> : <HiPlus />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p
              className="px-6 pb-6 text-sm leading-relaxed text-neutral-dark/75"
              dangerouslySetInnerHTML={{ __html: a }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
