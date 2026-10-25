export type Track = {
  id: string;
  title: string;
  length: string;
  isSingle?: boolean;
  /* YouTube id of the official video for this track, if one exists */
  videoId?: string;
};

export type ReleaseType = "Album" | "EP" | "Single";

export type Release = {
  id: string;
  title: string;
  subtitle?: string;
  year: number;
  releaseDate?: string;
  type: ReleaseType;
  cover: string;
  /* Highest-resolution artwork file, for large presentations */
  coverMaster?: string;
  highlightTrack?: string;
  blurb: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  youtubeMusicUrl?: string;
  bandcampUrl?: string;
  tracks?: Track[];
  story?: string;
  /* Confirmed credits only; omit any role that is not confirmed */
  credits?: { role: string; name: string }[];
  /* Confirmed performers on this release's recording, separate from current members */
  recordingPersonnel?: { name: string; role: string }[];
  airplay?: { track: string; station: string }[];
};

export const latestRelease: Release = {
  id: "sent-to-die",
  title: "Sent To Die",
  subtitle: "Debut album",
  year: 2023,
  releaseDate: "2023-12-01",
  type: "Album",
  cover: "/optimized/album-cover.webp",
  coverMaster: "/album-cover.jpg",
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
  credits: [
    { role: "Recorded", name: "Project Zero Studio" },
    { role: "Produced", name: "Yarne Heylen" },
  ],
  recordingPersonnel: [
    { name: "Remy Vanbruaene", role: "Vocals" },
    { name: "Davit Nersesyan", role: "Guitars, Bass" },
    { name: "Kevin Estrada", role: "Guitar" },
    { name: "Sabari Diakite", role: "Drums" },
  ],
  airplay: [
    { track: "Uprising", station: "Classic 21" },
    { track: "Wrath Of Gaïa", station: "Radio Panik" },
  ],
  tracks: [
    { id: "t0", title: "27-09-2020", length: "1:08" },
    { id: "t1", title: "Sent To Die", length: "5:08", isSingle: true, videoId: "9Wvpovk_Tg4" },
    { id: "t2", title: "Doppelgänger", length: "3:40" },
    { id: "t3", title: "Uprising", length: "5:19" },
    { id: "t4", title: "Wrath Of Gaïa", length: "6:01" },
    { id: "t5", title: "Free", length: "7:41" },
    { id: "t6", title: "Armenia", length: "6:14" },
    { id: "t7", title: "One Final Ode", length: "6:14" },
  ],
};

export const discography: Release[] = [latestRelease];

export function getReleaseBySlug(slug: string): Release | undefined {
  return discography.find((release) => release.id === slug);
}

export function getOtherReleases(slug: string): Release[] {
  return discography.filter((release) => release.id !== slug);
}
