"use client";

import { useState } from "react";
import ItineraryDay from "@/components/itinerary/ItineraryDay";
import { ITINERARY_AUDIENCES } from "@/data/itinerary";
import type { ItineraryAudience, ItineraryDay as Day } from "@/types";

/** "everyone" is a tag on entries, not a filter — "All activities" covers that end. */
const FILTERS = (Object.keys(ITINERARY_AUDIENCES) as ItineraryAudience[]).filter(
  (audience) => audience !== "everyone"
);

/**
 * The three day columns plus the audience filter above them.
 *
 * Filtering is inclusive: picking "Kids & Families" keeps everything tagged for them *and*
 * everything tagged for everyone, because the question a filter answers here is "what am I
 * meant to turn up to", not "what is exclusive to my group".
 *
 * Client component for the one piece of state. The data has no server-only dependency —
 * it arrives as props purely so the days stay renderable from the server page.
 */
export default function ItineraryBoard({ days }: { days: Day[] }) {
  const [active, setActive] = useState<ItineraryAudience | null>(null);

  const visible = (day: Day) =>
    active === null
      ? day.entries
      : day.entries.filter((entry) => entry.audience === active || entry.audience === "everyone");

  return (
    <>
      <div className="fade-in visible flex flex-wrap items-center gap-3 border-b border-rule pb-6">
        <span className="mr-1 flex items-center gap-2 text-small text-muted">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 5h18l-7 8v6l-4 2v-8z" />
          </svg>
          Filter by:
        </span>

        <FilterPill label="All activities" selected={active === null} onClick={() => setActive(null)} />
        {FILTERS.map((audience) => (
          <FilterPill
            key={audience}
            label={ITINERARY_AUDIENCES[audience]}
            selected={active === audience}
            onClick={() => setActive(audience)}
          />
        ))}
      </div>

      {/* Three columns, one per day. Stacked below lg — a column of cards does not survive
          being squeezed into a third of a phone. */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {days.map((day) => (
          <ItineraryDay key={day.label} day={day} entries={visible(day)} />
        ))}
      </div>
    </>
  );
}

function FilterPill({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`cursor-pointer rounded-full px-4 py-2 text-micro font-semibold tracking-normal transition-colors duration-300 ${
        selected
          ? "bg-accent text-white"
          : "border border-rule bg-white text-muted hover:border-accent/40 hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}
