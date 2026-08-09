import type { ReactNode } from "react";

type Props = {
  kicker: string;
  title: ReactNode;
  description?: ReactNode;
  /** Left is the default — centring every heading is what flattened the old rhythm. */
  align?: "center" | "left";
};

export default function SectionHeading({ kicker, title, description, align = "left" }: Props) {
  const centred = align === "center";

  return (
    <div className={`mb-14 max-w-[46rem] ${centred ? "mx-auto text-center" : ""}`}>
      <p
        className={`fade-in visible mb-6 flex items-center gap-4 text-micro font-semibold uppercase text-accent ${
          centred ? "justify-center" : ""
        }`}
      >
        <span className="h-px w-8 bg-accent/40" />
        {kicker}
      </p>
      <h2 className="rise visible font-display text-h2 text-ink">{title}</h2>
      {description && <p className="fade-in visible mt-6 text-lead text-muted">{description}</p>}
    </div>
  );
}
