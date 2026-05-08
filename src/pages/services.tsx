import Head from "next/head";
import { PageHero } from "@/components/PageHero";
import { ServicesGrid } from "@/components/ServicesGrid";
import { CTA } from "@/components/CTA";

export default function ServicesPage() {
  return (
    <>
      <Head>
        <title>Services — Karcin Automotive</title>
        <meta
          name="description"
          content="Auto brokerage, lease search, vehicle sourcing, business and fleet support, lease return guidance, trade-in coordination, delivery coordination, and concierge guidance."
        />
      </Head>
      <PageHero
        eyebrow="Services"
        title="Everything you need, handled for you."
        description="From a quick lease search to coordinating a full business fleet."
      />
      <ServicesGrid showHeading={false} />
      <CTA />
    </>
  );
}
