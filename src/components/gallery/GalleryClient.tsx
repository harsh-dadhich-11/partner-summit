"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  GALLERY_CATEGORIES,
  type GalleryCategory,
  type PublishedGalleryPhoto,
} from "@/data/postEvent";

type Props = { photos: PublishedGalleryPhoto[] };

export default function GalleryClient({ photos }: Props) {
  const [category, setCategory] = useState<GalleryCategory | "All">("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const visiblePhotos = useMemo(
    () => photos.filter((photo) => category === "All" || photo.category === category),
    [category, photos]
  );
  const selectedIndex = selectedId ? visiblePhotos.findIndex((photo) => photo.id === selectedId) : -1;
  const selected = selectedIndex >= 0 ? visiblePhotos[selectedIndex] : null;

  const closeLightbox = () => setSelectedId(null);
  const move = (distance: number) => {
    if (!selected || visiblePhotos.length < 2) return;
    const nextIndex = (selectedIndex + distance + visiblePhotos.length) % visiblePhotos.length;
    setSelectedId(visiblePhotos[nextIndex].id);
  };

  useEffect(() => {
    if (!selected) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <>
      <section className="mx-auto max-w-[92rem] px-6 py-12 lg:py-20" aria-label="Odyssey 2026 photographs">
        <div className="flex flex-wrap gap-2" aria-label="Filter photographs by category">
          {GALLERY_CATEGORIES.map((option) => {
            const selectedFilter = category === option;
            return (
              <button
                type="button"
                key={option}
                onClick={() => setCategory(option)}
                aria-pressed={selectedFilter}
                className={`rounded-full border px-4 py-2 text-micro font-semibold uppercase transition-colors ${selectedFilter
                  ? "border-teal-dark bg-teal-dark text-white"
                  : "border-rule bg-white text-teal-dark hover:border-cyan-bright hover:bg-cyan-bright/10"
                  }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        <p className="mt-7 text-small text-muted" aria-live="polite">
          {visiblePhotos.length} {visiblePhotos.length === 1 ? "photograph" : "photographs"}
        </p>

        <div className="mt-5 columns-1 gap-4 sm:columns-2 xl:columns-3">
          {visiblePhotos.map((photo) => (
            <button
              type="button"
              key={photo.id}
              onClick={() => setSelectedId(photo.id)}
              className="group relative mb-4 block w-full break-inside-avoid overflow-hidden bg-teal-dark text-left focus-visible:outline-offset-4"
              aria-label={`View ${photo.title}`}
            >
              {photo.mediumUrl ? (
                // Supabase Storage serves responsive renditions. The full file loads only after selection.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo.mediumUrl} alt={photo.alt} loading="lazy" className="h-auto w-full transition duration-500 group-hover:scale-[1.025]" />
              ) : (
                <div className="aspect-[4/3] bg-teal-base" aria-hidden="true" />
              )}
              <span className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(0,0,0,.75),rgba(0,0,0,.15),transparent)] px-5 pt-12 pb-5 text-small font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {photo.title}
              </span>
            </button>
          ))}
        </div>

        <a
          href="https://drive.google.com/drive/folders/1wHMlt8HKyc_RusF8Mgr4VMtB-svY88HW?usp=sharing"
          target="_blank"
          rel="noreferrer"
          className="group mt-12 flex flex-col items-start gap-5 border border-rule bg-panel-cyan p-7 text-teal-dark transition hover:border-cyan-bright hover:bg-cyan-bright/15 sm:flex-row sm:items-center sm:justify-between lg:mt-16 lg:p-10"
        >
          <div className="flex items-center gap-5">
            <Image src="/assets/logos/google-drive.png" alt="" width={56} height={48} className="h-12 w-14 shrink-0 object-contain" />
            <div>
              <p className="text-micro font-semibold uppercase text-orange-deep">The complete record</p>
              <h2 className="mt-2 font-display text-h3">Explore more photos in Google Drive.</h2>
              <p className="mt-2 max-w-[58ch] text-small text-muted">Open the complete shared folder to continue exploring the moments from Odyssey 2026.</p>
            </div>
          </div>
          <span className="shrink-0 text-micro font-semibold uppercase text-teal-dark group-hover:text-orange-deep">Open Drive ↗</span>
        </a>
      </section>

      {selected && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 text-white"
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) closeLightbox();
          }}
        >
          <div className="relative flex h-full w-full max-w-[96rem] flex-col justify-center">
            <div className="absolute top-0 right-0 z-10 flex gap-2">
              {selected.largeUrl && (
                <a
                  href={`${selected.largeUrl}?download`}
                  className="rounded-full border border-white/40 px-4 py-2 text-micro font-semibold uppercase transition hover:bg-white hover:text-black"
                >
                  Download
                </a>
              )}
              <button type="button" onClick={closeLightbox} className="rounded-full border border-white/40 px-4 py-2 text-micro font-semibold uppercase transition hover:bg-white hover:text-black">
                Close
              </button>
            </div>

            <div className="flex min-h-0 flex-1 items-center justify-center py-14">
              {selected.largeUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selected.largeUrl} alt={selected.alt} className="max-h-full max-w-full object-contain" />
              )}
            </div>

            <div className="flex items-end justify-between gap-4 pb-2">
              <div>
                <p className="text-micro font-semibold uppercase text-cyan-soft">{selected.category}</p>
                <p className="mt-1 text-small font-medium">{selected.title}</p>
              </div>
              {visiblePhotos.length > 1 && (
                <div className="flex gap-2">
                  <button type="button" onClick={() => move(-1)} className="rounded-full border border-white/40 px-4 py-2 text-micro font-semibold uppercase transition hover:bg-white hover:text-black">
                    Previous
                  </button>
                  <button type="button" onClick={() => move(1)} className="rounded-full border border-white/40 px-4 py-2 text-micro font-semibold uppercase transition hover:bg-white hover:text-black">
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
