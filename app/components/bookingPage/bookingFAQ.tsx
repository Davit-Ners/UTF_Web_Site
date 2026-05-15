"use client";
import styles from "../../booking/booking.module.css";

export default function BookingFAQ() {
    return (
        <section className={styles.faqSection}>
            <div className="container">
            <div className={styles.faqGrid}>
                <details className={`${styles.faq} card`}>
                <summary>What kind of shows do you book?</summary>
                <p>Club shows, support slots, independent festivals and metal events. We can adapt the set to the slot.</p>
                </details>
                <details className={`${styles.faq} card`}>
                <summary>What do you need on stage?</summary>
                <p>Download the tech rider above for the full details. We keep the setup clear and changeovers tight.</p>
                </details>
                <details className={`${styles.faq} card`}>
                <summary>Can you adapt the set length?</summary>
                <p>Yes. Standard sets run from 30 to 60 minutes depending on the slot, schedule and event format.</p>
                </details>
                <details className={`${styles.faq} card`}>
                <summary>Where are you based?</summary>
                <p>The band is based in Brussels, Belgium, and is available for shows across Belgium and Europe.</p>
                </details>
            </div>
            </div>
        </section>
    );
}
