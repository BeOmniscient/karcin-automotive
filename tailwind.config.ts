import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/pages/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        "neutral-dark": "rgb(var(--color-neutral-dark) / <alpha-value>)",
        "neutral-light": "rgb(var(--color-neutral-light) / <alpha-value>)",
        highlight: "rgb(var(--color-highlight) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Playfair Display", "Baskerville", "serif"],
        sans: ["var(--font-body)", "Inter", "Montserrat", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        wider: "0.08em",
        widest: "0.18em",
      },
      boxShadow: {
        soft: "0 8px 24px -12px rgba(26, 26, 26, 0.18)",
        card: "0 12px 32px -16px rgba(26, 26, 26, 0.22)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
