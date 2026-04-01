import Link from "next/link";
import styles from "./concertHero.module.css";
import { type Concert } from "@/app/lib/concerts";

type Props = {
  nextShow: Concert | null;
};

export default function ConcertsHero({ nextShow }: Props) {
  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={`${styles.card} card`}>
          <div className={styles.left}>
            <span className={styles.eyebrow}>Concerts</span>
            <h1 className={styles.title}>Catch Until They Fall live</h1>
            <p className={styles.subtitle}>
              Modern metal from Brussels. Heavy riffs, big hooks and a show built
              for festivals and clubs.
            </p>

            <div className={styles.actions}>
              <Link href="/booking" className="button">
                Book the band
              </Link>
            </div>
          </div>

          <div className={styles.right}>
            {nextShow ? (
              <div className={styles.nextShow}>
                <span className={styles.nextLabel}>Next show</span>
                <p className={styles.nextMain}>
                  {formatDate(nextShow.date)} - {nextShow.city}
                </p>
                <p className={styles.nextVenue}>{nextShow.venue}</p>
                {nextShow.ticketUrl && (
                  <Link href={nextShow.ticketUrl} className={`${styles.ticketLink} button`}>
                    Tickets
                  </Link>
                )}
              </div>
            ) : (
              <div className={styles.nextShow}>
                <span className={styles.nextLabel}>Next show</span>
                <p className={styles.nextMain}>New dates coming soon</p>
                <p className={styles.nextVenue}>
                  Follow us on socials to stay updated.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function formatDate(raw: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${raw}T12:00:00.000Z`));
}
