"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./gallery.module.css";
import GalleryLightbox from "../components/gallery/galleryLightBox/galleryLightBox";
import { allConcertPhotos, galleryHeroPhotos, type GalleryPhoto } from "../lib/gallery";

export default function GalleryPage() {
  const [active, setActive] = useState<GalleryPhoto | null>(null);
  const [leadPhoto, secondaryA, secondaryB] = galleryHeroPhotos;

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroShell}>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}>Gallery</span>
              <h1 className={styles.heroTitle}>Live frames without the fake magazine layout.</h1>
              <p className={styles.heroText}>
                A tight selection of stage light, sweat, crowd pressure and the
                kind of moments that actually describe the band better than long copy.
              </p>

              <div className={styles.heroMeta}>
                <span className={styles.metaPill}>{allConcertPhotos.length} live shots</span>
                <span className={styles.metaPill}>Clubs + festivals</span>
                <span className={styles.metaPill}>Open full screen</span>
              </div>

              <div className={styles.heroActions}>
                <Link href="/gallery/concert-photos" className="button">
                  Open full archive
                </Link>
                <Link href="/concerts" className={styles.secondaryLink}>
                  See the live dates
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
                    sizes="(max-width: 960px) 100vw, 30vw"
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
                <h2 className={styles.canvasTitle}>A simple wall of real moments.</h2>
              </div>
              <p className={styles.canvasText}>
                No fake categories, no filler. Just the shots that already carry the
                right atmosphere.
              </p>
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
                    sizes="(max-width: 960px) 100vw, 28vw"
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
                Need the full live archive or a cleaner overview of concert shots?
              </p>
              <Link href="/gallery/concert-photos" className={styles.inlineLink}>
                View all concert photos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {active && <GalleryLightbox photo={active} onClose={() => setActive(null)} />}
    </main>
  );
}
