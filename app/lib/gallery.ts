/*
 * Photo catalogue: the single source of truth for gallery and concert photos.
 * Only record what is known. `event` (a concert slug) is the one field that
 * ties a photo to a show; leave it out unless the show is confirmed.
 */

/* Public photographer credits. Set to false to hide them everywhere. */
export const SHOW_PHOTO_CREDITS = true;

export type PhotoCredit = {
  name: string;
  /* Where the name comes from: embedded EXIF Artist/Copyright, or a baked-in watermark */
  source: "exif" | "watermark";
};

export type GalleryChapterId = "live-henoumont" | "live-vangelder" | "promo";

export type GalleryPhoto = {
  id: string;
  /* Full-resolution source */
  src: string;
  width: number;
  height: number;
  alt: string;
  /* Short, visually defensible label shown under the image */
  caption?: string;
  /* Concert slug; only when the show is confirmed */
  event?: string;
  credit?: PhotoCredit;
  chapter: GalleryChapterId;
  /* The file has a thin border baked in that should be trimmed out of frame */
  bakedBorder?: boolean;
};

export type GalleryChapter = {
  id: GalleryChapterId;
  title: string;
  /* Large full-bleed opener; off when the lead image should not dominate */
  opener: boolean;
};

export const galleryChapters: GalleryChapter[] = [
  /* One visual session (same backdrop, rig and stage); venue and date unconfirmed */
  { id: "live-henoumont", title: "Live", opener: true },
  /* Baked watermark: never the full-bleed opener */
  { id: "live-vangelder", title: "Live", opener: false },
  { id: "promo", title: "Promo", opener: false },
];

const HENOUMONT: PhotoCredit = { name: "Laurent Henoumont", source: "exif" };
const VANGELDER: PhotoCredit = { name: "Peter Vangelder", source: "watermark" };

export const galleryPhotos: GalleryPhoto[] = [
  {
    id: "henoumont-full-band",
    src: "/gallery/bandall.jpg",
    width: 2048,
    height: 1329,
    alt: "Until They Fall on stage under red spotlights, the band name on the backdrop and audience silhouettes in the foreground",
    caption: "Full band",
    credit: HENOUMONT,
    chapter: "live-henoumont",
    bakedBorder: true,
  },
  {
    id: "henoumont-live",
    src: "/gallery/band1.jpg",
    width: 2048,
    height: 1329,
    alt: "The singer at the microphone with two guitarists behind him in orange stage light",
    caption: "Live",
    credit: HENOUMONT,
    chapter: "live-henoumont",
    bakedBorder: true,
  },
  {
    id: "henoumont-lead-guitar",
    src: "/gallery/dav1.jpg",
    width: 2048,
    height: 1360,
    alt: "The lead guitarist with his head thrown back under blue and amber light",
    caption: "Lead guitar",
    credit: HENOUMONT,
    chapter: "live-henoumont",
    bakedBorder: true,
  },
  {
    id: "henoumont-rhythm-guitar",
    src: "/gallery/kev1.jpg",
    width: 2048,
    height: 1378,
    alt: "The rhythm guitarist bent over his guitar in amber light",
    caption: "Rhythm guitar",
    credit: HENOUMONT,
    chapter: "live-henoumont",
    bakedBorder: true,
  },
  {
    id: "henoumont-bass",
    src: "/gallery/val1.jpg",
    width: 2048,
    height: 1377,
    alt: "The bassist singing into the microphone in blue light",
    caption: "Bass / vocals",
    credit: HENOUMONT,
    chapter: "live-henoumont",
    bakedBorder: true,
  },
  {
    id: "henoumont-vocals",
    src: "/gallery/band2.jpg",
    width: 2048,
    height: 1168,
    alt: "The singer headbanging at the microphone in red light, a guitarist and the drums behind",
    caption: "Live",
    credit: HENOUMONT,
    chapter: "live-henoumont",
    bakedBorder: true,
  },
  {
    id: "vangelder-full-band",
    src: "/gallery/utf-band-good.jpg",
    width: 2048,
    height: 1536,
    alt: "The five members on a small stage in orange light, the singer in front",
    caption: "Full band",
    credit: VANGELDER,
    chapter: "live-vangelder",
  },
  {
    id: "promo-band",
    src: "/gallery/band-test.jpg",
    width: 2048,
    height: 1363,
    alt: "The five members posed in an empty room, black and white",
    chapter: "promo",
  },
];

/* Unique credited photographers, for counts; empty when credits are hidden */
export function creditedPhotographers(photos: GalleryPhoto[] = galleryPhotos) {
  if (!SHOW_PHOTO_CREDITS) return [];
  return Array.from(new Set(photos.flatMap((photo) => (photo.credit ? [photo.credit.name] : []))));
}
