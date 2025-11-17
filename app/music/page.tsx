import styles from "./music.module.css";
import { latestRelease, discography } from "@/app/lib/music";
import SectionHeading from "@/app/components/sectionHeading/sectionHeading";
import MusicHero from "../components/music/musicHero/musicHero";
import FeaturedRelease from "../components/music/musicFeaturedRelease/musicFeaturedRelease";
import TracklistCard from "../components/music/trackList/trackList";
import StreamingRow from "../components/music/streamingRow/streamingRow";
import DiscographySection from "../components/music/discographySection/discographySection";
import MusicCredits from "../components/music/musicCredits/musicCredits";

export default function MusicPage() {
    return (
        <main className={styles.page}>
        <MusicHero />

        <section className={styles.section}>
            <div className="container">
            <FeaturedRelease release={latestRelease} />

            {latestRelease.tracks && (
                <div className={styles.split}>
                <TracklistCard release={latestRelease} />
                <StreamingRow release={latestRelease} />
                </div>
            )}
            </div>
        </section>

        <section className={styles.section}>
            <div className="container">
            <SectionHeading
                eyebrow="Catalogue"
                title="Discography"
                subtitle="From the first EP to the latest album — explore everything we’ve released so far."
                variant="default"
                align="left"
            />

            <DiscographySection releases={discography} />
            </div>
        </section>

        <section className={styles.section}>
            <div className="container">
            <SectionHeading
                eyebrow="Behind the record"
                title="Credits & production"
                subtitle="Because this album is more than just riffs — it’s a team effort."
                variant="subtle"
                align="left"
            />
            <MusicCredits />
            </div>
        </section>
        </main>
    );
};
