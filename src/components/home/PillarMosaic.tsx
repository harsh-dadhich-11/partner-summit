import PillarCard, { type PillarTile } from "@/components/home/PillarCard";
import Photo, { type Shot } from "@/components/ui/Photo";

/**
 * A tile is either one of the five pillars or one of the four photographs between them.
 * Discriminated rather than optional-everything, so a photo tile cannot carry half a body.
 */
export type MosaicTile =
  | ({ kind: "content" } & PillarTile)
  | { kind: "photo"; shot: Shot };

/** Tiles per row at the widest breakpoint — the reveal staggers by row, not by tile. */
const COLUMNS = 3;

export default function PillarMosaic({ tiles }: { tiles: MosaicTile[] }) {
  return (
    <>
      {/*
        One clip path for all five content tiles. objectBoundingBox units mean the curve is
        expressed as fractions of whatever box it lands on, so it holds its shape at every
        tile width instead of needing a path per breakpoint.
      */}
      <svg aria-hidden="true" className="absolute h-0 w-0" focusable="false">
        <defs>
          <clipPath id="pillar-dip" clipPathUnits="objectBoundingBox">
            <path d="M0,0 H1 V0.88 Q0.5,1 0,0.88 Z" />
          </clipPath>
        </defs>
      </svg>

      {/*
        No placement classes. The tiles arrive as one flat alternating list, which is what
        puts the five content tiles on the corners and centre of the 3x3 — and one column
        down is simply that same list read in order, pillar then photograph. Reordering by
        breakpoint would be the same layout with more to keep in sync.
      */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        {tiles.map((tile, index) => (
          <div
            key={tile.kind === "content" ? tile.title : `photo-${index}`}
            className="row-in visible"
            style={{ "--i": Math.floor(index / COLUMNS) } as React.CSSProperties}
          >
            {tile.kind === "content" ? (
              <PillarCard pillar={tile} />
            ) : (
              /*
                Two height mechanisms, because there are two situations. From `md` up there
                is a content tile beside this one, so `h-full` matches whichever of them sets
                the row. In one column there is no such sibling — and `Photo` fills with an
                absolutely positioned img, which contributes no in-flow height — so without
                an explicit ratio the tile would collapse onto `min-h-40` and read as a
                letterbox strip. 4:3 is the ratio of the photo inside every content tile, so
                the single column stays one rhythm.
              */
              <div className="img-in visible card-xl relative aspect-[4/3] overflow-hidden md:aspect-auto md:h-full md:min-h-40">
                <Photo
                  shot={tile.shot}
                  sizes="(max-width: 768px) 92vw, (max-width: 1280px) 33vw, 26rem"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
