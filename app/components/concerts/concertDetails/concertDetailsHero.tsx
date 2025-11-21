import Image from 'next/image';
import styles from '../../../concerts/[slug]/concertDetail.module.css';
import Link from 'next/link';
import { Concert } from '@/app/lib/concerts';

export default function ConcertDetailsHero(
    { heading, concert, dateLong, d }: 
    { heading: string; concert: Concert; dateLong: string, d: Date; }
) {
    return (
        <section className={styles.hero}>
            <div className="container">
            <div className={styles.heroInner}>
                <div className={styles.heroMeta}>
                <span className={styles.eyebrow}>Live show</span>
                <h1 className={styles.title}>{heading}</h1>
                <p className={styles.subtitle}>
                    {dateLong} — {concert.city}, {concert.venue}
                    {concert.note ? ` — ${concert.note}` : ""}
                </p>

                <div className={styles.tagsRow}>
                    <div className={styles.dateTag}>
                    <span className={styles.day}>
                        {d.getDate().toString().padStart(2, "0")}
                    </span>
                    <span className={styles.month}>
                        {d
                        .toLocaleString("en", { month: "short" })
                        .toUpperCase()}
                    </span>
                    </div>
                    {concert.price && (
                    <span className={styles.chip}>
                        {concert.price}
                    </span>
                    )}
                    {concert.doorsTime && (
                    <span className={styles.chip}>
                        Doors {concert.doorsTime}
                    </span>
                    )}
                    {concert.showTime && (
                    <span className={styles.chip}>
                        On stage {concert.showTime}
                    </span>
                    )}
                </div>

                <div className={styles.heroActions}>
                    {concert.ticketUrl && (
                    <a
                        href={concert.ticketUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="button"
                    >
                        Tickets / Info
                    </a>
                    )}
                    <Link
                    href="/booking"
                    className={`${styles.secondaryBtn}`}
                    >
                    Book us for your event
                    </Link>
                </div>
                </div>

                {/* Poster */}
                {concert.posterUrl && (
                <div className={styles.posterWrap}>
                    <div className={`card ${styles.posterCard}`}>
                    <div className={styles.posterInner}>
                        <Image
                        src={concert.posterUrl}
                        alt={`${heading} poster`}
                        width={600}
                        height={800}
                        className={styles.posterImg}
                        />
                    </div>
                    <span className={styles.posterLabel}>
                        Official poster
                    </span>
                    </div>
                </div>
                )}
            </div>
            </div>
        </section>
    )
}