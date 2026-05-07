import Head from "next/head";
import { PageHero } from "@/components/PageHero";
import { DealerPartners } from "@/components/DealerPartners";
import { CTA } from "@/components/CTA";

export default function DealerPartnersPage() {
  return (
    <>
      <Head>
        <title>Dealer Partners — Karcin Automotive</title>
        <meta
          name="description"
          content="Karcin works through licensed dealership and lender partners. We do not own inventory and we do not sell vehicles. All transactions occur through our partners."
        />
      </Head>
      <PageHero
        eyebrow="Dealer Partners"
        title="A network of licensed dealership and lender partners."
        description="Karcin doesn&rsquo;t own inventory. We collaborate with trusted partners so you have access to real opportunities — with transparent terms and clear approvals."
      />
      <DealerPartners />
      <section className="container-page py-16">
        <div className="mx-auto max-w-3xl rounded-xl2 border-[3px] border-accent bg-highlight p-8 shadow-soft">
          <p className="eyebrow">Compliance &amp; transparency</p>
          <h2 className="mt-3 font-display text-2xl text-neutral-dark md:text-3xl">
            Our commitments
          </h2>
          <ul className="mt-5 space-y-3 text-sm leading-relaxed text-neutral-dark/80">
            <li>&middot; We are an independent broker, not a dealership.</li>
            <li>
              &middot; Vehicle pricing, financing, and approvals are provided by our
              licensed partners and are subject to availability and approval.
            </li>
            <li>
              &middot; We obtain explicit consent for calls, texts, and emails as
              required by law.
            </li>
            <li>
              &middot; We honor data access, correction, and deletion requests promptly.
            </li>
          </ul>
        </div>
      </section>
      <CTA />
    </>
  );
}
