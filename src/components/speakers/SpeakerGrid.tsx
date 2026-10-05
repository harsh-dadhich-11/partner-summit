import type { Speaker } from "@/types";
import SpeakerCard from "./SpeakerCard";

export default function SpeakerGrid({ speakers }: { speakers: Speaker[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {speakers.map((speaker, row) => (
        <SpeakerCard key={speaker.name} speaker={speaker} index={row} />
      ))}
    </div>
  );
}
