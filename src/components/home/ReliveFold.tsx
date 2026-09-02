"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Photo, { type Shot } from "@/components/ui/Photo";
import {
  ASPECT,
  PERSPECTIVE,
  PERSPECTIVE_NARROW,
  RENDER_WINDOW,
  tilePlacement,
} from "@/components/home/reliveGeometry";
import type { ReliveItem } from "@/types";

/** A ReliveItem with its gallery key already resolved — gallery.ts reads the filesystem. */
export type ReliveSlide = Omit<ReliveItem, "image"> & { shot: Shot };

/** How much page scroll each tile is worth, as a fraction of viewport height. This is the
 *  dial that decides how long the section holds the page: 8 tiles at 0.42 is a ~394vh
 *  section, about four screens. */
const SCROLL_PER_TILE = 0.42;

/** Glide weight. The position chases the scroll rather than tracking it exactly, which is
 *  the whole of the heaviness in the motion. */
const LERP = 0.08;

/** Close enough to the target to stop the loop and drop will-change. */
const SETTLE = 0.0005;

/** Below this the fold softens and the tiles widen — a 33vw tile on a phone is a stamp. */
const NARROW = 768;

/** Videos play this close to centre, and are only mounted at all within one tile of it,
 *  which caps the page at three <video> elements however long the archive gets. */
const VIDEO_WINDOW = 1.5;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

type Metrics = { tileW: number; tileH: number; perspective: number };

function measure(): Metrics {
  const stageH = window.innerHeight;
  const narrow = window.innerWidth < NARROW;

  /* Three caps, smallest wins, and all three genuinely bind somewhere:

     46vw is as wide as the tile can go before it reaches the edge labels — it leaves 27vw
     of gutter each side, and the title needs about 25 of that.

     1100px is the asset ceiling, not a taste call. A tile that wide wants 2200px of source
     on a 2x display and the Relive downscales are 2400px, so past this the photographs get
     softer rather than bigger.

     The height term is what keeps the fold inside the h-screen stage, which clips. The
     fold stands 1.79 tile-heights tall at the current SPREAD and RENDER_WINDOW, so 0.55
     fills 98.5% of the viewport — near enough the ceiling that raising it means giving
     back a layer of the fold first. It binds on anything wide and short.

     90vw on a phone rather than the 70vw the brief asked for — 70 leaves the fold floating
     in the middle third of a tall screen with nothing around it, and 90 is the most that
     still leaves the progress rail somewhere to sit. A phone is width-bound either way:
     the fold is nowhere near tall enough there for the height term to matter. */
  const tileW = narrow
    ? Math.min(window.innerWidth * 0.9, 560)
    : Math.min(window.innerWidth * 0.46, 1100, stageH * 0.55 * ASPECT);

  const tileH = tileW / ASPECT;
  return {
    tileW,
    tileH,
    perspective: (narrow ? PERSPECTIVE_NARROW : PERSPECTIVE) * tileH,
  };
}

