import Image from "next/image";
import { useEffect, useRef } from "react";

export function Hero() {
  const carRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!carRef.current) return;
      const progress = Math.min(window.scrollY / window.innerHeight, 1);
      const offset = progress * (window.innerWidth + 900);
      carRef.current.style.transform = `translateX(calc(-50% + ${offset}px))`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      className="relative overflow-hidden"
      style={{ height: "100vh", minHeight: "680px", background: "#EDE0C7" }}
    >
      <style>{`
        @keyframes karcinReveal {
          from { opacity: 0; transform: translate(-50%, -50%) scale(1.04); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes carEntry {
          from { opacity: 0; transform: translateX(-50px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateX(-50%) translateY(16px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes fadeUpCenter {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(7px); }
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
      <div
        aria-hidden
        className="pointer-events-none select-none absolute"
        style={{
          top: "calc(50% - 100px)",
          left: "50%",
          zIndex: 0,
          animation: "karcinReveal 1.3s cubic-bezier(0.16,1,0.3,1) 0.15s both",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(8rem, 22vw, 22vw)",
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "0.02em",
            color: "#d3c36a",
            whiteSpace: "nowrap",
            display: "block",
            filter: "url(#karcin-stone)",
          }}
        >
          KARCIN
        </span>
      </div>

      {/* Hero car — outer div owns scroll-driven position, inner div owns entry animation */}
      <div
        ref={carRef}
        style={{
          position: "absolute",
          bottom: "calc(8% + 100px)",
          left: "50%",
          width: "clamp(600px, 70vw, 70vw)",
          zIndex: 10,
          transform: "translateX(-50%)",
          willChange: "transform",
        }}
      >
        <div style={{ animation: "carEntry 1.35s cubic-bezier(0.16,1,0.3,1) 0.3s both" }}>
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
      <div
        style={{
          position: "absolute",
          top: "11%",
          left: 0,
          right: 0,
          textAlign: "center",
          padding: "0 24px",
          zIndex: 20,
          animation: "fadeUpCenter 0.9s ease-out 0.2s both",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.6rem, 3.2vw, 3.2rem)",
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: "0.01em",
            color: "#00042c",
            margin: 0,
          }}
        >
          Your Next Vehicle, Handled Personally.
        </h1>
      </div>

      {/* Bottom tagline */}
      <div
        style={{
          position: "absolute",
          bottom: "4%",
          left: "50%",
          width: "100%",
          textAlign: "center",
          padding: "0 24px",
          zIndex: 20,
          animation: "fadeUp 0.85s ease-out 0.95s both",
        }}
      >
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
          animation: "scrollBounce 1.8s ease-in-out 1.5s infinite",
        }}
      >
        ↓
      </div>
    </section>
  );
}
