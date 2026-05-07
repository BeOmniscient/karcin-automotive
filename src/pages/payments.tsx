import Head from "next/head";
import { PageHero } from "@/components/PageHero";

export default function PaymentsPage() {
  return (
    <>
      <Head>
        <title>Secure Payment — Karcin Automotive</title>
        <meta
          name="description"
          content="Make a secure payment for Karcin Automotive concierge fees or deposits. Vehicle purchases, leases, and financing are handled through licensed dealer and lender partners."
        />
      </Head>
      <PageHero
        eyebrow="Secure Payment"
        title="Concierge fees &amp; deposits, processed securely."
        description="Vehicle purchases, leases, financing, and tax/registration fees are handled through licensed dealer and lender partners. Any payment here is for optional concierge services."
      />

      <section className="container-page pb-24">
        <div className="mx-auto max-w-2xl rounded-xl2 border-[3px] border-accent bg-highlight p-8 shadow-card md:p-12">
          <p className="eyebrow">Payment details</p>
          <h2 className="mt-3 font-display text-2xl text-neutral-dark md:text-3xl">
            Stripe Checkout coming soon
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-dark/75">
            This page will host a Stripe-powered payment form. Once configured, clients
            will be able to securely pay for concierge fees, vehicle hold deposits, or
            concierge packages here. Receipts are emailed automatically.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <Badge>SSL Secured</Badge>
            <Badge>Powered by Stripe</Badge>
            <Badge>PCI Compliant</Badge>
          </div>

          <p className="mt-6 text-xs leading-relaxed text-neutral-dark/60">
            By submitting a payment, you agree to our Terms of Service and Privacy
            Policy. Customer data is processed securely and is not shared beyond the
            partners necessary to provide the service.
          </p>
        </div>
      </section>
    </>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-neutral-dark/15 bg-secondary/60 px-3 py-2 text-[11px] font-medium uppercase tracking-widest text-neutral-dark/70">
      {children}
    </span>
  );
}
