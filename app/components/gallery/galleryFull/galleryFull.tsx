"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./galleryFull.module.css";
import { GalleryPhoto } from "../galleryStrip/galleryStrip";
import GalleryLightbox from "../galleryLightBox/galleryLightBox";

type Props = {
  title: string;
  subtitle?: string;
  photos: GalleryPhoto[];
};

export default function GalleryFull({ title, subtitle, photos }: Props) {
    const [active, setActive] = useState<GalleryPhoto | null>(null);

    return (
        <>
        <section className={styles.section}>
            <div className="container">
            <header className={styles.header}>
                <h1 className={styles.title}>{title}</h1>
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </header>

            <div className={styles.gallery}>
                {photos.map((photo) => (
                <button
                    key={photo.id}
                    type="button"
                    className={styles.item}
                    onClick={() => setActive(photo)}
                >
                    <div className={styles.imageWrap}>
                    <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(max-width: 768px) 50vw, 280px"
                    />
                    </div>
                    {(photo.caption || photo.meta) && (
                    <div className={styles.captionBlock}>
                        {photo.caption && (
                        <p className={styles.caption}>{photo.caption}</p>
                        )}
                        {photo.meta && (
                        <p className={styles.meta}>{photo.meta}</p>
                        )}
                    </div>
                    )}
                </button>
                ))}
            </div>
            </div>
        </section>

        {active && (
            <GalleryLightbox photo={active} onClose={() => setActive(null)} />
        )}
        </>
    );
};
