"use client";

import { useEffect } from "react";
import Image from "next/image";
import styles from "./galleryLightbox.module.css";
import { GalleryPhoto } from "../galleryStrip/galleryStrip";

type Props = {
  photo: GalleryPhoto;
  onClose: () => void;
};

export default function GalleryLightbox({ photo, onClose }: Props) {
    // Close on ESC
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
        if (e.key === "Escape") onClose();
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
        if (e.target === e.currentTarget) {
        onClose();
        }
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
            ✕
            </button>

            <div className={styles.imageWrap}>
            <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="100vw"
            />
            </div>

            {(photo.caption || photo.meta) && (
            <div className={styles.footer}>
                {photo.caption && (
                <p className={styles.caption}>{photo.caption}</p>
                )}
                {photo.meta && <p className={styles.meta}>{photo.meta}</p>}
            </div>
            )}
        </div>
        </div>
    );
};
