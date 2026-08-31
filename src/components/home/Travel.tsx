import { Icon } from "@/components/ui/Icon";
import SectionHeading from "@/components/ui/SectionHeading";
import { SUMMIT_EMAIL } from "@/data/site";

const PHONE = "+91 92567 68903 | +91 85519 60354";

export default function Travel() {
  return (
    <section id="travel" className="mx-auto max-w-[80rem] px-6 py-24 lg:py-32">
      <SectionHeading
        kicker="Travel & Visa Assistance"
        title="Your journey begins before you arrive."
        description="Whether you’re travelling across the country or across continents, our team handles invitation letters, visa guidance, accommodation and local travel. Ask us early and none of it has to be your problem."
      />

      {/* A rule and a column split carry this now — it used to be a bordered white card. */}
      <div className="grid gap-12 border-t border-rule pt-12 lg:grid-cols-2 lg:gap-24 overflow-hidden">
        <div className="fade-in visible">
          <span className="text-accent">
            <Icon name="luggage" size={30} />
          </span>
          <h3 className="mt-5 font-display text-h3 text-ink break-words">Questions before your journey?</h3>
          <p className="mt-3 max-w-[42ch] text-small text-muted">
            Reach out and we&rsquo;ll sort the details, so the only thing left to plan is what
            you&rsquo;ll say when you get there.
          </p>
        </div>

        <dl className="space-y-8 min-w-0">
          <div className="row-in visible" style={{ "--i": 0 } as React.CSSProperties}>
            <dt className="mb-2 flex items-center gap-2.5 text-micro font-semibold uppercase text-muted">
              <Icon name="mail" size={15} />
              Email
            </dt>
            <dd className="min-w-0">
              <a
                href={`mailto:${SUMMIT_EMAIL}`}
                className="font-display text-lead sm:text-h3 text-ink underline decoration-rule decoration-1 underline-offset-[6px] transition-colors duration-300 hover:decoration-accent hover:text-accent break-all"
              >
                {SUMMIT_EMAIL}
              </a>
            </dd>
          </div>
          <div className="row-in visible" style={{ "--i": 1 } as React.CSSProperties}>
            <dt className="mb-2 flex items-center gap-2.5 text-micro font-semibold uppercase text-muted">
              <Icon name="phone" size={15} />
              Phone
            </dt>
            <dd className="font-display text-lead sm:text-h3 text-ink tabular-nums break-words">{PHONE}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
