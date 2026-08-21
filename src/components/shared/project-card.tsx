"use client";

import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, MapPin, Images, ArrowUpRight } from "lucide-react";
import {
  EAGER_CARDS,
  placeholderStyle,
  splitProjectName,
  type Project,
  type ProjectImage,
} from "@/components/shared/portfolio-types";
import { CARD_SIZES, imageSrcSet } from "@/lib/portfolio-image";

/**
 * Grid card with an embedded image slider.
 *
 * The entrance animation is CSS (`.card-enter`), not framer-motion: this component
 * is server-rendered on first load, and framer-motion's `initial={{ opacity: 0 }}`
 * put `opacity:0` straight into that HTML — the cards existed but stayed invisible
 * until hydration finished.
 */
export function ProjectCardWithSlider({
  project,
  index,
  onClick,
  eagerFirst = true,
}: {
  project: Project;
  index: number;
  onClick: () => void;
  /**
   * Whether the first few cards are worth fetching at high priority. True on
   * /portofolio, where the grid is the first thing on the page; false in the
   * homepage teaser, which sits far below the fold — there the four eager
   * thumbnails were preloaded at high priority and competed with the hero.
   */
  eagerFirst?: boolean;
}) {
  const [activeSlide, setActiveSlide] = useState(0);

  const { clientName, location } = splitProjectName(project.name);

  const slides: ProjectImage[] =
    project.images && project.images.length > 0
      ? project.images
      : [{ id: "cover", src: project.coverSrc, filename: project.name }];

  const currentSlide = slides[activeSlide] || slides[0];
  const eager = eagerFirst && index < EAGER_CARDS;

  // The synthesised fallback slide carries the literal id "cover" and a ready-made
  // URL rather than a real photo id, so it gets no srcset.
  const srcSet = currentSlide.id === "cover" ? undefined : imageSrcSet(currentSlide.id);

  const goTo = useCallback((next: number) => {
    setActiveSlide(next);
  }, []);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    goTo((activeSlide - 1 + slides.length) % slides.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    goTo((activeSlide + 1) % slides.length);
  };

  return (
    <article
      className="card-enter cursor-pointer group flex flex-col h-full bg-card border border-foreground/12 rounded-2xl overflow-hidden shadow-warm hover:border-foreground/25 hover:shadow-md transition-[border-color,box-shadow] duration-300"
      style={{ "--i": Math.min(index, 10) } as React.CSSProperties}
      onClick={onClick}
    >
      <div className="flex flex-col h-full">
        {/* Slider Container. 4:5 matches the source photos exactly (3024x3780),
            so object-cover crops nothing. */}
        <div
          className="relative aspect-[4/5] w-full overflow-hidden bg-muted group/slider"
          style={placeholderStyle(currentSlide.blur)}
        >
          {/* The blurred placeholder sits behind the photo, so the photo itself is
              never hidden. Gating it on an `onLoad` handler broke this: images now
              finish loading before React hydrates, so that event never fired and the
              card was stuck showing only the blur — and with JS off, nothing at all. */}
          <img
            key={currentSlide.src}
            src={currentSlide.src}
            srcSet={srcSet}
            sizes={srcSet ? CARD_SIZES : undefined}
            // `project.name` already opens with the category, so prefixing it
            // produced "Wardrobe – Wardrobe" — visible on screen whenever an
            // image failed to load.
            alt={`Foto proyek ${project.name}`}
            width={currentSlide.width || undefined}
            height={currentSlide.height || undefined}
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : "auto"}
            decoding="async"
            className="w-full h-full object-cover"
          />

          {/* Badges share one flex row so they can never overlap. Previously both
              were absolutely positioned, and a long label ("Lemari Bawah Tangga")
              ran underneath the photo-count badge and got clipped mid-word. */}
          <div className="absolute inset-x-2.5 top-2.5 z-10 flex items-start justify-between gap-2">
            <span className="min-w-0 truncate text-[9px] sm:text-[10px] font-mono tracking-[0.14em] uppercase text-primary bg-background/90 backdrop-blur-md px-2 py-1 rounded-full border border-foreground/10">
              {project.categoryLabel}
            </span>
            <span className="shrink-0 text-[9px] sm:text-[10px] font-mono tracking-[0.14em] text-white bg-black/60 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1.5">
              <Images className="w-3 h-3" />
              <span className="tabular-nums">{project.imageCount}</span>
              <span className="hidden sm:inline">Foto</span>
            </span>
          </div>

          {/* Slider Prev / Next Controls */}
          {slides.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Sebelumnya"
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/75 text-white transition-all opacity-0 group-hover/slider:opacity-100 z-20 backdrop-blur-xs hover:scale-105"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Berikutnya"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/75 text-white transition-all opacity-0 group-hover/slider:opacity-100 z-20 backdrop-blur-xs hover:scale-105"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Slider Dots */}
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 px-2 py-1 rounded-full bg-black/30 backdrop-blur-xs">
                {slides.map((_, i) => (
                  <span
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      goTo(i);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === activeSlide ? "w-4 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Card Info. Titles wrap to two lines instead of truncating — "Lemari
            Bawah Tangga" used to render as "Lemari Bawah …". */}
        <div className="p-3.5 sm:p-4 flex items-start justify-between gap-3 flex-1">
          <div className="min-w-0">
            <h3 className="font-serif text-sm sm:text-base leading-snug font-medium text-primary group-hover:text-secondary transition-colors line-clamp-2">
              {clientName}
            </h3>
            {location && (
              <p className="flex items-start gap-1.5 font-sans text-[11px] sm:text-xs text-warm-gray mt-1.5">
                <MapPin className="w-3 h-3 text-secondary shrink-0 mt-0.5" />
                <span className="line-clamp-1">{location}</span>
              </p>
            )}
          </div>
          <ArrowUpRight className="w-4 h-4 text-warm-gray group-hover:text-primary transition-all shrink-0 mt-0.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </article>
  );
}
