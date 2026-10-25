import NewTabLink from "@/app/components/newTabLink";
import ConcertPoster from "../concertPoster";
import Link from "next/link";
import type { Concert } from "@/app/lib/concerts";
import {
  concertDateParts,
  formatLongDate,
  isLabelNote,
  reliableTimes,
  splitCity,
  usefulTitle,
  weekday,
} from "@/app/lib/concertFormat";
import { confirmedPhotos } from "@/app/lib/concertPhotos";
import ShowPhotos from "./showPhotos";
import styles from "./showDossier.module.css";

const MAX_PHOTOS = 5;

type Props = {
  show: Concert;
  isPast: boolean;
  previous: Concert | null;
  next: Concert | null;
};

export default function ShowDossier({ show, isPast, previous, next }: Props) {
  const { day, month, year } = concertDateParts(show.date);
  const city = splitCity(show.city);
  const title = usefulTitle(show);
  const times = reliableTimes(show);
  const context = `${city.name}, ${formatLongDate(show.date)}`;

  const kicker = isLabelNote(show.note) ? show.note : null;
  /* Promotional prose is only relevant before the show */
  const programmeNote = !isPast && show.note && !kicker ? show.note : null;
  const ticket = !isPast && show.ticketUrl ? show.ticketUrl : null;

  const timetable = [
    times.doors ? { label: "Doors", value: times.doors } : null,
    times.show ? { label: "Show", value: times.show } : null,
    /* The price sits beside the ticket action when there is one */
    show.price && !ticket ? { label: "Entry", value: show.price } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  const lineup = show.lineup ?? [];
  const hasProgramme =
    lineup.length > 0 || timetable.length > 0 || Boolean(show.description || programmeNote || show.facebookEventUrl);

  const photos = confirmedPhotos(show);
  const shownPhotos = photos.slice(0, MAX_PHOTOS);

  return (
    <div className={`${styles.page} ${show.posterUrl ? styles.withPoster : ""}`}>
      <nav className={styles.crumbs} aria-label="Breadcrumb">
        <Link href="/concerts">Live</Link>
        <span aria-hidden="true">/</span>
        {isPast ? (
          <>
            <Link href="/concerts#archive">Archive</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{year}</span>
          </>
        ) : (
          <span aria-current="page">Upcoming</span>
        )}
      </nav>

      {/* I — Masthead: the date is the object */}
      <header className={styles.masthead}>
        <div className={styles.mastText}>
          {kicker ? <p className={`meta ${styles.kicker}`}>{kicker}</p> : null}
          <p className={styles.date}>
            <time dateTime={show.date}>
              <span className={styles.dayMonth}>
                {day}.{month}
              </span>
              <span className={styles.year}>{year}</span>
            </time>
          </p>
          <p className={`meta ${styles.status}`}>
            {weekday(show.date)} — {isPast ? "Archive" : "Upcoming"}
          </p>
          <h1 className={styles.city}>
            {city.name}
            {city.country ? <span className={styles.country}>{city.country}</span> : null}
          </h1>
          <p className={styles.venue}>{show.venue}</p>
          {title ? <p className={styles.title}>{title}</p> : null}
        </div>

        {show.posterUrl ? (
          <div className={styles.poster}>
            <ConcertPoster
              show={show}
              alt={`${title ?? show.venue} poster, ${formatLongDate(show.date)}`}
              priority
              sizes="(max-width: 900px) 100vw, 40vw"
              className={styles.posterImage}
            />
          </div>
        ) : null}
      </header>

      {/* II — Ticket action, upcoming only, real URL only */}
      {ticket ? (
        <div className={styles.action}>
          <NewTabLink href={ticket} className={styles.ticket}>
            <span>
              Tickets <span className="srOnly">for {context}</span>
            </span>
            {show.price ? <span className={styles.ticketPrice}>{show.price}</span> : null}
            <span aria-hidden="true">↗</span>
          </NewTabLink>
        </div>
      ) : null}

      {/* III — Programme, only from available data */}
      {hasProgramme ? (
        <section className={styles.programme} aria-labelledby="programme-title">
          <h2 id="programme-title" className={`meta ${styles.sectionLabel}`}>
            Programme
          </h2>

          {lineup.length ? (
            <div className={styles.bill}>
              <p className={`meta ${styles.rowLabel}`}>Bill</p>
              <ul className={styles.billList}>
                {lineup.map((act, i) => (
                  <li key={`${act}-${i}`}>{act}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {timetable.length ? (
            <dl className={styles.timetable}>
              {timetable.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {show.description ? <p className={styles.note}>{show.description}</p> : null}
          {programmeNote ? <p className={styles.note}>{programmeNote}</p> : null}

          {show.facebookEventUrl ? (
            <NewTabLink href={show.facebookEventUrl} className={styles.source}>
              <span>
                Event page <span className="srOnly">for {context}</span>
              </span>
              <span aria-hidden="true">↗</span>
            </NewTabLink>
          ) : null}
        </section>
      ) : null}

      {/* IV — Confirmed photos only */}
      {shownPhotos.length ? (
        <section className={styles.photos} aria-labelledby="photos-title">
          <h2 id="photos-title" className={`meta ${styles.sectionLabel}`}>
            Photos — {String(photos.length).padStart(2, "0")}
          </h2>
          <ShowPhotos photos={shownPhotos} context={context} />
          {photos.length > MAX_PHOTOS ? (
            <Link href={`/concerts/${show.id}/gallery`} className={`action-link ${styles.allPhotos}`}>
              All {photos.length} photos <span className="arrow" aria-hidden="true">→</span>
            </Link>
          ) : null}
        </section>
      ) : null}

      {/* V — Neighbouring shows */}
      <nav className={styles.neighbours} aria-label="Other shows">
        <div className={styles.neighbourRow}>
          {previous ? (
            <Link href={`/concerts/${previous.id}`} className={styles.neighbour}>
              <span className={styles.neighbourDir}>← Previous</span>
              <span className={styles.neighbourDate}>{formatLongDate(previous.date)}</span>
              <span className={styles.neighbourCity}>{splitCity(previous.city).name}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/concerts/${next.id}`} className={`${styles.neighbour} ${styles.neighbourNext}`}>
              <span className={styles.neighbourDir}>Next →</span>
              <span className={styles.neighbourDate}>{formatLongDate(next.date)}</span>
              <span className={styles.neighbourCity}>{splitCity(next.city).name}</span>
            </Link>
          ) : null}
        </div>
        <Link href={isPast ? "/concerts#archive" : "/concerts"} className={styles.allShows}>
          All shows <span aria-hidden="true">→</span>
        </Link>
      </nav>
    </div>
  );
}

export function ShowUnavailable({ gallerySlug }: { gallerySlug?: string } = {}) {
  return (
    <div className={styles.page}>
      <nav className={styles.crumbs} aria-label="Breadcrumb">
        <Link href="/concerts">Live</Link>
      </nav>
      <header className={`${styles.masthead} ${styles.unavailable}`}>
        <div className={styles.mastText}>
          <h1 className={styles.city}>{gallerySlug ? "Photos temporarily unavailable" : "Show unavailable right now"}</h1>
        </div>
      </header>
      <nav className={styles.neighbours} aria-label="Other shows">
        {gallerySlug ? (
          <Link href={`/concerts/${encodeURIComponent(gallerySlug)}`} className={styles.allShows}>
            Back to show <span aria-hidden="true">→</span>
          </Link>
        ) : null}
        <Link href={gallerySlug ? "/concerts#archive" : "/concerts"} className={styles.allShows}>
          All shows <span aria-hidden="true">→</span>
        </Link>
      </nav>
    </div>
  );
}
