import ConcertsBookingCTA from "../components/concerts/concertBookingCTA/concertBookingCTA";
import ConcertCalendar from "../components/concerts/concertCalendar/concertCalendar";
import ConcertsHero from "../components/concerts/concertHero/concertHero";
import ConcertList from "../components/concerts/concertList/concertList";
import PastConcerts from "../components/concerts/pastConcerts/pastConcerts";
import styles from "./concerts.module.css";
import { getConcertBuckets } from "@/app/lib/concerts";

export const revalidate = 60;

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
              All confirmed dates. More shows get announced regularly, so check
              back before the next pit opens.
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
