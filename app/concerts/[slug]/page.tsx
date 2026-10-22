import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import ShowDossier, { ShowUnavailable } from "@/app/components/concerts/showDossier/showDossier";
import { getPublishedConcerts, isPastConcert, type Concert } from "@/app/lib/concerts";
import { formatLongDate, reliableTimes, splitCity, usefulTitle } from "@/app/lib/concertFormat";
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
  const shows = await loadShows();
  if (!shows) return { title: "Concert" };

  const show = shows.find((s) => s.id === slug);
  if (!show) return {};

  const { heading } = describe(show);
  const title = usefulTitle(show);
  const description = [title, `Until They Fall live archive: ${show.venue}, ${show.city}, ${formatLongDate(show.date)}.`]
    .filter(Boolean)
    .join(" — ");

  return {
    title: heading,
    description,
    alternates: { canonical: `/concerts/${show.id}` },
    openGraph: {
      title: `${heading} | Until They Fall`,
      description,
      url: `/concerts/${show.id}`,
      ...(show.posterUrl ? { images: [{ url: show.posterUrl, alt: `${title ?? show.venue} poster` }] } : {}),
    },
    twitter: {
      card: show.posterUrl ? "summary_large_image" : "summary",
      title: `${heading} | Until They Fall`,
      description,
      ...(show.posterUrl ? { images: [show.posterUrl] } : {}),
    },
  };
}

/* "20 EUR" -> { price: "20", priceCurrency: "EUR" }; anything else is not structured */
function parsePrice(label?: string) {
  const match = label?.trim().match(/^(\d+(?:[.,]\d+)?)\s*(?:EUR|€)$/i);
  return match ? { price: match[1].replace(",", "."), priceCurrency: "EUR" } : null;
}

/* schema.org MusicEvent from stored fields only; anything unknown is left out */
function structuredData(show: Concert, isPast: boolean) {
  const site = getSiteUrl();
  const city = splitCity(show.city);
  const times = reliableTimes(show);
  const price = parsePrice(show.price);

  return {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: usefulTitle(show) ?? `${show.venue}, ${city.name}`,
    startDate: times.show ? `${show.date}T${times.show}` : show.date,
    ...(times.doors ? { doorTime: `${show.date}T${times.doors}` } : {}),
    url: `${site}/concerts/${show.id}`,
    location: {
      "@type": "Place",
      name: show.venue,
      address: {
        "@type": "PostalAddress",
        addressLocality: city.name,
        ...(city.country ? { addressCountry: city.country } : {}),
      },
    },
    ...(show.lineup?.length
      ? { performer: show.lineup.map((name) => ({ "@type": "MusicGroup", name })) }
      : {}),
    ...(show.posterUrl ? { image: `${site}${show.posterUrl}` } : {}),
    ...(!isPast && show.ticketUrl
      ? { offers: { "@type": "Offer", url: show.ticketUrl, ...(price ?? {}) } }
      : {}),
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
  /* "<" escaped so stored text can never close the script tag */
  const jsonLd = JSON.stringify(structuredData(show, isPast)).replace(/</g, "\\u003c");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <ShowDossier
        show={show}
        isPast={isPast}
        previous={shows[index - 1] ?? null}
        next={shows[index + 1] ?? null}
      />
    </>
  );
}
