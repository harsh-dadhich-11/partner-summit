import AgendaTeaser from "@/components/home/AgendaTeaser";
import Closing from "@/components/home/Closing";
import EventExperience from "@/components/home/EventExperience";
import Gallery from "@/components/home/Gallery";
import Hero from "@/components/home/Hero";
import Travel from "@/components/home/Travel";

export default function HomePage() {
  return (
    <>
      <Hero />
      <EventExperience />
      <Gallery />
      <Travel />
      <AgendaTeaser />
      <Closing />
    </>
  );
}
