import Link from "next/link";
import styles from "./concertHero.module.css";
import { type Concert } from "@/app/lib/concerts";

type Props = {
  nextShow: Concert | null;
};

export default function ConcertsHero({ nextShow }: Props) {
  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={`${styles.card} card`}>
          <div className={styles.left}>
            <span className={styles.eyebrow}>Concerts</span>
            <h1 className={styles.title}>Live dates</h1>
            <p className={styles.subtitle}>
              Melodic death metal from Brussels, built for clubs, support slots
              and independent festivals.
            </p>

            <div className={styles.actions}>
              <Link href="/booking" className="button">
                Book The Band
              </Link>
            </div>
          </div>

          <div className={styles.right}>
            {nextShow ? (
              <div className={styles.nextShow}>
                <span className={styles.nextLabel}>Next on stage</span>
                <p className={styles.nextMain}>
                  {formatDate(nextShow.date)} - {nextShow.city}
                </p>
                <p className={styles.nextVenue}>{nextShow.venue}</p>
                {nextShow.ticketUrl && (
                  <Link href={nextShow.ticketUrl} className={`${styles.ticketLink} button`}>
                    Get Tickets
                  </Link>
                )}
              </div>
            ) : (
              <div className={styles.nextShow}>
                <span className={styles.nextLabel}>Next on stage</span>
                <p className={styles.nextMain}>New dates coming soon</p>
                <p className={styles.nextVenue}>
                  Join the list or check back for the next announcement.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function formatDate(raw: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${raw}T12:00:00.000Z`));
}
