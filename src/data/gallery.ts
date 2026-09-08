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
    "hero-poster.jpg",
    "Odyssey 2025 at Ananta Spa & Resort, Jaipur"
  ),
  /** Landscape. The sticky image in EventExperience. */
  ananta: resolve("ananta.jpg", "Ananta Spa & Resort, Jaipur"),
  /** Landscape. */
  jaipur: resolve("jaipur.jpg", "A carriage ride through Jaipur at Odyssey 2025"),
  /** Landscape. */
  sessions: resolve("sessions.jpg", "Customers and partners in conversation at Odyssey 2025"),
  /** Landscape. */
  sri: resolve("sri1.jpg", "The Śrī giving-back initiative at Odyssey 2025"),
  /** Landscape. */
  evening: resolve("evening.jpg", "Cultural night at Odyssey 2025"),
  /** Landscape. */
  families: resolve("families.jpg", "Families at Odyssey 2025"),
  /** Landscape. */
  awards: resolve("awards.jpg", "Awards & recognition at Odyssey 2025"),

  /* ---- The rest of the grid ---- */
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
  /** Event Experience mosaic tiles (Keypad positions 2, 6, 8) */
  exp2: resolve("2.jpg", "Moments from Odyssey 2025"),
  exp6: resolve("6.jpg", "Moments from Odyssey 2025"),
  exp8: resolve("8.jpg", "Moments from Odyssey 2025"),
  /* ---- Relive'25 photos ---- */
  relive1: resolve(
    "ceremony.jpg",
    "The opening lamp-lighting ceremony at Odyssey 2025"
  ),
  relive2: resolve("relive-2.jpg", "Moments from Odyssey 2025"),
  relive3: resolve(
    "relive-3.jpg",
    "Networking and conversations at Odyssey 2025"
  ),
  relive4: resolve("relive-4.jpg", "Keynote session at Odyssey 2025"),
  relive5: resolve("relive-5.jpg", "Evening celebration at Odyssey 2025"),
  relive6: resolve("relive-6.jpg", "Cultural night at Odyssey 2025"),
  relive7: resolve("relive-7.jpg", "Delegates at Odyssey 2025"),
  relive8: resolve("relive-8.jpg", "Group highlights at Odyssey 2025"),
} satisfies Record<string, Shot>;
