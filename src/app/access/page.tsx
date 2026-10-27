import type { Metadata } from "next";
import RecapAccessForm from "@/components/recap/RecapAccessForm";

export const metadata: Metadata = {
  title: "Recap Access | Odyssey 2026",
  description: "Secure access to the Odyssey 2026 post-event recap.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Odyssey 2026 Recap | BOT Consulting",
    description: "Secure access to the Odyssey 2026 post-event recap.",
    url: "/access",
    images: [
      {
        url: "/assets/Odyssey'26 Team Image.jpg",
        width: 1024,
        height: 768,
        alt: "Odyssey '26 Team Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Odyssey 2026 Recap | BOT Consulting",
    description: "Secure access to the Odyssey 2026 post-event recap.",
    images: ["/assets/Odyssey'26 Team Image.jpg"],
  },
};

export default function AccessPage() {
  return <RecapAccessForm />;
}
