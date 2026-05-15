import styles from "./tracklistCard.module.css";
import type { Release } from "@/app/lib/music";

type Props = { release: Release };

export default function TracklistCard({ release }: Props) {
    if (!release.tracks?.length) return null;

    return (
        <div className={`card ${styles.card}`}>
        <header className={styles.header}>
            <h3 className={styles.title}>Tracklist</h3>
            <span className={styles.count}>
            {release.tracks.length} tracks - {release.type}
            </span>
        </header>

        <ol className={styles.list}>
            {release.tracks.map((track, index) => (
            <li key={track.id} className={styles.row}>
                <span className={styles.index}>{index + 1}</span>
                <div className={styles.info}>
                <span className={styles.name}>{track.title}</span>
                {track.isSingle && (
                    <span className={styles.badge}>Single</span>
                )}
                </div>
                <span className={styles.length}>{track.length}</span>
            </li>
            ))}
        </ol>
        </div>
    );
};
