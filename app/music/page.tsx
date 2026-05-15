import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import styles from "./music.module.css";
import { discography, latestRelease } from "@/app/lib/music";

export const metadata: Metadata = {
  title: "Music",
  description:
    "Listen to Sent To Die by Until They Fall, a Brussels melodic death metal band blending aggressive riffs, atmospheric melodies and modern metal tension.",
  alternates: {
    canonical: "/music",
  },
  openGraph: {
    title: "Music | Until They Fall",
    description:
      "Sent To Die is the debut album from Brussels melodic death metal band Until They Fall.",
    url: "/music",
    images: [
      {
        url: "/album-cover.jpg",
        width: 1200,
        height: 1200,
        alt: "Sent To Die album cover",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Music | Until They Fall",
    description:
      "Listen to Sent To Die, the debut album from Brussels melodic death metal band Until They Fall.",
    images: ["/album-cover.jpg"],
  },
};

const fanRefs = ["melodic death metal", "metalcore tension", "technical edge"];

const bandCredits = [
  { label: "Vocals", value: "Krys Bader" },
  { label: "Lead Guitar", value: "Davit Nersesyan" },
  { label: "Rhythm Guitar", value: "Kevin Estrada" },
  { label: "Bass", value: "Valentin Coutant" },
  { label: "Drums", value: "Sabari Diakite" },
];

const productionCredits = [
  { label: "Produced by", value: "Yarne Heylen" },
  { label: "Mixed by", value: "Yarne Heylen" },
  { label: "Mastered by", value: "Yarne Heylen" },
  { label: "Artwork", value: "Until They Fall" },
];

function getStreamLinks() {
  return [
    { label: "Spotify", href: latestRelease.spotifyUrl },
    { label: "Apple Music", href: latestRelease.appleMusicUrl },
    { label: "YouTube Music", href: latestRelease.youtubeMusicUrl },
    { label: "Bandcamp", href: latestRelease.bandcampUrl },
  ].filter((item): item is { label: string; href: string } =>
    Boolean(item.href)
  );
}

export default function MusicPage() {
  const streamLinks = getStreamLinks();

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroShell}>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}>Music</span>
              <h1 className={styles.heroTitle}>
                Recorded heavy. Written for the stage.
              </h1>
              <p className={styles.heroText}>
                Until They Fall turns melodic death metal, metalcore tension and
                technical edge into songs built around pressure, melody and
                release.
              </p>

              <div className={styles.heroStats}>
                <div className={styles.heroStat}>
                  <span className={styles.statLabel}>Debut album</span>
                  <strong className={styles.statValue}>
                    {latestRelease.title}
                  </strong>
                </div>
                <div className={styles.heroStat}>
                  <span className={styles.statLabel}>Released</span>
                  <strong className={styles.statValue}>
                    December 1, {latestRelease.year}
                  </strong>
                </div>
                <div className={styles.heroStat}>
                  <span className={styles.statLabel}>Recorded at</span>
                  <strong className={styles.statValue}>
                    Project Zero Studio
                  </strong>
                </div>
              </div>

              <div className={styles.heroActions}>
                {latestRelease.spotifyUrl && (
                  <a
                    href={latestRelease.spotifyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="button"
                  >
                    Listen Now
                  </a>
                )}
                <a href="#record" className={styles.secondaryLink}>
                  Read About The Record
                </a>
              </div>

              <p className={styles.fansLine}>
                <span>For fans of</span> {fanRefs.join(" / ")}
              </p>
            </div>

            <div className={styles.heroVisual}>
              <div className={styles.visualAmbient}>
                <div className={styles.visualBackdrop}>
                  <Image
                    src={latestRelease.cover}
                    alt={`${latestRelease.title} artwork backdrop`}
                    fill
                    sizes="(max-width: 960px) 100vw, 38vw"
                  />
                </div>
                <Image
                  src={latestRelease.cover}
                  alt={`${latestRelease.title} artwork glow`}
                  fill
                  sizes="(max-width: 960px) 100vw, 38vw"
                  className={styles.visualBlur}
                />
                <div className={styles.visualGrid} />
              </div>

              <div className={styles.visualCoverCard}>
                <div className={styles.coverImageWrap}>
                  <Image
                    src={latestRelease.cover}
                    alt={latestRelease.title}
                    fill
                    sizes="(max-width: 960px) 52vw, 22vw"
                  />
                </div>
                <div className={styles.coverMeta}>
                  <span className={styles.coverKicker}>Debut album</span>
                  <strong className={styles.coverTitle}>
                    {latestRelease.title}
                  </strong>
                  <span className={styles.coverSubtitle}>
                    {latestRelease.subtitle} - {latestRelease.year}
                  </span>
                </div>
              </div>

              <div className={styles.visualNoteCard}>
                <span className={styles.visualNoteKicker}>
                  Inside the record
                </span>
                <div className={styles.visualNoteRows}>
                  {latestRelease.highlightTrack && (
                    <div className={styles.visualNoteRow}>
                      <span>Lead track</span>
                      <strong>{latestRelease.highlightTrack}</strong>
                    </div>
                  )}
                  <div className={styles.visualNoteRow}>
                    <span>Sound</span>
                    <strong>Brutal, melodic, atmospheric</strong>
                  </div>
                  <div className={styles.visualNoteRow}>
                    <span>Airplay</span>
                    <strong>Classic 21 / Radio Panik</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.releaseSection} id="record">
        <div className="container">
          <div className={styles.releaseShell}>
            <div className={styles.releaseLead}>
              <span className={styles.sectionEyebrow}>Sent To Die</span>
              <h2 className={styles.sectionTitle}>{latestRelease.title}</h2>
              <p className={styles.releaseStory}>
                {latestRelease.story ??
                  "A first full statement built around collapse, resistance and the will to rise again."}
              </p>

              {latestRelease.highlightTrack && (
                <div className={styles.highlightTrack}>
                  <span className={styles.highlightLabel}>Lead track</span>
                  <strong className={styles.highlightValue}>
                    {latestRelease.highlightTrack}
                  </strong>
                </div>
              )}

              {latestRelease.recordingNotes?.length ? (
                <div className={styles.notesList}>
                  {latestRelease.recordingNotes.map((note) => (
                    <p key={note} className={styles.noteItem}>
                      {note}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>

            <div className={styles.trackPanel}>
              <div className={styles.panelHeader}>
                <span className={styles.panelKicker}>Tracklist</span>
                <span className={styles.panelMeta}>
                  {latestRelease.tracks?.length ?? 0} tracks
                </span>
              </div>

              <div className={styles.trackList}>
                {latestRelease.tracks?.map((track, index) => (
                  <div key={track.id} className={styles.trackRow}>
                    <span className={styles.trackIndex}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className={styles.trackBody}>
                      <div className={styles.trackTitleRow}>
                        <span className={styles.trackTitle}>{track.title}</span>
                        {track.isSingle && (
                          <span className={styles.trackBadge}>Single</span>
                        )}
                      </div>
                      <span className={styles.trackLength}>{track.length}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.listenPanel}>
              <div className={styles.panelHeader}>
                <span className={styles.panelKicker}>Listen</span>
                <span className={styles.panelMeta}>Out now</span>
              </div>

              <div className={styles.streamList}>
                {streamLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.streamLink}
                  >
                    <span>{item.label}</span>
                    <span className={styles.streamArrow}>-&gt;</span>
                  </a>
                ))}
              </div>

              <div className={styles.listenFooter}>
                <p className={styles.listenFooterText}>
                  Play it loud, then come hear the songs in the room.
                </p>
                <Link href="/concerts" className={styles.secondaryLink}>
                  See Live Dates
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.catalogueSection}>
        <div className="container">
          <div className={styles.catalogueShell}>
            <div className={styles.catalogueHead}>
              <div>
                <span className={styles.sectionEyebrow}>Discography</span>
                <h2 className={styles.sectionTitle}>
                  The first full-length record.
                </h2>
              </div>
            </div>

            <div className={styles.catalogueBody}>
              <div className={styles.catalogueRail}>
                {discography.map((release) => (
                  <article key={release.id} className={styles.releaseCard}>
                    <div className={styles.releaseCardCover}>
                      <Image
                        src={release.cover}
                        alt={release.title}
                        fill
                        sizes="(max-width: 960px) 100vw, 18vw"
                      />
                    </div>
                    <div className={styles.releaseCardBody}>
                      <span className={styles.releaseCardMeta}>
                        {release.type} - {release.year}
                      </span>
                      <h3 className={styles.releaseCardTitle}>
                        {release.title}
                      </h3>
                      {release.subtitle && (
                        <p className={styles.releaseCardSubtitle}>
                          {release.subtitle}
                        </p>
                      )}
                      <p className={styles.releaseCardText}>{release.blurb}</p>
                      <Link
                        href={`/music/${release.id}`}
                        className={styles.inlineLink}
                      >
                        View Release
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              <div className={styles.creditPanel}>
                <div className={styles.creditBlock}>
                  <span className={styles.panelKicker}>Band</span>
                  <div className={styles.creditList}>
                    {bandCredits.map((item) => (
                      <div key={item.label} className={styles.creditRow}>
                        <span className={styles.creditLabel}>{item.label}</span>
                        <strong className={styles.creditValue}>
                          {item.value}
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.creditBlock}>
                  <span className={styles.panelKicker}>Production</span>
                  <div className={styles.creditList}>
                    {productionCredits.map((item) => (
                      <div key={item.label} className={styles.creditRow}>
                        <span className={styles.creditLabel}>{item.label}</span>
                        <strong className={styles.creditValue}>
                          {item.value}
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
