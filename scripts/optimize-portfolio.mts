/**
 * Generates WebP variants + a metadata manifest for every portfolio photo.
 *
 *   pnpm optimize:images          # incremental (default)
 *   pnpm optimize:images --force  # rebuild every variant
 *
 * Source photos are never modified or deleted. Output lives in .portfolio-cache/
 * (gitignored) and can be regenerated at any time. Run under plain Node — this
 * file relies on Node's native TypeScript type stripping (Node >= 23.6).
 */
import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import sharp from "sharp";

import {
  CACHE_DIR,
  CACHE_IMG_DIR,
  MANIFEST_PATH,
  MANIFEST_VERSION,
  VARIANTS,
  LOCAL_KONTEN,
  CONTENT_ROOTS,
  encodePath,
  variantFile,
  scanAllProjects,
  type Manifest,
  type ManifestImage,
  type ManifestProject,
  type VariantName,
} from "../src/lib/portfolio-taxonomy.ts";

const FORCE = process.argv.includes("--force");
const CONCURRENCY = 4;

const HEIC_RE = /\.heic$/i;

interface Stats {
  processed: number;
  skipped: number;
  /** Source/output bytes for photos transformed on THIS run — the savings ratio. */
  sourceBytes: number;
  outputBytes: number;
  /** Bytes of every variant in the cache, fresh or reused. */
  totalOutputBytes: number;
  failures: { file: string; reason: string }[];
}

const stats: Stats = {
  processed: 0,
  skipped: 0,
  sourceBytes: 0,
  outputBytes: 0,
  totalOutputBytes: 0,
  failures: [],
};

function mb(bytes: number): string {
  return (bytes / 1048576).toFixed(1) + " MB";
}

function rel(p: string): string {
  return path.relative(process.cwd(), p).replace(/\\/g, "/");
}

/** A variant is current when it exists and is not older than its source. */
function isFresh(srcPath: string, outPath: string, srcMtime: number): boolean {
  if (FORCE) return false;
  try {
    return fs.statSync(outPath).mtimeMs >= srcMtime;
  } catch {
    return false;
  }
}

/** Build both variants + a blurred placeholder for one photo. */
async function processImage(srcPath: string): Promise<ManifestImage | null> {
  const srcStat = await fsp.stat(srcPath);
  const outputs: Record<VariantName, string> = {
    thumb: variantFile(srcPath, "thumb"),
    full: variantFile(srcPath, "full"),
  };

  const allFresh = (Object.keys(outputs) as VariantName[]).every((v) =>
    isFresh(srcPath, outputs[v], srcStat.mtimeMs)
  );

  // `rotate()` with no argument applies the EXIF orientation, which these camera
  // originals rely on — without it portrait shots come out sideways.
  const meta = await sharp(srcPath).rotate().metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;

  if (!allFresh) {
    for (const variant of Object.keys(VARIANTS) as VariantName[]) {
      const { width: w, quality } = VARIANTS[variant];
      await sharp(srcPath)
        .rotate()
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality, effort: 5 })
        .toFile(outputs[variant]);
    }
    stats.processed++;
    stats.sourceBytes += srcStat.size;
  } else {
    stats.skipped++;
  }

  for (const variant of Object.keys(outputs) as VariantName[]) {
    const size = (await fsp.stat(outputs[variant])).size;
    stats.totalOutputBytes += size;
    if (!allFresh) stats.outputBytes += size;
  }

  // LQIP: a 20px WebP inlined into the manifest, shown while the real photo loads.
  const blurBuf = await sharp(srcPath)
    .rotate()
    .resize({ width: 20 })
    .webp({ quality: 45 })
    .toBuffer();

  return {
    id: encodePath(srcPath),
    filename: path.basename(srcPath),
    width,
    height,
    blur: "data:image/webp;base64," + blurBuf.toString("base64"),
  };
}

/** Run tasks with a bounded worker pool — these originals are ~6 MB each in memory. */
async function pool<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const i = cursor++;
      results[i] = await fn(items[i]);
    }
  });
  await Promise.all(workers);
  return results;
}

/**
 * HEIC cannot be shown by browsers, so these photos are invisible on the site today.
 * Try to decode each one into a sibling JPEG, which the normal scan then picks up.
 * Prebuilt sharp usually ships without a HEIC decoder (licensing), so failure here
 * is expected and reported rather than fatal.
 */
