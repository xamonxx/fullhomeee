"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, ContactFormValues } from "@/lib/validations/contact";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MessageCircle, Send, Loader2, ArrowUpRight } from "lucide-react";

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      whatsapp: "",
      projectLocation: "",
      spaceType: "Rumah Tinggal",
      serviceNeed: "Full Interior Design & Build",
      budgetRange: "Rp 50jt - Rp 150jt",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Gagal memproses formulir");
      }

      const waUrl = buildWhatsAppLink(data);
      setIsSuccess(true);
      reset();

      setTimeout(() => {
        window.open(waUrl, "_blank");
      }, 600);
    } catch (err: any) {
      setServerError(err.message || "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <dl className="mt-10 rule-list border-t border-foreground/15">
              <div className="py-6 flex items-start gap-4">
                <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-1" />
                <div>
                  <dt className="font-serif text-base font-medium text-primary">
                    Diskusi &amp; estimasi awal gratis
                  </dt>
                  <dd className="font-sans text-xs text-warm-gray mt-1.5 leading-relaxed measure">
                    Sesi konsultasi pertama tidak dipungut biaya dan tanpa komitmen terikat.
                  </dd>
                </div>
              </div>
              <div className="py-6 flex items-start gap-4">
                <MessageCircle className="w-4 h-4 text-secondary shrink-0 mt-1" />
                <div>
                  <dt className="font-serif text-base font-medium text-primary">
                    Format pesan WhatsApp rapi
                  </dt>
                  <dd className="font-sans text-xs text-warm-gray mt-1.5 leading-relaxed measure">
                    Sistem akan otomatis merangkum data Anda ke nomor WhatsApp studio kami.
                  </dd>
                </div>
              </div>
            </dl>
          </Reveal>
        </div>

        {/* Form keeps a single surface: elevation here marks an input area. */}
        <div className="lg:col-span-7">
          <Reveal delay={0.05}>
            <div>
              <div className="bg-background p-6 sm:p-8 md:p-10 border border-foreground/12 shadow-warm">
                {isSuccess ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="font-serif text-2xl md:text-3xl font-medium text-primary">
                      Formulir Berhasil Diterima!
                    </h3>
                    <p className="font-sans text-sm text-warm-gray max-w-md leading-relaxed">
                      Aplikasi WhatsApp sedang dibuka untuk mengirimkan rangkuman pesan konsultasi Anda langsung ke tim kami.
                    </p>
                    <Button
                      onClick={() => setIsSuccess(false)}
                      variant="outline"
                      className="mt-4 rounded-full"
                    >
                      Kirim Formulir Lain
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    {serverError && (
                      <div className="p-4 rounded-xl bg-destructive/10 text-destructive font-sans text-xs">
                        {serverError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Input
                        label="Nama Lengkap *"
                        placeholder="Contoh: Budi Santoso"
                        error={errors.name?.message}
                        {...register("name")}
                      />
                      <Input
                        label="Nomor WhatsApp *"
                        placeholder="Contoh: 081234567890"
                        error={errors.whatsapp?.message}
                        {...register("whatsapp")}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Input
                        label="Lokasi Proyek *"
                        placeholder="Contoh: BSD City, Tangerang"
                        error={errors.projectLocation?.message}
                        {...register("projectLocation")}
                      />
                      <Select
                        label="Jenis Ruangan *"
                        options={[
                          { label: "Rumah Tinggal", value: "Rumah Tinggal" },
                          { label: "Apartemen", value: "Apartemen" },
                          { label: "Kamar Tidur Utama", value: "Kamar Tidur Utama" },
                          { label: "Dapur & Kitchen Set", value: "Dapur & Kitchen Set" },
                          { label: "Ruang Komersial / Toko / Kafe", value: "Ruang Komersial" },
                          { label: "Kantor / Work Space", value: "Kantor / Work Space" },
                        ]}
                        error={errors.spaceType?.message}
                        {...register("spaceType")}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Select
                        label="Kebutuhan Layanan *"
                        options={[
                          { label: "Full Interior Design & Build", value: "Full Interior Design & Build" },
                          { label: "Desain Interior 3D Saja", value: "Desain Interior 3D Saja" },
                          { label: "Custom Furniture & Fit-out", value: "Custom Furniture & Fit-out" },
                          { label: "Renovasi Ruang & Pengawasan", value: "Renovasi Ruang & Pengawasan" },
                        ]}
                        error={errors.serviceNeed?.message}
                        {...register("serviceNeed")}
                      />
                      <Select
                        label="Estimasi Rencana Anggaran"
                        options={[
                          { label: "Di bawah Rp 50 Juta", value: "< Rp 50 Juta" },
                          { label: "Rp 50 Juta - Rp 150 Juta", value: "Rp 50jt - Rp 150jt" },
                          { label: "Rp 150 Juta - Rp 300 Juta", value: "Rp 150jt - Rp 300jt" },
                          { label: "Di atas Rp 300 Juta", value: "> Rp 300 Juta" },
                        ]}
                        error={errors.budgetRange?.message}
                        {...register("budgetRange")}
                      />
                    </div>

                    <Textarea
                      label="Pesan atau Catatan Tambahan"
                      placeholder="Ceritakan detail ruangan, gaya favorit, atau kebutuhan spesifik Anda..."
                      error={errors.message?.message}
                      {...register("message")}
                    />

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group inline-flex items-center justify-center gap-2.5 bg-primary text-soft-white font-sans text-xs uppercase tracking-wider pl-6 pr-3 py-4 rounded-full hover:bg-secondary transition-all active:scale-98 shadow-md mt-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Memproses Data...</span>
                        </>
                      ) : (
                        <>
                          <span className="font-semibold">Kirim & Lanjutkan Ke WhatsApp</span>
                          <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                            <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                          </span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
