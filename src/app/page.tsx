import AgendaTeaser from "@/components/home/AgendaTeaser";
import Closing from "@/components/home/Closing";
import EventExperience from "@/components/home/EventExperience";
import Gallery from "@/components/home/Gallery";
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
      <Gallery />
      <Travel />
      <AgendaTeaser />
      <Closing />
    </>
  );
}
