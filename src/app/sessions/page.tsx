import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import SessionsClient from "@/components/sessions/SessionsClient";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { computeSessionAvailability, groupSessionsBySlot, DEFAULT_BREAKOUT_SESSIONS } from "@/lib/supabase/helpers";
import type { DbSession, GroupedSessionSlot } from "@/types/database";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Breakout Sessions | Odyssey 2026",
  description:
    "The Odyssey 2026 breakout programme — nine sessions across three parallel tracks on Day 1, running in Sakura Theatres 1 to 3. Register your session preferences.",
};

async function getInitialSessions(): Promise<GroupedSessionSlot[]> {
  try {
    if (!isSupabaseConfigured()) {
      const computed = DEFAULT_BREAKOUT_SESSIONS.map(computeSessionAvailability);
      return groupSessionsBySlot(computed);
    }

    const { data: rawSessions, error } = await supabaseAdmin
      .from("sessions")
      .select("*")
      .eq("is_active", true)
      .order("slot_id", { ascending: true })
      .order("theatre_id", { ascending: true });

    if (error || !rawSessions || rawSessions.length === 0) {
      const computed = DEFAULT_BREAKOUT_SESSIONS.map(computeSessionAvailability);
      return groupSessionsBySlot(computed);
    }

    const sessions = (rawSessions as DbSession[]).map(computeSessionAvailability);
    return groupSessionsBySlot(sessions);
  } catch (err) {
    console.error("Error loading breakout sessions:", err);
    const computed = DEFAULT_BREAKOUT_SESSIONS.map(computeSessionAvailability);
    return groupSessionsBySlot(computed);
  }
}

export default async function SessionsPage() {
  const initialSlots = await getInitialSessions();

  return (
    <>
      <PageHeader
        kicker="Day 1 Breakouts"
        title="Tech, AI & Industry Sessions"
        description="Day 1 breaks out into nine immersive sessions across technology, AI, product innovation, industries and ecosystems. Seating is strictly limited per theatre and allocated first-come, first-served."
        action={
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-bright/40 bg-cyan-bright/10 px-5 py-2.5 text-micro font-semibold tracking-normal text-cyan-bright uppercase">
            <span className="h-2 w-2 rounded-full bg-cyan-bright animate-pulse" />
            Registration Open
          </span>
        }
      />

      <div className="mx-auto max-w-[80rem] px-6 py-12 lg:py-20">
        <SessionsClient initialSlots={initialSlots} />
      </div>
    </>
  );
}
