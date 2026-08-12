import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Poppins } from "next/font/google";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageScripts from "@/components/PageScripts";
import "@/app/globals.css";

/**
 * Display face. `weight` is deliberately omitted so next/font ships the variable file
 * (two files, ~60KB) instead of one static instance per weight — which also means the
 * display weight is retunable in CSS rather than here. Do not add `axes`: Jakarta's only
 * axis is `wght`, and next/font throws for that.
 *
 * `style` must include italic — six headings are italic, and without it the browser
 * synthesises the slant.
 *
 * Standing in for Nasalization, which is licensed and not on Google Fonts. When those
 * files land, they go in front of this in `--font-display` (globals.css).
 */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-jakarta",
});

/**
 * Body and UI. Trimmed to the three weights the design actually uses. Poppins is not a
 * variable font, so `weight` is mandatory. Standing in for PP Mori (also licensed).
 */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-poppins",
});

const description =
  "Odyssey 2026: BOT Consulting's Annual Partner Summit. October 23–25, 2026 at Ananta Resort & Spa, Jaipur, India. A private gathering by invitation.";

// The favicon is now src/app/icon.png (was hotlinked from a Webflow CDN on another site).
export const metadata: Metadata = {
  title: "Odyssey 2026 | BOT Consulting's Annual Partner Summit — Jaipur",
  description,
  openGraph: {
    title: "Odyssey 2026 — BOT Consulting's Annual Partner Summit",
    description,
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${poppins.variable} scroll-smooth overflow-x-hidden`}
    >
      <body className="overflow-x-hidden bg-surface font-sans text-ink antialiased">
        <Navbar />
        {children}
        <Footer />
        <span className="grain" aria-hidden="true" />
        <PageScripts />
      </body>
    </html>
  );
}
