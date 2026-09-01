import AgendaTeaser from "@/components/home/AgendaTeaser";
import EventExperience from "@/components/home/EventExperience";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import Travel from "@/components/home/Travel";

export default function HomePage() {
  return (
    <>
      <Hero />
      {/* The figures land first after the video, then the carousel expands on them. */}
      <Stats />
      <EventExperience />
      {/* The programme before the paperwork: who is coming and what they'll talk about, then
          the travel and visa help. Relive'25 has its own page at /relive. */}
      <AgendaTeaser />
      <Travel />
    </>
  );
}
