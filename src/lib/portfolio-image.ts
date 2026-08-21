/**
 * Builds portfolio image URLs. Safe to import from client components — no Node APIs.
 *
 * `card` (400px) and `thumb` (640px) back the grid cards via srcset, `thumb` also
 * backs the modal grid, and `full` (1600px) backs the lightbox. All WebP, served
 * by /api/portfolio/image.
 */
export type ImageVariant = "card" | "thumb" | "full";

export function imageUrl(id: string, variant: ImageVariant = "thumb"): string {
  // Remote fallback photos (Unsplash etc.) are already absolute URLs.
  if (id.startsWith("http")) return id;
  return `/api/portfolio/image?p=${id}&v=${variant}`;
}

/**
 * `srcset` for a grid card: a 400px variant for phones, 640px for high-DPR and
 * wider viewports. Returns undefined for remote fallback photos, which have only
 * one size — listing the same URL under two widths would let the browser pick
 * the "smaller" one and download it at full weight anyway.
 */
export function imageSrcSet(id: string): string | undefined {
  if (!id || id.startsWith("http")) return undefined;
  return `${imageUrl(id, "card")} 400w, ${imageUrl(id, "thumb")} 640w`;
}

/**
 * Matches the two-column card grid; see `portfolio-browser.tsx`. Measured rather
 * than estimated: 182 CSS px at a 412 px viewport (44.2vw) and 402 px once the
 * category sidebar appears and the grid sits in the ~830 px main column.
 */
export const CARD_SIZES = "(max-width: 639px) 45vw, (max-width: 1023px) 46vw, 400px";
