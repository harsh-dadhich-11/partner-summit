import type { Session, SessionTrack } from "@/types";

/**
 * Track chrome, in the shape ITINERARY_CATEGORIES already established: a label to print
 * and the tile classes that colour it. Keeping the two files structurally identical means
 * a reader who has seen one can skim the other.
 */
export const SESSION_TRACKS: Record<SessionTrack, { label: string; tile: string }> = {
  ecosystems: { label: "Ecosystems", tile: "bg-cyan-bright/12 text-teal-base" },
  ai: { label: "AI", tile: "bg-orange-bright/12 text-orange-deep" },
  industries: { label: "Industries", tile: "bg-teal-mid/12 text-teal-mid" },
};

/**
 * The nine Day 1 breakouts: three 40-minute slots × three parallel tracks.
 *
 * Slots and rooms are real — they come straight from the three "Breakout Sessions"
 * entries in `itinerary.ts`, which describe "three parallel tracks running across
 * Theatres 1, 2 and 3". Track names come from the summit's own framing.
 *
 * TODO: every `title` and `description` below is a placeholder and says so on the page.
 * Replace them as the programme is confirmed — nothing else needs to change, the page
 * groups and renders off this array.
 */
export const sessions: Session[] = [
  /* ---- 15:10 – 15:45 ---- */
  {
    slot: "15:10 – 15:45",
    track: "ecosystems",
    title: "Ecosystems Track",
    room: "Sakura · Theatre 1",
    speaker: "Chris Barbin",
    speakerRole: "Founder & CEO",
    speakerCompany: "Tercera",
  },
  {
    slot: "15:10 – 15:45",
    track: "ai",
    title: "AI Track",
    room: "Sakura · Theatre 2",
    speaker: "Glenn Weinstein",
    speakerRole: "CEO",
    speakerCompany: "Cloudsmith",
  },
  {
    slot: "15:10 – 15:45",
    track: "industries",
    title: "Industries Track",
    room: "Sakura · Theatre 3",
    speaker: "Gurvendra Suri",
    speakerRole: "Tailwind Operating Executive",
    speakerCompany: "Tailwind Capital",
  },

  /* ---- 15:55 – 16:30 ---- */
  {
    slot: "15:55 – 16:30",
    track: "ecosystems",
    title: "Ecosystems Track",
    room: "Sakura · Theatre 1",
    speaker: "Eran Gil",
    speakerRole: "CEO",
    speakerCompany: "AllCloud",
  },
  {
    slot: "15:55 – 16:30",
    track: "ai",
    title: "AI Track",
    room: "Sakura · Theatre 2",
    speaker: "Sanjay Gidwani",
    speakerRole: "Founder & CEO",
    speakerCompany: "KOSMOS",
  },
  {
    slot: "15:55 – 16:30",
    track: "industries",
    title: "Industries Track",
    room: "Sakura · Theatre 3",
    speaker: "Justin Schneiderman",
    speakerRole: "Vice President",
    speakerCompany: "Tailwind Capital",
  },

  /* ---- 16:40 – 17:15 ---- */
  {
    slot: "16:40 – 17:15",
    track: "ecosystems",
    title: "Ecosystems Track",
    room: "Sakura · Theatre 1",
    speaker: "Lisa Burton",
    speakerRole: "Partner & COO",
    speakerCompany: "Tercera",
  },
  {
    slot: "16:40 – 17:15",
    track: "ai",
    title: "AI Track",
    room: "Sakura · Theatre 2",
    speaker: "William Sun",
    speakerRole: "Co-Founder & CEO",
    speakerCompany: "Auctor",
  },
  {
    slot: "16:40 – 17:15",
    track: "industries",
    title: "Industries Track",
    room: "Sakura · Theatre 3",
    speaker: "William Fleder",
    speakerRole: "Partner",
    speakerCompany: "Tailwind Capital",
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
