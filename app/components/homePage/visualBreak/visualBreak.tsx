import Image from "next/image";
import type { CSSProperties } from "react";
import { IMAGE_BLUR_DATA_URL } from "@/app/lib/imageOptimization";
import styles from "./visualBreak.module.css";

/*
 * Temporary asset: the best available live shot, used at its 2048px source size.
 * It has a thin border baked in, trimmed by `trim`; the photographer's signature
 * stays visible. Set `credit` once the name is confirmed.
 */
const BREAK_IMAGE = {
  src: "/gallery/band1.jpg",
  width: 2048,
  height: 1329,
  alt: "Until They Fall live: the singer screams into the microphone, two guitarists behind him in orange stage light",
  positionMobile: "70% 50%",
  trim: 1.045,
  credit: undefined as string | undefined,
};

export default function VisualBreak() {
  const vars = {
    "--break-ratio": `${BREAK_IMAGE.width} / ${BREAK_IMAGE.height}`,
    "--break-position-mobile": BREAK_IMAGE.positionMobile,
    "--break-trim": BREAK_IMAGE.trim,
  } as CSSProperties;

  return (
    <section className={styles.break} style={vars} aria-label="Until They Fall live">
      <div className={styles.frame}>
        <Image
          src={BREAK_IMAGE.src}
          alt={BREAK_IMAGE.alt}
          fill
          // On mobile the frame is 4:5, so the trimmed photo renders about 2.1x the viewport width
          sizes="(max-width: 720px) 215vw, 104vw"
          className={styles.photo}
          placeholder="blur"
          blurDataURL={IMAGE_BLUR_DATA_URL}
        />
      </div>
      {BREAK_IMAGE.credit ? (
        <p className={`meta ${styles.credit}`}>Photo — {BREAK_IMAGE.credit}</p>
      ) : null}
    </section>
  );
}
