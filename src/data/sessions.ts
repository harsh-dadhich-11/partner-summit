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
  /* ---- 15:00 – 15:40 ---- */
  {
    slot: "15:00 – 15:40",
    track: "ecosystems",
    title: "Ecosystems track — session to be confirmed",
    description:
      "The first of three ecosystem sessions. Topic and speaker are being finalised and will be published here as soon as they are.",
    room: "Sakura · Theatre 1",
  },
  {
    slot: "15:00 – 15:40",
    track: "ai",
    title: "AI track — session to be confirmed",
    description:
      "The first of three AI sessions. Topic and speaker are being finalised and will be published here as soon as they are.",
    room: "Sakura · Theatre 2",
  },
  {
    slot: "15:00 – 15:40",
    track: "industries",
    title: "Industries track — session to be confirmed",
    description:
      "The first of three industry sessions. Topic and speaker are being finalised and will be published here as soon as they are.",
    room: "Sakura · Theatre 3",
  },

  /* ---- 15:40 – 16:20 ---- */
  {
    slot: "15:40 – 16:20",
    track: "ecosystems",
    title: "Ecosystems track — session to be confirmed",
    description:
      "The second ecosystem session of the afternoon. Topic and speaker are being finalised.",
    room: "Sakura · Theatre 1",
  },
  {
    slot: "15:40 – 16:20",
    track: "ai",
    title: "AI track — session to be confirmed",
    description: "The second AI session of the afternoon. Topic and speaker are being finalised.",
    room: "Sakura · Theatre 2",
  },
  {
    slot: "15:40 – 16:20",
    track: "industries",
    title: "Industries track — session to be confirmed",
    description:
      "The second industry session of the afternoon. Topic and speaker are being finalised.",
    room: "Sakura · Theatre 3",
  },

  /* ---- 16:20 – 17:00 ---- */
  {
    slot: "16:20 – 17:00",
    track: "ecosystems",
    title: "Ecosystems track — session to be confirmed",
    description: "The closing ecosystem session. Topic and speaker are being finalised.",
    room: "Sakura · Theatre 1",
  },
  {
    slot: "16:20 – 17:00",
    track: "ai",
    title: "AI track — session to be confirmed",
    description: "The closing AI session. Topic and speaker are being finalised.",
    room: "Sakura · Theatre 2",
  },
  {
    slot: "16:20 – 17:00",
    track: "industries",
    title: "Industries track — session to be confirmed",
    description: "The closing industry session. Topic and speaker are being finalised.",
    room: "Sakura · Theatre 3",
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
