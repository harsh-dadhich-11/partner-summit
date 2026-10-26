import type { Metadata } from "next";
import GalleryClient from "@/components/gallery/GalleryClient";
import PageHeader from "@/components/ui/PageHeader";
import { getPublishedGalleryPhotos } from "@/data/postEvent";

export const metadata: Metadata = {
  title: "Photo Gallery | Odyssey 2026",
  description: "A curated visual record of Odyssey, Partner Summit '26 in Jaipur.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        kicker="Odyssey 2026 gallery"
        title="The moments between the moments."
        description="A curated visual record of the people, conversations, ceremony and celebration that made the Partner Summit what it was."
      />
      <GalleryClient photos={getPublishedGalleryPhotos()} />
    </>
  );
}
