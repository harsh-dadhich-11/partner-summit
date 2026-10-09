import Button from "@/components/ui/Button";

export default function AgendaTeaser() {
  return (
    <section
      id="agenda"
      className="relative my-8 border-y border-orange-bright/15 bg-[linear-gradient(135deg,#fff8f2_0%,#feeede_50%,#fdeadf_100%)] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[80rem] px-6">
        <div className="max-w-[42rem]">
          <p className="fade-in visible text-micro font-semibold uppercase tracking-wider text-orange-deep">
            Participants &amp; speakers
          </p>
          <h3 className="rise visible mt-4 font-display text-h2 text-ink">
            The first names are in.
          </h3>
          <p className="fade-in visible mt-5 text-body text-ink/80 leading-relaxed">
            Founders, partners, and industry experts with real, hands-on experience in the field
            &mdash; our first group of confirmed guests is ready to explore below. As for our
            breakout sessions, we are putting the final touches on the lineup and will notify
            invited guests as new topics are added.
          </p>
          <div className="fade-in visible mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Button href="/speakers" className="rounded-full">
              Meet the participants
            </Button>
            <Button
              href="/sessions"
              variant="quiet"
              className="rounded-full text-ink border-ink/30 hover:border-ink hover:bg-ink/5"
            >
              See the breakout sessions
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
