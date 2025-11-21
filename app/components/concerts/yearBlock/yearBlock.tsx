import { concerts } from '@/app/lib/concerts';
import styles from '../../../concerts/past/archivePage.module.css';
import Link from 'next/link';

type YearBlockProps = {
    year: number;
    shows: typeof concerts;
};

export default function YearBlock({ year, shows }: YearBlockProps) {
    return (
        <section className={styles.yearBlock}>
        <header className={styles.yearHeader}>
            <h2 className={styles.yearTitle}>{year}</h2>
            <span className={styles.yearCount}>
            {shows.length} show{shows.length > 1 ? "s" : ""}
            </span>
        </header>

        <div className={styles.listWrap}>
            {shows.map((show) => (
            <article key={show.id} className={`card ${styles.showCard}`}>
                <div className={styles.showMain}>
                <div className={styles.showDate}>
                    <span className={styles.day}>
                    {new Date(show.date).getDate().toString().padStart(2, "0")}
                    </span>
                    <span className={styles.month}>
                    {new Date(show.date)
                        .toLocaleString("en", { month: "short" })
                        .toUpperCase()}
                    </span>
                </div>

                <div className={styles.showInfo}>
                    <h3 className={styles.showCity}>{show.city}</h3>
                    <p className={styles.showVenue}>
                    {show.venue}
                    {show.note ? ` — ${show.note}` : ""}
                    </p>
                </div>
                </div>

                <div className={styles.showMeta}>
                {/* Placeholder pour plus tard : type de show, lineup, etc. */}
                {show.ticketUrl && (
                    <a
                    href={show.ticketUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.linkMuted}
                    >
                    Original tickets page
                    </a>
                )}
                <Link href={`/concerts/${show.id}`} className={styles.detailsBtn}>
                    Details
                </Link>
                </div>
            </article>
            ))}
        </div>
        </section>
    );
};
