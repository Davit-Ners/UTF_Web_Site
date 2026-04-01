import "dotenv/config";

import prisma from "../lib/prisma";
import { concertSeedData } from "../app/lib/concerts.data";

const DEFAULT_TIMEZONE = "Europe/Brussels";

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
    year: Number(parts.find((part) => part.type === "year")?.value ?? "0"),
    month: Number(parts.find((part) => part.type === "month")?.value ?? "1"),
    day: Number(parts.find((part) => part.type === "day")?.value ?? "1"),
    hour: Number(parts.find((part) => part.type === "hour")?.value ?? "0"),
    minute: Number(parts.find((part) => part.type === "minute")?.value ?? "0"),
  };
}

function zonedDateTimeToUtc(date: string, time: string, timeZone = DEFAULT_TIMEZONE) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);

  const guess = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const parts = getDateParts(guess, timeZone);
  const desired = Date.UTC(year, month - 1, day, hour, minute);
  const actual = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute);

  return new Date(guess.getTime() + (desired - actual));
}

async function main() {
  for (const concert of concertSeedData) {
    const startsAt = zonedDateTimeToUtc(concert.date, "12:00");
    const doorsAt = concert.doorsTime
      ? zonedDateTimeToUtc(concert.date, concert.doorsTime)
      : null;
    const showAt = concert.showTime
      ? zonedDateTimeToUtc(concert.date, concert.showTime)
      : null;

    const savedConcert = await prisma.concert.upsert({
      where: {
        slug: concert.slug,
      },
      update: {
        status: "PUBLISHED",
        title: concert.title ?? null,
        note: concert.note ?? null,
        startsAt,
        doorsAt,
        showAt,
        timezone: DEFAULT_TIMEZONE,
        venueName: concert.venueName,
        city: concert.city,
        countryCode: "BE",
        ticketUrl: concert.ticketUrl ?? null,
        facebookEventUrl: concert.facebookEventUrl ?? null,
        posterUrl: concert.posterUrl ?? null,
        priceLabel: concert.priceLabel ?? null,
        featured: concert.featured ?? false,
        publishedAt: new Date(),
      },
      create: {
        slug: concert.slug,
        status: "PUBLISHED",
        title: concert.title ?? null,
        note: concert.note ?? null,
        startsAt,
        doorsAt,
        showAt,
        timezone: DEFAULT_TIMEZONE,
        venueName: concert.venueName,
        city: concert.city,
        countryCode: "BE",
        ticketUrl: concert.ticketUrl ?? null,
        facebookEventUrl: concert.facebookEventUrl ?? null,
        posterUrl: concert.posterUrl ?? null,
        priceLabel: concert.priceLabel ?? null,
        featured: concert.featured ?? false,
        publishedAt: new Date(),
      },
      select: {
        id: true,
        slug: true,
      },
    });

    await prisma.concertLineupEntry.deleteMany({
      where: {
        concertId: savedConcert.id,
      },
    });

    await prisma.concertImage.deleteMany({
      where: {
        concertId: savedConcert.id,
      },
    });

    if (concert.lineup?.length) {
      await prisma.concertLineupEntry.createMany({
        data: concert.lineup.map((name, index) => ({
          concertId: savedConcert.id,
          name,
          role: index === 0 ? "HEADLINER" : "SUPPORT",
          sortOrder: index,
        })),
      });
    }

    const images = [];

    if (concert.posterUrl) {
      images.push({
        concertId: savedConcert.id,
        kind: "POSTER" as const,
        url: concert.posterUrl,
        alt: concert.title
          ? `${concert.title} poster`
          : `${concert.city} at ${concert.venueName} poster`,
        isPrimary: true,
        sortOrder: 0,
      });
    }

    if (concert.gallery?.length) {
      images.push(
        ...concert.gallery.map((url, index) => ({
          concertId: savedConcert.id,
          kind: "GALLERY" as const,
          url,
          alt: concert.title
            ? `${concert.title} gallery image ${index + 1}`
            : `${concert.city} at ${concert.venueName} gallery image ${index + 1}`,
          isPrimary: false,
          sortOrder: index + 1,
        }))
      );
    }

    if (images.length) {
      await prisma.concertImage.createMany({
        data: images,
      });
    }
  }

  const total = await prisma.concert.count({
    where: {
      status: "PUBLISHED",
    },
  });

  console.log(`Seeded ${concertSeedData.length} concerts. ${total} published concerts now in DB.`);
}

main()
  .catch((error) => {
    console.error("Concert seed failed.");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
