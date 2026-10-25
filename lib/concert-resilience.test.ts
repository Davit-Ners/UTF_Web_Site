import assert from "node:assert/strict";
import { test } from "node:test";
import { join } from "node:path";
import { reliableTimes } from "../app/lib/concertFormat";
import { concertPosterDimensions } from "../app/lib/concertPosters";
import { galleryPhotos } from "../app/lib/gallery";
import type { Concert } from "../app/lib/concerts";

const show: Concert = { id: "test-show", city: "City, BE", venue: "Venue", date: "2027-01-01", gallery: [] };

test("concert summaries keep reliable times and omit identical times without correcting them", () => {
  assert.deepEqual(reliableTimes({ ...show, doorsTime: "18:00", showTime: "19:00" }), { doors: "18:00", show: "19:00", suspicious: false });
  assert.deepEqual(reliableTimes({ ...show, doorsTime: "18:00", showTime: "18:00" }), { doors: undefined, show: undefined, suspicious: true });
  assert.deepEqual(reliableTimes(show), { doors: undefined, show: undefined, suspicious: false });
  assert.equal(reliableTimes({ ...show, showTime: "19:00" }).show, "19:00");
});

test("poster dimensions match the actual files; unknown artwork has no invented size", async () => {
  const { default: sharp } = await import("sharp");
  for (const src of ["/optimized/concerts/utf-arlon/poster.webp", "/concerts/utf-arlon/poster.jpg", "/optimized/concerts/utf-braine/utf-braine-optimized.webp"]) {
    const { width, height } = await sharp(join(process.cwd(), "public", src)).metadata();
    assert.deepEqual(concertPosterDimensions(src), { width, height });
  }
  assert.equal(concertPosterDimensions("/unknown.jpg"), undefined);
});

test("concert data and sitemap tolerate outages without advertising ineligible galleries or redirects", async (t) => {
  const previousUrl = process.env.DATABASE_URL;
  process.env.DATABASE_URL = "postgresql://test:test@127.0.0.1:1/test";
  const { default: prisma } = await import("./prisma");
  const { getPublishedConcerts } = await import("../app/lib/concerts");
  const { default: sitemap } = await import("../app/sitemap");
  const { discography } = await import("../app/lib/music");
  const original = prisma.concert.findMany;
  t.after(() => {
    prisma.concert.findMany = original;
    if (previousUrl === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = previousUrl;
  });
  const row = {
    slug: "test-show", startsAt: new Date("2027-01-01T18:00:00Z"), city: "City", countryCode: "BE", venueName: "Venue",
    timezone: "Europe/Brussels", posterUrl: "/concerts/utf-arlon/poster.jpg", doorsAt: null, showAt: null,
    lineupEntries: [], images: [{ kind: "GALLERY", url: "/gallery/band1.jpg" }],
  };
  prisma.concert.findMany = t.mock.fn(async () => [row]) as unknown as typeof original;
  const [mapped] = await getPublishedConcerts();
  assert.equal(mapped.posterUrl, "/optimized/concerts/utf-arlon/poster.webp");
  assert.deepEqual(mapped.posterDimensions, { width: 1400, height: 733 });
  await t.test("available data includes dossiers but not generic unconfirmed galleries", async () => {
    const entries = await sitemap();
    assert.ok(entries.some((entry) => entry.url.endsWith("/concerts/test-show")));
    assert.ok(!entries.some((entry) => entry.url.endsWith("/concerts/test-show/gallery")));
    assert.ok(!entries.some((entry) => /\/concerts\/past$|\/gallery\/concert-photos$/.test(entry.url)));
    assert.ok(entries.every((entry) => entry.lastModified === undefined));
  });
  await t.test("explicit confirmed-photo association adds exactly the eligible gallery", async () => {
    galleryPhotos.push({ ...galleryPhotos[0], id: "test-confirmed", event: row.slug });
    try {
      const entries = await sitemap();
      assert.equal(entries.filter((entry) => entry.url.endsWith("/concerts/test-show/gallery")).length, 1);
    } finally { galleryPhotos.pop(); }
  });
  await t.test("DB outage preserves static/release entries and logs only server-side", async () => {
    prisma.concert.findMany = t.mock.fn(async () => { throw new Error("PRIVATE_DATABASE_DETAILS"); }) as unknown as typeof original;
    const log = t.mock.method(console, "error", () => {});
    const entries = await sitemap();
    assert.equal(log.mock.callCount(), 1);
    assert.equal(entries.length, 7 + discography.length);
    assert.ok(entries.some((entry) => entry.url.endsWith("/concerts")));
    assert.ok(entries.some((entry) => entry.url.endsWith("/music/sent-to-die")));
    assert.ok(!entries.some((entry) => entry.url.includes("test-show")));
    assert.ok(!JSON.stringify(entries).includes("PRIVATE_DATABASE_DETAILS"));
    log.mock.restore();
  });
});
