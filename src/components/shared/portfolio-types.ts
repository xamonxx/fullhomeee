import { imageUrl } from "@/lib/portfolio-image";

export interface ProjectImage {
  id: string;
  src: string;
  filename: string;
  /** Intrinsic size of the source photo; 0 when unknown (remote fallbacks). */
  width?: number;
  height?: number;
  /** Inline data-URI placeholder shown while the photo loads. */
  blur?: string;
}

export interface Project {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  coverSrc: string;
  images?: ProjectImage[];
  imageCount: number;
}

export interface Category {
  id: string;
  label: string;
  count: number;
}

/** Photos fetched per page inside the modal. */
export const MODAL_PAGE_SIZE = 24;

/** Cards above the fold load eagerly so the LCP image is not deferred. */
export const EAGER_CARDS = 4;

/** Blurred placeholder styling, or a plain tint when the manifest has no blur data. */
export function placeholderStyle(blur?: string): React.CSSProperties | undefined {
  if (!blur) return undefined;
  return {
    backgroundImage: `url("${blur}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}

/** Warm the browser cache for a full-size photo before the user navigates to it. */
export function prefetchFull(img: ProjectImage | undefined) {
  if (!img || typeof window === "undefined") return;
  const preload = new window.Image();
  preload.src = imageUrl(img.id, "full");
}

/** Split "Client Name - Location" into its two display halves. */
export function splitProjectName(name: string): { clientName: string; location: string } {
  const parts = name.split(" - ");
  return { clientName: parts[0], location: parts.slice(1).join(" - ") };
}
