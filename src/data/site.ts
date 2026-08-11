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
