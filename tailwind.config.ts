import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "cima-bg": "#090A0D",
        "cima-card": "#0F1116",
        "cima-surface": "#161820",
        "cima-border": "#23252F",
        "cima-gold": "#C8A96E",
        "cima-gold-light": "#E2C99A",
        "cima-gold-dim": "#7A6240",
        "cima-text": "#F0EDE8",
        "cima-text-muted": "#9A9490",
        "cima-text-dim": "#56524E",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Syne", "sans-serif"],
        sans: ["var(--font-sans)", "DM Sans", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease both",
        "fade-in": "fadeIn 0.4s ease both",
        "marquee": "marquee 32s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [animate],
};
export default config;
