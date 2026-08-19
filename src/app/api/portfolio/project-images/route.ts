import { NextRequest, NextResponse } from "next/server";
import { findProject } from "@/lib/portfolio-manifest";
import { imageUrl } from "@/lib/portfolio-image";

/** Photos returned per request. The modal pages through the rest on demand. */
const DEFAULT_LIMIT = 24;
const MAX_LIMIT = 60;

export interface ProjectImage {
  id: string;
  src: string;
  filename: string;
  width: number;
  height: number;
  blur: string;
}

const FALLBACK_IMAGES: Record<string, string[]> = {
  "fallback-kitchen-set-minimalis": [
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
  ],
  "fallback-wardrobe-semiklasik": [
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1558882224-dda166733046?q=80&w=1200&auto=format&fit=crop",
  ],
  "default": [
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop",
  ],
};

function fallbackResponse(key: string) {
  const list = FALLBACK_IMAGES[key] ?? FALLBACK_IMAGES["default"];
  const images: ProjectImage[] = list.map((url, idx) => ({
    id: `img-${idx}`,
    src: url,
    filename: `Foto Dokumentasi ${idx + 1}.jpg`,
    width: 0,
    height: 0,
    blur: "",
  }));
  return NextResponse.json({ images, total: images.length, offset: 0, hasMore: false });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ images: [], total: 0, offset: 0, hasMore: false }, { status: 400 });

  if (id.startsWith("fallback-")) return fallbackResponse(id);

  const offset = Math.max(parseInt(searchParams.get("offset") ?? "0", 10) || 0, 0);
  const limit = Math.min(
    Math.max(parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT, 1),
    MAX_LIMIT
  );

  try {
    const project = findProject(id);
    if (!project) return fallbackResponse("default");

    const total = project.images.length;
    const slice = project.images.slice(offset, offset + limit);

    const images: ProjectImage[] = slice.map((img) => ({
      id: img.id,
      src: imageUrl(img.id, "thumb"),
      filename: img.filename,
      width: img.width,
      height: img.height,
      blur: img.blur,
    }));

    return NextResponse.json({
      images,
      total,
      offset,
      hasMore: offset + images.length < total,
    });
  } catch (err) {
    console.error("Project images error:", err);
    return NextResponse.json({ images: [], total: 0, offset: 0, hasMore: false }, { status: 500 });
  }
}
