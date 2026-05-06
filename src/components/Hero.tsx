import Link from "next/link";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-grain" />

      <motion.div
        aria-hidden
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 0.06, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="pointer-events-none absolute inset-x-0 top-10 -z-0 select-none text-center font-display text-[18vw] font-bold leading-none tracking-[0.05em] text-primary md:text-[16rem]"
      >
        KARCIN
      </motion.div>

      <div className="container-page relative z-10 flex min-h-[88vh] flex-col items-center justify-center pt-12 pb-16 text-center md:pt-20">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="eyebrow"
        >
          Luxury Auto Brokerage &middot; Concierge Service
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 max-w-3xl font-display text-4xl leading-[1.05] text-neutral-dark md:text-6xl"
        >
          Your Next Vehicle, Handled Personally.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-6 max-w-2xl body-lg"
        >
          We help you find lease, purchase and trade-in opportunities through trusted
          licensed dealership partners — without the dealership stress.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Link href="/vehicle-request" className="btn-primary">
            Start Your Search
          </Link>
          <Link href="/contact" className="btn-secondary">
            Speak With a Concierge
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.1 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-3 md:gap-6"
        >
          <VehicleCard label="Sport" tone="primary" />
          <VehicleCard label="SUV" tone="accent" />
          <VehicleCard label="Sedan" tone="dark" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 1.4 }}
          className="mt-14 flex flex-col items-center gap-2 text-xs uppercase tracking-widest text-neutral-dark/50"
        >
          <span>Scroll to explore</span>
          <span className="h-10 w-px bg-neutral-dark/30" />
        </motion.div>
      </div>
    </section>
  );
}

function VehicleCard({
  label,
  tone,
}: {
  label: string;
  tone: "primary" | "accent" | "dark";
}) {
  const toneMap = {
    primary: "bg-primary text-secondary",
    accent: "bg-accent text-neutral-dark",
    dark: "bg-neutral-dark text-secondary",
  } as const;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className={`flex h-32 w-48 flex-col justify-between rounded-xl2 px-5 py-4 shadow-card ${toneMap[tone]}`}
    >
      <span className="text-[10px] font-medium uppercase tracking-widest opacity-80">
        Concept
      </span>
      <div>
        <p className="font-display text-2xl leading-none">{label}</p>
        <p className="mt-1 text-xs opacity-80">Dealer-backed opportunity</p>
      </div>
    </motion.div>
  );
}
