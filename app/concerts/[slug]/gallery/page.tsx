"use client";

import GalleryFull from "@/app/components/gallery/galleryFull/galleryFull";
import { GalleryPhoto } from "@/app/components/gallery/galleryStrip/galleryStrip";
import { notFound } from "next/navigation";
// import { getConcertBySlug, getPhotosForConcert } etc.

type Props = {
  params: { slug: string };
};

export default function ConcertGalleryPage({ params }: Props) {
    const slug = params.slug;

    // Placeholder : à la place tu appelleras ta DB / lib
    const concert = { slug, title: "VK — Brussels, BE", date: "2025-01-10" };
    if (!concert) return notFound();

    const photos: GalleryPhoto[] = [
        // photos liées à ce concert uniquement
    ];

    return (
        <main>
        <GalleryFull
            title={`Gallery · ${concert.title}`}
            subtitle={`Live photos from the show on ${concert.date}.`}
            photos={photos}
        />
        </main>
    );
};
