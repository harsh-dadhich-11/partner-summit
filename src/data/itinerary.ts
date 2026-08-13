import type { ItineraryAudience, ItineraryCategory, ItineraryDay } from "@/types";

/**
 * Category carries colour on each card's icon tile — the second axis after the day columns.
 *
 * Class strings are written out in full rather than composed from the key: Tailwind scans
 * source text, so `bg-${category}` would compile to nothing. Every colour here is a
 * project token — the default palette fails lint (see eslint.config.mjs).
 */
export const ITINERARY_CATEGORIES: Record<
  ItineraryCategory,
  { label: string; tile: string }
> = {
  sessions: { label: "Sessions", tile: "bg-cyan-bright/12 text-teal-base" },
  meals: { label: "Meals", tile: "bg-gold/15 text-gold" },
  social: { label: "Social", tile: "bg-orange-bright/12 text-orange-deep" },
  wellness: { label: "Wellness", tile: "bg-teal-mid/12 text-teal-mid" },
  community: { label: "Giving back", tile: "bg-orange-soft/20 text-orange-deep" },
  travel: { label: "Travel & stay", tile: "bg-muted/12 text-muted" },
};

/**
 * The filter above the columns. Order matters — it is the order of the pills.
 *
 * NOTE: the per-entry `audience` values below are a first pass, inferred from each
 * entry's name. Nothing in this repo records who is actually invited to what, so they
 * need a read-through by someone who knows the plan before this page goes out.
 */
export const ITINERARY_AUDIENCES: Record<ItineraryAudience, string> = {
  everyone: "Everyone",
  "bot-team": "BOT Team",
  "founders-cab": "Founders, CAB",
  "kids-families": "Kids & Families",
};

export const itineraryDays: ItineraryDay[] = [
  {
    label: "Day 1",
    date: "October 23, Friday",
    entries: [
      {
        time: "10:00 – 12:00",
        label: "Travel to Resort",
        category: "travel",
        description: "Group travel from Jaipur to Ananta Spa & Resort",
        audience: "everyone",
        icon: "pin",
      },
      {
        time: "12:00 – 13:00",
        label: "Check-In",
        category: "travel",
        description: "Hotel check-in and room assignments",
        audience: "everyone",
        icon: "luggage",
      },
      {
        time: "12:15 – 14:15",
        label: "Lunch",
        category: "meals",
        description: "Buffet lunch as guests arrive",
        audience: "everyone",
        icon: "meal",
      },
      {
        time: "14:30 – 15:00",
        label: "Keynote",
        category: "sessions",
        description: "The year ahead, set out by the leadership team",
        audience: "everyone",
        icon: "session",
      },
      {
        time: "15:00 – 16:00",
        label: "Odyssey Demo",
        category: "sessions",
        description: "A walkthrough of where the platform stands today",
        audience: "bot-team",
        icon: "session",
      },
      {
        time: "16:00 – 17:00",
        label: "Fireside Chat",
        category: "sessions",
        description: "Founders and CAB members in open conversation",
        audience: "founders-cab",
        icon: "users",
      },
      {
        time: "17:00 – 17:30",
        label: "High Tea",
        category: "meals",
        description: "Tea and refreshments on the lawn",
        audience: "everyone",
        icon: "meal",
      },
      {
        time: "17:30 – 18:30",
        label: "FunBug Friday",
        category: "social",
        description: "The team's own end-of-week ritual, on the road",
        audience: "bot-team",
        icon: "users",
      },
      {
        time: "19:30 – 22:30",
        label: "Dinner & Cocktails",
        category: "social",
        description: "Dinner and drinks under the Jaipur sky",
        audience: "everyone",
        icon: "meal",
      },
    ],
  },
  {
    label: "Day 2",
    date: "October 24, Saturday",
    entries: [
      {
        time: "07:00 – 08:00",
        label: "Wellness Session",
        category: "wellness",
        description: "Morning yoga and meditation on the lawn",
        audience: "everyone",
        icon: "leaf",
      },
      {
        time: "08:00 – 10:00",
        label: "Breakfast",
        category: "meals",
        description: "Breakfast served at the resort",
        audience: "everyone",
        icon: "meal",
      },
      {
        time: "10:30 – 12:30",
        label: "Breakout Sessions / Kids Event",
        category: "sessions",
        description: "Parallel tracks for the team, with a separate programme for children",
        audience: "kids-families",
        icon: "session",
      },
      {
        time: "12:30 – 14:00",
        label: "Lunch",
        category: "meals",
        description: "Lunch between the morning and afternoon tracks",
        audience: "everyone",
        icon: "meal",
      },
      {
        time: "14:15 – 15:45",
        label: "Breakout Sessions",
        category: "sessions",
        description: "Afternoon tracks continue",
        audience: "bot-team",
        icon: "session",
      },
      {
        time: "16:00 – 17:30",
        label: "Śrī Event",
        category: "community",
        description: "The Śrī giving-back initiative",
        audience: "everyone",
        icon: "heart",
      },
      {
        time: "17:30 – 18:00",
        label: "High Tea",
        category: "meals",
        description: "Tea before the evening programme",
        audience: "everyone",
        icon: "meal",
      },
      {
        time: "19:30 – 22:30",
        label: "Dinner & Cultural Night",
        category: "social",
        description: "Dinner with Rajasthani music and dance",
        audience: "everyone",
        icon: "users",
      },
    ],
  },
  {
    label: "Day 3",
    date: "October 25, Sunday",
    entries: [
      {
        time: "08:00 – 10:00",
        label: "Breakfast & Check-out",
        category: "travel",
        description: "Final breakfast together, then hotel check-out",
        audience: "everyone",
        icon: "meal",
      },
      {
        time: "12:00 – 14:00",
        label: "Travel Back",
        category: "travel",
        description: "Departure transfers for the journey home",
        audience: "everyone",
        icon: "pin",
      },
    ],
  },
];
