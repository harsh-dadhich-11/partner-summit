import { Icon } from "@/components/ui/Icon";
import type { FaqCategory } from "@/types";

type Props = {
  categories: FaqCategory[];
};

/**
 * Still the native <details> element — it was already the right call, and no disclosure
 * library beats free keyboard support and in-page find. Only the surface changed: ruled
 * rows on the page ground instead of white cards floating on cream.
 */
export default function FaqSection({ categories }: Props) {
  return (
    <div className="max-w-[58rem] border-b border-rule">
      {categories.map((category, index) => (
        <details key={category.title} open={index === 0} className="group border-t border-rule">
          <summary className="flex cursor-pointer list-none items-center gap-5 py-7 [&::-webkit-details-marker]:hidden">
            <span className="text-teal-mid transition-colors duration-300 group-hover:text-accent">
              <Icon name={category.icon} size={20} />
            </span>
            <h2 className="flex-1 font-display text-h3 text-ink transition-colors duration-300 group-hover:text-accent">
              {category.title}
            </h2>
            <span
              aria-hidden="true"
              className="text-lead text-muted transition-transform duration-300 group-open:rotate-180"
            >
              &darr;
            </span>
          </summary>

          <div className="pb-10 sm:pl-10">
            {category.questions.map((entry) => (
              <div key={entry.question} className="mt-9 first:mt-0">
                <h3 className="mb-2 text-small font-semibold text-ink">{entry.question}</h3>
                <div
                  className={
                    entry.layout === "cols" ? "grid gap-x-10 gap-y-2 sm:grid-cols-2" : undefined
                  }
                >
                  {entry.answers.map((answer) => (
                    <p key={answer.text} className="max-w-[68ch] text-small text-muted">
                      {answer.label && (
                        <span className="mt-4 block text-micro font-semibold uppercase text-ink">
                          {answer.label}
                        </span>
                      )}
                      {answer.href ? (
                        <a
                          href={answer.href}
                          className="font-semibold text-accent underline decoration-accent/30 underline-offset-4 transition-colors hover:decoration-accent"
                        >
                          {answer.text}
                        </a>
                      ) : (
                        answer.text
                      )}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
