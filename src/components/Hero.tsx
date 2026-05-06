import Image from "next/image";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ height: "100vh", minHeight: "680px", background: "#EDE0C7" }}
    >
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="karcin-stone" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.55 0.65" numOctaves="5" seed="8" stitchTiles="stitch" result="noise" />
            <feColorMatrix
              type="matrix"
              values="0.85 0.1 0.05 0 0.08
                      0.60 0.2 0.10 0 0.04
                      0.30 0.1 0.05 0 0.00
                      0    0   0   1 0"
              in="noise"
              result="warmNoise"
            />
            <feComponentTransfer in="warmNoise" result="contrastNoise">
              <feFuncR type="gamma" amplitude="1.4" exponent="0.65" offset="-0.05" />
              <feFuncG type="gamma" amplitude="1.2" exponent="0.65" offset="-0.04" />
              <feFuncB type="gamma" amplitude="0.9" exponent="0.65" offset="-0.02" />
            </feComponentTransfer>
            <feBlend in="SourceGraphic" in2="contrastNoise" mode="multiply" result="textured" />
            <feComposite in="textured" in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      {/* Giant KARCIN typographic backdrop */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none select-none absolute inset-0 flex items-center justify-center"
        style={{ zIndex: 0 }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(10rem, 34.5vw, 34.5vw)",
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "0.02em",
            color: "#C4A050",
            whiteSpace: "nowrap",
            filter: "url(#karcin-stone)",
          }}
        >
          KARCIN
        </span>
      </motion.div>

      {/* Hero car */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.35, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-1/2 -translate-x-1/2"
        style={{ bottom: "10%", width: "clamp(720px, 84vw, 84vw)", zIndex: 10, mixBlendMode: "multiply" }}
      >
        <Image
          src="/images/hero-car.png"
          alt="Dark blue luxury sedan, side profile"
          width={1800}
          height={750}
          priority
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </motion.div>

      {/* Bottom tagline */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, delay: 0.95 }}
        className="absolute left-1/2 -translate-x-1/2 w-full text-center px-6"
        style={{ bottom: "4%", zIndex: 20 }}
      >
        <div className="mx-auto mb-3 h-px w-12" style={{ background: "#B99248" }} />
        <p
          className="text-[10px] font-medium uppercase leading-[2.1] tracking-[0.28em] md:text-[11px]"
          style={{ color: "#8E6E2E" }}
        >
          Luxury auto brokerage, personal guidance,
          <br className="hidden md:block" />
          and dealer-backed opportunities — handled personally.
        </p>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
        className="absolute hidden md:block"
        style={{ bottom: "4.5%", right: "2.5rem", zIndex: 20, color: "#B99248", fontSize: "1.2rem" }}
      >
        ↓
      </motion.div>
    </section>
  );
}
