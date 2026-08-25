import GalleryFrame from "@/components/home/GalleryFrame";
import { gallery } from "@/data/gallery";
import { HIGHLIGHTS_HREF } from "@/data/site";

const shots = [
  gallery.relive1,
  gallery.relive2,
  gallery.relive3,
  gallery.relive4,
  gallery.relive5,
  gallery.relive6,
  gallery.relive7,
  gallery.relive8,
];

export default function Gallery() {
  return (
    <section id="gallery" className="bg-teal-dark py-20 text-cream lg:py-32">
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

        <div className="mt-14 lg:mt-20">
          <GalleryFrame shots={shots} />
        </div>
      </div>
    </section>
  );
}
