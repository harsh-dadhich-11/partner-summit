import type { IconName } from "@/components/ui/Icon";

export type Pillar = {
  title: string;
  /** Short eyebrow above the title — a real category, not a card number. */
  label: string;
  body: string;
  accent: "cyan" | "orange" | "teal";
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
