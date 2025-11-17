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
    cover: "/album-cover.jpg",
    highlightTrack: "Sent To Die",
    blurb:
        "Our debut album — modern melodic death metal with big hooks, cinematic atmospheres and relentless riffs.",
    spotifyUrl:
        "https://open.spotify.com/album/XXXXXXXXXXXXXX", // à remplacer
    appleMusicUrl:
        "https://music.apple.com/album/XXXXXXXXXXXXXX", // à remplacer
    youtubeMusicUrl:
        "https://music.youtube.com/playlist?list=XXXXXXXXXXXXXX", // à remplacer
    bandcampUrl: "https://untiltheyfall.bandcamp.com", // si tu as
    tracks: [
        { id: "t1", title: "Sent To Die", length: "4:32", isSingle: true },
        { id: "t2", title: "Doppelgänger", length: "3:58" },
        { id: "t3", title: "Uprising", length: "4:05" },
        { id: "t4", title: "Wrath Of Gaïa", length: "5:01" },
        { id: "t5", title: "Free", length: "3:47" },
        { id: "t6", title: "Armenia", length: "4:11" },
        { id: "t7", title: "One Final Ode", length: "4:11" },
    ],
};

export const discography: Release[] = [
    latestRelease,
    // {
    //     id: "early-ep",
    //     title: "Early Wounds",
    //     subtitle: "First EP",
    //     year: 2021,
    //     type: "EP",
    //     cover: "/images/music/early-ep-cover.jpg",
    //     blurb:
    //     "The first chapter of Until They Fall. Raw energy, early versions of songs that made it to the album.",
    //     spotifyUrl: "https://open.spotify.com/album/XXXXXXXX",
    // },
];

export function getReleaseBySlug(slug: string): Release | undefined {
    return discography.find((r) => r.id === slug);
};

export function getOtherReleases(slug: string): Release[] {
    return discography.filter((r) => r.id !== slug);
};
