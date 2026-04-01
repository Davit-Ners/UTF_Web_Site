"use client";

import { useEffect } from "react";
import Image from "next/image";
import styles from "./galleryLightbox.module.css";
import type { GalleryPhoto } from "@/app/lib/gallery";

type Props = {
  photo: GalleryPhoto;
  onClose: () => void;
};

export default function GalleryLightbox({ photo, onClose }: Props) {
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleBackdropClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.dialog}>
        <button
          type="button"
          className={styles.close}
          aria-label="Close"
          onClick={onClose}
        >
          x
        </button>

        <div className={styles.imageWrap}>
          <Image src={photo.src} alt={photo.alt} fill quality={95} sizes="100vw" />
        </div>

        {(photo.caption || photo.meta) && (
          <div className={styles.footer}>
            {photo.caption && <p className={styles.caption}>{photo.caption}</p>}
            {photo.meta && <p className={styles.meta}>{photo.meta}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
