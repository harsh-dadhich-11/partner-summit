import Photo, { type Shot } from "@/components/ui/Photo";
import type { Pillar } from "@/types";

/** A pillar with its image already resolved — gallery.ts is server-only. */
export type PillarTile = Pillar & { shot: Shot };

/* Kept as plain objects so Tailwind sees whole class names rather than something it has to
   construct at runtime. */
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

export default function PillarCard({ pillar }: { pillar: PillarTile }) {
  return (
    <article
      className={`card-xl flex h-full flex-col overflow-hidden p-4 md:p-5 ${
        panelTint[pillar.accent]
      }`}
    >
      {/*
        Two layers, and which class sits on which matters. `.img-in` clips descendant
        img/video, and the element carrying it is the one PageScripts observes — so a
        clip-path here would leave it reporting an empty intersection rect and the reveal
        would never fire. The shape goes on the child instead, where the three clips compose:
        overflow-hidden rounds the photo, the child's own clip-path carves the dip out of
        that rounded rect, and `.img-in` wipes the photo up on arrival.
      */}
      <div className="img-in visible">
        <div className="card relative aspect-[4/3] w-full overflow-hidden [clip-path:url(#pillar-dip)]">
          <Photo
            shot={pillar.shot}
            sizes="(max-width: 768px) 92vw, (max-width: 1280px) 33vw, 26rem"
          />
        </div>
      </div>

      <div className="mt-4 md:mt-5">
        <p className={`text-micro font-semibold uppercase ${labelTint[pillar.accent]}`}>
          {pillar.label}
        </p>
        <h3 className="mt-2 font-display text-h3 text-ink">{pillar.title}</h3>
        <p className="mt-3 text-small text-ink/75">{pillar.body}</p>
      </div>
    </article>
  );
}
