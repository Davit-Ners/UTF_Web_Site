import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

/* Every public page is crawlable; form endpoints are not pages */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
