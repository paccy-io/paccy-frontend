import type { Config } from "tailwindcss";

export default {
  content: ["./**/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        "climate-crisis": ["var(--font-climate-crisis)", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
