import Photo from "@/components/ui/Photo";
import { gallery } from "@/data/gallery";
import { HIGHLIGHTS_HREF } from "@/data/site";

/**
 * Runs edge to edge: the text column is padded to line up with the rest of the page
 * while the film still bleeds off the right of the screen. That break in the container
 * is the point — every other section used to sit in the same centred box.
 */
export default function Relive() {
  return (
    <section id="relive" className="bg-teal-dark text-cream lg:grid lg:grid-cols-2 lg:items-stretch">
      <div className="flex items-center px-6 py-20 lg:justify-end lg:py-32">
        <div className="max-w-[32rem] lg:pr-20">
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
      </div>

      <a
        href={HIGHLIGHTS_HREF}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Watch the Odyssey 2025 highlights film"
        className="group img-in visible relative block aspect-[4/3] overflow-hidden lg:aspect-auto lg:min-h-[38rem]"
      >
        <Photo
          shot={gallery.heroStill}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <span className="absolute inset-0 bg-[linear-gradient(200deg,rgba(16,29,34,0)_45%,rgba(16,29,34,.6)_100%)]" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-cream/95 transition-transform duration-300 group-hover:scale-110">
            <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-orange-deep" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      </a>
    </section>
  );
}
