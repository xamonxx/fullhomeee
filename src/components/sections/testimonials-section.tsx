import { TestimonialItem } from "@/types";
import { Reveal } from "@/components/shared/reveal";

interface TestimonialsSectionProps {
  testimonials?: TestimonialItem[];
}

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "1",
    clientName: "Ibu Winda",
    projectType: "Wardrobe & Vanity Custom",
    location: "Cibaduyut, Bandung",
    quote:
      "Hasil pengerjaan wardrobe dan meja rias sangat presisi sesuai gambar 3D. Tim FULLHOME ID sangat responsif dan finishing HPL-nya benar-benar rapi.",
    rating: 5,
  },
  {
    id: "2",
    clientName: "Ibu Grace",
    projectType: "Kitchen Set Semiklasik",
    location: "Ciskul, Bandung",
    quote:
      "Suka banget dengan kitchen set semiklasik hasil pengerjaannya. Kombinasi warna krem dan profil kabinetnya bikin dapur keliatan luas dan mewah.",
    rating: 5,
  },
  {
    id: "3",
    clientName: "Bpk. Irfan",
    projectType: "Living Room & Credenza",
    location: "Cimahi",
    quote:
      "Transparansi RAB awal sangat membantu menyesuaikan budget. Hasil instalasi tepat waktu dan garansinya bikin tenang.",
    rating: 5,
  },
];

/**
 * Client quotes, set as a pull quote with the remainder as an attributed list.
 *
 * Was three equal quote cards in a row — the pattern a reader has seen on every
 * templated site. Leading with one quote at display size gives the words weight
 * and lets the section breathe.
 */
export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const items = testimonials && testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS;
  const [lead, ...rest] = items;

  return (
    <section className="py-24 md:py-36 max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
      <Reveal>
        <div className="chapter-label mb-10 md:mb-14">
          <span className="text-warm-gray tabular-nums">08</span>
          <span>Ulasan klien</span>
        </div>
      </Reveal>

      {lead && (
        <Reveal>
          <figure className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-8">
            <blockquote className="lg:col-span-9">
              <p className="font-serif text-[1.6rem] leading-[1.28] md:text-4xl lg:text-[2.75rem] md:leading-[1.22] text-primary font-medium tracking-[-0.015em]">
                &ldquo;{lead.quote}&rdquo;
              </p>
            </blockquote>
            <figcaption className="lg:col-span-3 lg:pt-3">
              <span className="block font-serif text-lg text-primary">{lead.clientName}</span>
              <span className="block font-sans text-xs text-warm-gray mt-1.5 leading-relaxed">
                {lead.projectType}
              </span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-secondary mt-2.5">
                {lead.location}
              </span>
            </figcaption>
          </figure>
        </Reveal>
      )}

      {rest.length > 0 && (
        <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-2 gap-x-16 border-t border-foreground/10">
          {rest.map((item, idx) => (
            <Reveal key={item.id} delay={idx * 0.06}>
              <figure className="py-9 md:py-11 border-b border-foreground/10 h-full">
                <blockquote>
                  <p className="font-sans text-sm text-warm-gray leading-relaxed measure">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </blockquote>
                <figcaption className="mt-5 flex items-baseline gap-3">
                  <span className="font-serif text-base text-primary">{item.clientName}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-warm-gray">
                    {item.projectType} · {item.location}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
