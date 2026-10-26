"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { INSIGHT_THEMES, type Insight, type InsightTheme } from "@/data/insights";

type Props = { insights: Insight[] };

export default function InsightsLibrary({ insights }: Props) {
  const [theme, setTheme] = useState<InsightTheme | "All">("All");
  const [query, setQuery] = useState("");

  const visibleInsights = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return insights.filter((insight) => {
      const matchesTheme = theme === "All" || insight.theme === theme;
      const searchable = `${insight.title} ${insight.speakers} ${insight.summary} ${insight.takeaways.join(" ")}`.toLowerCase();
      return matchesTheme && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [insights, query, theme]);

  return (
    <section aria-labelledby="insights-library" className="mx-auto max-w-[80rem] px-6 py-16 lg:py-24">
      <div className="flex flex-col gap-7 border-b border-rule pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-micro font-semibold uppercase text-orange-deep">Explore the ideas</p>
          <h2 id="insights-library" className="mt-3 font-display text-h2 text-teal-dark">
            Find the conversation that stayed with you.
          </h2>
        </div>
        <label className="block lg:w-[22rem]">
          <span className="sr-only">Search insights</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search sessions, speakers or ideas"
            className="w-full border border-rule bg-white px-4 py-3 text-small text-ink outline-none transition focus:border-orange-bright"
          />
        </label>
      </div>

      <div className="mt-7 flex flex-wrap gap-2" aria-label="Filter insights by theme">
        {INSIGHT_THEMES.map((option) => {
          const selected = option === theme;
          return (
            <button
              type="button"
              key={option}
              onClick={() => setTheme(option)}
              aria-pressed={selected}
              className={`rounded-full border px-4 py-2 text-micro font-semibold uppercase transition-colors ${selected
                ? "border-teal-dark bg-teal-dark text-white"
                : "border-rule bg-white text-teal-dark hover:border-cyan-bright hover:bg-cyan-bright/10"
                }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      <p className="mt-8 text-small text-muted" aria-live="polite">
        {visibleInsights.length} {visibleInsights.length === 1 ? "insight" : "insights"}
      </p>

      <div className="mt-5 grid gap-px bg-rule md:grid-cols-2 xl:grid-cols-3">
        {visibleInsights.map((insight) => (
          <article key={insight.slug} className="group flex min-h-[22rem] flex-col bg-cream p-7 transition-colors hover:bg-panel-cyan">
            <div className="flex items-center justify-between gap-4 text-micro font-semibold uppercase">
              <span className="text-orange-deep">{insight.theme}</span>
              <span className="text-muted">{insight.format}</span>
            </div>
            <h3 className="mt-7 font-display text-h3 text-teal-dark">{insight.title}</h3>
            <p className="mt-4 text-small text-muted">{insight.summary}</p>
            <p className="mt-5 text-small font-medium text-teal-dark">{insight.speakers}</p>
            <Link
              href={`/insights/${insight.slug}`}
              className="group/cta mt-auto pt-7 text-micro font-semibold uppercase text-teal-dark"
            >
              Read the insight <span className="cta-arrow ml-1" aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </div>

      {visibleInsights.length === 0 && (
        <p className="mt-10 border-l-2 border-orange-bright bg-panel-orange px-5 py-4 text-small text-ink">
          No insight matches that search. Try a broader phrase or another theme.
        </p>
      )}
    </section>
  );
}
