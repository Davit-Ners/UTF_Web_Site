import { notFound } from "next/navigation";
import styles from "./concertDetail.module.css";
import { getConcertById } from "@/app/lib/concerts";
import ConcertGallery from "@/app/components/concerts/concertGallery/concertGallery";
import ConcertDetailsHero from "@/app/components/concerts/concertDetails/concertDetailsHero";
import ConcertDetailsContentGrid from "@/app/components/concerts/concertDetails/concertDetailsContentGrid";

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export default async function ConcertDetailPage({ params }: Props) {
  const { slug } = await params;
  const concert = await getConcertById(slug);

  if (!concert) {
    notFound();
  }

  const d = new Date(`${concert.date}T12:00:00.000Z`);
  const heading = concert.title ?? `${concert.city} - ${concert.venue}`;
  const dateLong = d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const dateTag = d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  });

  return (
    <main className={styles.page}>
      <ConcertDetailsHero concert={concert} d={d} dateLong={dateLong} heading={heading} />

      <ConcertDetailsContentGrid concert={concert} d={d} dateLong={dateLong} dateTag={dateTag} />

      {concert.gallery.length > 0 && (
        <section className={styles.gallerySection}>
          <div className="container">
            <header className={styles.galleryHeader}>
              <h2 className={styles.blockTitle}>Live photos</h2>
              <p className={styles.gallerySubtitle}>
                Stage shots and live moments from this show.
              </p>
            </header>
            <ConcertGallery images={concert.gallery} />
          </div>
        </section>
      )}
    </main>
  );
}
