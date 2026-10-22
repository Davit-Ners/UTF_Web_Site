import Image from "next/image";
import Link from "next/link";
import { members } from "@/app/lib/about";
import { IMAGE_BLUR_DATA_URL } from "@/app/lib/imageOptimization";
import type { Release } from "@/app/lib/music";
import { formatReleaseDate, getListenLinks, getRuntime } from "@/app/lib/release";
import styles from "./releaseSleeve.module.css";

type Props = {
  release: Release;
  /* Alternate releases put the artwork on the right */
  mirrored?: boolean;
};

export default function ReleaseSleeve({ release, mirrored = false }: Props) {
  const tracks = release.tracks ?? [];
  const runtime = getRuntime(release);
  const listen = getListenLinks(release);

  const meta = [
    release.type,
    formatReleaseDate(release),
    tracks.length ? `${String(tracks.length).padStart(2, "0")} tracks` : null,
    runtime,
  ].filter(Boolean);

  const hasNotes = Boolean(release.story || release.credits?.length || release.airplay?.length);
  const titleId = `${release.id}-title`;

  return (
    <article id={release.id} className={styles.release} aria-labelledby={titleId}>
      {/* Front: the artwork */}
      <div
        className={`${styles.sleeve} ${mirrored ? styles.mirrored : ""} ${
          release.type === "Single" ? styles.single : ""
        }`}
      >
        <div className={styles.front}>
          <Image
            src={release.coverMaster ?? release.cover}
            alt={`${release.title} artwork`}
            fill
            priority={!mirrored}
            sizes="(max-width: 900px) 100vw, 60vw"
            className={styles.cover}
            placeholder="blur"
            blurDataURL={IMAGE_BLUR_DATA_URL}
          />
        </div>

        {/* Back: tracklist as the primary typography */}
        <div className={styles.back}>
          <p className={`meta ${styles.meta}`}>{meta.join(" — ")}</p>
          <h2 id={titleId} className={styles.title}>
            {release.title}
          </h2>

          {tracks.length ? (
            <ol className={styles.tracks}>
              {tracks.map((track, index) => (
                <li key={track.id} className={styles.track}>
                  <span className={styles.trackIndex}>{String(index + 1).padStart(2, "0")}</span>
                  <span className={styles.trackTitle}>
                    {track.title}
                    {track.isSingle ? <span className={styles.singleMark}>Single</span> : null}
                  </span>
                  <span className={styles.trackLength}>{track.length}</span>
                </li>
              ))}
            </ol>
          ) : null}

          {runtime ? (
            <p className={styles.total}>
              <span>Total</span>
              <span>{runtime}</span>
            </p>
          ) : null}

          {listen.length ? (
            <ul className={styles.listen} aria-label={`Listen to ${release.title}`}>
              {listen.map((item) => (
                <li key={item.label}>
                  <a href={item.href} target="_blank" rel="noreferrer" className={styles.listenLink}>
                    {item.label}
                    <span className={styles.arrow} aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      {/* Liner notes on bone */}
      {hasNotes ? (
        <div className={styles.notes}>
          <p className={`meta ${styles.notesIndex}`}>Liner notes — {release.title}</p>

          {release.story ? <p className={styles.story}>{release.story}</p> : null}

          <div className={styles.colophon}>
            {release.credits?.length || release.airplay?.length ? (
              <dl className={styles.facts}>
                {release.credits?.map((credit) => (
                  <div key={credit.role} className={styles.fact}>
                    <dt>{credit.role}</dt>
                    <dd>{credit.name}</dd>
                  </div>
                ))}
                {release.airplay?.map((item) => (
                  <div key={`${item.track}-${item.station}`} className={styles.fact}>
                    <dt>Airplay</dt>
                    <dd>
                      {item.track} — {item.station}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}

            <dl className={styles.facts}>
              <div className={styles.factHead}>
                <dt>Line-up</dt>
              </div>
              {members.map((member) => (
                <div key={member.name} className={styles.fact}>
                  <dt>{member.role}</dt>
                  <dd>{member.name}</dd>
                </div>
              ))}
            </dl>

            <Link href="/concerts" className={`action-link on-bone ${styles.live}`}>
              Live dates <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      ) : null}
    </article>
  );
}
