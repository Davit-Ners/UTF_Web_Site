"use client";
import styles from "../../booking/booking.module.css";

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div className={`${styles.infoCard} card`}>
        <dl>
            <dt>{label}</dt>
            <dd>{value}</dd>
        </dl>
        </div>
    );
};

function ActionLink({ href, label }: { href: string; label: string }) {
    return (
        <a className={`button ${styles.actionBtn}`} href={href} target="_blank" rel="noreferrer">
        {label}
        </a>
    );
};

export default function BookingHero() {
    return (
        <section className={styles.hero}>
            <div className="container">
            <header className={styles.header}>
                <span className={styles.eyebrow}>Booking</span>
                <h1 className={styles.title}>Bring <span>Until They Fall</span> to your stage</h1>
                <p className={styles.subtitle}>
                Modern metal // Brussels. High‑energy live set with tight production.
                For festivals, clubs and showcases.
                </p>
            </header>

            <div className={styles.infoGrid}>
                <Stat label="Base" value="Brussels, BE" />
                <Stat label="Set length" value="30–60 min (headline/guest)" />
                <Stat label="Availability" value="EU/UK – all year" />
                <Stat label="Response time" value="< 24h (weekdays)" />
            </div>

            <div className={styles.actions}>
                <ActionLink href="/docs/UTF_technical_rider_2025.pdf" label="Download Tech Rider" />
                <ActionLink href="/docs/UTF_Stage_Plot.png" label="Stage Plot" />
                <ActionLink href="/docs/UTF_PressKit.zip" label="Press Kit (EPK)" />
            </div>
            </div>
        </section>
    );
};
