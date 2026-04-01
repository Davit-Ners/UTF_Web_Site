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
    posterUrl: "/concerts/utf-arlon/poster.jpg",
    priceLabel: "20 EUR",
    showTime: "19:30",
    ticketUrl: "https://shop.utick.net/?module=CATALOGUE",
    title: "Black Mirrors + Tremplin Durbuy Rock Festival - L'Entrepot, Arlon",
    gallery: ["/gallery/band1.jpg", "/gallery/band2.jpg", "/gallery/bandall.jpg"],
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
    ticketUrl: "https://tickets.example.com/utf-bxl",
  },
  {
    slug: "utf-poissonerie",
    date: "2026-02-28",
    city: "Brussels",
    venueName: "La Poissonerie",
    ticketUrl: "https://tickets.example.com/utf-bxl",
    title: "Survival Fest",
  },
  {
    slug: "utf-mjChezZelle",
    date: "2026-03-20",
    city: "Louvain-la-Neuve",
    venueName: "Mj Chez Zelle",
    ticketUrl: "https://tickets.example.com/utf-bxl",
    title: "Eristic Fest",
  },
  {
    slug: "utf-mcp-2026",
    date: "2026-04-01",
    city: "Fontaine-l'Eveque",
    venueName: "MCP Apache",
    ticketUrl: "https://tickets.example.com/utf-bxl",
  },
];
