import type { Release } from "./music";

export type ListenLink = { label: string; href: string };

/* "2023-12-01" -> "01.12.2023"; falls back to the year */
export function formatReleaseDate(release: Release) {
  if (!release.releaseDate) return String(release.year);
  const [year, month, day] = release.releaseDate.split("-");
  return `${day}.${month}.${year}`;
}

function toSeconds(length: string) {
  const [min, sec] = length.split(":").map(Number);
  return min * 60 + sec;
}

/* Sum of track lengths as "m:ss", or null without tracks */
export function getRuntime(release: Release) {
  if (!release.tracks?.length) return null;
  const total = release.tracks.reduce((sum, track) => sum + toSeconds(track.length), 0);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

/* Every streaming destination that is filled in, Spotify first */
export function getListenLinks(release: Release): ListenLink[] {
  return [
    release.spotifyUrl ? { label: "Spotify", href: release.spotifyUrl } : null,
    release.appleMusicUrl ? { label: "Apple Music", href: release.appleMusicUrl } : null,
    release.youtubeMusicUrl ? { label: "YouTube Music", href: release.youtubeMusicUrl } : null,
    release.bandcampUrl ? { label: "Bandcamp", href: release.bandcampUrl } : null,
  ].filter((link): link is ListenLink => link !== null);
}
