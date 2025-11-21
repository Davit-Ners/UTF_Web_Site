import styles from "./pastConcerts.module.css";
import { Concert } from "@/app/lib/concerts";
import Link from "next/link";

type Props = {
  shows: Concert[];
};

export default function PastConcerts({ shows }: Props) {
  const recent = shows.slice(0, 6);

  return (
    <section className={styles.section}>
      <div className="container">
        <header className={styles.header}>
          <div>
            <span className={styles.eyebrow}>Past shows</span>
            <h2 className={styles.title}>Where we’ve played</h2>
            <p className={styles.subtitle}>
              A snapshot of recent shows. Dive into the full archive to see every stage we’ve hit.
            </p>
          </div>
          {recent.length > 0 && (
            <div className={styles.ctaWrap}>
              <Link href="/concerts/past" className="button">
                View all shows
              </Link>
            </div>
          )}
        </header>

        {recent.length === 0 ? (
          <p className={styles.empty}>We’ll update this once tours begin.</p>
        ) : (
          <ul className={styles.list}>
            {recent.map((show) => (
              <li key={show.id} className={styles.item}>
                <span className={styles.date}>{formatShort(show.date)}</span>
                <span className={styles.city}>{show.city}</span>
                <span className={styles.venue}>{show.venue}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function formatShort(raw: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  }).format(new Date(raw));
}
