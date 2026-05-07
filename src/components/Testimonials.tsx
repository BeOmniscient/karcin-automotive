import { motion } from "framer-motion";

const placeholders = [
  {
    quote:
      "Add your customer story here. Karcin will populate this section after launch with verified reviews.",
    name: "Customer Name",
    detail: "Vehicle / City",
  },
  {
    quote:
      "Add another customer story here. Real, verified testimonials reinforce our compliance commitment.",
    name: "Customer Name",
    detail: "Vehicle / City",
  },
  {
    quote:
      "Add a third customer story here. We avoid unverified or exaggerated claims.",
    name: "Customer Name",
    detail: "Vehicle / City",
  },
  {
    quote:
      "Add a fourth customer story here. Karcin will populate this section after launch with verified reviews.",
    name: "Customer Name",
    detail: "Vehicle / City",
  },
  {
    quote:
      "Add a fifth customer story here. Real, verified testimonials reinforce our compliance commitment.",
    name: "Customer Name",
    detail: "Vehicle / City",
  },
  {
    quote:
      "Add a sixth customer story here. We avoid unverified or exaggerated claims.",
    name: "Customer Name",
    detail: "Vehicle / City",
  },
];

export function Testimonials() {
  return (
    <section className="bg-secondary/60 py-20 md:py-28">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Stories from clients</p>
          <h2 className="mt-4 section-heading">
            Real experiences. Verified at launch.
          </h2>
          <p className="mt-5 body-lg">
            This section will be populated with verified client reviews after launch.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {placeholders.map((t, idx) => (
            <motion.figure
              key={idx}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="rounded-xl2 border-[2px] border-accent bg-highlight p-6 shadow-soft"
            >
              <blockquote className="text-sm leading-relaxed text-neutral-dark/80">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5">
                <p className="font-display text-base text-neutral-dark">{t.name}</p>
                <p className="text-xs uppercase tracking-widest text-neutral-dark/60">
                  {t.detail}
                </p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
