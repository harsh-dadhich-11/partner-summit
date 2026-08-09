import type { Metadata } from "next";
import FaqSection from "@/components/faq/FaqSection";
import PageHeader from "@/components/ui/PageHeader";
import { faqCategories } from "@/data/faq";

export const metadata: Metadata = {
  title: "FAQ | Odyssey 2026",
  description:
    "Everything you need to know about Odyssey 2026 — registration, travel and visas, accommodation, families, and life at Ananta Spa & Resort, Jaipur.",
};

export default function FaqPage() {
  return (
    <>
      <PageHeader
        kicker="Frequently Asked Questions"
        title="Everything you need to know."
        description="Before, during and after the summit — the details that matter, grouped by topic. If something isn’t here, email us and we’ll answer it directly."
      />

      <div className="mx-auto max-w-[80rem] px-6 py-20 lg:py-28">
        <FaqSection categories={faqCategories} />
      </div>
    </>
  );
}
