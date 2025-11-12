"use client";

import styles from "./featuredRelease.module.css";

type Props = {
    title: string;            // "Sent To Die"
    artist?: string;          // "Until They Fall"
    year?: string;            // "2024"
    coverSrc: string;         // "/album-cover.jpg" (dans /public)
    spotifyId?: string;       // ex: "2Wi9G9m0mS6Dk..." (ID album/track/playlist)
    spotifyType?: "album" | "track" | "playlist";
    blurb?: string;           // petite phrase
    appleUrl?: string;
    youtubeMusicUrl?: string;
};

export default function FeaturedRelease({
    title,
    artist = "Until They Fall",
    year,
    coverSrc,
    spotifyId,
    spotifyType = "album",
    blurb = "Out now on all platforms.",
    appleUrl,
    youtubeMusicUrl
}: Props) {

    const hasSpotify = Boolean(spotifyId);
    const spotifySrc = hasSpotify
        ? `https://open.spotify.com/embed/${spotifyType}/${spotifyId}?utm_source=generator&theme=0`
        : undefined;

    return (
        <section className={styles.wrap} aria-labelledby="featured-release-title">
        <div className="container">
            <div className={styles.card}>

            {/* Cover */}
            <div className={styles.cover}>
                <img src={coverSrc} alt={`${title} cover`} />
            </div>

            {/* Text */}
            <div className={styles.meta}>
                <span className={styles.eyebrow}>Featured Release</span>
                <h3 id="featured-release-title" className={styles.title}>
                {title} {year ? <span className={styles.year}>· {year}</span> : null}
                </h3>
                <p className={styles.artist}>{artist}</p>
                <p className={styles.blurb}>{blurb}</p>

                <div className={styles.links}>
                {hasSpotify && (
                    <a className="button" href={`https://open.spotify.com/${spotifyType}/${spotifyId}`} target="_blank" rel="noreferrer">
                    Listen on Spotify
                    </a>
                )}
                {appleUrl && (
                    <a className={`button ${styles.btnAlt}`} href={appleUrl} target="_blank" rel="noreferrer">
                    Apple Music
                    </a>
                )}
                {youtubeMusicUrl && (
                    <a className={`button ${styles.btnAlt}`} href={youtubeMusicUrl} target="_blank" rel="noreferrer">
                    YouTube Music
                    </a>
                )}
                </div>
            </div>

            {/* Embed (compact) */}
            {hasSpotify && (
                <div className={styles.player} aria-hidden={false}>
                <iframe
                    title={`${title} on Spotify`}
                    src={spotifySrc}
                    loading="lazy"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                />
                </div>
            )}
            </div>
        </div>
        </section>
    );
};
