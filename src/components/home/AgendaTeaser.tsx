import Button from "@/components/ui/Button";

export default function AgendaTeaser() {
  return (
    /* No vertical padding of its own: the separation above is EventExperience's pb-24 and
       the gap underneath is Travel's pt-24, which puts equal air on both sides. */
    <section id="agenda" className="mx-auto max-w-[80rem] px-6">
      <div className="max-w-[40rem]">
        <p className="fade-in visible text-micro font-semibold uppercase text-accent">
          Participants & sessions
        </p>
        <h3 className="rise visible mt-5 font-display text-h2 text-ink">
          The first names are in.
        </h3>
        <p className="fade-in visible mt-5 text-body text-muted">
          Founders, operators and partners who have built the thing they&rsquo;re talking about.
          The sessions around them are still being finalised, and invited guests hear about each
          one as it&rsquo;s confirmed.
        </p>
        <div className="fade-in visible mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Button href="/speakers" className="rounded-full">
            Meet the participants
          </Button>
          <Button href="/sessions" variant="quiet" className="rounded-full">
            See the breakout sessions
          </Button>
        </div>
      </div>
    </section>
  );
}
