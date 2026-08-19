"use client";

import { useEffect } from "react";

/**
 * Progressive motion layer: Lenis inertial scrolling + GSAP ScrollTrigger reveals.
 *
 * Two rules govern everything here, both learned the hard way on this codebase:
 *
 * 1. **Never hide content.** Elements are animated FROM an offset TO their natural
 *    state (`gsap.from`), and only after this component mounts. Nothing is written
 *    at `opacity: 0` server-side. If the bundle fails, is slow, or JS is off, the
 *    page is already complete and readable — the CSS `.reveal`/`.enter` animations
 *    in globals.css remain the baseline.
 * 2. **Never block first paint.** Both libraries are imported dynamically inside an
 *    effect, so they resolve after hydration rather than joining the entry chunk.
 */
export function MotionProvider() {
  useEffect(() => {
    // Users asking for less motion get none of this — and keep native scrolling.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lenis: import("lenis").default | null = null;
    let frame = 0;
    let cleanupGsap: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      lenis = new Lenis({
        duration: 1.05,
        // Long, decaying ease — the weight that makes scrolling feel deliberate.
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.6,
      });

      const raf = (time: number) => {
        lenis?.raf(time);
        frame = requestAnimationFrame(raf);
      };
      frame = requestAnimationFrame(raf);

      // Drive ScrollTrigger from Lenis so the two never disagree on position.
      lenis.on?.("scroll", ScrollTrigger.update);

      // Entrance reveals stay in CSS (`.reveal` / `.enter` in globals.css) — running
      // them here too would mean two systems animating the same elements. GSAP is
      // used only for what CSS cannot do: scrubbed parallax tied to scroll progress.
      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-motion='parallax']").forEach((el) => {
          gsap.to(el, {
            yPercent: -7,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          });
        });
      });

      ScrollTrigger.refresh();

      cleanupGsap = () => {
        ctx.revert();
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      cleanupGsap?.();
      lenis?.destroy();
    };
  }, []);

  return null;
}

export default MotionProvider;
