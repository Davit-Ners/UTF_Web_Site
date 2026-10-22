import type { Metadata } from "next";
import Link from "next/link";
import { festivals, sharedBills } from "@/app/lib/about";
import { getConcertBuckets } from "@/app/lib/concerts";
import { CONTACT_EMAIL, TECH_RIDER } from "@/app/lib/contact";
import { BAND_PROFILES } from "@/app/lib/links";
import { latestRelease } from "@/app/lib/music";
import { getSiteUrl } from "@/lib/site";
import BookingClient from "./bookingClient";
import styles from "./booking.module.css";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Booking",
  description:
    "Book Until They Fall, melodic death metal from Brussels, for clubs, support slots and independent festivals. Contact, technical rider and booking request.",
  alternates: {
    canonical: "/booking",
  },
  openGraph: {
    title: "Book Until They Fall",
    description: "Melodic death metal from Brussels. Contact, technical rider and booking request.",
    url: "/booking",
    images: [
      {
        url: "/gallery/band-test.jpg",
        width: 2048,
        height: 1363,
        alt: "Until They Fall, the five members posed in an empty room, black and white",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book Until They Fall",
    description: "Melodic death metal from Brussels. Contact, technical rider and booking request.",
    images: ["/gallery/band-test.jpg"],
  },
};

/* Rider-derived facts only (technical rider v. 18.02.2026) */
const TECH_SHEET = [
  { label: "Line-up", value: "5 members" },
  { label: "Backline", value: "Own backline available, or venue backline" },
  { label: "Guitars", value: "Line 6 Helix / Helix Stomp" },
  { label: "Bass", value: "Ampeg PF-500 via DI" },
  { label: "Sample pad", value: "Via DI" },
  { label: "Monitoring", value: "All members on IEM — own digital mixer and splitter" },
  { label: "Inputs", value: "19 channels" },
  { label: "Venue provides", value: "PA and required drum microphones" },
  { label: "Vocal mics", value: "3 × SM58 or similar" },
  { label: "Backdrop", value: "1.80 × 2.00 m" },
  { label: "Optional", value: "Smoke machine and 2 EgoRisers" },
];

/* Real show count from the concert archive; omitted when unavailable */
async function showHistory() {
  try {
    const { past } = await getConcertBuckets();
    if (!past.length) return null;
    return { count: past.length, since: past[past.length - 1].date.slice(0, 4) };
  } catch (error) {
    console.error("Booking show history unavailable:", error);
    return null;
  }
}

function structuredData() {
  const site = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: "Until They Fall",
    url: site,
    genre: "Melodic death metal",
    foundingDate: "2018",
    foundingLocation: { "@type": "Place", name: "Brussels, Belgium" },
    email: CONTACT_EMAIL,
    sameAs: Object.values(BAND_PROFILES).map((profile) => profile.href),
  };
}

export default async function BookingPage() {
  const history = await showHistory();
  const airplay = latestRelease.airplay ?? [];
  const jsonLd = JSON.stringify(structuredData()).replace(/</g, "\\u003c");

  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      {/* I — Contact */}
      <header className={styles.contact}>
        <h1 className={styles.word}>Booking</h1>
        <p className={`meta ${styles.identity}`}>Melodic death metal — Brussels, BE — 5 members</p>

        <a href={`mailto:${CONTACT_EMAIL}`} className={styles.email}>
          {CONTACT_EMAIL}
        </a>

        <div className={styles.actions}>
          <a href="#booking-request" className={styles.action}>
            <span>Booking request</span>
            <span aria-hidden="true">↓</span>
          </a>
          <a href={TECH_RIDER.href} target="_blank" rel="noopener noreferrer" className={styles.action}>
            <span>
              Tech rider PDF <span className="srOnly">(opens in a new tab)</span>
            </span>
            <span className={styles.riderMeta}>
              v. {TECH_RIDER.version} — {TECH_RIDER.pages} pages — {TECH_RIDER.sizeLabel}
            </span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      {/* II — Technical sheet */}
      <section className={styles.sheet} aria-labelledby="sheet-title">
        <div className={styles.sheetMain}>
          <header className={styles.sheetHead}>
            <h2 id="sheet-title" className={styles.sheetTitle}>
              Technical summary
            </h2>
            <p className="meta">Technical rider — v. {TECH_RIDER.version}</p>
          </header>

          <dl className={styles.facts}>
            {TECH_SHEET.map((fact) => (
              <div key={fact.label} className={styles.fact}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>

          <a href={TECH_RIDER.href} target="_blank" rel="noopener noreferrer" className={`action-link on-bone ${styles.riderLink}`}>
            Full rider: input list and stage plot <span className="srOnly">(PDF, opens in a new tab)</span>
            <span className="arrow" aria-hidden="true">↗</span>
          </a>
        </div>

        <aside className={styles.history} aria-labelledby="history-title">
          <h2 id="history-title" className={`meta ${styles.historyTitle}`}>
            Stage history
          </h2>
          {history ? (
            <p className={styles.showCount}>
              {String(history.count).padStart(2, "0")} shows since {history.since}
            </p>
          ) : null}
          <dl className={styles.historyList}>
            <div>
              <dt>Festivals</dt>
              <dd>{festivals.join(" — ")}</dd>
            </div>
            <div>
              <dt>Shared bills</dt>
              <dd>{sharedBills.join(" — ")}</dd>
            </div>
            {airplay.length ? (
              <div>
                <dt>Airplay</dt>
                <dd>{airplay.map((item) => `${item.track} — ${item.station}`).join(" / ")}</dd>
              </div>
            ) : null}
          </dl>
          <Link href="/concerts#archive" className="action-link on-bone">
            Live archive <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </aside>
      </section>

      {/* III — Booking request (existing form and submission logic) */}
      <BookingClient />
    </main>
  );
}
