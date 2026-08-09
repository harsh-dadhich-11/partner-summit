import Image from "next/image";

type Shot = { src: string | null; alt: string };

type Props = {
  shot: Shot;
  /** Sizes hint for the responsive srcset — pass the widest the image ever renders. */
  sizes: string;
  className?: string;
  priority?: boolean;
};

/**
 * Every photo on the site. Renders through next/image for AVIF/WebP and a correct
 * srcset, and falls back to a quiet colour field when the file has not been supplied
 * yet (see data/gallery.ts) so a missing asset never reads as a broken page.
 *
 * The caller owns the shape: give this a positioned, sized parent — `fill` means we
 * never need the intrinsic dimensions, which is what keeps the manifest zero-config.
 */
export default function Photo({ shot, sizes, className = "", priority = false }: Props) {
  if (!shot.src) {
    return (
      <div
        role="img"
        aria-label={shot.alt}
        className={`h-full w-full bg-teal-base/90 bg-[radial-gradient(circle_at_30%_25%,rgba(125,216,229,.16),transparent_60%)] ${className}`}
      />
    );
  }

  return (
    <Image
      src={shot.src}
      alt={shot.alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
    />
  );
}
