export type Track = {
  id: string;
  title: string;
  length: string;
  isSingle?: boolean;
};

export type ReleaseType = "Album" | "EP" | "Single";

export type Release = {
  id: string;
  title: string;
  subtitle?: string;
  year: number;
  type: ReleaseType;
  cover: string;
  highlightTrack?: string;
  blurb: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  youtubeMusicUrl?: string;
  bandcampUrl?: string;
  tracks?: Track[];
  story?: string;
  recordingNotes?: string[];
};

export const latestRelease: Release = {
  id: "sent-to-die",
  title: "Sent To Die",
  subtitle: "Debut album",
  year: 2023,
  type: "Album",
  cover: "/optimized/album-cover.webp",
  highlightTrack: "Sent To Die",
  blurb:
    "Aggressive riffs, atmospheric melodies and modern metal tension from Brussels.",
  spotifyUrl: "https://open.spotify.com/album/2xtq2hwcacYHSi5MHAm40s",
  appleMusicUrl: "https://music.apple.com/album/1718447538",
  youtubeMusicUrl:
    "https://www.youtube.com/watch?v=rtEFcJMtlJE&list=OLAK5uy_lWQtwuyyilIDmtt9zLDjKAJ-Rj-VP75T4",
  bandcampUrl: "",
  story:
    "Released on December 1, 2023, Sent To Die is the band’s first full-length record. Aggressive riffs, melodic leads and atmospheric weight run through songs shaped by pressure, collapse and release.",
  recordingNotes: [
    "Recorded at Project Zero Studio.",
    "Produced, mixed and mastered by Yarne Heylen.",
    "Uprising aired several times on Classic 21; Wrath Of Gaia aired on Radio Panik.",
  ],
  tracks: [
    { id: "t1", title: "Sent To Die", length: "4:32", isSingle: true },
    { id: "t2", title: "Doppelganger", length: "3:58" },
    { id: "t3", title: "Uprising", length: "4:05" },
    { id: "t4", title: "Wrath Of Gaia", length: "5:01" },
    { id: "t5", title: "Free", length: "3:47" },
    { id: "t6", title: "Armenia", length: "4:11" },
    { id: "t7", title: "One Final Ode", length: "4:11" },
  ],
};

export const discography: Release[] = [latestRelease];

export function getReleaseBySlug(slug: string): Release | undefined {
  return discography.find((release) => release.id === slug);
}

export function getOtherReleases(slug: string): Release[] {
  return discography.filter((release) => release.id !== slug);
}
