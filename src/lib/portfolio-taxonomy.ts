/**
 * Shared portfolio taxonomy: folder-name normalization, project naming, and disk
 * scanning. Imported by both the API routes and scripts/optimize-portfolio.ts so
 * category slugs, labels and photo counts are derived from one source.
 *
 * Must stay free of `next/*` imports — the build script runs it under plain Node.
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";

export const LOCAL_KONTEN = path.join(process.cwd(), "Portofolio", "FULLHOME");

/**
 * Optional second photo library, e.g. an external drive on the studio machine.
 * Was hardcoded to `F:\KONTEN`, a path that only exists on one Windows box and
 * became a dead branch (plus a confusing entry in the path allowlist) anywhere
 * else. Set PORTFOLIO_EXTERNAL_ROOT to enable it; leave unset in production.
 */
export const EXTERNAL_KONTEN = process.env.PORTFOLIO_EXTERNAL_ROOT ?? "";

/**
 * Configured content roots, empties removed.
 *
 * The filter is load-bearing: `path.resolve("")` returns the process cwd, so an
 * unset external root would otherwise widen the allowlist to the entire project
 * directory — package.json, .env and all source included.
 */
export const CONTENT_ROOTS: string[] = [LOCAL_KONTEN, EXTERNAL_KONTEN].filter(
  (r): r is string => typeof r === "string" && r.trim().length > 0
);

export const CACHE_DIR = path.join(process.cwd(), ".portfolio-cache");
export const CACHE_IMG_DIR = path.join(CACHE_DIR, "img");
export const MANIFEST_PATH = path.join(CACHE_DIR, "manifest.json");

/** Variants generated per source photo. Cards/grids use `thumb`, the lightbox uses `full`. */
export const VARIANTS = {
  thumb: { width: 640, quality: 72 },
  full: { width: 1600, quality: 80 },
} as const;

export type VariantName = keyof typeof VARIANTS;

export function isVariantName(v: string): v is VariantName {
  return v === "thumb" || v === "full";
}

/** Browser-displayable source extensions. HEIC is excluded — browsers cannot render it. */
export const IMAGE_RE = /\.(jpg|jpeg|png|webp)$/i;

// WHITELIST: maps raw folder names to clean display labels (Excludes BEFORE-AFTER)
export const CATEGORY_MAP: Record<string, string> = {
  "APARTEMEN": "Apartemen",
  "BACDROP TV": "Backdrop TV",
  "BEDROOM": "Bedroom",
  "INTERIOR TOKO": "Interior Toko",
  "KITCHENSET": "Kitchen Set",
  "LEMARI BAWAH TANGGA": "Lemari Bawah Tangga",
  "WARDROBE": "Wardrobe",
  "LIVINGROOM": "Living Room",
  "SEMI & FULLHOME": "Semi & Full Home",
  "SEMI - FULLHOME": "Semi & Full Home",
  "WORKING SPACE  INTERIOR KANTOR": "Interior Kantor",
  "INTERIOR KANTOR": "Interior Kantor",
  "INTERIOR SALON": "Interior Salon",
  "LOUNDRY ROOM": "Laundry Room",
  "DAILY": "Daily",
  "LIVE STREAMING ROOM": "Live Streaming Room",
};

export const VALID_CAT_NAMES = new Set(Object.keys(CATEGORY_MAP));

export function normalizeCat(raw: string): string {
  return CATEGORY_MAP[raw] ?? raw.replace(/_/g, " ").trim();
}

export function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/** Clean project folder names into display names */
export function cleanProjectName(raw: string): string {
  const cleaned = raw.replace(/^\d+[\.\s]+/, "").trim();
  return cleaned
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ")
    .replace(/\bJakpus\b/gi, "Jakarta Pusat")
    .replace(/\bJaksel\b/gi, "Jakarta Selatan")
    .replace(/\bJakbar\b/gi, "Jakarta Barat")
    .replace(/\bJakut\b/gi, "Jakarta Utara")
    .replace(/\bJaktim\b/gi, "Jakarta Timur")
    .replace(/\bTangsel\b/gi, "Tangerang Selatan")
    .replace(/\bTanggerang\b/gi, "Tangerang")
    .replace(/\bBojonsoang\b/gi, "Bojongsoang")
    .replace(/-/g, "\u2013");
}

export function getValidatedProjectInfo(
  parentCat: string,
  subfolderName: string,
  relativePath: string
) {
  const normPath = relativePath.replace(/\\/g, "/").toLowerCase();
  const cleanedName = cleanProjectName(subfolderName);

  if (
    normPath.includes("wardrobe") ||
    normPath.includes("wardrop") ||
    normPath.includes("lemari") ||
    normPath.includes("09.ibu winda - cibaduyut")
  ) {
    return {
      categorySlug: "wardrobe",
      categoryLabel: "Wardrobe",
      projectName: "Wardrobe \u2013 " + cleanedName,
    };
  }

  if (normPath.includes("kitchen") || normPath.includes("dapur")) {
    return {
      categorySlug: "kitchen-set",
      categoryLabel: "Kitchen Set",
      projectName: "Kitchen Set \u2013 " + cleanedName,
    };
  }

  const label = normalizeCat(parentCat);
  return {
    categorySlug: slugify(label),
    categoryLabel: label,
    projectName: label + " \u2013 " + cleanedName,
  };
}

/** Opaque id for a path, used in URLs. Decoded back to an absolute path by the image route. */
export function encodePath(p: string): string {
  return Buffer.from(p).toString("base64url");
}

