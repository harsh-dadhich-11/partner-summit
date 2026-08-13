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
   *
   * `hero-poster.jpg` comes first and is the one that should be there: `poster` is a bare
   * HTML attribute, so next/image never sees it and whatever file this resolves to is
   * served at full size. hero-still.jpg is the 6000px master and was costing 19MB.
   */
  heroStill: resolve(
    ["hero-poster.jpg", "hero-still.jpg", "highlights-thumb.jpg"],
    "Odyssey 2025 at Ananta Spa & Resort, Jaipur"
  ),
  /** Landscape. The sticky image in EventExperience. */
  ananta: resolve("ananta.jpg", "Ananta Spa & Resort, Jaipur"),
  /** Landscape. */
  jaipur: resolve("jaipur.jpg", "A carriage ride through Jaipur at Odyssey 2025"),
  /** Landscape. */
  sessions: resolve("sessions.jpg", "Customers and partners in conversation at Odyssey 2025"),
  /** Landscape. */
  sri: resolve("sri.jpg", "The Śrī giving-back initiative at Odyssey 2025"),
  /** Landscape. */
  evening: resolve("evening.jpg", "Cultural night at Odyssey 2025"),
  /** Landscape. */
  families: resolve("families.jpg", "Families at Odyssey 2025"),

  /* ---- The rest of the grid. Downscaled to 2400px out of images-retreat/, where the
          camera originals still live at 10-30MB each if a bigger crop is ever needed. ---- */
  /** Landscape. */
  groupPhoto: resolve("group-photo.jpg", "The Odyssey 2025 delegation outside Ananta Spa & Resort"),
  /** Landscape. */
  arrival: resolve("arrival.jpg", "A traditional Rajasthani welcome at the resort entrance"),
  /** Landscape. */
  panel: resolve("panel.jpg", "The Leadership Insight panel on stage at Odyssey 2025"),
  /** Landscape. */
  wellness: resolve("wellness.jpg", "The morning wellness session on the lawn at Odyssey 2025"),
  /** Landscape. */
  dancers: resolve("dancers.jpg", "Rajasthani folk dancers at the Odyssey 2025 cultural night"),
  /** Landscape. */
  ceremony: resolve("ceremony.jpg", "The opening lamp-lighting ceremony at Odyssey 2025"),
  /** Landscape. */
  celebration: resolve("celebration.jpg", "Guests applauding at the Odyssey 2025 evening celebration"),
} satisfies Record<string, Shot>;
