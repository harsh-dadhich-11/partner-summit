import PillarRow from "@/components/home/PillarRow";
import Photo from "@/components/ui/Photo";
import SectionHeading from "@/components/ui/SectionHeading";
import { gallery } from "@/data/gallery";
import { pillars } from "@/data/pillars";

/**
 * An editorial spread, not a card grid: one image sticks on the left while the index of
 * six scrolls past it on the right.
 *
 * The frame is 4:3 because every source in public/assets is a landscape 3:2 — the old
 * 3:4 portrait box was cropping half of each one away to feed a shape that is now gone.
 */
export default function EventExperience() {
  return (
    <section id="experience" className="mx-auto max-w-[80rem] px-6 py-24 lg:py-32">
      <SectionHeading
        kicker="Event Experience"
        title="Three days built around the conversations, not the stage."
        description="There is no single keynote this all revolves around. It unfolds through shared meals, breakout rooms and long evenings — every session and activity shaped to leave room for people to actually talk to each other."
      />

      <div className="grid gap-14 lg:grid-cols-[0.72fr_1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="img-in visible relative aspect-[4/3] w-full overflow-hidden">
            <Photo shot={gallery.ananta} sizes="(max-width: 1024px) 100vw, 32vw" />
          </div>
        </div>

        <ol className="border-b border-rule">
          {pillars.map((pillar, index) => (
            <PillarRow key={pillar.title} pillar={pillar} index={index} />
          ))}
        </ol>
      </div>
    </section>
  );
}
