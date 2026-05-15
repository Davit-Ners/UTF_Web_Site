import type { Metadata } from "next";
import ConcertsBookingCTA from "../components/concerts/concertBookingCTA/concertBookingCTA";
import ConcertCalendar from "../components/concerts/concertCalendar/concertCalendar";
import ConcertsHero from "../components/concerts/concertHero/concertHero";
import ConcertList from "../components/concerts/concertList/concertList";
import PastConcerts from "../components/concerts/pastConcerts/pastConcerts";
import styles from "./concerts.module.css";
import { getConcertBuckets } from "@/app/lib/concerts";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Concerts",
  description:
    "Upcoming shows, live dates and past concerts from Until They Fall, a Brussels melodic death metal band.",
  alternates: {
    canonical: "/concerts",
  },
  openGraph: {
    title: "Concerts | Until They Fall",
    description:
      "Confirmed shows, festival dates and live archive from Brussels melodic death metal band Until They Fall.",
    url: "/concerts",
    images: [
      {
        url: "/gallery/band1.jpg",
        width: 2048,
        height: 1365,
        alt: "Until They Fall live on stage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Concerts | Until They Fall",
    description:
      "Upcoming shows, live dates and past concerts from Until They Fall.",
    images: ["/gallery/band1.jpg"],
  },
};

export default async function ConcertsPage() {
  const { upcoming, past, nextShow } = await getConcertBuckets();

  return (
    <main className={styles.page}>
      <ConcertsHero nextShow={nextShow} />

      <section className={styles.section}>
        <div className="container">
          <header className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Live</span>
            <h2 className={styles.sectionTitle}>Upcoming shows</h2>
            <p className={styles.sectionSubtitle}>
              Confirmed shows and festival dates. More announcements drop as
              they lock in.
            </p>
          </header>

          <div className={styles.layout}>
            <ConcertCalendar shows={upcoming} />
            <ConcertList shows={upcoming} />
          </div>
        </div>
      </section>

      <PastConcerts shows={past} />

      <ConcertsBookingCTA />
    </main>
  );
}
