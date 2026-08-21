import Image from "next/image";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { ArrowUpRight, CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative pt-6 md:pt-14 pb-20 md:pb-32 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        {/* Left Column: Text & CTAs */}
        <div className="lg:col-span-7 flex flex-col gap-7 z-10">
          <div className="enter enter-down">
            <p className="chapter-label">
              <span>Jasa desain interior &amp; custom furniture</span>
            </p>
          </div>

          <div className="enter enter-d1">
            <div className="flex flex-col gap-4">
              {/* Each line is set deliberately so the italic phrase never splits
                  across a break — the old markup wrapped mid-phrase, stranding
                  "untuk" on the line below its clause. */}
              {/* The `{" "}` separators are load-bearing for SEO, not formatting:
                  block spans with no text node between them concatenate in
                  textContent, and crawlers read the H1 as
                  "Jasa interior custombergaransi,dirancang khusus untukhunian Anda." */}
              <h1 className="font-serif text-[2.6rem] sm:text-5xl lg:text-[4rem] text-primary font-medium leading-[1.04] tracking-[-0.025em]">
                <span className="block">Jasa Interior Custom</span>{" "}
                <span className="block">Bergaransi,</span>{" "}
                <span className="block italic font-normal text-secondary">
                  Dirancang Khusus untuk
                </span>{" "}
                <span className="block">Hunian Anda</span>
              </h1>
              <p className="font-serif italic text-lg sm:text-xl text-warm-gray font-normal border-t border-foreground/15 pt-4 mt-1 measure-tight">
                Presisi dalam fungsi, estetika, dan anggaran.
              </p>
            </div>
          </div>

          <div className="enter enter-d2">
            <p className="font-sans text-sm sm:text-base text-warm-gray leading-relaxed measure">
              FULLHOME ID menghadirkan solusi desain interior dan custom furniture bergaransi yang
              dirancang khusus sesuai kebutuhan, karakter, dan budget Anda — mulai dari kitchen set,
              kamar tidur, wardrobe, hingga interior rumah secara menyeluruh. Setiap proyek
              dikerjakan presisi dengan RAB transparan dan proses terpantau dari desain hingga
              instalasi.
            </p>
          </div>

          {/* CTAs */}
          <div className="enter enter-d3">
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <WhatsAppButton variant="primary">
                Konsultasi Gratis via WhatsApp
              </WhatsAppButton>

              <Link
                href="/portofolio"
                className="group inline-flex items-center justify-center border border-foreground/15 text-primary font-sans font-medium text-xs uppercase tracking-wider px-6 py-3.5 rounded-full hover:border-foreground/30 hover:bg-black/5 transition-all duration-300 backdrop-blur-sm"
              >
                <span>Lihat Portofolio Proyek</span>
                <span className="w-6 h-6 rounded-full bg-black/5 ml-2.5 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowUpRight className="w-3.5 h-3.5 text-primary" />
                </span>
              </Link>
            </div>
          </div>

          {/* Micro Trust Pills */}
          <div className="enter enter-d4">
            <div className="flex flex-wrap items-center gap-5 pt-3 text-xs font-sans text-warm-gray">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-secondary" />
                <span>Visualisasi 3D Detail</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-secondary" />
                <span>Transparansi Biaya RAB</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-secondary" />
                <span>Garansi Kualitas Material</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Architectural image, framed by the grid rather than a bezel */}
        <div className="lg:col-span-5 relative">
          <div className="enter enter-left enter-d2">
            {/* One clean image, no nested bezels. The figures sit beneath it as a
                caption rather than floating in a glass card on top of the photo. */}
            {/* 4:5 at every breakpoint — the source photo is exactly 4:5, so the
                frame never crops it. */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
              <Image
                src="/images/hero-kitchen-modern.webp"
                alt="Dapur modern dua lantai hasil pengerjaan FULLHOME ID: kabinet abu hangat, backsplash bergaris, lampu gantung, dan kursi bar oranye"
                fill
                priority
                loading="eager"
                // The frame is one 5-of-12 column inside a 1152 px container, so
                // it never exceeds ~420 px on desktop. 42vw asked for 567 px and
                // pulled down the 640 px variant for nothing.
                sizes="(max-width: 1023px) 100vw, (max-width: 1152px) 37vw, 420px"
                className="object-cover"
              />
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-x-8 border-t border-foreground/20 pt-5">
              <div>
                <dt className="font-serif text-2xl sm:text-[1.75rem] font-medium text-primary leading-none tnum">
                  100+
                </dt>
                <dd className="font-mono text-[10px] uppercase tracking-[0.18em] text-warm-gray mt-2">
                  Proyek selesai
                </dd>
              </div>
              <div className="border-l border-foreground/15 pl-8">
                <dt className="font-serif text-2xl sm:text-[1.75rem] font-medium text-primary leading-none tnum">
                  4,9
                </dt>
                <dd className="font-mono text-[10px] uppercase tracking-[0.18em] text-warm-gray mt-2">
                  Kepuasan klien
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