async function convertHeic(): Promise<void> {
  const roots = CONTENT_ROOTS.filter((r) => fs.existsSync(r));
  const found: string[] = [];

  const walk = (dir: string) => {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (HEIC_RE.test(e.name)) found.push(full);
    }
  };
  roots.forEach(walk);

  if (found.length === 0) return;

  console.log(`\nMenemukan ${found.length} file HEIC, mencoba konversi ke JPEG...`);

  for (const src of found) {
    const dest = src.replace(HEIC_RE, ".jpg");
    if (fs.existsSync(dest)) continue;
    try {
      await sharp(src).rotate().jpeg({ quality: 92 }).toFile(dest);
      console.log(`  ok  ${rel(dest)}`);
    } catch (err) {
      // Leave the original untouched; a partial output would poison the next scan.
      try {
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
      } catch {}
      stats.failures.push({
        file: rel(src),
        reason: err instanceof Error ? err.message.split("\n")[0] : String(err),
      });
    }
  }
}

async function main() {
  const started = Date.now();

  await fsp.mkdir(CACHE_IMG_DIR, { recursive: true });

  await convertHeic();

  const projects = scanAllProjects();
  if (projects.length === 0) {
    console.error(
      `\nTidak ada foto ditemukan. Periksa folder: ${rel(LOCAL_KONTEN)}`
    );
    process.exit(1);
  }

  const totalFiles = projects.reduce((n, p) => n + p.files.length, 0);
  console.log(
    `\nMemproses ${totalFiles} foto dari ${projects.length} proyek` +
      (FORCE ? " (--force: rebuild semua)" : "") +
      "...\n"
  );

  const manifestProjects: ManifestProject[] = [];
  let done = 0;

  for (const proj of projects) {
    const images = await pool(proj.files, CONCURRENCY, async (file) => {
      try {
        const img = await processImage(file);
        done++;
        if (done % 10 === 0 || done === totalFiles) {
          process.stdout.write(`  ${done}/${totalFiles} foto\r`);
        }
        return img;
      } catch (err) {
        done++;
        stats.failures.push({
          file: rel(file),
          reason: err instanceof Error ? err.message.split("\n")[0] : String(err),
        });
        return null;
      }
    });

    const ok = images.filter((i): i is ManifestImage => i !== null);
    if (ok.length === 0) continue;

    manifestProjects.push({
      id: encodePath(proj.dir),
      name: proj.name,
      category: proj.category,
      categoryLabel: proj.categoryLabel,
      imageCount: ok.length,
      images: ok,
    });
  }

  const manifest: Manifest = {
    version: MANIFEST_VERSION,
    generatedAt: new Date().toISOString(),
    projects: manifestProjects,
  };
  await fsp.writeFile(MANIFEST_PATH, JSON.stringify(manifest));

  const manifestSize = (await fsp.stat(MANIFEST_PATH)).size;
  const elapsed = ((Date.now() - started) / 1000).toFixed(1);

  console.log("\n");
  console.log("  Selesai dalam " + elapsed + "s");
  console.log("  Diproses          : " + stats.processed + " foto");
  console.log("  Dilewati (cache)  : " + stats.skipped + " foto");
  if (stats.processed > 0) {
    console.log("  Sumber diproses   : " + mb(stats.sourceBytes) + " -> " + mb(stats.outputBytes));
  }
  console.log("  Total varian WebP : " + mb(stats.totalOutputBytes));
  console.log("  Manifest          : " + mb(manifestSize));
  console.log("  Output            : " + rel(CACHE_DIR) + "/");

  if (stats.processed > 0 && stats.sourceBytes > 0) {
    const ratio = (1 - stats.outputBytes / stats.sourceBytes) * 100;
    console.log("  Penghematan       : " + ratio.toFixed(1) + "% lebih kecil");
  }

  if (stats.failures.length > 0) {
    console.log("\n  " + stats.failures.length + " file gagal diproses:\n");
    for (const f of stats.failures) {
      console.log("    - " + f.file);
      console.log("      " + f.reason);
    }
    console.log(
      "\n  File HEIC memang umumnya gagal: build sharp prebuilt tidak menyertakan\n" +
        "  decoder HEIC karena lisensi. Convert manual ke JPEG (buka di Windows Photos\n" +
        "  -> Save as -> JPG, simpan di folder yang sama), lalu jalankan ulang perintah ini."
    );
  }

  console.log("");
}

main().catch((err) => {
  console.error("\nGagal:", err);
  process.exit(1);
});
