import type { DbSession, SessionWithAvailability, GroupedSessionSlot, SessionSlotType } from "@/types/database";

/**
 * Enriches a session with default speaker metadata if not present in the database.
 */
export function enrichSessionWithSpeaker(session: DbSession): DbSession {
  const defaultSession = DEFAULT_BREAKOUT_SESSIONS.find((d) => d.id === session.id);
  return {
    ...session,
    speaker_name: session.speaker_name || defaultSession?.speaker_name || null,
    speaker_company: session.speaker_company || defaultSession?.speaker_company || null,
  };
}

/**
 * Computes availability status: strictly "Sold Out" or "Filling Fast" with no numeric seat counts shown.
 */
export function computeSessionAvailability(session: DbSession): SessionWithAvailability {
  const enriched = enrichSessionWithSpeaker(session);
  const remaining = Math.max(0, enriched.capacity - enriched.booked_seats);
  const isFull = enriched.booked_seats >= enriched.capacity;

  const seatsLeftBadge = isFull ? "Sold Out" : "Filling Fast";
  const urgencyStatus: SessionWithAvailability["urgency_status"] = isFull ? "sold_out" : "filling_fast";

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
  // Slot 1: 3:00 – 3:45 PM
  {
    id: "slot1-theatre1",
    slot_id: "slot-1",
    slot_time: "3:00 – 3:45 PM",
    theatre_id: "theatre-1",
    theatre_name: "UNCHARTED | Cultivate Curiosity",
    track: "tech-aws",
    title: "Production-Grade AgentCore: Deploying Multi-Agent Systems at Scale",
    description: "Tech Session — AWS: Architecture and patterns for scaling multi-agent workflows in enterprise production environments.",
    speaker_name: "Rishabh Nagar, Bhanvendra Gaur, Pankaj Phular",
    speaker_company: "GCC: Caylent",
    capacity: 100,
    booked_seats: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "slot1-theatre2",
    slot_id: "slot-1",
    slot_time: "3:00 – 3:45 PM",
    theatre_id: "theatre-2",
    theatre_name: "NORTH STAR | Customer Success",
    track: "partner",
    title: "New vs Seasoned CEO -> Same Seat. Different Lens.",
    description: "Partner Session: Leadership choices across different journeys.",
    speaker_name: "Partner & Leadership Panel",
    speaker_company: "BOT & Partners",
    capacity: 150,
    booked_seats: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "slot1-theatre3",
    slot_id: "slot-1",
    slot_time: "3:00 – 3:45 PM",
    theatre_id: "theatre-3",
    theatre_name: "BEDROCK | Integrity & Trust",
    track: "tech-ai",
    title: "Plug and Play: How AI Learned to Use Your Tools (Agentic AI + MCP)",
    description: "Tech Session — AI: Model Context Protocol (MCP) and agentic tool integration in practice.",
    speaker_name: "Adit Khandelwal, Harsh Dadhich",
    speaker_company: "GCC: CFG",
    capacity: 120,
    booked_seats: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // Slot 2: 3:45 – 4:30 PM
  {
    id: "slot2-theatre1",
    slot_id: "slot-2",
    slot_time: "3:45 – 4:30 PM",
    theatre_id: "theatre-1",
    theatre_name: "UNCHARTED | Cultivate Curiosity",
    track: "tech-data",
    title: "Your AI Is as Smart as Your Data",
    description: "Tech Session — Data: Data foundation, pipelines, and contextual knowledge graphs powering AI models.",
    speaker_name: "Swasti Singhal, Kaushal, Rohit Raj Gupta",
    speaker_company: "GCC: Hakkoda",
    capacity: 100,
    booked_seats: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "slot2-theatre2",
    slot_id: "slot-2",
    slot_time: "3:45 – 4:30 PM",
    theatre_id: "theatre-2",
    theatre_name: "NORTH STAR | Customer Success",
    track: "partner",
    title: "Odd Tables — Smaller groups. Sharper conversations",
    description: "Partner Session: 10 Tables, A Partner + Leader at every table for focused discussion.",
    speaker_name: "10 Tables · Partner + Leader at every table",
    speaker_company: "BOT & Partners",
    capacity: 150,
    booked_seats: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "slot2-theatre3",
    slot_id: "slot-2",
    slot_time: "3:45 – 4:30 PM",
    theatre_id: "theatre-3",
    theatre_name: "BEDROCK | Integrity & Trust",
    track: "tech-salesforce",
    title: "Headless 360: Salesforce in Your Interface?",
    description: "Tech Session — Salesforce: Decoupling Salesforce backend from front-end customer experiences.",
    speaker_name: "Naveen Sharma, Snehasis Hazra, Nikita Pahilwani",
    speaker_company: "GCC: CFG",
    capacity: 120,
    booked_seats: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // Slot 3: 4:30 – 5:15 PM
  {
    id: "slot3-theatre1",
    slot_id: "slot-3",
    slot_time: "4:30 – 5:15 PM",
    theatre_id: "theatre-1",
    theatre_name: "UNCHARTED | Cultivate Curiosity",
    track: "tech-ai-salesforce",
    title: "Salesforce Beyond CRM",
    description: "Tech Session — AI + Salesforce: Modern AI agent workflows and intelligent orchestration on Salesforce.",
    speaker_name: "Rajat Khandelwal, Nitesh Soni",
    speaker_company: "GCC: AllCloud",
    capacity: 100,
    booked_seats: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "slot3-theatre2",
    slot_id: "slot-3",
    slot_time: "4:30 – 5:15 PM",
    theatre_id: "theatre-2",
    theatre_name: "NORTH STAR | Customer Success",
    track: "partner",
    title: "Proof of Success with BOT -> From Vision to Value",
    description: "Partner Session: Real GCC journeys. What worked, what changed, what’s next (Story 1: Cloudsmith, Story 2: AllCloud).",
    speaker_name: "Cloudsmith & AllCloud",
    speaker_company: "GCC Success Stories",
    capacity: 150,
    booked_seats: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "slot3-theatre3",
    slot_id: "slot-3",
    slot_time: "4:30 – 5:15 PM",
    theatre_id: "theatre-3",
    theatre_name: "BEDROCK | Integrity & Trust",
    track: "consulting",
    title: "Beyond the Ask: From Order-Taker to Tour Guide",
    description: "Consulting Session: Elevating consulting engagements from transactional tasks to proactive strategic guidance.",
    speaker_name: "Gaurav Verma, Nishant Khandal",
    speaker_company: "BOT Consulting",
    capacity: 120,
    booked_seats: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
