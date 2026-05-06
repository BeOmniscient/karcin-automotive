import Link from "next/link";
import { motion } from "framer-motion";

type CTAProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function CTA({
  eyebrow = "Ready when you are",
  title = "Tell us what you want. We&rsquo;ll help you find it.",
  description = "Start your search or speak with a concierge — there&rsquo;s no obligation.",
  primaryHref = "/vehicle-request",
  primaryLabel = "Start Your Search",
  secondaryHref = "/contact",
  secondaryLabel = "Speak With a Concierge",
}: CTAProps) {
  return (
    <section className="container-page py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="overflow-hidden rounded-xl2 bg-primary px-8 py-14 text-secondary md:px-14 md:py-20"
      >
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-accent">{eyebrow}</p>
          <h2
            className="mt-4 font-display text-3xl leading-tight text-secondary md:text-5xl"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <p className="mt-5 text-base leading-relaxed text-secondary/85">{description}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={primaryHref}
              className="btn bg-secondary text-neutral-dark hover:bg-accent"
            >
              {primaryLabel}
            </Link>
            <Link
              href={secondaryHref}
              className="btn border border-secondary/30 text-secondary hover:bg-secondary/10"
            >
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
