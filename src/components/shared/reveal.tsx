import { ReactNode } from "react";

/**
 * Scroll entrance animation, implemented in CSS (see `.reveal` in globals.css).
 *
 * This is deliberately NOT a client component: it renders plain markup that is
 * visible the moment the HTML arrives. The previous framer-motion version set
 * `initial={{ opacity: 0 }}`, which server-rendered every one of its 36 usages
 * at `opacity:0` — the whole page stayed blank until framer-motion hydrated.
 *
 * Browsers supporting `animation-timeline: view()` animate with zero JavaScript;
 * the rest show the content immediately without the effect.
 */
interface RevealProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
}

const DIRECTION_CLASS = {
  up: "",
  down: "reveal-down",
  left: "reveal-left",
  right: "reveal-right",
  none: "reveal-none",
} as const;

export function Reveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: RevealProps) {
  return (
    <div
      className={`reveal ${DIRECTION_CLASS[direction]} ${className}`.trim()}
      // A scroll-driven animation has no wall-clock delay to apply; the stagger
      // instead shifts where in the scroll range each element starts.
      style={
        delay
          ? ({ "--reveal-start": `${Math.min(delay * 40, 40)}%` } as React.CSSProperties)
          : undefined
      }
    >
      {children}
    </div>
  );
}
