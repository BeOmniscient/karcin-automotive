import Image from "next/image";
import { useEffect, useRef } from "react";

export function Hero() {
  const carRef = useRef<HTMLDivElement>(null);
  const entryDone = useRef(false);

  useEffect(() => {
    // 3s animation + 0.5s delay — don't respond to scroll until the car is parked
    const timer = setTimeout(() => { entryDone.current = true; }, 7500);

    const handleScroll = () => {
      if (!carRef.current || !entryDone.current) return;
      const progress = Math.min(window.scrollY / window.innerHeight, 1);
      const offset = progress * (window.innerWidth + 900);
      carRef.current.style.transform = `translateX(calc(-50% + ${offset}px))`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section
      className="relative overflow-hidden"
      style={{ height: "100vh", minHeight: "560px", background: "#EDE0C7" }}
    >
      <style>{`
        @keyframes karcinReveal {
          from { opacity: 0; transform: translate(-50%, -50%) scale(1.04); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes carEntry {
          from { opacity: 1; transform: translateX(-150vw); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeUpCenter {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(7px); }
        }

        .hero-karcin-wrap {
          position: absolute;
          left: 50%;
          top: calc(50% - 60px);
          z-index: 0;
          pointer-events: none;
          user-select: none;
          animation: karcinReveal 1.3s cubic-bezier(0.16,1,0.3,1) 0.15s both;
        }
        .hero-karcin {
          font-family: var(--font-display);
          font-size: clamp(3rem, 22vw, 22vw);
          font-weight: 700;
          line-height: 1;
          letter-spacing: 0.02em;
          color: #d3c36a;
          white-space: nowrap;
          display: block;
          filter: url(#karcin-stone);
        }
        .hero-car-outer {
          position: absolute;
          left: 50%;
          width: 90vw;
          bottom: calc(3% + 50px);
          z-index: 10;
          transform: translateX(-50%);
          will-change: transform;
        }
        .hero-title {
          position: absolute;
          top: 9%;
          left: 0;
          right: 0;
          text-align: center;
          padding: 0 24px;
          z-index: 20;
          animation: fadeUpCenter 0.9s ease-out 0.2s both;
        }
        .hero-title h1 {
          font-family: var(--font-display);
          font-size: clamp(1.35rem, 4vw, 3.2rem);
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: 0.01em;
          color: #00042c;
          margin: 0;
        }
        .hero-tagline {
          position: absolute;
          bottom: 4%;
          left: 0;
          right: 0;
          text-align: center;
          padding: 0 24px;
          z-index: 20;
          animation: fadeUpCenter 0.85s ease-out 0.95s both;
        }

        @media (min-width: 768px) {
          .hero-karcin-wrap { top: calc(50% - 100px); }
          .hero-karcin      { font-size: clamp(8rem, 22vw, 22vw); }
          .hero-car-outer   { width: clamp(600px, 70vw, 70vw); bottom: calc(8% + 100px); }
          .hero-title       { top: 11%; }
          .hero-title h1    { font-size: clamp(1.6rem, 3.2vw, 3.2rem); }
        }
      `}</style>

      {/* Stone texture filter */}
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
      <div aria-hidden className="hero-karcin-wrap">
        <span className="hero-karcin">KARCIN</span>
      </div>

      {/* Hero car — outer div owns scroll position, inner div owns entry animation */}
      <div ref={carRef} className="hero-car-outer">
        <div style={{ animation: "carEntry 5s cubic-bezier(0.25,0.1,0.25,1) 2s both" }}>
          <Image
            src="/images/hero-car.png"
            alt="Dark blue luxury sedan, side profile"
            width={1800}
            height={750}
            priority
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>
      </div>

      {/* Hero title */}
      <div className="hero-title">
        <h1>Your Next Vehicle, Handled Personally.</h1>
      </div>

      {/* Bottom tagline */}
      <div className="hero-tagline">
        <div className="mx-auto mb-3 h-px w-12" style={{ background: "#d3c36a" }} />
        <p
          className="text-[10px] font-medium uppercase leading-[2.1] tracking-[0.28em] md:text-[11px]"
          style={{ color: "#EDE0C7" }}
        >
          Luxury auto brokerage, personal guidance,
          <br className="hidden md:block" />
          and dealer-backed opportunities — handled personally.
        </p>
      </div>

      {/* Scroll cue — desktop only */}
      <div
        aria-hidden
        className="absolute hidden md:block"
        style={{
          bottom: "4.5%",
          right: "2.5rem",
          zIndex: 20,
          color: "#d3c36a",
          fontSize: "1.2rem",
          animation: "scrollBounce 1.8s ease-in-out 1.5s infinite",
        }}
      >
        ↓
      </div>
    </section>
  );
}
