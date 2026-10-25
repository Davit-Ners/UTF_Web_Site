import Link from "next/link";
import ConcertPoster from "@/app/components/concerts/concertPoster";
import { reliableTimes } from "@/app/lib/concertFormat";
import type { Concert } from "@/app/lib/concerts";
import styles from "./live.module.css";

const MAX_ROWS = 5;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type Props = {
  shows: Concert[] | null;
};

function dateParts(date: string) {
  const [year, month, day] = date.split("-");
  return { year, month, day, monthName: MONTHS[Number(month) - 1] };
}

function splitCity(city: string) {
  const index = city.lastIndexOf(", ");
  if (index === -1) return { name: city, country: undefined };
  return { name: city.slice(0, index), country: city.slice(index + 2) };
}

export default function Live({ shows }: Props) {
  return (
    <section id="live" className={styles.live} aria-labelledby="live-title">
      {shows === null ? <Unavailable /> : null}
      {shows?.length === 0 ? <NoDates /> : null}
      {shows?.length === 1 ? <FeaturedShow show={shows[0]} /> : null}
      {shows && shows.length > 1 ? <TourList shows={shows} /> : null}
    </section>
  );
}

function Unavailable() {
  return (
    <>
      <p className={`meta ${styles.index}`}>02 — Live</p>
      <h2 id="live-title" className={`${styles.title} ${styles.titleSplit}`}>
        Live
      </h2>
      <div className={styles.empty}>
        <p className="meta">Dates unavailable right now</p>
        <Link href="/concerts" className={`action-link ${styles.emptyLink}`}>
          All concerts <span className="arrow" aria-hidden="true">→</span>
        </Link>
      </div>
    </>
  );
}

function NoDates() {
  return (
    <>
      <p className={`meta ${styles.index}`}>02 — Live</p>
      <h2 id="live-title" className={`${styles.title} ${styles.titleSplit}`}>
        Live
      </h2>
      <div className={styles.empty}>
        <p className={styles.emptyLine}>No public dates</p>
        <p className="meta">Next announcement soon</p>
        <Link href="/concerts/past" className={`action-link ${styles.emptyLink}`}>
          Concert archive <span className="arrow" aria-hidden="true">→</span>
        </Link>
      </div>
    </>
  );
}

function FeaturedShow({ show }: { show: Concert }) {
  const { year, day, monthName } = dateParts(show.date);
  const city = splitCity(show.city);
  const times = reliableTimes(show);
  const facts = [
    { label: "Venue", value: show.venue },
    { label: "City", value: city.country ? `${city.name}, ${city.country}` : city.name },
    times.doors ? { label: "Doors", value: times.doors } : null,
    times.show ? { label: "Show", value: times.show } : null,
    show.price ? { label: "Price", value: show.price } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <>
      <p className={`meta ${styles.index}`}>02 — Next live</p>
      <h2 id="live-title" className="srOnly">
        Live
      </h2>

      <div className={`${styles.feature} ${show.posterUrl ? "" : styles.noPoster}`}>
        {show.posterUrl ? (
          <div className={styles.poster}>
            <ConcertPoster
              show={show}
              alt={`${show.title ?? show.venue} poster`}
              className={styles.posterImage}
              sizes="(max-width: 900px) 100vw, 40vw"
              blur
            />
          </div>
        ) : null}

        <div className={styles.event}>
          <p className={styles.bigDate}>
            <time dateTime={show.date}>
              <span>
                {day} {monthName}
              </span>
              <span>{year}</span>
            </time>
          </p>

          <p className={styles.eventName}>{show.title ?? show.venue}</p>

          <dl className={styles.facts}>
            {facts.map((fact) => (
              <div key={fact.label} className={styles.fact}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div className={styles.actions}>
            {show.ticketUrl ? (
              <a href={show.ticketUrl} target="_blank" rel="noreferrer" className="action-link">
                Tickets <span className="arrow" aria-hidden="true">↗</span>
              </a>
            ) : null}
            <Link href={`/concerts/${show.id}`} className="action-link">
              Details <span className="arrow" aria-hidden="true">→</span>
            </Link>
            <Link href="/concerts" className="action-link">
              All dates <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function TourList({ shows }: { shows: Concert[] }) {
  return (
    <>
      <p className={`meta ${styles.index}`}>02 — Live</p>
      <p className={`meta ${styles.count}`}>{String(shows.length).padStart(2, "0")} upcoming</p>
      <h2 id="live-title" className={styles.title}>
        Live
      </h2>

      <ol className={styles.rows}>
        {shows.slice(0, MAX_ROWS).map((show) => {
          const { year, month, day } = dateParts(show.date);
          const city = splitCity(show.city);
          const label = `${city.name}, ${day}.${month}.${year}`;

          return (
            <li key={show.id} className={styles.row}>
              <time dateTime={show.date} className={styles.date}>
                {day}.{month}.{year.slice(2)}
              </time>
              <p className={styles.city}>
                <Link href={`/concerts/${show.id}`}>
                  {city.name}
                  {city.country ? <span className={styles.country}>{city.country}</span> : null}
                </Link>
              </p>
              <p className={styles.venue}>{show.venue}</p>
              <div className={styles.rowAction}>
                {show.ticketUrl ? (
                  <a href={show.ticketUrl} target="_blank" rel="noreferrer" className="action-link">
                    Tickets <span className="srOnly">for {label}</span>
                    <span className="arrow" aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <Link href={`/concerts/${show.id}`} className="action-link">
                    Details <span className="srOnly">for {label}</span>
                    <span className="arrow" aria-hidden="true">→</span>
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <div className={styles.foot}>
        <Link href="/concerts" className="action-link">
          All dates <span className="arrow" aria-hidden="true">→</span>
        </Link>
      </div>
    </>
  );
}
