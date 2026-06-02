import Link from "next/link";
import { HeaderLockup } from "./Logo";

const footerLinks = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/services", label: "Services" },
  { href: "/vehicle-request", label: "Vehicle Request" },
  { href: "/dealer-partners", label: "Dealer Partners" },
  { href: "/business", label: "Business" },
  { href: "/payments", label: "Payments" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "/brand", label: "Brand System" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/do-not-sell", label: "Do Not Sell or Share My Personal Information" },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-neutral-dark/10 bg-neutral-dark text-secondary">
      <div className="container-page py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <Link href="/" aria-label="Karcin Automotive home">
              <HeaderLockup tone="light" size="lg" />
            </Link>
            <p className="mt-4 text-sm text-secondary/70">
              Lease &middot; Source &middot; Connect &middot; Deliver
            </p>
            <p className="mt-6 text-sm leading-relaxed text-secondary/70">
              Your automotive concierge for lease, finance, purchase, and trade-in
              opportunities — coordinated through trusted licensed dealership partners.
            </p>
          </div>

          <div>
            <p className="eyebrow text-accent">Explore</p>
            <ul className="mt-4 space-y-2 text-sm">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-secondary/80 transition hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow text-accent">Connect</p>
            <ul className="mt-4 space-y-2 text-sm text-secondary/80">
              <li>
                <a href="mailto:hello@karcinauto.com" className="hover:text-accent">
                  hello@karcinauto.com
                </a>
              </li>
              <li>
                <a href="tel:+19732184898" className="hover:text-accent">
                  (973) 218-4898
                </a>
              </li>
              <li>
                <a
                  href="https://karcinauto.com"
                  className="hover:text-accent"
                  target="_blank"
                  rel="noreferrer"
                >
                  karcinauto.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-secondary/15 pt-8">
          <p className="text-xs leading-relaxed text-secondary/60">
            <span className="font-semibold text-secondary/80">Disclaimer: </span>
            Karcin Automotive is an independent automotive brokerage and concierge service.
            We do not own or sell vehicles. All vehicle availability, pricing, financing,
            and lease approvals are provided through licensed dealership and lender
            partners and are subject to approval and availability. Our services comply
            with advertising, privacy, and data broker regulations, and we obtain explicit
            consent for calls, texts, and emails as required by law.
          </p>
          <div className="mt-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-secondary/70">
              {legalLinks.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-accent">
                  {link.label}
                </Link>
              ))}
            </div>
            <p className="text-xs text-secondary/50">
              &copy; {new Date().getFullYear()} Karcin Automotive. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
