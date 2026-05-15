import YearBlock from "@/app/components/concerts/yearBlock/yearBlock";
import styles from "./archivePage.module.css";
import { getConcertBuckets, type Concert } from "@/app/lib/concerts";

type GroupedShows = {
  year: number;
  shows: Concert[];
};

export const revalidate = 60;

export default async function PastShowsPage() {
  const { past } = await getConcertBuckets();

  const byYear = new Map<number, Concert[]>();

  for (const show of past) {
    const year = new Date(`${show.date}T12:00:00.000Z`).getUTCFullYear();
    const current = byYear.get(year) ?? [];
    current.push(show);
    byYear.set(year, current);
  }

  const groups: GroupedShows[] = Array.from(byYear.entries())
    .map(([year, shows]) => ({
      year,
      shows,
    }))
    .sort((a, b) => b.year - a.year);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <p className={styles.eyebrow}>Archive</p>
          <h1 className={styles.title}>Live archive</h1>
          <p className={styles.subtitle}>
            Previous stages, club shows and festival slots from the Belgian
            metal scene.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          {groups.length === 0 ? (
            <p className={styles.empty}>Past shows will be added here.</p>
          ) : (
            groups.map((group) => (
              <YearBlock key={group.year} year={group.year} shows={group.shows} />
            ))
          )}
        </div>
      </section>
    </main>
  );
}
