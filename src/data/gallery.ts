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
  /** Landscape. */
  awards: resolve("awards.jpg", "Awards & recognition at Odyssey 2025"),

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
  /* ---- Specified Relive'25 photos. The fold shows five or six of these at once, where
          the slideshow it replaced showed one, so these are the 2400px downscales rather
          than the camera originals — 96MB of source became 8MB. Each `resolve` still lists
          its original second, so deleting a downscale falls back rather than breaking. ---- */
  relive1: resolve("highlights-thumb.jpg", "Odyssey 2025"),
  relive2: resolve(["relive-2.jpg", "I91A2023.jpg"], "Moments from Odyssey 2025"),
  relive3: resolve(
    ["relive-3.jpg", "I91A2496.jpg"],
    "Networking and conversations at Odyssey 2025"
  ),
  relive4: resolve(["relive-4.jpg", "I91A4531.JPG"], "Keynote session at Odyssey 2025"),
  relive5: resolve(["relive-5.jpg", "I91A4709.JPG"], "Evening celebration at Odyssey 2025"),
  relive6: resolve(["relive-6.jpg", "I91A4814 (1).JPG"], "Cultural evening at Odyssey 2025"),
  relive7: resolve(["relive-7.jpg", "I91A9938 (1).jpg"], "Delegates at Odyssey 2025"),
  relive8: resolve(["relive-8.jpg", "Copy of I91A2764.jpg"], "Group highlights at Odyssey 2025"),
} satisfies Record<string, Shot>;
