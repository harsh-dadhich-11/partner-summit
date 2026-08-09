import Button from "@/components/ui/Button";
import { UPDATES_HREF } from "@/data/site";

/** Was a dashed-border "coming soon" box. Now it is just a quiet note under a rule. */
export default function AgendaTeaser() {
  return (
    <section id="agenda" className="mx-auto max-w-[80rem] px-6 pb-24 lg:pb-32">
      <div className="max-w-[40rem] border-t border-rule pt-12">
        <p className="fade-in visible text-micro font-semibold uppercase text-accent">
          Speakers & sessions
        </p>
        <h3 className="rise visible mt-5 font-display text-h2 text-ink">Still taking shape.</h3>
        <p className="fade-in visible mt-5 text-body text-muted">
          We&rsquo;re still finalising the conversations, speakers and experiences for this
          year&rsquo;s summit, and invited guests hear about each one as it&rsquo;s confirmed. Want
          them as they land? Send us a line and we&rsquo;ll add you to the list.
        </p>
        <div className="fade-in visible mt-8">
          <Button href={UPDATES_HREF}>Email us for updates</Button>
        </div>
      </div>
    </section>
  );
}
