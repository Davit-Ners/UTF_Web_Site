import styles from "./concertsBookingCTA.module.css";
import Link from "next/link";

export default function ConcertsBookingCTA() {
    return (
        <section className={styles.section}>
        <div className="container">
            <div className={styles.card + " card"}>
            <div className={styles.text}>
                <h2>Book Until They Fall</h2>
                <p>
                Brussels melodic death metal with a tight live set, Belgian
                stage experience and tech rider ready.
                </p>
            </div>
            <div className={styles.actions}>
                <Link href="/booking" className="button">
                Booking Info
                </Link>
            </div>
            </div>
        </div>
        </section>
    );
}