export default function ReliveFold({ items }: { items: ReliveSlide[] }) {
  const count = items.length;

  /*
    The tall wrapper and the 3D stage are both JS affordances, so neither may be baked into
    the server HTML — the same reasoning as PillarCarousel's `ready` flag. Shipping the
    wrapper height would strand a visitor with JS off in four viewport-heights of empty
    teal. Until this flips, the identical markup below lays out as an ordinary grid.
  */
  const [pinned, setPinned] = useState(false);
  const [active, setActive] = useState(0);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const tilesRef = useRef<(HTMLElement | null)[]>([]);

  const posRef = useRef(0);
  const targetRef = useRef(0);
  const activeRef = useRef(0);
  const frameRef = useRef(0);
  const metricsRef = useRef<Metrics>({ tileW: 0, tileH: 0, perspective: 0 });

  /* Size lives on the DOM nodes, not in React state: it changes on every resize frame and
     re-rendering eight <Image>s to move a number is the one thing this loop must not do. */
  const applyMetrics = useCallback(() => {
    const { tileW, tileH, perspective } = metricsRef.current;
    stageRef.current?.style.setProperty("--relive-perspective", `${perspective}px`);
    tilesRef.current.forEach((node) => {
      if (!node) return;
      node.style.width = `${tileW}px`;
      node.style.height = `${tileH}px`;
    });
  }, []);

  const readTarget = useCallback(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || count < 2) return;

    /* How much of the wrapper scrolls past while the stage is pinned. Zero or less on a
       viewport taller than the section, which would otherwise divide by nothing. */
    const travel = wrapper.offsetHeight - window.innerHeight;
    if (travel <= 0) return;

    const progress = clamp(-wrapper.getBoundingClientRect().top / travel, 0, 1);
    targetRef.current = progress * (count - 1);
  }, [count]);

  const draw = useCallback(() => {
    const target = targetRef.current;
    const drift = target - posRef.current;
    const settled = Math.abs(drift) < SETTLE;
    posRef.current = settled ? target : posRef.current + drift * LERP;

    const pos = posRef.current;
    const { tileH } = metricsRef.current;

    tilesRef.current.forEach((node, index) => {
      if (!node) return;
      const d = index - pos;
      const distance = Math.abs(d);

      /* Out of the window the tile keeps its box — visibility, not display, so the layout
         and the refs stay put — and simply stops being painted or transformed. */
      if (distance > RENDER_WINDOW) {
        node.style.visibility = "hidden";
        return;
      }
      node.style.visibility = "";

      const { transform, zIndex } = tilePlacement(d, tileH);
      node.style.transform = transform;
      node.style.zIndex = String(zIndex);

      const video = node.querySelector("video");
      if (!video) return;
      if (distance < VIDEO_WINDOW) video.play().catch(() => { });
      else video.pause();
    });

    if (thumbRef.current && count > 1) {
      const progress = pos / (count - 1);
      /* The thumb is 1/count of the track tall, so a full sweep is (count - 1) of its own
         heights. Percentages of self keep this correct at every viewport. */
      thumbRef.current.style.transform = `translateY(${progress * (count - 1) * 100}%)`;
    }

    const index = clamp(Math.round(pos), 0, count - 1);
    if (index !== activeRef.current) {
      activeRef.current = index;
      setActive(index);
    }

    if (settled) {
      frameRef.current = 0;
      tilesRef.current.forEach((node) => node?.style.removeProperty("will-change"));
      return;
    }
    frameRef.current = requestAnimationFrame(draw);
  }, [count]);

  const arm = useCallback(() => {
    if (frameRef.current) return;
    tilesRef.current.forEach((node) => {
      if (node) node.style.willChange = "transform";
    });
    frameRef.current = requestAnimationFrame(draw);
  }, [draw]);

  /* Motion is decoration; eight photographs are not. Under reduced motion the markup below
     stays the plain grid it shipped as — and this listens, rather than reading the query
     once, so toggling the OS setting with the page open takes effect. */
  useEffect(() => {
    const stillness = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPinned(!stillness.matches);
    sync();
    stillness.addEventListener("change", sync);
    return () => stillness.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!pinned) return;

    metricsRef.current = measure();
    applyMetrics();
    readTarget();
    /* Land on the scroll position rather than gliding to it: arriving mid-page from a reload
       or a restored scroll position on /relive should not play the whole fold as an entrance. */
    posRef.current = targetRef.current;
    activeRef.current = clamp(Math.round(posRef.current), 0, count - 1);
    setActive(activeRef.current);
    draw();

    const onScroll = () => {
      readTarget();
      arm();
    };
    const onResize = () => {
      metricsRef.current = measure();
      applyMetrics();
      readTarget();
      arm();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    };
  }, [pinned, count, applyMetrics, readTarget, draw, arm]);

  /* Two columns rather than three, in a wider column: the grid is the reduced-motion path,
     not a lesser one, and three-up in 80rem made the photographs smaller than anything the
     pinned fold shows. */
  const wrapperClass = pinned ? "" : "mx-auto max-w-[96rem] px-6";
  const stageClass = pinned
    ? "relive-stage sticky top-0 h-screen"
    : "grid gap-5 sm:grid-cols-2";

  return (
    <div
      ref={wrapperRef}
      className={wrapperClass}
      style={
        pinned
          ? { height: `calc(100vh + ${((count - 1) * SCROLL_PER_TILE * 100).toFixed(1)}vh)` }
          : undefined
      }
    >
      <div
        ref={stageRef}
        className={stageClass}
        role="region"
        aria-roledescription="carousel"
        aria-label="Relive 2025"
      >
        {items.map((item, index) => {
          const centred = index === active;
          /* Mounted within one tile of centre, so at most three exist at once whatever the
             render window is set to. */
          const liveVideo = item.kind === "video" && Math.abs(index - active) <= 1;

          const media = (
            <>
              {liveVideo && item.video ? (
                <video
                  src={item.video}
                  poster={item.shot.src ?? undefined}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label={item.shot.alt}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Photo
                  shot={item.shot}
                  sizes="(max-width: 768px) 90vw, 46vw"
                  priority={index === 0}
                />
              )}

              {/* Only the tile you are looking at offers to play. */}
              {item.kind === "video" && centred && (
                <span className="pointer-events-none absolute inset-0 grid place-items-center font-display text-h3 tracking-[0.2em] text-white uppercase opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100">
                  Play
                </span>
              )}
            </>
          );

          return (
            <figure
              key={item.title}
              ref={(node) => {
                tilesRef.current[index] = node;
              }}
              className={
                pinned
                  ? "relive-tile group/tile overflow-hidden bg-teal-base/40"
                  : "group/tile relative aspect-[1.6/1] overflow-hidden bg-teal-base/40"
              }
            >
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full w-full"
                >
                  {media}
                </a>
              ) : (
                media
              )}
              {/* Every tile gets a name without a caption competing with the edge labels. */}
              <figcaption className="sr-only">
                {item.title} — {item.category}
              </figcaption>
            </figure>
          );
        })}

        {pinned && (
          /*
            All the chrome in one box, so the kicker, both labels and the progress line share
            one alignment. Full width rather than the page's 80rem column: a 46vw tile leaves
            about 27vw of gutter either side, and boxing the labels into the content column
            pushes them straight under the tile instead. The z-index puts the whole box above
            the tiles, which run to 1000, so a long title is never swallowed by a photograph.

            The gutter is the constraint on every inset below. It was roomy at 33vw; at 46vw
            the title has about 25vw to work in, which is why it sits at left-5 and the
            kicker follows it in rather than the other way round.
          */
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-1100 px-10"
          >
            {/*
              Every label is mounted and only one is opaque, which is a crossfade for free.
              A slideshow has to swap two layers back and forth because each layer holds a
              photograph; eight lines of text are cheap enough to skip the bookkeeping.
              Absolute, so nothing shifts.

              Under md the gutters are too narrow to hold anything beside a 90vw tile, so the
              same two labels stack into one centred line below the fold instead.
            */}
            {items.map((item, index) => {
              const shown = index === active ? "opacity-100" : "opacity-0";
              return (
                <div key={item.title} className="contents">
                  <p
                    className={`absolute top-1/2 left-5 hidden max-w-[25vw] -translate-y-1/2 font-display text-h2 text-cream transition-opacity duration-300 md:block ${shown}`}
                  >
                    {item.title}
                  </p>
                  <p
                    className={`absolute top-1/2 right-16 hidden max-w-[18vw] -translate-y-1/2 text-right text-micro font-semibold text-cyan-soft uppercase transition-opacity duration-300 md:block ${shown}`}
                  >
                    {item.category}
                  </p>
                  <p
                    className={`absolute inset-x-6 bottom-14 text-center transition-opacity duration-300 md:hidden ${shown}`}
                  >
                    <span className="font-display text-h3 text-cream">{item.title}</span>
                    <span className="mt-1 block text-micro font-semibold text-cyan-soft uppercase">
                      {item.category}
                    </span>
                  </p>
                </div>
              );
            })}

            {/* Replaces the native scrollbar the page never shows here: how far through the
                archive you are, and nothing else. */}
            {/* right-2 on a phone: a 90vw tile leaves 5vw of gutter — about 22px on a large
                handset — so the line has just enough room beside the photograph. 32px in
                would put it on top of one. */}
            <div className="absolute top-1/2 right-2 h-[33vh] w-px -translate-y-1/2 bg-cream/15 md:right-8">
              <div
                ref={thumbRef}
                className="absolute inset-x-0 top-0 bg-cyan-bright"
                style={{ height: `${100 / count}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
