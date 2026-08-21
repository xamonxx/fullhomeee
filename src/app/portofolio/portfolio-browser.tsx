"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { X, Search, ArrowLeft, MessageCircle, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { ProjectCardWithSlider } from "@/components/shared/project-card";
import type { Category, Project } from "@/components/shared/portfolio-types";
import { siteConfig } from "@/config/site";

/**
 * framer-motion lives only in the modal. Loading it on demand keeps ~124 KB gz
 * out of the initial page bundle — it is fetched when a visitor opens a project.
 */
const ProjectModal = dynamic(
  () => import("@/components/shared/project-modal").then((m) => m.ProjectModal),
  { ssr: false }
);

interface Props {
  initialProjects: Project[];
  initialTotal: number;
  initialTotalPages: number;
  categories: Category[];
  totalImages: number;
  /** Slug of the category this route renders, or "all" for /portofolio. */
  activeCategory?: string;
  /** Page heading and lead copy, supplied by the route. */
  heading: string;
  lead: string;
  eyebrow?: string;
  /** Rendered between the lead and the grid — category detail copy. */
  children?: React.ReactNode;
}

export function PortfolioBrowser({
  initialProjects,
  initialTotal,
  initialTotalPages,
  categories,
  totalImages,
  activeCategory = "all",
  heading,
  lead,
  eyebrow = "Dokumentasi nyata · 100% asli",
  children,
}: Props) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const search = useDebounce(searchInput, 400);

  const fetchProjects = useCallback(
    async (cat: string, q: string, pg: number, append = false) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          category: cat,
          page: String(pg),
          ...(q ? { search: q } : {}),
        });
        const res = await fetch(`/api/portfolio/projects?${params}`);
        const data = await res.json();
        setProjects((prev) => (append ? [...prev, ...data.projects] : data.projects ?? []));
        setTotalPages(data.totalPages ?? 1);
        setTotal(data.total ?? 0);
        setPage(data.page ?? 1);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Each category is its own prerendered route, so only search still refetches.
  // The server already rendered page one, so the first run must not repeat it.
  const isInitial = useRef(true);
  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
      return;
    }
    setProjects([]);
    fetchProjects(activeCategory, search, 1, false);
  }, [activeCategory, search, fetchProjects]);

  const loadMore = () => {
    if (!loading && page < totalPages) {
      fetchProjects(activeCategory, search, page + 1, true);
    }
  };

  /** "all" lives at /portofolio; every other category has its own route. */
  const categoryHref = (id: string) => (id === "all" ? "/portofolio" : `/portofolio/${id}`);

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Floating Header Bar */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-foreground/15 h-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-full flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-warm-gray hover:text-primary transition-colors text-[10px] font-mono uppercase tracking-[0.18em] shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Kembali Ke Beranda</span>
            <span className="sm:hidden">Kembali</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="font-serif text-base text-primary font-medium">FULLHOME ID</span>
            <span className="text-warm-gray text-sm">/</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-warm-gray">
              Portofolio
            </span>
          </div>

          <a
            href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
              "Halo FULLHOME ID, Saya tertarik dengan portofolio yang saya lihat. Boleh konsultasi?"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-primary hover:text-secondary transition-colors shrink-0 border-b border-foreground/25 hover:border-secondary pb-1"
          >
            <MessageCircle aria-hidden className="w-3.5 h-3.5" />
            {/* `hidden` below the sm breakpoint left this link with no accessible
                name at all on phones — the icon is its only other content.
                `sr-only` keeps the label for assistive tech while staying
                invisible, and `not-sr-only` restores it on wider screens. */}
            <span className="sr-only sm:not-sr-only">Konsultasi Gratis</span>
          </a>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        {/* Page Hero — left-aligned to match the editorial rhythm of the site.
            CSS entrance only; never waits on scroll or hydration. */}
        <div className="pt-14 pb-10 md:pt-20 md:pb-14">
          <p className="enter enter-none chapter-label mb-7">
            <span>{eyebrow}</span>
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-6 gap-x-12 items-end">
            {/* No `.enter` here: this heading is the LCP element, and the entrance
                animation starts it at opacity 0, so Chrome did not count it as
                painted until the fade finished — 684 ms after FCP, measured under
                4x CPU and slow 4G. The lead and stats below still animate in. */}
            <h1 className="lg:col-span-7 font-serif text-[2.4rem] md:text-5xl lg:text-[3.5rem] text-primary font-medium leading-[1.05] tracking-[-0.02em]">
              {heading}
            </h1>

            <p className="enter enter-d2 lg:col-span-5 font-sans text-sm text-warm-gray leading-relaxed measure lg:pb-2">
              {lead}
            </p>
          </div>

          {/* Figures — a band divided by hairlines, computed on the server */}
          <dl className="enter enter-d3 mt-12 md:mt-16 grid grid-cols-3 gap-x-8 border-t border-foreground/20 pt-6">
            {[
              { value: `${total}+`, label: "Proyek" },
              { value: `${totalImages.toLocaleString("id")}+`, label: "Foto dokumentasi" },
              { value: String(categories.length), label: "Kategori" },
            ].map((s) => (
              <div key={s.label}>
                <dt className="font-serif text-2xl md:text-[2rem] leading-none font-medium text-primary tnum">
                  {s.value}
                </dt>
                <dd className="font-mono text-[10px] text-warm-gray mt-2 uppercase tracking-[0.18em]">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {children}

        {/* Search */}
        <div className="mb-10 max-w-md">
          <div className="relative">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray pointer-events-none" />
            {loading && searchInput && (
              <Loader2 className="absolute right-8 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary animate-spin" />
            )}
            <input
              id="portfolio-search"
              type="search"
              autoComplete="off"
              placeholder="Cari nama klien atau lokasi..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-8 pr-10 py-3 bg-transparent border-0 border-b border-foreground/20 text-sm font-sans text-primary placeholder:text-warm-gray focus:outline-none focus:border-secondary transition-colors"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-warm-gray hover:text-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {search && !loading && (
            <p className="font-sans text-xs text-warm-gray mt-3">
              {total} proyek ditemukan untuk &ldquo;{search}&rdquo;
            </p>
          )}
        </div>

        <div className="flex gap-8 pb-24">
          {/* Sidebar categories */}
          {/* Category filter as an index list: hairlines and a marked active row
              instead of a bordered panel of pill buttons. */}
          <aside className="hidden sm:block w-56 flex-shrink-0">
            <nav className="sticky top-20">
              <p className="chapter-label mb-4">
                <span>Kategori</span>
              </p>

              <ul className="rule-list border-t border-foreground/15">
                {[{ id: "all", label: "Semua", count: totalImages }, ...categories].map((cat) => {
                  const active = activeCategory === cat.id;
                  return (
                    <li key={cat.id}>
                      <Link
                        href={categoryHref(cat.id)}
                        // Both category lists render every category, so Next fired
                        // an RSC prefetch for all of them the moment the nav entered
                        // the viewport: 23 requests and 60 KB competing with the
                        // fonts and thumbnails during load. Every target is
                        // prerendered, so navigation stays fast without it.
                        prefetch={false}
                        aria-current={active ? "page" : undefined}
                        className={`group w-full text-left py-3 flex items-baseline justify-between gap-3 text-[13px] transition-colors ${
                          active ? "text-primary font-medium" : "text-warm-gray hover:text-primary"
                        }`}
                      >
                        <span className="flex items-baseline gap-2.5">
                          <span
                            aria-hidden
                            className={`w-3 h-px shrink-0 transition-colors ${
                              active ? "bg-secondary" : "bg-transparent"
                            }`}
                          />
                          {cat.label}
                        </span>
                        <span className="font-mono text-[10px] tabular-nums text-warm-gray shrink-0">
                          {cat.count.toLocaleString("id")}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* Main Grid */}
          <main className="flex-1 min-w-0">
            {/* Mobile category pills */}
            <div className="flex sm:hidden gap-5 overflow-x-auto mb-6 -mx-4 px-4 border-b border-foreground/15 hide-scrollbar">
              {[{ id: "all", label: "Semua" }, ...categories].map((cat) => (
                <Link
                  key={cat.id}
                  href={categoryHref(cat.id)}
                  prefetch={false}
                  aria-current={activeCategory === cat.id ? "page" : undefined}
                  className={`pb-2 text-xs font-medium whitespace-nowrap flex-shrink-0 border-b-2 transition-colors ${
                    activeCategory === cat.id
                      ? "border-secondary text-primary"
                      : "border-transparent text-warm-gray"
                  }`}
                >
                  {cat.label}
                </Link>
              ))}
            </div>

            {/* Result count */}
            {!loading && total > 0 && (
              <div className="mb-5">
                <h2 className="font-serif text-lg text-primary font-medium">
                  {activeCategory === "all"
                    ? "Semua proyek interior"
                    : `Proyek ${categories.find((c) => c.id === activeCategory)?.label ?? heading}`}
                </h2>
                <p className="font-sans text-xs text-warm-gray mt-1">
                  Menampilkan {projects.length} dari {total} proyek
                </p>
              </div>
            )}

            {/* Project Cards Grid With Image Slider */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6">
              {projects.map((proj, i) => (
                <ProjectCardWithSlider
                  key={proj.id}
                  project={proj}
                  index={i}
                  onClick={() => setSelectedProject(proj)}
                />
              ))}
            </div>

            {/* Skeleton loading */}
            {loading && projects.length === 0 && (
              <div className="grid grid-cols-2 gap-3 sm:gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-card border border-foreground/12 rounded-2xl overflow-hidden"
                  >
                    <div className="aspect-[4/5] bg-muted" />
                    <div className="p-3.5 sm:p-4 space-y-2">
                      <div className="h-4 bg-foreground/10 rounded w-3/4" />
                      <div className="h-3 bg-foreground/5 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Loading more */}
            {loading && projects.length > 0 && (
              <div className="flex justify-center py-10">
                <Loader2 className="w-6 h-6 text-secondary animate-spin" />
              </div>
            )}

            {/* Empty state */}
            {!loading && projects.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-14 h-14 rounded-full bg-black/5 flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-warm-gray" />
                </div>
                <p className="font-sans text-warm-gray text-sm">Tidak ada proyek ditemukan</p>
                {(searchInput || activeCategory !== "all") && (
                  <button
                    onClick={() => setSearchInput("")}
                    className="mt-3 font-sans text-xs text-secondary hover:underline"
                  >
                    Reset pencarian
                  </button>
                )}
              </div>
            )}

            {/* Load more button */}
            {!loading && page < totalPages && (
              <div className="mt-16 pt-8 border-t border-foreground/15 flex justify-center">
                <button
                  onClick={loadMore}
                  className="group inline-flex items-baseline gap-2.5 text-[11px] font-mono uppercase tracking-[0.18em] text-primary hover:text-secondary transition-colors border-b border-foreground/25 hover:border-secondary pb-1.5"
                >
                  <span>Muat lebih banyak proyek</span>
                  <span className="text-warm-gray tabular-nums">
                    ({Math.min((totalPages - page) * 20, total - projects.length)} lagi)
                  </span>
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Project Lightbox Modal */}
      {selectedProject && (
        <ProjectModal
          key={selectedProject.id}
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
