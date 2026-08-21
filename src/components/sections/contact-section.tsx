import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { ContactFormLazy } from "@/components/sections/contact-form-lazy";
import { CheckCircle2, MessageCircle } from "lucide-react";

const guarantees = [
  {
    Icon: CheckCircle2,
    term: "Diskusi & estimasi awal gratis",
    detail: "Sesi konsultasi pertama tidak dipungut biaya dan tanpa komitmen terikat.",
  },
  {
    Icon: MessageCircle,
    term: "Format pesan WhatsApp rapi",
    detail: "Sistem akan otomatis merangkum data Anda ke nomor WhatsApp studio kami.",
  },
];

/**
 * Consultation section.
 *
 * This was a client component in its entirety, which dragged react-hook-form and
 * zod into the homepage entry chunk. Only the form actually needs them, so the
 * heading and guarantee list stay server-rendered and the form arrives on its own.
 */
export function ContactSection() {
  return (
    <section id="contact" className="py-24 md:py-36 max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
        {/* Contact Left Info */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Reveal>
            <SectionHeading
              index="10"
              eyebrow="Formulir konsultasi"
              title="Diskusikan proyek interior Anda"
              subtitle="Isi rincian kebutuhan Anda. Tim desainer kami akan menyiapkan analisis tata ruang dan estimasi RAB awal."
            />
          </Reveal>

          <Reveal delay={0.2}>
            {/* Each <div> child of a <dl> may contain only <dt> and <dd>. The icon
                used to sit beside a nested <div> holding both, which put invalid
                children directly inside the list. */}
            <dl className="mt-10 rule-list border-t border-foreground/15">
              {guarantees.map(({ Icon, term, detail }) => (
                <div key={term} className="py-6">
                  <dt className="flex items-start gap-4 font-serif text-base font-medium text-primary">
                    <Icon aria-hidden className="w-4 h-4 text-secondary shrink-0 mt-1" />
                    <span>{term}</span>
                  </dt>
                  <dd className="font-sans text-xs text-warm-gray mt-1.5 leading-relaxed measure pl-8">
                    {detail}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* Form keeps a single surface: elevation here marks an input area. */}
        <div className="lg:col-span-7">
          <Reveal delay={0.05}>
            <div className="bg-background p-6 sm:p-8 md:p-10 border border-foreground/12 shadow-warm">
              <ContactFormLazy />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
