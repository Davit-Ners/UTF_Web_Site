import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { Metadata } from "next";
import type { Concert } from "../app/lib/concerts";
import { getSiteUrl, PRODUCTION_SITE_URL } from "./site";
import "./test-component-loader";

const APEX = "https://untiltheyfall.com";

/* Run a block with a temporary environment (NODE_ENV is read-only in the types) */
async function withEnv<T>(values: Record<string, string | undefined>, run: () => Promise<T> | T) {
  const previous = Object.fromEntries(Object.keys(values).map((key) => [key, process.env[key]]));
  const apply = (next: Record<string, string | undefined>) => {
    for (const [key, value] of Object.entries(next)) {
      if (value === undefined) delete process.env[key];
      else Object.assign(process.env, { [key]: value });
    }
  };
  apply(values);
  try { return await run(); } finally { apply(previous); }
}

async function withDatabaseMocks(t: import("node:test").TestContext) {
  const previousUrl = process.env.DATABASE_URL;
  process.env.DATABASE_URL = "postgresql://test:test@127.0.0.1:1/test";
  const { default: prisma } = await import("./prisma");
  const originals = { findMany: prisma.concert.findMany, findFirst: prisma.concert.findFirst };
  t.after(() => {
    Object.assign(prisma.concert, originals);
    if (previousUrl === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = previousUrl;
  });
  return prisma;
}

test("canonical origin is the apex in production and never a deployment URL", () => {
  assert.equal(PRODUCTION_SITE_URL, APEX);
  assert.equal(getSiteUrl({ NODE_ENV: "production", NEXT_PUBLIC_SITE_URL: "https://utf-git-x.vercel.app", VERCEL_URL: "utf-abc.vercel.app" }), APEX);
  assert.equal(getSiteUrl({ NODE_ENV: "production" }), APEX);
  assert.equal(getSiteUrl({ NODE_ENV: "development", VERCEL_URL: "utf-abc.vercel.app" }), "http://localhost:3000");
  assert.equal(getSiteUrl({ NODE_ENV: "development", NEXT_PUBLIC_SITE_URL: "staging.example.org/" }), "https://staging.example.org");
});

test("www host permanently redirects to the apex without matching the apex itself", async () => {
  const { default: config } = await import("../next.config");
  const redirects = await config.redirects!();
  const www = redirects.filter((rule) => rule.has?.some((condition) => condition.type === "host"));
  assert.equal(www.length, 1);
  assert.deepEqual(www[0], {
    source: "/:path*",
    has: [{ type: "host", value: "www.untiltheyfall.com" }],
    destination: `${APEX}/:path*`,
    permanent: true,
  });
  assert.ok(!redirects.some((rule) => rule.has?.some((condition) => "value" in condition && condition.value === "untiltheyfall.com")));
});

test("production robots allow pages, exclude the API and point to the apex sitemap", async () => {
  const { default: robots } = await import("../app/robots");
  const result = await withEnv({ NODE_ENV: "production" }, () => robots());
  assert.deepEqual(result, { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: `${APEX}/sitemap.xml` });
});

test("production sitemap uses the apex and lists privacy and legal pages even during a DB outage", async (t) => {
  const prisma = await withDatabaseMocks(t);
  prisma.concert.findMany = (async () => { throw new Error("outage"); }) as unknown as typeof prisma.concert.findMany;
  const log = t.mock.method(console, "error", () => {});
  const { default: sitemap } = await import("../app/sitemap");
  const entries = await withEnv({ NODE_ENV: "production" }, () => sitemap());
  log.mock.restore();
  const urls = entries.map((entry) => entry.url);
  assert.deepEqual(urls, [APEX, ...["/about", "/booking", "/concerts", "/gallery", "/merch", "/music", "/privacy", "/legal", "/music/sent-to-die"].map((path) => `${APEX}${path}`)]);
  assert.ok(entries.every((entry) => entry.lastModified === undefined));
});

test("root layout no longer hands canonical or og:url to every route; the homepage owns them", async () => {
  const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(layout, /canonical:/);
  assert.doesNotMatch(layout, /url: "\/"/);
  const { metadata } = await import("../app/page");
  assert.equal(metadata.alternates?.canonical, "/");
  assert.equal((metadata.openGraph as { url?: string }).url, "/");
});

test("privacy, legal and merch metadata are route-specific and merch describes a request", async () => {
  for (const [path, title] of [["/privacy", "Privacy | Until They Fall"], ["/legal", "Legal notice | Until They Fall"]] as const) {
    const { metadata } = (await import(`../app${path}/page`)) as { metadata: Metadata };
    const og = metadata.openGraph as { url?: string; title?: string; images?: { url: string; width?: number; height?: number }[] };
    assert.equal(metadata.alternates?.canonical, path);
    assert.equal(og.url, path);
    assert.equal(og.title, title);
    assert.deepEqual(og.images?.[0], { url: "/gallery/band-test.jpg", width: 2048, height: 1363, alt: "Until They Fall, the five members posed in an empty room, black and white" });
    assert.equal((metadata.twitter as { title?: string }).title, title);
    assert.equal(metadata.robots, undefined);
  }
  const { metadata: merch } = await import("../app/merch/page");
  const texts = [merch.description, merch.openGraph?.description, merch.twitter?.description].join(" ");
  assert.match(String(merch.description), /Send a request directly to the band; availability, shipping and payment are confirmed by email\./);
  assert.doesNotMatch(texts, /\b(ordered|order|shop|buy|checkout|purchase)\b/i);
});

test("homepage MusicGroup uses shared members, profiles and the album relation", async () => {
  const { musicGroupJsonLd } = await import("../app/lib/structuredData");
  const { members } = await import("../app/lib/about");
  const { BAND_PROFILES } = await import("../app/lib/links");
  const data = musicGroupJsonLd(APEX);
  assert.equal(data["@id"], `${APEX}/#band`);
  assert.equal(data.url, APEX);
  assert.equal(data.foundingDate, "2018");
  assert.equal(data.genre, "Melodic death metal");
  assert.deepEqual(data.member.map((m) => [m.member.name, m.roleName, m.startDate]), members.map((m) => [m.name, m.role, String(m.since)]));
  assert.deepEqual(data.sameAs, Object.values(BAND_PROFILES).map((p) => p.href));
  assert.deepEqual(data.album, [{ "@type": "MusicAlbum", "@id": `${APEX}/music/sent-to-die#album`, name: "Sent To Die", url: `${APEX}/music/sent-to-die` }]);
  assert.equal(data.image, `${APEX}/gallery/band-test.jpg`);
});

test("Sent To Die MusicAlbum lists the eight confirmed tracks in order with exact durations", async () => {
  const { musicAlbumJsonLd } = await import("../app/lib/structuredData");
  const { latestRelease } = await import("../app/lib/music");
  const data = musicAlbumJsonLd(latestRelease, APEX);
  assert.equal(data["@id"], `${APEX}/music/sent-to-die#album`);
  assert.equal(data.byArtist["@id"], `${APEX}/#band`);
  assert.equal(data.datePublished, "2023-12-01");
  assert.equal(data.image, `${APEX}/album-cover.jpg`);
  assert.equal(data.numTracks, 8);
  assert.deepEqual(data.track?.itemListElement.map((entry) => [entry.position, entry.item.name, entry.item.duration]), [
    [1, "27-09-2020", "PT1M8S"], [2, "Sent To Die", "PT5M8S"], [3, "Doppelgänger", "PT3M40S"], [4, "Uprising", "PT5M19S"],
    [5, "Wrath Of Gaïa", "PT6M1S"], [6, "Free", "PT7M41S"], [7, "Armenia", "PT6M14S"], [8, "One Final Ode", "PT6M14S"],
  ]);
  assert.deepEqual(data.sameAs, [latestRelease.spotifyUrl, latestRelease.appleMusicUrl, latestRelease.youtubeMusicUrl]);
  const json = JSON.stringify(data);
  assert.doesNotMatch(json, /recordLabel|catalogNumber|offers|producer|Project Zero|Heylen/);
});

test("MusicEvent: Brussels offsets, performer, scheduled offline event, offers only for future tickets", async () => {
  const { musicEventJsonLd } = await import("../app/lib/structuredData");
  const show: Concert = {
    id: "utf-test", date: "2027-01-15", city: "Brussels, BE", venue: "Magasin 4", gallery: [],
    doorsTime: "19:00", showTime: "20:30", ticketUrl: "https://tickets.example.org/utf", price: "15 EUR",
    lineup: ["Until They Fall", "Other Band"], posterUrl: "/concerts/test/poster.jpg",
  };
  const future = musicEventJsonLd(show, false, APEX);
  assert.equal(future.startDate, "2027-01-15T20:30:00+01:00");
  assert.equal(future.doorTime, "2027-01-15T19:00:00+01:00");
  assert.equal(future.eventStatus, "https://schema.org/EventScheduled");
  assert.equal(future.eventAttendanceMode, "https://schema.org/OfflineEventAttendanceMode");
  assert.deepEqual(future.performer, [
    { "@type": "MusicGroup", "@id": `${APEX}/#band`, name: "Until They Fall", url: APEX },
    { "@type": "MusicGroup", name: "Other Band" },
  ]);
  assert.deepEqual(future.offers, { "@type": "Offer", url: "https://tickets.example.org/utf", price: "15", priceCurrency: "EUR" });
  assert.equal(future.image, `${APEX}/concerts/test/poster.jpg`);
  assert.doesNotMatch(JSON.stringify(future), /availability|organizer|EventCancelled|SoldOut/);

  const summer = musicEventJsonLd({ ...show, date: "2027-07-10", doorsTime: undefined }, false, APEX);
  assert.equal(summer.startDate, "2027-07-10T20:30:00+02:00");
  assert.equal(summer.doorTime, undefined);

  const past = musicEventJsonLd({ ...show, date: "2024-03-02", doorsTime: undefined, showTime: undefined }, true, APEX);
  assert.equal(past.startDate, "2024-03-02");
  assert.equal(past.offers, undefined);
  /* Identical doors/show times are unreliable and omitted, not corrected */
  assert.equal(musicEventJsonLd({ ...show, doorsTime: "20:00", showTime: "20:00" }, false, APEX).startDate, "2027-01-15");
  /* Relative ticket links become absolute */
  assert.equal(musicEventJsonLd({ ...show, ticketUrl: "/booking" }, false, APEX).offers?.url, `${APEX}/booking`);
});

test("concert detail outage metadata is truthful and route-specific", async (t) => {
  const prisma = await withDatabaseMocks(t);
  prisma.concert.findMany = (async () => { throw new Error("outage"); }) as unknown as typeof prisma.concert.findMany;
  const log = t.mock.method(console, "error", () => {});
  const { generateMetadata } = await import("../app/concerts/[slug]/page");
  const metadata = await generateMetadata({ params: Promise.resolve({ slug: "utf-arlon" }) });
  log.mock.restore();
  assert.equal(metadata.title, "Concert");
  assert.equal(metadata.description, "Concert details from the Until They Fall live archive.");
  assert.equal(metadata.alternates?.canonical, "/concerts/utf-arlon");
  assert.equal((metadata.openGraph as { url?: string }).url, "/concerts/utf-arlon");
});

test("concert social images use the real poster or the existing band fallback", async (t) => {
  const prisma = await withDatabaseMocks(t);
  const row = {
    slug: "test-show", startsAt: new Date("2025-03-01T19:00:00Z"), city: "Arlon", countryCode: "BE", venueName: "Entrepôt",
    timezone: "Europe/Brussels", posterUrl: null as string | null, doorsAt: null, showAt: null, lineupEntries: [], images: [],
  };
  prisma.concert.findMany = (async () => [row]) as unknown as typeof prisma.concert.findMany;
  const { generateMetadata } = await import("../app/concerts/[slug]/page");
  const params = { params: Promise.resolve({ slug: row.slug }) };
  const fallback = await generateMetadata(params);
  assert.deepEqual((fallback.openGraph as { images: object[] }).images, [{
    url: "/gallery/band-test.jpg", width: 2048, height: 1363,
    alt: "Until They Fall, the five members posed in an empty room, black and white",
  }]);
  assert.deepEqual((fallback.twitter as { images: string[] }).images, ["/gallery/band-test.jpg"]);
  row.posterUrl = "/concerts/utf-arlon/poster.jpg";
  const poster = await generateMetadata(params);
  assert.deepEqual((poster.openGraph as { images: object[] }).images, [{
    url: "/optimized/concerts/utf-arlon/poster.webp", width: 1400, height: 733, alt: "Entrepôt poster",
  }]);
  assert.deepEqual((poster.twitter as { images: string[] }).images, ["/optimized/concerts/utf-arlon/poster.webp"]);
});

test("concert gallery metadata: eligible, ineligible and outage", async (t) => {
  const prisma = await withDatabaseMocks(t);
  const { galleryPhotos } = await import("../app/lib/gallery");
  const row = {
    slug: "test-show", startsAt: new Date("2025-03-01T19:00:00Z"), city: "Arlon", countryCode: "BE", venueName: "Entrepôt",
    timezone: "Europe/Brussels", posterUrl: null, doorsAt: null, showAt: null, lineupEntries: [], images: [],
  };
  prisma.concert.findFirst = (async () => row) as unknown as typeof prisma.concert.findFirst;
  const { generateMetadata } = await import("../app/concerts/[slug]/gallery/page");
  const params = { params: Promise.resolve({ slug: "test-show" }) };

  assert.deepEqual(await generateMetadata(params), {});

  galleryPhotos.push({ ...galleryPhotos[1], id: "test-confirmed", event: "test-show" });
  try {
    const metadata = await generateMetadata(params);
    assert.equal(metadata.title, "Photos — Arlon — Entrepôt, 01.03.2025");
    assert.equal(metadata.description, "Live photos of Until They Fall at Entrepôt, Arlon, BE, 01.03.2025.");
    assert.equal(metadata.alternates?.canonical, "/concerts/test-show/gallery");
    const og = metadata.openGraph as { url?: string; images?: { url: string; width?: number; height?: number }[] };
    assert.equal(og.url, "/concerts/test-show/gallery");
    assert.deepEqual([og.images?.[0].url, og.images?.[0].width, og.images?.[0].height], ["/gallery/band1.jpg", 2048, 1329]);
  } finally { galleryPhotos.pop(); }

  prisma.concert.findFirst = (async () => { throw new Error("outage"); }) as unknown as typeof prisma.concert.findFirst;
  const log = t.mock.method(console, "error", () => {});
  const outage = await generateMetadata({ params: Promise.resolve({ slug: "other-show" }) });
  log.mock.restore();
  assert.equal(outage.title, "Concert photos");
  assert.equal(outage.alternates?.canonical, "/concerts/other-show/gallery");
});

test("branded 404 offers three ways back and is not indexable", async () => {
  const { default: NotFound, metadata } = await import("../app/not-found");
  const markup = renderToStaticMarkup(createElement(NotFound));
  assert.match(markup, /<h1[^>]*>404<span class="srOnly"> — page not found<\/span><\/h1>/);
  assert.deepEqual([...markup.matchAll(/href="([^"]+)"/g)].map((m) => m[1]), ["/", "/music", "/concerts"]);
  assert.deepEqual(metadata.robots, { index: false });
});

test("homepage links use neutral merch wording and the canonical concert archive", async () => {
  const { default: FeaturedMerch } = await import("../app/components/homePage/featuredMerch/featuredMerch");
  const merch = renderToStaticMarkup(createElement(FeaturedMerch, {
    items: [{ id: "p1", name: "Core Logo Tee", price: 25, category: "apparel" }],
  }));
  assert.match(merch, /href="\/merch"[^>]*>View merch <span class="arrow"/);
  assert.doesNotMatch(merch, />Shop </);
  const { default: Live } = await import("../app/components/homePage/live/live");
  const live = renderToStaticMarkup(createElement(Live, { shows: [] }));
  assert.match(live, /href="\/concerts#archive"/);
  assert.doesNotMatch(live, /\/concerts\/past/);
});
