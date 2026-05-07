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

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        {steps.map((step, idx) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: idx * 0.08 }}
            className="rounded-xl2 bg-highlight/80 p-6 backdrop-blur" style={{ border: "5px solid #d3c36a" }}
          >
            <span className="font-display text-3xl text-primary">{step.number}</span>
            <h3 className="mt-4 font-display text-xl text-neutral-dark">{step.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-neutral-dark/70">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
