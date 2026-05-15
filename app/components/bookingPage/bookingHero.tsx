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
}

function ActionLink({ href, label }: { href: string; label: string }) {
    return (
        <a className={`button ${styles.actionBtn}`} href={href} target="_blank" rel="noreferrer">
        {label}
        </a>
    );
}

export default function BookingHero() {
    return (
        <section className={styles.hero}>
            <div className="container">
            <header className={styles.header}>
                <span className={styles.eyebrow}>Booking</span>
                <h1 className={styles.title}>Book <span>Until They Fall</span></h1>
                <p className={styles.subtitle}>
                Brussels melodic death metal with a tight live set, Belgian
                stage experience and tech rider ready.
                </p>
            </header>

            <div className={styles.infoGrid}>
                <Stat label="Base" value="Brussels, BE" />
                <Stat label="Set length" value="30-60 min" />
                <Stat label="Shows" value="Clubs, support slots, festivals" />
                <Stat label="Airplay" value="Classic 21 / Radio Panik" />
            </div>

            <div className={styles.actions}>
                <ActionLink href="/docs/UTF_technical_rider_2026.pdf" label="Download Tech Rider" />
            </div>
            </div>
        </section>
    );
}
