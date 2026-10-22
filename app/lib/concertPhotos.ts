import type { Concert } from "./concerts";
import { galleryPhotos, type GalleryPhoto } from "./gallery";

/*
 * Photos of a show come only from the catalogue, and only when a photo's
 * `event` is explicitly this show's slug. Gallery paths stored on the
 * concert record are not trusted on their own.
 */
export function confirmedPhotos(show: Concert): GalleryPhoto[] {
  return galleryPhotos.filter((photo) => photo.event === show.id);
}
