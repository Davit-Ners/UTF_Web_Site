"use client";

import GalleryFull from "@/app/components/gallery/galleryFull/galleryFull";
import { GalleryPhoto } from "@/app/components/gallery/galleryStrip/galleryStrip";

const allConcertPhotos: GalleryPhoto[] = [
  // reprends toutes les photos live que tu utilises déjà
  // + les autres
];

export default function ConcertPhotosGalleryPage() {
  return (
    <main>
      <GalleryFull
        title="Concert photos"
        subtitle="All live shots from Until They Fall shows — festivals, clubs and release parties."
        photos={allConcertPhotos}
      />
    </main>
  );
};
