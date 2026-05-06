import Link from "next/link";
import { motion } from "framer-motion";

export function PaymentsSection() {
  return (
    <section className="container-page py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-3xl rounded-xl2 border border-neutral-dark/10 bg-highlight p-10 text-center shadow-soft md:p-14"
      >
        <p className="eyebrow">Concierge packages &amp; secure payments</p>
        <h2 className="mt-4 section-heading">
          Optional concierge fees, processed securely.
        </h2>
        <p className="mt-5 body-lg">
          Vehicle purchases, leases, financing, and tax/registration fees are handled
          through licensed dealer and lender partners. Concierge fees and deposits are
          processed securely via Stripe.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/payments" className="btn-primary">
            Make a payment
          </Link>
          <Link href="/services" className="btn-secondary">
            See concierge packages
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
