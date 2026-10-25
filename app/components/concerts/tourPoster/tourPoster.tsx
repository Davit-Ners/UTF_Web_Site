import Reveal from "@/app/components/motion/reveal";
import NewTabLink from "@/app/components/newTabLink";
import ConcertPoster from "../concertPoster";
import Link from "next/link";
import type { Concert } from "@/app/lib/concerts";
import {
  concertDateParts,
  groupByYear,
  splitCity,
  supportingActs,
  usefulTitle,
  reliableTimes,
} from "@/app/lib/concertFormat";
import styles from "./tourPoster.module.css";

/* null means the data could not be loaded, which is distinct from zero shows */
export type ConcertData = { upcoming: Concert[]; past: Concert[] } | null;

type Props = {
  data: ConcertData;
};

const pad = (n: number) => String(n).padStart(2, "0");

function longDate(date: string) {
  const { day, month, year } = concertDateParts(date);
  return `${day}.${month}.${year}`;
}

/* Reserve the served artwork's real intrinsic ratio before it loads. */
function Poster({ show, sizes }: { show: Concert; sizes: string }) {
  if (!show.posterUrl) return null;
  return (
    <ConcertPoster
      show={show}
      alt={`${usefulTitle(show) ?? show.venue} poster, ${longDate(show.date)}`}
      sizes={sizes}
      className={styles.poster}
    />
  );
}

export default function TourPoster({ data }: Props) {
  const firstYear = data?.past.length ? data.past[data.past.length - 1].date.slice(0, 4) : null;
  const counts = data
    ? [
        `${pad(data.upcoming.length)} upcoming`,
        data.past.length ? `${pad(data.past.length)} shows since ${firstYear}` : null,
      ].filter(Boolean)
    : [];

  return (
    <div className={styles.page}>
      <header className={styles.masthead}>
        {/* R1: the word is uncovered on load; it never fades or moves */}
        <h1 className={`${styles.live} plate plate-load`}>Live</h1>
        {counts.length ? <p className={`meta ${styles.counts}`}>{counts.join(" — ")}</p> : null}
      </header>

      <section className={styles.upcoming} aria-label="Upcoming shows">
        {data === null ? <StateLine main="Dates unavailable right now" /> : null}
        {data?.upcoming.length === 0 ? (
          <StateLine main="No public dates" sub="Next announcement soon" />
        ) : null}
        {data?.upcoming.length === 1 ? <FeaturedShow show={data.upcoming[0]} /> : null}
        {data && data.upcoming.length > 1 ? <UpcomingList shows={data.upcoming} /> : null}
      </section>

      <section id="archive" className={styles.archive} aria-labelledby="archive-title">
        <h2 id="archive-title" className={`meta ${styles.archiveTitle}`}>
          Archive
        </h2>
        {data === null ? (
          <p className={styles.archiveEmpty}>Archive unavailable right now</p>
        ) : data.past.length === 0 ? (
          <p className={styles.archiveEmpty}>No past shows yet</p>
        ) : (
          groupByYear(data.past).map((group) => <YearChapter key={group.year} {...group} />)
        )}
      </section>

      <nav className={styles.end} aria-label="Booking">
        <Link href="/booking" className={styles.endLink}>
          Booking <span aria-hidden="true">→</span>
        </Link>
      </nav>
    </div>
  );
}

/* R3 (after the LIVE plate): the top rule of the upcoming block */
const TOP_RULE = "rule-cut rule-cut-load after-plate";

function StateLine({ main, sub }: { main: string; sub?: string }) {
  return (
    <Reveal className={`${styles.state} ${TOP_RULE}`}>
      <p className={styles.stateMain}>{main}</p>
      {sub ? <p className="meta">{sub}</p> : null}
    </Reveal>
  );
}

function TicketOrDetails({ show }: { show: Concert }) {
  const label = `${splitCity(show.city).name}, ${longDate(show.date)}`;
  return show.ticketUrl ? (
    <NewTabLink href={show.ticketUrl} className="action-link">
      Tickets <span className="srOnly">for {label}</span>
      <span className="arrow" aria-hidden="true">↗</span>
    </NewTabLink>
  ) : (
    <Link href={`/concerts/${show.id}`} className="action-link">
      Details <span className="srOnly">for {label}</span>
      <span className="arrow" aria-hidden="true">→</span>
    </Link>
  );
}

function withLine(show: Concert) {
  const acts = supportingActs(show);
  if (!acts.length) return null;
  const shown = acts.slice(0, 3).join(", ");
  return acts.length > 3 ? `with ${shown} +${acts.length - 3}` : `with ${shown}`;
}

