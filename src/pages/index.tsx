import Head from "next/head";
import { Hero } from "@/components/Hero";
import { ProcessSteps } from "@/components/ProcessSteps";
import { ServicesGrid } from "@/components/ServicesGrid";
import { WhyBroker } from "@/components/WhyBroker";
import { AboutSection } from "@/components/AboutSection";
import { RequestForm } from "@/components/RequestForm";
import { DealerPartners } from "@/components/DealerPartners";
import { BusinessSupport } from "@/components/BusinessSupport";
import { Testimonials } from "@/components/Testimonials";
import { FAQPreview } from "@/components/FAQPreview";
import { CTA } from "@/components/CTA";

export default function Home() {
  return (
    <>
      <Head>
        <title>Karcin Automotive — Your Next Vehicle Purchase, Negotiated For You.</title>
        <meta name="description" content="Luxury auto brokerage with personal guidance and dealer-backed opportunities — negotiated for you." />

        {/* Open Graph / link previews */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://karcinauto.com" />
        <meta property="og:title" content="Karcin Automotive — Negotiated For You." />
        <meta property="og:description" content="Luxury auto brokerage with personal guidance and dealer-backed opportunities — negotiated for you." />
        <meta property="og:image" content="https://karcinauto.com/images/og-image.png" />

        {/* Twitter / iMessage fallback */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Karcin Automotive — Negotiated For You." />
        <meta name="twitter:description" content="Luxury auto brokerage with personal guidance and dealer-backed opportunities — negotiated for you." />
        <meta name="twitter:image" content="https://karcinauto.com/images/og-image.png" />
      </Head>
      <Hero />
      <ProcessSteps />
      <ServicesGrid />
      <WhyBroker />
      <AboutSection />
      <RequestForm />
      <DealerPartners />
      <BusinessSupport />
      <Testimonials />
      <FAQPreview />
      <CTA />
    </>
  );
}
