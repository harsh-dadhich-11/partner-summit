import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getInsightBySlug, INSIGHTS } from "@/data/insights";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return INSIGHTS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const insight = getInsightBySlug((await params).slug);
  if (!insight) return {};
  return { title: `${insight.title} | Odyssey 2026`, description: insight.summary };
}

export default async function InsightDetailPage({ params }: Props) {
  const insight = getInsightBySlug((await params).slug);
  if (!insight) notFound();
  const related = insight.relatedSlugs.map(getInsightBySlug).filter((item): item is NonNullable<typeof item> => Boolean(item));
  const sessionSummaryHref = `/resources/session-summaries/odyssey-2026-session-summary-${insight.slug}.pdf`;

  return (
    <>
      <header className="bg-teal-dark text-cream"><div className="mx-auto max-w-[80rem] px-6 pt-40 pb-20 lg:pt-48 lg:pb-28"><Link href="/insights" className="text-micro font-semibold uppercase text-cyan-soft transition hover:text-white">← All insights</Link><div className="mt-9 flex flex-wrap gap-2 text-micro font-semibold uppercase"><span className="rounded-full border border-cyan-soft/35 px-3 py-1.5 text-cyan-soft">{insight.theme}</span><span className="rounded-full border border-white/20 px-3 py-1.5 text-cream/75">{insight.format}</span></div><h1 className="mt-6 max-w-[17ch] font-display text-h1">{insight.title}</h1><p className="mt-7 max-w-[52ch] text-lead text-cream/75">{insight.summary}</p><p className="mt-7 text-small font-medium text-white">{insight.speakers}</p></div></header>
      <main className="mx-auto max-w-[80rem] px-6 py-16 lg:py-24"><div className="grid gap-14 lg:grid-cols-[1.1fr_.9fr] lg:gap-24"><section><p className="text-micro font-semibold uppercase text-orange-deep">Key takeaways</p><ol className="mt-7 divide-y divide-rule border-t border-rule">{insight.takeaways.map((takeaway, index) => <li key={takeaway} className="grid grid-cols-[3rem_1fr] gap-4 py-6"><span className="font-display text-h3 text-cyan-bright">0{index + 1}</span><p className="text-body text-ink">{takeaway}</p></li>)}</ol></section><aside className="border-l-2 border-orange-bright bg-panel-orange p-7 self-start"><p className="text-micro font-semibold uppercase text-orange-deep">Complete session summary</p><p className="mt-4 text-body text-ink">Read the original two-page session notes in your browser, or save a copy for later.</p><div className="mt-7 flex flex-wrap gap-3"><a href={sessionSummaryHref} target="_blank" rel="noreferrer" className="inline-flex rounded-full border border-teal-dark px-5 py-3 text-micro font-semibold uppercase text-teal-dark transition hover:bg-teal-dark hover:text-white">View session summary ↗</a><a href={sessionSummaryHref} download className="inline-flex rounded-full bg-orange-bright px-5 py-3 text-micro font-semibold uppercase text-white transition hover:bg-orange-deep">Download PDF →</a></div><div className="mt-8 border-t border-orange-deep/20 pt-7"><p className="text-micro font-semibold uppercase text-orange-deep">Odyssey point of view</p><p className="mt-4 text-body text-ink">The value is not only in the technology or the operating model. It is in the choices people make when those systems meet real work.</p></div></aside></div>{related.length > 0 && <section className="mt-20 border-t border-rule pt-10"><p className="text-micro font-semibold uppercase text-orange-deep">Continue reading</p><div className="mt-6 grid gap-px bg-rule md:grid-cols-2">{related.map((item) => <Link key={item.slug} href={`/insights/${item.slug}`} className="bg-cream p-7 transition hover:bg-panel-cyan"><p className="text-micro font-semibold uppercase text-muted">{item.theme}</p><h2 className="mt-3 font-display text-h3 text-teal-dark">{item.title}</h2><span className="mt-5 inline-block text-micro font-semibold uppercase text-teal-dark">Read insight →</span></Link>)}</div></section>}</main>
    </>
  );
}
