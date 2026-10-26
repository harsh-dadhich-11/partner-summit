import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resources & Insights | Odyssey 2026",
  description: "The executive record of Odyssey '26: session takeaways, frameworks and the summit report.",
};

export default function ResourcesPage() {
  return (
    <>
      <header className="bg-teal-dark text-cream">
        <div className="mx-auto max-w-[80rem] px-6 pt-40 pb-20 lg:pt-48 lg:pb-28">
          <p className="flex items-center gap-4 text-micro font-semibold uppercase text-cyan-soft">
            <span className="h-px w-8 bg-cyan-soft/40" /> RESOURCES &amp; INSIGHTS
          </p>
          <h1 className="mt-6 max-w-[18ch] font-display text-h1">The Executive Record of Odyssey &apos;26</h1>
          <p className="mt-7 max-w-[55ch] text-lead text-cream/75">
            A curated collection of keynotes, session takeaways, frameworks, and high-stakes conversations from Annual Partner Summit Odyssey&apos;26.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-[80rem] px-6 py-16 lg:py-24">
        <section className="grid overflow-hidden border border-rule bg-cream lg:grid-cols-[1.1fr_.9fr]">
          {/* Left Dark Teal Card (Cover Preview) */}
          <div className="relative flex flex-col justify-between overflow-hidden bg-teal-dark p-8 text-white lg:p-12">
            <div>
              <p className="text-micro font-semibold uppercase text-cyan-soft">NOW AVAILABLE</p>
              <h2 className="mt-3 font-display text-h2 text-white">Odyssey 2026 Executive Summit Report</h2>
              <p className="mt-5 text-small leading-relaxed text-cream/80">
                The story, strategy, and systems behind Odyssey &apos;26. Access the complete record of keynotes, breakout takeaways, and the framework for Agentic AI, GCC scaling, operational resilience, and the Odyssey platform architecture.
              </p>
            </div>

            <div className="mt-8 flex items-center justify-center sm:justify-start">
              <a
                href="/resources/odyssey-2026-summit-report.pdf"
                target="_blank"
                rel="noreferrer"
                className="group relative block w-48 sm:w-56 overflow-hidden shadow-2xl transition duration-500 hover:scale-[1.03]"
                aria-label="View Odyssey 2026 Executive Summit Report"
              >
                <Image
                  src="/resources/odyssey-2026-summit-report-cover.jpg"
                  alt="Odyssey 2026 Executive Summit Report cover"
                  width={600}
                  height={849}
                  className="h-auto w-full object-cover"
                  priority
                />
                <span className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
              </a>
            </div>
          </div>

          {/* Right Section (Inside the Report) */}
          <div className="flex flex-col justify-between p-8 lg:p-12">
            <div>
              <p className="text-micro font-semibold uppercase text-orange-deep">INSIDE THE REPORT</p>
              <ul className="mt-7 space-y-4 text-body text-ink">
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-orange-bright">✦</span>
                  <span>Executive summary and verified summit metrics</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-orange-bright">✦</span>
                  <span>The ideas shaping AI, GCCs and leadership</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-orange-bright">✦</span>
                  <span>Selected session takeaways and partner perspectives</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-orange-bright">✦</span>
                  <span>A curated photographic record of Odyssey &apos;26</span>
                </li>
              </ul>

              <div className="mt-10 border-l-2 border-orange-bright bg-panel-orange p-4 text-small text-muted">
                The session-detail pages also include the complete original two-page summary for every individual conversation.
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="/resources/odyssey-2026-summit-report.pdf"
                download
                className="rounded-full bg-orange-bright px-6 py-3 text-micro font-semibold uppercase text-white transition hover:bg-orange-deep shadow-sm"
              >
                Download report PDF →
              </a>
              <Link
                href="/insights"
                className="rounded-full border border-teal-dark px-5 py-3 text-micro font-semibold uppercase text-teal-dark transition hover:bg-teal-dark hover:text-white"
              >
                Explore insights
              </Link>
              <Link
                href="/gallery"
                className="rounded-full border border-teal-dark px-5 py-3 text-micro font-semibold uppercase text-teal-dark transition hover:bg-teal-dark hover:text-white"
              >
                View gallery
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
