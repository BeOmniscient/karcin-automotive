import Link from "next/link";
import { motion } from "framer-motion";
import { HiOutlineOfficeBuilding, HiOutlineUserGroup, HiOutlineChartBar } from "react-icons/hi";

const benefits = [
  {
    icon: HiOutlineOfficeBuilding,
    title: "Company vehicles",
    description: "Source executive vehicles and company cars across our partner network.",
  },
  {
    icon: HiOutlineUserGroup,
    title: "Small fleets",
    description: "Coordinate multi-vehicle leases and purchases without juggling dealers.",
  },
  {
    icon: HiOutlineChartBar,
    title: "Strategic guidance",
    description: "Tax-aware structuring and timing advice from a seasoned automotive advisor.",
  },
];

export function BusinessSupport() {
  return (
    <section className="container-page py-20 md:py-28">
      <div className="rounded-xl2 bg-neutral-dark px-8 py-14 text-secondary md:px-14 md:py-20">
        <div className="grid items-center gap-12 md:grid-cols-[1.1fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <p className="eyebrow text-accent">Fleet Business Vehicles</p>
            <h2 className="mt-4 font-display text-3xl leading-tight text-secondary md:text-5xl">
              For Business owners, executives, and operating teams.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-secondary/80">
              Karcin Automotive can assist business owners with company cars, executive vehicles, and small fleets — all handled with efficiency, professionalism and fiscal responsibility.
            </p>
            <div className="mt-8">
              <Link
                href="/business"
                className="btn bg-accent text-neutral-dark hover:bg-secondary"
              >
                Explore business support
              </Link>
            </div>
          </motion.div>

          <div className="grid gap-4">
            {benefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: idx * 0.08 }}
                  className="flex gap-4 rounded-xl border border-secondary/15 bg-secondary/5 p-5"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <Icon size={22} />
                  </span>
                  <div>
                    <p className="font-display text-lg text-secondary">{b.title}</p>
                    <p className="mt-1 text-sm text-secondary/70">{b.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
