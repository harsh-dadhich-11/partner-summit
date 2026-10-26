-- ==============================================================================
-- Partner Summit 2026: Breakout Session Registration & Attendance Schema
-- Compatible with Supabase PostgreSQL
-- ==============================================================================

-- 1. Create Enums (if not already existing)
DO $$ BEGIN
  CREATE TYPE session_slot_type AS ENUM ('slot-1', 'slot-2', 'slot-3');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Migration helper: If public.sessions exists with old enum track, convert it to TEXT
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'track' AND data_type = 'USER-DEFINED'
  ) THEN
    ALTER TABLE public.sessions ALTER COLUMN track TYPE TEXT USING track::TEXT;
  END IF;
END $$;

-- 2. Sessions Table (Dynamic Capacity & Real-Time Availability)
CREATE TABLE IF NOT EXISTS public.sessions (
  id TEXT PRIMARY KEY, -- e.g. 'slot1-theatre1'
  slot_id session_slot_type NOT NULL,
  slot_time TEXT NOT NULL, -- '3:00 – 3:45 PM', '3:45 – 4:30 PM', '4:30 – 5:15 PM'
  theatre_id TEXT NOT NULL, -- 'theatre-1', 'theatre-2', 'theatre-3'
  theatre_name TEXT NOT NULL, -- 'Theatre 1 — UNCHARTED | Cultivate Curiosity'
  track TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  speaker_name TEXT,
  speaker_company TEXT,
  capacity INT NOT NULL DEFAULT 100 CHECK (capacity >= 0),
  booked_seats INT NOT NULL DEFAULT 0 CHECK (booked_seats >= 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_slot_theatre UNIQUE (slot_id, theatre_id),
  CONSTRAINT booked_seats_cannot_exceed_capacity CHECK (booked_seats <= capacity)
);

-- Index for querying sessions by slot and availability
CREATE INDEX IF NOT EXISTS idx_sessions_slot_active ON public.sessions (slot_id, is_active);

-- 3. Registrations Table
-- Strictly enforces:
--   - @botconsulting.io email domain
--   - Exactly 1 session per slot (slot 1, slot 2, slot 3)
--   - Unique registration per attendee
CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id TEXT UNIQUE NOT NULL,
  attendee_name TEXT NOT NULL,
  attendee_email TEXT UNIQUE NOT NULL,
  slot_1_session_id TEXT NOT NULL REFERENCES public.sessions(id),
  slot_2_session_id TEXT NOT NULL REFERENCES public.sessions(id),
  slot_3_session_id TEXT NOT NULL REFERENCES public.sessions(id),
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT check_botconsulting_email CHECK (attendee_email ~* '^[A-Za-z0-9._%+-]+@botconsulting\.io$')
);

CREATE INDEX IF NOT EXISTS idx_registrations_email ON public.registrations (attendee_email);
CREATE INDEX IF NOT EXISTS idx_registrations_regid ON public.registrations (registration_id);

-- 4. Session Attendance Table (On-site Volunteer Check-in Sheets)
CREATE TABLE IF NOT EXISTS public.session_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  slot_id session_slot_type NOT NULL,
  theatre_id TEXT NOT NULL,
  registration_id TEXT NOT NULL,
  attendee_name TEXT NOT NULL,
  attendee_email TEXT NOT NULL,
  is_present BOOLEAN NOT NULL DEFAULT false,
  is_walk_in BOOLEAN NOT NULL DEFAULT false,
  marked_at TIMESTAMPTZ,
  marked_by_volunteer_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_session_attendee UNIQUE (session_id, registration_id)
);

CREATE INDEX IF NOT EXISTS idx_attendance_session ON public.session_attendance (session_id, is_present);
CREATE INDEX IF NOT EXISTS idx_attendance_regid ON public.session_attendance (registration_id);

