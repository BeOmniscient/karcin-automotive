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
