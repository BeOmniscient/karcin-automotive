import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export function AboutSection() {
  return (
    <section className="container-page py-20 md:py-28">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="relative aspect-[4/5] overflow-hidden rounded-xl2 bg-neutral-dark"
        >
          <Image
            src="/images/mike.png"
            alt="Mike Napurano, Founder of Karcin Automotive"
            fill
            className="object-cover object-top"
            priority
          />
          <div className="absolute bottom-6 left-6 right-6 rounded-xl p-5" style={{ background: "#00042C" }}>
            <p className="font-display text-lg" style={{ color: "#d3c36a" }}>Mike Napurano</p>
            <p className="mt-1 text-xs uppercase tracking-widest" style={{ color: "#d3c36a", opacity: 0.75 }}>
              Founder &middot; Veteran
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <p className="eyebrow">About Mike</p>
          <h2 className="mt-4 section-heading">
            Decades of experience. A relationship-first approach.
          </h2>
          <p className="mt-5 body-lg">
            Karcin Automotive was founded on a simple idea: clients deserve straight
            answers and a smoother process. Mike brings deep industry experience and a
            network of trusted dealership and lender partners to every search.
          </p>
          <p className="mt-4 body-lg">
            No showroom games. No pressure. Just honest guidance from someone who has
            spent his career in this business.
          </p>
          <div className="mt-8">
            <Link href="/about-mike" className="btn-secondary">
              Read Mike&rsquo;s story
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
