import { Icon } from "@/components/ui/Icon";
import { ITINERARY_AUDIENCES, ITINERARY_CATEGORIES } from "@/data/itinerary";
import type { ItineraryDay as Day, ItineraryEntry } from "@/types";

type Props = {
  day: Day;
  /** Already filtered by the board — the day still renders when this is empty. */
  entries: ItineraryEntry[];
};

/**
 * One day as one column of cards: a header card, then a card per entry. The icon tile
 * carries the entry's category colour, which is the second axis after the day itself.
 *
 * A list rather than the description list this used to be: a card now holds a title, a
 * time, a sentence and an audience, which is no longer a term-and-definition pair.
 */
export default function ItineraryDay({ day, entries }: Props) {
  return (
    <section className="flex flex-col gap-4">
      <header className="card bg-white px-6 py-5 text-center shadow-[0_1px_2px_rgba(24,57,68,.06)]">
        <h2 className="font-display text-h3 text-ink">{day.label}</h2>
        <p className="mt-1 text-small text-muted">{day.date}</p>
      </header>

      {entries.length === 0 ? (
        <p className="card border border-rule px-5 py-6 text-center text-small text-muted">
          Nothing scheduled for this group.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {entries.map((entry, row) => {
            const category = ITINERARY_CATEGORIES[entry.category];
            return (
              <li
                key={entry.time + entry.label}
                className="row-in visible card flex gap-4 bg-white px-5 py-4 shadow-[0_1px_2px_rgba(24,57,68,.06)]"
                style={{ "--i": row } as React.CSSProperties}
              >
                <span
                  className={`icon-tile flex h-9 w-9 shrink-0 items-center justify-center ${category.tile}`}
                >
                  <Icon name={entry.icon} size={18} />
                  {/* The tile's colour is the category, and colour cannot be the only cue. */}
                  <span className="sr-only">{category.label}</span>
                </span>

                <div className="min-w-0">
                  <h3 className="text-small font-semibold text-ink">{entry.label}</h3>
                  {/*
                    `font-display` here is for the figures, not the voice: these are a
                    stacked column of HH:MM–HH:MM ranges, and Poppins ships no `tnum`, so
                    `tabular-nums` is inert on the body font and the times drift row to row.
                    The theme's micro tracking is far too wide for digits, hence tracking-normal.
                  */}
                  <p className="mt-0.5 font-display text-micro tracking-normal text-muted tabular-nums">
                    {entry.time}
                  </p>
                  <p className="mt-2 text-small text-muted">{entry.description}</p>
                  <p className="mt-3">
                    <span className="inline-block rounded-full bg-accent/10 px-2.5 py-1 text-micro font-semibold tracking-normal text-orange-deep">
                      {ITINERARY_AUDIENCES[entry.audience]}
                    </span>
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
