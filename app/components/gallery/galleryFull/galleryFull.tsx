"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./galleryFull.module.css";
import type { GalleryPhoto } from "@/app/lib/gallery";
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
          <div className={styles.shell}>
            <header className={styles.header}>
              <div>
                <span className={styles.eyebrow}>Archive</span>
                <h1 className={styles.title}>{title}</h1>
              </div>

              <div className={styles.headerMeta}>
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                <span className={styles.count}>{photos.length} frames</span>
              </div>
            </header>

            <div className={styles.gallery}>
              {photos.map((photo) => (
                <button
                  key={photo.id}
                  type="button"
                  className={styles.item}
                  onClick={() => setActive(photo)}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    quality={90}
                    sizes="(max-width: 700px) 100vw, (max-width: 960px) 50vw, 33vw"
                  />
                  <div className={styles.overlay} />
                  {(photo.caption || photo.meta) && (
                    <div className={styles.captionBlock}>
                      {photo.caption && <p className={styles.caption}>{photo.caption}</p>}
                      {photo.meta && <p className={styles.meta}>{photo.meta}</p>}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {active && <GalleryLightbox photo={active} onClose={() => setActive(null)} />}
    </>
  );
}
