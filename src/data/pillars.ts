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
    body: "Customers and leaders trade the honest version of their journeys. Conversations, not presentations.",
  },
  {
    label: "Awards Night",
    title: "Awards & Recognition",
    image: "awards",
    accent: "orange",
    body: "An evening for the people whose commitment quietly held things together all year.",
  },
  {
    label: "Giving Back",
    title: "Śrī",
    image: "sri",
    accent: "teal",
    body: "Time spent on causes beyond ourselves, because success carries a responsibility to pass something on.",
  },
  {
    label: "After Hours",
    title: "Evenings in Jaipur",
    image: "evening",
    accent: "orange",
    body: "Music, local traditions and long shared meals — usually the part people still talk about.",
  },
  {
    label: "The In-Between",
    title: "Conversations Between Sessions",
    image: "groupPhoto",
    accent: "cyan",
    body: "The best conversations start at breakfast and finish long after dinner. We leave room.",
  },
];

/**
 * The four photo-only tiles of the mosaic, interleaved between the five pillars above.
 * Atmosphere rather than argument: they carry no copy, so they are chosen for what they
 * show of the place. `dancers` sits next to Evenings in Jaipur on purpose.
 */
export const pillarFillers = [
  "arrival",
  "ananta",
  "wellness",
  "dancers",
] satisfies (keyof typeof gallery)[];
