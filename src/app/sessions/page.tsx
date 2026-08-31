import type { Metadata } from "next";
import SessionCard from "@/components/sessions/SessionCard";
import Button from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import PageHeader from "@/components/ui/PageHeader";
import { sessionSlots } from "@/data/sessions";
import { REGISTER_HREF } from "@/data/site";

export const metadata: Metadata = {
  title: "Sessions | Odyssey 2026",
  description:
    "The Odyssey 2026 breakout programme — nine sessions across three parallel tracks on Day 1, running in Sakura Theatres 1 to 3.",
};

export default function SessionsPage() {
  return (
    <>
      <PageHeader
        kicker="Breakout Sessions"
        title="Nine sessions. Three tracks. One afternoon."
        description="Day 1 runs three parallel tracks across Sakura Theatres 1 to 3 — ecosystems, AI and industries. Three slots, three rooms, and one choice to make in each."
        action={<Button href={REGISTER_HREF}>Register</Button>}
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
