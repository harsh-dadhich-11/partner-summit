import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageScripts from "@/components/PageScripts";
import "@/app/globals.css";

/** Body and UI. Trimmed to the three weights the design actually uses. */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-jakarta",
});

/**
 * Display face. Variable, so `opsz` redraws the letterforms for headline sizes
 * and `SOFT`/`WONK` give the hero real character rather than a generic serif.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-fraunces",
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
      className={`${jakarta.variable} ${fraunces.variable} scroll-smooth overflow-x-hidden`}
    >
      <body className="overflow-x-hidden bg-surface font-sans text-ink antialiased">
        {/*
          The cusped arch, defined once and referenced by every `.arch` element.

          Seven foils per opening, placed along a pointed arch and joined by arcs of a
          single radius: because each arc belongs to its own circle the tangent breaks at
          every junction, which is what produces the cusps. Radius is deliberately larger
          than each chord — tighter radii turn the foils into a crown rather than a scallop.
        */}
        <svg aria-hidden="true" focusable="false" className="absolute h-0 w-0 overflow-hidden">
          <defs>
            <clipPath id="jharokha-arch" clipPathUnits="objectBoundingBox">
              <path
                d="M0,1 L0,0.58
                   A0.16,0.16 0 0 1 0.1113,0.4445
                   A0.16,0.16 0 0 1 0.2169,0.3568
                   A0.16,0.16 0 0 1 0.3117,0.2812
                   A0.16,0.16 0 0 1 0.3909,0.2124
                   A0.16,0.16 0 0 1 0.4505,0.1483
                   A0.16,0.16 0 0 1 0.4875,0.0878
                   A0.16,0.16 0 0 1 0.5,0.03
                   A0.16,0.16 0 0 1 0.5125,0.0878
                   A0.16,0.16 0 0 1 0.5495,0.1483
                   A0.16,0.16 0 0 1 0.6091,0.2124
                   A0.16,0.16 0 0 1 0.6883,0.2812
                   A0.16,0.16 0 0 1 0.7831,0.3568
                   A0.16,0.16 0 0 1 0.8887,0.4445
                   A0.16,0.16 0 0 1 1,0.58
                   L1,1 Z"
              />
            </clipPath>
          </defs>
        </svg>

        <Navbar />
        {children}
        <Footer />
        <span className="grain" aria-hidden="true" />
        <PageScripts />
      </body>
    </html>
  );
}
