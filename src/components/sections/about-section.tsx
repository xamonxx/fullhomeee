import Image from "next/image";
import { Reveal } from "@/components/shared/reveal";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { SectionHeading } from "@/components/shared/section-heading";
import { siteConfig } from "@/config/site";
import { ArrowUpRight } from "lucide-react";
import { MapEmbed } from "@/components/shared/map-embed";

const stats = [
  {
    value: "2018",
    prefix: "Sejak",
    label: "Pengalaman & dedikasi",
    description:
      "Menghadirkan solusi interior dan custom furniture untuk berbagai kebutuhan hunian.",
  },
  {
    value: "4.048+",
    label: "Proyek terselesaikan",
    description:
      "Proyek interior yang diwujudkan dengan pendekatan desain dan kebutuhan yang beragam.",
  },
  {
    value: "15+",
    label: "Workshop & produksi",
    description:
      "Jaringan workshop dan produksi yang menunjang proses pengerjaan terukur.",
  },
  {
    value: "150+",
    label: "Tenaga ahli",
    description: "Tim profesional yang mendukung setiap tahap, dari desain hingga instalasi.",
  },
];

const values = [
  {
    number: "01",
    title: "Materialitas terpilih",
    description:
      "Kami memilih material dengan mempertimbangkan estetika, fungsi, dan ketahanan untuk memastikan setiap elemen interior memiliki kualitas yang dapat diandalkan dalam penggunaan jangka panjang.",
  },
  {
    number: "02",
    title: "Akurasi visual & produksi",
    description:
      "Setiap detail dirancang secara presisi melalui proses desain dan visualisasi 3D sebelum masuk ke tahap produksi, sehingga hasil akhir dapat diwujudkan dengan tingkat akurasi yang tinggi.",
  },
  {
    number: "03",
    title: "Transparansi proses",
    description:
      "Kami percaya bahwa proyek interior yang baik dibangun melalui komunikasi yang jelas. Mulai dari desain, spesifikasi, RAB, hingga progres pengerjaan disampaikan secara transparan agar setiap keputusan dapat dilakukan dengan lebih yakin.",
  },
  {
    number: "04",
    title: "Pengerjaan bergaransi",
    description:
      "Kualitas dan kepuasan klien menjadi bagian penting dalam setiap proyek. Karena itu, kami memberikan garansi pengerjaan sebagai bentuk komitmen terhadap kualitas hasil dan layanan yang kami berikan.",
  },
];

/**
 * Studio story, figures, principles and location.
 *
 * Every block here used to be the same nested bordered card: four stat cards, four
 * value cards, a location card and a map card, each with its own double bezel. The
 * figures are now a plain band divided by hairlines, the principles a two-column
 * rule list, and the map keeps one frame because there it actually delineates an
 * embedded surface.
 */
