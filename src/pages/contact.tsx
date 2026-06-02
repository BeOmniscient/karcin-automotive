import Head from "next/head";
import { PageHero } from "@/components/PageHero";
import { HiOutlineMail, HiOutlinePhone, HiOutlineCalendar } from "react-icons/hi";

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>Contact — Karcin Automotive</title>
        <meta
          name="description"
          content="Get in touch with Karcin Automotive. Phone, email, contact form, and call scheduling."
        />
      </Head>
      <PageHero
        eyebrow="Contact"
        title="Let&rsquo;s start a conversation."
        description="Phone, email, or schedule a call — whichever fits your style."
      />

      <section className="container-page pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          <ContactCard
            Icon={HiOutlinePhone}
            label="Call or text us 24/7"
            value="(973) 218-4898"
            href="tel:+19732184898"
          />
          <ContactCard
            Icon={HiOutlineMail}
            label="Email us"
            value="hello@karcinauto.com"
            href="mailto:hello@karcinauto.com"
          />
          <ContactCard
            Icon={HiOutlineCalendar}
            label="Schedule a call"
            value="Pick a time"
            href="#schedule"
          />
        </div>

        <div
          id="schedule"
          className="mt-12 rounded-xl2 border-[2px] border-accent bg-highlight p-8 text-center shadow-soft md:p-12"
        >
          <p className="eyebrow">Schedule</p>
          <h2 className="mt-3 font-display text-2xl text-neutral-dark md:text-3xl">
            Calendly embed coming soon
          </h2>
          <p className="mt-3 text-sm text-neutral-dark/70">
            We&rsquo;ll embed a scheduling widget here so you can book a concierge call
            at a time that works for you.
          </p>
        </div>
      </section>
    </>
  );
}

function ContactCard({
  Icon,
  label,
  value,
  href,
}: {
  Icon: React.ComponentType<{ size?: number }>;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="group flex items-start gap-4 rounded-xl2 border-[2px] border-accent bg-highlight p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-secondary">
        <Icon size={22} />
      </span>
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-neutral-dark/60">
          {label}
        </p>
        <p className="mt-1 font-display text-lg text-neutral-dark">{value}</p>
      </div>
    </a>
  );
}
