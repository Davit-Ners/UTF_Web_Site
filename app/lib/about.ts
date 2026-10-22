import type { PhotoCredit } from "./gallery";

export type MemberImage = {
  /* Full-resolution source */
  src: string;
  width: number;
  height: number;
  alt: string;
  credit?: PhotoCredit;
  /* The file has a thin border baked in that should be trimmed out of frame */
  bakedBorder?: boolean;
};

export type Member = {
  name: string;
  role: string;
  /* Year the member joined (press kit) */
  since: number;
  image?: MemberImage;
};

const HENOUMONT: PhotoCredit = { name: "Laurent Henoumont", source: "exif" };
const VANGELDER: PhotoCredit = { name: "Peter Vangelder", source: "exif" };

/* Current line-up, in joining order */
export const members: Member[] = [
  {
    name: "Davit Nersesyan",
    role: "Lead Guitar",
    since: 2018,
    image: {
      src: "/gallery/dav1.jpg",
      width: 2048,
      height: 1360,
      alt: "Davit Nersesyan on stage, head thrown back, playing lead guitar",
      credit: HENOUMONT,
      bakedBorder: true,
    },
  },
  {
    name: "Sabari Diakite",
    role: "Drums / Backing Vocals",
    since: 2018,
    image: {
      src: "/band/sabari-about.jpg",
      width: 1536,
      height: 2048,
      alt: "Sabari Diakite behind the drum kit",
      credit: VANGELDER,
    },
  },
  {
    name: "Kevin Estrada",
    role: "Rhythm Guitar / Backing Vocals",
    since: 2018,
    image: {
      src: "/gallery/kev1.jpg",
      width: 2048,
      height: 1378,
      alt: "Kevin Estrada bent over his guitar in amber stage light",
      credit: HENOUMONT,
      bakedBorder: true,
    },
  },
  {
    name: "Valentin Coutant",
    role: "Bass / Backing Vocals",
    since: 2024,
    image: {
      src: "/gallery/val1.jpg",
      width: 2048,
      height: 1377,
      alt: "Valentin Coutant singing into the microphone with his bass",
      credit: HENOUMONT,
      bakedBorder: true,
    },
  },
  {
    name: "Krys Bader",
    role: "Lead Vocals",
    since: 2025,
    image: {
      src: "/band/krys-about.jpg",
      width: 1536,
      height: 2048,
      alt: "Krys Bader singing at the microphone",
      credit: VANGELDER,
    },
  },
];

/* Live history from the press kit; do not add names that are not in the source */
export const festivals = [
  "Anvinium Metal Fest",
  "Eristic Fest",
  "BXL Survival Fest",
  "Tremplin du Durbuy Rock Festival",
];

export const sharedBills = [
  "Hiraes",
  "Through The Void",
  "Baraka",
  "Triagone",
  "Aetherian",
  "Mordkaul",
  "Yerao",
  "Nachtschatten",
  "Echoes of Nihil",
  "Down To Insanity",
  "Black Mirrors",
  "Kanzan",
];
