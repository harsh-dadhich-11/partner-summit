import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import InsightsLibrary from "@/components/insights/InsightsLibrary";
import { INSIGHTS } from "@/data/insights";

export const metadata: Metadata = {
  title: "Session Insights | Odyssey 2026",
  description: "The ideas and practical takeaways shared at Odyssey, Partner Summit '26.",
  robots: { index: false, follow: false },
};

export default function InsightsPage() {
  return (
    <>
      <PageHeader
        kicker="Odyssey 2026 insights"
        title="The conversations worth carrying forward."
        description="Explore concise, public-facing takeaways from the summit’s technology, GCC, business and leadership conversations."
      />
      <InsightsLibrary insights={INSIGHTS} />
    </>
  );
}
