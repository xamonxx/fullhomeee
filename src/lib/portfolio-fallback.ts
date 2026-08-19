import { PAGE_SIZE, type ProjectsPage } from "@/lib/portfolio-manifest";
import type { Project } from "@/components/shared/portfolio-types";

/**
 * Demo content shown only when no photo library is present on disk (fresh clone,
 * or `Portofolio/` not yet populated). Never used once real photos are found.
 */
export const FALLBACK_PROJECTS: Project[] = [
  {
    id: "fallback-kitchen-set-minimalis",
    name: "Kitchen Set – Minimalis Warm Oak",
    category: "kitchen-set",
    categoryLabel: "Kitchen Set",
    coverSrc: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop",
    images: [
      { id: "f-k-1", src: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop", filename: "Kitchen 1" },
      { id: "f-k-2", src: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1200&auto=format&fit=crop", filename: "Kitchen 2" },
      { id: "f-k-3", src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop", filename: "Kitchen 3" },
    ],
    imageCount: 18,
  },
  {
    id: "fallback-wardrobe-semiklasik",
    name: "Wardrobe – Semiklasik Glass Door",
    category: "wardrobe",
    categoryLabel: "Wardrobe",
    coverSrc: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop",
    images: [
      { id: "f-w-1", src: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop", filename: "Wardrobe 1" },
      { id: "f-w-2", src: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=1200&auto=format&fit=crop", filename: "Wardrobe 2" },
      { id: "f-w-3", src: "https://images.unsplash.com/photo-1558882224-dda166733046?q=80&w=1200&auto=format&fit=crop", filename: "Wardrobe 3" },
    ],
    imageCount: 16,
  },
];

export const FALLBACK_CATEGORIES = [
  { id: "kitchen-set", label: "Kitchen Set", count: 48 },
  { id: "wardrobe", label: "Wardrobe", count: 38 },
  { id: "bedroom", label: "Bedroom", count: 26 },
  { id: "backdrop-tv", label: "Backdrop TV", count: 18 },
  { id: "apartemen", label: "Apartemen", count: 19 },
  { id: "lemari-bawah-tangga", label: "Lemari Bawah Tangga", count: 22 },
  { id: "interior-toko", label: "Interior Toko", count: 14 },
];

export function fallbackProjectsPage(category = "all", search = "", page = 1): ProjectsPage {
  let filtered = FALLBACK_PROJECTS;
  if (category !== "all") filtered = filtered.filter((p) => p.category === category);
  if (search) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.categoryLabel.toLowerCase().includes(search)
    );
  }
  const total = filtered.length;
  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;
  const offset = (Math.max(page, 1) - 1) * PAGE_SIZE;
  return { projects: filtered.slice(offset, offset + PAGE_SIZE), total, totalPages, page };
}
