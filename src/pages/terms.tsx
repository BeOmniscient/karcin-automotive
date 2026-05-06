import Head from "next/head";
import { PageHero } from "@/components/PageHero";

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Terms of Service — Karcin Automotive</title>
        <meta name="description" content="Karcin Automotive terms of service." />
      </Head>
      <PageHero
        eyebrow="Terms of Service"
        title="The terms that govern our service."
        description="This is a placeholder. Final terms to be drafted with legal review prior to launch."
      />
      <section className="container-page pb-24">
        <div className="prose mx-auto max-w-3xl text-sm leading-relaxed text-neutral-dark/80">
          <p>
            Karcin Automotive is an independent automotive brokerage and concierge
            service. We do not own or sell vehicles. All vehicle availability, pricing,
            financing, and lease approvals are provided through licensed dealership and
            lender partners and are subject to approval and availability.
          </p>
        </div>
      </section>
    </>
  );
}
