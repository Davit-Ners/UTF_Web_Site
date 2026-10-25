import Reveal from "@/app/components/motion/reveal";
import NewTabLink from "@/app/components/newTabLink";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IMAGE_BLUR_DATA_URL } from "@/app/lib/imageOptimization";
import { discography, getOtherReleases, getReleaseBySlug } from "@/app/lib/music";
import { formatReleaseDate, getListenLinks, getRuntime } from "@/app/lib/release";
import { jsonLd, musicAlbumJsonLd } from "@/app/lib/structuredData";
import { getSiteUrl } from "@/lib/site";
import styles from "./releasePage.module.css";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return discography.map((release) => ({ slug: release.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const release = getReleaseBySlug(slug);
  if (!release) return {};

  const title = `${release.title} (${release.type}, ${release.year})`;
  const image = release.coverMaster ?? release.cover;
  /* Built from release data only: what it is, by whom, how many tracks, when */
  const tracks = release.tracks?.length;
  const description = [
    `${release.title}, the ${(release.subtitle ?? release.type).toLowerCase()} by Until They Fall, melodic death metal from Brussels.`,
    tracks ? `${tracks} tracks, released ${formatReleaseDate(release)}.` : `Released ${formatReleaseDate(release)}.`,
  ].join(" ");

  return {
    title,
    description,
    alternates: { canonical: `/music/${release.id}` },
    openGraph: {
      type: "music.album",
      title: `${title} | Until They Fall`,
      description,
      url: `/music/${release.id}`,
      images: [{ url: image, alt: `${release.title} artwork` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Until They Fall`,
      description,
      images: [image],
    },
  };
}

function CreditHead({ label, cut }: { label: string; cut: boolean }) {
  const content = <dt>{label}</dt>;
  return cut ? (
    <Reveal className={`${styles.creditHead} rule-cut`}>{content}</Reveal>
  ) : (
    <div className={styles.creditHead}>{content}</div>
  );
}

export default async function ReleasePage({ params }: Props) {
  const { slug } = await params;
  const release = getReleaseBySlug(slug);
  if (!release) notFound();

  const tracks = release.tracks ?? [];
  const runtime = getRuntime(release);
  const listen = getListenLinks(release);
  const others = getOtherReleases(slug);
  const caption = [
    release.type,
    formatReleaseDate(release),
    tracks.length ? `${String(tracks.length).padStart(2, "0")} tracks` : null,
    runtime,
  ].filter(Boolean);

  const recording = release.credits ?? [];
  const broadcast = release.airplay ?? [];
  const personnel = release.recordingPersonnel ?? [];
  const hasCredits = recording.length > 0 || broadcast.length > 0 || personnel.length > 0;
  /* R3 opens the Credits section on the first list's heading rule only */
  const firstCredits = recording.length ? "recording" : broadcast.length ? "broadcast" : "personnel";

  /* Section markers follow only the parts that render */
  const parts = ["cover", tracks.length ? "songs" : null, release.story ? "story" : null, hasCredits ? "credits" : null, "archive"].filter(Boolean);
  const marker = (part: string) => ["I", "II", "III", "IV", "V", "VI"][parts.indexOf(part)];

  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(musicAlbumJsonLd(release, getSiteUrl())) }} />
      <nav className={styles.crumbs} aria-label="Breadcrumb">
        <Link href="/music">Music</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{release.title}</span>
      </nav>

      {/* I — Cover spread */}
      <section className={styles.cover} aria-labelledby="release-title">
        {/* R1: the cover is uncovered on load, like lifting the sleeve */}
        <div className={`${styles.plate} plate plate-load`}>
          <Image
            src={release.coverMaster ?? release.cover}
            alt={`${release.title} artwork`}
            fill
            priority
            sizes="(max-width: 900px) 100vw, 86vh"
            className={styles.plateImage}
            placeholder="blur"
            blurDataURL={IMAGE_BLUR_DATA_URL}
          />
        </div>

        <div className={styles.caption}>
          <p className={`meta ${styles.marker}`}>{marker("cover")}</p>
          <p className={`meta ${styles.captionMeta}`}>{caption.join(" — ")}</p>
          <h1 id="release-title" className={styles.title}>
            {release.title}
          </h1>
        </div>

        {listen.length ? (
          <ul className={styles.listen} aria-label={`Listen to ${release.title}`}>
            {listen.map((link) => (
              <li key={link.label}>
                <NewTabLink href={link.href} className={styles.listenLink}>
                  {link.label}
                  <span className={styles.arrow} aria-hidden="true">↗</span>
                </NewTabLink>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      {/* Songs as chapters */}
      {tracks.length ? (
        <section className={styles.songs} aria-labelledby="songs-title">
          <h2 className={`meta ${styles.sectionHead}`}>
            <span>{marker("songs")}</span>
            <span id="songs-title">Songs</span>
          </h2>

          {/* R3: the Songs rule draws once, on scroll; the rows stay static */}
          <Reveal as="ol" className={`${styles.songList} rule-cut rule-cut-ink`}>
            {tracks.map((track, index) => {
              const airplay = broadcast.filter((item) => item.track === track.title);
              const notes = [
                track.isSingle ? <span key="single" className={styles.single}>Single</span> : null,
                ...airplay.map((item) => <span key={item.station}>Airplay — {item.station}</span>),
                track.videoId ? (
                  <NewTabLink
                    key="video"
                    href={`https://www.youtube.com/watch?v=${track.videoId}`}
                    className={styles.video}
                  >
                    Video <span className="srOnly">for {track.title}</span>
                    <span aria-hidden="true">↗</span>
                  </NewTabLink>
                ) : null,
              ].filter(Boolean);

              return (
                <li key={track.id} className={styles.song}>
                  <span className={styles.songNo}>{String(index + 1).padStart(2, "0")}</span>
                  <h3 className={styles.songTitle}>{track.title}</h3>
                  <span className={styles.songLength}>{track.length}</span>
                  {notes.length ? <p className={styles.songNotes}>{notes}</p> : null}
                </li>
              );
            })}
          </Reveal>
        </section>
      ) : null}

      {/* Story: only real copy, never a fallback */}
      {release.story ? (
        <section className={styles.story} aria-labelledby="story-title">
          <h2 className={`meta ${styles.sectionHead}`}>
            <span>{marker("story")}</span>
            <span id="story-title">Story</span>
          </h2>
          <p className={styles.storyText}>{release.story}</p>
        </section>
      ) : null}

      {/* Confirmed credits only */}
      {hasCredits ? (
        <section className={styles.credits} aria-labelledby="credits-title">
          <h2 className={`meta ${styles.sectionHead}`}>
            <span>{marker("credits")}</span>
            <span id="credits-title">Credits</span>
          </h2>

          <div className={styles.creditColumns}>
            {recording.length ? (
              <dl className={styles.creditList}>
                <CreditHead label="Recording" cut={firstCredits === "recording"} />
                {recording.map((credit) => (
                  <div key={credit.role} className={styles.creditRow}>
                    <dt>{credit.role}</dt>
                    <dd>{credit.name}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {broadcast.length ? (
              <dl className={styles.creditList}>
                <CreditHead label="Broadcast" cut={firstCredits === "broadcast"} />
                {broadcast.map((item) => (
                  <div key={`${item.track}-${item.station}`} className={styles.creditRow}>
                    <dt>{item.station}</dt>
                    <dd>{item.track}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {personnel.length ? (
              <dl className={styles.creditList}>
                <CreditHead label="Recording personnel" cut={firstCredits === "personnel"} />
                {personnel.map((person) => (
                  <div key={person.name} className={styles.creditRow}>
                    <dt>{person.role}</dt>
                    <dd>{person.name}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Archive */}
      <section className={styles.archive} aria-label="More from the archive">
        <h2 className={`meta ${styles.sectionHead}`}>
          <span>{marker("archive")}</span>
          <span>Archive</span>
        </h2>

        {others.length ? (
          <ol className={styles.others} aria-label="Other releases">
            {others.map((other, i) => (
              <li key={other.id}>
                <Link href={`/music/${other.id}`} className={styles.otherRow}>
                  <span className={styles.otherNo}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={styles.otherTitle}>{other.title}</span>
                  <span className={styles.otherMeta}>
                    {other.type} — {other.year}
                  </span>
                  <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ol>
        ) : null}

        <div className={styles.archiveLinks}>
          <Link href="/music" className="action-link">
            Discography <span className="arrow" aria-hidden="true">→</span>
          </Link>
          <Link href="/merch" className="action-link">
            Merch <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
