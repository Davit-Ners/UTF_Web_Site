import type { Concert } from "./concerts";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const BAND_NAME = "until they fall";

/* "2026-11-07" -> parts, without time-zone conversion */
export function concertDateParts(date: string) {
  const [year, month, day] = date.split("-");
  return { year, month, day, monthName: MONTHS[Number(month) - 1] };
}

/* "Brussels, BE" -> { name: "Brussels", country: "BE" } */
export function splitCity(city: string) {
  const index = city.lastIndexOf(", ");
  if (index === -1) return { name: city, country: undefined };
  return { name: city.slice(0, index), country: city.slice(index + 2) };
}

/* Other acts on the bill; the band itself is not listed */
export function supportingActs(show: Concert) {
  return (show.lineup ?? []).filter((act) => act.trim().toLowerCase() !== BAND_NAME);
}

/*
 * The event title only when it adds information: a trailing
 * " - venue, city" segment is dropped, and a title that only repeats
 * the venue or city is hidden.
 */
export function usefulTitle(show: Concert) {
  if (!show.title) return null;
  const city = splitCity(show.city).name.toLowerCase();
  const venue = show.venue.toLowerCase();

  const segments = show.title.split(" - ");
  const kept = segments.filter((segment, i) => {
    if (i === 0) return true;
    const s = segment.toLowerCase();
    return !(s.includes(venue) || s.includes(city));
  });
  const title = kept.join(" - ").trim();
  const t = title.toLowerCase();

  if (!title || t === venue || t === city) return null;
  return title;
}

export function groupByYear(shows: Concert[]) {
  const map = new Map<string, Concert[]>();
  for (const show of shows) {
    const year = show.date.slice(0, 4);
    map.set(year, [...(map.get(year) ?? []), show]);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([year, items]) => ({ year, shows: items }));
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/* Deterministic weekday from the calendar date, no time zone involved */
export function weekday(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
}

export function formatLongDate(date: string) {
  const { day, month, year } = concertDateParts(date);
  return `${day}.${month}.${year}`;
}

/* A short, label-like note ("Tremplin Durbuy Rock Fest") as opposed to promotional prose */
export function isLabelNote(note?: string) {
  if (!note) return false;
  const text = note.trim();
  return text.length <= 60 && !/[.!?]/.test(text);
}

/*
 * Doors/show times only when explicitly filled. Identical doors and show
 * times are treated as unreliable and both omitted rather than corrected.
 */
export function reliableTimes(show: Concert) {
  if (show.doorsTime && show.showTime && show.doorsTime === show.showTime) {
    return { doors: undefined, show: undefined, suspicious: true };
  }
  return { doors: show.doorsTime, show: show.showTime, suspicious: false };
}
