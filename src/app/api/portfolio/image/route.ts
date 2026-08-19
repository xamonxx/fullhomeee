import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import fsp from "fs/promises";
import sharp from "sharp";
import {
  CACHE_IMG_DIR,
  VARIANTS,
  decodePath,
  isPathSafe,
  isVariantName,
  variantFile,
  type VariantName,
} from "@/lib/portfolio-taxonomy";

/**
 * Serves a resized WebP variant of a portfolio photo.
 *
 * Originals are 3000px camera JPEGs (~3 MB each); this route never sends them.
 * Variants are pre-built by `pnpm optimize:images`, but any photo added since the
 * last run is transformed on first request and cached, so the page cannot regress
 * to serving multi-megabyte files.
 */

const ONE_YEAR = "public, max-age=31536000, immutable";

/**
 * Transform on demand for photos added since the last `pnpm optimize:images`.
 *
 * Returns the bytes and caches them when the filesystem allows it. On a read-only
 * deployment (serverless) the write fails — the photo is still served from memory
 * rather than 500-ing, it just gets re-encoded on each request until the variant
 * is baked in at build time.
 */
async function buildVariant(
  srcPath: string,
  variant: VariantName,
  outPath: string
): Promise<Buffer> {
  const { width, quality } = VARIANTS[variant];
  // `rotate()` applies the EXIF orientation these camera originals depend on.
  const buf = await sharp(srcPath)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 5 })
    .toBuffer();

  try {
    await fsp.mkdir(CACHE_IMG_DIR, { recursive: true });
    await fsp.writeFile(outPath, buf);
  } catch (err) {
    console.warn(
      "Portfolio variant cache is not writable; serving without caching:",
      err instanceof Error ? err.message : err
    );
  }

  return buf;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const encoded = searchParams.get("p");

  if (!encoded) {
    return new NextResponse("Missing parameter", { status: 400 });
  }

  const requested = searchParams.get("v") ?? "thumb";
  const variant: VariantName = isVariantName(requested) ? requested : "thumb";

  try {
    const filePath = decodePath(encoded);

    if (!isPathSafe(filePath)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const outPath = variantFile(filePath, variant);

    if (!fs.existsSync(outPath)) {
      if (!fs.existsSync(filePath)) {
        return new NextResponse("Not found", { status: 404 });
      }
      // Serve the freshly encoded bytes directly: on a read-only filesystem the
      // cache write is skipped, so `outPath` may still not exist here.
      const buf = await buildVariant(filePath, variant, outPath);
      return new NextResponse(new Uint8Array(buf), {
        status: 200,
        headers: {
          "Content-Type": "image/webp",
          "Content-Length": String(buf.byteLength),
          "Cache-Control": ONE_YEAR,
        },
      });
    }

    // Stream rather than readFileSync — sync reads block the event loop for every
    // concurrent image request on a grid page.
    const stat = await fsp.stat(outPath);
    const stream = fs.createReadStream(outPath);

    return new NextResponse(stream as unknown as ReadableStream, {
      status: 200,
      headers: {
        "Content-Type": "image/webp",
        "Content-Length": stat.size.toString(),
        "Cache-Control": ONE_YEAR,
      },
    });
  } catch (err) {
    console.error("Portfolio image serve error:", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
