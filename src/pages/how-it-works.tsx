import Head from "next/head";
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
      <ProcessSteps />
      <WhyBroker />
      <CTA />
    </>
  );
}
