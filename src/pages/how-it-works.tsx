import Head from "next/head";
import { PageHero } from "@/components/PageHero";
import { ProcessSteps } from "@/components/ProcessSteps";
import { WhyBroker } from "@/components/WhyBroker";
import { CTA } from "@/components/CTA";

export default function HowItWorksPage() {
  return (
    <>
      <Head>
        <title>How It Works — Karcin Automotive</title>
        <meta
          name="description"
          content="The Karcin process: share your preferences, we search dealer-backed options, you review with concierge guidance, and the licensed partner handles the transaction."
        />
      </Head>
      <PageHero
        eyebrow="How It Works"
        title="A calmer path to your next vehicle."
        description="From first conversation to keys in hand, here&rsquo;s what working with Karcin looks like."
      />
      <ProcessSteps />
      <WhyBroker />
      <CTA />
    </>
  );
}
