import Head from "next/head";
import { motion } from "framer-motion";
import {
  ApexMark,
  Monogram,
  Wordmark,
  HeaderLockup,
  VerticalLockup,
} from "@/components/Logo";

const palette = [
  { name: "Karcin Crimson", hex: "#7D1424", role: "Primary", tw: "bg-primary" },
  { name: "Champagne Gold", hex: "#D8C7A7", role: "Accent", tw: "bg-accent" },
  { name: "Warm Ivory", hex: "#F8F1E7", role: "Background", tw: "bg-secondary" },
  { name: "Charcoal", hex: "#1A1A1A", role: "Type", tw: "bg-neutral-dark" },
  { name: "Neutral Taupe", hex: "#E6E0D4", role: "Surface", tw: "bg-neutral-light" },
];

export default function BrandPage() {
  return (
    <>
      <Head>
        <title>Brand System — Karcin Automotive</title>
        <meta
          name="description"
          content="The Karcin Automotive visual identity system: Apex mark, monogram, wordmark, lockups, color palette, and typography."
        />
      </Head>

      <section className="container-page pb-12 pt-16 md:pb-16 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="eyebrow">Brand System</p>
          <h1 className="mt-4 font-display text-4xl leading-tight text-neutral-dark md:text-6xl">
            One mark. One word. Built to scale.
          </h1>
          <p className="mt-5 body-lg">
            Karcin&rsquo;s identity is built around the <em>Apex</em> — a single
            chevron that reads as forward motion, the apex of a turn, and a horizon
            to drive toward. It pairs with an editorial wordmark in Playfair Display
            for a system that feels confident at any size.
          </p>
        </motion.div>
      </section>

      {/* Hero presentation */}
      <section className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="rounded-xl2 border border-neutral-dark/10 bg-highlight px-8 py-20 shadow-card md:px-16 md:py-28"
        >
          <div className="flex justify-center">
            <VerticalLockup tone="dark" />
          </div>
        </motion.div>
      </section>

      {/* The Apex mark */}
      <section className="container-page py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] md:items-center">
          <div>
            <p className="eyebrow">01 &middot; The Apex</p>
            <h2 className="mt-4 section-heading">A single, ownable mark.</h2>
            <p className="mt-5 body-lg">
              Reduced to its essence: two strokes, one vanishing point. The Apex
              stands alone as a favicon, social avatar, watermark, embroidery, or
              the chrome on a key fob. It scales from 16&nbsp;px to a billboard
              without breaking.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-neutral-dark/80">
              <Bullet>Forward motion &mdash; the apex of a turn</Bullet>
              <Bullet>An automotive grille hint, never literal</Bullet>
              <Bullet>A horizon: where guidance points the way</Bullet>
            </ul>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <SwatchCard label="On ivory" tone="light">
              <ApexMark className="h-16 w-auto text-primary" />
            </SwatchCard>
            <SwatchCard label="On crimson" tone="primary">
              <ApexMark className="h-16 w-auto text-secondary" />
            </SwatchCard>
            <SwatchCard label="On charcoal" tone="dark">
              <ApexMark className="h-16 w-auto text-accent" />
            </SwatchCard>
          </div>
        </div>
      </section>

      {/* Wordmark */}
      <section className="bg-secondary/60 py-20 md:py-28">
        <div className="container-page">
          <div className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:items-center">
            <div>
              <p className="eyebrow">02 &middot; Wordmark</p>
              <h2 className="mt-4 section-heading">
                Editorial typography, restrained.
              </h2>
              <p className="mt-5 body-lg">
                Playfair Display sets KARCIN with generous tracking. A hairline
                gold rule below carries the Apex notch &mdash; the brand mark
                lives inside the wordmark itself. AUTOMOTIVE in tracked Inter
                anchors the lockup.
              </p>
            </div>
            <div className="space-y-4">
              <div className="rounded-xl2 border border-neutral-dark/10 bg-highlight px-8 py-12 shadow-soft">
                <Wordmark className="mx-auto h-32 w-auto" />
              </div>
              <div className="rounded-xl2 bg-neutral-dark px-8 py-12 shadow-soft">
                <Wordmark className="mx-auto h-32 w-auto" tone="light" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Monogram */}
      <section className="container-page py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div className="grid grid-cols-2 gap-4">
            <SwatchCard label="Primary" tone="light">
              <Monogram className="h-32 w-auto text-primary" />
            </SwatchCard>
            <SwatchCard label="Reversed" tone="dark">
              <Monogram className="h-32 w-auto text-accent" />
            </SwatchCard>
            <SwatchCard label="Mono" tone="light" span>
              <Monogram className="h-24 w-auto text-neutral-dark" withHorizon={false} />
            </SwatchCard>
          </div>
          <div>
            <p className="eyebrow">03 &middot; Monogram</p>
            <h2 className="mt-4 section-heading">
              A geometric K, anchored to the horizon.
            </h2>
            <p className="mt-5 body-lg">
              Where the wordmark is an editorial moment, the monogram is the
              workmanlike alternative for compact contexts &mdash; embossed on
              binders, stamped on documents, etched on glass. A hairline horizon
              line passes through the apex point, tying every artifact in the
              system back to the brand mark.
            </p>
          </div>
        </div>
      </section>

      {/* Lockups */}
      <section className="bg-secondary/60 py-20 md:py-28">
        <div className="container-page">
          <p className="eyebrow text-center">04 &middot; Lockups</p>
          <h2 className="mt-4 text-center section-heading">
            Horizontal &amp; stacked variants.
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <div className="rounded-xl2 border border-neutral-dark/10 bg-highlight px-10 py-12 shadow-soft">
              <p className="eyebrow">Horizontal — light surface</p>
              <div className="mt-6 flex justify-center">
                <HeaderLockup tone="dark" size="lg" />
              </div>
            </div>
            <div className="rounded-xl2 bg-neutral-dark px-10 py-12 shadow-soft">
              <p className="eyebrow text-accent">Horizontal — dark surface</p>
              <div className="mt-6 flex justify-center">
                <HeaderLockup tone="light" size="lg" />
              </div>
            </div>
            <div className="rounded-xl2 bg-primary px-10 py-12 shadow-soft md:col-span-2">
              <p className="eyebrow text-accent">Stacked — primary surface</p>
              <div className="mt-6 flex justify-center">
                <VerticalLockup tone="light" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Color */}
      <section className="container-page py-20 md:py-28">
        <p className="eyebrow">05 &middot; Color</p>
        <h2 className="mt-4 section-heading">A warm, editorial palette.</h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {palette.map((c) => (
            <div
              key={c.hex}
              className="overflow-hidden rounded-xl2 border border-neutral-dark/10 bg-highlight shadow-soft"
            >
              <div className={`${c.tw} h-32`} aria-hidden />
              <div className="p-5">
                <p className="font-display text-base text-neutral-dark">{c.name}</p>
                <p className="mt-1 text-[11px] uppercase tracking-widest text-neutral-dark/55">
                  {c.role}
                </p>
                <p className="mt-3 font-mono text-xs text-neutral-dark/70">
                  {c.hex}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section className="bg-secondary/60 py-20 md:py-28">
        <div className="container-page">
          <p className="eyebrow">06 &middot; Typography</p>
          <h2 className="mt-4 section-heading">Two voices. Clearly cast.</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl2 border border-neutral-dark/10 bg-highlight p-10 shadow-soft">
              <p className="eyebrow">Display</p>
              <p className="mt-3 font-display text-7xl text-neutral-dark">Aa</p>
              <p className="mt-2 text-sm text-neutral-dark/70">
                Playfair Display, 700
              </p>
              <p className="mt-6 font-display text-2xl leading-snug text-neutral-dark">
                The right vehicle, handled personally.
              </p>
              <p className="mt-4 text-xs uppercase tracking-widest text-neutral-dark/55">
                ABCDEFGHIJKLMNOPQRSTUVWXYZ &middot; 0123456789
              </p>
            </div>
            <div className="rounded-xl2 border border-neutral-dark/10 bg-highlight p-10 shadow-soft">
              <p className="eyebrow">Body</p>
              <p className="mt-3 font-sans text-7xl font-medium text-neutral-dark">
                Aa
              </p>
              <p className="mt-2 text-sm text-neutral-dark/70">Inter, 400 / 500 / 700</p>
              <p className="mt-6 text-base leading-relaxed text-neutral-dark/85">
                Karcin Automotive is an independent brokerage and concierge. We
                connect you with vehicle opportunities through licensed dealership
                and lender partners.
              </p>
              <p className="mt-4 text-xs uppercase tracking-widest text-neutral-dark/55">
                abcdefghijklmnopqrstuvwxyz &middot; 0123456789
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Application examples */}
      <section className="container-page py-20 md:py-28">
        <p className="eyebrow">07 &middot; In application</p>
        <h2 className="mt-4 section-heading">A system, not a single image.</h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <FaviconPreview />
          <BusinessCardPreview />
          <SignaturePreview />
        </div>
      </section>

      {/* Downloads */}
      <section className="bg-neutral-dark py-20 text-secondary md:py-24">
        <div className="container-page">
          <p className="eyebrow text-accent">08 &middot; Assets</p>
          <h2 className="mt-4 font-display text-3xl text-secondary md:text-5xl">
            Download the brand kit.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-secondary/80">
            All marks are vector SVG &mdash; infinitely scalable, theme-aware, and
            tiny on disk. Drop them into Figma, Illustrator, or directly into HTML.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Download href="/images/logo/karcin-wordmark.svg">Wordmark (light)</Download>
            <Download href="/images/logo/karcin-wordmark-light.svg">Wordmark (dark)</Download>
            <Download href="/images/logo/karcin-monogram.svg">Monogram</Download>
            <Download href="/images/logo/karcin-apex-mark.svg">Apex mark</Download>
            <Download href="/images/logo/karcin-lockup.svg">Horizontal lockup</Download>
            <Download href="/images/logo/karcin-badge.svg">Badge</Download>
          </div>
        </div>
      </section>
    </>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
      <span>{children}</span>
    </li>
  );
}

