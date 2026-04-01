import type { MetadataRoute } from "next";
import { getPublishedConcerts } from "@/app/lib/concerts";
import { discography } from "@/app/lib/music";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();
  const concerts = await getPublishedConcerts();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/booking",
    "/concerts",
    "/concerts/past",
    "/gallery",
    "/gallery/concert-photos",
    "/merch",
    "/music",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
  }));

  const concertRoutes: MetadataRoute.Sitemap = concerts.flatMap((concert) => {
    const routes: MetadataRoute.Sitemap = [
      {
        url: `${siteUrl}/concerts/${concert.id}`,
        lastModified: now,
      },
    ];

    if (concert.gallery.length > 0) {
      routes.push({
        url: `${siteUrl}/concerts/${concert.id}/gallery`,
        lastModified: now,
      });
    }

    return routes;
  });

  const releaseRoutes: MetadataRoute.Sitemap = discography.map((release) => ({
    url: `${siteUrl}/music/${release.id}`,
    lastModified: now,
  }));

  return [...staticRoutes, ...concertRoutes, ...releaseRoutes];
}
