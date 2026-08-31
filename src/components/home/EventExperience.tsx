import PillarCarousel from "@/components/home/PillarCarousel";
import SectionHeading from "@/components/ui/SectionHeading";
import { gallery } from "@/data/gallery";
import { pillars } from "@/data/pillars";

export default function EventExperience() {
  /* Resolved here, on the server: gallery.ts touches the filesystem at module load, so
     the carousel receives finished Shot objects rather than importing it. */
  const slides = pillars.map((pillar) => ({ ...pillar, shot: gallery[pillar.image] }));

  return (
    /* No max-width on the section: the track runs full-bleed so the neighbouring cards
       can be cut off by the viewport edge, which is what makes them read as "more". */
    <section id="experience" className="overflow-hidden py-24 lg:py-32">
      <div className="mx-auto max-w-[80rem] px-6">
        <SectionHeading
          kicker="Event Experience"
          title="Three days built around the conversations"
          description="“Some of the best moments won’t be on the agenda. They’ll happen over shared meals, in breakout rooms and in conversations that carry on long after the session ends.”"
        />
      </div>

      <PillarCarousel slides={slides} />
    </section>
  );
}
