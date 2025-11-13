"use client";
import styles from '../../booking/booking.module.css';

export default function BookingFAQ() {
    return (
        <section className={styles.faqSection}>
            <div className="container">
            <div className={styles.faqGrid}>
                <details className={`${styles.faq} card`}>
                <summary>What do you need on stage?</summary>
                <p>See the Tech Rider above. We run in‑ears and bring our own wireless + tracks rig. Minimal changeover.</p>
                </details>
                <details className={`${styles.faq} card`}>
                <summary>Travel & hospitality</summary>
                <p>Based in Brussels. For out‑of‑town shows: transport + simple accommodation if needed. Flexible.</p>
                </details>
                <details className={`${styles.faq} card`}>
                <summary>Can we get a custom set length?</summary>
                <p>Yes — from 25 to 60 minutes depending on slot. We adapt to your schedule.</p>
                </details>
                <details className={`${styles.faq} card`}>
                <summary>Do you provide invoice?</summary>
                <p>Yes. We can invoice via our company with VAT if required.</p>
                </details>
            </div>
            </div>
        </section>
    );
};
