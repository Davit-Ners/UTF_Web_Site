"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./gallery.module.css";
import GalleryLightbox from "../components/gallery/galleryLightBox/galleryLightBox";
import { allConcertPhotos, galleryHeroPhotos, type GalleryPhoto } from "../lib/gallery";
import { IMAGE_BLUR_DATA_URL } from "../lib/imageOptimization";

export default function GalleryClient() {
  const [active, setActive] = useState<GalleryPhoto | null>(null);
  const [leadPhoto, secondaryA, secondaryB] = galleryHeroPhotos;

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroShell}>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}>Gallery</span>
              <h1 className={styles.heroTitle}>Live shots from the floor.</h1>
              <p className={styles.heroText}>
                Stage shots, crowd pressure and live moments from Until They Fall
                shows.
              </p>

              <div className={styles.heroMeta}>
                <span className={styles.metaPill}>{allConcertPhotos.length} live shots</span>
                <span className={styles.metaPill}>Clubs + festivals</span>
                <span className={styles.metaPill}>Full screen</span>
              </div>

              <div className={styles.heroActions}>
                <Link href="/gallery/concert-photos" className="button">
                  View Full Archive
                </Link>
                <Link href="/concerts" className={styles.secondaryLink}>
                  See Live Dates
                </Link>
              </div>
            </div>

            <div className={styles.heroVisual}>
              {[leadPhoto, secondaryA, secondaryB].map((photo, index) => (
                <button
                  key={photo.id}
                  type="button"
                  className={`${styles.heroShot} ${index === 0 ? styles.heroShotLead : ""}`}
                  onClick={() => setActive(photo)}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    quality={90}
                    sizes="(max-width: 700px) 100vw, (max-width: 960px) 100vw, 42vw"
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR_DATA_URL}
                  />
                  <div className={styles.heroShotOverlay} />
                  <div className={styles.heroShotMeta}>
                    {photo.caption && <strong>{photo.caption}</strong>}
                    {photo.meta && <span>{photo.meta}</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.canvasSection}>
        <div className="container">
          <div className={styles.canvasShell}>
            <div className={styles.canvasHead}>
              <div>
                <span className={styles.sectionEyebrow}>Selection</span>
                <h2 className={styles.canvasTitle}>Stage, sweat, release.</h2>
              </div>
            </div>

            <div className={styles.photoWall}>
              {allConcertPhotos.map((photo) => (
                <button
                  key={photo.id}
                  type="button"
                  className={styles.wallItem}
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
                  <div className={styles.wallOverlay} />
                  <div className={styles.wallMeta}>
                    {photo.caption && <strong>{photo.caption}</strong>}
                    {photo.meta && <span>{photo.meta}</span>}
                  </div>
                </button>
              ))}
            </div>

            <div className={styles.canvasFoot}>
              <p className={styles.canvasNote}>
                More live photos from clubs, festivals and release shows.
              </p>
              <Link href="/gallery/concert-photos" className={styles.inlineLink}>
                View All Concert Photos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {active && <GalleryLightbox photo={active} onClose={() => setActive(null)} />}
    </main>
  );
}
