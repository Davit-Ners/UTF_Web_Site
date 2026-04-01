"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./featuredVideo.module.css";

type Props = {
  videoId: string;
  title: string;
  eyebrow?: string;
  subtitle?: string;
  compact?: boolean;
};

export default function FeaturedVideo({
  videoId,
  title,
  eyebrow = "New Video",
  subtitle = "Official music video",
  compact = true,
}: Props) {
  const [play, setPlay] = useState(false);
  const yt = `https://www.youtube.com/watch?v=${videoId}`;
  const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <section className={`${styles.section} ${compact ? styles.compact : ""}`}>
      <div className="container">
        <header className={styles.heading}>
          {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </header>

        <div className={styles.wrap}>
          <div className={styles.frame}>
            {!play ? (
              <button
                className={styles.poster}
                onClick={() => setPlay(true)}
                aria-label={`Play: ${title}`}
              >
                <Image
                  src={thumbnail}
                  alt=""
                  fill
                  className={styles.posterImage}
                  sizes="(max-width: 780px) 100vw, 1100px"
                />
                <span className={styles.fx} />
                <span className={styles.play}>
                  <span>{">"}</span>
                </span>
                <span className={styles.corner} />
                <span className={styles.cornerRight} />
              </button>
            ) : (
              <div className={styles.player}>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            )}
          </div>

          <div className={styles.caption}>
            <a href={yt} target="_blank" rel="noreferrer" className={styles.link}>
              Watch on YouTube {"->"}
            </a>
            <span className="text-muted"> | </span>
            <span className="text-muted">4K available</span>
          </div>
        </div>
      </div>
    </section>
  );
}
