"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import NewTabLink from "@/app/components/newTabLink";
import { liveReference, liveVideoLinks, type LiveReferenceData } from "@/app/lib/liveReference";
import styles from "./liveReference.module.css";

type Props = {
  variant?: "full" | "compact";
  data?: LiveReferenceData;
};

export default function LiveReference({ variant = "full", data = liveReference }: Props) {
  const compact = variant === "compact";
  const id = compact ? "booking-live-reference" : "live-reference";
  const links = liveVideoLinks(data.youtubeId);
  const [playing, setPlaying] = useState(false);
  const [failedPoster, setFailedPoster] = useState<string | null>(null);
  // Only local posters are allowed, including when content is replaced later.
  const poster = data.poster?.startsWith("/") && !data.poster.startsWith("//") ? data.poster : null;
  const context = [data.eventName, data.date, data.location].filter(Boolean).join(" — ");
  const videoTitle = `Until They Fall — live performance${context ? ` — ${context}` : ""}`;

  return (
    <section id={id} className={`${styles.video} ${compact ? styles.compact : ""}`} aria-labelledby={`${id}-title`}>
      <p className={`meta ${styles.index}`}>{compact ? "Live reference" : "02 — Live reference"}</p>

      <div className={styles.screen}>
        {playing && links ? (
          <iframe
            className={styles.player}
            src={links.embedUrl}
            title={videoTitle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className={styles.poster}
            disabled={!links}
            aria-label={`Play live performance by Until They Fall${context ? ` — ${context}` : ""}${!links ? " — video not yet available" : ""}`}
            aria-describedby={`${id}-notice`}
            onClick={() => { if (links) setPlaying(true); }}
          >
            {poster && failedPoster !== poster ? (
              <Image
                src={poster}
                alt=""
                fill
                className={styles.posterImage}
                sizes={compact ? "(max-width: 900px) calc(100vw - 32px), 320px" : "(max-width: 900px) 100vw, 75vw"}
                onError={() => setFailedPoster(poster)}
              />
            ) : <span className={styles.fallback} aria-hidden="true">Until They Fall</span>}
            <span className={styles.play} aria-hidden="true">
              Play live <span className={styles.playMark}>▶</span>
            </span>
          </button>
        )}
      </div>

      <div className={styles.side}>
        <h2 id={`${id}-title`} className={styles.title}>On stage</h2>
        {context ? <p className={`meta ${styles.context}`}>{context}</p> : null}
        {data.result ? <p className={`meta ${styles.context}`}>{data.result}</p> : null}
        {!links ? <p className={`meta ${styles.context}`}>Live footage pending</p> : null}
        {data.posterTemporary ? <p className={`meta ${styles.context}`}>Temporary poster</p> : null}
        <div className={styles.links}>
          {links ? (
            <NewTabLink href={links.youtubeUrl} className="action-link">
              YouTube <span className="arrow" aria-hidden="true">↗</span>
            </NewTabLink>
          ) : null}
          {!compact ? (
            <Link href="/booking" className={`action-link ${styles.booking}`}>
              Booking <span className="arrow" aria-hidden="true">→</span>
            </Link>
          ) : null}
        </div>
      </div>

      <p id={`${id}-notice`} className={styles.notice}>
        Pressing play loads the video from YouTube (Google), which may then process your data and
        store identifiers on your device. <Link href="/privacy">Privacy Policy</Link>
      </p>
      <noscript>
        <p className={styles.noScript}>
          {links ? "Enable JavaScript to play here, or use the YouTube link." : "Live video is not yet available."}
        </p>
      </noscript>
    </section>
  );
}
