import YearBlock from "@/app/components/concerts/yearBlock/yearBlock";
import styles from "./archivePage.module.css";
import { concerts } from "@/app/lib/concerts";

type GroupedShows = {
  year: number;
  shows: typeof concerts;
};

export default function PastShowsPage() {
    const today = new Date();

    const past = concerts
        .map((c) => ({ ...c, d: new Date(c.date) }))
        .filter((c) => c.d < today)
        .sort((a, b) => b.d.getTime() - a.d.getTime());

    const byYear: Record<number, typeof past> = {};
    past.forEach((show) => {
        const year = show.d.getFullYear();
        if (!byYear[year]) byYear[year] = [];
        byYear[year].push(show);
    });

    const groups = Object.entries(byYear)
        .map(([year, shows]) => ({
        year: Number(year),
        shows,
        }))
        .sort((a, b) => b.year - a.year);

    return (
        <main className={styles.page}>
        <section className={styles.hero}>
            <div className="container">
            <p className={styles.eyebrow}>Archive</p>
            <h1 className={styles.title}>Past shows</h1>
            <p className={styles.subtitle}>
                Every stage we&apos;ve hit so far — clubs, festivals and everything in between.
            </p>
            </div>
        </section>

        <section className={styles.section}>
            <div className="container">
            {groups.length === 0 ? (
                <p className={styles.empty}>No past shows yet — first tour loading…</p>
            ) : (
                groups.map((group) => (
                    <YearBlock key={group.year} year={group.year} shows={group.shows} />
                ))
            )}
            </div>
        </section>
        </main>
    );
};
