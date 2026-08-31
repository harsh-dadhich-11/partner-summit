import type { ReliveItem } from "@/types";

/**
 * The 2025 archive, in the order it folds past. Roughly chronological — arrival, the
 * daytime programme, then the evenings — so scrolling through it retraces the three days
 * rather than shuffling them.
 *
 * Titles and categories are drawn from the alt text already recorded in gallery.ts; the
 * left label names the moment, the right label says what kind of moment it was.
 */
export const reliveItems: ReliveItem[] = [
  { image: "relive1", title: "Odyssey 2025", category: "Opening", kind: "image" },
  { image: "relive2", title: "Arrival", category: "Day One", kind: "image" },
  { image: "relive3", title: "In Conversation", category: "Sessions", kind: "image" },
  { image: "relive4", title: "On Stage", category: "Keynote", kind: "image" },
  { image: "relive5", title: "The Evening", category: "Celebration", kind: "image" },
  { image: "relive6", title: "Cultural Night", category: "After Hours", kind: "image" },
  { image: "relive7", title: "Delegates", category: "Portraits", kind: "image" },
  { image: "relive8", title: "Together", category: "Group", kind: "image" },
];

/*
  TODO: the fold renders video tiles — muted, looping, playing only while near the centre —
  but there is no 2025 clip in the repo to point one at. `hero.mp4` is the only video here
  and it is the 41MB background reel, which is the wrong thing in a strip of stills.

  Trim two or three short clips out of the 2025 footage, drop them in public/assets, and
  add entries in this shape. `image` stays a gallery key so the tile has a poster to draw
  while the clip loads; `href` is what the PLAY label opens.

    import { HIGHLIGHTS_HREF } from "@/data/site";

    {
      image: "relive1",
      title: "Highlights",
      category: "The Film",
      kind: "video",
      video: "/assets/relive-highlights.mp4",
      href: HIGHLIGHTS_HREF,
    },
*/
