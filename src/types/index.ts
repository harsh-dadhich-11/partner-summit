import type { IconName } from "@/components/ui/Icon";
import type { gallery } from "@/data/gallery";

export type Pillar = {
  title: string;
  /** Short eyebrow above the title — a real category, not a card number. */
  label: string;
  body: string;
  accent: "cyan" | "orange" | "teal";
  /**
   * Key into `gallery`, not a path: gallery.ts hits the filesystem, so the shot is resolved
   * where the section is assembled and the tile receives it already resolved.
   */
  image: keyof typeof gallery;
};

/**
 * One tile in the Relive'25 fold. Same `keyof typeof gallery` contract as Pillar: the
 * shot is resolved server-side and handed down, because gallery.ts hits the filesystem.
 *
 * `kind` is what the tile renders, not what it depicts — a video tile still needs an
 * `image` for its poster frame, so the fold has something to draw before the clip decodes.
 */
export type ReliveItem = {
  image: keyof typeof gallery;
  /** Large label at the left edge of the stage. */
  title: string;
  /** Small label at the right edge — the kind of moment, not a caption. */
  category: string;
  kind: "image" | "video";
  /** Required when `kind` is "video". A path under /assets, not a gallery key: clips are
   *  too few to be worth a resolver, and a missing one would fail loudly rather than
   *  quietly degrading the way a missing photo does. */
  video?: string;
  /** Click target. Only video tiles carry one — a still has nowhere of its own to go. */
  href?: string;
};

/**
 * The three parallel tracks the Day 1 breakouts run across — one per theatre.
 * Named from the summit's own framing: "across our ecosystems, AI and industries".
 */
export type SessionTrack = "ecosystems" | "ai" | "industries";

export type Session = {
  /** Matches the en-dash format of ItineraryEntry.time, so the two pages agree. */
  slot: string;
  track: SessionTrack;
  title: string;
  description: string;
  /** Which theatre in Sakura to actually walk to. */
  room: string;
  /** Omitted until a name is confirmed; the card drops the line rather than guessing. */
  speaker?: string;
};

export type Speaker = {
  name: string;
  /** Job title as it should read on the card. */
  role: string;
  company: string;
  /** Null renders Photo's teal placeholder, so a speaker can be listed before their headshot lands. */
  photo: string | null;
  /** Empty until a profile URL is pasted in; the card hides the icon rather than linking nowhere. */
  linkedin: string;
};

/**
 * What kind of thing an entry is, rather than when it happens. The three days are
 * differentiated by column; this is the second axis, carried by colour.
 */
export type ItineraryCategory =
  | "travel"
  | "meals"
  | "sessions"
  | "social"
  | "wellness"
  | "community"
  /** Its own thing: a 15-minute pause is neither a meal nor a session. */
  | "break";

/** Who an entry is for. Drives the filter above the three columns. */
export type ItineraryAudience = "everyone" | "bot-team" | "kids-families";

export type ItineraryEntry = {
  time: string;
  label: string;
  category: ItineraryCategory;
  /** One line on what actually happens. */
  description: string;
  audience: ItineraryAudience;
  /** Where at Ananta to actually walk to — Sakura's theatres, a lawn, the restaurant. */
  location: string;
  /** Chosen per entry, not per category: a check-out is travel but reads as luggage. */
  icon: IconName;
};

export type ItineraryDay = {
  /** Split from the old single "Day 1 · Oct 23 (Fri)" string so each part can be set differently. */
  label: string;
  date: string;
  entries: ItineraryEntry[];
};

export type FaqAnswer = {
  label?: string;
  text: string;
  href?: string;
};

export type FaqQuestion = {
  question: string;
  answers: FaqAnswer[];
  layout?: "cols";
};

export type FaqCategory = {
  icon: IconName;
  title: string;
  questions: FaqQuestion[];
};
