import Link from "next/link";
import { motion } from "framer-motion";
import {
  HiOutlineKey,
  HiOutlineCurrencyDollar,
  HiOutlineSearchCircle,
  HiOutlineBriefcase,
  HiOutlineClipboardCheck,
  HiOutlineSwitchHorizontal,
  HiOutlineTruck,
  HiOutlineSparkles,
} from "react-icons/hi";
import type { IconType } from "react-icons";

type Service = {
  icon: IconType;
  title: string;
  description: string;
};

const services: Service[] = [
  {
    icon: HiOutlineKey,
    title: "Auto Brokerage",
    description:
      "Personalized vehicle search across our dealer partner network — no showroom pressure.",
  },
  {
    icon: HiOutlineCurrencyDollar,
    title: "Lease Search",
    description:
      "We hunt down lease opportunities on the brands and models you actually want.",
  },
  {
    icon: HiOutlineSearchCircle,
    title: "Vehicle Sourcing",
    description: "New or pre-owned, we source the right car through licensed partners.",
  },
  {
    icon: HiOutlineBriefcase,
    title: "Business & Fleet",
    description:
      "Company cars, executive vehicles, and small fleets — handled with discretion.",
  },
  {
    icon: HiOutlineClipboardCheck,
    title: "Lease Return Guidance",
    description:
      "Make sense of your lease-end options and avoid surprise wear-and-tear bills.",
  },
  {
    icon: HiOutlineSwitchHorizontal,
    title: "Trade-In Coordination",
    description:
      "We help you understand fair value and coordinate the trade with your next vehicle.",
  },
  {
    icon: HiOutlineTruck,
    title: "Delivery Coordination",
    description:
      "We arrange pick-up or delivery through partners so the hand-off is seamless.",
  },
  {
    icon: HiOutlineSparkles,
    title: "Concierge Guidance",
    description:
      "Honest advice from someone who has spent decades in the industry — on your side.",
  },
];

export function ServicesGrid() {
  return (
    <section className="bg-secondary/60 py-20 md:py-28">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Services</p>
          <h2 className="mt-4 section-heading">
            Everything you need, handled for you.
          </h2>
          <p className="mt-5 body-lg">
            From a quick lease search to coordinating a full business fleet, Karcin is
            your single point of contact through every step.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="group rounded-xl2 border-[3px] border-accent bg-highlight p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-secondary">
                  <Icon size={22} />
                </span>
                <h3 className="mt-5 font-display text-lg text-neutral-dark">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-dark/70">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link href="/services" className="btn-secondary">
            See full services
          </Link>
        </div>
      </div>
    </section>
  );
}