function SwatchCard({
  label,
  tone,
  span,
  children,
}: {
  label: string;
  tone: "light" | "primary" | "dark";
  span?: boolean;
  children: React.ReactNode;
}) {
  const bg =
    tone === "primary"
      ? "bg-primary"
      : tone === "dark"
      ? "bg-neutral-dark"
      : "bg-highlight";
  const border = tone === "light" ? "border border-neutral-dark/10" : "";
  const eyebrowTone = tone === "light" ? "text-neutral-dark/55" : "text-secondary/65";

  return (
    <div
      className={`flex aspect-square flex-col justify-between rounded-xl2 ${bg} ${border} p-6 shadow-soft ${
        span ? "col-span-2 aspect-[2/1]" : ""
      }`}
    >
      <p
        className={`text-[10px] font-medium uppercase tracking-widest ${eyebrowTone}`}
      >
        {label}
      </p>
      <div className="flex flex-1 items-center justify-center">{children}</div>
      <span aria-hidden />
    </div>
  );
}

function FaviconPreview() {
  return (
    <div className="rounded-xl2 border border-neutral-dark/10 bg-highlight p-6 shadow-soft">
      <p className="eyebrow">Favicon</p>
      <div className="mt-6 flex flex-wrap items-end gap-6">
        {[64, 32, 24, 16].map((size) => (
          <div key={size} className="flex flex-col items-center gap-2">
            <div
              className="flex items-center justify-center rounded-md bg-secondary"
              style={{ width: size, height: size }}
            >
              <ApexMark
                className="text-primary"
                style={{ width: size * 0.7, height: size * 0.7 }}
              />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-neutral-dark/50">
              {size}px
            </span>
          </div>
        ))}
      </div>
      <p className="mt-6 text-xs leading-relaxed text-neutral-dark/65">
        The Apex stays legible down to 16&nbsp;px. SVG favicon ships with the
        site &mdash; no PNG sprite sheet required.
      </p>
    </div>
  );
}

