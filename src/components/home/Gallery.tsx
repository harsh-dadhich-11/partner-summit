import ReliveFold, { type ReliveSlide } from "@/components/home/ReliveFold";
import { gallery } from "@/data/gallery";
import { reliveItems } from "@/data/relive";
import { HIGHLIGHTS_HREF } from "@/data/site";

/* gallery.ts reads the filesystem, so the keys are resolved here and the fold — a client
   component — is handed finished shots. Same boundary as EventExperience. */
const slides: ReliveSlide[] = reliveItems.map(({ image, ...item }) => ({
  ...item,
  shot: gallery[image],
}));

export default function Gallery() {
  return (
    <section id="gallery" className="bg-teal-dark pt-20 pb-20 text-cream lg:pt-32 lg:pb-32">
      <div className="mx-auto max-w-[80rem] px-6">
        <div className="max-w-[38rem]">
          <p className="fade-in visible mb-6 flex items-center gap-4 text-micro font-semibold uppercase text-cyan-soft">
            <span className="h-px w-8 bg-cyan-soft/40" />
            Relive&rsquo;25
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
      </div>

      {/*
        Outside the content column on purpose: the fold pins itself to the viewport and
        needs the full width to do it. It carries its own height — several viewports of it
        once JS is running, and nothing at all before that.
      */}
      <div className="mt-14 lg:mt-20">
        <ReliveFold items={slides} />
      </div>
    </section>
  );
}
