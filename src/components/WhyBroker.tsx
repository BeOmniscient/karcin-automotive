import { motion } from "framer-motion";
import { HiCheck, HiX } from "react-icons/hi";

const dealership = [
  "Hours spent at the showroom",
  "Pressure to decide on the spot",
  "Single brand or single store",
  "Opaque pricing and add-ons",
];

const broker = [
  "Personal concierge from start to finish",
  "Access to multiple licensed dealers",
  "Transparent options and trade-offs",
  "Time saved — handled around your schedule",
];

export function WhyBroker() {
  return (
    <section className="container-page py-20 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Why use an auto broker</p>
        <h2 className="mt-4 section-heading">A different kind of car experience.</h2>
        <p className="mt-5 body-lg">
          We&rsquo;re an independent brokerage — that means we work for you, not a
          showroom. All transactions are handled through licensed dealership and lender
          partners, with accuracy and transparency at every step.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="rounded-xl2 border border-neutral-dark/10 bg-neutral-light/40 p-8"
        >
          <p className="eyebrow text-neutral-dark/60">Traditional dealership</p>
          <ul className="mt-5 space-y-3 text-sm text-neutral-dark/80">
            {dealership.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <HiX className="mt-0.5 shrink-0 text-neutral-dark/40" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-xl2 border border-primary/30 bg-primary/5 p-8"
        >
          <p className="eyebrow">The Karcin way</p>
          <ul className="mt-5 space-y-3 text-sm text-neutral-dark/85">
            {broker.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <HiCheck className="mt-0.5 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
