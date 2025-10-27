import { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Gerar URLs para cada locale
  const localeUrls = routing.locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 1,
  }));

  return localeUrls;
}
