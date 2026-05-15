export type Member = {
  name: string;
  role: string;
  image?: string;
  blurb: string;
  signature: string;
};

export const members: Member[] = [
  {
    name: "Davit Nersesyan",
    role: "Lead Guitar",
    image: "/gallery/dav1.jpg",
    blurb:
      "Melodic lead work, aggressive riffing and the guitar voice at the center of the band's sound.",
    signature: "Lead guitars and melody",
  },
  {
    name: "Sabari Diakite",
    role: "Drums / Backing Vocals",
    blurb:
      "Power, precision and the rhythmic engine behind the band's live impact.",
    signature: "Power and precision",
    image: "/band/sabari-about.jpg",
  },
  {
    name: "Valentin Coutant",
    role: "Bass / Backing Vocals",
    image: "/gallery/val1.jpg",
    blurb:
      "Low-end pressure and stage presence in the current line-up.",
    signature: "Low-end pressure",
  },
  {
    name: "Kevin Estrada",
    role: "Rhythm Guitar / Backing Vocals",
    image: "/gallery/kev1.jpg",
    blurb:
      "Tight rhythm foundations and the weight that keeps the songs moving forward.",
    signature: "Rhythm foundation",
  },
  {
    name: "Krys Bader",
    role: "Lead Vocals",
    blurb:
      "Frontline vocals and live intensity for the current era of the band.",
    signature: "Frontline intensity",
    image: "/band/krys-about.jpg",
  },
];

export const highlightCards = [
  {
    title: "Sound",
    body: "Melodic death metal, metalcore tension and technical edge, built around aggressive riffs and atmospheric melody.",
  },
  {
    title: "Record",
    body: "Sent To Die was released on December 1, 2023 and recorded at Project Zero Studio.",
  },
  {
    title: "Live",
    body: "Belgian stage experience, independent festivals and a set shaped around pressure, movement and release.",
  },
];

export const fanRefs = [
  "Melodic death metal",
  "Metalcore tension",
  "Technical edge",
  "Atmospheric melodies",
  "Live catharsis",
];

export const storyFacts = [
  {
    label: "Formed",
    value: "2018",
  },
  {
    label: "Base",
    value: "Brussels, Belgium",
  },
  {
    label: "Release",
    value: "Sent To Die",
  },
];

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
