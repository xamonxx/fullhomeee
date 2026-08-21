"use client";

import { buildWhatsAppLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

interface FloatingWhatsAppProps {
  className?: string;
}

export function FloatingWhatsApp({ className }: FloatingWhatsAppProps) {
  const link = buildWhatsAppLink();

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      // WCAG 2.5.3: the accessible name has to contain the visible text, and the
      // visible text here is "Chat WhatsApp".
      aria-label="Chat WhatsApp dengan FULLHOME ID"
      className={cn(
        "fixed bottom-6 right-6 z-40 bg-muted-olive hover:bg-secondary text-soft-white p-3.5 md:p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2",
        className
      )}
    >
      <MessageCircle className="w-6 h-6 transition-transform group-hover:rotate-12" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-sans text-xs font-semibold pl-0 group-hover:pl-2">
        Chat WhatsApp
      </span>
    </a>
  );
}

interface WhatsAppButtonProps {
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  messageData?: Record<string, string>;
}

export function WhatsAppButton({
  children = "Konsultasi via WhatsApp",
  variant = "primary",
  className = "",
  messageData,
}: WhatsAppButtonProps) {
  const link = buildWhatsAppLink(messageData);

  const baseStyles =
    "inline-flex items-center justify-center font-sans font-semibold text-sm px-6 py-3.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2";

  const variantStyles = {
    primary:
      "bg-primary text-soft-white hover:bg-secondary shadow-sm hover:shadow-md hover:scale-[1.02]",
    secondary:
      "bg-muted-olive text-soft-white hover:bg-secondary shadow-sm hover:scale-[1.02]",
    outline:
      "border border-light-taupe text-primary hover:border-warm-gray hover:bg-surface-container-low bg-soft-white/60 backdrop-blur-sm",
  };

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      // No aria-label: it overrode the visible label with different words, so the
      // button announced something the caller could not read on screen.
      className={cn(baseStyles, variantStyles[variant], className)}
    >
      <MessageCircle className="w-4 h-4 mr-2.5 shrink-0" />
      <span>{children}</span>
    </a>
  );
}
