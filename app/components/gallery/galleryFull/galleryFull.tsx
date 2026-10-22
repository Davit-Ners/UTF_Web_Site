"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./galleryFull.module.css";
import GalleryLightbox from "../galleryLightBox/galleryLightBox";
import { IMAGE_BLUR_DATA_URL } from "@/app/lib/imageOptimization";

export type GalleryFullPhoto = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  meta?: string;
};

type Props = {
  title: string;
  subtitle?: string;
  photos: GalleryFullPhoto[];
};

export default function GalleryFull({ title, subtitle, photos }: Props) {
  const [active, setActive] = useState<GalleryFullPhoto | null>(null);

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
                <span className={styles.count}>{photos.length} photos</span>
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
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR_DATA_URL}
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
