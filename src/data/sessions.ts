import type { Session, SessionTrack } from "@/types";

/**
 * Track chrome, in the shape ITINERARY_CATEGORIES already established: a label to print
 * and the tile classes that colour it. Keeping the two files structurally identical means
 * a reader who has seen one can skim the other.
 */
export const SESSION_TRACKS: Record<SessionTrack, { label: string; tile: string }> = {
  "tech-aws": { label: "Tech Session · AWS", tile: "bg-orange-bright/12 text-orange-deep" },
  "tech-ai": { label: "Tech Session · AI", tile: "bg-cyan-bright/12 text-teal-base" },
  "tech-data": { label: "Tech Session · Data", tile: "bg-teal-mid/12 text-teal-mid" },
  "tech-salesforce": { label: "Tech Session · Salesforce", tile: "bg-cyan-bright/12 text-teal-base" },
  "tech-ai-salesforce": { label: "Tech Session · AI + Salesforce", tile: "bg-orange-bright/12 text-orange-deep" },
  partner: { label: "Partner Session", tile: "bg-gold/15 text-gold" },
  consulting: { label: "Consulting Session", tile: "bg-teal-dark/10 text-teal-dark" },
  ecosystems: { label: "Ecosystems", tile: "bg-cyan-bright/12 text-teal-base" },
  ai: { label: "AI", tile: "bg-orange-bright/12 text-orange-deep" },
  industries: { label: "Industries", tile: "bg-teal-mid/12 text-teal-mid" },
};

/**
  * The nine Day 1 breakouts: three 45-minute slots × three parallel tracks.
  *
  * Slots and rooms correspond to:
  * - Theatre 1 — UNCHARTED | Cultivate Curiosity
  * - Theatre 2 — NORTH STAR | Customer Success
  * - Theatre 3 — BEDROCK | Integrity & Trust
  */
export const sessions: Session[] = [
  /* ---- 3:00 – 3:45 PM (Slot 1) ---- */
  {
    slot: "3:00 – 3:45 PM",
    track: "tech-aws",
    title: "Production-Grade AgentCore: Deploying Multi-Agent Systems at Scale",
    description: "Tech Session — AWS: Architecture and patterns for scaling multi-agent workflows in enterprise production environments.",
    room: "Theatre 1 — UNCHARTED | Cultivate Curiosity",
    speaker: "Rishabh Nagar, Bhanvendra Gaur, Pankaj Phular",
    speakerCompany: "GCC: Caylent",
  },
  {
    slot: "3:00 – 3:45 PM",
    track: "partner",
    title: "New vs Seasoned CEO -> Same Seat. Different Lens.",
    description: "Partner Session: Leadership choices across different journeys.",
    room: "Theatre 2 — NORTH STAR | Customer Success",
    speaker: "Partner & Leadership Panel",
    speakerCompany: "BOT & Partners",
  },
  {
    slot: "3:00 – 3:45 PM",
    track: "tech-ai",
    title: "Plug and Play: How AI Learned to Use Your Tools (Agentic AI + MCP)",
    description: "Tech Session — AI: Model Context Protocol (MCP) and agentic tool integration in practice.",
    room: "Theatre 3 — BEDROCK | Integrity & Trust",
    speaker: "Adit Khandelwal, Harsh Dadhich",
    speakerCompany: "GCC: CFG",
  },

  /* ---- 3:45 – 4:30 PM (Slot 2) ---- */
  {
    slot: "3:45 – 4:30 PM",
    track: "tech-data",
    title: "Your AI Is as Smart as Your Data",
    description: "Tech Session — Data: Data foundation, pipelines, and contextual knowledge graphs powering AI models.",
    room: "Theatre 1 — UNCHARTED | Cultivate Curiosity",
    speaker: "Swasti Singhal, Kaushal, Rohit Raj Gupta",
    speakerCompany: "GCC: Hakkoda",
  },
  {
    slot: "3:45 – 4:30 PM",
    track: "partner",
    title: "Odd Tables — Smaller groups. Sharper conversations",
    description: "Partner Session: 10 Tables, A Partner + Leader at every table for focused discussion.",
    room: "Theatre 2 — NORTH STAR | Customer Success",
    speaker: "10 Tables · Partner + Leader at every table",
    speakerCompany: "BOT & Partners",
  },
  {
    slot: "3:45 – 4:30 PM",
    track: "tech-salesforce",
    title: "Headless 360: Salesforce in Your Interface?",
    description: "Tech Session — Salesforce: Decoupling Salesforce backend from front-end customer experiences.",
    room: "Theatre 3 — BEDROCK | Integrity & Trust",
    speaker: "Naveen Sharma, Snehasis Hazra, Nikita Pahilwani",
    speakerCompany: "GCC: CFG",
  },

  /* ---- 4:30 – 5:15 PM (Slot 3) ---- */
  {
    slot: "4:30 – 5:15 PM",
    track: "tech-ai-salesforce",
    title: "Salesforce Beyond CRM",
    description: "Tech Session — AI + Salesforce: Modern AI agent workflows and intelligent orchestration on Salesforce.",
    room: "Theatre 1 — UNCHARTED | Cultivate Curiosity",
    speaker: "Rajat Khandelwal, Nitesh Soni",
    speakerCompany: "GCC: AllCloud",
  },
  {
    slot: "4:30 – 5:15 PM",
    track: "partner",
    title: "Proof of Success with BOT -> From Vision to Value",
    description: "Partner Session: Real GCC journeys. What worked, what changed, what’s next (Story 1: Cloudsmith, Story 2: AllCloud).",
    room: "Theatre 2 — NORTH STAR | Customer Success",
    speaker: "Cloudsmith & AllCloud",
    speakerCompany: "GCC Success Stories",
  },
  {
    slot: "4:30 – 5:15 PM",
    track: "consulting",
    title: "Beyond the Ask: From Order-Taker to Tour Guide",
    description: "Consulting Session: Elevating consulting engagements from transactional tasks to proactive strategic guidance.",
    room: "Theatre 3 — BEDROCK | Integrity & Trust",
    speaker: "Gaurav Verma, Nishant Khandal",
    speakerCompany: "BOT Consulting",
  },
];

/**
 * Grouped by slot rather than by track, because the question a reader actually arrives
 * with is "which one do I go to at 15:00?" — not "what is the AI track doing all day".
 * Derived rather than hand-maintained so the array above stays the single source.
 */
export const sessionSlots = sessions.reduce<{ slot: string; sessions: Session[] }[]>(
  (slots, session) => {
    const existing = slots.find((group) => group.slot === session.slot);
    if (existing) existing.sessions.push(session);
    else slots.push({ slot: session.slot, sessions: [session] });
    return slots;
  },
  []
);
