import { notFound } from "next/navigation";
import styles from "./concertDetail.module.css";
import { concerts, type Concert } from "@/app/lib/concerts";
import Link from "next/link";
import Image from "next/image";
import ConcertGallery from "@/app/components/concerts/concertGallery/concertGallery";
import ConcertDetailsHero from "@/app/components/concerts/concertDetails/concertDetailsHero";
import ConcertDetailsContentGrid from "@/app/components/concerts/concertDetails/concertDetailsContentGrid";

type Props = {
    params: { slug: string };
};

export default async function ConcertDetailPage({ params }: Props) {
    const slug = (await params).slug;
    const concert = concerts.find((c) => c.id === slug);

    if (!concert) {
        return (
        <main className={styles.page}>
            <div className="container">
            <h1 className={styles.notFound}>Show not found.</h1>
            <Link href="/concerts" className="button">
                Back to shows
            </Link>
            </div>
        </main>
        );
    }

    const d = new Date(concert.date);
    const heading =
        concert.title ?? `${concert.city} — ${concert.venue}`;
    const dateLong = d.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    const dateTag = d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
    });

    return (
        <main className={styles.page}>
        <ConcertDetailsHero concert={concert} d={d} dateLong={dateLong} heading={heading}/>

        {/* CONTENT GRID */}
        <ConcertDetailsContentGrid concert={concert} d={d} dateLong={dateLong} dateTag={dateTag}/>

        {/* GALLERY */}
        {concert.gallery && concert.gallery.length > 0 && (
            <section className={styles.gallerySection}>
            <div className="container">
                <header className={styles.galleryHeader}>
                <h2 className={styles.blockTitle}>Live photos</h2>
                <p className={styles.gallerySubtitle}>
                    A few moments from this show. Click any photo to
                    open it full screen.
                </p>
                </header>
                <ConcertGallery images={concert.gallery} />
            </div>
            </section>
        )}
        </main>
    );
};
