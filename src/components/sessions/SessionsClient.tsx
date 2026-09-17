"use client";

import { useState, useEffect, useCallback } from "react";
import { Icon } from "@/components/ui/Icon";
import SessionCard from "@/components/sessions/SessionCard";
import RegistrationModal from "@/components/sessions/RegistrationModal";
import MyPassModal from "@/components/sessions/MyPassModal";
import { supabase } from "@/lib/supabase/client";
import type { GroupedSessionSlot } from "@/types/database";

interface Props {
  initialSlots: GroupedSessionSlot[];
}

export default function SessionsClient({ initialSlots }: Props) {
  const [slots, setSlots] = useState<GroupedSessionSlot[]>(initialSlots);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isMyPassOpen, setIsMyPassOpen] = useState(false);

  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch("/api/sessions", { cache: "no-store" });
      const json = await res.json();
      if (json.success && json.slots) {
        setSlots(json.slots);
      }
    } catch (err) {
      console.error("Failed to refresh sessions:", err);
    }
  }, []);

  // Subscribe to Supabase Realtime updates on sessions table
  useEffect(() => {
    const channel = supabase
      .channel("public:sessions-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sessions" },
        () => {
          // Re-fetch sessions on any update/insert/delete
          fetchSessions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchSessions]);

  return (
    <>
      {/* Top Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule/50 pb-8">
        <div>
          <h2 className="font-display text-h2 text-ink">Day 1 Breakout Schedule</h2>
          <p className="mt-1 text-small text-muted">
            3 parallel tracks across Sakura Theatres 1, 2, and 3. Registration is mandatory for all attendees.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsMyPassOpen(true)}
            className="rounded-full border border-rule bg-white px-6 py-3 text-small font-semibold text-ink hover:bg-surface-sunk transition-colors shadow-sm"
          >
            Find My Pass
          </button>
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="rounded-full bg-accent px-8 py-3 text-small font-semibold text-white hover:bg-orange-deep transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <span>Register for Breakouts</span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>

      {/* Grid of Sessions Grouped by Slot */}
      <div className="mt-10 space-y-16">
        {slots.map((group, slotIndex) => (
          <section key={group.slotId} className="relative">
            <div className="flex items-center justify-between border-b border-rule/40 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-mid/10 text-teal-base">
                  <Icon name="clock" size={16} />
                </span>
                <div>
                  <h3 className="font-display text-h3 text-ink tabular-nums">{group.slotTime}</h3>
                  <p className="text-micro font-semibold uppercase tracking-wider text-muted">
                    Slot {slotIndex + 1} · 40 Minutes
                  </p>
                </div>
              </div>

              <span className="text-micro font-medium text-muted">
                Select 1 of 3 Theatres
              </span>
            </div>

            <ul className="mt-6 grid gap-6 md:grid-cols-3">
              {group.sessions.map((session, index) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  index={index}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* Bottom CTA Banner */}
      <div className="mt-20 border border-rule-light bg-teal-dark p-8 md:p-12 text-cream text-center shadow-xl">
        <span className="inline-block rounded-full bg-cyan-bright/15 px-4 py-1.5 text-micro font-bold uppercase tracking-wider text-cyan-bright">
          Limited Seating Per Theatre
        </span>
        <h3 className="mt-4 font-display text-h2 text-white">
          Secure Your Breakout Preferences Today
        </h3>
        <p className="mt-3 max-w-[50ch] mx-auto text-body text-cream/80">
          Seats are allocated on a strictly first-come, first-served basis. Choose your 3 sessions before seats fill up.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="rounded-full bg-accent px-8 py-3.5 text-small font-semibold text-white hover:bg-orange-deep transition-all shadow-md"
          >
            Start Registration &rarr;
          </button>
        </div>
      </div>

      {/* Modals */}
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        slots={slots}
        onRegistrationSuccess={() => {
          fetchSessions();
        }}
      />

      <MyPassModal
        isOpen={isMyPassOpen}
        onClose={() => setIsMyPassOpen(false)}
      />
    </>
  );
}
