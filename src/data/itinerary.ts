import type { ItineraryDay } from "@/types";

export const itineraryDays: ItineraryDay[] = [
  {
    label: "Day One",
    date: "Friday 23 October",
    entries: [
      { time: "10:00–12:00", label: "Travel to Resort" },
      { time: "12:00–13:00", label: "Check-In" },
      { time: "12:15–14:15", label: "Lunch" },
      { time: "14:30–15:00", label: "Keynote" },
      { time: "15:00–16:00", label: "Odyssey Demo" },
      { time: "16:00–17:00", label: "Fireside Chat" },
      { time: "17:00–17:30", label: "High Tea" },
      { time: "17:30–18:30", label: "FunBug Friday" },
      { time: "19:30–22:30", label: "Dinner & Cocktails" },
    ],
  },
  {
    label: "Day Two",
    date: "Saturday 24 October",
    entries: [
      { time: "07:00–08:00", label: "Wellness Session" },
      { time: "08:00–10:00", label: "Breakfast" },
      { time: "10:30–12:30", label: "Breakout Sessions / Kids Event" },
      { time: "12:30–14:00", label: "Lunch" },
      { time: "14:15–15:45", label: "Breakout Sessions" },
      { time: "16:00–17:30", label: "Śrī Event" },
      { time: "17:30–18:00", label: "High Tea" },
      { time: "19:30–22:30", label: "Dinner & Cultural Night" },
    ],
  },
  {
    label: "Day Three",
    date: "Sunday 25 October",
    entries: [
      { time: "08:00–10:00", label: "Breakfast & Check-out" },
      { time: "12:00–14:00", label: "Travel Back" },
    ],
  },
];
