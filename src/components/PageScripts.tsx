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

    return () => {
      io.disconnect();
      spy.disconnect();
      stillness.removeEventListener("change", syncVideo);
      window.removeEventListener("touchstart", handleMobilePlay);
      window.removeEventListener("scroll", handleMobilePlay);
    };
  }, [pathname]);
  return null;
}
