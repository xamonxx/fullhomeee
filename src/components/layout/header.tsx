"use client";

import { useState, useEffect } from "react";
import { siteConfig } from "@/config/site";
import { MobileNav } from "./mobile-nav";
import { Menu, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // The portfolio browser ships its own contextual bar (back link, section title,
  // CTA). Rendering this one too stacked two headers on top of each other.
  const hasOwnHeader = pathname?.startsWith("/portofolio") ?? false;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function resolveHref(href: string): string {
    if (href.startsWith("/")) return href;
    if (href === "#") return isHomePage ? "#" : "/";
    return isHomePage ? href : `/${href}`;
  }

  if (hasOwnHeader) return null;

  return (
    <>
      {/* Top Micro Announcement Bar */}
      <div className="bg-primary text-soft-white py-1.5 px-4 text-center font-sans text-[11px] md:text-xs tracking-wider uppercase flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>Konsultasikan Proyek Interior Anda Bersama Tim FULLHOME ID Studio</span>
      </div>

      {/* Floating Island Header Container */}
      <div className="sticky top-3 z-40 w-full px-4 md:px-6 pointer-events-none">
        <header
          id="main-header"
          className={cn(
            "pointer-events-auto max-w-6xl mx-auto rounded-full transition-all duration-500 border shadow-sm",
            isScrolled
              ? "bg-background/85 backdrop-blur-xl border-foreground/15 shadow-md py-2.5 px-5 md:px-7"
              : "bg-background/70 backdrop-blur-md border-foreground/10 py-3 px-5 md:px-8"
          )}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center gap-3 focus:outline-none"
            >
              <div className="relative w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border border-foreground/15 bg-white shadow-xs shrink-0 group-hover:scale-105 group-hover:border-secondary transition-all duration-300">
                <Image
                  src="/logo-v3.png"
                  alt="FULLHOME ID Logo"
                  fill
                  sizes="40px"
                  className="object-contain p-1"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg md:text-xl font-medium tracking-tight text-primary group-hover:text-secondary transition-colors leading-none">
                  FULLHOME ID
                </span>
                <span className="font-sans text-[9px] text-warm-gray tracking-widest uppercase mt-0.5">
                  Interior Studio
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav aria-label="Navigasi Utama" className="hidden md:flex items-center gap-7">
              {siteConfig.mainNav.map((item) => {
                const href = resolveHref(item.href);
                const isActive = item.href === "/portofolio" && pathname === "/portofolio";
                return (
                  <Link
                    key={item.label}
                    href={href}
                    className={cn(
                      "font-sans text-xs md:text-sm tracking-wide transition-all duration-200 relative py-1",
                      isActive
                        ? "text-primary font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-secondary after:rounded-full"
                        : "text-warm-gray hover:text-primary"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Island Button CTA */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href={isHomePage ? "#contact" : "/#contact"}
                className="group inline-flex items-center gap-2.5 bg-primary text-soft-white font-sans text-xs uppercase tracking-wider pl-5 pr-2 py-2 rounded-full hover:bg-secondary transition-all active:scale-95 shadow-sm"
              >
                <span className="font-medium">Konsultasi Gratis</span>
                <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                  <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                </span>
              </Link>
            </div>

            {/* Mobile Trigger Button */}
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Buka Menu Navigasi"
              className="md:hidden p-2 text-primary hover:text-secondary focus:outline-none rounded-full border border-foreground/10 bg-black/5 dark:bg-white/5"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </header>
      </div>

      {/* Mobile Drawer Navigation */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />
    </>
  );
}
