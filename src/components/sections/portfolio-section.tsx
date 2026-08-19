import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { PortfolioGrid } from "@/components/sections/portfolio-grid";
import { getCategories, getProjectsPage } from "@/lib/portfolio-manifest";
import { FALLBACK_CATEGORIES, fallbackProjectsPage } from "@/lib/portfolio-fallback";

/** Projects shown in the homepage teaser grid. */
const TEASER_COUNT = 6;

/**
 * Server component: the heading, CTA and the first six project cards are rendered
 * into the initial HTML. Only the category filter and modal need client JS, and
 * those live in `PortfolioGrid`.
 */
export function PortfolioSection() {
  const firstPage = getProjectsPage({ category: "all", page: 1 });
  const usingFallback = firstPage.total === 0;

  const projects = (usingFallback ? fallbackProjectsPage().projects : firstPage.projects).slice(
    0,
    TEASER_COUNT
  );
  const categories = usingFallback ? FALLBACK_CATEGORIES : getCategories();

  return (
    <section id="portfolio" className="py-24 md:py-36">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 gap-x-12 items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <SectionHeading
                index="03"
                eyebrow="Karya terpilih"
                title="Portofolio interior & build"
              />
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.1}>
              <p className="font-sans text-sm md:text-base text-warm-gray leading-relaxed measure lg:pb-3">
                Kurasi dokumentasi pengerjaan proyek interior kami di Jabodetabek, Jawa &amp; Bali.
              </p>
            </Reveal>
          </div>
        </div>

        <PortfolioGrid
          initialProjects={projects}
          categories={categories}
          teaserCount={TEASER_COUNT}
        />

        {/* CTA to full portfolio page */}
        <Reveal delay={0.1}>
          <div className="mt-16 pt-8 border-t border-foreground/15 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <p className="font-sans text-sm text-warm-gray measure">
              Lihat seluruh koleksi dokumentasi foto proyek interior lengkap kami.
            </p>
            <Link
              href="/portofolio"
              className="group inline-flex items-center gap-2.5 text-[11px] font-mono uppercase tracking-[0.18em] text-primary hover:text-secondary transition-colors border-b border-foreground/25 hover:border-secondary pb-1.5 w-fit shrink-0"
            >
              <span>Lihat semua proyek portofolio</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
