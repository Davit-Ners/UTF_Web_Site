import type { Metadata } from "next";
import ReleaseSleeve from "@/app/components/music/releaseSleeve/releaseSleeve";
import { discography } from "@/app/lib/music";
import styles from "./music.module.css";

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

export default function MusicPage() {
  const releases = [...discography].sort((a, b) =>
    (b.releaseDate ?? String(b.year)).localeCompare(a.releaseDate ?? String(a.year))
  );
  const count = String(releases.length).padStart(2, "0");

  return (
    <main className={styles.page}>
      <header className={styles.masthead}>
        <h1 className={styles.title}>Music</h1>
        <p className={`meta ${styles.count}`}>
          Discography — {count} {releases.length === 1 ? "release" : "releases"}
        </p>
      </header>

      {/* A table of contents only earns its place once there is more than one release */}
      {releases.length > 1 ? (
        <nav className={styles.index} aria-label="Releases">
          <ol>
            {releases.map((release, i) => (
              <li key={release.id}>
                <a href={`#${release.id}`} className={styles.indexRow}>
                  <span className={styles.indexNo}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={styles.indexTitle}>{release.title}</span>
                  <span className={styles.indexMeta}>
                    {release.type} — {release.year}
                  </span>
                  <span className={styles.indexArrow} aria-hidden="true">↓</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      {releases.map((release, i) => (
        <ReleaseSleeve key={release.id} release={release} mirrored={i % 2 === 1} />
      ))}
    </main>
  );
}
