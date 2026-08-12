import ReliveCarousel from "@/components/home/ReliveCarousel";
import { gallery } from "@/data/gallery";
import { HIGHLIGHTS_HREF } from "@/data/site";

/**
 * The dark band the site spends on photography. One posed still with a play triangle
 * painted on it stood in for a whole year; five real frames of it say more, and the text
 * link below still reaches the film.
 *
 * Server component on purpose — gallery.ts runs existsSync at module load. Only the
 * rotation needs a client, and that lives in ReliveCarousel.
 *
 * These five plus EventExperience's `ananta` and the hero's `heroStill` place every shot
 * in the gallery exactly once, so nothing repeats down the page.
 *
 * ponytail: awards/sri/sessions/families are 18-23MB straight off the camera. next/image
 * serves ~200KB, but the first request per variant pays for sharp decoding the original,
 * five images over. Fix the files, not this component:
 * sips -Z 2400 public/assets/{awards,sri,sessions,families}.jpg
 */
const shots = [gallery.awards, gallery.sri, gallery.sessions, gallery.evening, gallery.families];

export default function Relive() {
  return (
    // Keep id="relive": Navbar links to /#relive and PageScripts scroll-spies this id.
    <section id="relive" className="bg-teal-dark py-20 text-cream lg:py-32">
      <div className="mx-auto max-w-[80rem] px-6">
        <div className="max-w-[38rem]">
          <p className="fade-in visible mb-6 flex items-center gap-4 text-micro font-semibold uppercase text-cyan-soft">
            <span className="h-px w-8 bg-cyan-soft/40" />
            Relive 2025
          </p>
          <h2 className="rise visible font-display text-h2 text-cream">
            Every gathering leaves behind a story.
          </h2>
          <p className="fade-in visible mt-6 text-body text-cream/70">
            A conversation that changed your perspective, a friendship that grew stronger, an
            evening that reminded you why any of this matters. Look back at last year&rsquo;s
            gathering — the atmosphere and the moments that continue to shape every one that
            follows.
          </p>
          {/* The only route to the film now that the thumbnail is gone. */}
          <a
            href={HIGHLIGHTS_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="group/cta fade-in visible mt-10 inline-flex items-center gap-2.5 border-b border-cream/30 pb-1.5 text-small font-semibold text-cream transition-colors duration-300 hover:border-orange-soft hover:text-orange-soft"
          >
            Watch the 2025 highlights
            <span className="cta-arrow" aria-hidden="true">
              &rarr;
            </span>
          </a>
        </div>

        <div className="mt-14 lg:mt-20">
          <ReliveCarousel shots={shots} />
        </div>
      </div>
    </section>
  );
}
