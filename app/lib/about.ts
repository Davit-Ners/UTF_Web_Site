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
      "Modern riffs, melodic and technical lead work and crazy guitar solos.",
    signature: "Leads, hooks and atmosphere",
  },
  {
    name: "Sabari Diakite",
    role: "Drums",
    blurb:
      "Precision, double-kick control and the kind of drumming that keeps the whole set sharp live.",
    signature: "Power and control",
    image: "/band/sabari-about.jpg"
  },
  {
    name: "Valentin Coutant",
    role: "Bass",
    image: "/gallery/val1.jpg",
    blurb: "Massive low-end, locked groove and the weight that keeps the songs grounded.",
    signature: "Low-end pressure",
  },
  {
    name: "Kevin Etsrada",
    role: "Rhythm Guitar",
    image: "/gallery/kev1.jpg",
    blurb:
      "Tight rhythm foundations, dense guitar layers and the drive that keeps the set heavy.",
    signature: "Rhythm backbone",
  },
  {
    name: "Krys Bader",
    role: "Vocals",
    blurb:
      "Front-facing energy, screams, hooks and the voice that gives the songs their edge on stage.",
    signature: "Frontline intensity",
    image: "/band/krys-about.jpg"
  },
];

export const highlightCards = [
  {
    title: "Sound",
    body: "Modern melodic death and metalcore tension, built on sharp guitars, hooks and atmosphere.",
  },
  {
    title: "Base",
    body: "Rooted in Brussels and active on the Belgian scene, with a live set ready to travel.",
  },
  {
    title: "Live rig",
    body: "Fast changeover, in-ears and tracks ready for clubs, support slots and festival stages.",
  },
];

export const fanRefs = [
  "Melodic death",
  "Metalcore edge",
  "Big choruses",
  "Dark atmosphere",
  "Festival-ready sets",
];

export const storyFacts = [
  {
    label: "Base",
    value: "Brussels, Belgium",
  },
  {
    label: "Format",
    value: "5-piece line-up",
  },
  {
    label: "Focus",
    value: "Live impact first",
  },
];

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};
