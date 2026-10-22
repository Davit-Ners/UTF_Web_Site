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
