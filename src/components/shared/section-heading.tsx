import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Chapter number rendered above the title, e.g. "02". */
  index?: string;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
}

/**
 * Section header, editorial style.
 *
 * Defaults to left alignment. Previously this defaulted to centre and no section
 * overrode it, so ten consecutive sections opened with the identical centred
 * pill-eyebrow / serif-title / subtitle stack — the single strongest "generated
 * template" signal on the page. The eyebrow is now a mono chapter label trailed
 * by a hairline rather than a bordered pill badge.
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  index,
  align = "left",
  className = "",
  titleClassName = "",
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div className={cn("flex flex-col", centered && "items-center text-center", className)}>
      {eyebrow && (
        <div
          className={cn(
            "chapter-label mb-6 md:mb-8",
            // A rule that runs off to one side only makes sense left-aligned.
            centered && "justify-center [&::after]:hidden"
          )}
        >
          {index && <span className="text-foreground/35 tabular-nums">{index}</span>}
          <span>{eyebrow}</span>
        </div>
      )}

      <h2
        className={cn(
          "font-serif text-[2.1rem] leading-[1.05] md:text-5xl lg:text-[3.5rem] text-primary font-medium tracking-[-0.02em]",
          centered ? "max-w-3xl" : "max-w-[18ch]",
          titleClassName
        )}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={cn(
            "font-sans text-sm md:text-base text-warm-gray leading-relaxed measure mt-5 md:mt-6",
            centered && "mx-auto"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
