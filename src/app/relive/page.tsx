import type { Metadata } from "next";
import ReliveFold, { type ReliveSlide } from "@/components/home/ReliveFold";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import { gallery } from "@/data/gallery";
import { reliveItems } from "@/data/relive";
import { HIGHLIGHTS_HREF } from "@/data/site";

export const metadata: Metadata = {
  title: "Relive'25 | Odyssey 2026",
  description:
    "Look back at Odyssey 2025 — the atmosphere and the moments that continue to shape every gathering that follows.",
};

/* gallery.ts reads the filesystem, so the keys are resolved here, on the server, and the fold
   — a client component — is handed finished shots. Same boundary as EventExperience. */
const slides: ReliveSlide[] = reliveItems.map(({ image, ...item }) => ({
  ...item,
  shot: gallery[image],
}));

export default function RelivePage() {
  return (
    <>
      <PageHeader
        kicker="Relive’25"
        title="Every gathering leaves behind a story."
        description="A conversation that changed your perspective, a friendship that grew stronger, an evening that reminded you why any of this matters. Look back at last year’s gathering — the atmosphere and the moments that continue to shape every one that follows."
        action={<Button href={HIGHLIGHTS_HREF}>Watch the 2025 highlights</Button>}
      />

      {/*
        Same bg-teal-dark as the header above it, so the fold reads as a continuation of the
        page rather than a band on it. No max-width: the fold pins itself to the viewport and
        needs the full width to do it. It carries its own height — several viewports of it once
        JS is running, and nothing at all before that.
      */}
      <div className="bg-teal-dark pt-14 pb-20 text-cream lg:pt-20 lg:pb-32">
        <ReliveFold items={slides} />
      </div>
    </>
  );
}
