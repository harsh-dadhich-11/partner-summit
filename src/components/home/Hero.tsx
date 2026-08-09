import Link from "next/link";
import Button from "@/components/ui/Button";
import { gallery } from "@/data/gallery";
import { RSVP_HREF, SUMMIT_FACTS } from "@/data/site";

export default function Hero() {
  return (
    <header id="confirm" className="relative">
      <div className="mx-auto grid max-w-[80rem] grid-cols-1 items-center gap-14 px-6 pt-32 pb-16 lg:min-h-[94vh] lg:grid-cols-[1.15fr_0.85fr] lg:gap-20 lg:pt-40 lg:pb-20">
        <div>
          <p className="fade-in visible mb-8 text-micro font-semibold uppercase text-muted">
            BOT Consulting <span className="text-accent">·</span> Annual Partner Summit
          </p>

          <h1 className="rise visible font-display wonk text-display text-ink">
            Odyssey
            <br />
            <span className="italic text-orange-deep">2026</span>
          </h1>

          <p className="fade-in visible mt-8 max-w-[46ch] text-lead text-muted">
            The work we do together spans countries, time zones and countless conversations. Once a
            year we bring that community into one place — not to review projects, but to reconnect
            with the people behind them.
          </p>

          <div className="fade-in visible mt-10 flex flex-wrap items-center gap-4">
            <Button href={RSVP_HREF}>Confirm your attendance</Button>
            <Link
              href="/itinerary"
              className="border-b border-ink/25 pb-1 text-small font-semibold text-ink transition-colors duration-300 hover:border-accent hover:text-accent"
            >
              See the itinerary
            </Link>
          </div>
        </div>

        {/*
          The arch, at the top of the page, holding the one asset that is unarguably real:
          footage of the actual event. Poster paints first — the old `poster` attribute
          pointed at a file that does not exist, so this was a blank box for anyone whose
          browser blocked autoplay.

          ponytail: hero.mp4 is 40MB and `preload="none"` does NOT prevent that — measured in
          Chrome, autoplay overrides preload and the file downloads anyway (playing by ~1.6s).
          What this markup fixes is the blank poster and the video being the largest paint;
          the transfer itself needs a re-encode, which needs ffmpeg:
          ffmpeg -i hero.mp4 -vf scale=1600:-2 -c:v libx264 -crf 30 -preset slow -an hero-1600.mp4
        */}
        <div className="arch relative aspect-[3/4] w-full self-stretch lg:aspect-auto lg:min-h-[34rem]">
          <div className="img-in visible absolute inset-0 overflow-hidden">
            <video
              id="hero-video"
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              poster={gallery.heroStill.src ?? undefined}
              aria-label={gallery.heroStill.alt}
              className="h-full w-full object-cover object-[center_35%]"
            >
              <source src="/assets/hero.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>

      {/* The specifics. A page that never states a fact reads as generated however it is styled. */}
      <div className="bg-teal-dark text-cream">
        <dl className="mx-auto grid max-w-[80rem] grid-cols-2 gap-y-8 px-6 py-10 md:grid-cols-4">
          {SUMMIT_FACTS.map((fact, index) => (
            <div key={fact.label} className="row-in visible" style={{ "--i": index } as React.CSSProperties}>
              <dt className="mb-2 text-micro font-semibold uppercase text-cyan-soft">{fact.label}</dt>
              <dd className="font-display text-h3 text-cream">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
}
