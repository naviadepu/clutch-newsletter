import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        clutch: {
          paper: "#F6EFE3",
          paperDeep: "#EFE5D2",
          softpink: "#F4C9D6",
          bubblegum: "#EB6E9E",
          hot: "#D6336C",
          chocolate: "#4A2A1A",
          ink: "#1B1B1B",
          dusty: "#C9D6E2",
        },
      },
      fontFamily: {
        masthead: ["var(--font-unifraktur)", "serif"],
        script: ["var(--font-tangerine)", "cursive"],
        pinyon: ["var(--font-pinyon)", "cursive"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-pt-serif)", "Georgia", "serif"],
        pixel: ["var(--font-vt323)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        paper: "2px 3px 0 rgba(27,27,27,0.08), 0 1px 0 rgba(27,27,27,0.04)",
        tape: "0 1px 2px rgba(27,27,27,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
