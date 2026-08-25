import type { Metadata } from "next";
import SpeakerGrid from "@/components/speakers/SpeakerGrid";
import PageHeader from "@/components/ui/PageHeader";
import { speakers } from "@/data/speakers";

export const metadata: Metadata = {
  title: "Speakers | Odyssey 2026",
  description:
    "The leaders and partners taking the stage at Odyssey 2026, Ananta Spa & Resort, Jaipur.",
};

export default function SpeakersPage() {
  return (
    <>
      <PageHeader
        kicker="Speakers"
        title="The people on stage."
        description="Founders, operators and partners who have built the thing they're talking about. More names are confirmed as the programme comes together."
      />

      <div className="mx-auto max-w-[80rem] px-6 py-20 lg:py-28">
        <SpeakerGrid speakers={speakers} />
      </div>
    </>
  );
}
