import Image from "next/image";
import Link from "next/link";
import styles from "./music.module.css";
import { discography, latestRelease } from "@/app/lib/music";

const fanRefs = ["Trivium", "As I Lay Dying", "Arch Enemy"];

const bandCredits = [
  { label: "Vocals", value: "Krys Bader" },
  { label: "Lead Guitar", value: "Davit Nersesyan" },
  { label: "Rhythm Guitar", value: "Kevin Etsrada" },
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
  ].filter((item): item is { label: string; href: string } => Boolean(item.href));
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
              <h1 className={styles.heroTitle}>Recorded to land as hard as the live set.</h1>
              <p className={styles.heroText}>{latestRelease.blurb}</p>

              <div className={styles.heroStats}>
                <div className={styles.heroStat}>
                  <span className={styles.statLabel}>Release</span>
                  <strong className={styles.statValue}>{latestRelease.title}</strong>
                </div>
                <div className={styles.heroStat}>
                  <span className={styles.statLabel}>Format</span>
                  <strong className={styles.statValue}>
                    {latestRelease.type} · {latestRelease.year}
                  </strong>
                </div>
                <div className={styles.heroStat}>
                  <span className={styles.statLabel}>Tracks</span>
                  <strong className={styles.statValue}>
                    {latestRelease.tracks?.length ?? 0} cuts
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
                    Listen now
                  </a>
                )}
                <a href="#current-chapter" className={styles.secondaryLink}>
                  Explore the record
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
                  <span className={styles.coverKicker}>Current chapter</span>
                  <strong className={styles.coverTitle}>{latestRelease.title}</strong>
                  <span className={styles.coverSubtitle}>
                    {latestRelease.subtitle} · {latestRelease.year}
                  </span>
                </div>
              </div>

              <div className={styles.visualNoteCard}>
                <span className={styles.visualNoteKicker}>Inside the record</span>
                <div className={styles.visualNoteRows}>
                  {latestRelease.highlightTrack && (
                    <div className={styles.visualNoteRow}>
                      <span>Lead track</span>
                      <strong>{latestRelease.highlightTrack}</strong>
                    </div>
                  )}
                  <div className={styles.visualNoteRow}>
                    <span>Streaming</span>
                    <strong>All platforms</strong>
                  </div>
                  <div className={styles.visualNoteRow}>
                    <span>Release year</span>
                    <strong>{latestRelease.year}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.releaseSection} id="current-chapter">
        <div className="container">
          <div className={styles.releaseShell}>
            <div className={styles.releaseLead}>
              <span className={styles.sectionEyebrow}>Current chapter</span>
              <h2 className={styles.sectionTitle}>{latestRelease.title}</h2>
              <p className={styles.releaseStory}>
                {latestRelease.story ??
                  "A first full statement built around pressure, melody and songs that still make sense once they leave the rehearsal room."}
              </p>

              {latestRelease.highlightTrack && (
                <div className={styles.highlightTrack}>
                  <span className={styles.highlightLabel}>Highlight track</span>
                  <strong className={styles.highlightValue}>{latestRelease.highlightTrack}</strong>
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
                        {track.isSingle && <span className={styles.trackBadge}>Single</span>}
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
                <span className={styles.panelMeta}>Every major platform</span>
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
                    <span className={styles.streamArrow}>↗</span>
                  </a>
                ))}
              </div>

              <div className={styles.listenFooter}>
                <p className={styles.listenFooterText}>
                  Add it to a playlist, send it to a friend, then come catch it live.
                </p>
                <Link href="/concerts" className={styles.secondaryLink}>
                  See the live side
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
                <span className={styles.sectionEyebrow}>Catalogue</span>
                <h2 className={styles.sectionTitle}>Current release cycle</h2>
              </div>
              {/* <p className={styles.catalogueText}>
                The catalogue is still compact, so the page focuses on the record
                that defines the project right now instead of faking a bigger archive.
              </p> */}
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
                        {release.type} · {release.year}
                      </span>
                      <h3 className={styles.releaseCardTitle}>{release.title}</h3>
                      {release.subtitle && (
                        <p className={styles.releaseCardSubtitle}>{release.subtitle}</p>
                      )}
                      <p className={styles.releaseCardText}>{release.blurb}</p>
                      <Link href={`/music/${release.id}`} className={styles.inlineLink}>
                        Open details
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
                        <strong className={styles.creditValue}>{item.value}</strong>
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
                        <strong className={styles.creditValue}>{item.value}</strong>
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
