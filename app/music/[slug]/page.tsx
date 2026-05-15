import { notFound } from "next/navigation";
import styles from "./releasePage.module.css";
import { getReleaseBySlug, getOtherReleases } from "@/app/lib/music";
import SectionHeading from "@/app/components/sectionHeading/sectionHeading";
import Link from "next/link";
import FeaturedRelease from "@/app/components/music/musicFeaturedRelease/musicFeaturedRelease";
import TracklistCard from "@/app/components/music/trackList/trackList";
import StreamingRow from "@/app/components/music/streamingRow/streamingRow";
import DiscographySection from "@/app/components/music/discographySection/discographySection";

type Props = {
    params: { slug: string };
};

export default async function ReleasePage({ params }: Props) {
    const { slug } = await params;
    const release = getReleaseBySlug(slug);

    if (!release) return notFound();

    const others = getOtherReleases(slug);

    return (
        <main className={styles.page}>
        <section className={styles.breadcrumbWrap}>
            <div className="container">
            <nav className={styles.breadcrumb}>
                <Link href="/music">Music</Link>
                <span className={styles.sep}>/</span>
                <span className={styles.current}>{release.title}</span>
            </nav>
            </div>
        </section>

        <section className={styles.heroSection}>
            <div className="container">
            <FeaturedRelease release={release} />
            </div>
        </section>

        <section className={styles.section}>
            <div className="container">
            <div className={styles.split}>
                {release.tracks && (
                <TracklistCard release={release} />
                )}
                <StreamingRow release={release} />

                <div className={`card ${styles.storyCard}`}>
                <h3 className={styles.storyTitle}>Story</h3>
                {release.story ? (
                    <p className={styles.storyText}>{release.story}</p>
                ) : (
                    <p className={styles.storyText}>
                    A focused release built around pressure, melody and the will
                    to rise again.
                    </p>
                )}

                {release.recordingNotes && (
                    <ul className={styles.notesList}>
                    {release.recordingNotes.map((note, i) => (
                        <li key={i}>{note}</li>
                    ))}
                    </ul>
                )}

                <div className={styles.storyCta}>
                    <Link href="/booking" className="button">
                    Book The Band
                    </Link>
                </div>
                </div>
            </div>
            </div>
        </section>

        <section className={styles.section}>
            <div className="container">
            <div className={`card ${styles.merchCta}`}>
                <div>
                <span className={styles.merchEyebrow}>Merch</span>
                <h2 className={styles.merchTitle}>Support the record</h2>
                <p className={styles.merchText}>
                    Grab the CD, hoodie or stickers from the Sent To Die era and
                    support the band directly.
                </p>
                </div>
                <div className={styles.merchActions}>
                <Link href="/merch" className="button">
                    Enter The Store
                </Link>
                </div>
            </div>
            </div>
        </section>

        {others.length > 0 && (
            <section className={styles.section}>
            <div className="container">
                <SectionHeading
                eyebrow="More music"
                title="Other releases"
                variant="subtle"
                align="left"
                />
                <DiscographySection releases={others} />
            </div>
            </section>
        )}
        </main>
    );
};
