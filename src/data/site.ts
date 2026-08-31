export const SUMMIT_EMAIL = "partnersummit@botconsulting.io";

const compose = (subject: string, body = "") =>
  `mailto:${SUMMIT_EMAIL}?subject=${encodeURIComponent(subject)}` +
  (body ? `&body=${encodeURIComponent(body)}` : "");

/** Opens a pre-filled mail draft. Swap for a form URL when one exists. */
export const UPDATES_HREF = compose("Odyssey 2026 — Send me updates");

/** 2025 highlights reel. Thumbnail is the video's own poster frame, saved locally. */
export const HIGHLIGHTS_HREF = "https://youtu.be/syTyRfLr084";
export const HIGHLIGHTS_THUMB = "/assets/highlights-thumb.jpg";

/**
 * The concrete facts, stated once. A page that never says anything specific reads as
 * generated no matter how it is styled — these are the specifics.
 *
 * Every entry here is verifiable from the FAQ copy. Attendance figures from 2025
 * (how many partners, how many countries) would be stronger still, but they are not
 * recorded anywhere in this repo and are not something to guess at on a partner-facing
 * page — add them here once confirmed and they render automatically.
 */
export const SUMMIT_FACTS = [
  { label: "Dates", value: "23–25 Oct 2026" },
  { label: "Duration", value: "Three days" },
  { label: "Venue", value: "Ananta Spa & Resort, Jaipur" },
];

/**
 * The scale of the thing, in four numbers. This is the answer to the question the rest
 * of the home page talks around — the copy is all atmosphere, and atmosphere without a
 * figure attached reads as brochure filler.
 *
 * `accent` alternates cyan/orange down the row; it is a rhythm, not a meaning, so a fifth
 * entry should carry on the alternation rather than pick a colour.
 */
export const SUMMIT_STATS = [
  {
    value: "9",
    note: "Breakout sessions across our ecosystems, AI and industries",
    accent: "cyan",
  },
  { value: "15+", note: "Guests and industry leaders", accent: "orange" },
  {
    value: "4+",
    note: "Keynotes and panels across business, technology and leadership",
    accent: "cyan",
  },
  { value: "300+", note: "Attendees from across the globe", accent: "orange" },
] as const;

/**
 * TODO: point at the real registration form once one exists. Every other CTA on the site
 * is either a route or a mailto; this is deliberately neither until the flow is decided,
 * so the button ships styled and positioned without pretending to work.
 */
export const REGISTER_HREF = "#";
