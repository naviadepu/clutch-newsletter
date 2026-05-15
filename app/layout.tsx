import type { Metadata } from "next";
import {
  UnifrakturMaguntia,
  Tangerine,
  Pinyon_Script,
  Playfair_Display,
  PT_Serif,
  VT323,
} from "next/font/google";
import "./globals.css";

const unifraktur = UnifrakturMaguntia({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-unifraktur",
  display: "swap",
});

const tangerine = Tangerine({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-tangerine",
  display: "swap",
});

const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pinyon",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const ptSerif = PT_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-pt-serif",
  display: "swap",
});

const vt323 = VT323({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-vt323",
  display: "swap",
});


export const metadata: Metadata = {
  title: "The Clutch Update · May 2026",
  description:
    "A quick look at where Clutch is heading next, plus a short reader feedback poll.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${unifraktur.variable} ${tangerine.variable} ${pinyon.variable} ${playfair.variable} ${ptSerif.variable} ${vt323.variable}`}
    >
      <body className="paper-bg min-h-screen text-clutch-ink font-body">
        {children}
      </body>
    </html>
  );
}
