"use client";

import { useState } from "react";
import styles from "./gallery.module.css";
import GalleryStrip, { GalleryPhoto } from "../components/gallery/galleryStrip/galleryStrip";
import GalleryHero from "../components/gallery/galleryHero/galleryHero";
import GalleryLightbox from "../components/gallery/galleryLightBox/galleryLightBox";

const featuredPhotos: GalleryPhoto[] = [
    {
        id: "live-1",
        src: "/gallery/band1.jpg",
        alt: "Until They Fall live on stage",
        caption: "Sent To Die release show",
        meta: "Brussels, BE · 2025",
    },
    {
        id: "live-2",
        src: "/gallery/band2.jpg",
        alt: "Crowd during a breakdown",
        caption: "Crowd during the breakdown",
        meta: "Arlon, BE · 2025",
    },
    {
        id: "live-3",
        src: "/gallery/dav1.jpg",
        alt: "Guitarist with red lights behind",
        caption: "Guitars & lights",
        meta: "VK · Brussels",
    },
];

const moreLive: GalleryPhoto[] = [
    {
        id: "live-4",
        src: "/gallery/kev1.jpg",
        alt: "Singer screaming into the mic",
        caption: "Vocal intensity",
        meta: "Club show",
    },
    {
        id: "live-5",
        src: "/gallery/bandall.jpg",
        alt: "Band silhouette with backlights",
        caption: "Full band silhouette",
        meta: "Festival stage",
    },
    {
        id: "live-6",
        src: "/gallery/val1.jpg",
        alt: "Crowd surfing moment",
        caption: "Crowd surfing",
        meta: "Packed room",
    },
];

export default function GalleryPage() {
    const [active, setActive] = useState<GalleryPhoto | null>(null);

    return (
        <main className={styles.page}>
        <GalleryHero />

        <section className={styles.section}>
            <div className="container">
            <GalleryStrip
                title="Highlights"
                subtitle="A selection of our favourite live moments — stage lights, sweat and crowd energy."
                photos={featuredPhotos}
                onPhotoClick={setActive}
                viewAllHref="/gallery/concert-photos"
                viewAllLabel="View all concert photos"
            />

            <GalleryStrip
                title="On stage"
                subtitle="More shots from shows, festivals and club nights."
                photos={moreLive}
                onPhotoClick={setActive}
                viewAllHref="/gallery/concert-photos"
                viewAllLabel="View all concert photos"
            />
            </div>
        </section>

        {active && (
            <GalleryLightbox
            photo={active}
            onClose={() => setActive(null)}
            />
        )}
        </main>
    );
};
