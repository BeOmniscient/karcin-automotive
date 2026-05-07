import { motion } from "framer-motion";
import React from "react";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
}) {
  return (
    <section className="container-page pb-12 pt-16 md:pb-16 md:pt-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-3xl text-center"
      >
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 font-display text-4xl leading-tight text-neutral-dark md:text-6xl">
          {title}
        </h1>
        {description && <p className="mt-5 body-lg">{description}</p>}
      </motion.div>
    </section>
  );
}
