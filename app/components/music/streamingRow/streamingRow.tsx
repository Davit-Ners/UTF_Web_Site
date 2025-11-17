import styles from "./streamingRow.module.css";
import type { Release } from "@/app/lib/music";

type Props = { release: Release };

export default function StreamingRow({ release }: Props) {
    return (
        <div className={`card ${styles.card}`}>
        <h3 className={styles.title}>Listen everywhere</h3>
        <p className={styles.text}>
            Pick your favourite platform and add the album to your playlist.
        </p>

        <div className={styles.links}>
            {release.spotifyUrl && (
            <a
                href={release.spotifyUrl}
                target="_blank"
                rel="noreferrer"
                className={styles.linkRow}
            >
                <span>Spotify</span>
                <span className={styles.chevron}>↗</span>
            </a>
            )}
            {release.appleMusicUrl && (
            <a
                href={release.appleMusicUrl}
                target="_blank"
                rel="noreferrer"
                className={styles.linkRow}
            >
                <span>Apple Music</span>
                <span className={styles.chevron}>↗</span>
            </a>
            )}
            {release.youtubeMusicUrl && (
            <a
                href={release.youtubeMusicUrl}
                target="_blank"
                rel="noreferrer"
                className={styles.linkRow}
            >
                <span>YouTube Music</span>
                <span className={styles.chevron}>↗</span>
            </a>
            )}
            {release.bandcampUrl && (
            <a
                href={release.bandcampUrl}
                target="_blank"
                rel="noreferrer"
                className={styles.linkRow}
            >
                <span>Bandcamp</span>
                <span className={styles.chevron}>↗</span>
            </a>
            )}
        </div>
        </div>
    );
};
