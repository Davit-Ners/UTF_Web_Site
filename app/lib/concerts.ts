import prisma from "@/lib/prisma";

const DEFAULT_TIMEZONE = "Europe/Brussels";

export type Concert = {
  id: string;
  date: string;
  city: string;
  venue: string;
  note?: string;
  ticketUrl?: string;
  title?: string;
  posterUrl?: string;
  lineup?: string[];
  doorsTime?: string;
  showTime?: string;
  price?: string;
  facebookEventUrl?: string;
  gallery: string[];
  description?: string;
};

type ConcertRow = Awaited<ReturnType<typeof fetchPublishedConcertRows>>[number];

function getDateParts(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(date);

  return {
    year: parts.find((part) => part.type === "year")?.value ?? "0000",
    month: parts.find((part) => part.type === "month")?.value ?? "01",
    day: parts.find((part) => part.type === "day")?.value ?? "01",
    hour: parts.find((part) => part.type === "hour")?.value ?? "00",
    minute: parts.find((part) => part.type === "minute")?.value ?? "00",
  };
}

function formatDateOnly(date: Date, timeZone: string) {
  const parts = getDateParts(date, timeZone);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function formatTime(date: Date | null, timeZone: string) {
  if (!date) return undefined;
  const parts = getDateParts(date, timeZone);
  return `${parts.hour}:${parts.minute}`;
}

function getTodayDateString(timeZone = DEFAULT_TIMEZONE) {
  return formatDateOnly(new Date(), timeZone);
}

function compareByDateAsc(a: Concert, b: Concert) {
  return a.date.localeCompare(b.date);
}

function compareByDateDesc(a: Concert, b: Concert) {
  return b.date.localeCompare(a.date);
}

function sanitizeLink(value: string | null | undefined) {
  const trimmed = value?.trim();

  if (!trimmed) return undefined;
  if (trimmed.startsWith("/")) return trimmed;

  try {
    const parsed = new URL(trimmed);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return undefined;
    }

    if (parsed.hostname.toLowerCase().endsWith("example.com")) {
      return undefined;
    }

    return parsed.toString();
  } catch {
    return undefined;
  }
}

function mapConcert(row: ConcertRow): Concert {
  const timeZone = row.timezone || DEFAULT_TIMEZONE;
  const posterImage = row.posterUrl ?? row.images.find((image) => image.kind === "POSTER")?.url;
  const galleryImages = row.images
    .filter((image) => image.kind === "GALLERY")
    .map((image) => image.url);

  return {
    id: row.slug,
    date: formatDateOnly(row.startsAt, timeZone),
    city: `${row.city}, ${row.countryCode}`,
    venue: row.venueName,
    note: row.note ?? undefined,
    ticketUrl: sanitizeLink(row.ticketUrl),
    title: row.title ?? undefined,
    posterUrl: posterImage ?? undefined,
    lineup: row.lineupEntries.map((entry) => entry.name),
    doorsTime: formatTime(row.doorsAt, timeZone),
    showTime: formatTime(row.showAt, timeZone),
    price: row.priceLabel ?? undefined,
    facebookEventUrl: sanitizeLink(row.facebookEventUrl),
    gallery: galleryImages,
    description: row.description ?? undefined,
  };
}

async function fetchPublishedConcertRows() {
  return prisma.concert.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: [
      { startsAt: "asc" },
      { publishedAt: "desc" },
      { createdAt: "desc" },
    ],
    include: {
      lineupEntries: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      },
      images: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      },
    },
  });
}

export async function getPublishedConcerts(): Promise<Concert[]> {
  const rows = await fetchPublishedConcertRows();
  return rows.map(mapConcert);
}

export async function getConcertById(id: string): Promise<Concert | null> {
  const row = await prisma.concert.findFirst({
    where: {
      slug: id,
      status: "PUBLISHED",
    },
    include: {
      lineupEntries: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      },
      images: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      },
    },
  });

  return row ? mapConcert(row) : null;
}

export function isPastConcert(concert: Concert, today = getTodayDateString()) {
  return concert.date < today;
}

export function splitConcerts(all: Concert[], today = getTodayDateString()) {
  const upcoming = all
    .filter((concert) => concert.date >= today)
    .sort(compareByDateAsc);

  const past = all
    .filter((concert) => concert.date < today)
    .sort(compareByDateDesc);

  return {
    upcoming,
    past,
    nextShow: upcoming[0] ?? null,
  };
}

export async function getConcertBuckets() {
  const concerts = await getPublishedConcerts();
  return splitConcerts(concerts);
}

export async function getNextConcert() {
  const { nextShow } = await getConcertBuckets();
  return nextShow;
}
