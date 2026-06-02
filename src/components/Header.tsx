import Link from "next/link";
import { useEffect, useState } from "react";
import { HiOutlinePhone } from "react-icons/hi";
import { HeaderLockup } from "./Logo";
import { PHONE_TEL } from "@/lib/site";

const navLinks = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/services", label: "Services" },
  { href: "/about-mike", label: "About Mike" },
  { href: "/dealer-partners", label: "Dealer Partners" },
  { href: "/business", label: "Business" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-md shadow-soft"
          : ""
      }`}
      style={{ background: "#EDE0C7" }}
    >
      <div className="container-page flex h-20 items-center justify-between">
        <Link href="/" aria-label="Karcin Automotive home">
          <HeaderLockup tone="dark" size="md" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-neutral-dark/80 transition hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={PHONE_TEL}
            className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-4 py-2 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary/5"
          >
            <HiOutlinePhone className="h-4 w-4" />
            Call 24/7
          </a>
          <Link href="/vehicle-request" className="btn-primary">
            Start Your Search
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          className="lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Open menu</span>
          <div className="space-y-1.5">
            <span className="block h-0.5 w-6 bg-neutral-dark" />
            <span className="block h-0.5 w-6 bg-neutral-dark" />
            <span className="block h-0.5 w-4 bg-neutral-dark" />
          </div>
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-neutral-dark/10 backdrop-blur-md" style={{ background: "#EDE0C7" }}>
          <div className="container-page flex flex-col gap-3 py-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-2 text-sm font-medium text-neutral-dark/80 hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={PHONE_TEL}
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary/40 px-4 py-2.5 text-sm font-semibold text-primary"
            >
              <HiOutlinePhone className="h-4 w-4" />
              Call 24/7
            </a>
            <Link
              href="/vehicle-request"
              onClick={() => setOpen(false)}
              className="btn-primary mt-2 w-full"
            >
              Start Your Search
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
