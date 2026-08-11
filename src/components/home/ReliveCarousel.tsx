"use client";

import { useEffect, useState } from "react";
import Photo, { type Shot } from "@/components/ui/Photo";

const DWELL_MS = 5000;

/**
 * A crossfade stack rather than a translating track: Photo renders next/image with `fill`,
 * so every slide already needs a positioned, sized parent — stacking them in one box and
 * toggling opacity costs no layout code at all.
 *
 * The client boundary is drawn exactly here. data/gallery.ts calls existsSync at module
 * load and must stay on the server, so the shots arrive as plain props.
 *
 * ponytail: pause is hover/focus plus a reduced-motion opt-out, not a pause/play button.
 * That is the WCAG 2.2.2 mechanism a touch device cannot reach — add the button if the
 * rotation ever gets reported as unstoppable on a phone.
 */
export default function ReliveCarousel({ shots }: { shots: Shot[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Keyed on `index` rather than one long-lived setInterval: choosing a dot restarts the
  // dwell instead of inheriting whatever was left of the previous one.
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setTimeout(() => setIndex((current) => (current + 1) % shots.length), DWELL_MS);
    return () => clearTimeout(timer);
  }, [index, paused, shots.length]);

  return (
    // .img-in belongs on this wrapper, never on the slides: PageScripts strips .visible on
    // mount and re-adds it on intersection, and the stacked slides are not separately observed.
    <div
      className="img-in visible relative aspect-[4/3] overflow-hidden sm:aspect-[16/9]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {shots.map((shot, position) => (
        <div
          key={shot.alt}
          aria-hidden={position !== index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
            position === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Photo
            shot={shot}
            sizes="(max-width: 1024px) 100vw, 80rem"
            priority={position === 0}
          />
        </div>
      ))}

      {/* Sits over the photograph, so it carries its own gradient rather than relying on
          whatever happens to be in the bottom of the frame. */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center gap-3 bg-[linear-gradient(0deg,rgba(16,29,34,.55),transparent)] px-6 pt-16 pb-7">
        {shots.map((shot, position) => (
          <button
            key={shot.alt}
            type="button"
            onClick={() => setIndex(position)}
            aria-label={`Show photo ${position + 1} of ${shots.length}`}
            aria-current={position === index}
            className={`h-2.5 w-2.5 cursor-pointer rounded-full border border-cream/70 transition-colors duration-300 ${
              position === index ? "bg-cream" : "bg-transparent hover:bg-cream/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
