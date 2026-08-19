import type { Metadata } from "next";

/**
 * Page-level metadata.
 *
 * Two things this fixes:
 *  - The canonical was inherited from the root layout, so this page declared
 *    itself a duplicate of the homepage and would have been dropped from the index.
 *  - The title carried the brand and then had it appended again by the root
 *    template, producing "Portofolio | FULLHOME ID – … | FULLHOME ID".
 */
export const metadata: Metadata = {
  title: "Portofolio Proyek Interior",
  description:
    "105+ foto dokumentasi nyata proyek interior FULLHOME ID: kitchen set, wardrobe, lemari bawah tangga, dan backdrop TV di Bandung Raya & Jabodetabek.",
  keywords: [
    "portofolio interior bandung",
    "contoh kitchen set custom",
    "galeri wardrobe custom",
    "hasil pengerjaan interior",
    "lemari bawah tangga",
  ],
  alternates: { canonical: "/portofolio" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/portofolio",
    title: "Portofolio Proyek Interior | FULLHOME ID",
    description:
      "Galeri dokumentasi nyata pengerjaan interior kustom FULLHOME ID di Bandung Raya & Jabodetabek.",
    siteName: "FULLHOME ID",
  },
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
