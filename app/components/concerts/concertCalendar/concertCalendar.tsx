import styles from "./concertCalendar.module.css";
import { Concert } from "@/app/lib/concerts";

type Props = {
    shows: Concert[];
};

export default function ConcertCalendar({ shows }: Props) {
    if (!shows.length) {
        return (
        <aside className={styles.wrap}>
            <div className={`${styles.card} card`}>
            <h3 className={styles.title}>Calendar</h3>
            <p className={styles.empty}>No upcoming shows yet. New dates soon.</p>
            </div>
        </aside>
        );
    }

    const grouped = groupByMonth(shows);

    return (
        <aside className={styles.wrap} id="upcoming">
        <div className={`${styles.card} card`}>
            <h3 className={styles.title}>Calendar</h3>
            <p className={styles.subtitle}>All confirmed dates, by month.</p>

            <div className={styles.months}>
            {grouped.map((month) => (
                <div key={month.label} className={styles.monthBlock}>
                <div className={styles.monthHeader}>{month.label}</div>
                <ul className={styles.days}>
                    {month.items.map((show) => {
                    const d = new Date(show.date);
                    const day = d.getDate().toString().padStart(2, "0");
                    const weekday = d.toLocaleString("en", { weekday: "short" });

                    return (
                        <li key={show.id} className={styles.dayRow}>
                        <div className={styles.dayBadge}>
                            <span className={styles.day}>{day}</span>
                            <span className={styles.weekday}>{weekday}</span>
                        </div>
                        <div className={styles.dayInfo}>
                            <span className={styles.city}>{show.city}</span>
                            <span className={styles.venue}>{show.venue}</span>
                        </div>
                        </li>
                    );
                    })}
                </ul>
                </div>
            ))}
            </div>
        </div>
        </aside>
    );
};

function groupByMonth(shows: Concert[]) {
    const formatter = new Intl.DateTimeFormat("en-GB", {
        month: "long",
        year: "numeric",
    });

    const map = new Map<string, Concert[]>();

    for (const s of shows) {
        const key = formatter.format(new Date(s.date));
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(s);
    }

    return Array.from(map.entries()).map(([label, items]) => ({
        label,
        items,
    }));
};
