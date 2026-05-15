export type GalleryPhoto = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  meta?: string;
};

export const allConcertPhotos: GalleryPhoto[] = [
  {
    id: "live-1",
    src: "/optimized/gallery/band1.webp",
    alt: "Until They Fall live on stage",
    caption: "Release show",
    meta: "Brussels, BE",
  },
  {
    id: "live-2",
    src: "/optimized/gallery/band2.webp",
    alt: "Until They Fall live crowd",
    caption: "Crowd release",
    meta: "Arlon, BE",
  },
  {
    id: "live-3",
    src: "/optimized/gallery/dav1.webp",
    alt: "Lead guitar on stage",
    caption: "Lead guitar",
    meta: "VK - Brussels",
  },
  {
    id: "live-4",
    src: "/optimized/gallery/kev1.webp",
    alt: "Rhythm guitar on stage",
    caption: "Rhythm guitar",
    meta: "Club show",
  },
  {
    id: "live-5",
    src: "/optimized/gallery/bandall.webp",
    alt: "Until They Fall full band on stage",
    caption: "Full band",
    meta: "Festival stage",
  },
  {
    id: "live-6",
    src: "/optimized/gallery/val1.webp",
    alt: "Bass player on stage",
    caption: "Bass",
    meta: "Live show",
  },
];

export const galleryHeroPhotos = allConcertPhotos.slice(0, 3);
