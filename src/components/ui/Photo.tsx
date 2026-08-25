import Image from "next/image";

export type Shot = { src: string | null; alt: string };

type Props = {
  shot: Shot;
  sizes: string;
  className?: string;
  priority?: boolean;
};

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
