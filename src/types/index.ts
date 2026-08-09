import type { IconName } from "@/components/ui/Icon";

export type Pillar = {
  title: string;
  /** Short eyebrow above the title — a real category, not a card number. */
  label: string;
  body: string;
  accent: "cyan" | "orange" | "teal";
};

export type ItineraryEntry = {
  time: string;
  label: string;
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