-- 5. Atomic Booking Function (Stored Procedure)
-- Guarantees strict First-Come, First-Served concurrency with Row Locks (FOR UPDATE)
-- Prevents race conditions and overbooking.
CREATE OR REPLACE FUNCTION public.register_breakout_sessions(
  p_registration_id TEXT,
  p_attendee_name TEXT,
  p_attendee_email TEXT,
  p_slot1_session_id TEXT,
  p_slot2_session_id TEXT,
  p_slot3_session_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_reg_id UUID;
  v_normalized_email TEXT;
  v_s1 RECORD;
  v_s2 RECORD;
  v_s3 RECORD;
BEGIN
  -- Normalize email
  v_normalized_email := LOWER(TRIM(p_attendee_email));

  -- 1. Validate email domain
  IF v_normalized_email !~* '^[A-Za-z0-9._%+-]+@botconsulting\.io$' THEN
    RAISE EXCEPTION 'Only @botconsulting.io email addresses are permitted to register.';
  END IF;

  -- 2. Check if attendee is already registered
  IF EXISTS (SELECT 1 FROM public.registrations WHERE attendee_email = v_normalized_email) THEN
    RAISE EXCEPTION 'Attendee is already registered for breakout sessions.';
  END IF;

  -- 2b. Guard against a randomly generated registration ID colliding (API retries with a new ID)
  IF EXISTS (SELECT 1 FROM public.registrations WHERE registration_id = p_registration_id) THEN
    RAISE EXCEPTION 'Registration ID collision';
  END IF;

  -- 3. Lock rows and check capacity for all 3 sessions simultaneously
  SELECT * INTO v_s1 FROM public.sessions WHERE id = p_slot1_session_id AND slot_id = 'slot-1' FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid session selected for Slot 1.';
  END IF;
  IF v_s1.booked_seats >= v_s1.capacity THEN
    RAISE EXCEPTION 'Session "%" in Slot 1 is full. Please select an alternative session.', v_s1.title;
  END IF;

  SELECT * INTO v_s2 FROM public.sessions WHERE id = p_slot2_session_id AND slot_id = 'slot-2' FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid session selected for Slot 2.';
  END IF;
  IF v_s2.booked_seats >= v_s2.capacity THEN
    RAISE EXCEPTION 'Session "%" in Slot 2 is full. Please select an alternative session.', v_s2.title;
  END IF;

  SELECT * INTO v_s3 FROM public.sessions WHERE id = p_slot3_session_id AND slot_id = 'slot-3' FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid session selected for Slot 3.';
  END IF;
  IF v_s3.booked_seats >= v_s3.capacity THEN
    RAISE EXCEPTION 'Session "%" in Slot 3 is full. Please select an alternative session.', v_s3.title;
  END IF;

  -- 4. Atomically increment booked seats
  UPDATE public.sessions SET booked_seats = booked_seats + 1, updated_at = NOW() WHERE id = p_slot1_session_id;
  UPDATE public.sessions SET booked_seats = booked_seats + 1, updated_at = NOW() WHERE id = p_slot2_session_id;
  UPDATE public.sessions SET booked_seats = booked_seats + 1, updated_at = NOW() WHERE id = p_slot3_session_id;

  -- 5. Insert Registration Record
  INSERT INTO public.registrations (
    registration_id,
    attendee_name,
    attendee_email,
    slot_1_session_id,
    slot_2_session_id,
    slot_3_session_id
  ) VALUES (
    p_registration_id,
    TRIM(p_attendee_name),
    v_normalized_email,
    p_slot1_session_id,
    p_slot2_session_id,
    p_slot3_session_id
  ) RETURNING id INTO v_reg_id;

  -- 6. Insert pre-populated Attendance records for the 3 theatres
  INSERT INTO public.session_attendance (
    session_id, slot_id, theatre_id, registration_id, attendee_name, attendee_email
  ) VALUES
    (v_s1.id, v_s1.slot_id, v_s1.theatre_id, p_registration_id, TRIM(p_attendee_name), v_normalized_email),
    (v_s2.id, v_s2.slot_id, v_s2.theatre_id, p_registration_id, TRIM(p_attendee_name), v_normalized_email),
    (v_s3.id, v_s3.slot_id, v_s3.theatre_id, p_registration_id, TRIM(p_attendee_name), v_normalized_email);

  -- 7. Return payload
  RETURN jsonb_build_object(
    'success', true,
    'id', v_reg_id,
    'registrationId', p_registration_id,
    'attendeeName', TRIM(p_attendee_name),
    'attendeeEmail', v_normalized_email,
    'registeredAt', NOW(),
    'selections', jsonb_build_object(
      'slot1', jsonb_build_object(
        'sessionId', v_s1.id,
        'slotId', v_s1.slot_id,
        'slotTime', v_s1.slot_time,
        'theatreName', v_s1.theatre_name,
        'track', v_s1.track,
        'title', v_s1.title
      ),
      'slot2', jsonb_build_object(
        'sessionId', v_s2.id,
        'slotId', v_s2.slot_id,
        'slotTime', v_s2.slot_time,
        'theatreName', v_s2.theatre_name,
        'track', v_s2.track,
        'title', v_s2.title
      ),
      'slot3', jsonb_build_object(
        'sessionId', v_s3.id,
        'slotId', v_s3.slot_id,
        'slotTime', v_s3.slot_time,
        'theatreName', v_s3.theatre_name,
        'track', v_s3.track,
        'title', v_s3.title
      )
    )
  );
END;
$$;

-- 6. Dynamic Capacity Adjustment Procedure
CREATE OR REPLACE FUNCTION public.update_session_capacity(
  p_session_id TEXT,
  p_new_capacity INT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_session RECORD;
BEGIN
  IF p_new_capacity < 0 THEN
    RAISE EXCEPTION 'Capacity cannot be negative.';
  END IF;

  SELECT * INTO v_session FROM public.sessions WHERE id = p_session_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Session % not found.', p_session_id;
  END IF;

  IF p_new_capacity < v_session.booked_seats THEN
    RAISE EXCEPTION 'New capacity (%) cannot be less than currently booked seats (%).', p_new_capacity, v_session.booked_seats;
  END IF;

  UPDATE public.sessions
  SET capacity = p_new_capacity, updated_at = NOW()
  WHERE id = p_session_id
  RETURNING * INTO v_session;

  RETURN jsonb_build_object(
    'success', true,
    'sessionId', v_session.id,
    'capacity', v_session.capacity,
    'bookedSeats', v_session.booked_seats,
    'remainingSeats', (v_session.capacity - v_session.booked_seats),
    'isFull', (v_session.booked_seats >= v_session.capacity)
  );
END;
$$;

-- 7. Seed Data for 9 Breakout Sessions
INSERT INTO public.sessions (
  id, slot_id, slot_time, theatre_id, theatre_name, track, title, description,
  speaker_name, speaker_company, capacity, booked_seats
)
VALUES
  -- Slot 1: 3:00 – 3:45 PM
  ('slot1-theatre1', 'slot-1', '3:00 – 3:45 PM', 'theatre-1', 'UNCHARTED | Cultivate Curiosity', 'tech-aws', 'Production-Grade AgentCore: Deploying Multi-Agent Systems at Scale', 'Tech Session — AWS: Architecture and patterns for scaling multi-agent workflows in enterprise production environments.', 'Rishabh Nagar, Bhanvendra Gaur, Pankaj Phular', 'GCC: Caylent', 100, 0),
  ('slot1-theatre2', 'slot-1', '3:00 – 3:45 PM', 'theatre-2', 'NORTH STAR | Customer Success', 'partner', 'New vs Seasoned CEO -> Same Seat. Different Lens.', 'Partner Session: Leadership choices across different journeys.', 'Partner & Leadership Panel', 'BOT & Partners', 150, 0),
  ('slot1-theatre3', 'slot-1', '3:00 – 3:45 PM', 'theatre-3', 'BEDROCK | Integrity & Trust', 'tech-ai', 'Plug and Play: How AI Learned to Use Your Tools (Agentic AI + MCP)', 'Tech Session — AI: Model Context Protocol (MCP) and agentic tool integration in practice.', 'Adit Khandelwal, Harsh Dadhich', 'GCC: CFG', 120, 0),

  -- Slot 2: 3:45 – 4:30 PM
  ('slot2-theatre1', 'slot-2', '3:45 – 4:30 PM', 'theatre-1', 'UNCHARTED | Cultivate Curiosity', 'tech-data', 'Your AI Is as Smart as Your Data', 'Tech Session — Data: Data foundation, pipelines, and contextual knowledge graphs powering AI models.', 'Swasti Singhal, Kaushal, Rohit Raj Gupta', 'GCC: Hakkoda', 100, 0),
  ('slot2-theatre2', 'slot-2', '3:45 – 4:30 PM', 'theatre-2', 'NORTH STAR | Customer Success', 'partner', 'Odd Tables — Smaller groups. Sharper conversations', 'Partner Session: 10 Tables, A Partner + Leader at every table for focused discussion.', '10 Tables · Partner + Leader at every table', 'BOT & Partners', 150, 0),
  ('slot2-theatre3', 'slot-2', '3:45 – 4:30 PM', 'theatre-3', 'BEDROCK | Integrity & Trust', 'tech-salesforce', 'Headless 360: Salesforce in Your Interface?', 'Tech Session — Salesforce: Decoupling Salesforce backend from front-end customer experiences.', 'Naveen Sharma, Snehasis Hazra, Nikita Pahilwani', 'GCC: CFG', 120, 0),

  -- Slot 3: 4:30 – 5:15 PM
  ('slot3-theatre1', 'slot-3', '4:30 – 5:15 PM', 'theatre-1', 'UNCHARTED | Cultivate Curiosity', 'tech-ai-salesforce', 'Salesforce Beyond CRM', 'Tech Session — AI + Salesforce: Modern AI agent workflows and intelligent orchestration on Salesforce.', 'Rajat Khandelwal, Nitesh Soni', 'GCC: AllCloud', 100, 0),
  ('slot3-theatre2', 'slot-3', '4:30 – 5:15 PM', 'theatre-2', 'NORTH STAR | Customer Success', 'partner', 'Proof of Success with BOT -> From Vision to Value', 'Partner Session: Real GCC journeys. What worked, what changed, what’s next (Story 1: Cloudsmith, Story 2: AllCloud).', 'Cloudsmith & AllCloud', 'GCC Success Stories', 150, 0),
  ('slot3-theatre3', 'slot-3', '4:30 – 5:15 PM', 'theatre-3', 'BEDROCK | Integrity & Trust', 'consulting', 'Beyond the Ask: From Order-Taker to Tour Guide', 'Consulting Session: Elevating consulting engagements from transactional tasks to proactive strategic guidance.', 'Gaurav Verma, Nishant Khandal', 'BOT Consulting', 120, 0)
ON CONFLICT (id) DO UPDATE SET
  theatre_name = EXCLUDED.theatre_name,
  slot_time = EXCLUDED.slot_time,
  track = EXCLUDED.track,
  speaker_name = EXCLUDED.speaker_name,
  speaker_company = EXCLUDED.speaker_company,
  title = EXCLUDED.title,
  description = EXCLUDED.description;

-- 8. Volunteers Table (Theatre-Specific Authentication)
CREATE TABLE IF NOT EXISTS public.volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  assigned_theatre_id TEXT NOT NULL, -- 'theatre-1', 'theatre-2', 'theatre-3', or 'all'
  access_code TEXT NOT NULL, -- 4-digit PIN for instant on-site login
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_volunteers_email ON public.volunteers (email);

-- Pre-seed 2 Volunteers Per Theatre + 1 Admin (editable directly in Supabase table editor)
INSERT INTO public.volunteers (name, email, assigned_theatre_id, access_code) VALUES
  ('Theatre 1 Lead', 'theatre1.lead@botconsulting.io', 'theatre-1', '1001'),
  ('Theatre 1 Volunteer', 'theatre1.vol@botconsulting.io', 'theatre-1', '1002'),
  ('Theatre 2 Lead', 'theatre2.lead@botconsulting.io', 'theatre-2', '2001'),
  ('Theatre 2 Volunteer', 'theatre2.vol@botconsulting.io', 'theatre-2', '2002'),
  ('Theatre 3 Lead', 'theatre3.lead@botconsulting.io', 'theatre-3', '3001'),
  ('Theatre 3 Volunteer', 'theatre3.vol@botconsulting.io', 'theatre-3', '3002'),
  ('Summit Lead Admin', 'admin@botconsulting.io', 'all', '9999')
ON CONFLICT (email) DO NOTHING;


-- 9. Email OTP Verification (registration must verify ownership of the email first)
CREATE TABLE IF NOT EXISTS public.email_otps (
  email TEXT PRIMARY KEY,
  code_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts INT NOT NULL DEFAULT 0,
  last_sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verification_token_hash TEXT,
  verified_at TIMESTAMPTZ
);

-- 10. Fixed-window Rate Limiting (OTP sends, pass lookups, pass re-sends)
CREATE TABLE IF NOT EXISTS public.rate_limits (
  key TEXT PRIMARY KEY,
  count INT NOT NULL DEFAULT 0,
  window_start TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Returns true while the caller is within p_max hits for the current window.
CREATE OR REPLACE FUNCTION public.hit_rate_limit(
  p_key TEXT,
  p_max INT,
  p_window_seconds INT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count INT;
BEGIN
  INSERT INTO public.rate_limits (key, count, window_start)
  VALUES (p_key, 1, NOW())
  ON CONFLICT (key) DO UPDATE SET
    count = CASE
      WHEN public.rate_limits.window_start < NOW() - make_interval(secs => p_window_seconds) THEN 1
      ELSE public.rate_limits.count + 1
    END,
    window_start = CASE
      WHEN public.rate_limits.window_start < NOW() - make_interval(secs => p_window_seconds) THEN NOW()
      ELSE public.rate_limits.window_start
    END
  RETURNING count INTO v_count;

  RETURN v_count <= p_max;
END;
$$;

-- Server-only tables: enable RLS with no policies so only the secret key can access them
ALTER TABLE public.email_otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
