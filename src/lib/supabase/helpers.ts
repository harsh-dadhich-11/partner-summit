import type { DbSession, SessionWithAvailability, GroupedSessionSlot, SessionSlotType } from "@/types/database";

/**
 * Enriches a session with default speaker metadata if not present in the database.
 */
export function enrichSessionWithSpeaker(session: DbSession): DbSession {
  const defaultSession = DEFAULT_BREAKOUT_SESSIONS.find((d) => d.id === session.id);
  return {
    ...session,
    speaker_name: session.speaker_name || defaultSession?.speaker_name || null,
    speaker_role: session.speaker_role || defaultSession?.speaker_role || null,
    speaker_company: session.speaker_company || defaultSession?.speaker_company || null,
  };
}

/**
 * Computes live dynamic availability, "15 seats left" badge, and urgency status for a session.
 */
export function computeSessionAvailability(session: DbSession): SessionWithAvailability {
  const enriched = enrichSessionWithSpeaker(session);
  const remaining = Math.max(0, enriched.capacity - enriched.booked_seats);
  const isFull = enriched.booked_seats >= enriched.capacity;

  let seatsLeftBadge: string | null = null;
  let urgencyStatus: SessionWithAvailability["urgency_status"] = "available";

  if (isFull) {
    urgencyStatus = "full";
  } else if (remaining <= 15) {
    urgencyStatus = "low_seats";
    seatsLeftBadge = `${remaining} seats left`;
  }

  return {
    ...enriched,
    remaining_seats: remaining,
    is_full: isFull,
    seats_left_badge: seatsLeftBadge,
    urgency_status: urgencyStatus,
  };
}

/**
 * Groups sessions by their time slot and sorts slots chronologically.
 */
export function groupSessionsBySlot(sessions: SessionWithAvailability[]): GroupedSessionSlot[] {
  const slotOrder: Record<string, number> = {
    "slot-1": 1,
    "slot-2": 2,
    "slot-3": 3,
  };

  const slotMap = new Map<string, { slotId: SessionSlotType; slotTime: string; sessions: SessionWithAvailability[] }>();

  for (const session of sessions) {
    if (!slotMap.has(session.slot_id)) {
      slotMap.set(session.slot_id, {
        slotId: session.slot_id,
        slotTime: session.slot_time,
        sessions: [],
      });
    }
    slotMap.get(session.slot_id)!.sessions.push(session);
  }

  return Array.from(slotMap.values()).sort(
    (a, b) => (slotOrder[a.slotId] || 99) - (slotOrder[b.slotId] || 99)
  );
}

/**
 * Default fallback 9 breakout sessions dataset matching the summit schedule.
 */
export const DEFAULT_BREAKOUT_SESSIONS: DbSession[] = [
  // Slot 1: 15:10–15:45
  {
    id: "slot1-theatre1",
    slot_id: "slot-1",
    slot_time: "15:10–15:45",
    theatre_id: "theatre-1",
    theatre_name: "Sakura · Theatre 1",
    track: "ecosystems",
    title: "Ecosystems Track",
    speaker_name: "Chris Barbin",
    speaker_role: "Founder & CEO",
    speaker_company: "Tercera",
    capacity: 100,
    booked_seats: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "slot1-theatre2",
    slot_id: "slot-1",
    slot_time: "15:10–15:45",
    theatre_id: "theatre-2",
    theatre_name: "Sakura · Theatre 2",
    track: "ai",
    title: "AI Track",
    speaker_name: "Glenn Weinstein",
    speaker_role: "CEO",
    speaker_company: "Cloudsmith",
    capacity: 150,
    booked_seats: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "slot1-theatre3",
    slot_id: "slot-1",
    slot_time: "15:10–15:45",
    theatre_id: "theatre-3",
    theatre_name: "Sakura · Theatre 3",
    track: "industries",
    title: "Industries Track",
    speaker_name: "Gurvendra Suri",
    speaker_role: "Tailwind Operating Executive",
    speaker_company: "Tailwind Capital",
    capacity: 120,
    booked_seats: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // Slot 2: 15:55–16:30
  {
    id: "slot2-theatre1",
    slot_id: "slot-2",
    slot_time: "15:55–16:30",
    theatre_id: "theatre-1",
    theatre_name: "Sakura · Theatre 1",
    track: "ecosystems",
    title: "Ecosystems Track",
    speaker_name: "Eran Gil",
    speaker_role: "CEO",
    speaker_company: "AllCloud",
    capacity: 100,
    booked_seats: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "slot2-theatre2",
    slot_id: "slot-2",
    slot_time: "15:55–16:30",
    theatre_id: "theatre-2",
    theatre_name: "Sakura · Theatre 2",
    track: "ai",
    title: "AI Track",
    speaker_name: "Sanjay Gidwani",
    speaker_role: "Founder & CEO",
    speaker_company: "KOSMOS",
    capacity: 150,
    booked_seats: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "slot2-theatre3",
    slot_id: "slot-2",
    slot_time: "15:55–16:30",
    theatre_id: "theatre-3",
    theatre_name: "Sakura · Theatre 3",
    track: "industries",
    title: "Industries Track",
    speaker_name: "Justin Schneiderman",
    speaker_role: "Vice President",
    speaker_company: "Tailwind Capital",
    capacity: 120,
    booked_seats: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // Slot 3: 16:40–17:15
  {
    id: "slot3-theatre1",
    slot_id: "slot-3",
    slot_time: "16:40–17:15",
    theatre_id: "theatre-1",
    theatre_name: "Sakura · Theatre 1",
    track: "ecosystems",
    title: "Ecosystems Track",
    speaker_name: "Lisa Burton",
    speaker_role: "Partner & COO",
    speaker_company: "Tercera",
    capacity: 100,
    booked_seats: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "slot3-theatre2",
    slot_id: "slot-3",
    slot_time: "16:40–17:15",
    theatre_id: "theatre-2",
    theatre_name: "Sakura · Theatre 2",
    track: "ai",
    title: "AI Track",
    speaker_name: "William Sun",
    speaker_role: "Co-Founder & CEO",
    speaker_company: "Auctor",
    capacity: 150,
    booked_seats: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "slot3-theatre3",
    slot_id: "slot-3",
    slot_time: "16:40–17:15",
    theatre_id: "theatre-3",
    theatre_name: "Sakura · Theatre 3",
    track: "industries",
    title: "Industries Track",
    speaker_name: "William Fleder",
    speaker_role: "Partner",
    speaker_company: "Tailwind Capital",
    capacity: 120,
    booked_seats: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
