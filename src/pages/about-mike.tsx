import Head from "next/head";
import { PageHero } from "@/components/PageHero";
import { AboutSection } from "@/components/AboutSection";
import { CTA } from "@/components/CTA";

export default function AboutMikePage() {
  return (
    <>
      <Head>
        <title>About Mike — Karcin Automotive</title>
        <meta
          name="description"
          content="Mike Napurano founded Karcin Automotive to bring honest guidance and a relationship-first approach to the vehicle search process."
        />
      </Head>
      <PageHero
        eyebrow="About Mike"
        title={<>Decades of automotive experience.<br />A relationship-first approach.</>}
        description="Honest guidance from someone who has spent his career in this business."
      />
      <AboutSection />
      <CTA
        title="Have a question for Mike?"
        description="Reach out — there&rsquo;s no obligation, and no showroom pressure."
        primaryLabel="Speak With a Concierge"
        primaryHref="/contact"
        secondaryLabel="Start Your Search"
        secondaryHref="/vehicle-request"
      />
    </>
  );
}
