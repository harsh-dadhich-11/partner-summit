import type { Metadata } from "next";
import SpeakerGrid from "@/components/speakers/SpeakerGrid";
import PageHeader from "@/components/ui/PageHeader";
import { speakers } from "@/data/speakers";

export const metadata: Metadata = {
  title: "Participants | Odyssey 2026",
  description:
    "The leaders and partners taking part in Odyssey 2026, Ananta Spa & Resort, Jaipur.",
};

export default function SpeakersPage() {
  return (
    <>
      <PageHeader
        kicker="Participants"
        title="Great people. Great stories."
        description="Big bets. Hard calls. Lessons learned. And the ideas making their way from boardrooms into the real world. Hear from the leaders joining us at Odyssey. "
      />

      <div className="mx-auto max-w-[80rem] px-6 py-20 lg:py-28">
        <SpeakerGrid speakers={speakers} />
      </div>
    </>
  );
}
