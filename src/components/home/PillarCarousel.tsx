"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import PillarCard, { type PillarSlide } from "@/components/home/PillarCard";

/* Chevrons, matching the navbar's hamburger rather than importing an icon set for two glyphs. */
const Chevron = ({ back = false }: { back?: boolean }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={back ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
  </svg>
);

/** How long after the last scroll event to treat the track as settled. */
const SETTLE_MS = 160;

export default function PillarCarousel({ slides }: { slides: PillarSlide[] }) {
  const count = slides.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  /*
    Two things hang off `ready`, both for the same reason — neither may be baked into the
    server HTML. The dimming is a JS affordance, so shipping it would strand five of six
    cards at 40% with JS off. The clones below are the same story: without JS they would
    print the six pillars three times over. Same principle as PageScripts adding
    `.visible` rather than the markup omitting it.
  */
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  /*
    The loop is three copies of the list, sitting in one ordinary scroll track. Nothing
    wraps arithmetically — you simply never reach an end, because once a scroll settles
    outside the middle copy we hop to the identical card inside it. The hop is invisible:
    same card, same neighbours, same offset within its copy, so only scrollLeft changes.

    Cloning rather than re-ordering is what keeps native swipe working. A transform-based
    track could loop without duplicates, but it would have to reimplement momentum,
    snapping and touch — all of which the browser already does here for free.
  */
  const loop = ready ? [...slides, ...slides, ...slides] : slides;

  /* The observer callback and the settle timer both need the current index without
     re-subscribing on every slide change, so it lives in a ref alongside the state. */
  const activeRef = useRef(0);
  const setIndex = useCallback((index: number) => {
    activeRef.current = index;
    setActive(index);
  }, []);

  const scrollToIndex = useCallback((index: number, smooth: boolean) => {
    const track = trackRef.current;
    const card = track?.children[index] as HTMLElement | undefined;
    if (!track || !card) return;

    /* Rect maths, not offsetLeft: the track is not guaranteed to be the offset parent,
       and scrollIntoView would drag the page vertically along with it. */
    const trackBox = track.getBoundingClientRect();
    const cardBox = card.getBoundingClientRect();
    const delta = cardBox.left + cardBox.width / 2 - (trackBox.left + trackBox.width / 2);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({ left: delta, behavior: smooth && !reduced ? "smooth" : "auto" });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!ready || !track) return;

    /* Open on the middle copy, so there is already a card to reach in both directions. */
    scrollToIndex(count, false);
    setIndex(count);

    const cards = Array.from(track.children) as HTMLElement[];

    /* The active card is whichever one is mostly in view — read from the scroll position
       rather than tracked separately, so a swipe, a dot press and the recentre below all
       end up agreeing. Same primitive PageScripts uses for reveals. */
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIndex(cards.indexOf(entry.target as HTMLElement));
        });
      },
      { root: track, threshold: 0.6 }
    );
    cards.forEach((card) => observer.observe(card));

    /* Debounced rather than listening for `scrollend`, which Safari only shipped in 18.2
       — and a timer is the whole of what the event would buy here. */
    let settle: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(settle);
      settle = setTimeout(() => {
        const index = activeRef.current;
        if (index >= count && index < count * 2) return;
        const target = (((index % count) + count) % count) + count;
        scrollToIndex(target, false);
        setIndex(target);
      }, SETTLE_MS);
    };
    track.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      clearTimeout(settle);
      track.removeEventListener("scroll", onScroll);
    };
  }, [ready, count, scrollToIndex, setIndex]);

  /* Which of the six this is, whichever copy it happens to live in. */
  const realIndex = ((active % count) + count) % count;

  /* Always in range: the recentre keeps `active` inside the middle copy between
     interactions, so there is a real card either side of it. */
  const step = (delta: number) => scrollToIndex(active + delta, true);

  const goToDot = (dot: number) => {
    if (!ready) return scrollToIndex(dot, true);
    /* Nearest copy, so pressing dot 1 from the end of the list steps forward into the
       next copy rather than rewinding the whole track. */
    const target = [dot, dot + count, dot + count * 2].reduce((best, candidate) =>
      Math.abs(candidate - active) < Math.abs(best - active) ? candidate : best
    );
    scrollToIndex(target, true);
  };

  const arrow =
    "flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-teal-dark " +
    "transition-colors duration-300 hover:bg-teal-dark/8";

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Event experience">
      {/*
        One clip path for all six cards. objectBoundingBox units mean the curve is
        expressed as fractions of whatever box it lands on, so it holds its shape at
        every card width instead of needing a path per breakpoint.
      */}
      <svg aria-hidden="true" className="absolute h-0 w-0" focusable="false">
        <defs>
          <clipPath id="pillar-edge" clipPathUnits="objectBoundingBox">
            <path d="M0,0 H0.96 C1,0.14 0.93,0.3 0.96,0.46 C0.99,0.64 0.92,0.82 0.95,1 H0 Z" />
          </clipPath>
        </defs>
      </svg>

      {/*
        No autoplay. These cards are three sentences of reading, and a timer that pulls
        the text away mid-paragraph is hostile in a way it never is for a photograph.

        tabIndex makes the track keyboard-scrollable: nothing inside the cards is
        focusable, so without it a keyboard user could reach the dots but never the
        scroller itself.
      */}
      <div
        ref={trackRef}
        tabIndex={0}
        aria-label="Event experience cards — scroll horizontally"
        className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto px-[7vw] py-2 lg:px-[max(2rem,calc((100vw-62rem)/2))]"
      >
        {loop.map((slide, index) => (
          <PillarCard
            key={`${index}-${slide.title}`}
            pillar={slide}
            active={!ready || index === active}
            /* The outer two copies are the same six pillars again — read once, not thrice. */
            duplicate={ready && (index < count || index >= count * 2)}
          />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-rule px-2.5 py-2">
          <button type="button" onClick={() => step(-1)} aria-label="Previous" className={arrow}>
            <Chevron back />
          </button>

          {slides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              onClick={() => goToDot(index)}
              aria-label={`Show ${slide.title}, ${index + 1} of ${count}`}
              aria-current={index === realIndex}
              className={`mx-0.5 h-2.5 w-2.5 cursor-pointer rounded-full transition-colors duration-300 ${
                index === realIndex ? "bg-teal-dark" : "bg-ink/20 hover:bg-ink/40"
              }`}
            />
          ))}

          <button type="button" onClick={() => step(1)} aria-label="Next" className={arrow}>
            <Chevron />
          </button>
        </div>
      </div>
    </div>
  );
}
