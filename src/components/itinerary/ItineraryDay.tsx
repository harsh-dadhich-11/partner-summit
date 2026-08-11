import type { ItineraryDay as Day } from "@/types";

type Props = {
  day: Day;
  index: number;
};

/**
 * A ruled timetable rather than a gradient card. Times are tabular so the column of
 * figures lines up down the page — the detail that makes a schedule feel typeset.
 */
export default function ItineraryDay({ day, index }: Props) {
  return (
    <section className="grid gap-8 border-t border-rule py-14 lg:grid-cols-[18rem_1fr] lg:gap-16">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <span aria-hidden="true" className="font-display text-display leading-none text-ink/12">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h2 className="mt-4 font-display text-h3 text-ink">{day.label}</h2>
        <p className="mt-1 text-micro font-semibold uppercase text-accent">{day.date}</p>
      </div>

      <dl>
        {day.entries.map((entry, row) => (
          <div
            key={entry.time + entry.label}
            className="row-in visible flex flex-col gap-1 border-b border-rule py-4 first:border-t sm:flex-row sm:items-baseline sm:gap-10"
            style={{ "--i": row } as React.CSSProperties}
          >
            {/*
              `font-display` here is for the figures, not the voice: these are a stacked
              column of HH:MM–HH:MM ranges, and Poppins ships no `tnum`, so `tabular-nums`
              is inert on the body font and the en-dash drifts row to row. Jakarta has it.
              At text-small/600 the two faces are near-indistinguishable anyway.
            */}
            <dt className="shrink-0 font-display text-small font-semibold text-muted tabular-nums sm:w-36">
              {entry.time}
            </dt>
            <dd className="text-lead text-ink">{entry.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
