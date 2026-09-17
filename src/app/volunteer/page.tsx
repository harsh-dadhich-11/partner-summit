import type { Metadata } from "next";
import VolunteerClient from "@/components/volunteer/VolunteerClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Volunteer Attendance Portal | Odyssey 2026",
  description: "Live session attendance check-in and roster management for summit theatre volunteers.",
};

export default function VolunteerPage() {
  return <VolunteerClient />;
}
