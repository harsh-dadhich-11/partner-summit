import type { Pillar } from "@/types";

type Props = {
  pillar: Pillar;
  index: number;
};

const labelTint = {
  cyan: "text-teal-mid",
  orange: "text-orange-deep",
  teal: "text-teal-base",
};

export default function PillarRow({ pillar, index }: Props) {
  return (
    <li
      className="row-in visible flex gap-6 border-t border-rule py-9 sm:gap-10"
      style={{ "--i": index } as React.CSSProperties}
    >
      <span
        aria-hidden="true"
        className="font-display text-h2 leading-none text-ink/12 tabular-nums"
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <div>
        <p className={`text-micro font-semibold uppercase ${labelTint[pillar.accent]}`}>
          {pillar.label}
        </p>
        <h3 className="mt-2.5 font-display text-h3 text-ink">{pillar.title}</h3>
        <p className="mt-3 max-w-[52ch] text-small text-muted">{pillar.body}</p>
      </div>
    </li>
  );
}
