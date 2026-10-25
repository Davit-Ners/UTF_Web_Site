"use client";

import NewTabLink from "@/app/components/newTabLink";
import Image from "next/image";
import { useState } from "react";
import { IMAGE_BLUR_DATA_URL } from "@/app/lib/imageOptimization";
import styles from "./featuredVideo.module.css";

type Props = {
  videoId: string;
  title: string;
  label?: string;
};

/*
 * Temporary poster: YouTube's 640x480 still (16:9 picture letterboxed in 4:3;
 * the frame crops the bars). It goes through next/image, so the visitor's
 * browser does not contact YouTube until they press play.
 */
const posterFor = (videoId: string) => `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;

export default function FeaturedVideo({ videoId, title, label = "Official video" }: Props) {
  const [play, setPlay] = useState(false);

  return (
    <section className={styles.video} aria-labelledby="video-title">
      <p className={`meta ${styles.index}`}>03 — Video</p>

      <div className={styles.screen}>
        {play ? (
          <iframe
            className={styles.player}
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button type="button" className={styles.poster} onClick={() => setPlay(true)}>
            <Image
              src={posterFor(videoId)}
              alt=""
              fill
              className={styles.posterImage}
              sizes="(max-width: 900px) 100vw, 75vw"
              placeholder="blur"
              blurDataURL={IMAGE_BLUR_DATA_URL}
            />
            <span className={styles.play}>
              Play <span className="srOnly">{title}</span>
              <span className={styles.playMark} aria-hidden="true">▶</span>
            </span>
          </button>
        )}
      </div>

      <div className={styles.side}>
        <p className="meta">{label}</p>
        <h2 id="video-title" className={styles.title}>
          {title}
        </h2>
        <NewTabLink
          href={`https://www.youtube.com/watch?v=${videoId}`}
          className={`action-link ${styles.external}`}
        >
          YouTube <span className="arrow" aria-hidden="true">↗</span>
        </NewTabLink>
      </div>
    </section>
  );
}
