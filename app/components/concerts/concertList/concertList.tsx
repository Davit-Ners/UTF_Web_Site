import Link from "next/link";
import styles from "./concertList.module.css";
import { type Concert } from "@/app/lib/concerts";

type Props = {
  shows: Concert[];
};

export default function ConcertList({ shows }: Props) {
  if (!shows.length) {
    return (
      <section className={styles.wrap}>
        <div className={`${styles.emptyCard} card`}>
          <p className={styles.emptyTitle}>No upcoming shows announced.</p>
          <p className={styles.emptyText}>
            Join the list or check back for the next date.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.wrap}>
      <div className={styles.list}>
        {shows.map((show) => (
          <article key={show.id} className={`${styles.card} card`}>
            <div className={styles.date}>
              {formatDay(show.date)}
              <span className={styles.month}>{formatMonth(show.date)}</span>
            </div>

            <div className={styles.main}>
              <h3 className={styles.city}>{show.city}</h3>
              <p className={styles.venue}>
                {show.venue}
                {show.note ? ` - ${show.note}` : ""}
              </p>
            </div>

            <div className={styles.meta}>
              {show.ticketUrl ? (
                <Link href={show.ticketUrl} className="button">
                  Get Tickets
                </Link>
              ) : (
                <span className={styles.status}>Info soon</span>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function formatDay(date: string) {
  return new Date(`${date}T12:00:00.000Z`).getUTCDate().toString().padStart(2, "0");
}

function formatMonth(date: string) {
  return new Date(`${date}T12:00:00.000Z`)
    .toLocaleString("en", { month: "short", timeZone: "UTC" })
    .toUpperCase();
}
