import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import CompanySpeakerGroup from "@/components/speakers/CompanySpeakerGroup";
import { featuredSpeakerGroups, guestGroups } from "@/data/speakers";

export const metadata: Metadata = {
  title: "Guests and Speakers | Odyssey 2026",
  description:
    "The leaders and partners taking part in Odyssey 2026, Ananta Spa & Resort, Jaipur.",
};

export default function SpeakersPage() {
  const topGroups = featuredSpeakerGroups.filter((g) =>
    ["tercera", "tailwind capital", "allcloud", "cloudsmith"].includes(g.company.toLowerCase())
  );
  
  // Single-speaker groups to be displayed together on the same line
  const singleSpeakerGroups = [
    featuredSpeakerGroups.find((g) => g.company.toLowerCase() === "auctor"),
    featuredSpeakerGroups.find((g) => g.company.toLowerCase() === "kosmos"),
    featuredSpeakerGroups.find((g) => g.company.toLowerCase() === "eliza"),
  ].filter(Boolean) as typeof featuredSpeakerGroups;

  return (
    <>
      <PageHeader
        kicker="Guests and Speakers"
        title="Great people. Great stories."
        description="Big bets. Hard calls. Lessons learned. And the ideas making their way from boardrooms into the real world. Hear from the leaders joining us at Odyssey."
      />

      <div className="mx-auto max-w-[80rem] px-6 py-16 lg:py-24">
        {/* Featured Speakers Section */}
        <section aria-labelledby="featured-speakers-heading">
          <div className="mb-12">
            <p className="text-micro font-semibold uppercase tracking-wider text-accent">
              Lineup
            </p>
            <h2
              id="featured-speakers-heading"
              className="mt-2 font-display text-h2 text-ink"
            >
              Featured Speakers
            </h2>
            <p className="mt-2 text-body text-muted">
              Industry pioneers, founders, and executive leaders driving the future of cloud, AI, and services.
            </p>
          </div>

          <div className="space-y-16">
            {/* Full-width groups: Tercera, Tailwind Capital, AllCloud, Cloudsmith */}
            {topGroups.map((group, idx) => (
              <CompanySpeakerGroup
                key={group.company}
                group={group}
                groupIndex={idx}
              />
            ))}

            {/* Auctor, Kosmos, Eliza on the same line */}
            {singleSpeakerGroups.length > 0 && (
              <div className="grid gap-10 md:grid-cols-3 lg:gap-12">
                {singleSpeakerGroups.map((group, idx) => (
                  <CompanySpeakerGroup
                    key={group.company}
                    group={group}
                    groupIndex={topGroups.length + idx}
                    gridClassName="grid gap-6 grid-cols-1"
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Guests Section (rendered only if guest groups exist) */}
        {guestGroups.length > 0 && (
          <>
            <div className="my-20 border-t border-rule" />

            <section aria-labelledby="guests-heading">
              <div className="mb-12">
                <p className="text-micro font-semibold uppercase tracking-wider text-teal-mid">
                  Participants
                </p>
                <h2
                  id="guests-heading"
                  className="mt-2 font-display text-h2 text-ink"
                >
                  Guests
                </h2>
                <p className="mt-2 text-body text-muted">
                  Distinguished engineers and technical leaders joining the summit sessions and discussions.
                </p>
              </div>

              <div className="space-y-16">
                {guestGroups.map((group, idx) => (
                  <CompanySpeakerGroup
                    key={group.company}
                    group={group}
                    groupIndex={featuredSpeakerGroups.length + idx}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
}
