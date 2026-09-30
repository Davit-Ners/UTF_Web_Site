export type ConcertSeedRecord = {
  slug: string;
  date: string;
  city: string;
  venueName: string;
  note?: string;
  ticketUrl?: string;
  title?: string;
  posterUrl?: string;
  lineup?: string[];
  doorsTime?: string;
  showTime?: string;
  priceLabel?: string;
  facebookEventUrl?: string;
  gallery?: string[];
  featured?: boolean;
};

export const concertSeedData: ConcertSeedRecord[] = [
  {
    slug: "utf-arlon",
    date: "2025-11-01",
    city: "Arlon",
    venueName: "L'Entrepot",
    note: "Tremplin Durbuy Rock Fest",
    doorsTime: "18:00",
    facebookEventUrl: "https://www.facebook.com/events/1247092823614827?locale=fr_FR",
    lineup: ["Black Mirrors", "Kanzan", "Demassify", "Atum Nophi"],
    posterUrl: "/optimized/concerts/utf-arlon/poster.webp",
    priceLabel: "20 EUR",
    showTime: "19:30",
    ticketUrl: "https://shop.utick.net/?module=CATALOGUE",
    title: "Black Mirrors + Tremplin Durbuy Rock Festival - L'Entrepot, Arlon",
    gallery: [
      "/optimized/gallery/band1.webp",
      "/optimized/gallery/band2.webp",
      "/optimized/gallery/bandall.webp",
    ],
    featured: true,
  },
  {
    slug: "utf-anvinium",
    date: "2025-05-03",
    city: "Frasnes-lez-Avaing",
    venueName: "Anvinium Metal Fest",
  },
  {
    slug: "utf-mcp",
    date: "2024-04-04",
    city: "Fontaine-l'Eveque",
    venueName: "MCP Apache",
  },
  {
    slug: "utf-monkey",
    date: "2024-04-13",
    city: "Mons",
    venueName: "Monkey's Cafe",
  },
  {
    slug: "utf-rock-2024",
    date: "2024-08-22",
    city: "Bruxelles",
    venueName: "Rock Classic",
  },
  {
    slug: "utf-witte-non",
    date: "2024-10-05",
    city: "Hasselt",
    venueName: "Cafe Nocturna - De Witte Non",
  },
  {
    slug: "utf-namur",
    date: "2024-11-16",
    city: "Namur",
    venueName: "Belvedere",
    note: "Tremplin Durbuy Rock Fest",
  },
  {
    slug: "utf-hellCafe",
    date: "2026-02-20",
    city: "Diest",
    venueName: "Hell Diest",
  },
  {
    slug: "utf-poissonerie",
    date: "2026-02-28",
    city: "Brussels",
    venueName: "La Poissonerie",
    title: "Survival Fest",
  },
  {
    slug: "utf-mjChezZelle",
    date: "2026-03-20",
    city: "Louvain-la-Neuve",
    venueName: "Mj Chez Zelle",
    title: "Eristic Fest",
  },
  {
    slug: "utf-mcp-2026",
    date: "2026-04-01",
    city: "Fontaine-l'Eveque",
    venueName: "MCP Apache",
  },
  {
    slug: "tremplin-durbuy-rock-festival-2026",
    date: "2026-10-17",
    city: "Braine-l'Alleud",
    venueName: "Le POP - Centre Culturel de Braine-l'Alleud",
    note:
      "Big final ahead! We're hitting the stage for a chance to earn our spot on the lineup of the 30th Durbuy Rock Festival. We’re counting on you to make as much noise as possible! Didier Super Metal will close the night.",
    ticketUrl: "https://www.durbuyrock.be/tickets/",
    title: "Tremplin Durbuy Rock Festival + Didier Super Metal",
    posterUrl: "/optimized/concerts/utf-braine/utf-braine-optimized.webp",
    lineup: [
      "Until They Fall",
      "Didier Super Metal",
      "Carasidem",
      "Nhope",
      "Q U O D A C",
    ],
    doorsTime: "18:00",
    showTime: "18:00",
    priceLabel: "22 EUR",
    facebookEventUrl: "https://www.facebook.com/events/centre-culturel-de-braine-lalleud/didier-super-metal-tremplin-durbuy-rock-festival/995259216177539/",
    featured: true,
  },
];
