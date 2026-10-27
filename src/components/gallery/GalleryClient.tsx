"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  GALLERY_CATEGORIES,
  type GalleryCategory,
  type PublishedGalleryPhoto,
} from "@/data/postEvent";

type Props = { photos: PublishedGalleryPhoto[] };

type ShareTarget = {
  title: string;
  message: string;
  url: string;
};

export default function GalleryClient({ photos }: Props) {
  const [category, setCategory] = useState<GalleryCategory | "All">("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [shareTarget, setShareTarget] = useState<ShareTarget | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const shareLinkRef = useRef<HTMLInputElement>(null);

  // Sync URL on mount for deep linking (?photo=<id> or #<id>)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const photoParam = params.get("photo") || window.location.hash.replace("#", "");
    if (photoParam) {
      const match = photos.find((p) => p.id === photoParam);
      if (match) {
        setSelectedId(match.id);
        if (match.category) setCategory(match.category);
      }
    }
  }, [photos]);

  const selectPhoto = useCallback((id: string | null) => {
    setSelectedId(id);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (id) {
        url.searchParams.set("photo", id);
      } else {
        url.searchParams.delete("photo");
      }
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  const visiblePhotos = useMemo(
    () => photos.filter((photo) => category === "All" || photo.category === category),
    [category, photos]
  );
  const selectedIndex = selectedId ? visiblePhotos.findIndex((photo) => photo.id === selectedId) : -1;
  const selected = selectedIndex >= 0 ? visiblePhotos[selectedIndex] : null;

  const closeLightbox = useCallback(() => selectPhoto(null), [selectPhoto]);
  const move = useCallback((distance: number) => {
    if (!selected || visiblePhotos.length < 2) return;
    const nextIndex = (selectedIndex + distance + visiblePhotos.length) % visiblePhotos.length;
    selectPhoto(visiblePhotos[nextIndex].id);
  }, [selected, selectedIndex, selectPhoto, visiblePhotos]);

  useEffect(() => {
    if (!selected && !shareTarget) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (shareTarget) setShareTarget(null);
        else closeLightbox();
      }
      if (selected && !shareTarget && event.key === "ArrowLeft") move(-1);
      if (selected && !shareTarget && event.key === "ArrowRight") move(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeLightbox, move, selected, shareTarget]);

  const openShareForPhoto = (photo: PublishedGalleryPhoto, event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    const url = `${window.location.origin}/gallery?photo=${encodeURIComponent(photo.id)}`;
    setShareCopied(false);
    setShareTarget({
      title: `Share “${photo.title}”`,
      message: `View “${photo.title}” from the Odyssey 2026 photo gallery.`,
      url,
    });
  };

  const openShareGallery = () => {
    const url = `${window.location.origin}/gallery`;
    setShareCopied(false);
    setShareTarget({
      title: "Share the gallery",
      message: "Explore the moments from Odyssey, Partner Summit ’26 in Jaipur.",
      url,
    });
  };

  const copyShareLink = () => {
    if (!shareTarget) return;
    const fallbackCopy = () => {
      shareLinkRef.current?.select();
      document.execCommand("copy");
    };

    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2500);

    if (navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(shareTarget.url).catch(fallbackCopy);
    } else {
      fallbackCopy();
    }
  };

  const openSystemShare = async () => {
    if (!shareTarget || !navigator.share) return;
    try {
      await navigator.share({ title: shareTarget.title, text: shareTarget.message, url: shareTarget.url });
    } catch (err) {
      if ((err as Error)?.name !== "AbortError") return;
    }
  };

  return (
    <>
      <section className="mx-auto max-w-[92rem] px-6 py-12 lg:py-20" aria-label="Odyssey 2026 photographs">
        <div className="flex flex-wrap items-center justify-between gap-4">
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

          <button
            type="button"
            onClick={openShareGallery}
            className="inline-flex items-center gap-2 rounded-full border border-rule bg-white px-4 py-2 text-micro font-semibold uppercase text-teal-dark transition hover:border-cyan-bright hover:bg-cyan-bright/10"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            Share gallery
          </button>
        </div>

        <p className="mt-7 text-small text-muted" aria-live="polite">
          {visiblePhotos.length} {visiblePhotos.length === 1 ? "photograph" : "photographs"}
        </p>

        <div className="mt-5 columns-1 gap-4 sm:columns-2 xl:columns-3">
          {visiblePhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => selectPhoto(photo.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  selectPhoto(photo.id);
                }
              }}
              role="button"
              tabIndex={0}
              className="group relative mb-4 block w-full cursor-pointer break-inside-avoid overflow-hidden bg-teal-dark text-left focus-visible:outline-offset-4"
              aria-label={`View ${photo.title}`}
            >
              {photo.mediumUrl ? (
                // Supabase Storage serves responsive renditions. The full file loads only after selection.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo.mediumUrl} alt={photo.alt} loading="lazy" className="h-auto w-full transition duration-500 group-hover:scale-[1.025]" />
              ) : (
                <div className="aspect-[4/3] bg-teal-base" aria-hidden="true" />
              )}
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-[linear-gradient(to_top,rgba(0,0,0,.75),rgba(0,0,0,.15),transparent)] px-5 pt-12 pb-5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <span className="text-small font-medium text-white">
                  {photo.title}
                </span>
                <button
                  type="button"
                  onClick={(e) => openShareForPhoto(photo, e)}
                  aria-label={`Share ${photo.title}`}
                  className="shrink-0 rounded-full border border-white/40 bg-black/60 px-3 py-1 text-micro font-semibold uppercase text-white backdrop-blur-sm transition hover:bg-white hover:text-black"
                >
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start gap-5 border border-rule bg-panel-cyan p-7 text-teal-dark sm:flex-row sm:items-center sm:justify-between lg:mt-16 lg:p-10">
          <div className="flex items-center gap-5">
            <Image src="/assets/logos/google-drive.png" alt="" width={56} height={48} className="h-12 w-14 shrink-0 object-contain" />
            <div>
              <p className="text-micro font-semibold uppercase text-orange-deep">The complete record</p>
              <h2 className="mt-2 font-display text-h3">Explore more photos in Google Drive.</h2>
              <p className="mt-2 max-w-[58ch] text-small text-muted">Open the complete shared folder to continue exploring the moments from Odyssey 2026.</p>
            </div>
          </div>
          <a
            href="https://drive.google.com/drive/folders/1wHMlt8HKyc_RusF8Mgr4VMtB-svY88HW?usp=sharing"
            target="_blank"
            rel="noreferrer"
            className="shrink-0 rounded-full bg-teal-dark px-5 py-2.5 text-micro font-semibold uppercase text-white transition hover:bg-teal-base"
          >
            Open Drive ↗
          </a>
        </div>
      </section>

      {shareTarget && (
        <div
          className="fixed inset-0 z-[250] flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="gallery-share-title"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setShareTarget(null);
          }}
        >
          <div className="w-full max-w-xl border border-white/15 bg-teal-dark p-6 text-white shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-micro font-semibold uppercase text-cyan-soft">Odyssey 2026</p>
                <h2 id="gallery-share-title" className="mt-2 font-display text-h2">{shareTarget.title}</h2>
                <p className="mt-3 max-w-[52ch] text-small text-cream/75">Choose a channel, or copy the link below.</p>
              </div>
              <button
                type="button"
                onClick={() => setShareTarget(null)}
                className="shrink-0 border border-white/30 px-3 py-2 text-micro font-semibold uppercase text-white transition hover:bg-white hover:text-teal-dark"
                aria-label="Close share panel"
              >
                Close
              </button>
            </div>

            <div className="mt-7 flex gap-2">
              <input
                ref={shareLinkRef}
                value={shareTarget.url}
                readOnly
                aria-label="Share link"
                onFocus={(event) => event.currentTarget.select()}
                className="min-w-0 flex-1 border border-white/25 bg-white/10 px-3 py-3 text-small text-white outline-none transition focus:border-cyan-bright"
              />
              <button
                type="button"
                onClick={copyShareLink}
                className="shrink-0 bg-cyan-bright px-4 py-3 text-micro font-semibold uppercase text-teal-dark transition hover:bg-white"
              >
                {shareCopied ? "Copied ✓" : "Copy"}
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${shareTarget.message} ${shareTarget.url}`)}`}
                target="_blank"
                rel="noreferrer"
                className="border border-white/30 px-4 py-2 text-micro font-semibold uppercase text-white transition hover:border-cyan-bright hover:bg-white hover:text-teal-dark"
              >
                WhatsApp
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareTarget.url)}`}
                target="_blank"
                rel="noreferrer"
                className="border border-white/30 px-4 py-2 text-micro font-semibold uppercase text-white transition hover:border-cyan-bright hover:bg-white hover:text-teal-dark"
              >
                Facebook
              </a>
              <a
                href={`mailto:?subject=${encodeURIComponent(shareTarget.title)}&body=${encodeURIComponent(`${shareTarget.message}\n\n${shareTarget.url}`)}`}
                className="border border-white/30 px-4 py-2 text-micro font-semibold uppercase text-white transition hover:border-cyan-bright hover:bg-white hover:text-teal-dark"
              >
                Email
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTarget.message)}&url=${encodeURIComponent(shareTarget.url)}`}
                target="_blank"
                rel="noreferrer"
                className="border border-white/30 px-4 py-2 text-micro font-semibold uppercase text-white transition hover:border-cyan-bright hover:bg-white hover:text-teal-dark"
              >
                X
              </a>
              {typeof navigator !== "undefined" && navigator.share && (
                <button
                  type="button"
                  onClick={openSystemShare}
                  className="border border-white/30 px-4 py-2 text-micro font-semibold uppercase text-white transition hover:border-cyan-bright hover:bg-white hover:text-teal-dark"
                >
                  More
                </button>
              )}
            </div>
          </div>
        </div>
      )}

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
            <div className="absolute top-0 right-0 z-10 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={(e) => openShareForPhoto(selected, e)}
                className="rounded-full border border-white/40 bg-black/50 px-4 py-2 text-micro font-semibold uppercase text-white backdrop-blur-sm transition hover:bg-white hover:text-black"
                aria-label="Share photograph"
              >
                Share
              </button>
              {selected.largeUrl && (
                <a
                  href={`${selected.largeUrl}&download`}
                  className="rounded-full border border-white/40 bg-black/50 px-4 py-2 text-micro font-semibold uppercase text-white backdrop-blur-sm transition hover:bg-white hover:text-black"
                >
                  Download
                </a>
              )}
              <button
                type="button"
                onClick={closeLightbox}
                className="rounded-full border border-white/40 bg-black/50 px-4 py-2 text-micro font-semibold uppercase text-white backdrop-blur-sm transition hover:bg-white hover:text-black"
              >
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
