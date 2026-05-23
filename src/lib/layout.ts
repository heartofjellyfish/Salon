import type { Painting } from "./types";

/**
 * Hanging math for the wall.
 *
 * Paintings are sized relative to one another by their real-world width (cm) and
 * hung on a shared eye-line: each frame's vertical center aligns to the same line
 * (the museum convention of ~150 cm to center), which is what makes a row of
 * different-sized works read as intentional rather than a grid.
 *
 * Sizes are expressed in `cqw` (1% of the wall's inline size) so the composition
 * scales fluidly with the viewport without any JS measurement. The whole row of
 * works spans `COMPOSITION_SPAN` of the wall width; gaps are added between them.
 */
const COMPOSITION_SPAN = 0.64; // share of wall width occupied by the artworks themselves
const GAP_CQW = 4.5; // gap between adjacent works, in cqw
const MAX_WIDTH_CQW = 30; // a single work never spans more than this share of the wall

export interface HangSlot {
  /** Frame width as a share of the wall's inline size (cqw units). */
  widthCqw: number;
  /** width / height — fed to CSS `aspect-ratio`. */
  aspectRatio: number;
}

export function computeHang(paintings: Painting[]): HangSlot[] {
  if (paintings.length === 0) return [];

  const totalCm = paintings.reduce((sum, p) => sum + p.width, 0);
  const gapsTotal = GAP_CQW * Math.max(0, paintings.length - 1);
  const spanCqw = COMPOSITION_SPAN * 100 - gapsTotal;

  return paintings.map((p) => ({
    widthCqw: Math.min((p.width / totalCm) * spanCqw, MAX_WIDTH_CQW),
    aspectRatio: p.width / p.height,
  }));
}

/** "120 × 90 cm" from a painting's real dimensions. */
export function formatDimensions(p: Pick<Painting, "width" | "height">): string {
  return `${p.width} × ${p.height} cm`;
}
