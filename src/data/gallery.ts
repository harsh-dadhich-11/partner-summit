import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Photography from Odyssey 2025. Drop the files into `public/assets/` using the
 * names below and they appear — no code change needed. Anything not yet supplied
 * resolves to `src: null` and its component renders a colour field instead of a
 * broken image, so the site is never mid-redesign in public.
 *
 * Server-only: `existsSync` runs at module load, so never import this from a
 * "use client" component.
 *
 * Every file here is landscape 3:2. Frames are sized to match — anything taller
 * than 4:3 crops the composition hard.
 */
type Shot = { src: string | null; alt: string };

/** First path that actually exists wins; null if none do. */
const resolve = (files: string | string[], alt: string): Shot => {
  const found = (Array.isArray(files) ? files : [files])
    .map((file) => `/assets/${file}`)
    .find((src) => existsSync(join(process.cwd(), "public", src)));
  return { src: found ?? null, alt };
};

export const gallery = {
  /**
   * The hero video's poster — the previous poster path pointed at a file that was never
   * committed, so autoplay-blocked visitors got a blank hero. Falls back to the highlights
   * thumbnail, which is already in the repo and is a real frame from the 2025 film.
   */
  heroStill: resolve(
    ["hero-still.jpg", "highlights-thumb.jpg"],
    "Odyssey 2025 at Ananta Spa & Resort, Jaipur"
  ),
  /** Landscape. The sticky image in EventExperience. */
  ananta: resolve("ananta.jpg", "Ananta Spa & Resort, Jaipur"),
  /** Landscape. Unused — the only shot not currently placed anywhere. */
  jaipur: resolve("jaipur.jpg", "Jaipur"),
  /** Landscape. */
  sessions: resolve("sessions.jpg", "Customers and partners in conversation at Odyssey 2025"),
  /** Landscape, warm low light. */
  awards: resolve("awards.jpg", "Awards night at Odyssey 2025"),
  /** Landscape. */
  sri: resolve("sri.jpg", "The Śrī giving-back initiative at Odyssey 2025"),
  /** Landscape. */
  evening: resolve("evening.jpg", "Cultural night at Odyssey 2025"),
  /** Landscape. */
  families: resolve("families.jpg", "Families at Odyssey 2025"),
} satisfies Record<string, Shot>;
