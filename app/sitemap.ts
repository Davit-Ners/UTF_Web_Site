import type { MetadataRoute } from "next";
import { getPublishedConcerts } from "@/app/lib/concerts";
import type { Concert } from "@/app/lib/concerts";
import { confirmedPhotos } from "@/app/lib/concertPhotos";
import { discography } from "@/app/lib/music";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  let concerts: Concert[] = [];
  try {
    concerts = await getPublishedConcerts();
  } catch (error) {
    console.error("Sitemap concert entries unavailable:", error);
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/booking",
    "/concerts",
    "/gallery",
    "/merch",
    "/music",
    "/privacy",
    "/legal",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
  }));

  const concertRoutes: MetadataRoute.Sitemap = concerts.flatMap((concert) => {
    const routes: MetadataRoute.Sitemap = [
      {
        url: `${siteUrl}/concerts/${concert.id}`,
      },
    ];

    if (confirmedPhotos(concert).length > 0) {
      routes.push({
        url: `${siteUrl}/concerts/${concert.id}/gallery`,
      });
    }

    return routes;
  });

  const releaseRoutes: MetadataRoute.Sitemap = discography.map((release) => ({
    url: `${siteUrl}/music/${release.id}`,
  }));

  return [...staticRoutes, ...concertRoutes, ...releaseRoutes];
}
