import AgendaTeaser from "@/components/home/AgendaTeaser";
import Closing from "@/components/home/Closing";
import EventExperience from "@/components/home/EventExperience";
import Hero from "@/components/home/Hero";
import Relive from "@/components/home/Relive";
import Travel from "@/components/home/Travel";

export default function HomePage() {
  return (
    <>
      <Hero />
      <EventExperience />
      <Relive />
      <Travel />
      <AgendaTeaser />
      <Closing />
    </>
  );
}
