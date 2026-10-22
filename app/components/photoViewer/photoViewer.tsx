"use client";

import Image from "next/image";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./photoViewer.module.css";

export type ViewerPhoto = {
  src: string;
  /* Full accessible description, e.g. "Photo 3 of 8: lead guitarist …, Live" */
  label: string;
  /* Visible caption line in the viewer bar */
  caption: string;
};

type OpenFn = (index: number, trigger: HTMLElement) => void;

const ViewerContext = createContext<{ open: OpenFn; photos: ViewerPhoto[] } | null>(null);

/* One dialog for every trigger inside; navigation follows the order of `photos` */
export function PhotoViewer({ photos, children }: { photos: ViewerPhoto[]; children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const total = photos.length;

  const open: OpenFn = (i, trigger) => {
    triggerRef.current = trigger;
    setIndex(i);
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (index !== null && dialog && !dialog.open) {
      dialog.showModal();
      closeRef.current?.focus();
    }
  }, [index]);

  const go = (next: number) => setIndex(Math.max(0, Math.min(total - 1, next)));
  const step = (delta: number) => setIndex((i) => (i === null ? i : (i + delta + total) % total));
  const current = index === null ? null : photos[index];

  return (
    <ViewerContext.Provider value={{ open, photos }}>
      {children}

      <dialog
        ref={dialogRef}
        className={styles.viewer}
        aria-label={current ? current.label : "Photo viewer"}
        onClose={() => {
          setIndex(null);
          triggerRef.current?.focus();
        }}
        onKeyDown={(e) => {
          if (total < 2) return;
          if (e.key === "ArrowRight") step(1);
          else if (e.key === "ArrowLeft") step(-1);
          else if (e.key === "Home") go(0);
          else if (e.key === "End") go(total - 1);
          else return;
          e.preventDefault();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialogRef.current?.close();
        }}
      >
        {current ? (
          <>
            <div className={styles.frame}>
              <Image src={current.src} alt={current.label} fill sizes="100vw" className={styles.image} />
            </div>
            <div className={styles.bar}>
              <p className={styles.caption} aria-live="polite">
                {current.caption}
              </p>
              <div className={styles.controls}>
                {total > 1 ? (
                  <>
                    <button type="button" onClick={() => step(-1)} className={styles.button}>
                      ← Previous
                    </button>
                    <button type="button" onClick={() => step(1)} className={styles.button}>
                      Next →
                    </button>
                  </>
                ) : null}
                <button ref={closeRef} type="button" onClick={() => dialogRef.current?.close()} className={styles.button}>
                  Close
                </button>
              </div>
            </div>
          </>
        ) : null}
      </dialog>
    </ViewerContext.Provider>
  );
}

/* A button that opens photo `index` in the surrounding PhotoViewer */
export function PhotoTrigger({
  index,
  className,
  children,
}: {
  index: number;
  className?: string;
  children: ReactNode;
}) {
  const ctx = useContext(ViewerContext);
  if (!ctx) throw new Error("PhotoTrigger must be inside PhotoViewer");
  return (
    <button
      type="button"
      className={className}
      onClick={(e) => ctx.open(index, e.currentTarget)}
      aria-label={`Open ${ctx.photos[index].label}`}
    >
      {children}
    </button>
  );
}
