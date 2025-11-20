import Image from "next/image";
import styles from "./musicFeaturedRelease.module.css";
import type { Release } from "@/app/lib/music";

type Props = { release: Release };

export default function FeaturedRelease({ release }: Props) {
    return (
        <section className={styles.wrap}>
        <div className={`card ${styles.card}`}>
            <div className={styles.coverWrap}>
            <div className={styles.cover}>
                <Image
                src={release.cover}
                alt={release.title}
                fill
                sizes="(max-width: 768px) 45vw, 280px"
                />
            </div>
            </div>

            <div className={styles.body}>
            <span className={styles.eyebrow}>{release.type}</span>
            <h2 className={styles.title}>{release.title}</h2>
            <p className={styles.meta}>
                {release.subtitle && <span>{release.subtitle} · </span>}
                <span>{release.year}</span>
            </p>
            <p className={styles.blurb}>{release.blurb}</p>

            {release.highlightTrack && (
                <p className={styles.highlight}>
                Highlight track: <strong>{release.highlightTrack}</strong>
                </p>
            )}

            <div className={styles.actions}>
                {release.spotifyUrl && (
                <a
                    href={release.spotifyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="button"
                >
                    Listen on Spotify
                </a>
                )}
                {release.appleMusicUrl && (
                <a
                    href={release.appleMusicUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.secondaryBtn}
                >
                    Apple Music
                </a>
                )}
                {release.youtubeMusicUrl && (
                <a
                    href={release.youtubeMusicUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.secondaryBtn}
                >
                    YouTube Music
                </a>
                )}
            </div>
            </div>

            {release.spotifyUrl && false && (
            <div className={styles.player}>
                <iframe
                src={release.spotifyUrl?.replace(
                    "open.spotify.com/album",
                    "open.spotify.com/embed/album"
                )}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                ></iframe>
            </div>
            )}
        </div>
        </section>
    );
};
