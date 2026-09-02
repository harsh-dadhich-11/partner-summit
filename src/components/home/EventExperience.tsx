import PillarMosaic, { type MosaicTile } from "@/components/home/PillarMosaic";
import SectionHeading from "@/components/ui/SectionHeading";
import { gallery } from "@/data/gallery";
import { pillarFillers, pillars } from "@/data/pillars";

export default function EventExperience() {
  /* Resolved here, on the server: gallery.ts touches the filesystem at module load, so the
     tiles receive finished Shot objects rather than importing it.

     Alternating pillar, photo, pillar, photo… — five pillars against four fillers means the
     last pillar contributes no trailing photo, which lands on exactly nine tiles and puts a
     content tile in both the first and last cell of the grid. */
  const tiles: MosaicTile[] = pillars.flatMap((pillar, index) => {
    const filler = pillarFillers[index];
    return [
      { kind: "content" as const, ...pillar, shot: gallery[pillar.image] },
      ...(filler ? [{ kind: "photo" as const, shot: gallery[filler] }] : []),
    ];
  });

  return (
    <section id="experience" className="py-24 lg:py-32">
      <div className="mx-auto max-w-[80rem] px-6">
        <SectionHeading
          kicker="Event Experience"
          title="Three days built around the conversations"
          description="“Some of the best moments won’t be on the agenda. They’ll happen over shared meals, in breakout rooms and in conversations that carry on long after the session ends.”"
        />

        <PillarMosaic tiles={tiles} />
      </div>
    </section>
  );
}
