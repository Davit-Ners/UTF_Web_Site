import Link from "next/link";
import styles from "./bookingContact.module.css";

const CONTACT_EMAIL = "contact@untiltheyfall.com";
const RIDER_PATH = "/docs/UTF_technical_rider_2026.pdf";

export default function BookingContact() {
  return (
    <section className={styles.booking} aria-labelledby="booking-title">
      <p className={`meta ${styles.index}`}>08 — Booking</p>

      <h2 id="booking-title" className={styles.title}>
        Booking
      </h2>

      <a href={`mailto:${CONTACT_EMAIL}`} className={styles.email}>
        {CONTACT_EMAIL}
      </a>

      <div className={styles.actions}>
        <Link href="/booking" className={`action-link on-bone ${styles.action}`}>
          Book the band <span className="arrow" aria-hidden="true">→</span>
        </Link>
        <a
          href={RIDER_PATH}
          target="_blank"
          rel="noreferrer"
          className={`action-link on-bone ${styles.action}`}
        >
          Tech rider <span className={styles.format}>PDF</span>
          <span className="arrow" aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
