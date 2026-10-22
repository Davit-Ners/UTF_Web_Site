import type { Concert } from "./concerts";
import { splitCity } from "./concertFormat";
import { allConcertPhotos } from "./gallery";
import { getOptimizedImagePath } from "./imageOptimization";

export type ShowPhoto = { src: string; description: string };

/*
 * A gallery path only counts as a photo of this show when the photo
 * catalogue (gallery.ts) explicitly names the show's city. Paths that are
 * uncatalogued, or catalogued with another place, are not shown.
 */
export function confirmedPhotos(show: Concert): ShowPhoto[] {
  const city = splitCity(show.city).name.toLowerCase();

  return show.gallery.flatMap((path) => {
    const src = getOptimizedImagePath(path) ?? path;
    const entry = allConcertPhotos.find((photo) => (getOptimizedImagePath(photo.src) ?? photo.src) === src);
    if (!entry?.meta || !entry.meta.toLowerCase().includes(city)) return [];
    return [{ src, description: entry.alt }];
  });
}
