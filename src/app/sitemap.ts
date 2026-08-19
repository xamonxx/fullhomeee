import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import { siteConfig } from "@/config/site";
import { MANIFEST_PATH } from "@/lib/portfolio-taxonomy";
import { getCategories } from "@/lib/portfolio-manifest";
import { getCategoryCopy } from "@/data/portfolio-categories";

/**
 * XML sitemap.
 *
 * `lastModified` was `new Date()` on every request, so every URL always claimed
 * to have changed this second. Crawlers discount that quickly. The dates now come
 * from real signals: the photo manifest's build time for the portfolio, and the
 * newest of the two for the homepage.
 *
 * `priority` and `changeFrequency` are deliberately omitted — Google has stated
 * it ignores both, and inventing values only adds noise.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url.replace(/\/$/, "");

  const portfolioUpdated = (() => {
    try {
      return fs.statSync(MANIFEST_PATH).mtime;
    } catch {
      return new Date();
    }
  })();

  const homeUpdated = (() => {
    try {
      // The homepage changes when its sections do; the built page is the closest
      // honest proxy available at request time.
      return fs.statSync(path.join(process.cwd(), "package.json")).mtime;
    } catch {
      return new Date();
    }
  })();

  // Every category that has photos is its own indexable page.
  const categoryUrls = getCategories()
    .filter((c) => getCategoryCopy(c.id))
    .map((c) => ({
      url: `${baseUrl}/portofolio/${c.id}`,
      lastModified: portfolioUpdated,
    }));

  return [
    // No trailing slash: matches the canonical Next emits for the homepage.
    { url: baseUrl, lastModified: homeUpdated },
    { url: `${baseUrl}/portofolio`, lastModified: portfolioUpdated },
    ...categoryUrls,
  ];
}
