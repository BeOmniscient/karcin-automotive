import Head from "next/head";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiPlus, HiMinus } from "react-icons/hi";
import { PageHero } from "@/components/PageHero";
import { faqs } from "@/components/FAQPreview";
import { CTA } from "@/components/CTA";

export default function FAQPage() {
  return (
    <>
      <Head>
        <title>FAQ — Karcin Automotive</title>
        <meta
          name="description"
          content="Frequently asked questions about Karcin Automotive&rsquo;s brokerage model, fees, timing, customer rights, and data privacy."
        />
      </Head>
      <PageHero
        eyebrow="FAQ"
        title="Common questions, answered."
        description="More questions? Reach out — we&rsquo;ll respond personally."
      />

      <section className="container-page pb-16">
        <div className="mx-auto max-w-3xl divide-y divide-neutral-dark/10 rounded-xl2 border-[3px] border-accent bg-highlight">
          {faqs.map((faq, idx) => (
            <Row key={idx} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      <CTA />
    </>
  );
}

function Row({ q, a }: { q: string; a: string }) {
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
