import Link from 'next/link';
import styles from '../../../concerts/[slug]/concertDetail.module.css';
import { Concert } from '@/app/lib/concerts';

export default function ConcertDetailsContentGrid(
    { concert, dateLong, dateTag, d }: 
    { concert: Concert; dateLong: string, dateTag: string; d: Date; }) {
    return (
        <section className={styles.contentSection}>
            <div className="container">
            <div className={styles.grid}>
                {/* Col principale */}
                <div className={styles.mainCol}>
                {/* About / description */}
                <section className={`card ${styles.block}`}>
                    <h2 className={styles.blockTitle}>About this show</h2>
                    <p className={styles.blockText}>
                    {/* Tu peux remplacer ce texte mock par un champ description
                        plus tard si tu l’ajoutes dans Concert */}
                    Until They Fall live in {concert.city} at{" "}
                    {concert.venue}. Expect a full set of modern metal,
                    big riffs and heavy energy. Perfect for fans of
                    melodic death, metalcore and massive choruses.
                    </p>
                </section>

                {/* Lineup */}
                <section className={`card ${styles.block}`}>
                    <div className={styles.blockHeaderRow}>
                    <h2 className={styles.blockTitle}>Line-up</h2>
                    {concert.facebookEventUrl && (
                        <a
                        href={concert.facebookEventUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="button small"
                        >
                        View event page
                        </a>
                    )}
                    </div>

                    {concert.lineup && concert.lineup.length > 0 ? (
                    <ul className={styles.lineupList}>
                        {concert.lineup.map((entry, idx) => (
                        <li key={idx} className={styles.lineupItem}>
                            <span className={styles.bullet}>•</span>
                            <span>{entry}</span>
                        </li>
                        ))}
                    </ul>
                    ) : (
                    <p className={styles.blockText}>
                        Full line-up details will be added soon.
                    </p>
                    )}
                </section>

                {/* Extra info / notes */}
                <section className={`card ${styles.block}`}>
                    <h2 className={styles.blockTitle}>Practical info</h2>
                    <dl className={styles.infoGrid}>
                    <div>
                        <dt>City</dt>
                        <dd>{concert.city}</dd>
                    </div>
                    <div>
                        <dt>Venue</dt>
                        <dd>{concert.venue}</dd>
                    </div>
                    {concert.doorsTime && (
                        <div>
                        <dt>Doors</dt>
                        <dd>{concert.doorsTime}</dd>
                        </div>
                    )}
                    {concert.showTime && (
                        <div>
                        <dt>Show time</dt>
                        <dd>{concert.showTime}</dd>
                        </div>
                    )}
                    {concert.price && (
                        <div>
                        <dt>Tickets</dt>
                        <dd>{concert.price}</dd>
                        </div>
                    )}
                    <div>
                        <dt>Date</dt>
                        <dd>{dateLong}</dd>
                    </div>
                    </dl>
                </section>
                </div>

                {/* Aside */}
                <aside className={styles.sideCol}>
                    <section className={`card ${styles.sideBlock}`}>
                        <h3 className={styles.sideTitle}>Quick recap</h3>

                        <ul className={styles.sideList}>
                        <li className={styles.sideRow}>
                            <span className={styles.sideLabel}>When</span>
                            <span className={styles.sideValue}>
                            {dateTag}, {d.getFullYear()}
                            </span>
                        </li>

                        <li className={styles.sideRow}>
                            <span className={styles.sideLabel}>Where</span>
                            <span className={styles.sideValue}>
                            {concert.city}
                            <br />
                            {concert.venue}
                            </span>
                        </li>

                        {concert.price && (
                            <li className={styles.sideRow}>
                            <span className={styles.sideLabel}>Tickets</span>
                            <span className={styles.sideValue}>{concert.price}</span>
                            </li>
                        )}
                        </ul>

                        <Link href="/concerts" className={`button ${styles.backButton}`}>
                        ← Back to all shows
                        </Link>
                    </section>
                </aside>
            </div>
            </div>
        </section>
    );
};
