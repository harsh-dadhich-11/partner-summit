import type { Metadata } from "next";
import SessionCard from "@/components/sessions/SessionCard";
import { Icon } from "@/components/ui/Icon";
import PageHeader from "@/components/ui/PageHeader";
import { sessionSlots } from "@/data/sessions";

export const metadata: Metadata = {
  title: "Sessions | Odyssey 2026",
  description:
    "The Odyssey 2026 breakout programme — nine sessions across three parallel tracks on Day 1, running in Sakura Theatres 1 to 3.",
};

export default function SessionsPage() {
  return (
    <>
      {/* The header's action is a static pill, not a Button: registration has no destination
          yet, so this states the status rather than offering a control that goes nowhere. */}
      <PageHeader
        kicker="Breakout Sessions"
        title="Tech, AI & Industry Sessions"
        description="Day 1 breaks out into nine immersive sessions across technology, AI, product innovation, industries and ecosystems. Get closer to what teams are building, what’s actually working, and the ideas worth borrowing — with real examples, practical conversations and plenty of room for questions."
        action={
          <span className="inline-flex items-center rounded-full border border-cream/40 px-6 py-3 text-micro font-semibold tracking-normal text-cream/75 uppercase">
            Registrations open soon
          </span>
        }
      />

      <div className="mx-auto max-w-[80rem] px-6 py-20 lg:py-28">
        {sessionSlots.map((group, slotIndex) => (
          <section key={group.slot} className={slotIndex > 0 ? "mt-16 lg:mt-20" : ""}>
            <div className="flex items-center gap-3 border-t border-rule pt-12">
              <span className="text-teal-mid">
                <Icon name="clock" size={18} />
              </span>
              <h2 className="font-display text-h3 text-ink tabular-nums">{group.slot}</h2>
            </div>

            <ul className="mt-8 grid gap-6 md:grid-cols-3">
              {group.sessions.map((session, index) => (
                /* Index restarts each slot on purpose: the stagger should read left to
                   right across a row, not accumulate half a second by the last card. */
                <SessionCard key={session.room} session={session} index={index} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
