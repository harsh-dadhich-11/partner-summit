import Photo, { type Shot } from "@/components/ui/Photo";
import type { Pillar } from "@/types";

/** A pillar with its image already resolved — gallery.ts is server-only. */
export type PillarSlide = Pillar & { shot: Shot };

/* Same two maps PillarRow carried, kept as plain objects so Tailwind sees whole class
   names rather than something it has to construct at runtime. */
const labelTint = {
  cyan: "text-teal-mid",
  orange: "text-orange-deep",
  teal: "text-teal-base",
};

const panelTint = {
  cyan: "bg-panel-cyan",
  orange: "bg-panel-orange",
  teal: "bg-panel-teal",
};

type Props = {
  pillar: PillarSlide;
  active: boolean;
  /** One of the loop's cloned copies — present for the scroll, hidden from the a11y tree. */
  duplicate?: boolean;
};

export default function PillarCard({ pillar, active, duplicate = false }: Props) {
  return (
    <article
      /* aria-hidden tracks duplication, never dimming: a dimmed neighbour is still one of
         the six and a screen reader should reach it. A clone is the same card twice. */
      aria-hidden={duplicate || undefined}
      className={`card-xl w-[86vw] shrink-0 snap-center overflow-hidden sm:w-[80vw] lg:w-[62rem] ${
        panelTint[pillar.accent]
      } transition-opacity duration-500 ease-out ${active ? "opacity-100" : "opacity-40"}`}
    >
      <div className="grid gap-7 p-6 md:grid-cols-[0.85fr_1fr] md:items-center md:gap-10 lg:p-10">
        {/*
          The clip lives on this wrapper, never on an `.img-in` element — two clip-paths
          on one box fight, and `.img-in` needs its own observed rect intact. The carousel
          reveals as a whole at the section level, so the cards do not animate individually.
        */}
        <div className="card relative aspect-[4/5] w-full overflow-hidden md:[clip-path:url(#pillar-edge)]">
          <Photo shot={pillar.shot} sizes="(max-width: 768px) 86vw, 26rem" />
        </div>

        <div>
          <p className={`text-micro font-semibold uppercase ${labelTint[pillar.accent]}`}>
            {pillar.label}
          </p>
          <h3 className="mt-3 font-display text-h2 text-ink">{pillar.title}</h3>
          <p className="mt-5 max-w-[46ch] text-body text-ink/75">{pillar.body}</p>
        </div>
      </div>
    </article>
  );
}
