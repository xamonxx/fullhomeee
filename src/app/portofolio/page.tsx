import { PortfolioBrowser } from "./portfolio-browser";
import { getCategories, getProjectsPage, getTotalImages } from "@/lib/portfolio-manifest";
import { FALLBACK_CATEGORIES, fallbackProjectsPage } from "@/lib/portfolio-fallback";

/**
 * Regenerate at most every 5 minutes. Without this the page is prerendered once at
 * build time and photos added later (via `pnpm optimize:images`) would not appear
 * until the next rebuild. The HTML is still served from cache, so this keeps the
 * static-file speed while letting new work show up on its own.
 */
export const revalidate = 300;

/**
 * Server-rendered shell for the portfolio.
 *
 * Page one is read straight from the in-memory manifest and handed to the client
 * as props, so the project cards — and their thumbnail `src` attributes — are in
 * the very first HTML response. The browser can start downloading photos while
 * parsing HTML instead of waiting for the JS bundle, hydration, and two API calls.
 */
export default function PortfolioPage() {
  const categories = getCategories();
  const firstPage = getProjectsPage({ category: "all", page: 1 });

  const usingFallback = firstPage.total === 0;
  const initial = usingFallback ? fallbackProjectsPage() : firstPage;
  const initialCategories = usingFallback ? FALLBACK_CATEGORIES : categories;
  const totalImages = usingFallback
    ? FALLBACK_CATEGORIES.reduce((s, c) => s + c.count, 0)
    : getTotalImages();

  return (
    <PortfolioBrowser
      activeCategory="all"
      heading="Portofolio Proyek Interior &amp; Custom Furniture"
      lead="Dokumentasi pengerjaan interior kustom asli dari klien FULLHOME ID di Bandung Raya &amp; Jabodetabek."
      initialProjects={initial.projects}
      initialTotal={initial.total}
      initialTotalPages={initial.totalPages}
      categories={initialCategories}
      totalImages={totalImages}
    />
  );
}
