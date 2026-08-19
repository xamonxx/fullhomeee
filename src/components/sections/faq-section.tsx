import { faqData } from "@/data/faq";
import { Accordion } from "@/components/ui/accordion";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";

/**
 * FAQ. The asymmetric two-column split was already the strongest layout on the
 * page, so it stays — only the two nested card shells wrapping it are removed.
 */
export function FaqSection() {
  return (
    <section
      id="faq"
      className="py-24 md:py-36 bg-black/[0.015] dark:bg-white/[0.015] border-t border-foreground/10"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <Reveal>
              <SectionHeading
                index="09"
                eyebrow="Pertanyaan umum"
                title="Sering ditanyakan"
                subtitle="Jawaban cepat seputar cakupan wilayah operasional, estimasi waktu produksi, dan skema pembayaran."
              />
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-10 pt-8 border-t border-foreground/15">
                <h3 className="font-serif text-lg font-medium text-primary mb-3">
                  Punya pertanyaan spesifik?
                </h3>
                <p className="font-sans text-sm text-warm-gray leading-relaxed measure mb-6">
                  Tim desainer kami siap berdiskusi langsung mengenai denah, jenis material, dan
                  estimasi anggaran proyek Anda.
                </p>
                <WhatsAppButton variant="outline">Konsultasi langsung via WhatsApp</WhatsAppButton>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.05}>
              <Accordion items={faqData} />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
