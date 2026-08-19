import { HeroSection } from "@/components/sections/hero-section";
import { TrustSection } from "@/components/sections/trust-section";
import { ServicesSection } from "@/components/sections/services-section";
import { PortfolioSection } from "@/components/sections/portfolio-section";
import { ProcessSection } from "@/components/sections/process-section";
import { AboutSection } from "@/components/sections/about-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { FaqSection } from "@/components/sections/faq-section";
import { ContactSection } from "@/components/sections/contact-section";
import { FinalCtaSection } from "@/components/sections/final-cta-section";
import { MotionProvider } from "@/components/shared/motion-provider";

/** Matches the portfolio page: cached HTML that still picks up newly added photos. */
export const revalidate = 300;

export default function Home() {
  return (
    <>
      {/* Client-only; lenis/gsap are imported inside its effect so they never
          join the entry chunk. */}
      <MotionProvider />
      <HeroSection />
      <TrustSection />
      <ServicesSection />
      <PortfolioSection />
      <ProcessSection />
      <AboutSection />
      <TestimonialsSection testimonials={[]} />
      <FaqSection />
      <ContactSection />
      <FinalCtaSection />
    </>
  );
}