/* === 2+ upcoming: dates as objects === */
function UpcomingList({ shows }: { shows: Concert[] }) {
  const posters = shows.filter((show) => show.posterUrl);

  return (
    <div className={`${styles.listWrap} ${posters.length ? styles.hasPosters : ""}`}>
      <Reveal as="ol" className={`${styles.dates} ${TOP_RULE}`}>
        {shows.map((show) => {
          const { day, month, year } = concertDateParts(show.date);
          const city = splitCity(show.city);
          const support = withLine(show);
          return (
            <li key={show.id} className={styles.date}>
              <time dateTime={show.date} className={styles.dateObject}>
                <span className={styles.dayMonth}>
                  {day}.{month}
                </span>
                <span className={styles.year}>’{year.slice(2)}</span>
              </time>
              <div className={styles.where}>
                <p className={styles.city}>
                  <Link href={`/concerts/${show.id}`}>
                    {city.name}
                    {city.country ? <span className={styles.country}>{city.country}</span> : null}
                  </Link>
                </p>
                <p className={styles.venue}>{show.venue}</p>
                {support ? <p className={styles.support}>{support}</p> : null}
              </div>
              <div className={styles.action}>
                <TicketOrDetails show={show} />
              </div>
            </li>
          );
        })}
      </Reveal>

      {posters.length ? (
        <div className={styles.posterColumn}>
          {posters.map((show) => (
            <Poster key={show.id} show={show} sizes="(max-width: 900px) 100vw, 30vw" />
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* === 1 upcoming: featured poster spread === */
function FeaturedShow({ show }: { show: Concert }) {
  const { day, monthName, year } = concertDateParts(show.date);
  const city = splitCity(show.city);
  const title = usefulTitle(show);
  const support = withLine(show);
  const times = reliableTimes(show);
  const facts = [
    { label: "Venue", value: show.venue },
    { label: "City", value: city.country ? `${city.name}, ${city.country}` : city.name },
    times.doors ? { label: "Doors", value: times.doors } : null,
    times.show ? { label: "Show", value: times.show } : null,
    show.price ? { label: "Price", value: show.price } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className={`${styles.feature} ${show.posterUrl ? "" : styles.noPoster}`}>
      {show.posterUrl ? (
        <div className={styles.featurePoster}>
          <Poster show={show} sizes="(max-width: 900px) 100vw, 42vw" />
        </div>
      ) : null}

      <div className={styles.featureText}>
        <p className="meta">Next show</p>
        <time dateTime={show.date} className={styles.featureDate}>
          <span>
            {day} {monthName}
          </span>
          <span>{year}</span>
        </time>
        <p className={styles.featureCity}>{city.name}</p>
        {title ? <p className={styles.featureTitle}>{title}</p> : null}
        {support ? <p className={styles.support}>{support}</p> : null}

        <dl className={styles.facts}>
          {facts.map((fact) => (
            <div key={fact.label} className={styles.fact}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>

        <div className={styles.featureActions}>
          {show.ticketUrl ? <TicketOrDetails show={show} /> : null}
          <Link href={`/concerts/${show.id}`} className="action-link">
            Details <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* === Archive: one chapter per year, posters pinned beside the list === */
function YearChapter({ year, shows }: { year: string; shows: Concert[] }) {
  const posters = shows.filter((show) => show.posterUrl);
  const headingId = `archive-${year}`;

  return (
    <section className={`${styles.chapter} ${posters.length ? styles.hasPosters : ""}`} aria-labelledby={headingId}>
      <header className={styles.yearHead}>
        <h3 id={headingId} className={styles.yearNumber}>
          {year}
        </h3>
        <p className={styles.yearCount}>
          {pad(shows.length)} {shows.length === 1 ? "show" : "shows"}
        </p>
      </header>

      <ol className={styles.rows}>
        {shows.map((show) => {
          const { day, month } = concertDateParts(show.date);
          const city = splitCity(show.city);
          const title = usefulTitle(show);
          return (
            <li key={show.id}>
              <Link href={`/concerts/${show.id}`} className={styles.row}>
                <time dateTime={show.date} className={styles.rowDate}>
                  {day}.{month}
                </time>
                <span className={styles.rowCity}>{city.name}</span>
                <span className={styles.rowVenue}>
                  {show.venue}
                  {title ? <span className={styles.rowTitle}>{title}</span> : null}
                </span>
                <span className={styles.rowArrow} aria-hidden="true">→</span>
              </Link>
            </li>
          );
        })}
      </ol>

      {posters.length ? (
        <div className={styles.yearPosters}>
          {posters.map((show) => (
            <figure key={show.id} className={styles.yearPoster}>
              <Poster show={show} sizes="(max-width: 900px) 100vw, 30vw" />
              <figcaption className={styles.yearPosterCaption}>
                Poster — {longDate(show.date)} — {splitCity(show.city).name}
              </figcaption>
            </figure>
          ))}
        </div>
      ) : null}
    </section>
  );
}
