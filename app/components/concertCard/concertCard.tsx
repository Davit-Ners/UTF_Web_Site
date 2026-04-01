import Link from "next/link";
import styles from "./concertCard.module.css";
import { type Concert } from "@/app/lib/concerts";

export default function ConcertCard({ concert }: { concert: Concert }) {
  const d = new Date(`${concert.date}T12:00:00.000Z`);
  const day = d.getUTCDate().toString().padStart(2, "0");
  const month = d.toLocaleString("en", { month: "short", timeZone: "UTC" }).toUpperCase();
  const dow = d.toLocaleString("en", { weekday: "short", timeZone: "UTC" }).toUpperCase();
  const hasTickets = Boolean(concert.ticketUrl);

  return (
    <article className={`card ${styles.card}`} aria-label={`${concert.city} - ${concert.venue}`}>
      <div className={styles.calendar}>
        <span className={styles.dow}>{dow}</span>
        <span className={styles.day}>{day}</span>
        <span className={styles.month}>{month}</span>
      </div>

      <div className={styles.info}>
        <h3 className={styles.city}>{concert.city}</h3>
        <p className={styles.venue}>
          {concert.venue}
          {concert.note ? <span className={styles.note}> - {concert.note}</span> : null}
        </p>
      </div>

      {hasTickets ? (
        <Link
          href={concert.ticketUrl!}
          className={`button ${styles.tix}`}
          aria-label={`Tickets for ${concert.city} at ${concert.venue}`}
        >
          Tickets
        </Link>
      ) : (
        <span className={styles.sold}>Sold out</span>
      )}
    </article>
  );
}
