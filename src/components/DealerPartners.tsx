import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const logos = [
  { src: "/images/audi.png", alt: "Audi" },
  { src: "/images/bmw.png", alt: "BMW" },
  { src: "/images/ford.png", alt: "Ford" },
  { src: "/images/honda.png", alt: "Honda" },
  { src: "/images/kia.png", alt: "Kia" },
  { src: "/images/lexus.png", alt: "Lexus" },
  { src: "/images/mazda.png", alt: "Mazda" },
  { src: "/images/mercedes.png", alt: "Mercedes-Benz" },
  { src: "/images/toyota.png", alt: "Toyota" },
];

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
            className="grid grid-cols-3 gap-3"
          >
            {logos.map((logo) => (
              <div
                key={logo.alt}
                className="flex aspect-square items-center justify-center rounded-xl border-[2px] border-accent bg-highlight/80 p-4"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={100}
                  height={100}
                  className="object-contain w-full h-full"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
