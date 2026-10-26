import type { Metadata } from "next";
import Link from "next/link";
import { POST_EVENT } from "@/data/postEvent";

export const metadata: Metadata = {
  title: "Resources | Odyssey 2026",
  description: "Executive resources and published takeaways from Odyssey, Partner Summit '26.",
};

export default function ResourcesPage() {
  return (
    <>
      <header className="bg-teal-dark text-cream"><div className="mx-auto max-w-[80rem] px-6 pt-40 pb-20 lg:pt-48 lg:pb-28"><p className="flex items-center gap-4 text-micro font-semibold uppercase text-cyan-soft"><span className="h-px w-8 bg-cyan-soft/40" /> Resources</p><h1 className="mt-6 max-w-[15ch] font-display text-h1">The executive record of Odyssey.</h1><p className="mt-7 max-w-[55ch] text-lead text-cream/75">A focused set of post-event resources built from the ideas, stories and people behind {POST_EVENT.shortName}.</p></div></header>
      <main className="mx-auto max-w-[80rem] px-6 py-16 lg:py-24"><section className="grid overflow-hidden border border-rule bg-cream lg:grid-cols-[.9fr_1.1fr]"><div className="flex min-h-[28rem] flex-col justify-between bg-teal-base p-8 text-white lg:p-12"><div><p className="text-micro font-semibold uppercase text-cyan-soft">Now available</p><h2 className="mt-4 max-w-[12ch] font-display text-h1">Odyssey 2026 Summit Report</h2></div><p className="max-w-[35ch] text-small text-cream/80">An eight-page executive record of the ideas, people and moments that shaped Odyssey, Partner Summit &apos;26.</p></div><div className="p-8 lg:p-12"><p className="text-micro font-semibold uppercase text-orange-deep">Inside the report</p><ul className="mt-7 space-y-5 text-body text-ink"><li>Executive summary and verified summit metrics</li><li>The ideas shaping AI, GCCs and leadership</li><li>Selected session takeaways and partner perspectives</li><li>A curated photographic record of Odyssey ’26</li></ul><p className="mt-10 border-l-2 border-orange-bright pl-4 text-small text-muted">The session-detail pages also include the complete original two-page summary for every individual conversation.</p><div className="mt-8 flex flex-wrap gap-3"><a href="/resources/odyssey-2026-summit-report.pdf" download className="rounded-full bg-orange-bright px-5 py-3 text-micro font-semibold uppercase text-white transition hover:bg-orange-deep">Download report PDF →</a><Link href="/insights" className="rounded-full border border-teal-dark px-5 py-3 text-micro font-semibold uppercase text-teal-dark">Explore insights</Link><Link href="/gallery" className="rounded-full border border-teal-dark px-5 py-3 text-micro font-semibold uppercase text-teal-dark">View gallery</Link></div></div></section></main>
    </>
  );
}
