import Link from "next/link";
import styles from "./actionHub.module.css";
import NewsletterForm from "../newsLetterForm/newsLetterForm";
import { concerts } from "@/app/lib/concerts";

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

function getNextShow() {
  const today = new Date();
  const cutoff = new Date(today.toDateString());

  const upcoming = concerts
    .map((concert) => ({ ...concert, parsedDate: new Date(concert.date) }))
    .filter((concert) => concert.parsedDate >= cutoff)
    .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime())[0];

  if (!upcoming) return null;

  return {
    day: upcoming.parsedDate.getDate().toString().padStart(2, "0"),
    month: new Intl.DateTimeFormat("en-GB", { month: "short" })
      .format(upcoming.parsedDate)
      .toUpperCase(),
    city: upcoming.city.split(",")[0],
    venue: upcoming.venue,
    note: upcoming.note,
  };
}

export default function ActionHub() {
  const nextShow = getNextShow();

  return (
    <section className={styles.wrap}>
      <div className="container">
        <div className={styles.frame}>
          <div className={styles.header}>
            <div className={styles.copy}>
              <span className={styles.eyebrow}>Routes</span>
              <h2 className={styles.title}>Pick the lane that matters now.</h2>
              <p className={styles.text}>
                Dates, booking and direct updates. The fast-entry part of the site
                when you want the next move without digging around.
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
                    <h3 className={styles.cardTitle}>Next move</h3>
                  </div>
                </div>
                <span className={styles.linkLabel}>Concerts</span>
              </div>

              <p className={styles.desc}>
                The quickest way to the next date, venue details and the full live
                archive.
              </p>

              {nextShow ? (
                <div className={styles.showBoard}>
                  <div className={styles.datePanel}>
                    <span className={styles.dateDay}>{nextShow.day}</span>
                    <span className={styles.dateMonth}>{nextShow.month}</span>
                  </div>

                  <div className={styles.showMeta}>
                    <span className={styles.metaLabel}>Locked date</span>
                    <p className={styles.showCity}>{nextShow.city}</p>
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
                  <p className={styles.emptyTitle}>The next run is still taking shape.</p>
                  <p className={styles.emptyText}>
                    Keep an eye on the concert page and the list below for the next
                    announcement.
                  </p>
                </div>
              )}
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
                      <h3 className={styles.cardTitle}>Bring the band in</h3>
                    </div>
                  </div>
                  <span className={styles.linkLabel}>Booking</span>
                </div>

                <p className={styles.desc}>
                  Club shows, festival slots, support bills and the direct contact
                  route for promoters.
                </p>

                <div className={styles.tagRow}>
                  <span className={styles.tag}>Club dates</span>
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
                        Stay on the first signal
                      </h3>
                    </div>
                  </div>
                </div>

                <p className={styles.desc}>
                  For new dates, drops and the occasional inside line before it hits
                  the feed.
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
