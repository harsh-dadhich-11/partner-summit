import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import OdysseyIdeas from "@/components/recap/OdysseyIdeas";
import { getPublishedGalleryPhotos, POST_EVENT, POST_EVENT_STATS, RECAP_DESTINATIONS } from "@/data/postEvent";

export const metadata: Metadata = {
  title: "Odyssey 2026 Recap | BOT Consulting",
  description: "Relive Odyssey, Partner Summit '26: the people, ideas and moments from Jaipur.",
};

export default function RecapPage() {
  const photos = getPublishedGalleryPhotos();
  const hero = photos.find((photo) => photo.id === "team-photo");

  return (
    <>
      <header className="relative isolate min-h-[46rem] overflow-hidden bg-teal-dark text-cream">
        {hero?.largeUrl && (
          <div className="absolute inset-0 -z-20">
            {/* Supabase image URL is generated on the server; it does not expose credentials. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={hero.largeUrl} alt="" className="h-full w-full object-cover object-[50%_65%]" />
          </div>
        )}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(24,57,68,1),rgba(24,57,68,.58),rgba(24,57,68,.1))]" />
        <div className="mx-auto flex min-h-[46rem] max-w-[80rem] flex-col justify-end px-6 pt-36 pb-16 lg:pb-24">
          <p className="flex items-center gap-4 text-micro font-semibold uppercase text-cyan-soft">
            <span className="h-px w-8 bg-cyan-soft/60" /> {POST_EVENT.dates} · {POST_EVENT.venue}
          </p>
          <h1 className="mt-7 max-w-[12ch] font-display text-display text-white">
            The ideas travelled. The people made it matter.
          </h1>
          <p className="mt-7 max-w-[47ch] text-lead text-cream/85">
            Relive {POST_EVENT.name}: a gathering of global teams, bold conversations and the shared work of building what comes next.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/highlights" className="rounded-full bg-orange-bright px-6 py-3 text-micro font-semibold uppercase text-white transition hover:bg-orange-deep">
              Explore the highlights
            </Link>
            <Link href="/gallery" className="rounded-full border border-white/45 px-6 py-3 text-micro font-semibold uppercase text-white transition hover:border-white hover:bg-white hover:text-teal-dark">
              View the gallery
            </Link>
          </div>
        </div>
      </header>

      <section className="bg-cream py-14 lg:py-20" aria-labelledby="at-a-glance">
        <div className="mx-auto max-w-[80rem] px-6">
          <div className="flex flex-col gap-4 border-b border-rule pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-micro font-semibold uppercase text-orange-deep">At a glance</p>
              <h2 id="at-a-glance" className="mt-3 font-display text-h2 text-teal-dark">One summit. A lasting signal.</h2>
            </div>
            <p className="max-w-[44ch] text-small text-muted">A few markers of the scale and spirit that the Odyssey community brought to Jaipur.</p>
          </div>
          <dl className="grid divide-y divide-rule border-b border-rule sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-3">
            {POST_EVENT_STATS.map((stat, index) => (
              <div key={stat.label} className="row-in visible py-7 sm:px-6 sm:first:pl-0 lg:even:border-l-0" style={{ "--i": index } as CSSProperties}>
                <dt className="text-micro font-semibold uppercase text-muted">{stat.label}</dt>
                <dd data-count={stat.value} data-count-delay={index * 55} className="mt-2 font-display text-h1 leading-none text-teal-dark tabular-nums">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-24" aria-labelledby="four-ways">
        <div className="mx-auto max-w-[80rem] px-6">
          <p className="text-micro font-semibold uppercase text-orange-deep">Four ways to relive it</p>
          <h2 id="four-ways" className="mt-3 max-w-[20ch] font-display text-h2 text-teal-dark">Choose the story you want to carry forward.</h2>
          <div className="mt-10 grid gap-px bg-rule md:grid-cols-2">
            {RECAP_DESTINATIONS.map((destination) => {
              const photo = photos.find((item) => item.id === destination.image);
              return (
                <Link key={destination.href} href={destination.href} className="group relative min-h-[25rem] overflow-hidden bg-teal-dark p-7 text-white lg:p-10">
                  {photo?.mediumUrl && (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo.mediumUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-65 transition duration-700 group-hover:scale-[1.04]" />
                      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(24,57,68,1),rgba(24,57,68,.5),rgba(24,57,68,.05))]" />
                    </>
                  )}
                  <div className="relative flex h-full flex-col justify-end">
                    <p className="text-micro font-semibold uppercase text-cyan-soft">{destination.eyebrow}</p>
                    <h3 className="mt-3 font-display text-h2">{destination.title}</h3>
                    <p className="mt-4 max-w-[37ch] text-small text-cream/85">{destination.description}</p>
                    <span className="mt-7 text-micro font-semibold uppercase">Explore <span className="cta-arrow ml-1 inline-block">→</span></span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <OdysseyIdeas />
    </>
  );
}
