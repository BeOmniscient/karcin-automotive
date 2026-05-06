import Head from "next/head";
import { PageHero } from "@/components/PageHero";
import { BusinessSupport } from "@/components/BusinessSupport";
import { CTA } from "@/components/CTA";

export default function BusinessPage() {
  return (
    <>
      <Head>
        <title>Business Vehicle Support — Karcin Automotive</title>
        <meta
          name="description"
          content="Company cars, executive vehicles, and small fleets — sourced and coordinated through Karcin&rsquo;s network of licensed dealership partners."
        />
      </Head>
      <PageHero
        eyebrow="Business Vehicle Support"
        title="For owners, executives, and operating teams."
        description="Sourcing and coordination for company cars, executive vehicles, and small fleets."
      />
      <BusinessSupport />
      <CTA
        title="Need to outfit your business?"
        description="Tell us what your team drives. We&rsquo;ll coordinate the rest."
        primaryLabel="Start Your Request"
        primaryHref="/vehicle-request"
      />
    </>
  );
}
