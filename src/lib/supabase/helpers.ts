import type { DbSession, SessionWithAvailability, GroupedSessionSlot, SessionSlotType } from "@/types/database";

/**
 * Computes live dynamic availability, "15 seats left" badge, and urgency status for a session.
 */
export function computeSessionAvailability(session: DbSession): SessionWithAvailability {
  const remaining = Math.max(0, session.capacity - session.booked_seats);
  const isFull = session.booked_seats >= session.capacity;

  let seatsLeftBadge: string | null = null;
  let urgencyStatus: SessionWithAvailability["urgency_status"] = "available";

  if (isFull) {
    urgencyStatus = "full";
  } else if (remaining <= 15) {
    urgencyStatus = "low_seats";
    seatsLeftBadge = `${remaining} seats left`;
  }

  return {
    ...session,
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
  // Slot 1: 15:00–15:40
  {
    id: "slot1-theatre1",
    slot_id: "slot-1",
    slot_time: "15:00–15:40",
    theatre_id: "theatre-1",
    theatre_name: "Sakura · Theatre 1",
    track: "ecosystems",
    title: "Ecosystems track — session 1",
    description: "The first of three ecosystem sessions. Deep dive into partner network architectures.",
    speaker_name: null,
    speaker_role: null,
    speaker_company: null,
    capacity: 100,
    booked_seats: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "slot1-theatre2",
    slot_id: "slot-1",
    slot_time: "15:00–15:40",
    theatre_id: "theatre-2",
    theatre_name: "Sakura · Theatre 2",
    track: "ai",
    title: "AI track — session 1",
    description: "The first of three AI sessions. Enterprise LLM deployment patterns and agents.",
    speaker_name: null,
    speaker_role: null,
    speaker_company: null,
    capacity: 150,
    booked_seats: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "slot1-theatre3",
    slot_id: "slot-1",
    slot_time: "15:00–15:40",
    theatre_id: "theatre-3",
    theatre_name: "Sakura · Theatre 3",
    track: "industries",
    title: "Industries track — session 1",
    description: "The first of three industry sessions. Vertical SaaS and cloud transformation.",
    speaker_name: null,
    speaker_role: null,
    speaker_company: null,
    capacity: 120,
    booked_seats: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // Slot 2: 15:40–16:20
  {
    id: "slot2-theatre1",
    slot_id: "slot-2",
    slot_time: "15:40–16:20",
    theatre_id: "theatre-1",
    theatre_name: "Sakura · Theatre 1",
    track: "ecosystems",
    title: "Ecosystems track — session 2",
    description: "The second ecosystem session of the afternoon. Co-selling and marketplace growth.",
    speaker_name: null,
    speaker_role: null,
    speaker_company: null,
    capacity: 100,
    booked_seats: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "slot2-theatre2",
    slot_id: "slot-2",
    slot_time: "15:40–16:20",
    theatre_id: "theatre-2",
    theatre_name: "Sakura · Theatre 2",
    track: "ai",
    title: "AI track — session 2",
    description: "The second AI session of the afternoon. Production AI benchmarks and governance.",
    speaker_name: null,
    speaker_role: null,
    speaker_company: null,
    capacity: 150,
    booked_seats: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "slot2-theatre3",
    slot_id: "slot-2",
    slot_time: "15:40–16:20",
    theatre_id: "theatre-3",
    theatre_name: "Sakura · Theatre 3",
    track: "industries",
    title: "Industries track — session 2",
    description: "The second industry session of the afternoon. FinTech, Healthcare, and Logistics in focus.",
    speaker_name: null,
    speaker_role: null,
    speaker_company: null,
    capacity: 120,
    booked_seats: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // Slot 3: 16:20–17:00
  {
    id: "slot3-theatre1",
    slot_id: "slot-3",
    slot_time: "16:20–17:00",
    theatre_id: "theatre-1",
    theatre_name: "Sakura · Theatre 1",
    track: "ecosystems",
    title: "Ecosystems track — session 3",
    description: "The closing ecosystem session. 2026 roadmap and ecosystem council conclusions.",
    speaker_name: null,
    speaker_role: null,
    speaker_company: null,
    capacity: 100,
    booked_seats: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "slot3-theatre2",
    slot_id: "slot-3",
    slot_time: "16:20–17:00",
    theatre_id: "theatre-2",
    theatre_name: "Sakura · Theatre 2",
    track: "ai",
    title: "AI track — session 3",
    description: "The closing AI session. Future of autonomous agents and multi-modal models.",
    speaker_name: null,
    speaker_role: null,
    speaker_company: null,
    capacity: 150,
    booked_seats: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "slot3-theatre3",
    slot_id: "slot-3",
    slot_time: "16:20–17:00",
    theatre_id: "theatre-3",
    theatre_name: "Sakura · Theatre 3",
    track: "industries",
    title: "Industries track — session 3",
    description: "The closing industry session. Cross-industry executive panel and Q&A.",
    speaker_name: null,
    speaker_role: null,
    speaker_company: null,
    capacity: 120,
    booked_seats: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
