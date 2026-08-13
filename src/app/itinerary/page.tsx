import type { Metadata } from "next";
import ItineraryBoard from "@/components/itinerary/ItineraryBoard";
import PageHeader from "@/components/ui/PageHeader";
import { itineraryDays } from "@/data/itinerary";

export const metadata: Metadata = {
  title: "Itinerary | Odyssey 2026",
  description:
    "The shape of the three days at Odyssey 2026 — from arrival at Ananta Spa & Resort, Jaipur, to the journey home.",
};

export default function ItineraryPage() {
  return (
    <>
      <PageHeader
        kicker="Itinerary"
        title="Three days, hour by hour."
        description="From arrival at Ananta to the journey home. Times are indicative and invited guests will hear first if anything moves."
      />

      <div className="mx-auto max-w-[80rem] px-6 py-20 lg:py-28">
        {/* The theme, set as an epigraph — it framed the days better than a card ever did. */}
        <figure className="fade-in visible mb-20 max-w-[34rem]">
          <blockquote className="font-display text-h2 text-ink italic">
            From Jaipur to the world.
          </blockquote>
          <figcaption className="mt-4 text-micro font-semibold uppercase text-accent">
            Powered by People, Platform, Proof
          </figcaption>
        </figure>

        <ItineraryBoard days={itineraryDays} />
      </div>
    </>
  );
}
