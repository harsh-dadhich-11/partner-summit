"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Scroll-reveal, plus pausing the hero video for visitors who ask for reduced motion.
 *
 * One observer drives four different behaviours (`.rise`, `.fade-in`, `.img-in`, `.row-in`)
 * — the animation itself lives in CSS, this only decides when an element has been seen.
 * Stagger comes from an inline `--i` on the element, so it survives without JS too.
 *
 * Markup ships with `.visible` so the page reads fine without JS; strip it, then re-add on scroll.
 * Re-runs per route so client-side navigations observe the new page's elements.
 */
const ANIMATED = ".rise, .fade-in, .img-in, .row-in";
export default function PageScripts() {
  const pathname = usePathname();

  useEffect(() => {
    const video = document.getElementById("hero-video") as HTMLVideoElement | null;
    const stillness = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncVideo = () => {
      if (!video) return;
      if (stillness.matches) video.pause();
      else video.play().catch(() => {}); // autoplay may still be blocked; poster stays up
    };
    syncVideo();
    stillness.addEventListener("change", syncVideo);

    const els = document.querySelectorAll(ANIMATED);
    els.forEach((el) => el.classList.remove("visible"));
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        }),
      // threshold MUST stay 0. `.rise` and `.img-in` hide themselves with clip-path, and
      // Chrome subtracts an element's own clip-path from its intersection rect — so their
      // ratio is pinned at 0 and any non-zero threshold can never be crossed. The element
      // stays hidden because it is hidden. `rootMargin` gives the "wait until it is
      // properly on screen" behaviour that the old threshold was reaching for.
      { threshold: 0, rootMargin: "0px 0px -10% 0px" }
    );
    els.forEach((el) => io.observe(el));

    // Scroll-spy: underline the nav link for whichever section crosses the middle of the screen.
    const spied = document.querySelectorAll<HTMLAnchorElement>("[data-spy]");
    const spy = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          spied.forEach((link) => link.classList.toggle("is-current", link.dataset.spy === entry.target.id));
        }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    spied.forEach((link) => {
      const section = link.dataset.spy && document.getElementById(link.dataset.spy);
      if (section) spy.observe(section);
    });

    return () => {
      io.disconnect();
      spy.disconnect();
      stillness.removeEventListener("change", syncVideo);
    };
  }, [pathname]);
  return null;
}
