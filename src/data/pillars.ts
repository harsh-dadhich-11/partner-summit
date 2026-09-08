import type { Pillar } from "@/types";
import type { gallery } from "@/data/gallery";

/**
 * Five, not six, and the count is load-bearing. The mosaic interleaves these with
 * `pillarFillers` below into one flat alternating array, which lands the text tiles on the
 * four corners plus the centre of a 3x3 — so five content tiles against four photos is the
 * only split that fills the checkerboard exactly.
 *
 * `accent` therefore reads as a position: cyan / orange on the corners around a single teal
 * centre, which is Śrī.
 */
export const pillars: Pillar[] = [
  {
    label: "Sessions",
    title: "Customer Stories & Leadership Sessions",
    image: "sessions",
    accent: "cyan",
    body: "Open panel discussions and candid fireside chats where industry leaders share real-world insights and practical lessons.",
  },
  {
    label: "Awards Night",
    title: "Awards & Recognition",
    image: "awards",
    accent: "orange",
    body: "Celebrating the standout individuals and teams whose dedication has driven our shared success over the past year.",
  },
  {
    label: "Giving Back",
    title: "Śrī",
    image: "sri",
    accent: "teal",
    body: "Time spent together to support community initiatives and create a lasting positive impact beyond the Summit.",
  },
  {
    label: "After Hours",
    title: "Evenings in Jaipur",
    image: "evening",
    accent: "orange",
    body: "Unwinding through vibrant cultural performances, music, and shared meals — the true heart of the summit.",
  },
  {
    label: "The In-Between",
    title: "Conversations Between Sessions",
    image: "groupPhoto",
    accent: "cyan",
    body: "No slide decks or heavy agendas — just genuine conversations that start over morning coffee and carry on long into the evening.",
  },
];

/**
 * The four photo-only tiles of the mosaic, interleaved between the five pillars above.
 * Atmosphere rather than argument: they carry no copy, so they are chosen for what they
 * show of the place. `dancers` sits next to Evenings in Jaipur on purpose.
 */
export const pillarFillers = [
  "exp2",
  "ananta",
  "exp6",
  "exp8",
] satisfies (keyof typeof gallery)[];
