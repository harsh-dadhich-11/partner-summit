/**
 * Image assets for the Awards section in Event Experience.
 * Constrained strictly to files in `public/awards-images`.
 */
export const AWARDS_IMAGES: readonly string[] = [
  "/awards-images/I91A0264.webp",
  "/awards-images/I91A2296.webp",
  "/awards-images/I91A2337.webp",
  "/awards-images/I91A2364.webp",
  "/awards-images/I91A3452.webp",
  "/awards-images/I91A3454.webp",
  "/awards-images/I91A3507.webp",
  "/awards-images/I91A3534.webp",
  "/awards-images/I91A4000.webp",
  "/awards-images/I91A4068.webp",
  "/awards-images/IMG_20251024_172132928_HDR~2.webp",
];

/**
 * Returns a randomized image path from `public/awards-images`.
 */
export function getRandomAwardsImage(): string {
  if (!AWARDS_IMAGES.length) return "";
  const index = Math.floor(Math.random() * AWARDS_IMAGES.length);
  return AWARDS_IMAGES[index];
}
