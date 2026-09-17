export type SessionSlotType = "slot-1" | "slot-2" | "slot-3";
export type SessionTrackType = "ecosystems" | "ai" | "industries";

export interface DbSession {
  id: string; // e.g. "slot1-theatre1"
  slot_id: SessionSlotType;
  slot_time: string; // "15:00–15:40", "15:40–16:20", "16:20–17:00"
  theatre_id: string; // "theatre-1", "theatre-2", "theatre-3"
  theatre_name: string; // "Sakura · Theatre 1"
  track: SessionTrackType;
  title: string;
  description: string;
  speaker_name: string | null;
  speaker_role: string | null;
  speaker_company: string | null;
  capacity: number;
  booked_seats: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SessionWithAvailability extends DbSession {
  remaining_seats: number;
  is_full: boolean;
  seats_left_badge: string | null; // e.g. "15 seats left", "7 seats left", or null
  urgency_status: "available" | "low_seats" | "full";
}

export interface GroupedSessionSlot {
  slotId: SessionSlotType;
  slotTime: string;
  sessions: SessionWithAvailability[];
}

export interface DbRegistration {
  id: string;
  registration_id: string;
  attendee_name: string;
  attendee_email: string;
  slot_1_session_id: string;
  slot_2_session_id: string;
  slot_3_session_id: string;
  status: "confirmed" | "cancelled";
  registered_at: string;
  updated_at: string;
}

export interface DbSessionAttendance {
  id: string;
  session_id: string;
  slot_id: SessionSlotType;
  theatre_id: string;
  registration_id: string;
  attendee_name: string;
  attendee_email: string;
  is_present: boolean;
  is_walk_in: boolean;
  marked_at: string | null;
  marked_by_volunteer_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface RegisterBreakoutRequest {
  registrationId?: string; // Optional: auto-generated if not provided
  attendeeName: string;
  attendeeEmail: string;
  slot1SessionId: string;
  slot2SessionId: string;
  slot3SessionId: string;
}

export interface UpdateCapacityRequest {
  newCapacity: number;
}

export interface MarkAttendanceRequest {
  sessionId: string;
  registrationId: string;
  isPresent: boolean;
  isWalkIn?: boolean;
  volunteerId?: string;
  notes?: string;
}
