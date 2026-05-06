import type { CSSProperties, ReactNode } from "react";

type BaseProps = {
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
};

/**
 * Karcin Apex Mark — a refined chevron.
 * Reads as: forward motion, the apex of a turn, an automotive grille hint,
 * and a horizon to drive toward. Single brand symbol; works at every size.
 * Uses currentColor so the parent controls tint via Tailwind text-* classes.
 */
export function ApexMark({
  className,
  style,
  ariaLabel = "Karcin",
}: BaseProps) {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ariaLabel}
      className={className}
      style={style}
    >
      <path
        d="M14 64 L60 18 L106 64"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/**
 * Karcin Monogram — geometric K with a hairline horizon line passing through
 * the apex point. Stroke-based geometry (font-independent) keeps the SVG
 * portable for download as a brand asset.
 */
export function Monogram({
  className,
  style,
  ariaLabel = "Karcin K monogram",
  withHorizon = true,
}: BaseProps & { withHorizon?: boolean }) {
  return (
    <svg
      viewBox="0 0 160 160"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ariaLabel}
      className={className}
      style={style}
    >
      {withHorizon && (
        <line
          x1="14"
          y1="80"
          x2="146"
          y2="80"
          stroke="currentColor"
          strokeOpacity="0.18"
          strokeWidth="1.5"
        />
      )}
      <g stroke="currentColor" strokeWidth="14" strokeLinecap="butt" fill="none">
        <line x1="46" y1="22" x2="46" y2="138" />
        <line x1="53" y1="80" x2="120" y2="22" />
        <line x1="53" y1="80" x2="120" y2="138" />
      </g>
    </svg>
  );
}

type WordmarkProps = BaseProps & {
  tone?: "primary" | "light" | "dark";
  showTagline?: boolean;
};

/**
 * Editorial wordmark. KARCIN in Playfair Display; an Apex notch sits in a
 * thin gold rule above AUTOMOTIVE — the rule reinforces the brand mark
 * across every touchpoint.
 */
export function Wordmark({
  className,
  style,
  ariaLabel = "Karcin Automotive",
  tone = "primary",
  showTagline = true,
}: WordmarkProps) {
  const wordColor =
    tone === "light"
      ? "rgb(248 241 231)"
      : tone === "dark"
      ? "rgb(26 26 26)"
      : "rgb(125 20 36)";
  const accent = "rgb(216 199 167)";

  return (
    <svg
      viewBox="0 0 760 220"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ariaLabel}
      className={className}
      style={style}
    >
      <text
        x="380"
        y="120"
        textAnchor="middle"
        fontFamily="'Playfair Display', 'Baskerville', 'Times New Roman', serif"
        fontWeight="700"
        fontSize="118"
        letterSpacing="14"
        fill={wordColor}
      >
        KARCIN
      </text>
      {showTagline && (
        <>
          <g stroke={accent} strokeWidth="1.5" fill="none">
            <line x1="220" y1="155" x2="358" y2="155" />
            <path
              d="M368 155 L380 142 L392 155"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line x1="402" y1="155" x2="540" y2="155" />
          </g>
          <text
            x="380"
            y="195"
            textAnchor="middle"
            fontFamily="Inter, 'Helvetica Neue', Arial, sans-serif"
            fontWeight="500"
            fontSize="18"
            letterSpacing="14"
            fill={accent}
          >
            AUTOMOTIVE
          </text>
        </>
      )}
    </svg>
  );
}

/**
 * Horizontal lockup: ApexMark + KARCIN wordmark side by side.
 * Used in the site Header and Footer. Pure HTML/CSS so the wordmark
 * uses the live web font (perfectly rendered, no layout shift after FOFT).
 */
export function HeaderLockup({
  tone = "dark",
  size = "md",
}: {
  tone?: "dark" | "light";
  size?: "sm" | "md" | "lg";
}) {
  const markColor = tone === "light" ? "text-accent" : "text-primary";
  const wordColor = tone === "light" ? "text-secondary" : "text-neutral-dark";
  const wordSize =
    size === "lg" ? "text-3xl" : size === "sm" ? "text-xl" : "text-2xl";
  const markSize =
    size === "lg" ? "h-8" : size === "sm" ? "h-5" : "h-6";

  return (
    <span className="inline-flex items-center gap-2.5">
      <ApexMark className={`${markSize} w-auto ${markColor}`} />
      <span
        className={`font-display ${wordSize} tracking-[0.22em] ${wordColor}`}
      >
        KARCIN
      </span>
    </span>
  );
}

/**
 * Vertical lockup: ApexMark stacked over KARCIN + AUTOMOTIVE rule.
 * Use for hero areas, business cards, the brand showcase.
 */
export function VerticalLockup({
  tone = "dark",
}: {
  tone?: "dark" | "light";
}) {
  const markColor = tone === "light" ? "text-accent" : "text-primary";
  const wordColor = tone === "light" ? "text-secondary" : "text-neutral-dark";
  const ruleColor = "text-accent";

  return (
    <span className="inline-flex flex-col items-center gap-3">
      <ApexMark className={`h-9 w-auto ${markColor}`} />
      <span
        className={`font-display text-4xl md:text-5xl tracking-[0.18em] ${wordColor}`}
      >
        KARCIN
      </span>
      <span className={`flex items-center gap-3 ${ruleColor}`}>
        <span className="h-px w-10 bg-current" />
        <span className="text-[11px] font-medium uppercase tracking-[0.45em]">
          Automotive
        </span>
        <span className="h-px w-10 bg-current" />
      </span>
    </span>
  );
}

/**
 * A refined badge — thin hairline ring with the mark centered inside.
 * Distinct from ornate dealership crests: maximum negative space.
 */
export function Badge({
  className,
  ariaLabel = "Karcin",
  children,
}: BaseProps & { children?: ReactNode }) {
  return (
    <span
      role="img"
      aria-label={ariaLabel}
      className={`inline-flex aspect-square items-center justify-center rounded-full border border-current ${
        className ?? ""
      }`}
    >
      {children ?? <ApexMark className="h-1/2 w-1/2" />}
    </span>
  );
}
