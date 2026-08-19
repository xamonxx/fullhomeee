/**
 * Builds portfolio image URLs. Safe to import from client components — no Node APIs.
 *
 * `thumb` (640px) backs the cards and modal grid; `full` (1600px) backs the lightbox.
 * Both are WebP served by /api/portfolio/image.
 */
export type ImageVariant = "thumb" | "full";

export function imageUrl(id: string, variant: ImageVariant = "thumb"): string {
  // Remote fallback photos (Unsplash etc.) are already absolute URLs.
  if (id.startsWith("http")) return id;
  return `/api/portfolio/image?p=${id}&v=${variant}`;
}
