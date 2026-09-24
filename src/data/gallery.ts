import { existsSync } from "node:fs";
import { join } from "node:path";

type Shot = { src: string | null; alt: string };

const resolve = (files: string | string[], alt: string): Shot => {
  const found = (Array.isArray(files) ? files : [files])
    .map((file) => `/assets/${file}`)
    .find((src) => existsSync(join(process.cwd(), "public", src)));
  return { src: found ?? null, alt };
};

export const gallery = {
  heroStill: resolve(
    "hero-poster.webp",
    "Odyssey 2025 at Ananta Spa & Resort, Jaipur"
  ),
  /** Landscape. The sticky image in EventExperience. */
  ananta: resolve("ananta.webp", "Ananta Spa & Resort, Jaipur"),
  /** Landscape. */
  jaipur: resolve("jaipur.webp", "A carriage ride through Jaipur at Odyssey 2025"),
  /** Landscape. */
  sessions: resolve("sessions.webp", "Customers and partners in conversation at Odyssey 2025"),
  /** Landscape. */
  sri: resolve("sri1.webp", "The Śrī giving-back initiative at Odyssey 2025"),
  /** Landscape. */
  evening: resolve("evening.webp", "Cultural night at Odyssey 2025"),
  /** Landscape. */
  families: resolve("families.webp", "Families at Odyssey 2025"),
  /** Landscape. */
  awards: {
    src: "/awards-images/I91A0264.webp",
    alt: "Awards & recognition at Odyssey 2025",
  },

  /* ---- The rest of the grid ---- */
  /** Landscape. */
  groupPhoto: resolve("group-photo.webp", "The Odyssey 2025 delegation outside Ananta Spa & Resort"),
  /** Landscape. */
  arrival: resolve("arrival.webp", "A traditional Rajasthani welcome at the resort entrance"),
  /** Landscape. */
  panel: resolve("panel.webp", "The Leadership Insight panel on stage at Odyssey 2025"),
  /** Landscape. */
  wellness: resolve("wellness.webp", "The morning wellness session on the lawn at Odyssey 2025"),
  /** Landscape. */
  dancers: resolve("dancers.webp", "Rajasthani folk dancers at the Odyssey 2025 cultural night"),
  /** Landscape. */
  ceremony: resolve("ceremony.webp", "The opening lamp-lighting ceremony at Odyssey 2025"),
  /** Event Experience mosaic tiles (Keypad positions 2, 6, 8) */
  exp2: resolve("2.webp", "Moments from Odyssey 2025"),
  exp6: resolve("6.webp", "Moments from Odyssey 2025"),
  exp8: resolve("8.webp", "Moments from Odyssey 2025"),
  /* ---- Relive'25 photos ---- */
  relive1: resolve(
    "ceremony.webp",
    "The opening lamp-lighting ceremony at Odyssey 2025"
  ),
  relive2: resolve("relive-2.webp", "Moments from Odyssey 2025"),
  relive3: resolve(
    "relive-3.webp",
    "Networking and conversations at Odyssey 2025"
  ),
  relive4: resolve("relive-4.webp", "Keynote session at Odyssey 2025"),
  relive5: resolve("relive-5.webp", "Evening celebration at Odyssey 2025"),
  relive6: resolve("relive-6.webp", "Cultural night at Odyssey 2025"),
  relive7: resolve("relive-7.webp", "Delegates at Odyssey 2025"),
  relive8: resolve("relive-8.webp", "Group highlights at Odyssey 2025"),
} satisfies Record<string, Shot>;
