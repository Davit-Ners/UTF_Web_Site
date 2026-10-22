"use client";

import Image from "next/image";
import { PhotoTrigger, PhotoViewer, type ViewerPhoto } from "@/app/components/photoViewer/photoViewer";
import type { GalleryPhoto } from "@/app/lib/gallery";
import styles from "./showDossier.module.css";

type Props = {
  photos: GalleryPhoto[];
  /* "Arlon, 01.11.2025" */
  context: string;
};

export default function ShowPhotos({ photos, context }: Props) {
  const total = photos.length;
  const pad = (n: number) => String(n).padStart(2, "0");
  const viewerPhotos: ViewerPhoto[] = photos.map((photo, i) => ({
    src: photo.src,
    label: `${context}, photo ${i + 1} of ${total}: ${photo.alt}`,
    caption: `${context} — ${pad(i + 1)} / ${pad(total)}`,
  }));

  return (
    <PhotoViewer photos={viewerPhotos}>
      <div className={styles.photoSequence}>
        {photos.map((photo, i) => (
          <PhotoTrigger
            key={photo.id}
            index={i}
            className={`${styles.photoButton} ${styles[`photo${Math.min(i, 2)}`]}`}
          >
            <Image
              src={photo.src}
              alt=""
              width={photo.width}
              height={photo.height}
              sizes={i === 0 ? "100vw" : "(max-width: 900px) 84vw, 45vw"}
              className={`${styles.photoImage} ${photo.bakedBorder ? styles.trimmed : ""}`}
            />
          </PhotoTrigger>
        ))}
      </div>
    </PhotoViewer>
  );
}
