import Image from "next/image";
import Link from "next/link";
import styles from "./galleryStrip.module.css";
import type { GalleryPhoto } from "@/app/lib/gallery";
import { IMAGE_BLUR_DATA_URL } from "@/app/lib/imageOptimization";

type Props = {
    title: string;
    subtitle?: string;
    photos: GalleryPhoto[];
    onPhotoClick: (photo: GalleryPhoto) => void;
    viewAllHref?: string;
    viewAllLabel?: string;
};

export default function GalleryStrip({
    title,
    subtitle,
    photos,
    onPhotoClick,
    viewAllHref,
    viewAllLabel = "View all",
}: Props) {
    return (
        <section className={styles.section}>
        <header className={styles.header}>
            <div>
            <h2 className={styles.title}>{title}</h2>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>

            {viewAllHref && (
            <div className={styles.ctaWrap}>
                <Link href={viewAllHref} className={styles.cta}>
                {viewAllLabel}
                </Link>
            </div>
            )}
        </header>

        <div className={styles.strip}>
            {photos.map((photo) => (
            <button
                key={photo.id}
                type="button"
                className={styles.item}
                onClick={() => onPhotoClick(photo)}
            >
                <div className={styles.imageWrap}>
                <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 260px"
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR_DATA_URL}
                />
                </div>
                {(photo.caption || photo.meta) && (
                <div className={styles.captionBlock}>
                    {photo.caption && (
                    <p className={styles.caption}>{photo.caption}</p>
                    )}
                    {photo.meta && <p className={styles.meta}>{photo.meta}</p>}
                </div>
                )}
            </button>
            ))}
        </div>
        </section>
    );
};
