import Head from "next/head";
import { PageHero } from "@/components/PageHero";
import { RequestForm } from "@/components/RequestForm";

export default function VehicleRequestPage() {
  return (
    <>
      <Head>
        <title>Vehicle Request — Karcin Automotive</title>
        <meta
          name="description"
          content="Tell us what vehicle you&rsquo;re looking for and a Karcin concierge will connect with you."
        />
      </Head>
      <PageHero
        eyebrow="Vehicle Request"
        title="Tell us what you&rsquo;re looking for."
        description="A few details is all it takes — your information is used only to assist with your search."
      />
      <div className="container-page pb-24">
        <RequestForm embedded />
      </div>
    </>
  );
}
