import { servicesData } from "@/data/services";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

/**
 * Services as full-width editorial rows.
 *
 * Was a two-up grid of nested bordered cards where the feature checklist and the
 * description competed for a narrow column. Each service now spans the container:
 * title on the left, description in the middle, features on the right, divided by
 * hairlines. Deliberately a different rhythm from the two-column trust list above
 * so consecutive sections stop looking like the same template.
 */
export function ServicesSection() {
  return (
    <section id="services" className="py-24 md:py-36 max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 gap-x-12 items-end">
        <div className="lg:col-span-7">
          <Reveal>
            <SectionHeading
              index="02"
              eyebrow="Layanan unggulan"
              title="Solusi interior & custom furniture"
            />
          </Reveal>
        </div>
        <div className="lg:col-span-5">
          <Reveal delay={0.1}>
            <p className="font-sans text-sm md:text-base text-warm-gray leading-relaxed measure lg:pb-3">
              Dari perancangan tata ruang, visualisasi 3D presisi, hingga pembuatan furnitur custom
              terintegrasi.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="mt-16 md:mt-24 border-t border-foreground/10">
        {servicesData.map((service, idx) => (
          <Reveal key={service.id} delay={idx * 0.05}>
            <article className="group grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-6 py-10 md:py-14 border-b border-foreground/10">
              <div className="lg:col-span-4 flex gap-5">
                <span aria-hidden className="numeral shrink-0">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-secondary mb-2.5">
                    {service.subtitle}
                  </p>
                  <h3 className="font-serif text-2xl md:text-[1.75rem] leading-tight font-medium text-primary group-hover:text-secondary transition-colors duration-300">
                    {service.title}
                  </h3>
                </div>
              </div>

              <div className="lg:col-span-4">
                <p className="font-sans text-sm text-warm-gray leading-relaxed measure">
                  {service.description}
                </p>
                <Link
                  href="#contact"
                  className="mt-6 inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] text-primary hover:text-secondary transition-colors border-b border-foreground/20 hover:border-secondary pb-1"
                >
                  <span>Konsultasikan layanan ini</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>

              <ul className="lg:col-span-4 rule-list">
                {service.features.map((feat) => (
                  <li
                    key={feat}
                    className="flex items-baseline gap-3 py-2.5 font-sans text-[13px] text-primary/80"
                  >
                    <span className="w-1 h-1 rounded-full bg-secondary shrink-0 translate-y-[-3px]" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
