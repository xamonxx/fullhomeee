"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, MessageCircle, MapPin, Loader2 } from "lucide-react";
import { imageUrl } from "@/lib/portfolio-image";
import { siteConfig } from "@/config/site";
import {
  MODAL_PAGE_SIZE,
  placeholderStyle,
  prefetchFull,
  splitProjectName,
  type Project,
  type ProjectImage,
} from "@/components/shared/portfolio-types";

/**
 * Project modal and lightbox — the only place framer-motion still earns its
 * ~124 KB, since these genuinely need enter/exit transitions via AnimatePresence.
 *
 * Load this with `next/dynamic` so the bundle is fetched when a visitor first
 * opens a project, not during initial page load.
 */

// ─── Lightbox ─────────────────────────────────────────────────────────────────
export function Lightbox({
  images,
  index,
  projectName,
  onClose,
  onPrev,
  onNext,
}: {
  images: ProjectImage[];
  index: number;
  projectName: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [onClose, onPrev, onNext]);

  // Neighbours are fetched ahead so arrow navigation does not wait on the network.
  useEffect(() => {
    if (images.length < 2) return;
    prefetchFull(images[(index + 1) % images.length]);
    prefetchFull(images[(index - 1 + images.length) % images.length]);
  }, [images, index]);

  const img = images[index];
  if (!img) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/97 backdrop-blur-xl"
      onClick={onClose}
    >
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-10">
        <p className="font-sans text-xs sm:text-sm text-white/80 font-mono tracking-wider truncate max-w-xs">{projectName}</p>
        <span className="font-mono text-xs text-white/60 mx-4 shrink-0 bg-white/10 px-3 py-1 rounded-full border border-white/10">
          {index + 1} / {images.length}
        </span>
        <button
          onClick={onClose}
          aria-label="Tutup"
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        aria-label="Sebelumnya"
        className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all z-10 hover:scale-105"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <motion.div
        key={img.id}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="max-h-[88vh] max-w-[90vw] flex items-center justify-center p-2"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl(img.id, "full")}
          alt={img.filename}
          width={img.width || undefined}
          height={img.height || undefined}
          decoding="async"
          fetchPriority="high"
          className="max-h-[88vh] max-w-[90vw] object-contain rounded-2xl border border-white/10 shadow-2xl"
        />
      </motion.div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        aria-label="Berikutnya"
        className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all z-10 hover:scale-105"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </motion.div>
  );
}

// ─── Modal Grid Item ──────────────────────────────────────────────────────────
export function ModalGridItem({
  img,
  index,
  onClick,
}: {
  img: ProjectImage;
  index: number;
  onClick: () => void;
}) {
  return (
    <div
      className="card-enter group relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted cursor-pointer border border-foreground/10 hover:border-foreground/30 transition-all duration-300 shadow-xs hover:shadow-md"
      style={{ ...placeholderStyle(img.blur), "--i": Math.min(index, 12) } as React.CSSProperties}
      onClick={onClick}
      onMouseEnter={() => prefetchFull(img)}
    >
      {!img.blur && (
        <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/10 animate-pulse" />
      )}
      <img
        src={img.src}
        alt={img.filename}
        width={img.width || undefined}
        height={img.height || undefined}
        loading="lazy"
        decoding="async"
        className="relative w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
        <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 drop-shadow-md" />
      </div>
    </div>
  );
}

// ─── Project Modal ────────────────────────────────────────────────────────────
export function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setImages([]);

    fetch(`/api/portfolio/project-images?id=${project.id}&limit=${MODAL_PAGE_SIZE}&offset=0`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        setImages(d.images ?? []);
        setTotal(d.total ?? 0);
        setHasMore(Boolean(d.hasMore));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [project.id]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const res = await fetch(
        `/api/portfolio/project-images?id=${project.id}&limit=${MODAL_PAGE_SIZE}&offset=${images.length}`
      );
      const data = await res.json();
      setImages((prev) => [...prev, ...(data.images ?? [])]);
      setHasMore(Boolean(data.hasMore));
    } finally {
      setLoadingMore(false);
    }
  }, [project.id, images.length, hasMore, loadingMore]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const closeLightbox = () => setLightboxIndex(null);
  const prevLb = () => setLightboxIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : null));
  const nextLb = () => setLightboxIndex((i) => (i !== null ? (i + 1) % images.length : null));

  const { clientName, location } = splitProjectName(project.name);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
        className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.38, ease: [0.32, 0.72, 0, 1] }}
        className="fixed inset-x-2 bottom-0 top-12 sm:inset-4 md:inset-8 z-[201] p-2 sm:p-3 rounded-3xl bg-black/10 dark:bg-white/10 border border-foreground/15 shadow-2xl flex flex-col pointer-events-none"
      >
        <div
          className="bg-background rounded-[calc(1.5rem-0.25rem)] overflow-hidden flex flex-col h-full border border-foreground/10 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4 px-6 sm:px-8 py-5 border-b border-foreground/10 shrink-0 bg-background/90 backdrop-blur-md">
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-secondary font-semibold">
                {project.categoryLabel}
              </span>
              <h2 className="font-serif text-xl sm:text-2xl text-primary leading-snug font-medium">{clientName}</h2>
              {location && (
                <p className="flex items-center gap-1.5 font-sans text-xs text-warm-gray mt-1">
                  <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" />
                  {location}
                </p>
              )}
              <p className="font-sans text-[11px] font-mono text-warm-gray mt-1.5">
                {loading ? "Memuat foto..." : `${images.length} dari ${total} Foto Dokumentasi`}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
                  `Halo FULLHOME ID, Saya tertarik dengan project ${project.name} (${project.categoryLabel}). Boleh konsultasi?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider hover:bg-secondary transition-colors shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Konsultasi WhatsApp
              </a>
              <button
                onClick={onClose}
                aria-label="Tutup"
                className="p-2.5 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 text-primary transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="aspect-[4/3] rounded-2xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {images.map((img, i) => (
                    <ModalGridItem key={img.id} img={img} index={i} onClick={() => setLightboxIndex(i)} />
                  ))}
                </div>

                {hasMore && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={loadMore}
                      disabled={loadingMore}
                      className="inline-flex items-center gap-2 bg-primary text-white rounded-full px-7 py-3 text-xs font-mono uppercase tracking-wider hover:bg-secondary transition-all shadow-md disabled:opacity-60"
                    >
                      {loadingMore ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <span>Muat Lebih Banyak Foto</span>
                          <span className="opacity-60 text-[11px]">({total - images.length} lagi)</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={images}
            index={lightboxIndex}
            projectName={project.name}
            onClose={closeLightbox}
            onPrev={prevLb}
            onNext={nextLb}
          />
        )}
      </AnimatePresence>
    </>
  );
}
