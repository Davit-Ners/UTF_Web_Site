"use client";

import ConcertsBookingCTA from "../components/concerts/concertBookingCTA/concertBookingCTA";
import ConcertCalendar from "../components/concerts/concertCalendar/concertCalendar";
import ConcertsHero from "../components/concerts/concertHero/concertHero";
import ConcertList from "../components/concerts/concertList/concertList";
import PastConcerts from "../components/concerts/pastConcerts/pastConcerts";
import styles from "./concerts.module.css";
import { concerts, Concert } from "@/app/lib/concerts";

function splitConcerts(all: Concert[]) {
    const today = new Date();
    const todayMidnight = new Date(today.toDateString());

    const upcoming = all
        .map((c) => ({ ...c, d: new Date(c.date) }))
        .filter((c) => c.d >= todayMidnight)
        .sort((a, b) => a.d.getTime() - b.d.getTime());

    const past = all
        .map((c) => ({ ...c, d: new Date(c.date) }))
        .filter((c) => c.d < todayMidnight)
        .sort((a, b) => b.d.getTime() - a.d.getTime());

    return {
        upcoming: upcoming as Concert[],
        past: past as Concert[],
        nextShow: upcoming[0] ?? null,
    };
};

export default function ConcertsPage() {
    const { upcoming, past, nextShow } = splitConcerts(concerts);

    return (
        <main className={styles.page}>
        <ConcertsHero nextShow={nextShow} />

        {/* Upcoming shows : calendrier + liste */}
        <section className={styles.section}>
            <div className="container">
            <header className={styles.sectionHeader}>
                <span className={styles.eyebrow}>Live</span>
                <h2 className={styles.sectionTitle}>Upcoming shows</h2>
                <p className={styles.sectionSubtitle}>
                All confirmed dates. More shows announced regularly — check back
                often and don’t miss the next pit.
                </p>
            </header>

            <div className={styles.layout}>
                <ConcertCalendar shows={upcoming} />
                <ConcertList shows={upcoming} />
            </div>
            </div>
        </section>

        {/* Past shows */}
        <PastConcerts shows={past} />

        {/* Booking CTA */}
        <ConcertsBookingCTA />
        </main>
    );
};
