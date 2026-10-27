import type { Metadata } from "next";
import RecapAccessForm from "@/components/recap/RecapAccessForm";

export const metadata: Metadata = {
  title: "Recap Access | Odyssey 2026",
  description: "Secure access to the Odyssey 2026 post-event recap.",
  robots: { index: false, follow: false },
};

export default function AccessPage() {
  return <RecapAccessForm />;
}