function BusinessCardPreview() {
  return (
    <div className="rounded-xl2 border border-neutral-dark/10 bg-highlight p-6 shadow-soft">
      <p className="eyebrow">Business card</p>
      <div className="mt-6 space-y-3">
        <div className="flex aspect-[7/4] flex-col items-center justify-center rounded-lg bg-primary text-secondary shadow-soft">
          <ApexMark className="h-7 w-auto text-secondary" />
          <p className="mt-3 font-display text-2xl tracking-[0.22em]">KARCIN</p>
          <span className="mt-1 text-[8px] uppercase tracking-[0.4em] text-accent">
            Automotive
          </span>
        </div>
        <div className="flex aspect-[7/4] flex-col justify-between rounded-lg border border-neutral-dark/10 bg-highlight p-4">
          <div>
            <p className="font-display text-sm text-neutral-dark">Mike Napurano</p>
            <p className="text-[9px] uppercase tracking-widest text-neutral-dark/60">
              Founder &middot; Automotive Concierge
            </p>
          </div>
          <div className="flex items-end justify-between">
            <div className="space-y-0.5 text-[9px] text-neutral-dark/70">
              <p>karcinauto.com</p>
              <p>hello@karcinauto.com</p>
            </div>
            <ApexMark className="h-4 w-auto text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SignaturePreview() {
  return (
    <div className="rounded-xl2 border border-neutral-dark/10 bg-highlight p-6 shadow-soft">
      <p className="eyebrow">Email signature</p>
      <div className="mt-6 rounded-lg border border-neutral-dark/10 bg-secondary/60 p-5">
        <div className="flex items-center gap-3">
          <ApexMark className="h-6 w-auto text-primary" />
          <div>
            <p className="font-display text-base text-neutral-dark">Mike Napurano</p>
            <p className="text-[10px] uppercase tracking-widest text-neutral-dark/60">
              Founder &middot; Karcin Automotive
            </p>
          </div>
        </div>
        <div className="mt-3 h-px bg-accent" />
        <p className="mt-3 text-[11px] text-neutral-dark/70">
          karcinauto.com &middot; (000) 000-0000
        </p>
        <p className="mt-2 text-[10px] leading-snug text-neutral-dark/55">
          Karcin Automotive is an independent brokerage. Vehicle transactions
          occur through licensed dealership and lender partners.
        </p>
      </div>
    </div>
  );
}

function Download({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      download
      className="flex items-center justify-between rounded-xl border border-secondary/20 bg-secondary/5 px-5 py-4 text-sm text-secondary transition hover:border-accent hover:text-accent"
    >
      <span>{children}</span>
      <span className="font-mono text-[10px] uppercase tracking-widest text-secondary/60">
        SVG
      </span>
    </a>
  );
}
