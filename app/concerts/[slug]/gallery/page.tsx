import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import GalleryFull, { type GalleryFullPhoto } from "@/app/components/gallery/galleryFull/galleryFull";
import { confirmedPhotos } from "@/app/lib/concertPhotos";
import { formatLongDate, splitCity } from "@/app/lib/concertFormat";
import { getConcertById, type Concert } from "@/app/lib/concerts";
import { socialMetadata } from "@/app/lib/seo";
import { ShowUnavailable } from "@/app/components/concerts/showDossier/showDossier";

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

/* Shared by generateMetadata and the page. "unavailable" = data could not be loaded */
const loadConcert = cache(async (slug: string): Promise<Concert | null | "unavailable"> => {
  try {
    return await getConcertById(slug);
  } catch (error) {
    console.error("Concert photos unavailable:", error);
    return "unavailable";
  }
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const path = `/concerts/${encodeURIComponent(slug)}/gallery`;
  const concert = await loadConcert(slug);

  if (concert === "unavailable") {
    const description = "Live photos from the Until They Fall concert archive.";
    return {
      title: "Concert photos",
      description,
      alternates: { canonical: path },
      ...socialMetadata({ title: "Concert photos | Until They Fall", description, path }),
    };
  }

  /* Unknown or ineligible: the page returns 404 */
  const photos = concert ? confirmedPhotos(concert) : [];
  if (!concert || photos.length === 0) return {};

  const city = splitCity(concert.city).name;
  const title = `Photos — ${city} — ${concert.venue}, ${formatLongDate(concert.date)}`;
  const description = `Live photos of Until They Fall at ${concert.venue}, ${concert.city}, ${formatLongDate(concert.date)}.`;
  const canonical = `/concerts/${concert.id}/gallery`;
  const [lead] = photos;

  return {
    title,
    description,
    alternates: { canonical },
    ...socialMetadata({
      title: `${title} | Until They Fall`,
      description,
      path: canonical,
      image: { url: lead.src, width: lead.width, height: lead.height, alt: lead.alt },
    }),
  };
}

export default async function ConcertGalleryPage({ params }: Props) {
  const { slug } = await params;
  const concert = await loadConcert(slug);
  if (concert === "unavailable") return <ShowUnavailable gallerySlug={slug} />;

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
