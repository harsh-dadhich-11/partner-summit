import Image from "next/image";
import type { CompanySpeakerGroup as CompanySpeakerGroupType } from "@/types";
import SpeakerCard from "./SpeakerCard";

type CompanySpeakerGroupProps = {
  group: CompanySpeakerGroupType;
  groupIndex?: number;
  gridClassName?: string;
};

export default function CompanySpeakerGroup({
  group,
  groupIndex = 0,
  gridClassName = "grid gap-6 sm:grid-cols-2 lg:grid-cols-4",
}: CompanySpeakerGroupProps) {
  return (
    <section className="relative">
      {/* Company Header with Logo only */}
      <div className="mb-8 flex items-center border-b border-rule pb-5">
        {group.logo ? (
          <div className="card flex h-12 items-center bg-white/70 px-4 py-2 shadow-xs ring-1 ring-rule">
            <Image
              src={group.logo}
              alt={`${group.company} logo`}
              width={140}
              height={40}
              className="h-7 w-auto max-w-[140px] object-contain"
            />
          </div>
        ) : (
          <h3 className="font-display text-h3 text-ink">{group.company}</h3>
        )}
      </div>

      {/* Grid of Speakers */}
      <div className={gridClassName}>
        {group.speakers.map((speaker, idx) => (
          <SpeakerCard
            key={speaker.name}
            speaker={speaker}
            index={groupIndex * 4 + idx}
          />
        ))}
      </div>
    </section>
  );
}
