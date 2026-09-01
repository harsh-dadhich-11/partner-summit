"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const ANIMATED = ".rise, .fade-in, .img-in, .row-in";
export default function PageScripts() {
  const pathname = usePathname();

  useEffect(() => {
    const video = document.getElementById("hero-video") as HTMLVideoElement | null;
    const stillness = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncVideo = () => {
      if (!video) return;
      if (stillness.matches) video.pause();
      else video.play().catch(() => { });
    };
    const handleMobilePlay = () => {
      if (video && video.paused && !stillness.matches) {
        video.play().catch(() => { });
      }
    };
    syncVideo();
    stillness.addEventListener("change", syncVideo);
    window.addEventListener("touchstart", handleMobilePlay, { passive: true, once: true });
    window.addEventListener("scroll", handleMobilePlay, { passive: true, once: true });

    const els = document.querySelectorAll(ANIMATED);
    els.forEach((el) => el.classList.remove("visible"));
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        }),
      { threshold: 0, rootMargin: "0px 0px -10% 0px" }
    );
    els.forEach((el) => io.observe(el));

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

    /* Figures count up as their row arrives, on the same rootMargin as `.row-in` so the
       tick and the fade start together. The markup already carries the final value, so
       nothing is observed under reduced motion — the number simply stands. */
    const COUNT_MS = 1100;
    const cancels: Array<() => void> = [];
    const countIo = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          countIo.unobserve(entry.target);
          const figure = entry.target as HTMLElement;
          // "300+" -> 300 and "+". The suffix is held back until the count lands.
          const [, digits, suffix = ""] = /^(\d+)(.*)$/.exec(figure.dataset.count ?? "") ?? [];
          const target = Number(digits);
          if (!target) return;

          const startAt = performance.now() + Number(figure.dataset.countDelay ?? 0);
          figure.textContent = "0";
          // Written straight to the node, not through state: Stats is a server component
          // with static props, so React never re-renders these and 60fps of setState for
          // a decorative tick would be waste.
          let frame = 0;
          const tick = (now: number) => {
            const progress = Math.min(Math.max(now - startAt, 0) / COUNT_MS, 1);
            // easeOutCubic — the JS reading of the cubic-bezier(.16,1,.3,1) used in CSS.
            const eased = 1 - (1 - progress) ** 3;
            figure.textContent =
              progress < 1 ? String(Math.round(target * eased)) : `${target}${suffix}`;
            if (progress < 1) frame = requestAnimationFrame(tick);
          };
          frame = requestAnimationFrame(tick);
          cancels.push(() => cancelAnimationFrame(frame));
        }),
      { threshold: 0, rootMargin: "0px 0px -10% 0px" }
    );
    if (!stillness.matches) {
      document.querySelectorAll("[data-count]").forEach((figure) => countIo.observe(figure));
    }

    return () => {
      io.disconnect();
      spy.disconnect();
      countIo.disconnect();
      cancels.forEach((cancel) => cancel());
      stillness.removeEventListener("change", syncVideo);
      window.removeEventListener("touchstart", handleMobilePlay);
      window.removeEventListener("scroll", handleMobilePlay);
    };
  }, [pathname]);
  return null;
}
