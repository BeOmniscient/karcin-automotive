import Link from "next/link";
import { motion } from "framer-motion";

const points = [
  "We partner with multiple licensed dealerships and lenders.",
  "All vehicle transactions occur through those partners.",
  "Pricing, financing, and approvals are subject to dealer/lender approval and availability.",
];

export function DealerPartners() {
  return (
    <section className="bg-neutral-light/40 py-20 md:py-28">
      <div className="container-page">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <p className="eyebrow">Dealer-backed opportunities</p>
            <h2 className="mt-4 section-heading">
              Built on a network of licensed partners.
            </h2>
            <p className="mt-5 body-lg">
              Karcin doesn&rsquo;t own inventory. We collaborate with trusted dealership
              and lender partners to surface real opportunities with transparent terms.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-neutral-dark/80">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link href="/dealer-partners" className="btn-secondary">
                Learn how partnerships work
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex aspect-[3/2] items-center justify-center rounded-xl2 border-[3px] border-accent bg-highlight/80 text-xs uppercase tracking-widest text-neutral-dark/40"
              >
                Partner Logo
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
