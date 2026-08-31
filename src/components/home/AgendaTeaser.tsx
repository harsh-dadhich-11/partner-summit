import Button from "@/components/ui/Button";

export default function AgendaTeaser() {
  return (
    <section id="agenda" className="mx-auto max-w-[80rem] px-6 pb-24 lg:pb-32">
      <div className="max-w-[40rem] border-t border-rule pt-12">
        <p className="fade-in visible text-micro font-semibold uppercase text-accent">
          Speakers & sessions
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
            Meet the speakers
          </Button>
          <Button href="/sessions" variant="quiet" className="rounded-full">
            See the breakout sessions
          </Button>
        </div>
      </div>
    </section>
  );
}
