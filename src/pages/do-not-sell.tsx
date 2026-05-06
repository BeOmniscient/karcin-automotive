import Head from "next/head";
import { PageHero } from "@/components/PageHero";

export default function DoNotSellPage() {
  return (
    <>
      <Head>
        <title>Do Not Sell or Share My Personal Information — Karcin Automotive</title>
        <meta
          name="description"
          content="Submit a request to opt out of the sale or sharing of your personal information."
        />
      </Head>
      <PageHero
        eyebrow="Privacy rights"
        title="Do Not Sell or Share My Personal Information"
        description="Use this page to submit a request related to the sale or sharing of your personal information, or to request access, correction, or deletion."
      />
      <section className="container-page pb-24">
        <div className="mx-auto max-w-2xl rounded-xl2 border border-neutral-dark/10 bg-highlight p-8 shadow-soft md:p-12">
          <p className="text-sm leading-relaxed text-neutral-dark/80">
            To submit a privacy request, email{" "}
            <a className="text-primary underline" href="mailto:privacy@karcinauto.com">
              privacy@karcinauto.com
            </a>{" "}
            with your request type (opt-out, access, correction, deletion) and the email
            or phone number associated with your account. We will action your request
            promptly and confirm completion via your preferred contact channel.
          </p>
        </div>
      </section>
    </>
  );
}
