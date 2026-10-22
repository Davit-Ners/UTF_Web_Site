import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { PhotoTrigger, PhotoViewer, type ViewerPhoto } from "@/app/components/photoViewer/photoViewer";
import {
  SHOW_PHOTO_CREDITS,
  creditedPhotographers,
  galleryChapters,
  galleryPhotos,
  type GalleryChapter,
  type GalleryPhoto,
} from "@/app/lib/gallery";
import styles from "./photoBook.module.css";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
const STRIP_ROW = 4;

const pad = (n: number, size = 3) => String(n).padStart(size, "0");

type Numbered = GalleryPhoto & { n: number };

type Layout = { opener: Numbered | null; pair: Numbered[]; strip: Numbered[][] };

/* Opener (full-bleed) only for chapters that allow it and have enough images; then an offset pair; the rest in strip rows */
function layoutChapter(chapter: GalleryChapter, photos: Numbered[]): Layout {
  const landscapeFirst = photos[0] && photos[0].width > photos[0].height;
  const opener = chapter.opener && photos.length >= 3 && landscapeFirst ? photos[0] : null;
  const rest = opener ? photos.slice(1) : photos;
  const pair = rest.slice(0, 2);
  const remaining = rest.slice(2);
  const strip: Numbered[][] = [];
  for (let i = 0; i < remaining.length; i += STRIP_ROW) strip.push(remaining.slice(i, i + STRIP_ROW));
  return { opener, pair, strip };
}

function chapterCredits(photos: GalleryPhoto[]) {
  if (!SHOW_PHOTO_CREDITS) return [];
  return Array.from(new Set(photos.flatMap((p) => (p.credit ? [p.credit.name] : []))));
}

function Photo({ photo, sizes, priority = false }: { photo: Numbered; sizes: string; priority?: boolean }) {
  return (
    <figure className={styles.figure}>
      <PhotoTrigger index={photo.n - 1} className={styles.trigger}>
        <span className={styles.frame}>
          <Image
            src={photo.src}
            alt=""
            width={photo.width}
            height={photo.height}
            sizes={sizes}
            priority={priority}
            className={`${styles.image} ${photo.bakedBorder ? styles.trimmed : ""}`}
          />
        </span>
      </PhotoTrigger>
      <figcaption className={styles.caption}>
        <span className={styles.number}>{pad(photo.n)}</span>
        {photo.caption ? <span>{photo.caption}</span> : null}
      </figcaption>
    </figure>
  );
}

export default function PhotoBook() {
  /* Page order: chapter by chapter, then catalogue order within each chapter */
  let counter = 0;
  const chapters = galleryChapters
    .map((chapter) => ({
      chapter,
      photos: galleryPhotos
        .filter((photo) => photo.chapter === chapter.id)
        .map((photo) => ({ ...photo, n: ++counter })),
    }))
    .filter((group) => group.photos.length > 0);

  const ordered = chapters.flatMap((group) => {
    const { opener, pair, strip } = layoutChapter(group.chapter, group.photos);
    return [...(opener ? [opener] : []), ...pair, ...strip.flat()];
  });
  /* Renumber in visual order so numbers, triggers and viewer agree */
  ordered.forEach((photo, i) => (photo.n = i + 1));

  const total = ordered.length;
  const photographers = creditedPhotographers();

  const viewerPhotos: ViewerPhoto[] = ordered.map((photo) => {
    const chapter = galleryChapters.find((c) => c.id === photo.chapter)!;
    const credit = SHOW_PHOTO_CREDITS && photo.credit ? `photograph by ${photo.credit.name}` : null;
    const caption = photo.caption && photo.caption !== chapter.title ? photo.caption : null;
    const context = [chapter.title, caption, credit].filter(Boolean).join(" — ");
    return {
      src: photo.src,
      label: `Photo ${photo.n} of ${total}: ${photo.alt}. ${context}`,
      caption: `${pad(photo.n)} / ${pad(total)} — ${context}`,
    };
  });

  const counts = [
    `${pad(total, 2)} photographs`,
    photographers.length ? `${pad(photographers.length, 2)} photographers` : null,
  ].filter(Boolean);

  return (
    <PhotoViewer photos={viewerPhotos}>
      <main className={styles.page}>
        <header className={styles.masthead}>
          <h1 className={styles.word}>Gallery</h1>
          <p className={`meta ${styles.counts}`}>{counts.join(" — ")}</p>
        </header>

        {chapters.map((group, ci) => {
          const { opener, pair, strip } = layoutChapter(group.chapter, group.photos);
          const credits = chapterCredits(group.photos);
          const headingId = `chapter-${group.chapter.id}`;

          return (
            <section key={group.chapter.id} className={styles.chapter} aria-labelledby={headingId}>
              <header className={styles.chapterHead}>
                <p className={`meta ${styles.roman}`}>{ROMAN[ci]}</p>
                <h2 id={headingId} className={styles.chapterTitle}>
                  {group.chapter.title}
                </h2>
                {credits.length ? (
                  <p className={styles.credit}>Photographs by {credits.join(", ")}</p>
                ) : null}
                <p className={`meta ${styles.chapterCount}`}>
                  {pad(group.photos.length, 2)} {group.photos.length === 1 ? "photo" : "photos"}
                </p>
              </header>

              <div className={styles.spreads}>
                {opener ? (
                  <div className={styles.opener}>
                    <Photo photo={opener} sizes="100vw" priority={ci === 0} />
                  </div>
                ) : null}

                {pair.length ? (
                  <div className={`${styles.pair} ${pair.length === 1 ? styles.single : ""}`}>
                    {pair.map((photo, i) => (
                      <div key={photo.id} className={i === 0 ? styles.pairWide : styles.pairNarrow}>
                        <Photo photo={photo} sizes={i === 0 ? "(max-width: 900px) 100vw, 60vw" : "(max-width: 900px) 84vw, 36vw"} />
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              {strip.length ? (
                <div className={styles.strip}>
                  <p className={`meta ${styles.stripLabel}`}>Contact strip</p>
                  {strip.map((row, ri) => (
                    <div key={ri} className={styles.stripRow}>
                      {row.map((photo) => (
                        /* Equal row height, each width proportional to its ratio: nothing is cropped */
                        <div
                          key={photo.id}
                          className={styles.stripItem}
                          style={{ "--ratio": photo.width / photo.height } as CSSProperties}
                        >
                          <Photo photo={photo} sizes="(max-width: 600px) 50vw, 34vw" />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : null}
            </section>
          );
        })}

        <nav className={styles.end} aria-label="More">
          <Link href="/concerts#archive" className={styles.endLink}>
            Live archive <span aria-hidden="true">→</span>
          </Link>
        </nav>
      </main>
    </PhotoViewer>
  );
}
