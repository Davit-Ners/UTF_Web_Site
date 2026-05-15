import Link from "next/link";
import styles from "./pastConcerts.module.css";
import { type Concert } from "@/app/lib/concerts";

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
            <h2 className={styles.title}>Previous stages</h2>
            <p className={styles.subtitle}>
              A snapshot of past shows from the Belgian metal scene and beyond.
            </p>
          </div>
          {recent.length > 0 && (
            <div className={styles.ctaWrap}>
              <Link href="/concerts/past" className="button">
                View All Shows
              </Link>
            </div>
          )}
        </header>

        {recent.length === 0 ? (
          <p className={styles.empty}>Past shows will be added here.</p>
        ) : (
          <ul className={styles.list}>
            {recent.map((show) => (
              <Link key={show.id} className={styles.item} href={`/concerts/${show.id}`}>
                <span className={styles.date}>{formatShort(show.date)}</span>
                <span className={styles.city}>{show.city}</span>
                <span className={styles.venue}>{show.venue}</span>
              </Link>
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
    timeZone: "UTC",
  }).format(new Date(`${raw}T12:00:00.000Z`));
}
