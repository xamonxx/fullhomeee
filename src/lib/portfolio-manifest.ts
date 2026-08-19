import fs from "fs";
import {
  MANIFEST_PATH,
  MANIFEST_VERSION,
  encodePath,
  scanAllProjects,
  type Manifest,
  type ManifestProject,
} from "@/lib/portfolio-taxonomy";
import { imageUrl } from "@/lib/portfolio-image";
import type { Project, ProjectImage } from "@/components/shared/portfolio-types";

/**
 * Server-side cache for the portfolio manifest.
 *
 * Before this, every request to /api/portfolio/{projects,categories,project-images}
 * walked both content roots recursively and stat'd each file. The portfolio page
 * fires those endpoints on mount, on every category switch and on every debounced
 * keystroke, so the same directory tree was re-read constantly. The manifest is
 * built once by `pnpm optimize:images`; here it is parsed once and reused.
 */

const TTL_MS = 5 * 60 * 1000;

let cached: Manifest | null = null;
let cachedAt = 0;
let cachedMtime = 0;

/**
 * Fallback when .portfolio-cache/manifest.json is absent (script not run yet).
 * Yields the same project shape by scanning disk, minus dimensions and blur data.
 */
function scanFallback(): Manifest {
  const projects: ManifestProject[] = scanAllProjects().map((p) => ({
    id: encodePath(p.dir),
    name: p.name,
    category: p.category,
    categoryLabel: p.categoryLabel,
    imageCount: p.files.length,
    images: p.files.map((f) => ({
      id: encodePath(f),
      filename: f.split(/[\\/]/).pop() ?? "",
      width: 0,
      height: 0,
      blur: "",
    })),
  }));

  return { version: MANIFEST_VERSION, generatedAt: new Date().toISOString(), projects };
}

/** Returns the manifest, re-reading only when it changed on disk or the TTL lapsed. */
export function getManifest(): Manifest {
  const now = Date.now();

  let mtime = 0;
  try {
    mtime = fs.statSync(MANIFEST_PATH).mtimeMs;
  } catch {
    // No manifest on disk — fall back to scanning, but still honour the TTL so a
    // missing manifest does not reintroduce a full disk walk on every request.
    if (cached && now - cachedAt < TTL_MS) return cached;
    cached = scanFallback();
    cachedAt = now;
    cachedMtime = 0;
    return cached;
  }

  if (cached && mtime === cachedMtime && now - cachedAt < TTL_MS) {
    return cached;
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8")) as Manifest;
    if (parsed.version !== MANIFEST_VERSION) throw new Error("manifest version mismatch");
    cached = parsed;
    cachedAt = now;
    cachedMtime = mtime;
    return cached;
  } catch (err) {
    console.error("Portfolio manifest unreadable, scanning disk instead:", err);
    cached = scanFallback();
    cachedAt = now;
    cachedMtime = 0;
    return cached;
  }
}

/** Projects sorted by photo count, as the grid expects. */
export function getProjects(): ManifestProject[] {
  return [...getManifest().projects].sort((a, b) => b.imageCount - a.imageCount);
}

export function findProject(id: string): ManifestProject | undefined {
  return getManifest().projects.find((p) => p.id === id);
}

/** Category list aggregated from projects, so counts always match the grid. */
export function getCategories(): { id: string; label: string; count: number }[] {
  const map = new Map<string, { label: string; count: number }>();

  for (const p of getManifest().projects) {
    const existing = map.get(p.category);
    if (existing) existing.count += p.imageCount;
    else map.set(p.category, { label: p.categoryLabel, count: p.imageCount });
  }

  return Array.from(map.entries())
    .map(([id, { label, count }]) => ({ id, label, count }))
    .filter((c) => c.count > 0 && c.id !== "before-after")
    .sort((a, b) => b.count - a.count);
}

/** Case-insensitive match on project name, category label and folder-derived text. */
export function matchesSearch(p: ManifestProject, search: string): boolean {
  if (!search) return true;
  const q = search.toLowerCase();
  return (
    p.name.toLowerCase().includes(q) ||
    p.categoryLabel.toLowerCase().includes(q)
  );
}

// ─── Page DTOs ───────────────────────────────────────────────────────────────

export const PAGE_SIZE = 20;

/** Slides preloaded into each grid card. The card's dot indicator caps out around here. */
const CARD_SLIDES = 5;

export interface ProjectsPage {
  projects: Project[];
  total: number;
  totalPages: number;
  page: number;
}

/**
 * Builds one page of grid-ready projects.
 *
 * Shared by the API route and the server-rendered portfolio page so both emit
 * exactly the same shape — the page renders page 1 directly from here instead of
 * making the browser fetch it after hydration.
 */
export function getProjectsPage({
  category = "all",
  search = "",
  page = 1,
}: { category?: string; search?: string; page?: number } = {}): ProjectsPage {
  const q = search.toLowerCase().trim();
  const matched = getProjects().filter(
    (p) => (category === "all" || p.category === category) && matchesSearch(p, q)
  );

  const total = matched.length;
  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const offset = (safePage - 1) * PAGE_SIZE;

  // Only the slides the card can actually show are serialized — sending every
  // photo of every project bloats the payload for no visible benefit.
  const projects: Project[] = matched.slice(offset, offset + PAGE_SIZE).map((p) => {
    const images: ProjectImage[] = p.images.slice(0, CARD_SLIDES).map((img, i) => ({
      id: img.id,
      src: imageUrl(img.id, "thumb"),
      filename: img.filename,
      width: img.width,
      height: img.height,
      // Only the visible slide needs a placeholder. Shipping one per slide added
      // ~600 bytes each to the HTML for images nobody has scrolled to yet; later
      // slides fall back to the skeleton the card already renders.
      blur: i === 0 ? img.blur : undefined,
    }));

    return {
      id: p.id,
      name: p.name,
      category: p.category,
      categoryLabel: p.categoryLabel,
      coverSrc: images[0]?.src ?? "",
      images,
      imageCount: p.imageCount,
    };
  });

  return { projects, total, totalPages, page: safePage };
}

/** Total photo count across every category, for the hero stats. */
export function getTotalImages(): number {
  return getCategories().reduce((sum, c) => sum + c.count, 0);
}
