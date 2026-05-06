import Head from "next/head";
import { PageHero } from "@/components/PageHero";

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy — Karcin Automotive</title>
        <meta name="description" content="Karcin Automotive privacy policy." />
      </Head>
      <PageHero
        eyebrow="Privacy Policy"
        title="How we handle your information."
        description="This is a placeholder. Final policy to be drafted with legal review prior to launch."
      />
      <section className="container-page pb-24">
        <div className="prose mx-auto max-w-3xl text-sm leading-relaxed text-neutral-dark/80">
          <p>
            Karcin Automotive collects information you provide via our forms and
            communications to assist with your vehicle search. We obtain explicit consent
            for calls, texts, and emails and only share information with the partners
            necessary to deliver our service.
          </p>
          <p className="mt-4">
            You may request access, correction, or deletion of your personal information
            at any time by contacting us at hello@karcinauto.com.
          </p>
        </div>
      </section>
    </>
  );
}
