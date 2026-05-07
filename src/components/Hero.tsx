import Image from "next/image";
import { useEffect, useRef } from "react";

export function Hero() {
  const carRef    = useRef<HTMLDivElement>(null);
  const karcinRef = useRef<HTMLDivElement>(null);
  const entryDone = useRef(false);

  useEffect(() => {
    // KARCIN settles at ~1.3s, car settles at ~2.4s — allow 3.5s before scroll reacts
    const timer = setTimeout(() => { entryDone.current = true; }, 3500);

    let rafId: number | null = null;

    const handleScroll = () => {
      if (!entryDone.current) return;
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (!carRef.current || !karcinRef.current) return;
        const sy = window.scrollY;
        const progress = Math.min(sy / (window.innerHeight * 0.35), 1);
        const offset = progress * (window.innerWidth + 900);
        // translateY(sy) cancels the section scrolling up so elements stay vertically locked
        carRef.current.style.transform    = `translateX(calc(-50% + ${offset}px)) translateY(${sy}px)`;
        karcinRef.current.style.transform = `translate(calc(-50% - ${offset}px), calc(-50% + ${sy}px))`;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section
      className="relative overflow-hidden hero-section"
      style={{ background: "#EDE0C7" }}
    >
      <style>{`
        /* KARCIN sweeps in from the right — centering handled by outer div */
        @keyframes karcinFromRight {
          from { opacity: 0; transform: translateX(110vw); }
          to   { opacity: 1; transform: translateX(0); }
        }

        /* Car sweeps in from the left, 1 s after KARCIN starts */
        @keyframes carFromRight {
          from { transform: translateX(-110vw); }
          to   { transform: translateX(0); }
        }

        /* Title dissolves in once both elements are settled */
        @keyframes heroTitleDissolve {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(7px); }
        }

        /* Outer: positioning + centering only — no animation so JS scroll can override */
        .hero-karcin-wrap {
          position: absolute;
          left: 50%;
          top: calc(63% - 175px);
          z-index: 0;
          pointer-events: none;
          user-select: none;
          transform: translate(-50%, -50%);
          will-change: transform;
        }
        /* Inner: owns the entry animation only */
        .hero-karcin-inner {
          animation: karcinFromRight 1.2s cubic-bezier(0.16,1,0.3,1) 0s both;
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
          width: 95vw;
          bottom: 305px;
          z-index: 10;
          transform: translateX(-50%);
          will-change: transform;
        }
        /* Inner div owns the entry animation only */
        .hero-car-inner {
          animation: carFromRight 1.2s cubic-bezier(0.16,1,0.3,1) 1.0s both;
        }

        /* svh = viewport with all browser chrome visible — safest for iOS Safari */
        .hero-section {
          height: 100svh;
          height: 100dvh;
          min-height: 600px;
        }

        /* H1 dissolves after car lands */
        .hero-title {
          position: absolute;
          top: calc(7% - 10px);
          left: 0;
          right: 0;
          text-align: center;
          padding: 0 28px;
          z-index: 20;
          opacity: 0;
          animation: heroTitleDissolve 0.9s ease-out 2.4s forwards;
        }
        .hero-title h1 {
          font-family: var(--font-display);
          font-size: min(2.2rem, 6.2vw);
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: 0.01em;
          color: #00042c;
          margin: 0;
        }

        .hero-tagline {
          position: absolute;
          bottom: 110px;
          left: 0;
          right: 0;
          text-align: center;
          padding: 0 24px;
          z-index: 20;
          opacity: 0;
          animation: heroTitleDissolve 0.9s ease-out 2.8s forwards;
        }

        @media (min-width: 768px) {
          .hero-karcin-wrap { top: calc(50% - 100px); }
          .hero-karcin      { font-size: clamp(8rem, 22vw, 22vw); }
          .hero-car-outer   { width: clamp(600px, 70vw, 70vw); bottom: calc(8% + 100px); }
          .hero-title       { top: 11%; }
          .hero-title h1    { font-size: clamp(1.6rem, 3.2vw, 3.2rem); }
          .hero-tagline     { bottom: 4%; }
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

      {/* KARCIN — enters from right */}
      <div ref={karcinRef} aria-hidden className="hero-karcin-wrap">
        <div className="hero-karcin-inner">
          <span className="hero-karcin">KARCIN</span>
        </div>
      </div>

      {/* Car — outer div owns scroll position, inner div owns entry animation */}
      <div ref={carRef} className="hero-car-outer">
        <div className="hero-car-inner">
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

      {/* H1 — dissolves in after both elements settle */}
      <div className="hero-title">
        <h1>YOUR NEXT<br />VEHICLE PURCHASE,<br />NEGOTIATED FOR YOU.</h1>
      </div>

      {/* Bottom tagline */}
      <div className="hero-tagline">
        <div className="mx-auto mb-3 h-px w-12" style={{ background: "#d3c36a" }} />
        <p
          className="text-[10px] font-medium uppercase leading-[2.1] tracking-[0.28em] md:text-[11px]"
          style={{ color: "#8E6E2E" }}
        >
          Luxury auto brokerage, personal guidance,
          <br className="hidden md:block" />
          and dealer-backed opportunities — negotiated for you.
        </p>
      </div>

      {/* Scroll cue */}
      <div
        aria-hidden
        className="absolute hidden md:block"
        style={{
          bottom: "4.5%",
          right: "2.5rem",
          zIndex: 20,
          color: "#d3c36a",
          fontSize: "1.2rem",
          animation: "scrollBounce 1.8s ease-in-out 3.2s infinite",
        }}
      >
        ↓
      </div>
    </section>
  );
}
