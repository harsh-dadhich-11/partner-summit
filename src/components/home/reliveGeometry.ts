/**
 * The fold. Tiles sit on an invisible curve running toward the viewer: the one at the
 * centre of the stage is flat and face-on, and its neighbours rotate on X until they read
 * as trapezoids — far edge tipped away, near edge tipped toward the camera.
 *
 * The signature of the effect is that a neighbour is *wider at its near edge than the
 * centre tile is*, because that edge is closer to the lens. Neighbours that are uniformly
 * smaller than the centre mean the perspective is not doing any work and the whole thing
 * collapses into a stack of shrinking rectangles.
 *
 * Everything here is pure: `d` in, numbers out. No DOM, no React, no units beyond the
 * pixel height it is handed.
 */

/* ---------------------------------------------------------------------------
   The four constants that shape the curve.

   The brief specified (0.78, 0.78 | 0.10, 2.8 | 1.7) alongside a calibration table
   asking for ~208px projected height at d=1 with edges at ~687/~568px. Those two do
   not agree: run the brief's own numbers through the projection below and d=1 comes
   out 137px tall, not 208. The table's heights are TILE_H x cos(rotX) — foreshortening
   with the perspective divergence in Y left out. Because a d=1 tile sits ~306px off the
   perspective origin, its near edge scales up (x1.08) while its far edge scales down
   (x0.89), and the two ends pull the projected box in opposite directions.

   Shipping the brief's constants would have cost two things it explicitly asked for:
   tiles would sit 28px *apart* rather than overlapping, and past |d| ~ 2.3 the projected
   height goes negative — the tile turns inside out, inside the render window.

   These values hit the calibration table instead. At the reference 640x400 tile, d=1
   lands at 211px tall, 692px near, 578px far — all within 1.8% of the target — overlapping
   the centre tile by 110px, and not inverting until |d| = 2.97, well outside the window.
   Tune them here; nothing downstream hard-codes a number.
   --------------------------------------------------------------------------- */

/** Vertical placement, as a fraction of tile height. Lower = more overlap.
 *
 *  This shipped at 0.60 — the value that hides about a third of each neighbour, matching
 *  the reference — with 0.52 rejected for burying roughly half instead. It is back at 0.52
 *  deliberately, and the reason is size rather than composition: the fold's vertical
 *  footprint is what caps how large a tile can be (see measure() in ReliveFold), and
 *  tightening the overlap here is most of a 21% saving on that footprint, which goes
 *  straight into the photographs. 0.60 is the value to come back to if the deeper burial
 *  reads as too much — it costs about a fifth of the tile size to do so. */
export const SPREAD = 0.52;
export const SPREAD_EXP = 0.85;

/** How fast tiles recede. A higher exponent pulls the far ones away sooner. */
export const DEPTH = 0.07;
export const DEPTH_EXP = 1.9;

/** How hard the fold bends. rotX asymptotes at 90deg however large this gets. */
export const FOLD = 1.25;

/** Beyond this distance from centre a tile stops being painted.
 *
 *  Visibility alone would justify ~2.2, where the projected height finally reaches single
 *  digits. This cuts earlier, at 25% of tile height, and the reason is vertical budget:
 *  every layer the window admits is stage height that the centre tile then cannot have.
 *  The two faintest stripes at each end were worth less than the size of every tile in
 *  the fold. Raising this back toward 2.2 means lowering the height factor in measure()
 *  to match, or the outermost tiles clip against the stage. */
export const RENDER_WINDOW = 1.7;

/** Perspective as a multiple of tile height — shallower on narrow screens. */
export const PERSPECTIVE = 4.3;
export const PERSPECTIVE_NARROW = 3.2;

/** Tiles are 1.6:1, which is not 16:9 — the reference frames are squarer than video. */
export const ASPECT = 1.6;

export type TilePlacement = {
  /** Vertical offset from the stage centre, px. */
  y: number;
  /** Depth, px. Always <= 0 — the centre tile is the closest thing to the camera. */
  z: number;
  /** Rotation about X, degrees. */
  rotX: number;
  /** Centre tile paints on top, and the stack falls away symmetrically from there. */
  zIndex: number;
  /** The composed transform, ready to write straight to `node.style.transform`. */
  transform: string;
};

/**
 * Place one tile.
 *
 * @param d      signed distance from the centre of the stage, in tiles. 0 is dead centre;
 *               the sign decides which way the tile folds.
 * @param tileH  the tile's unprojected height in px.
 */
export function tilePlacement(d: number, tileH: number): TilePlacement {
  const a = Math.abs(d);
  const s = Math.sign(d);

  const y = s * (SPREAD * tileH) * Math.pow(a, SPREAD_EXP);
  const z = -(DEPTH * tileH) * Math.pow(a, DEPTH_EXP);
  const rotX = -s * 90 * (2 / Math.PI) * Math.atan(FOLD * a);

  return {
    y,
    z,
    rotX,
    zIndex: Math.round(1000 - a * 100),
    /* Order matters, and this is the order: shift into place in the parent's plane, then
       push back along Z, then fold. Rotating before the Z push is what keeps the hinge on
       the tile's own centre line rather than somewhere out in the scene. */
    transform:
      `translate3d(-50%, calc(-50% + ${y.toFixed(2)}px), 0) ` +
      `translateZ(${z.toFixed(2)}px) rotateX(${rotX.toFixed(3)}deg)`,
  };
}

export type ProjectedBox = {
  /** Screen-space height of the tile after projection, px. Negative means inverted. */
  height: number;
  /** Screen-space width of the edge nearest the camera, px. */
  widthNear: number;
  /** Screen-space width of the edge furthest from the camera, px. */
  widthFar: number;
};

/**
 * What the browser will actually draw, given the placement above.
 *
 * Nothing calls this at runtime — the browser does this arithmetic itself. It exists so the
 * constants stay checkable: change one, call this at d = 0, 0.5, 1, 2 and read whether the
 * near edge is still flaring wider than the centre tile and whether `height` is still
 * positive at the edge of the render window. Both are easy to break by eye and obvious here.
 *
 * A CSS `perspective` of P scales everything by P / (P - z) about the perspective origin,
 * which sits at the stage centre — so a tile's own offset from that centre feeds into the
 * projection, not just its depth.
 */
export function projectedBox(
  d: number,
  tileH: number,
  tileW: number,
  perspective: number
): ProjectedBox {
  const { y, z, rotX } = tilePlacement(d, tileH);
  const theta = (rotX * Math.PI) / 180;
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);

  /* One edge of the tile, `v` px from its centre line along the (unrotated) height. */
  const edge = (v: number) => {
    const worldY = y + v * cos;
    const worldZ = z + v * sin;
    const scale = perspective / (perspective - worldZ);
    return { screenY: worldY * scale, width: tileW * scale };
  };

  const top = edge(-tileH / 2);
  const bottom = edge(tileH / 2);

  /* For d > 0 the tile is below centre and tips its top edge forward; for d < 0 it is the
     bottom edge. `near` is whichever ended up closer to the camera. */
  const [near, far] = top.width >= bottom.width ? [top, bottom] : [bottom, top];

  return {
    height: bottom.screenY - top.screenY,
    widthNear: near.width,
    widthFar: far.width,
  };
}
