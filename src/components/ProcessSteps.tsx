import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Share your preferences",
    description:
      "Tell us what you drive today, what you want next, and your timeline. No pressure, no obligation.",
  },
  {
    number: "02",
    title: "We search dealer-backed options",
    description:
      "Karcin connects with licensed dealership and lender partners to identify real opportunities for you.",
  },
  {
    number: "03",
    title: "Review with concierge guidance",
    description:
      "We walk you through pricing, terms, and trade-offs in plain language so the decision is yours.",
  },
  {
    number: "04",
    title: "Transaction through a licensed partner",
    description:
      "Final paperwork, financing, and approvals happen with the dealer or lender — fully transparent.",
  },
  {
    number: "05",
    title: "Delivery or pick-up coordinated",
    description:
      "We coordinate the hand-off so you can focus on driving away in the right vehicle.",
  },
];

export function ProcessSteps() {
  return (
    <section className="container-page py-20 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">How Karcin Works</p>
        <h2 className="mt-4 section-heading">
          A stress-free path to your next vehicle.
        </h2>
        <p className="mt-5 body-lg">
          Five simple steps from first conversation to keys in hand — coordinated through
          our network of licensed dealership and lender partners.
        </p>
      </div>

      <motion.div
        className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 1 } } }}
      >
        {steps.map((step) => (
          <motion.div
            key={step.number}
            variants={{
              hidden: { opacity: 0, x: -40 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
            }}
            className="rounded-xl2 bg-highlight/80 p-6 backdrop-blur" style={{ border: "2px solid #d3c36a" }}
          >
            <span className="font-display text-3xl text-primary">{step.number}</span>
            <h3 className="mt-4 font-display text-xl text-neutral-dark">{step.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-neutral-dark/70">
              {step.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
