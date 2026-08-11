import Link from "next/link";
import Button from "@/components/ui/Button";
import { gallery } from "@/data/gallery";
import { RSVP_HREF, SUMMIT_FACTS } from "@/data/site";

export default function Hero() {
  return (
    <header id="confirm" className="relative isolate">
      {/*
        The one asset that is unarguably real: footage of the actual event, now the ground
        the headline stands on rather than a panel beside it. `isolate` keeps the -z-10
        inside this header, and the opaque teal facts strip below paints over the tail of
        the layer — so the video needs no wrapper of its own to bound its height.

        Keep `id="hero-video"`: PageScripts pauses it for prefers-reduced-motion by that id.

        ponytail: hero.mp4 is 41MB and `preload="none"` does NOT prevent that — autoplay
        overrides preload and the file downloads anyway. Now that it is the full-viewport
        LCP element rather than a clipped side panel, the transfer matters more than it did:
        ffmpeg -i hero.mp4 -vf scale=1600:-2 -c:v libx264 -crf 30 -preset slow -an hero-1600.mp4
      */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
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
        {/* Scrim weighted left, where the copy sits — footage that reads through on the right. */}
        <div className="hero-scrim absolute inset-0" />
      </div>

      <div className="mx-auto flex min-h-[85svh] max-w-[80rem] flex-col justify-center px-6 pt-32 pb-16 lg:min-h-[94vh] lg:pt-40 lg:pb-20">
        <div>
          <p className="fade-in visible mb-8 text-micro font-semibold uppercase text-cyan-soft">
            BOT Consulting <span className="text-orange-soft">·</span> Annual Partner Summit
          </p>

          <h1 className="rise visible font-display text-display text-cream">
            Odyssey
            <br />
            <span className="italic text-orange-soft">2026</span>
          </h1>

          <p className="fade-in visible mt-8 max-w-[46ch] text-lead text-cream/80">
            The work we do together spans countries, time zones and countless conversations. Once a
            year we bring that community into one place — not to review projects, but to reconnect
            with the people behind them.
          </p>

          <div className="fade-in visible mt-10 flex flex-wrap items-center gap-4">
            <Button href={RSVP_HREF}>Confirm your attendance</Button>
            <Link
              href="/itinerary"
              className="border-b border-cream/40 pb-1 text-small font-semibold text-cream transition-colors duration-300 hover:border-cyan-bright hover:text-cyan-bright"
            >
              See the itinerary
            </Link>
          </div>
        </div>
      </div>

      {/* The specifics. A page that never states a fact reads as generated however it is styled. */}
      <div className="relative bg-teal-dark text-cream">
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