export function AboutSection() {
  return (
    <section id="about" className="py-24 md:py-36 bg-background relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-24 md:gap-36">
        {/* Story — image bleeds left, text sits right of centre */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          <div className="lg:col-span-5 relative lg:sticky lg:top-28">
            <Reveal direction="right">
              <figure className="relative">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
                  <Image
                    src="/images/about-home.png"
                    alt="Ruang keluarga hasil pengerjaan FULLHOME ID dengan palet kayu hangat"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover transition-transform duration-[1200ms] hover:scale-[1.03]"
                  />
                </div>
                <figcaption className="mt-6 border-l-2 border-secondary pl-5">
                  <p className="font-serif italic text-base text-primary leading-snug measure-tight">
                    &ldquo;Rumah harus menjadi sanctuary tempat tubuh dan pikiran
                    beristirahat.&rdquo;
                  </p>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-warm-gray mt-3 block">
                    Tim desain FULLHOME ID
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-7">
            <Reveal delay={0.05}>
              <div className="chapter-label mb-6">
                <span className="text-warm-gray tabular-nums">05</span>
                <span>Tentang studio</span>
              </div>
              <h2 className="font-serif text-[2.1rem] leading-[1.05] md:text-5xl lg:text-[3.5rem] text-primary font-medium tracking-[-0.02em]">
                Menciptakan ruang yang{" "}
                <span className="italic font-normal text-secondary">bernapas, fungsional,</span>{" "}
                dan tak lekang oleh waktu
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="flex flex-col gap-5 font-sans text-sm md:text-base text-warm-gray leading-relaxed measure">
                <p>
                  FULLHOME ID hadir sejak 2018 dengan satu komitmen: menciptakan ruang yang tidak
                  hanya indah secara visual, tetapi juga memiliki fungsi, karakter, dan kualitas
                  yang bertahan dalam jangka panjang.
                </p>
                <p>
                  Kami menghadirkan solusi desain interior dan custom furniture yang dirancang
                  secara personal untuk setiap kebutuhan—mulai dari kitchen set, wardrobe, kamar
                  tidur, ruang keluarga, hingga interior rumah secara menyeluruh. Dengan memadukan
                  estetika, material pilihan, dan pengerjaan presisi, setiap detail dirancang untuk
                  menciptakan hunian yang merepresentasikan karakter serta gaya hidup penghuninya.
                </p>
                <p>
                  Didukung oleh pengalaman menangani ribuan proyek, jaringan workshop, dan tenaga
                  ahli berpengalaman, FULLHOME ID berkomitmen memberikan proses yang terukur,
                  transparan, dan terpercaya—dari tahap konsultasi dan desain hingga produksi,
                  instalasi, serta penyelesaian proyek.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="font-serif italic text-primary text-lg md:text-xl leading-snug measure border-t border-foreground/15 pt-7">
                Kami percaya, sebuah ruang yang baik bukan sekadar tempat untuk tinggal. Ia adalah
                bagian dari kehidupan yang tumbuh bersama Anda.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="pt-2">
                <WhatsAppButton variant="primary">Mulai diskusi proyek Anda</WhatsAppButton>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Figures — one band, hairline dividers, no boxes */}
        <Reveal>
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 border-t border-foreground/20 pt-10">
            {stats.map((item) => (
              <div key={item.label}>
                <dt className="font-serif text-3xl md:text-[2.75rem] leading-none font-medium text-primary tnum">
                  {item.prefix && (
                    <span className="block font-sans text-[11px] uppercase tracking-[0.2em] text-warm-gray mb-2">
                      {item.prefix}
                    </span>
                  )}
                  {item.value}
                </dt>
                <dd className="mt-4">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-secondary mb-2">
                    {item.label}
                  </span>
                  <span className="block font-sans text-xs text-warm-gray leading-relaxed">
                    {item.description}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* Principles — two-column rule list */}
        <div>
          <Reveal>
            <SectionHeading
              index="06"
              eyebrow="Prinsip & nilai utama"
              title="Fondasi layanan FULLHOME ID"
            />
          </Reveal>

          <div className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-x-16 border-t border-foreground/10">
            {values.map((item, idx) => (
              <Reveal key={item.number} delay={idx * 0.06}>
                <article className="flex gap-6 md:gap-8 py-9 md:py-11 border-b border-foreground/10 h-full">
                  <span aria-hidden className="numeral shrink-0 pt-1">
                    {item.number}
                  </span>
                  <div>
                    <h3 className="font-serif text-xl md:text-2xl font-medium text-primary leading-snug mb-3">
                      {item.title}
                    </h3>
                    <p className="font-sans text-sm text-warm-gray leading-relaxed measure">
                      {item.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Location */}
        <div id="location">
          <Reveal>
            <SectionHeading
              index="07"
              eyebrow="Lokasi office"
              title="Kunjungi office kami"
              subtitle="Temukan office kami di Bandung Barat untuk berdiskusi langsung mengenai sampel material dan konsep interior impian Anda."
            />
          </Reveal>

          <div className="mt-14 md:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-4">
              <Reveal>
                <dl className="rule-list border-t border-foreground/15">
                  <div className="py-6">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary mb-2.5">
                      Plus code
                    </dt>
                    <dd className="font-sans text-sm text-primary">{siteConfig.plusCode}</dd>
                  </div>
                  <div className="py-6">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary mb-2.5">
                      Alamat office
                    </dt>
                    <dd className="font-sans text-sm text-warm-gray leading-relaxed">
                      {siteConfig.address}
                    </dd>
                  </div>
                  <div className="py-6">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary mb-2.5">
                      Jam operasional
                    </dt>
                    <dd className="font-sans text-sm text-warm-gray leading-relaxed">
                      Senin – Sabtu, 08:00 – 17:00 WIB
                      <span className="block text-[11px] text-warm-gray italic mt-1.5">
                        Kunjungan survei atau diskusi disarankan dengan janji temu.
                      </span>
                    </dd>
                  </div>
                </dl>

                <a
                  href={siteConfig.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-8 inline-flex items-center gap-2.5 text-[11px] font-mono uppercase tracking-[0.18em] text-primary hover:text-secondary transition-colors border-b border-foreground/25 hover:border-secondary pb-1.5"
                >
                  <span>Petunjuk arah Google Maps</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </Reveal>
            </div>

            <div className="lg:col-span-8">
              <Reveal delay={0.1}>
                <MapEmbed />
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
