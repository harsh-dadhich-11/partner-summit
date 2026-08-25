"use client";

import { useEffect, useState } from "react";
import Photo, { type Shot } from "@/components/ui/Photo";

const DWELL_MS = 6000;

type FrameState = {
  layers: [Shot, Shot];
  front: 0 | 1;
  current: number;
};

function show(state: FrameState, index: number, shots: Shot[]): FrameState {
  if (index === state.current) return state;
  const back: 0 | 1 = state.front === 0 ? 1 : 0;
  const layers: [Shot, Shot] = [state.layers[0], state.layers[1]];
  layers[back] = shots[index];
  return { layers, front: back, current: index };
}

export default function GalleryFrame({ shots }: { shots: Shot[] }) {
  const [state, setState] = useState<FrameState>({
    layers: [shots[0], shots[0]],
    front: 0,
    current: 0,
  });
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (focused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setTimeout(
      () => setState((current) => show(current, (current.current + 1) % shots.length, shots)),
      DWELL_MS
    );
    return () => clearTimeout(timer);
  }, [state, focused, shots]);

  return (
    <div
      className="img-in visible relative aspect-[4/3] overflow-hidden sm:aspect-[16/9]"
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {state.layers.map((shot, layer) => (
        <div
          key={layer}
          aria-hidden={layer !== state.front}
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${layer === state.front ? "opacity-100" : "opacity-0"
            }`}
        >
          <Photo shot={shot} sizes="(max-width: 1024px) 100vw, 80rem" priority={layer === 0} />
        </div>
      ))}

      {/* Sits over the photograph, so it carries its own gradient rather than relying on
          whatever happens to be in the bottom of the frame. The clip-path in `.img-in` is
          scoped to img/video, so this strip does not ride along with the reveal. */}
      <div className="absolute inset-x-0 bottom-0 flex flex-wrap justify-center gap-2.5 bg-[linear-gradient(0deg,rgba(16,29,34,.55),transparent)] px-6 pt-16 pb-6">
        {shots.map((shot, index) => (
          <button
            key={shot.alt}
            type="button"
            onClick={() => setState((current) => show(current, index, shots))}
            aria-label={`Show photo ${index + 1} of ${shots.length}`}
            aria-current={index === state.current}
            className={`h-2.5 w-2.5 cursor-pointer rounded-full border border-cream/70 transition-colors duration-300 ${index === state.current ? "bg-cream" : "bg-transparent hover:bg-cream/50"
              }`}
          />
        ))}
      </div>
    </div>
  );
}
