import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import ShowDossier, { ShowUnavailable } from "@/app/components/concerts/showDossier/showDossier";
import { getPublishedConcerts, isPastConcert, type Concert } from "@/app/lib/concerts";
import { formatLongDate, splitCity, usefulTitle } from "@/app/lib/concertFormat";
import { BAND_SHARE_IMAGE, socialMetadata } from "@/app/lib/seo";
import { jsonLd, musicEventJsonLd } from "@/app/lib/structuredData";
import { getSiteUrl } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

/* One query per request, shared by generateMetadata and the page. null = data unavailable */
const loadShows = cache(async (): Promise<Concert[] | null> => {
  try {
    const shows = await getPublishedConcerts();
    return [...shows].sort((a, b) => a.date.localeCompare(b.date));
  } catch (error) {
    console.error("Concert detail unavailable:", error);
    return null;
  }
});

function describe(show: Concert) {
  const city = splitCity(show.city).name;
  return {
    city,
    heading: `${city} — ${show.venue}, ${formatLongDate(show.date)}`,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const path = `/concerts/${encodeURIComponent(slug)}`;
  const shows = await loadShows();

  /* Outage: route-specific and truthful, without venue, city or date */
  if (!shows) {
    const description = "Concert details from the Until They Fall live archive.";
    return {
      title: "Concert",
      description,
      alternates: { canonical: path },
      ...socialMetadata({ title: "Concert | Until They Fall", description, path }),
    };
  }

  const show = shows.find((s) => s.id === slug);
  if (!show) return {};

  const { heading } = describe(show);
  const title = usefulTitle(show);
  const description = [title, `Until They Fall live archive: ${show.venue}, ${show.city}, ${formatLongDate(show.date)}.`]
    .filter(Boolean)
    .join(" — ");
  const image = show.posterUrl
    ? { url: show.posterUrl, ...(show.posterDimensions ?? {}), alt: `${title ?? show.venue} poster` }
    : BAND_SHARE_IMAGE;

  return {
    title: heading,
    description,
    alternates: { canonical: `/concerts/${show.id}` },
    openGraph: {
      title: `${heading} | Until They Fall`,
      description,
      url: `/concerts/${show.id}`,
      images: [image],
    },
    twitter: {
      card: show.posterUrl ? "summary_large_image" : "summary",
      title: `${heading} | Until They Fall`,
      description,
      images: [image.url],
    },
  };
}

export default async function ConcertDetailPage({ params }: Props) {
  const { slug } = await params;
  const shows = await loadShows();
  if (!shows) return <ShowUnavailable />;

  const index = shows.findIndex((s) => s.id === slug);
  if (index === -1) notFound();

  const show = shows[index];
  const isPast = isPastConcert(show);
  const structured = jsonLd(musicEventJsonLd(show, isPast, getSiteUrl()));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structured }} />
      <ShowDossier
        show={show}
        isPast={isPast}
        previous={shows[index - 1] ?? null}
        next={shows[index + 1] ?? null}
      />
    </>
  );
}
