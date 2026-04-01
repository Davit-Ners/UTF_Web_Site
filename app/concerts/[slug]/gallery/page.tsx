import { notFound } from "next/navigation";
import GalleryFull from "@/app/components/gallery/galleryFull/galleryFull";
import type { GalleryPhoto } from "@/app/components/gallery/galleryStrip/galleryStrip";
import { getConcertById } from "@/app/lib/concerts";

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export default async function ConcertGalleryPage({ params }: Props) {
  const { slug } = await params;
  const concert = await getConcertById(slug);

  if (!concert || concert.gallery.length === 0) {
    notFound();
  }

  const title = concert.title ?? `${concert.city} - ${concert.venue}`;
  const photos: GalleryPhoto[] = concert.gallery.map((src, index) => ({
    id: `${concert.id}-${index}`,
    src,
    alt: `${title} live photo ${index + 1}`,
    meta: concert.date,
  }));

  return (
    <main>
      <GalleryFull
        title={`Gallery - ${title}`}
        subtitle={`Live photos from the show on ${concert.date}.`}
        photos={photos}
      />
    </main>
  );
}
