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
    caption: "Sent To Die release show",
    meta: "Brussels, BE - 2025",
  },
  {
    id: "live-2",
    src: "/gallery/band2.jpg",
    alt: "Crowd during a breakdown",
    caption: "Crowd during the breakdown",
    meta: "Arlon, BE - 2025",
  },
  {
    id: "live-3",
    src: "/gallery/dav1.jpg",
    alt: "Lead guitar under red lights",
    caption: "Guitars and red wash",
    meta: "VK - Brussels",
  },
  {
    id: "live-4",
    src: "/gallery/kev1.jpg",
    alt: "Rhythm guitar on stage",
    caption: "Rhythm side pressure",
    meta: "Club night",
  },
  {
    id: "live-5",
    src: "/gallery/bandall.jpg",
    alt: "Until They Fall full band silhouette",
    caption: "Full band silhouette",
    meta: "Festival stage",
  },
  {
    id: "live-6",
    src: "/gallery/val1.jpg",
    alt: "Bass player in a packed room",
    caption: "Low-end in a packed room",
    meta: "Release party",
  },
];

export const galleryHeroPhotos = allConcertPhotos.slice(0, 3);
