import type { Metadata, Viewport } from "next";
import { EB_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingWhatsApp } from "@/components/shared/whatsapp-button";
import { siteConfig } from "@/config/site";
import { faqData } from "@/data/faq";
import "./globals.css";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-eb-garamond",
  display: "swap",
  weight: ["400", "500", "600"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
  // 700 is loaded by nobody — `font-sans font-bold` appears zero times in src/.
  weight: ["400", "500", "600"],
});

/**
 * The default title was the English brand tagline ("Editorial Minimalism in
 * Interior Design") — no search value for an Indonesian audience looking for
 * "jasa interior" or "kitchen set custom". Titles now lead with the service and
 * the region the studio actually works in.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `Jasa Desain Interior & Custom Furniture Bandung | ${siteConfig.name}`,
    template: `%s | ${siteConfig.name}`,
  },
  description:
    "Jasa desain interior & custom furniture bergaransi di Bandung dan Jabodetabek. Kitchen set, wardrobe, hingga interior rumah menyeluruh dengan RAB transparan.",
  keywords: [
    "jasa desain interior bandung",
    "custom furniture bandung",
    "kitchen set custom bandung",
    "jasa interior bandung barat",
    "wardrobe custom",
    "lemari bawah tangga custom",
    "interior rumah bandung",
    "kontraktor interior bandung",
    "fullhome id",
  ],
  authors: [{ name: "FULLHOME ID Studio" }],
  creator: "FULLHOME ID",
  publisher: "FULLHOME ID",
  applicationName: siteConfig.name,
  category: "Interior Design",
  formatDetection: { telephone: true, address: true, email: true },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    title: `Jasa Desain Interior & Custom Furniture Bandung | ${siteConfig.name}`,
    description:
      "Jasa desain interior & custom furniture bergaransi di Bandung dan Jabodetabek. Kitchen set, wardrobe, hingga interior rumah menyeluruh.",
    siteName: siteConfig.name,
    // Images come from the app/opengraph-image file convention, so the social
    // card uses a real project photo instead of an expiring third-party URL.
  },
  twitter: {
    card: "summary_large_image",
    title: `Jasa Desain Interior & Custom Furniture Bandung | ${siteConfig.name}`,
    description:
      "Jasa desain interior dan custom furniture bergaransi di Bandung & Jabodetabek.",
  },
  // Relative canonicals resolve against metadataBase and, crucially, let each
  // route override this. It used to be an absolute homepage URL inherited by
  // every page, which told Google /portofolio was a duplicate of /.
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#fdf9f3",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /**
   * LocalBusiness structured data.
   *
   * The address here used to read Jakarta / DKI Jakarta / Jabodetabek while the
   * studio is registered in Kabupaten Bandung Barat and nearly every documented
   * project is in Bandung Raya. For a local service business that mismatch is
   * close to fatal: Google had no reason to surface it in the region it serves.
   */
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${siteConfig.url}/#business`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: `+${siteConfig.whatsappNumber}`,
    image: `${siteConfig.url}/opengraph-image`,
    logo: `${siteConfig.url}/icon.png`,
    address: {
      "@type": "PostalAddress",
      ...siteConfig.postalAddress,
    },
    areaServed: siteConfig.areaServed.map((name) => ({ "@type": "Place", name })),
    openingHours: siteConfig.openingHours,
    sameAs: [siteConfig.social.instagram],
    priceRange: "$$",
    knowsLanguage: "id-ID",
  };

  // Lets Google render the FAQ block as a rich result rather than plain text.
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    inLanguage: "id-ID",
    publisher: { "@id": `${siteConfig.url}/#business` },
  };

  return (
    <html
      lang="id"
      className={`${ebGaramond.variable} ${plusJakartaSans.variable} grain`}
    >
      <head>
        {[localBusiness, websiteLd, faqLd].map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            // Static, developer-authored config — no user input reaches this.
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body className="min-h-screen bg-background text-foreground font-sans flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
