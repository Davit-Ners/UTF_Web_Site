import styles from "./discographySection.module.css";
import type { Release } from "@/app/lib/music";
import Image from "next/image";
import Link from "next/link";
import { IMAGE_BLUR_DATA_URL } from "@/app/lib/imageOptimization";

type Props = { releases: Release[] };

export default function DiscographySection({ releases }: Props) {
    return (
        <div className={styles.grid}>
        {releases.map((release) => (
            <article key={release.id} className={`card ${styles.card}`}>
            <div className={styles.cover}>
                <Image
                src={release.cover}
                alt={release.title}
                fill
                sizes="(max-width: 768px) 40vw, 200px"
                placeholder="blur"
                blurDataURL={IMAGE_BLUR_DATA_URL}
                />
            </div>
            <div className={styles.body}>
                <span className={styles.type}>
                {release.type} - {release.year}
                </span>
                <h3 className={styles.title}>{release.title}</h3>
                {release.subtitle && (
                <p className={styles.subtitle}>{release.subtitle}</p>
                )}
                <p className={styles.blurb}>{release.blurb}</p>

                <div className={styles.actions}>
                {release.spotifyUrl && (
                    <a
                    href={release.spotifyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.linkPrimary}
                    >
                    Listen Now
                    </a>
                )}
                <Link
                    href={`/music/${release.id}`}
                    className={styles.linkSecondary}
                >
                    View Release
                </Link>
                </div>
            </div>
            </article>
        ))}
        </div>
    );
};
