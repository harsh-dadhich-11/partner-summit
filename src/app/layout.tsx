import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Poppins } from "next/font/google";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageScripts from "@/components/PageScripts";
import { SITE_DESCRIPTION } from "@/data/site";
import "@/app/globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-jakarta",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Odyssey 2026 | BOT Consulting's Annual Partner Summit — Jaipur",
  description: SITE_DESCRIPTION,
  openGraph: {
    title: "Odyssey 2026 — BOT Consulting's Annual Partner Summit",
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Odyssey 2026 — BOT Consulting's Annual Partner Summit",
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  /* Horizontal overflow is contained in globals.css rather than by a utility here:
     `overflow-x: hidden` on <body> makes it a scroll container, which silently disables
     `position: sticky` for everything inside it. See the note on the rule. */
  return (
    <html lang="en" className={`${jakarta.variable} ${poppins.variable} scroll-smooth`}>
      <body className="bg-surface font-sans text-ink antialiased">
        <Navbar />
        {children}
        <Footer />
        <span className="grain" aria-hidden="true" />
        <PageScripts />
      </body>
    </html>
  );
}
