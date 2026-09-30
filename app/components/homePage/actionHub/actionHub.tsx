import Link from "next/link";
import Image from "next/image";
import styles from "./actionHub.module.css";
import NewsletterForm from "../newsLetterForm/newsLetterForm";
import { getNextConcert } from "@/app/lib/concerts";

function IconCalendar() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M7 3v3M17 3v3M4 9h16M5.5 5.5h13a1.5 1.5 0 0 1 1.5 1.5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a1.5 1.5 0 0 1 1.5-1.5Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function IconCase() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M9 6V4.8A1.8 1.8 0 0 1 10.8 3h2.4A1.8 1.8 0 0 1 15 4.8V6M4 8.5h16M6 6h12a2 2 0 0 1 2 2v9.5A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5V8a2 2 0 0 1 2-2Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function IconMail() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M3.5 6.5h17v11h-17z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="m4.5 7.5 7.5 5.6 7.5-5.6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export default async function ActionHub() {
  const nextShow = await getNextConcert();
  const nextShowDate = nextShow ? new Date(`${nextShow.date}T12:00:00.000Z`) : null;

  return (
    <section className={styles.wrap}>
      <div className="container">
        <div className={styles.frame}>
          <div className={styles.header}>
            <div className={styles.copy}>
              <span className={styles.eyebrow}>Start here</span>
              <h2 className={styles.title}>Music, shows and booking.</h2>
              <p className={styles.text}>
                Listen to Sent To Die, check upcoming shows or bring Until They
                Fall to your stage.
              </p>
            </div>

            <div className={styles.rail}>
              <span className={styles.railPill}>Shows</span>
              <span className={styles.railPill}>Booking</span>
              <span className={styles.railPill}>Updates</span>
            </div>
          </div>

          <div className={styles.grid}>
            <Link
              href="/concerts"
              className={`${styles.card} ${styles.cardLinkable} ${styles.liveCard}`}
              aria-label="Open the concerts page"
            >
              <div className={styles.cardTop}>
                <div className={styles.head}>
                  <span className={styles.icon}>
                    <IconCalendar />
                  </span>
                  <div>
                    <span className={styles.kicker}>Live</span>
                    <h3 className={styles.cardTitle}>Next show</h3>
                  </div>
                </div>
                <span className={styles.linkLabel}>Concerts</span>
              </div>

              <p className={styles.desc}>
                Upcoming dates, venue details and past shows from the Belgian
                metal scene.
              </p>

              <div className={nextShow?.posterUrl ? styles.showWithPoster : styles.showContent}>
              {nextShow?.posterUrl ? (
                <div className={styles.posterWrap}>
                  <Image
                    src={nextShow.posterUrl}
                    alt={`${nextShow.title ?? nextShow.venue} — concert poster`}
                    fill
                    sizes="(max-width: 540px) 240px, (max-width: 980px) 280px, 220px"
                    className={styles.posterImage}
                  />
                </div>
              ) : null}

              {nextShow ? (
                <div className={styles.showBoard}>
                  <div className={styles.datePanel}>
                    <span className={styles.dateDay}>
                      {nextShowDate?.getUTCDate().toString().padStart(2, "0")}
                    </span>
                    <span className={styles.dateMonth}>
                      {nextShowDate
                        ?.toLocaleString("en", {
                          month: "short",
                          timeZone: "UTC",
                        })
                        .toUpperCase()}
                    </span>
                  </div>

                  <div className={styles.showMeta}>
                    <span className={styles.metaLabel}>Next on stage</span>
                    <p className={styles.showCity}>{nextShow.city.split(",")[0]}</p>
                    <p className={styles.showVenue}>{nextShow.venue}</p>
                    {nextShow.note ? (
                      <p className={styles.showNote}>{nextShow.note}</p>
                    ) : (
                      <p className={styles.showNote}>Tickets and details on the live page.</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <span className={styles.emptyEyebrow}>No date public yet</span>
                  <p className={styles.emptyTitle}>The next room is still taking shape.</p>
                  <p className={styles.emptyText}>
                    Join the list or check the concert page for the next
                    announcement.
                  </p>
                </div>
              )}
              </div>
            </Link>

            <div className={styles.sideColumn}>
              <Link
                href="/booking"
                className={`${styles.card} ${styles.cardLinkable} ${styles.bookingCard}`}
                aria-label="Open the booking page"
              >
                <div className={styles.cardTop}>
                  <div className={styles.head}>
                    <span className={styles.icon}>
                      <IconCase />
                    </span>
                    <div>
                      <span className={styles.kicker}>Booking</span>
                      <h3 className={styles.cardTitle}>Book the band</h3>
                    </div>
                  </div>
                  <span className={styles.linkLabel}>Booking</span>
                </div>

                <p className={styles.desc}>
                  Brussels melodic death metal with a tight live set and tech
                  rider ready.
                </p>

                <div className={styles.tagRow}>
                  <span className={styles.tag}>Club shows</span>
                  <span className={styles.tag}>Festivals</span>
                  <span className={styles.tag}>Support slots</span>
                </div>
              </Link>

              <div
                className={`${styles.card} ${styles.mailCard}`}
                aria-labelledby="hub-newsletter-title"
              >
                <div className={styles.cardTop}>
                  <div className={styles.head}>
                    <span className={styles.icon}>
                      <IconMail />
                    </span>
                    <div>
                      <span className={styles.kicker}>Mailing list</span>
                      <h3 id="hub-newsletter-title" className={styles.cardTitle}>
                        Join the list
                      </h3>
                    </div>
                  </div>
                </div>

                <p className={styles.desc}>
                  New dates, videos and merch drops straight from the band.
                </p>

                <div className={styles.formWrap}>
                  <NewsletterForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
