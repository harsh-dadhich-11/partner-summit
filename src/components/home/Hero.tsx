import Link from "next/link";
import { gallery } from "@/data/gallery";

export default function Hero() {
  return (
    <header className="relative isolate">
      {/*
        The one asset that is unarguably real: footage of the actual event, now the ground
        the headline stands on rather than a panel beside it. `isolate` keeps the -z-10
        inside this header.

        Keep `id="hero-video"`: PageScripts pauses it for prefers-reduced-motion by that id.

        `brightness-[.45]` in place of a tinted overlay: dimming the footage itself keeps its
        own colour, where a teal scrim washed it. The filter applies to the poster frame too,
        so autoplay-blocked visitors get the same contrast. This one number is the only dial —
        raise it and the cream headline starts to lose the frame's bright areas.
      */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <video
          id="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={gallery.heroStill.src ?? undefined}
          aria-label={gallery.heroStill.alt}
          className="h-full w-full object-cover object-[center_35%] brightness-[.45]"
        >
          <source src="/assets/hero.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="mx-auto flex min-h-[85svh] max-w-[80rem] flex-col justify-center px-6 pt-32 pb-16 lg:min-h-[94vh] lg:pt-40 lg:pb-20">
        <div>
          <p className="fade-in visible mb-8 text-micro font-semibold uppercase text-cyan-soft">
            Annual Partner Summit
          </p>

          <h1 className="rise visible font-display text-display text-cream">
            Odyssey
            <br />
            <span className="italic text-orange-soft">2026</span>
          </h1>

          <p className="fade-in visible mt-6 font-display text-h3 text-cyan-soft">
            23–25th Oct
          </p>

          <p className="fade-in visible mt-6 max-w-[46ch] text-lead text-cream/80">
            The work we do together spans countries, time zones and countless conversations. Once a year, we swap screens for face time and bring everyone together IRL.
          </p>

          <div className="fade-in visible mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/itinerary"
              className="border-b border-cream/40 pb-1 text-small font-semibold text-cream transition-colors duration-300 hover:border-cyan-bright hover:text-cyan-bright"
            >
              See the itinerary
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
