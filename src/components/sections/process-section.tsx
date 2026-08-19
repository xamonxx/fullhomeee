import { processStepsData } from "@/data/process";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";

const paymentStages = [
  { num: "01", label: "Konsultasi", desc: "100% gratis tanpa biaya" },
  { num: "02", label: "Pengembangan desain", desc: "Deposit desain, lanjut 3D" },
  { num: "03", label: "Produksi workshop", desc: "DP 50%, progres ±40%" },
  { num: "04", label: "Instalasi & garansi", desc: "Pelunasan, garansi 6 bulan" },
];

/**
 * Process as a vertical timeline.
 *
 * Was four narrow cards side by side; the descriptions are long enough that each
 * wrapped to eight cramped lines. Full-width rows hung off a continuous rule give
 * the copy a proper measure, and the timeline reads in the order the work happens.
 */
export function ProcessSection() {
  return (
    <section
      id="process"
      className="py-24 md:py-36 border-y border-foreground/10 bg-black/[0.015] dark:bg-white/[0.015]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 gap-x-12 items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <SectionHeading
                index="04"
                eyebrow="Alur kerja transparan"
                title="Empat tahapan menuju interior impian"
              />
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.1}>
              <p className="font-sans text-sm md:text-base text-warm-gray leading-relaxed measure lg:pb-3">
                Proses kerja terstruktur dari konsultasi gagasan hingga instalasi serah terima yang
                tenang dan terukur.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Timeline: one continuous rule with each stage hanging off it. */}
        <ol className="mt-16 md:mt-24 relative">
          <span
            aria-hidden
            className="hidden md:block absolute left-[calc(4rem+1px)] top-3 bottom-3 w-px bg-foreground/12"
          />

          {processStepsData.map((step, idx) => (
            <Reveal key={step.step} delay={idx * 0.05}>
              <li className="relative grid grid-cols-1 md:grid-cols-12 gap-x-10 gap-y-5 py-10 md:py-14 border-t border-foreground/10">
                <div className="md:col-span-3 flex md:block items-baseline gap-4">
                  <span className="numeral text-foreground/25">
                    {String(step.step).padStart(2, "0")}
                  </span>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary md:mt-3">
                    {step.subtitle}
                  </p>
                </div>

                <div className="md:col-span-5">
                  <h3 className="font-serif text-2xl md:text-[1.75rem] leading-tight font-medium text-primary mb-4">
                    {step.title}
                  </h3>
                  <p className="font-sans text-sm text-warm-gray leading-relaxed measure">
                    {step.description}
                  </p>
                </div>

                <div className="md:col-span-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-warm-gray/70 mb-3">
                    Hasil keluaran
                  </p>
                  <ul className="rule-list">
                    {step.details.map((detail) => (
                      <li
                        key={detail}
                        className="flex items-baseline gap-3 py-2.5 font-sans text-[13px] text-primary/80"
                      >
                        <span className="w-1 h-1 rounded-full bg-secondary shrink-0 translate-y-[-3px]" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                  {step.footnote && (
                    <p className="font-sans text-[11px] text-warm-gray/70 italic mt-3 leading-snug">
                      {step.footnote}
                    </p>
                  )}
                </div>
              </li>
            </Reveal>
          ))}
        </ol>

        {/* Payment schedule — a plain band, not another boxed card. */}
        <Reveal delay={0.1}>
          <div className="mt-16 md:mt-20 pt-10 border-t border-foreground/20">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.22em] text-warm-gray mb-8">
              Skema & tahapan pembayaran
            </h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-8">
              {paymentStages.map((item) => (
                <div key={item.num} className="border-t border-foreground/15 pt-4">
                  <span className="font-serif text-2xl text-foreground/25 tabular-nums">
                    {item.num}
                  </span>
                  <dt className="font-sans text-sm font-medium text-primary mt-2">{item.label}</dt>
                  <dd className="font-sans text-xs text-warm-gray mt-1.5 leading-relaxed">
                    {item.desc}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
