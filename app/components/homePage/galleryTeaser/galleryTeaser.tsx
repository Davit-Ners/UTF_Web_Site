import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { IMAGE_BLUR_DATA_URL } from "@/app/lib/imageOptimization";
import styles from "./galleryTeaser.module.css";

/*
 * 2048px originals. Each has the same thin border baked in; `trim` scales it
 * out of frame. `position` is the focal point for the crop of each slot.
 * `sizes` are larger than the slots because cover-cropping landscape photos
 * into portrait frames renders them wider than the box.
 */
const PHOTOS = {
  lead: {
    src: "/gallery/dav1.jpg",
    alt: "Guitarist with his head thrown back under blue and amber stage light",
    position: "18% 40%",
  },
  side: {
    src: "/gallery/val1.jpg",
    alt: "Bassist singing into the microphone in blue light",
    position: "48% 30%",
  },
  low: {
    src: "/gallery/band2.jpg",
    alt: "Singer headbanging in red light, guitarist and drums behind",
    position: "50% 35%",
  },
};

const TRIM = 1.04;

type Slot = keyof typeof PHOTOS;

function Photo({ slot, sizes }: { slot: Slot; sizes: string }) {
  const photo = PHOTOS[slot];
  return (
    <figure
      className={`${styles.photo} ${styles[slot]}`}
      style={{ "--focus": photo.position, "--trim": TRIM } as CSSProperties}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        className={styles.image}
        placeholder="blur"
        blurDataURL={IMAGE_BLUR_DATA_URL}
      />
    </figure>
  );
}

export default function GalleryTeaser() {
  return (
    <section className={styles.gallery} aria-labelledby="gallery-title">
      <p className={`meta ${styles.index}`}>04 — Gallery</p>

      <Photo slot="lead" sizes="(max-width: 900px) 200vw, 70vw" />
      <Photo slot="side" sizes="(max-width: 900px) 125vw, 45vw" />

      <h2 id="gallery-title" className={styles.title}>
        Gallery
      </h2>
      <Photo slot="low" sizes="(max-width: 900px) 96vw, 56vw" />

      <Link href="/gallery" className={`action-link on-bone ${styles.more}`}>
        View gallery <span className="arrow" aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
