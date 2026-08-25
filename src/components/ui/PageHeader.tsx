import type { ReactNode } from "react";

type Props = {
  kicker: string;
  title: string;
  description: ReactNode;
};

export default function PageHeader({ kicker, title, description }: Props) {
  return (
    <header className="bg-teal-dark text-cream">
      <div className="mx-auto max-w-[80rem] px-6 pt-40 pb-20 lg:pt-48 lg:pb-28">
        <p className="fade-in visible mb-6 flex items-center gap-4 text-micro font-semibold uppercase text-cyan-soft">
          <span className="h-px w-8 bg-cyan-soft/40" />
          {kicker}
        </p>
        <h1 className="rise visible max-w-[20ch] font-display text-h1 text-cream">{title}</h1>
        <p className="fade-in visible mt-7 max-w-[52ch] text-lead text-cream/70">{description}</p>
      </div>
    </header>
  );
}
