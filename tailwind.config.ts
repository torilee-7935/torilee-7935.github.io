// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      /* --- Brand palette --- */
      colors: {
        // Values live in src/index.css as CSS variables, so each one
        // switches automatically between light and dark mode.
        brand: {
          white: "rgb(var(--brand-white) / <alpha-value>)",
          surface: "rgb(var(--brand-surface) / <alpha-value>)",
          sage50: "rgb(var(--brand-sage50) / <alpha-value>)",
          sage100: "rgb(var(--brand-sage100) / <alpha-value>)",
          sage200: "rgb(var(--brand-sage200) / <alpha-value>)",
          sage300: "rgb(var(--brand-sage300) / <alpha-value>)",
          sage400: "rgb(var(--brand-sage400) / <alpha-value>)",
          sage500: "rgb(var(--brand-sage500) / <alpha-value>)",
          sage600: "rgb(var(--brand-sage600) / <alpha-value>)",
          sage700: "rgb(var(--brand-sage700) / <alpha-value>)",
          sky50: "rgb(var(--brand-sky50) / <alpha-value>)",
          sky100: "rgb(var(--brand-sky100) / <alpha-value>)",
          sky200: "rgb(var(--brand-sky200) / <alpha-value>)",
          sky300: "rgb(var(--brand-sky300) / <alpha-value>)",
          sky400: "rgb(var(--brand-sky400) / <alpha-value>)",
          sky500: "rgb(var(--brand-sky500) / <alpha-value>)",
          ink: "rgb(var(--brand-ink) / <alpha-value>)",
          slate: "rgb(var(--brand-slate) / <alpha-value>)",
          line: "rgb(var(--brand-line) / <alpha-value>)",
          accent: "rgb(var(--brand-accent) / <alpha-value>)",
          accentHover: "rgb(var(--brand-accentHover) / <alpha-value>)",
        },

        /* --- Remap low-contrast slates to light-theme safe values --- */
        slate: {
          50:  "#F8FAFC",
          100: "#F1F5F9",
          200: "#475569", // darker text (used to be too light)
          300: "#334155", // brand.slate
          400: "#334155",
          500: "#334155",
          600: "#334155",
          700: "#E2E8F0", // light border source (works with /60 alpha)
          800: "#E2E8F0", // light border source (works with /60 alpha)
          900: "#0F172A", // true dark when needed
          950: "#020617",
        },
      },

      /* --- Radius / Shadows --- */
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(15, 23, 42, 0.10)",
      },

      /* --- Typography --- */
      fontFamily: {
        // Body / UI
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "Apple Color Emoji",
          "Segoe UI Emoji",
        ],
        // Headings / monogram
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
