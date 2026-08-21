import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";

const trustPillars = [
  {
    badge: "Desain bespoke",
    title: "Warm Minimal Luxury",
    description:
      "Memadukan kesederhanaan minimalis dengan kehangatan elemen kayu alami dan tekstur kain yang menenangkan jiwa.",
  },
  {
    badge: "Ergonomi ruang",
    title: "Berorientasi Penghuni",
    description:
      "Setiap tata letak dirancang mengikuti Alur Aktivitas Harian Anda — mengutamakan kemudahan navigasi dan fungsi maksimal.",
  },
  {
    badge: "Craftsmanship",
    title: "Presisi & Finishing Rapi",
    description:
      "Diproduksi langsung di workshop profesional dengan pemilihan material HPL, Duco, dan fitting hardware kelas atas.",
  },
  {
    badge: "Transparansi",
    title: "Estimasi Jujur & Garansi",
    description:
      "Perhitungan Rencana Anggaran Biaya (RAB) jelas tanpa hidden cost, didukung garansi pemeliharaan.",
  },
];

/**
 * Four pillars as a numbered editorial list.
 *
 * Was a `lg:grid-cols-4` row of nested bordered cards (labelled "Asymmetric Bento
 * Grid" in a comment, though nothing about it was asymmetric). Each column was
 * narrow enough that titles broke onto two lines and body copy ran to six short
 * lines. Two wide columns separated by hairlines give the text room to breathe.
 */
export function TrustSection() {
  return (
    <section className="py-24 md:py-36 border-y border-foreground/10 bg-black/[0.015] dark:bg-white/[0.015]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 gap-x-12 items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <SectionHeading
                index="01"
                eyebrow="Pendekatan kami"
                title="Mengapa dipercaya ribuan klien"
              />
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.1}>
              <p className="font-sans text-sm md:text-base text-warm-gray leading-relaxed measure lg:pb-3">
                Kami percaya interior rumah bukan sekadar susunan perabot, melainkan sanctuary
                tempat cerita kehidupan bermula.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-2 gap-x-16 border-t border-foreground/10">
          {trustPillars.map((pillar, idx) => (
            <Reveal key={pillar.title} delay={idx * 0.06}>
              <article className="flex gap-6 md:gap-8 py-9 md:py-11 border-b border-foreground/10 h-full">
                <span aria-hidden className="numeral shrink-0 pt-1">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-secondary mb-3">
                    {pillar.badge}
                  </p>
                  <h3 className="font-serif text-xl md:text-2xl font-medium text-primary leading-snug mb-3">
                    {pillar.title}
                  </h3>
                  <p className="font-sans text-sm text-warm-gray leading-relaxed measure">
                    {pillar.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
