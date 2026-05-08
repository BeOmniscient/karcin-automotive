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
            <p className="font-display text-2xl" style={{ color: "#EDE0C7" }}>Mike Napurano</p>
            <p className="mt-1 text-sm uppercase tracking-widest" style={{ color: "#EDE0C7", opacity: 0.75 }}>
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
          <h2 className="mt-4 font-display text-3xl leading-tight text-neutral-dark md:text-[2.4rem]">
            Over fifty years of experience working for you.
          </h2>
          <p className="mt-5 body-lg">
            Karcin Automotive was built on a simple belief: every customer should feel cared for, respected, and treated like family.
          </p>
          <p className="mt-4 body-lg">
            A few years after returning home from Vietnam, where he served his country and earned a Purple Heart, Mike began his journey in the automotive business. More than 50 years later, he still brings the same values to every customer relationship: honesty, loyalty, patience, and a genuine desire to help.
          </p>
          <p className="mt-4 body-lg">
            With decades of experience, a trusted network of dealer relationships, and access to some of America&rsquo;s best lending partners, Mike&rsquo;s mission is simple — to take the stress, confusion, and pressure out of buying or leasing a vehicle.
          </p>
          <p className="mt-4 body-lg">
            At Karcin Automotive, customers get straight answers, personal guidance, and a smoother way to get into the right vehicle. Because to Mike, this business has never just been about cars. It has always been about people. No showroom games. No pressure. Just honest guidance from a friend who has spent his career in this business.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
