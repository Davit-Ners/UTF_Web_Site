import Image from "next/image";
import Link from "next/link";
import { IMAGE_BLUR_DATA_URL } from "@/app/lib/imageOptimization";
import type { Release } from "@/app/lib/music";
import styles from "./featuredRelease.module.css";

type Props = {
  release: Release;
};

function formatRuntime(release: Release) {
  if (!release.tracks?.length) return null;

  const seconds = release.tracks.reduce((total, track) => {
    const [min, sec] = track.length.split(":").map(Number);
    return total + min * 60 + sec;
  }, 0);

  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function formatDate(isoDate?: string) {
  if (!isoDate) return null;
  const [year, month, day] = isoDate.split("-");
  return `${day}.${month}.${year}`;
}

export default function FeaturedRelease({ release }: Props) {
  const runtime = formatRuntime(release);
  const facts = [
    { label: "Released", value: formatDate(release.releaseDate) ?? String(release.year) },
    { label: "Format", value: release.type },
    release.tracks?.length
      ? { label: "Tracks", value: String(release.tracks.length).padStart(2, "0") }
      : null,
    runtime ? { label: "Runtime", value: runtime } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  const platforms = [
    release.appleMusicUrl ? { href: release.appleMusicUrl, label: "Apple Music" } : null,
    release.youtubeMusicUrl ? { href: release.youtubeMusicUrl, label: "YouTube Music" } : null,
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <section className={styles.release} aria-labelledby="latest-release-title">
      <div className={styles.plane} aria-hidden="true" />

      <p className={`meta ${styles.index}`}>01 — Latest release</p>

      <h2 id="latest-release-title" className={styles.title}>
        {release.title}
      </h2>

      <div className={styles.cover}>
        <Image
          src={release.cover}
          alt={`${release.title} album cover`}
          width={1000}
          height={1000}
          className={styles.coverImage}
          sizes="(max-width: 900px) 100vw, 55vw"
          placeholder="blur"
          blurDataURL={IMAGE_BLUR_DATA_URL}
        />
      </div>

      <div className={styles.sheet}>
        <dl className={styles.facts}>
          {facts.map((fact) => (
            <div key={fact.label} className={styles.fact}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
          {release.credits?.map((credit) => (
            <div key={credit.role} className={`${styles.fact} ${styles.credit}`}>
              <dt>{credit.role}</dt>
              <dd>{credit.name}</dd>
            </div>
          ))}
        </dl>

        <div className={styles.close}>
          {release.subtitle ? <p className={styles.note}>{release.subtitle}</p> : null}

          <div className={styles.actions}>
            {release.spotifyUrl ? (
              <a href={release.spotifyUrl} target="_blank" rel="noreferrer" className="action-link on-bone">
                Listen <span className="arrow" aria-hidden="true">↗</span>
              </a>
            ) : null}
            <Link href={`/music/${release.id}`} className="action-link on-bone">
              Release <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>

          {platforms.length ? (
            <div className={styles.platforms}>
              {platforms.map((platform) => (
                <a key={platform.href} href={platform.href} target="_blank" rel="noreferrer">
                  {platform.label} <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
