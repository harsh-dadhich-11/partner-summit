import PillarRow from "@/components/home/PillarRow";
import Photo from "@/components/ui/Photo";
import SectionHeading from "@/components/ui/SectionHeading";
import { gallery } from "@/data/gallery";
import { pillars } from "@/data/pillars";

export default function EventExperience() {
  return (
    <section id="experience" className="mx-auto max-w-[80rem] px-6 py-24 lg:py-32">
      <SectionHeading
        kicker="Event Experience"
        title="Three days built around the conversations"
        description="“Some of the best moments won’t be on the agenda. They’ll happen over shared meals, in breakout rooms and in conversations that carry on long after the session ends.”"
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
