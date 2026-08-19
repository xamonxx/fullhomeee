import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PortfolioBrowser } from "../portfolio-browser";
import { getCategories, getProjectsPage, getTotalImages } from "@/lib/portfolio-manifest";
import { getCategoryCopy } from "@/data/portfolio-categories";
import { siteConfig } from "@/config/site";

/**
 * One prerendered page per portfolio category.
 *
 * The site previously had two indexable URLs, so it could compete for two themes
 * at most. Each category already has real photos and its own search demand
 * ("kitchen set custom bandung", "lemari bawah tangga"), so each gets a route,
 * its own copy, and its own metadata.
 */

export const revalidate = 300;

/** Prerender every category that actually has photos. */
export function generateStaticParams() {
  return getCategories().map((c) => ({ category: c.id }));
}

/** Unknown slugs 404 rather than rendering an empty shell. */
export const dynamicParams = false;

type Params = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category } = await params;
  const copy = getCategoryCopy(category);
  const meta = getCategories().find((c) => c.id === category);
  if (!copy || !meta) return {};

  return {
    title: copy.seoTitle,
    description: copy.seoDescription,
    keywords: copy.keywords,
    alternates: { canonical: `/portofolio/${category}` },
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: `/portofolio/${category}`,
      title: `${copy.seoTitle} | ${siteConfig.name}`,
      description: copy.seoDescription,
      siteName: siteConfig.name,
    },
  };
}

export default async function CategoryPage({ params }: Params) {
  const { category } = await params;

  const copy = getCategoryCopy(category);
  const categories = getCategories();
  const meta = categories.find((c) => c.id === category);
  if (!copy || !meta) notFound();

  const page = getProjectsPage({ category, page: 1 });

  return (
    <PortfolioBrowser
      activeCategory={category}
      eyebrow={`Portofolio · ${meta.label}`}
      heading={copy.heading}
      lead={copy.intro}
      initialProjects={page.projects}
      initialTotal={page.total}
      initialTotalPages={page.totalPages}
      categories={categories}
      totalImages={getTotalImages()}
    >
      {/* Category-specific substance. Without this each of these routes would be
          the same template with a swapped heading — thin content that Google
          routinely declines to index. */}
      <section className="mb-14 grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-8 border-t border-foreground/15 pt-10">
        <h2 className="lg:col-span-4 font-serif text-xl md:text-2xl text-primary font-medium leading-snug">
          Yang kami kerjakan pada {copy.heading.toLowerCase()}
        </h2>
        <ul className="lg:col-span-8 rule-list">
          {copy.details.map((d) => (
            <li
              key={d}
              className="flex items-baseline gap-3 py-3 font-sans text-sm text-primary/85"
            >
              <span className="w-1 h-1 rounded-full bg-secondary shrink-0 translate-y-[-3px]" />
              <span>{d}</span>
            </li>
          ))}
        </ul>

        <div className="lg:col-span-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
          <p className="font-sans text-sm text-warm-gray measure">
            {meta.count} foto dokumentasi {copy.heading.toLowerCase()} dari pengerjaan nyata
            FULLHOME ID.
          </p>
          <Link
            href="/#contact"
            className="group inline-flex items-center gap-2.5 text-[11px] font-mono uppercase tracking-[0.18em] text-primary hover:text-secondary transition-colors border-b border-foreground/25 hover:border-secondary pb-1.5 w-fit shrink-0"
          >
            <span>Konsultasikan {copy.heading.toLowerCase()} Anda</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </section>
    </PortfolioBrowser>
  );
}
