"use client";

import { useState } from "react";
import { MapPin, Play } from "lucide-react";
import { siteConfig } from "@/config/site";

/**
 * Click-to-load facade for the Google Maps embed.
 *
 * The embed was the single most expensive thing on the homepage: 403 KB of
 * transfer and 699 ms of main-thread CPU, of which 220 KB was never executed.
 * `loading="lazy"` did not hold it back — Chrome loads lazy iframes that are
 * anywhere near the viewport, and on a phone the whole page is "near".
 *
 * Nothing is hidden behind the click. The address, plus code and opening hours
 * are plain text in `about-section.tsx`, and the "directions" link goes straight
 * to Google Maps. Only the interactive pan-and-zoom surface is deferred, and it
 * loads into exactly the same box, so promoting it causes no layout shift.
 */
export function MapEmbed() {
  const [loaded, setLoaded] = useState(false);

  const embedUrl =
    "https://maps.google.com/maps?q=5C8C%2B8P+Citatah,+West+Bandung+Regency,+West+Java&t=&z=15&ie=UTF8&iwloc=&output=embed";

  return (
    <div className="relative w-full aspect-[4/3] lg:aspect-[16/10] overflow-hidden bg-muted border border-foreground/10">
      {loaded ? (
        <iframe
          title="Peta lokasi office FULLHOME ID di Citatah, Bandung Barat"
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
        />
      ) : (
        <button
          type="button"
          onClick={() => setLoaded(true)}
          className="group absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-inset"
        >
          {/* Decorative grid: suggests a map without fetching one. */}
          <span
            aria-hidden
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <span className="relative flex items-center justify-center w-12 h-12 rounded-full bg-background border border-foreground/15 shadow-warm">
            <MapPin className="w-5 h-5 text-secondary" />
          </span>

          <span className="relative flex flex-col gap-1.5">
            {/* `plusCode` already reads "5C8C+8P Citatah, West Bandung Regency,
                West Java", so appending the town repeated it. */}
            <span className="font-serif text-lg md:text-xl text-primary leading-snug">
              {siteConfig.plusCode}
            </span>
            <span className="font-sans text-xs text-warm-gray leading-relaxed max-w-sm">
              Peta interaktif dimuat saat dibutuhkan agar halaman ini tetap ringan.
            </span>
          </span>

          <span className="relative inline-flex items-center gap-2.5 bg-primary text-soft-white font-sans text-[11px] uppercase tracking-[0.18em] pl-5 pr-2 py-2 rounded-full group-hover:bg-secondary transition-colors">
            <span className="font-medium">Muat peta interaktif</span>
            <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center">
              <Play className="w-3 h-3 text-white fill-current" />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
