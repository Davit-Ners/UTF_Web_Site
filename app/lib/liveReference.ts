export type LiveReferenceData = {
  youtubeId: string | null;
  poster: string | null;
  posterTemporary: boolean;
  eventName: string | null;
  date: string | null;
  location: string | null;
  result: string | null;
};

/* Replace these fields once the footage and its exact context are confirmed.
 * Poster: local 16:9 export, at least 1920 × 1080. Then set posterTemporary=false.
 * Keep unconfirmed facts null. Never substitute the studio clip for missing live footage.
 */
export const liveReference: LiveReferenceData = {
  youtubeId: null,
  poster: "/live-reference-placeholder.svg",
  posterTemporary: true,
  eventName: null,
  date: null,
  location: null,
  result: null,
};

export function liveVideoLinks(youtubeId: string | null) {
  if (!youtubeId || !/^[A-Za-z0-9_-]{11}$/.test(youtubeId)) return null;
  return {
    youtubeUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`,
  };
}
