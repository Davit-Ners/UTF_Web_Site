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
    src: "/gallery/band1.jpg",
    alt: "Until They Fall live on stage",
    caption: "Release show",
    meta: "Brussels, BE",
  },
  {
    id: "live-2",
    src: "/gallery/band2.jpg",
    alt: "Until They Fall live crowd",
    caption: "Crowd release",
    meta: "Arlon, BE",
  },
  {
    id: "live-3",
    src: "/gallery/dav1.jpg",
    alt: "Lead guitar on stage",
    caption: "Lead guitar",
    meta: "VK - Brussels",
  },
  {
    id: "live-4",
    src: "/gallery/kev1.jpg",
    alt: "Rhythm guitar on stage",
    caption: "Rhythm guitar",
    meta: "Club show",
  },
  {
    id: "live-5",
    src: "/gallery/bandall.jpg",
    alt: "Until They Fall full band on stage",
    caption: "Full band",
    meta: "Festival stage",
  },
  {
    id: "live-6",
    src: "/gallery/val1.jpg",
    alt: "Bass player on stage",
    caption: "Bass",
    meta: "Live show",
  },
];

export const galleryHeroPhotos = allConcertPhotos.slice(0, 3);
