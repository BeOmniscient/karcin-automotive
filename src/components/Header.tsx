import Link from "next/link";
import { useEffect, useState } from "react";
import { HeaderLockup } from "./Logo";

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
          ? "bg-secondary/90 backdrop-blur-md shadow-soft"
          : "bg-transparent"
      }`}
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

        <div className="hidden lg:block">
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
        <div className="lg:hidden border-t border-neutral-dark/10 bg-secondary/95 backdrop-blur-md">
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
