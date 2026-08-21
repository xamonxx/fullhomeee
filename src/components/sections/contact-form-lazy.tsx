"use client";

import dynamic from "next/dynamic";

/**
 * Thin client boundary whose only job is to code-split the consultation form.
 *
 * `next/dynamic` with `ssr: false` cannot be called from a Server Component in
 * the App Router, so this wrapper exists to hold that call. It carries no
 * dependencies of its own — react-hook-form, zod and the resolver all resolve in
 * the lazily-loaded chunk rather than the homepage entry bundle.
 *
 * The skeleton mirrors the real form field-for-field using the same primitives'
 * dimensions (16 px label + 6 px gap + 48 px control), so promoting the real
 * form into its place does not move anything below it.
 */
const ContactForm = dynamic(() => import("./contact-form").then((m) => m.ContactForm), {
  ssr: false,
  loading: () => <FormSkeleton />,
});

function FieldSkeleton({ tall = false }: { tall?: boolean }) {
  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="h-4 w-32 rounded bg-foreground/10" />
      <div
        className={`w-full rounded-md border border-light-taupe bg-soft-white ${
          tall ? "min-h-[120px]" : "h-12"
        }`}
      />
    </div>
  );
}

function FormSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <p className="sr-only" role="status">
        Memuat formulir konsultasi…
      </p>
      {[0, 1, 2].map((row) => (
        <div key={row} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FieldSkeleton />
          <FieldSkeleton />
        </div>
      ))}
      <FieldSkeleton tall />
      <div className="h-[60px] w-64 max-w-full rounded-full bg-foreground/10 mt-2" />
    </div>
  );
}

export function ContactFormLazy() {
  return <ContactForm />;
}
