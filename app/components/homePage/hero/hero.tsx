import SignatureOnce from "@/app/components/motion/signatureOnce";
import NewTabLink from "@/app/components/newTabLink";
import Image from "next/image";
import type { CSSProperties } from "react";
import { IMAGE_BLUR_DATA_URL } from "@/app/lib/imageOptimization";
import { latestRelease } from "@/app/lib/music";
import { SHOW_PHOTO_CREDITS } from "@/app/lib/gallery";
import styles from "./hero.module.css";

/*
 * Swap the hero photo here; the layout does not depend on the asset.
 * The current file has a thin border and a signature baked in, so `bleed`
 * scales it from a high `origin` to push both out of frame.
 * For a clean master, set bleed to 1.
 */
const HERO_IMAGE = {
  src: "/bandphoto.jpg",
  alt: "Until They Fall on stage under white beams of light",
  position: "50% 38%",
  positionMobile: "56% 50%",
  bleed: 1.1,
  origin: "50% 28%",
  credit: "Laurent Henoumont",
};

export default function Hero() {
  const imageVars = {
    "--hero-position": HERO_IMAGE.position,
    "--hero-position-mobile": HERO_IMAGE.positionMobile,
    "--hero-bleed": HERO_IMAGE.bleed,
    "--hero-origin": HERO_IMAGE.origin,
  } as CSSProperties;

  return (
    /* Signature: the photo is uncovered (R1 Plate, from first paint), then the wordmark prints into register (R2) */
    <section className={styles.hero} aria-labelledby="hero-title" style={imageVars} data-signature="hero">
      <SignatureOnce name="hero" />
      <div className={`${styles.media} plate plate-load`}>
        <Image
          src={HERO_IMAGE.src}
          alt={HERO_IMAGE.alt}
          fill
          priority
          // object-fit: cover renders the photo wider than the viewport on tall screens
          sizes="(max-aspect-ratio: 7/4) 195vh, 110vw"
          className={styles.photo}
          placeholder="blur"
          blurDataURL={IMAGE_BLUR_DATA_URL}
        />
      </div>
      <div className={styles.scrim} aria-hidden="true" />

      <div className={styles.content}>
        <h1 id="hero-title" className="srOnly">Until They Fall</h1>
        <div className={`${styles.logo} registration`} aria-hidden="true">
          <Image
            src="/optimized/logo-typo.webp"
            alt=""
            width={1200}
            height={772}
            priority
            className={styles.logoImage}
            sizes="(max-width: 720px) 108vw, 50vw"
          />
        </div>

        <p className={`meta ${styles.genre}`}>Melodic death metal — Brussels</p>

        <div className={styles.era}>
          <p className={styles.eraTitle}>{latestRelease.title}</p>
          <p className="meta">
            {latestRelease.type} — {latestRelease.year}
          </p>
        </div>

        <div className={styles.actions}>
          {latestRelease.spotifyUrl ? (
            <NewTabLink href={latestRelease.spotifyUrl} className="action-link">
              Listen <span className="arrow" aria-hidden="true">↗</span>
            </NewTabLink>
          ) : null}
          <a href="#live-reference" className="action-link">
            Watch live <span className="arrow" aria-hidden="true">↓</span>
          </a>
        </div>
      </div>

      {SHOW_PHOTO_CREDITS && HERO_IMAGE.credit ? (
        <p className={`meta ${styles.credit}`}>Photo — {HERO_IMAGE.credit}</p>
      ) : null}
    </section>
  );
}
