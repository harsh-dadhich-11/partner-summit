import type { IconName } from "@/components/ui/Icon";

export type Pillar = {
  title: string;
  /** Short eyebrow above the title — a real category, not a card number. */
  label: string;
  body: string;
  accent: "cyan" | "orange" | "teal";
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
  | "community";

/** Who an entry is for. Drives the filter above the three columns. */
export type ItineraryAudience = "everyone" | "bot-team" | "founders-cab" | "kids-families";

export type ItineraryEntry = {
  time: string;
  label: string;
  category: ItineraryCategory;
  /** One line on what actually happens. */
  description: string;
  audience: ItineraryAudience;
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
