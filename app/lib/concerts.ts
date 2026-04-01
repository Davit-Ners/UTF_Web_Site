export type Concert = {
    id: string;
    date: string;
    city: string;
    venue: string;
    note?: string;
    ticketUrl?: string;
    title?: string;
    posterUrl?: string;
    lineup?: string[];
    doorsTime?: string;
    showTime?: string;
    price?: string;
    facebookEventUrl?: string;
    gallery?: string[];
};
    
export const concerts: Concert[] = [
    { 
        id:"utf-arlon", date:"2025-11-01", city:"Arlon, BE", venue:"L’Entrepôt", note: "Tremplin Durbuy Rock Fest",
        doorsTime: "18:00", facebookEventUrl: "https://www.facebook.com/events/1247092823614827?locale=fr_FR",
        lineup: ["Black Mirrors", "Kanzan", "Demassify", "Atum Nophi"], posterUrl: "/concerts/utf-arlon/poster.jpg",
        price: "20€", showTime: "19:30", ticketUrl: "https://shop.utick.net/?module=CATALOGUE", title: "Black Mirrors + Tremplin Durbuy Rock Festival - L'Entrepôt, Arlon", gallery: ["/concerts/utf-arlon/poster.jpg", "/gallery/band1.jpg", "/gallery/band2.jpg", "/gallery/bandall.jpg"]
    },

    { id:"utf-anvinium", date:"2025-05-03", city:"Frasnes-Lez-Avaing, BE", venue:"Anvinium Metal Fest" },
    
    { id:"utf-mcp", date:"2024-04-04", city:"Fontaine-L'Évêque, BE", venue:"MCP Apache" },
    
    { id:"utf-monkey", date:"2024-04-13", city:"Mons, BE", venue:"Monkey's Café" },
    
    { id:"utf-rock-2024", date:"2024-08-22", city:"Bruxelles, BE", venue:"Rock Classic" },
    
    { id:"utf-witte-non", date:"2024-10-05", city:"Hasselt, BE", venue:"Café Nocturna - De Witte Non" },
    
    { id:"utf-namur", date:"2024-11-16", city:"Namur, BE", venue:"Belvédère", note: "Tremplin Durbuy Rock Fest" },
    
    { id:"utf-hellCafe", date:"2026-02-20", city:"Diest, BE", venue:"Hell Diest", ticketUrl:"https://tickets.example.com/utf-bxl" },

    { id:"utf-poissonerie", date:"2026-02-28", city:"Brussels, BE", venue:"La Poissonerie", ticketUrl:"https://tickets.example.com/utf-bxl", title: "Survival Fest" },

    { id:"utf-mjChezZelle", date:"2026-03-20", city:"Louvain-La-Neuve, BE", venue:"Mj Chez Zelle", ticketUrl:"https://tickets.example.com/utf-bxl", title: "Eristic Fest" },
    
    { id:"utf-mcp-2026", date:"2026-04-01", city:"Fontaine-L'Évêque, BE", venue:"MCP Apache", ticketUrl:"https://tickets.example.com/utf-bxl" },
];

export function getConcertById(id: string): Concert | undefined {
    return concerts.find((c) => c.id === id);
};

export function isPastConcert(concert: Concert): boolean {
    if (!concert?.date) return false;
    
    const concertDate = new Date(concert.date + "T00:00:00");
    const today = new Date();
    
    today.setHours(0, 0, 0, 0);

    return concertDate < today;
};
