"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, ContactFormValues } from "@/lib/validations/contact";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, ArrowUpRight } from "lucide-react";

/**
 * The consultation form, split out of `contact-section.tsx` so that it can be
 * loaded on its own.
 *
 * react-hook-form + zod + the resolver are ~86 KB, and because the section was a
 * client component they joined the homepage entry chunk — downloaded and parsed
 * by every visitor, for a form that sits at the very bottom of a 19,000 px page.
 * `contact-form-lazy.tsx` now pulls this in as a separate chunk after hydration.
 */
export function ContactForm() {
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

  if (isSuccess) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-2xl md:text-3xl font-medium text-primary">
          Formulir Berhasil Diterima!
        </h3>
        <p className="font-sans text-sm text-warm-gray max-w-md leading-relaxed">
          Aplikasi WhatsApp sedang dibuka untuk mengirimkan rangkuman pesan konsultasi Anda langsung
          ke tim kami.
        </p>
        <Button onClick={() => setIsSuccess(false)} variant="outline" className="mt-4 rounded-full">
          Kirim Formulir Lain
        </Button>
      </div>
    );
  }

  return (
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
            <span className="font-semibold">Kirim &amp; Lanjutkan Ke WhatsApp</span>
            <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
              <ArrowUpRight className="w-3.5 h-3.5 text-white" />
            </span>
          </>
        )}
      </button>
    </form>
  );
}

export default ContactForm;
