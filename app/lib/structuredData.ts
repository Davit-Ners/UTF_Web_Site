/*
 * schema.org JSON-LD built from shared site data only. The homepage MusicGroup
 * is the authoritative band entity; other pages reference it by @id.
 */
import { CONTACT_EMAIL } from "./contact";
import { members } from "./about";
import { BAND_PROFILES } from "./links";
import { discography, type Release } from "./music";
import { getListenLinks } from "./release";
import { reliableTimes, splitCity, supportingActs, usefulTitle } from "./concertFormat";
import type { Concert } from "./concerts";
import { BAND_SHARE_IMAGE, SITE_NAME } from "./seo";

/* Shows are stored and displayed in this zone (concerts.ts default) */
const SHOW_TIME_ZONE = "Europe/Brussels";

/* "<" escaped so stored text can never close the script tag */
export function jsonLd(data: object) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

const bandId = (site: string) => `${site}/#band`;
const albumId = (site: string, release: Release) => `${site}/music/${release.id}#album`;

export function bandReference(site: string) {
  return { "@type": "MusicGroup", "@id": bandId(site), name: SITE_NAME, url: site };
}

export function musicGroupJsonLd(site: string) {
  return {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    "@id": bandId(site),
    name: SITE_NAME,
    url: site,
    genre: "Melodic death metal",
    foundingDate: "2018",
    foundingLocation: {
      "@type": "Place",
      name: "Brussels, Belgium",
      address: { "@type": "PostalAddress", addressLocality: "Brussels", addressCountry: "BE" },
    },
    image: `${site}${BAND_SHARE_IMAGE.url}`,
    email: CONTACT_EMAIL,
    member: members.map((member) => ({
      "@type": "OrganizationRole",
      roleName: member.role,
      startDate: String(member.since),
      member: { "@type": "Person", name: member.name },
    })),
    album: discography.map((release) => ({
      "@type": "MusicAlbum",
      "@id": albumId(site, release),
      name: release.title,
      url: `${site}/music/${release.id}`,
    })),
    sameAs: Object.values(BAND_PROFILES).map((profile) => profile.href),
  };
}

/* "5:08" -> "PT5M8S" */
function isoDuration(length: string) {
  const [minutes, seconds] = length.split(":").map(Number);
  return `PT${minutes}M${seconds}S`;
}

export function musicAlbumJsonLd(release: Release, site: string) {
  const tracks = release.tracks ?? [];
  const artist = bandReference(site);
  return {
    "@context": "https://schema.org",
    "@type": "MusicAlbum",
    "@id": albumId(site, release),
    name: release.title,
    url: `${site}/music/${release.id}`,
    byArtist: artist,
    ...(release.type === "Album" ? { albumReleaseType: "https://schema.org/AlbumRelease" } : {}),
    datePublished: release.releaseDate ?? String(release.year),
    image: `${site}${release.coverMaster ?? release.cover}`,
    ...(tracks.length
      ? {
          numTracks: tracks.length,
          track: {
            "@type": "ItemList",
            numberOfItems: tracks.length,
            itemListElement: tracks.map((track, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: { "@type": "MusicRecording", name: track.title, duration: isoDuration(track.length), byArtist: artist },
            })),
          },
        }
      : {}),
    sameAs: getListenLinks(release).map((link) => link.href),
  };
}

/* UTC offset of the show zone at that local date/time, e.g. "+01:00" */
function zoneOffset(date: string, time: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const instant = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const name = new Intl.DateTimeFormat("en-US", { timeZone: SHOW_TIME_ZONE, timeZoneName: "longOffset" })
    .formatToParts(instant)
    .find((part) => part.type === "timeZoneName")?.value;
  const offset = name?.replace("GMT", "") ?? "";
  return offset === "" ? "+00:00" : offset;
}

/* Date only when no reliable time exists; otherwise local time with its offset */
function eventDateTime(date: string, time?: string) {
  return time ? `${date}T${time}:00${zoneOffset(date, time)}` : date;
}

/* "20 EUR" -> { price: "20", priceCurrency: "EUR" }; anything else is not structured */
function parsePrice(label?: string) {
  const match = label?.trim().match(/^(\d+(?:[.,]\d+)?)\s*(?:EUR|€)$/i);
  return match ? { price: match[1].replace(",", "."), priceCurrency: "EUR" } : null;
}

const absolute = (site: string, url: string) => (url.startsWith("/") ? `${site}${url}` : url);

/*
 * schema.org MusicEvent from stored fields only. Only PUBLISHED shows are
 * loaded (cancelled ones are a separate status), so they are scheduled;
 * availability, organiser and sold-out state are never inferred.
 */
export function musicEventJsonLd(show: Concert, isPast: boolean, site: string) {
  const city = splitCity(show.city);
  const times = reliableTimes(show);
  const price = parsePrice(show.price);

  return {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: usefulTitle(show) ?? `${show.venue}, ${city.name}`,
    startDate: eventDateTime(show.date, times.show),
    ...(times.doors ? { doorTime: eventDateTime(show.date, times.doors) } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
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
    performer: [
      bandReference(site),
      ...supportingActs(show).map((name) => ({ "@type": "MusicGroup", name })),
    ],
    ...(show.posterUrl ? { image: absolute(site, show.posterUrl) } : {}),
    ...(!isPast && show.ticketUrl
      ? { offers: { "@type": "Offer", url: absolute(site, show.ticketUrl), ...(price ?? {}) } }
      : {}),
  };
}
