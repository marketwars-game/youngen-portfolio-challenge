// FILE: tailwind.config.ts — Tailwind theme (brand tokens point to CSS vars)
// VERSION: YG-V1 — NextGen Royal: named tokens now resolve to --mw-* (defined in app/globals.css)
// LAST MODIFIED: 02 Jul 2026
// HISTORY: market-wars B1..B20 (kids-camp lineage) | YG-V0 fork | YG-V1 tokens → var(--mw-*)
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // === Brand surfaces — single source of truth in app/globals.css (:root) ===
        base: "var(--mw-base)",
        surface: "var(--mw-surface)",
        border: "var(--mw-border)",
        // === Brand identity ===
        // NOTE: token names kept as `neon.green` / `neon.cyan` from the kids-camp
        // fork to avoid churning class names across ~30 files. Their VALUES are now
        // the NextGen Royal violet / rose. (Class names are never user-visible.)
        neon: {
          green: "var(--mw-violet)", // primary  (MARKET)
          cyan: "var(--mw-rose)",    // secondary (WARS)
        },
        violet: {
          DEFAULT: "var(--mw-violet)",
          deep: "var(--mw-violet-deep)",
        },
        rose: {
          DEFAULT: "var(--mw-rose)",
        },
        accent: {
          red: "#FF6B6B",
          purple: "#A855F7",
          yellow: "#F59E0B",
          pink: "#EC4899",
        },
        // Legacy company colors (kids-camp sectors) — unused by YoungGen assets,
        // kept so any stray reference still compiles. Safe to remove at V1 cleanup.
        company: {
          robosnack: "#FF6B6B",
          zoomzoom: "#00D4FF",
          megafun: "#A855F7",
          greenpower: "#22C55E",
          piggybank: "#F59E0B",
          safegold: "#EC4899",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
        sans: ["Inter", "Noto Sans Thai", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
