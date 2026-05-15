import GalleryFull from "@/app/components/gallery/galleryFull/galleryFull";
import { allConcertPhotos } from "@/app/lib/gallery";

export default function ConcertPhotosGalleryPage() {
  return (
    <main>
      <GalleryFull
        title="Live archive"
        subtitle="Stage shots and live moments from Until They Fall shows."
        photos={allConcertPhotos}
      />
    </main>
  );
}
