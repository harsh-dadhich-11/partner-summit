import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedGalleryPhotos, POST_EVENT, POST_EVENT_STATS } from "@/data/postEvent";

export const metadata: Metadata = {
  title: "Highlights | Odyssey 2026",
  description: "The defining moments from Odyssey, Partner Summit '26 in Jaipur.",
};

const storyMoments = [
  {
    image: "ceremony-opening",
    number: "01",
    title: "A shared opening",
    copy: "Odyssey began together: with ceremony, intent and a clear invitation to build the future of global teams with more imagination.",
  },
  {
    image: "ai-panel",
    number: "02",
    title: "Ideas made practical",
    copy: "From agentic systems to data readiness and GCC operating models, the agenda kept returning to one question: what creates durable value?",
  },
  {
    image: "sri-group",
    number: "03",
    title: "Contribution beyond the room",
    copy: "The Śrī volunteer activity made space for the community to create something meaningful together—90 minutes with a tangible shared purpose.",
  },
  {
    image: "evening-portrait",
    number: "04",
    title: "A community in full colour",
    copy: "The summit’s strongest moments were often between sessions: new relationships, familiar faces and the energy of a community together in Jaipur.",
  },
];

export default function HighlightsPage() {
  const photos = getPublishedGalleryPhotos();
  return (
    <>
      <header className="bg-teal-dark text-cream">
        <div className="mx-auto max-w-[80rem] px-6 pt-40 pb-20 lg:pt-48 lg:pb-28">
          <p className="flex items-center gap-4 text-micro font-semibold uppercase text-cyan-soft"><span className="h-px w-8 bg-cyan-soft/40" /> The highlights</p>
          <h1 className="mt-6 max-w-[15ch] font-display text-h1">Where bold ideas became shared momentum.</h1>
          <p className="mt-7 max-w-[55ch] text-lead text-cream/75">{POST_EVENT.name} brought people together in Jaipur to exchange ideas, recognise progress and invest in the relationships behind every high-performing GCC.</p>
        </div>
      </header>

      <section className="bg-cream py-12 lg:py-16">
        <dl className="mx-auto grid max-w-[80rem] px-6 sm:grid-cols-3 lg:grid-cols-6">
          {POST_EVENT_STATS.map((stat) => <div key={stat.label} className="border-b border-rule py-6 sm:px-4 lg:border-r lg:last:border-r-0"><dt className="text-micro font-semibold uppercase text-muted">{stat.label}</dt><dd className="mt-2 font-display text-h2 text-teal-dark">{stat.value}</dd></div>)}
        </dl>
      </section>

      <section className="mx-auto max-w-[80rem] px-6 py-16 lg:py-24" aria-label="Highlights story">
        <div className="space-y-16 lg:space-y-24">
          {storyMoments.map((moment, index) => {
            const photo = photos.find((item) => item.id === moment.image);
            return (
              <article key={moment.number} className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${index % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                <div className="relative aspect-[4/3] overflow-hidden bg-teal-dark">
                  {photo?.largeUrl && <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.largeUrl} alt={photo.alt} className="h-full w-full object-cover" />
                  </>}
                </div>
                <div>
                  <p className="text-micro font-semibold uppercase text-orange-deep">{moment.number}</p>
                  <h2 className="mt-4 font-display text-h2 text-teal-dark">{moment.title}</h2>
                  <p className="mt-5 max-w-[45ch] text-body text-muted">{moment.copy}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-teal-dark py-16 text-cream lg:py-20">
        <div className="mx-auto flex max-w-[80rem] flex-col gap-7 px-6 md:flex-row md:items-end md:justify-between">
          <div><p className="text-micro font-semibold uppercase text-cyan-soft">Keep exploring</p><h2 className="mt-3 font-display text-h2">Follow the ideas. See every moment.</h2></div>
          <div className="flex flex-wrap gap-3"><Link href="/insights" className="rounded-full bg-orange-bright px-5 py-3 text-micro font-semibold uppercase text-white">Session insights</Link><Link href="/gallery" className="rounded-full border border-white/45 px-5 py-3 text-micro font-semibold uppercase text-white">Photo gallery</Link></div>
        </div>
      </section>
    </>
  );
}
