import { Reveal } from "@/components/shared/reveal";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";

/**
 * Closing call to action.
 *
 * Was a near-black rounded slab dropped into the middle of a cream page — the jump
 * read as a pasted-in block rather than a designed contrast. It now uses the deep
 * warm tone from the same palette, runs full-bleed, and is set left with the copy
 * and actions in adjacent columns instead of a centred stack.
 */
export function FinalCtaSection() {
  return (
    <section className="bg-inverse-surface text-inverse-on-surface">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-24 md:py-36">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 gap-x-16 items-end">
            <div className="lg:col-span-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-inverse-on-surface/60 mb-8 flex items-center gap-4">
                <span>Konsultasi bebas risiko</span>
                <span aria-hidden className="flex-1 h-px bg-inverse-on-surface/20" />
              </p>
              <h2 className="font-serif text-[2.1rem] leading-[1.06] md:text-5xl lg:text-[3.5rem] font-medium tracking-[-0.02em] max-w-[16ch]">
                Siap wujudkan interior bernuansa warm minimal luxury?
              </h2>
            </div>

            <div className="lg:col-span-5">
              <p className="font-sans text-sm md:text-base text-inverse-on-surface/70 leading-relaxed measure">
                Diskusikan visi tata ruang Anda bersama desainer FULLHOME ID hari ini. Dapatkan
                gambaran tata letak dan estimasi anggaran awal.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <WhatsAppButton variant="secondary">Konsultasi WhatsApp</WhatsAppButton>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center border border-inverse-on-surface/30 text-inverse-on-surface font-sans text-xs uppercase tracking-[0.16em] px-7 py-3.5 rounded-full hover:bg-inverse-on-surface/10 transition-colors duration-300"
                >
                  Isi form konsultasi
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