export function decodePath(id: string): string {
  return Buffer.from(id, "base64url").toString("utf-8");
}

/** Deterministic short hash for cache filenames — source paths contain spaces and ampersands. */
export function variantHash(absPath: string): string {
  return crypto.createHash("sha1").update(path.resolve(absPath)).digest("hex").slice(0, 16);
}

export function variantFile(absPath: string, variant: VariantName): string {
  return path.join(CACHE_IMG_DIR, variantHash(absPath) + "-" + variant + ".webp");
}

/**
 * Only paths under a known content root may be read or transformed.
 *
 * The boundary must be a separator, not a bare prefix. A plain `startsWith` also
 * accepts sibling directories that merely begin with the root's name — with roots
 * ending in `Portofolio\FULLHOME`, a request for `Portofolio\FULLHOME-leaktest\x.webp`
 * passed validation and the file was served (verified: HTTP 200, 42 KB).
 */
export function isPathSafe(filePath: string): boolean {
  const resolved = path.resolve(filePath);
  return CONTENT_ROOTS.some((root) => {
    const base = path.resolve(root);
    return resolved === base || resolved.startsWith(base + path.sep);
  });
}

function listDirs(dir: string): string[] {
  try {
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name);
  } catch {
    return [];
  }
}

/** Displayable images sitting directly in `dir`, not in its subfolders. */
export function listImagesShallow(dir: string): string[] {
  try {
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((e) => e.isFile() && IMAGE_RE.test(e.name))
      .map((e) => path.join(dir, e.name));
  } catch {
    return [];
  }
}

/** Recursively collect displayable image files. */
export function collectImages(dir: string, results: string[] = []): string[] {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectImages(full, results);
    else if (IMAGE_RE.test(entry.name)) results.push(full);
  }
  return results;
}

export interface ScannedProject {
  /** Absolute path of the project folder. */
  dir: string;
  name: string;
  category: string;
  categoryLabel: string;
  /** Every displayable image in the project, sorted for stable ordering. */
  files: string[];
}

/**
 * Walk a content root and group photos into projects.
 *
 * Layout is either `<root>/<CATEGORY>/...` or `<root>/<year>/<CATEGORY>/...`;
 * KITCHENSET nests one extra level (style, then an optional client folder).
 */
export function scanProjects(rootDir: string): ScannedProject[] {
  const projects: ScannedProject[] = [];
  if (!fs.existsSync(rootDir)) return projects;

  const push = (dir: string, parentCat: string, folderName: string, relPath: string) => {
    const files = collectImages(dir).sort();
    if (files.length === 0) return;
    const info = getValidatedProjectInfo(parentCat, folderName, relPath);
    projects.push({
      dir,
      name: info.projectName,
      category: info.categorySlug,
      categoryLabel: info.categoryLabel,
      files,
    });
  };

  /**
   * Photos lying directly in a folder that also has subfolders. Without this the
   * folder's own photos are dropped, since the walk below only descends into
   * subfolders — that silently hid 16 photos.
   */
  const pushLoose = (dir: string, cat: string) => {
    const files = listImagesShallow(dir).sort();
    if (files.length === 0) return;
    const label = normalizeCat(cat);
    projects.push({
      dir,
      name: label,
      category: slugify(label),
      categoryLabel: label,
      files,
    });
  };

  const entries = listDirs(rootDir);
  const isDirectCategoryRoot = entries.some((e) => VALID_CAT_NAMES.has(e));
  const yearFolders = isDirectCategoryRoot ? ["."] : entries;

  for (const yr of yearFolders) {
    const yearPath = yr === "." ? rootDir : path.join(rootDir, yr);

    for (const cat of listDirs(yearPath)) {
      if (!VALID_CAT_NAMES.has(cat)) continue;

      const catPath = path.join(yearPath, cat);
      const subDirs = listDirs(catPath);

      // Category folder holding only loose photos: the category itself is the project.
      if (subDirs.length === 0) {
        const files = collectImages(catPath).sort();
        if (files.length === 0) continue;
        const label = normalizeCat(cat);
        projects.push({
          dir: catPath,
          name: label,
          category: slugify(label),
          categoryLabel: label,
          files,
        });
        continue;
      }

      pushLoose(catPath, cat);

      if (cat === "KITCHENSET") {
        for (const style of subDirs) {
          const stylePath = path.join(catPath, style);
          const clientDirs = listDirs(stylePath);
          if (clientDirs.length === 0) {
            push(stylePath, cat, style, path.join(yr, cat, style));
          } else {
            pushLoose(stylePath, cat);
            for (const client of clientDirs) {
              push(path.join(stylePath, client), cat, client, path.join(yr, cat, style, client));
            }
          }
        }
        continue;
      }

      for (const subDir of subDirs) {
        push(path.join(catPath, subDir), cat, subDir, path.join(yr, cat, subDir));
      }
    }
  }

  return projects;
}

/** Scan every configured content root. */
export function scanAllProjects(): ScannedProject[] {
  return CONTENT_ROOTS.flatMap((root) => scanProjects(root));
}

// ─── Manifest ────────────────────────────────────────────────────────────────

export interface ManifestImage {
  /** base64url of the absolute source path — also the public image id. */
  id: string;
  filename: string;
  width: number;
  height: number;
  /** Tiny inline data-URI used as a blurred placeholder. */
  blur: string;
}

export interface ManifestProject {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  imageCount: number;
  images: ManifestImage[];
}

export interface Manifest {
  version: number;
  generatedAt: string;
  projects: ManifestProject[];
}

export const MANIFEST_VERSION = 2;
