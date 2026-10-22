"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { getOriginalImagePath } from "@/app/lib/imageOptimization";
import type { ShowPhoto } from "@/app/lib/concertPhotos";
import styles from "./showDossier.module.css";

type Props = {
  photos: ShowPhoto[];
  /* "Arlon, 01.11.2025" */
  context: string;
};

export default function ShowPhotos({ photos, context }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [index, setIndex] = useState<number | null>(null);
  const total = photos.length;

  const label = (i: number) => `${context}, photo ${i + 1} of ${total}: ${photos[i].description}`;

  const open = (i: number, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setIndex(i);
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (index !== null && dialog && !dialog.open) dialog.showModal();
  }, [index]);

  const step = (delta: number) => setIndex((i) => (i === null ? i : (i + delta + total) % total));

  return (
    <>
      <div className={styles.photoSequence}>
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            className={`${styles.photoButton} ${styles[`photo${Math.min(i, 2)}`]}`}
            onClick={(e) => open(i, e.currentTarget)}
            aria-label={`Open ${label(i)}`}
          >
            {/* width/height only seed the box; the photo keeps its own ratio */}
            <Image
              src={getOriginalImagePath(photo.src)}
              alt=""
              width={2048}
              height={1365}
              sizes={i === 0 ? "100vw" : "(max-width: 900px) 84vw, 45vw"}
              className={styles.photoImage}
            />
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className={styles.viewer}
        aria-label={index === null ? "Photo viewer" : label(index)}
        onClose={() => {
          setIndex(null);
          triggerRef.current?.focus();
        }}
        onKeyDown={(e) => {
          if (total < 2) return;
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialogRef.current?.close();
        }}
      >
        {index !== null ? (
          <>
            <div className={styles.viewerFrame}>
              <Image
                src={getOriginalImagePath(photos[index].src)}
                alt={label(index)}
                fill
                sizes="100vw"
                className={styles.viewerImage}
              />
            </div>
            <div className={styles.viewerBar}>
              <p className={styles.viewerCaption} aria-live="polite">
                {context} — {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </p>
              <div className={styles.viewerControls}>
                {total > 1 ? (
                  <>
                    <button type="button" onClick={() => step(-1)} className={styles.viewerButton}>
                      ← Previous
                    </button>
                    <button type="button" onClick={() => step(1)} className={styles.viewerButton}>
                      Next →
                    </button>
                  </>
                ) : null}
                <button type="button" onClick={() => dialogRef.current?.close()} className={styles.viewerButton} autoFocus>
                  Close
                </button>
              </div>
            </div>
          </>
        ) : null}
      </dialog>
    </>
  );
}
