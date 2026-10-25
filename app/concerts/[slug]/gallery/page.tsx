import { notFound } from "next/navigation";
import GalleryFull, { type GalleryFullPhoto } from "@/app/components/gallery/galleryFull/galleryFull";
import { confirmedPhotos } from "@/app/lib/concertPhotos";
import { getConcertById } from "@/app/lib/concerts";
import { ShowUnavailable } from "@/app/components/concerts/showDossier/showDossier";

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export default async function ConcertGalleryPage({ params }: Props) {
  const { slug } = await params;
  let concert;
  try {
    concert = await getConcertById(slug);
  } catch (error) {
    console.error("Concert photos unavailable:", error);
    return <ShowUnavailable gallerySlug={slug} />;
  }

  /* Only catalogue photos explicitly linked to this show */
  const confirmed = concert ? confirmedPhotos(concert) : [];
  if (!concert || confirmed.length === 0) {
    notFound();
  }

  const title = concert.title ?? `${concert.city} - ${concert.venue}`;
  const photos: GalleryFullPhoto[] = confirmed.map((photo) => ({
    id: photo.id,
    src: photo.src,
    alt: photo.alt,
    caption: photo.caption,
    meta: concert.date,
  }));

  return (
    <div>
      <GalleryFull
        title={`Gallery - ${title}`}
        subtitle={`Live photos from the show on ${concert.date}.`}
        photos={photos}
      />
    </div>
  );
}
