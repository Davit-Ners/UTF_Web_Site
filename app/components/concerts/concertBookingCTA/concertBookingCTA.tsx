import styles from "./concertsBookingCTA.module.css";
import Link from "next/link";

export default function ConcertsBookingCTA() {
    return (
        <section className={styles.section}>
        <div className="container">
            <div className={styles.card + " card"}>
            <div className={styles.text}>
                <h2>Want to book Until They Fall?</h2>
                <p>
                Festivals, clubs or special events — we’re ready to bring the full
                live show. Check the booking page for details and technical info.
                </p>
            </div>
            <div className={styles.actions}>
                <Link href="/booking" className="button">
                Go to booking
                </Link>
            </div>
            </div>
        </div>
        </section>
    );
};
