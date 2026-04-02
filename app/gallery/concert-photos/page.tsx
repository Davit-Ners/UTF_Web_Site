import GalleryFull from "@/app/components/gallery/galleryFull/galleryFull";
import { allConcertPhotos } from "@/app/lib/gallery";

export default function ConcertPhotosGalleryPage() {
  return (
    <main>
      <GalleryFull
        title="Concert photos"
        subtitle=""
        photos={allConcertPhotos}
      />
    </main>
  );
}
