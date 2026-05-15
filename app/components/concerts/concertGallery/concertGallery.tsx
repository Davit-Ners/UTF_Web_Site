"use client";

import { useState } from "react";
import styles from "./concertGallery.module.css";
import Image from "next/image";
import { IMAGE_BLUR_DATA_URL } from "@/app/lib/imageOptimization";

type Props = {
    images: string[];
};

export default function ConcertGallery({ images }: Props) {
    const [active, setActive] = useState<string | null>(null);

    if (!images || images.length === 0) return null;

    return (
        <>
        <div className={styles.grid}>
            {images.map((src, idx) => (
            <button
                key={idx}
                type="button"
                className={styles.thumb}
                onClick={() => setActive(src)}
            >
                <Image
                src={src}
                alt={`Live photo ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 220px"
                placeholder="blur"
                blurDataURL={IMAGE_BLUR_DATA_URL}
                />
            </button>
            ))}
        </div>

        {active && (
            <div
            className={styles.overlay}
            onClick={() => setActive(null)}
            >
            <div
                className={styles.dialog}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                type="button"
                className={styles.close}
                onClick={() => setActive(null)}
                aria-label="Close"
                >
                x
                </button>
                <div className={styles.fullImgWrap}>
                <Image
                    src={active}
                    alt="Live photo"
                    fill
                    sizes="100vw"
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR_DATA_URL}
                />
                </div>
            </div>
            </div>
        )}
        </>
    );
}
